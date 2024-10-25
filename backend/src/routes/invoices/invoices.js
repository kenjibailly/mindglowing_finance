const express = require('express');
const router = express.Router();
const Invoice = require('../../models/invoice');
const User = require('../../models/user');
const authenticateToken = require('../security/authenticate');
const formatDate = require('../formatters/date_formatter');
const Customization = require('../../models/customization');

/* GET /invoices page. */
router.get('/', authenticateToken, async function(req, res, next) {
  // Get the session user that's logged in
  const user = req.session.user;
  // If the user is logged in
  if(!user) {
      // Render the login page
      return res.redirect('/login');
  }

  const { page = 1 } = req.query;
  try {
    // Use the find method to get the user settings
    const user_settings = await User.findOne({ username: user.username });
    // Use the find method to get the customization settings
    const customization_settings = await Customization.findOne();

    // Calculate the number of items to skip based on the page
    const skip = (page - 1) * customization_settings.items_per_page;

    const updatedInvoicesWithCustomerInfo = await Invoice.aggregate([
      // Convert customer_id to ObjectId if stored as a string
      {
        $addFields: {
          customer_id: { $toObjectId: "$customer_id" } // Only if customer_id is stored as a string
        }
      },
      // Join with Customer collection to get customer details
      {
        $lookup: {
          from: "customers",
          localField: "customer_id",
          foreignField: "_id",
          as: "customer_details"
        }
      },
      {
        $unwind: {
          path: "$customer_details",
          preserveNullAndEmptyArrays: true // Keeps the invoice even if no customer is found
        }
      },
      // Add a new field customer_name based on personal_information from the customer_details
      {
        $addFields: {
          customer_name: {
            $cond: {
              if: { $or: [{ $eq: ["$customer_details.personal_information.company", ""] }, { $eq: ["$customer_details.personal_information.company", null] }] },
              then: { $concat: ["$customer_details.personal_information.first_name", " ", "$customer_details.personal_information.last_name"] },
              else: "$customer_details.personal_information.company"
            }
          }
        }
      },
      // Sort by the specified field, and add _id as a secondary sort key
      {
        $sort: {
          created_on: -1, // Descendng order by created_on
          _id: 1 // Always sort by _id as the secondary key to ensure stable sorting
          }
      },
      // Apply pagination after sorting
      { $skip: skip },
      { $limit: customization_settings.items_per_page }
    ]);

    updatedInvoicesWithCustomerInfo.forEach(invoice => {
      logger.warn(invoice.customer_name);
    });

    // Count the total number of invoices
    const totalInvoices = await Invoice.countDocuments();

    // Calculate total pages
    const totalPages = Math.ceil(totalInvoices / customization_settings.items_per_page);

    // Format the invoice dates before returning
    const updatedInvoices = updatedInvoicesWithCustomerInfo.map(invoice => ({
      ...invoice,
      created_on: formatDate(invoice.created_on, user_settings),
      due_date: formatDate(invoice.due_date, user_settings),
      user: user_settings,
      customization_settings: customization_settings,
    }));

    // Render the invoices page
    return res.render('invoices/invoices', { 
      user: user_settings, 
      customization_settings: customization_settings,
      invoices: updatedInvoices,
      currentPage: parseInt(page),
      totalPages: totalPages,
      access_token_expiry: process.env.ACCESS_TOKEN_EXPIRY_IN_SECONDS, 
      site_title: 'Invoices',
    });
  } catch (error) {
    logger.error(error);

    // Render the invoices page
    return res.render('invoices/invoices', { 
      access_token_expiry: process.env.ACCESS_TOKEN_EXPIRY_IN_SECONDS, 
      site_title: 'Invoices',
      error: error,
    });
  }

});

router.get('/sort', authenticateToken, async function(req, res, next) {
  // Get the session user that's logged in
  const user = req.session.user;
  // If the user is logged in
  if(!user) {
      // Render the login page
      return res.redirect('/login');
  }

  const { sort_by = 'created_on', sort_order = 'asc', reload = true, page = 1 } = req.query;

  const sortDirection = sort_order === 'asc' ? 1 : -1;
  const sortOptions = {};
  sortOptions[sort_by] = sortDirection;

  try {
    // Use the find method to get the customization settings
    const customization_settings = await Customization.findOne();

    // Format the invoices as necessary (similar to your existing logic)
    const user_settings = await User.findOne({ username: req.session.user.username });

    // Calculate the number of items to skip based on the page
    const skip = (page - 1) * customization_settings.items_per_page;

    const updatedInvoicesWithCustomerInfo = await Invoice.aggregate([
      // Convert customer_id to ObjectId if stored as a string
      {
        $addFields: {
          customer_id: { $toObjectId: "$customer_id" } // Only if customer_id is stored as a string
        }
      },
      // Join with Customer collection to get customer details
      {
        $lookup: {
          from: "customers",
          localField: "customer_id",
          foreignField: "_id",
          as: "customer_details"
        }
      },
      {
        $unwind: {
          path: "$customer_details",
          preserveNullAndEmptyArrays: true // Keeps the invoice even if no customer is found
        }
      },
      // Add a new field customer_name based on personal_information from the customer_details
      {
        $addFields: {
          customer_name: {
            $cond: {
              if: { $or: [{ $eq: ["$customer_details.personal_information.company", ""] }, { $eq: ["$customer_details.personal_information.company", null] }] },
              then: { $concat: ["$customer_details.personal_information.first_name", " ", "$customer_details.personal_information.last_name"] },
              else: "$customer_details.personal_information.company"
            }
          }
        }
      },
      // Sort by the specified field, and add _id as a secondary sort key
      {
        $sort: {
          [sort_by]: sort_order === 'asc' ? 1 : -1, // Sort dynamically based on the field selected
          _id: 1 // Always sort by _id as the secondary key to ensure stable sorting
        }
      },
      // Apply pagination after sorting
      { $skip: skip },
      { $limit: customization_settings.items_per_page }
    ]);

    // Count the total number of invoices
    const totalInvoices = await Invoice.countDocuments();

    // Calculate total pages
    const totalPages = Math.ceil(totalInvoices / customization_settings.items_per_page);

    // Format the invoice dates before returning
    const updatedInvoices = updatedInvoicesWithCustomerInfo.map(invoice => ({
      ...invoice,
      created_on: formatDate(invoice.created_on, user_settings),
      due_date: formatDate(invoice.due_date, user_settings),
      user: user_settings,
      customization_settings: customization_settings,
    }));

    if (reload === 'true') {  

      const link_options = `?sort_by=${sort_by}&sort_order=${sort_order}&reload=true`;

      // Render the invoices page
      return res.render('invoices/invoices', { 
        user: user_settings, 
        customization_settings: customization_settings,
        invoices: updatedInvoices,
        currentPage: page,
        totalPages: totalPages,
        link_options: link_options,
        access_token_expiry: process.env.ACCESS_TOKEN_EXPIRY_IN_SECONDS, 
        site_title: 'Invoices',
      });
    } else {

      // Send the sorted invoices and pagination info back as JSON
      res.json({ data: updatedInvoices, totalPages, currentPage: parseInt(page) });

    }
  } catch (error) {
    logger.error(error);
    if (reload === 'true') {  
      // Render the invoices page
      return res.render('invoices/invoices', { 
        access_token_expiry: process.env.ACCESS_TOKEN_EXPIRY_IN_SECONDS, 
        site_title: 'Invoices',
        error: error,
      });
    } else {

      res.json({error: "error"})

    }
  }

});


module.exports = router;
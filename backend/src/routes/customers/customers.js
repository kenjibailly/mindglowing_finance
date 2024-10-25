const express = require('express');
const router = express.Router();
const Customer = require('../../models/customer');
const User = require('../../models/user');
const Customization = require('../../models/customization');
const authenticateToken = require('../security/authenticate');
const formatDate = require('../formatters/date_formatter');

/* GET /customers page. */
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

    const customers = await Customer.aggregate([
      // Lookup invoices associated with each customer
      {
        $lookup: {
          from: "invoices", // Name of the invoices collection
          let: { customerId: "$_id" }, // Reference _id of customer
          pipeline: [
            {
              $match: {
                $expr: { $eq: [{ $toObjectId: "$customer_id" }, "$$customerId"] } // Cast customer_id in invoices to ObjectId
              }
            }
          ],
          as: "invoices_details" // Name of the field to store the invoices data
        }
      },
      // Add a new field customer_name based on personal_information from the customer
      {
        $addFields: {
          customer_name: {
            $cond: {
              if: {
                $or: [
                  { $eq: ["$personal_information.company", ""] },
                  { $eq: ["$personal_information.company", null] }
                ]
              },
              then: {
                $concat: [
                  "$personal_information.first_name",
                  " ",
                  "$personal_information.last_name"
                ]
              },
              else: "$personal_information.company"
            }
          }
        }
      },
      // Add a field amount_due that sums all invoices for the customer and rounds to 2 decimal places
      {
        $addFields: {
          amount_due: {
            $round: [
              {
                $sum: {
                  $map: {
                    input: "$invoices_details", // Array of invoices
                    as: "invoice",
                    in: { $ifNull: ["$$invoice.amount_due", 0] } // Handle cases where amount_due might be null
                  }
                }
              },
              2 // Round to 2 decimal places
            ]
          }
        }
      },
      // Sort by the specified field, and add _id as a secondary sort key
      {
        $sort: {
          created_on: -1, // Descending order by created_on
          _id: 1 // Always sort by _id as the secondary key to ensure stable sorting
        }
      },
      // Apply pagination after sorting
      { $skip: skip },
      { $limit: customization_settings.items_per_page }
    ]);

    // Count the total number of invoices for pagination
    const totalCustomers = await Customer.countDocuments();

    // Calculate total pages
    const totalPages = Math.ceil(totalCustomers / customization_settings.items_per_page);

    const updatedCustomers = customers.map((customer) => {
      return {
        ...customer,
        created_on: formatDate(customer.created_on, user_settings), // Change the locale based on your requirements
      };
    });

    // Render the customers page
    return res.render('customers/customers', { 
      user: user_settings, 
      customers: updatedCustomers, 
      currentPage: parseInt(page),
      totalPages: totalPages,
      access_token_expiry: process.env.ACCESS_TOKEN_EXPIRY_IN_SECONDS,
      site_title: 'Customers',
    });
  } catch (error) {
    logger.error(error);

    // Render the customers page
    return res.render('customers/customers', { 
      error: error, 
      access_token_expiry: process.env.ACCESS_TOKEN_EXPIRY_IN_SECONDS,
      site_title: 'Customers',
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
    // Use the find method to get the user settings
    const user_settings = await User.findOne({ username: user.username });

    // Use the find method to get the customization settings
    const customization_settings = await Customization.findOne();

    // Calculate the number of items to skip based on the page
    const skip = (page - 1) * customization_settings.items_per_page;

    // Count the total number of invoices for pagination
    const totalCustomers = await Customer.countDocuments();

    // Calculate total pages
    const totalPages = Math.ceil(totalCustomers / customization_settings.items_per_page);

    const customers = await Customer.aggregate([
      // Lookup invoices associated with each customer
      {
        $lookup: {
          from: "invoices", // Name of the invoices collection
          let: { customerId: "$_id" }, // Reference _id of customer
          pipeline: [
            {
              $match: {
                $expr: { $eq: [{ $toObjectId: "$customer_id" }, "$$customerId"] } // Cast customer_id in invoices to ObjectId
              }
            }
          ],
          as: "invoices_details" // Name of the field to store the invoices data
        }
      },
      // Add a new field customer_name based on personal_information from the customer
      {
          $addFields: {
              customer_name: {
                  $cond: {
                      if: {
                          $or: [
                              { $eq: ["$personal_information.company", ""] },
                              { $eq: ["$personal_information.company", null] }
                          ]
                      },
                      then: {
                          $concat: [
                              "$personal_information.first_name",
                              " ",
                              "$personal_information.last_name"
                          ]
                      },
                      else: "$personal_information.company"
                  }
              }
          }
      },
      // Add a field amount_due that sums all invoices for the customer
      {
        $addFields: {
          amount_due: {
            $round: [
              {
                $sum: {
                  $map: {
                    input: "$invoices_details", // Array of invoices
                    as: "invoice",
                    in: { $ifNull: ["$$invoice.amount_due", 0] } // Handle cases where amount_due might be null
                  }
                }
              },
              2 // Round to 2 decimal places
            ]
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


    
    // Loop through the customers array and update the format of the created_on field
    const updatedCustomers = customers.map((customer) => {
      return {
        ...customer,
        created_on: formatDate(customer.created_on, user_settings), // Change the locale based on your requirements
        user: user_settings
      };
    });

    if (reload === 'true') {  
      // Render the customers page
      return res.render('customers/customers', { 
        user: user_settings, 
        customers: updatedCustomers, 
        currentPage: parseInt(page),
        totalPages: totalPages,
        access_token_expiry: process.env.ACCESS_TOKEN_EXPIRY_IN_SECONDS,
        site_title: 'Customers',
      });
    } else {  

      // Send the sorted invoices and pagination info back as JSON
      return res.json({ data: updatedCustomers, totalPages, currentPage: parseInt(page), user_settings: user_settings });
    }
  } catch (error) {
    logger.error(error);
    if (reload === 'true') {  
      // Render the customers page
      return res.render('customers/customers', { 
        user: user_settings, 
        customers: updatedCustomers, 
        currentPage: parseInt(page),
        totalPages: totalPages,
        access_token_expiry: process.env.ACCESS_TOKEN_EXPIRY_IN_SECONDS,
        site_title: 'Customers',
      });
    } else {  
      // Send the sorted invoices and pagination info back as JSON
      return res.json({ data: updatedCustomers, totalPages, currentPage: parseInt(page), user_settings: user_settings });
    }
  }

});

module.exports = router;
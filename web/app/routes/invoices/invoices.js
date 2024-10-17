const express = require('express');
const router = express.Router();
const Invoice = require('../../models/invoice');
const User = require('../../models/user');
const Customer = require('../../models/customer');
const authenticateToken = require('../security/authenticate');
const formatDate = require('../formatters/date_formatter');
const Customization = require('../../models/customization');
const paginateArray = require('../pagination/pagination');

/* GET /invoices page. */
router.get('/', authenticateToken, async function(req, res, next) {
  // Get the session user that's logged in
  const user = req.session.user;
  // If the user is logged in
    if(!user) {
        // Render the login page
        return res.redirect('/login');
    }

    const { page = 1, sort_by = 'created_on', sort_order = 'asc' } = req.query;
    // Determine sort order (-1 for descending, 1 for ascending)
    const sortDirection = sort_order === 'asc' ? 1 : -1;
        
    // Create a dynamic sort object
    const sortOptions = {};
    sortOptions[sort_by] = sortDirection;

    // Use the find method to get all invoices
    const invoices = await Invoice.find().lean().sort(sortOptions);
    // Use the find method to get the user settings
    const user_settings = await User.findOne({ username: user.username });
    // Use the find method to get the customization settings
    const customization_settings = await Customization.findOne();
    // Loop through the invoices array and update the format of the created_on field
    const updatedInvoices = invoices.map((invoice) => {
      return {
        ...invoice,
        created_on: formatDate(invoice.created_on, user_settings), // Change the locale based on your requirements
        due_date: formatDate(invoice.due_date, user_settings),
      };
    });


    const updatedInvoicesWithCustomerInfo = await Promise.all(updatedInvoices.map(async (invoice) => {
      const customer_details = await Customer.findOne({ _id: invoice.customer_id });
    
      if (customer_details) {
        // Add customer information to the invoice
        if (customer_details.personal_information.company) {
          invoice.name = customer_details.personal_information.company;
        } else {
          invoice.name = customer_details.personal_information.first_name + " " + customer_details.personal_information.last_name;
        }
      }
    
      return invoice;
    }));

    // Pagination
    const { pageItems, currentPage, totalPages } = paginateArray(updatedInvoicesWithCustomerInfo, customization_settings.items_per_page, parseInt(req.query.page) || 1, true);

    // Render the invoices page
    return res.render('invoices/invoices', { 
      user: user_settings, 
      customization_settings: customization_settings,
      invoices: pageItems,
      currentPage: currentPage,
      totalPages: totalPages,
      access_token_expiry: process.env.ACCESS_TOKEN_EXPIRY_IN_SECONDS, 
      site_title: 'Invoices',
    });

});

router.get('/sort', authenticateToken, async function(req, res, next) {
  // Get the session user that's logged in
  const user = req.session.user;
  // If the user is logged in
  if(!user) {
      // Render the login page
      return res.redirect('/login');
  }

  const { sort_by = 'created_on', sort_order = 'asc', reload = true } = req.query;
  let { page = 1 } = req.query;

  const sortDirection = sort_order === 'asc' ? 1 : -1;
  const sortOptions = {};
  sortOptions[sort_by] = sortDirection;

  // Use the find method to get the customization settings
  const customization_settings = await Customization.findOne();

  // Format the invoices as necessary (similar to your existing logic)
  const user_settings = await User.findOne({ username: req.session.user.username });

  if (reload === 'true') {  
    // Fetch the invoices from the database with pagination
    const invoices = await Invoice.find()
      .lean()
      .sort(sortOptions);
      
    const updatedInvoices = invoices.map((invoice) => {
      return {
        ...invoice,
        created_on: formatDate(invoice.created_on, user_settings), // Change the locale based on your requirements
        due_date: formatDate(invoice.due_date, user_settings),
      };
    });

    const updatedInvoicesWithCustomerInfo = await Promise.all(updatedInvoices.map(async (invoice) => {
      const customer_details = await Customer.findOne({ _id: invoice.customer_id });
    
      if (customer_details) {
        // Add customer information to the invoice
        if (customer_details.personal_information.company) {
          invoice.name = customer_details.personal_information.company;
        } else {
          invoice.name = customer_details.personal_information.first_name + " " + customer_details.personal_information.last_name;
        }
      }
    
      return invoice;
    }));

    const link_options = `?sort_by=${sort_by}&sort_order=${sort_order}&reload=true`;

    // Pagination
    const { pageItems, currentPage, totalPages } = paginateArray(updatedInvoicesWithCustomerInfo, customization_settings.items_per_page, parseInt(req.query.page) || 1, false);

    // Render the invoices page
    return res.render('invoices/invoices', { 
      user: user_settings, 
      customization_settings: customization_settings,
      invoices: pageItems,
      currentPage: currentPage,
      totalPages: totalPages,
      link_options: link_options,
      access_token_expiry: process.env.ACCESS_TOKEN_EXPIRY_IN_SECONDS, 
      site_title: 'Invoices',
    });
  } else {
    // Calculate the number of items to skip based on the page
    const skip = (page - 1) * customization_settings.items_per_page;

    // Fetch the invoices from the database with pagination
    const invoices = await Invoice.find()
      .lean()
      .sort(sortOptions)
      .skip(skip) // Skip invoices based on the current page
      .limit(customization_settings.items_per_page); // Limit to the number of items per page

    // Count the total number of invoices for pagination
    const totalInvoices = await Invoice.countDocuments();
    
    // Calculate total pages
    const totalPages = Math.ceil(totalInvoices / customization_settings.items_per_page);

    const updatedInvoices = invoices.map(invoice => ({
      ...invoice,
      created_on: formatDate(invoice.created_on, user_settings),
      due_date: formatDate(invoice.due_date, user_settings),
      user: user_settings, 
      customization_settings: customization_settings,
    }));

    const updatedInvoicesWithCustomerInfo = await Promise.all(updatedInvoices.map(async (invoice) => {
      const customer_details = await Customer.findOne({ _id: invoice.customer_id });
    
      if (customer_details) {
        // Add customer information to the invoice
        if (customer_details.personal_information.company) {
          invoice.name = customer_details.personal_information.company;
        } else {
          invoice.name = customer_details.personal_information.first_name + " " + customer_details.personal_information.last_name;
        }
      }
    
      return invoice;
    }));
    // Send the sorted invoices and pagination info back as JSON
    res.json({ data: updatedInvoicesWithCustomerInfo, totalPages, currentPage: parseInt(page) });
  }
});


module.exports = router;
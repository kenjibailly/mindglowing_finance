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
    
    // Use the find method to get all invoices
    const invoices = await Invoice.find().lean();
    // Use the find method to get the user settings
    const user_settings = await User.findOne({ username: user.username });
    // Use the find method to get the customization settings
    const customization_settings = await Customization.findOne();
    // Loop through the invoices array and update the format of the created_on field
    const updatedInvoices = invoices.map((invoice) => {
      return {
        ...invoice,
        created_on: formatDate(invoice.created_on, user_settings), // Change the locale based on your requirements
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


module.exports = router;
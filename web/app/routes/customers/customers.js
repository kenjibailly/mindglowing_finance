const express = require('express');
const router = express.Router();
const Customer = require('../../models/customer');
const User = require('../../models/user');
const Customization = require('../../models/customization');
const authenticateToken = require('../security/authenticate');
const formatDate = require('../formatters/date_formatter');
const paginateArray = require('../pagination/pagination');

/* GET /customers page. */
router.get('/', authenticateToken, async function(req, res, next) {
  // Get the session user that's logged in
  const user = req.session.user;
  // If the user is logged in
    if(!user) {
        // Render the login page
        return res.redirect('/login');
    }
    
    // Use the find method to get all customers
    const customers = await Customer.find().lean();
    // Use the find method to get the user settings
    const user_settings = await User.findOne({ username: user.username });
    // Loop through the customers array and update the format of the created_on field
    const updatedCustomers = customers.map((customer) => {
      return {
        ...customer,
        created_on: formatDate(customer.created_on, user_settings), // Change the locale based on your requirements
      };
    });

    // Use the find method to get the customization settings
    const customization = await Customization.findOne();

    // Pagination
    const { pageItems, currentPage, totalPages } = paginateArray(updatedCustomers, customization.items_per_page, parseInt(req.query.page) || 1);

    // Render the customers page
    return res.render('customers/customers', { 
      user: user_settings, 
      customers: pageItems, 
      currentPage: currentPage,
      totalPages: totalPages,
      access_token_expiry: process.env.ACCESS_TOKEN_EXPIRY_IN_SECONDS,
      site_title: 'Customers',
    });

});

module.exports = router;
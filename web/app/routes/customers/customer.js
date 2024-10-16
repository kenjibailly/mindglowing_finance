const express = require('express');
const router = express.Router();
const Customer = require('../../models/customer');
const User = require('../../models/user');
const authenticateToken = require('../security/authenticate');

// Get the project page by id
router.get('/:id', authenticateToken, async function(req, res, next) {
    // Get the session user that's logged in
    const user = req.session.user;
    // Get the customer ID
    const customer_id = req.params.id;
    // If the user is logged in
      if(!user) {
          // Render the login page
          return res.redirect('/login');
      }
      try {
        // Use the find method to get project by id
        const customer = await Customer.findOne({ _id: customer_id });

        // Use the find method to get the user settings
        const user_settings = await User.findOne({ username: user.username });

        // Render the items page
        res.render('customers/customer', { 
          user: user_settings, 
          customer: customer, 
          access_token_expiry: process.env.ACCESS_TOKEN_EXPIRY_IN_SECONDS, 
          user_settings: user_settings, 
          site_title: 'Customer',
        });
      } catch (error) {
        logger.error(error);
        res.render('customers/customers', { username: user.username, access_token_expiry: process.env.ACCESS_TOKEN_EXPIRY_IN_SECONDS});
    }
  });

module.exports = router;
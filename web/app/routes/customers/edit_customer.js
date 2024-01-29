const express = require('express');
const router = express.Router();
const Customer = require('../../models/customer');
const User = require('../../models/user');
const authenticateToken = require('../security/authenticate');

// Get the customer page by id
router.get('/:id', authenticateToken, async function(req, res, next) {
    // Get the session user that's logged in
    const user = req.session.user;
    // If the user is logged in
      if(!user) {
          // Render the login page
          return res.redirect('/login');
      }
      // Use the find method to get the user settings
      const user_settings = await User.findOne({ username: user.username });
      
      try {
        // Use the find method to get all customers
        const customer = await Customer.findById(req.params.id);
        console.log(customer)
        // Check if success is true in the url
        const success = req.query.success;
        // Render the customers page
        return res.render('customers/edit_customer', { 
          user: user_settings, 
          customer: customer, 
          access_token_expiry: process.env.ACCESS_TOKEN_EXPIRY_IN_SECONDS, 
          success: success,
          site_title: 'Edit Customer',
        });
      } catch (error) {
        console.error(error);
        return res.render('customers/customers', { 
          user: user_settings, 
          access_token_expiry: process.env.ACCESS_TOKEN_EXPIRY_IN_SECONDS
        });
    }
  });
  
  
  // Handle the update request
  router.post('/:id', authenticateToken, async (req, res) => {
    try {
        const customerId = req.params.id;
        const updatedCustomer = req.body; // Assuming req.body contains the updated customer details
        // Perform any validation or additional processing as needed
  
        const currency = updatedCustomer['personal_information.currency'];
        const currency_name = currency.split(' ')[0];
        const currency_symbol = currency.split(' ')[1].replace(/[()]/g, '');;
  
        // Add currency information to the updatedCustomer object
        updatedCustomer['personal_information.currency_name'] = currency_name;
        updatedCustomer['personal_information.currency_symbol'] = currency_symbol;

        console.log(updatedCustomer);
  
        // Update the customer in the database
        const result = await Customer.findByIdAndUpdate(customerId, updatedCustomer, { new: true });
  
        if (!result) {
            return res.status(404).send('Customer not found');
        }
  
      // Get the customer
      const customer = await Customer.findById(req.params.id);
      // Render the customer again with a success message
      return res.redirect('/customers/customer/'+ customer.id + '?success=true');
    } catch (error) {
        console.error(error);
        return res.status(500).send('Internal Server Error');
    }
  });
  
  module.exports = router;
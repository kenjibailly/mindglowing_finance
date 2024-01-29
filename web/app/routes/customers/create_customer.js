const express = require('express');
const router = express.Router();
const Customer = require('../../models/customer');
const User = require('../../models/user');
const authenticateToken = require('../security/authenticate');


/* GET /customers/create-customer page. */
router.get('/', authenticateToken, async function(req, res, next) {
  // Get the session user that's logged in
  const user = req.session.user;
  // If the user is logged in
    if(!user) {
        // Render the login page
        return res.redirect('/login');
    }
    // Use the find method to get the user settings
    const user_settings = await User.findOne({ username: user.username });
    
    // Render the create customers page
    res.render('customers/create_customer', { 
      user: user_settings, 
      access_token_expiry: process.env.ACCESS_TOKEN_EXPIRY_IN_SECONDS,
      site_title: 'Create Customer',
    });

});

// Handle the POST request to add a customer
router.post('/', authenticateToken, async (req, res) => {
    // Extract form data from the request
    const {
      'personal_information.first_name': first_name,
      'personal_information.last_name': last_name,
      'personal_information.email': email,
      'personal_information.company': company,
      'personal_information.currency': currency,
      'billing_details.street': billing_street,
      'billing_details.street2': billing_street2,
      'billing_details.city': billing_city,
      'billing_details.state': billing_state,
      'billing_details.zip': billing_zip,
      'billing_details.country': billing_country,
      'shipping_details.street': shipping_street,
      'shipping_details.street2': shipping_street2,
      'shipping_details.city': shipping_city,
      'shipping_details.state': shipping_state,
      'shipping_details.zip': shipping_zip,
      'shipping_details.country': shipping_country,
      'contact_information.preferred_contact_medium': preferred_contact_medium,
      'contact_information.preferred_contact_medium.other_option_response': other_option_response,
      'contact_information.contact_medium_username': contact_medium_username,
    } = req.body;

    console.log(billing_street)
  
    // Check if billing details are empty, if so, use shipping details
    const shippingInfo = isEmptyShippinggDetails(req.body) ? {
      street: billing_street,
      street2: billing_street2,
      city: billing_city,
      state: billing_state,
      zip: billing_zip,
      country: billing_country,
    } : {
      street: shipping_street,
      street2: shipping_street2,
      city: shipping_city,
      state: shipping_state,
      zip: shipping_zip,
      country: shipping_country,
    };

    const currency_name = currency.split(' ')[0];
    const currency_symbol = currency.split(' ')[1].replace(/[()]/g, '');;
  
    // Create a new customer instance with the merged details
    const newCustomer = new Customer({
      personal_information: {
        first_name,
        last_name,
        email,
        company,
        currency_name,
        currency_symbol,
      },
      billing_details: {
        street: billing_street,
        street2: billing_street2,
        city: billing_city,
        state: billing_state,
        zip: billing_zip,
        country: billing_country,
      },
      shipping_details: shippingInfo,
      contact_information: {
        preferred_contact_medium,
        other_option_response: other_option_response,
        contact_medium_username,
      },
    });
  
    try {
      // Save the customer to the database
      const savedCustomer = await newCustomer.save();
      res.redirect('/customers'); // You might want to send a response back
    } catch (error) {
      console.error(error);
    
      // Check if the error is a duplicate key violation
      if (error.code === 11000 && error.keyPattern && error.keyPattern['personal_information.email']) {
        // Duplicate email error
        res.status(400).json({ message: 'Same email cannot be used twice' });
      } else {
        // Other internal server error
        res.status(500).json({ message: 'Internal Server Error' });
      }
    }
  });
  
  // Helper function to check if shipping details are empty
  function isEmptyShippinggDetails(body) {
    const shippingDetailsKeys = [
      'shipping_details.street',
      'shipping_details.street2',
      'shipping_details.city',
      'shipping_details.state',
      'shipping_details.zip',
      'shipping_details.country',
    ];
  
    return shippingDetailsKeys.every(key => !body[key] || body[key] === 'undefined');
  }

module.exports = router;
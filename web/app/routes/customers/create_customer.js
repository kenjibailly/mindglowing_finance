const express = require('express');
const router = express.Router();
const Customer = require('../../models/customer');
const authenticateToken = require('../security/authenticate');


/* GET /customers/create-customer page. */
router.get('/', authenticateToken, function(req, res, next) {
  // Get the session user that's logged in
  const user = req.session.user;
  // If the user is logged in
    if(!user) {
        // Render the login page
        return res.redirect('/login');
    }
    
    // Render the create customers page
    res.render('customers/create_customer', { username: user.username });

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
      'shipping_details.street': shipping_street,
      'shipping_details.street2': shipping_street2,
      'shipping_details.city': shipping_city,
      'shipping_details.state': shipping_state,
      'shipping_details.zip': shipping_zip,
      'shipping_details.country': shipping_country,
      'billing_details.street': billing_street,
      'billing_details.street2': billing_street2,
      'billing_details.city': billing_city,
      'billing_details.state': billing_state,
      'billing_details.zip': billing_zip,
      'billing_details.country': billing_country,
      'contact_information.preferred_contact_medium': preferred_contact_medium,
      'contact_information.preferred_contact_medium.other_option_response': other_option_response,
      'contact_information.contact_medium_username': contact_medium_username,
    } = req.body;
  
    // Check if billing details are empty, if so, use shipping details
    const billingInfo = isEmptyBillingDetails(req.body) ? {
      street: shipping_street,
      street2: shipping_street2,
      city: shipping_city,
      state: shipping_state,
      zip: shipping_zip,
      country: shipping_country,
    } : {
      street: billing_street,
      street2: billing_street2,
      city: billing_city,
      state: billing_state,
      zip: billing_zip,
      country: billing_country,
    };
  
    // Create a new customer instance with the merged details
    const newCustomer = new Customer({
      personal_information: {
        first_name,
        last_name,
        email,
        company,
        currency,        
      },
      shipping_details: {
        street: shipping_street,
        street2: shipping_street2,
        city: shipping_city,
        state: shipping_state,
        zip: shipping_zip,
        country: shipping_country,
      },
      billing_details: billingInfo,
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
  
  // Helper function to check if billing details are empty
  function isEmptyBillingDetails(body) {
    const billingDetailsKeys = [
      'billing_details.street',
      'billing_details.street2',
      'billing_details.city',
      'billing_details.state',
      'billing_details.zip',
      'billing_details.country',
    ];
  
    return billingDetailsKeys.every(key => !body[key] || body[key] === 'undefined');
  }

module.exports = router;
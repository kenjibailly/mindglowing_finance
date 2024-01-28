const express = require('express');
const router = express.Router();
const PaymentMethod = require('../../../models/payment_method');
const User = require('../../../models/user');
const authenticateToken = require('../../security/authenticate');


/* GET /settings/payment-methods/create page. */
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
    
    // Render the create payment method page
    res.render('settings/payment_methods/create_payment_method', { 
        user: user_settings, 
        access_token_expiry: process.env.ACCESS_TOKEN_EXPIRY_IN_SECONDS,
        site_title: 'Create Payment Method',
    });

});

// Handle the POST request to add a payment method
router.post('/', authenticateToken, async (req, res) => {
    // Extract form data from the request
    const { 
        payment_method_name, 
        payment_method_description 
    } = req.body;

    // Create a new payment method instance with the form details
    const newPaymentMethod = new PaymentMethod({
        name: payment_method_name,
        description: payment_method_description,
    });

    try {
        // Save the payment method to the database
        const savedPaymentMethod = await newPaymentMethod.save();
        res.redirect('/settings/payment-methods/');
    } catch (error) {
        console.error(error);

        // Check if the error is a duplicate key violation
        if (error.code === 11000 && error.keyPattern && error.keyPattern['name']) {
            // Duplicate name error
            res.status(400).json({ message: 'Payment Method with the same name already exists' });
        } else {
            // Other internal server error
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }
});


module.exports = router;
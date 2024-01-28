const express = require('express');
const router = express.Router();
const PaymentMethod = require('../../../models/payment_method');
const User = require('../../../models/user');
const authenticateToken = require('../../security/authenticate');

/* GET /settings/payment-methods/ page. */
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

    // Find the payment methods
    const payment_methods = await PaymentMethod.find();
    
    // Render the create payment method page
    res.render('settings/payment_methods/payment_methods', { 
      user: user_settings, 
      access_token_expiry: process.env.ACCESS_TOKEN_EXPIRY_IN_SECONDS, 
      payment_methods: payment_methods,
      site_title: 'Payment Methods',
    });

});


module.exports = router;
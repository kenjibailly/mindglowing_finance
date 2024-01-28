const express = require('express');
const router = express.Router();
const ShippingCompany = require('../../../models/shipping_company');
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

    // Find the shipping companies
    const shipping_companies = await ShippingCompany.find();
    
    // Render the create payment method page
    res.render('settings/shipping_companies/shipping_companies', { 
        user: user_settings, 
        access_token_expiry: process.env.ACCESS_TOKEN_EXPIRY_IN_SECONDS, 
        shipping_companies: shipping_companies,
        site_title: 'Shipping Companies',
    });

});


module.exports = router;
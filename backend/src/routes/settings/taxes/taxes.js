const express = require('express');
const router = express.Router();
const Tax = require('../../../models/tax');
const User = require('../../../models/user');
const authenticateToken = require('../../security/authenticate');

/* GET /settings/taxes/ page. */
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

    // Find the taxes
    const taxes = await Tax.find();
    // Check if success is true in the url
    const success = req.query.success;
    // Render the create payment method page
    res.render('settings/taxes/taxes', { 
      user: user_settings, 
      access_token_expiry: process.env.ACCESS_TOKEN_EXPIRY_IN_SECONDS, 
      taxes: taxes,
      success: success,
      site_title: 'Taxes',
    });

});


module.exports = router;
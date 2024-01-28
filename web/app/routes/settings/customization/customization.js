const express = require('express');
const router = express.Router();
const Customization = require('../../../models/customization');
const User = require('../../../models/user');
const authenticateToken = require('../../security/authenticate');

/* GET /settings/customization/ page. */
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

    // Find the customization settings
    const customization = await Customization.findOne();

    // Check for the presence of the success parameter in the query string
    const success = req.query.success === 'true';
    
    // Render the create payment method page
    res.render('settings/customization/customization', { 
        user: user_settings, 
        access_token_expiry: process.env.ACCESS_TOKEN_EXPIRY_IN_SECONDS,  
        customization: customization, 
        success: success,
        site_title: 'Customization',
    });
});

  // Handle the update request
  router.post('/', authenticateToken, async (req, res) => {
    try {
        const { 
            invoice_prefix, 
            invoice_separator, 
            estimate_prefix, 
            estimate_separator,
            items_per_page,
        } = req.body;
    
        // Update the customization settings in the database
        const query = {}; // Empty query matches all documents
        const update = {
        $set: {
            invoice_prefix: invoice_prefix,
            invoice_separator: invoice_separator,
            estimate_prefix: estimate_prefix,
            estimate_separator: estimate_separator,
            items_per_page: items_per_page,
        },
        };

        const result = await Customization.findOneAndUpdate(query, update, { new: true });

        // Check if the customization object was found and updated
        if (result) {
            console.log('Customization updated:', result);
        } else {
            console.log('Customization not found.');
        }

      return res.redirect('/settings/customization?success=true');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;
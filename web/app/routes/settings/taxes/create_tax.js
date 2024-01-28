const express = require('express');
const router = express.Router();
const Tax = require('../../../models/tax');
const User = require('../../../models/user');
const authenticateToken = require('../../security/authenticate');


/* GET /settings/taxes/create page. */
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
    
    // Render the create tax page
    res.render('settings/taxes/create_tax', { 
        user: user_settings, 
        access_token_expiry: process.env.ACCESS_TOKEN_EXPIRY_IN_SECONDS,
        site_title: 'Create Tax',
    });

});

// Handle the POST request to add a tax
router.post('/', authenticateToken, async (req, res) => {
    // Extract form data from the request
    const { 
        tax_name, 
        tax_percentage, 
        tax_description 
    } = req.body;

    // Create a new tax instance with the form details
    const newTax = new Tax({
        name: tax_name,
        percentage: tax_percentage,
        description: tax_description,
    });

    try {
        // Save the tax to the database
        const savedTax = await newTax.save();
        res.redirect('/settings/taxes/');
    } catch (error) {
        console.error(error);

        // Check if the error is a duplicate key violation
        if (error.code === 11000 && error.keyPattern && error.keyPattern['name']) {
            // Duplicate name error
            res.status(400).json({ message: 'Tax with the same name already exists' });
        } else {
            // Other internal server error
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }
});


module.exports = router;
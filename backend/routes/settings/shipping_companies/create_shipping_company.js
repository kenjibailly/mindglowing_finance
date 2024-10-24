const express = require('express');
const router = express.Router();
const ShippingCompany = require('../../../models/shipping_company');
const User = require('../../../models/user');
const authenticateToken = require('../../security/authenticate');


/* GET /settings/shipping-companies/create page. */
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
    
    // Render the create shipping company page
    res.render('settings/shipping_companies/create_shipping_company', { 
        user: user_settings, 
        access_token_expiry: process.env.ACCESS_TOKEN_EXPIRY_IN_SECONDS,
        site_title: 'Create Shipping Company',
    });

});

// Handle the POST request to add a shipping company
router.post('/', authenticateToken, async (req, res) => {
    // Extract form data from the request
    const { shipping_company_name, shipping_company_description } = req.body;

    // Create a new shipping company instance with the form details
    const newShippingCompany = new ShippingCompany({
        name: shipping_company_name,
        description: shipping_company_description,
    });

    try {
        // Save the shipping company to the database
        const savedShippingCompany = await newShippingCompany.save();
        res.redirect('/settings/shipping-companies/');
    } catch (error) {
        logger.error(error);

        // Check if the error is a duplicate key violation
        if (error.code === 11000 && error.keyPattern && error.keyPattern['name']) {
            // Duplicate name error
            res.status(400).json({ message: 'Shipping company with the same name already exists' });
        } else {
            // Other internal server error
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }
});


module.exports = router;
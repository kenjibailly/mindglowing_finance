const express = require('express');
const router = express.Router();
const Discount = require('../../../models/discount');
const User = require('../../../models/user');
const authenticateToken = require('../../security/authenticate');


/* GET /settings/discounts/create page. */
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
    
    // Render the create discount page
    res.render('settings/discounts/create_discount', { 
        user: user_settings, 
        access_token_expiry: process.env.ACCESS_TOKEN_EXPIRY_IN_SECONDS,
        site_title: 'Create Discount',
    });

});

// Handle the POST request to add a discount
router.post('/', authenticateToken, async (req, res) => {
    // Extract form data from the request
    const { 
        discount_name, 
        discount_code,
        discount_description 
    } = req.body;

    var {
        discount_amount_total, 
        discount_amount_percentage, 
    } = req.body;

    if (discount_amount_percentage == "") {
        discount_amount_percentage = 0;
    }

    if (discount_amount_total == "") {
        discount_amount_total = 0;
    }

    console.log(discount_amount_percentage);

    // Create a new discount instance with the form details
    const newDiscount = new Discount({
        name: discount_name,
        code: discount_code,
        'amount.total': discount_amount_total,
        'amount.percentage': discount_amount_percentage,
        description: discount_description,
    });

    try {
        // Save the discount to the database
        const savedDiscount = await newDiscount.save();
        res.redirect('/settings/discounts/');
    } catch (error) {
        console.error(error);

        // Check if the error is a duplicate key violation
        if (error.code === 11000 && error.keyPattern && error.keyPattern['name']) {
            // Duplicate name error
            res.status(400).json({ message: 'Discount with the same name already exists' });
        } else {
            // Other internal server error
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }
});


module.exports = router;
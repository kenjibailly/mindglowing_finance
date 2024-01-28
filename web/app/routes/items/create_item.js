const express = require('express');
const router = express.Router();
const Item = require('../../models/item');
const User = require('../../models/user');
const authenticateToken = require('../security/authenticate');
const uploadConfig = require('../picture_handler/multerConfig');

/* GET /items/create-item page. */
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
    
    // Render the create items page
    res.render('items/create_item', { 
        user: user_settings, 
        access_token_expiry: process.env.ACCESS_TOKEN_EXPIRY_IN_SECONDS, 
        user_settings: user_settings,
        site_title: 'Create Item',
    });

});

// Handle the POST request to add an item
router.post('/', authenticateToken, uploadConfig.upload, uploadConfig.resizeAndCompressImage, async (req, res) => {
    // Extract form data from the request
    const { 
        name, 
        price, 
        description 
    } = req.body;

    try {
        // Create a new item instance with the form details
        const newItem = new Item({
            name,
            price,
            description,
            picture: req.file ? req.file.filename : null,
        });

        // Save the item to the database
        const savedItem = await newItem.save();
        res.redirect('/items');
    } catch (error) {
        console.error(error);

        // Check if the error is a duplicate key violation
        if (error.code === 11000 && error.keyPattern && error.keyPattern['name']) {
            // Duplicate name error
            res.status(400).json({ message: 'Item with the same name already exists' });
        } else {
            // Other internal server error
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }
});

module.exports = router;
const express = require('express');
const router = express.Router();
const Product = require('../../models/product');
const User = require('../../models/user');
const authenticateToken = require('../security/authenticate');
const uploadConfig = require('../picture_handler/multerConfig');

/* GET /products/create-product page. */
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
    
    // Render the create products page
    res.render('products/create_product', { 
        user: user_settings, 
        access_token_expiry: process.env.ACCESS_TOKEN_EXPIRY_IN_SECONDS, 
        user_settings: user_settings,
        site_title: 'Create Product',
    });

});

// Handle the POST request to add an product
router.post('/', authenticateToken, uploadConfig.upload, uploadConfig.resizeAndCompressImage, async (req, res) => {
    // Extract form data from the request
    const { 
        name, 
        price, 
        description 
    } = req.body;

    try {
        // Create a new product instance with the form details
        const newProduct = new Product({
            name,
            price,
            description,
            picture: req.file ? req.file.filename : null,
        });

        // Save the product to the database
        const savedProduct = await newProduct.save();
        res.redirect('/products');
    } catch (error) {
        logger.error(error);

        // Check if the error is a duplicate key violation
        if (error.code === 11000 && error.keyPattern && error.keyPattern['name']) {
            // Duplicate name error
            res.status(400).json({ message: 'Product with the same name already exists' });
        } else {
            // Other internal server error
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }
});

module.exports = router;
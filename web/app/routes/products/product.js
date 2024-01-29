const express = require('express');
const router = express.Router();
const Product = require('../../models/product');
const User = require('../../models/user');
const authenticateToken = require('../security/authenticate');

// Get the project page by id
router.get('/:id', authenticateToken, async function(req, res, next) {
    // Get the session user that's logged in
    const user = req.session.user;
    // Get the product ID
    const product_id = req.params.id;
    // If the user is logged in
      if(!user) {
          // Render the login page
          return res.redirect('/login');
      }
      try {
        // Use the find method to get project by id
        const product = await Product.findOne({ _id: product_id });

        // Use the find method to get the user settings
        const user_settings = await User.findOne({ username: user.username });

        // Render the items page
        res.render('products/product', { 
          user: user_settings, 
          product: product, 
          access_token_expiry: process.env.ACCESS_TOKEN_EXPIRY_IN_SECONDS, 
          user_settings: user_settings, 
          site_title: 'Product',
        });
      } catch (error) {
        console.error(error);
        res.render('products/products', { username: user.username, access_token_expiry: process.env.ACCESS_TOKEN_EXPIRY_IN_SECONDS});
    }
  });

module.exports = router;
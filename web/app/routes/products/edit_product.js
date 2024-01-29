const express = require('express');
const router = express.Router();
const Product = require('../../models/product');
const authenticateToken = require('../security/authenticate');
const deleteImageFile = require('../picture_handler/deleteImageFile');
const uploadConfig = require('../picture_handler/multerConfig');
const User = require('../../models/user');

// Get the customer page by id
router.get('/:id', authenticateToken, async function(req, res, next) {
    // Get the session user that's logged in
    const user = req.session.user;
    // If the user is logged in
      if(!user) {
          // Render the login page
          return res.redirect('/login');
      }
      try {
        // Use the find method to get all customers
        const product = await Product.findById(req.params.id);
        // Use the find method to get the user settings
        const user_settings = await User.findOne({ username: user.username });
        // Check if success is true in the url
        const success = req.query.success;
        // Render the products page
        res.render('products/edit_product', { 
          user: user_settings, 
          product: product, 
          access_token_expiry: process.env.ACCESS_TOKEN_EXPIRY_IN_SECONDS, 
          user_settings: user_settings, 
          success: success,
          site_title: 'Edit Product',
        });
      } catch (error) {
        console.error(error);
        res.render('products/products', { username: user.username, access_token_expiry: process.env.ACCESS_TOKEN_EXPIRY_IN_SECONDS});
    }
  });
  
  
  // Handle the update request
  router.post('/:id', authenticateToken, uploadConfig.upload, uploadConfig.resizeAndCompressImage, async (req, res) => {
    try {
        const productId = req.params.id;
        const { 
          name, 
          price, 
          description 
        } = req.body;
  
        // Find the product to get the image file name
        const old_product = await Product.findById(productId);
  
        if (!old_product) {
            return res.status(404).send('Product not found');
        }
  
        var picture;
        // Check if a file was uploaded
        if(req.file) {
          picture = req.file.filename;
        // Otherwise keep the old picture
        } else {
          picture = old_product.picture;
        }
  
        // If the product had a picture and there's a new one
        if(old_product.picture && req.file) {
          // Delete the image file
          await deleteImageFile(old_product.picture);
        }
  
        // Update the product in the database
        const result = await Product.findByIdAndUpdate(
          productId,
          { $set: { name, price, description, picture } },
          { new: true }
        );
  
        if (!result) {
            return res.status(404).send('Product not found');
        }
      
      // Get the user
      const user = req.session.user;
      // Get the product
      const product = await Product.findById(req.params.id);
      // Use the find method to get the user settings
      const user_settings = await User.findOne({ username: user.username });
      // Render the product again with a success message
      // return res.render('products/product', { success: 'true', username: user.username, product: product, user_settings: user_settings });
      return res.redirect('/products/edit/' + product.id + '?success=true');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;
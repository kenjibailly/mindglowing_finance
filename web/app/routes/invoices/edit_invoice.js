const express = require('express');
const router = express.Router();
const Invoice = require('../../models/invoice');
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
        const invoice = await Invoice.findById(req.params.id);
        // Use the find method to get the user settings
        const user_settings = await User.findOne({ username: user.username });
        // Check if success is true in the url
        const success = req.query.success;
        // Render the invoices page
        res.render('invoices/edit_invoice', { 
          user: user_settings, 
          invoice: invoice, 
          access_token_expiry: process.env.ACCESS_TOKEN_EXPIRY_IN_SECONDS, 
          user_settings: user_settings, 
          success: success,
          site_title: 'Edit Invoice',
        });
      } catch (error) {
        console.error(error);
        res.render('invoices/invoices', { username: user.username, access_token_expiry: process.env.ACCESS_TOKEN_EXPIRY_IN_SECONDS});
    }
  });
  
  
  // Handle the update request
  router.post('/:id', authenticateToken, uploadConfig.upload, uploadConfig.resizeAndCompressImage, async (req, res) => {
    try {
        const itemId = req.params.id;
        const { 
          name, 
          price, 
          description 
        } = req.body;
  
        // Find the item to get the image file name
        const old_item = await Item.findById(itemId);
  
        if (!old_item) {
            return res.status(404).send('Item not found');
        }
  
        var picture;
        // Check if a file was uploaded
        if(req.file) {
          picture = req.file.filename;
        // Otherwise keep the old picture
        } else {
          picture = old_item.picture;
        }
  
        // If the item had a picture and there's a new one
        if(old_item.picture && req.file) {
          // Delete the image file
          await deleteImageFile(old_item.picture);
        }
  
        // Update the item in the database
        const result = await Item.findByIdAndUpdate(
          itemId,
          { $set: { name, price, description, picture } },
          { new: true }
        );
  
        if (!result) {
            return res.status(404).send('Item not found');
        }
      
      // Get the user
      const user = req.session.user;
      // Get the item
      const item = await Item.findById(req.params.id);
      // Use the find method to get the user settings
      const user_settings = await User.findOne({ username: user.username });
      // Render the item again with a success message
      // return res.render('items/item', { success: 'true', username: user.username, item: item, user_settings: user_settings });
      return res.redirect('/items/edit/' + item.id + '?success=true');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;
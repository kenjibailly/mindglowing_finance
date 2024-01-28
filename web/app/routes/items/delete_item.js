const express = require('express');
const router = express.Router();
const Item = require('../../models/item');
const authenticateToken = require('../security/authenticate');
const deleteImageFile = require('../picture_handler/deleteImageFile')

// Handle the update request
router.post('/:id', authenticateToken, async (req, res) => {
    try {
        const itemId = req.params.id;
  
        // Find the item to get the image file name
        const item = await Item.findById(itemId);
  
        if (!item) {
            return res.status(404).send('Item not found');
        }
  
        // If the item had a picture
        if(item.picture) {
          // Delete the image file
          await deleteImageFile(item.picture);
        }
        
  
        // Update the item in the database
        const result = await Item.findByIdAndDelete(itemId);
  
        if (!result) {
            return res.status(404).send('Item not found');
        }
  
        // Redirect to the items page
        res.redirect(`/items/`);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
  });

  module.exports = router;
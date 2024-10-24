const express = require('express');
const router = express.Router();
const Product = require('../../models/product');
const authenticateToken = require('../security/authenticate');
const deleteImageFile = require('../picture_handler/deleteImageFile')

// Handle the update request
router.post('/:id', authenticateToken, async (req, res) => {
    try {
        const productId = req.params.id;
  
        // Find the product to get the image file name
        const product = await Product.findById(productId);
  
        if (!product) {
            return res.status(404).send('Product not found');
        }
  
        // If the product had a picture
        if(product.picture) {
          // Delete the image file
          await deleteImageFile(product.picture);
        }
        
  
        // Update the product in the database
        const result = await Product.findByIdAndDelete(productId);
  
        if (!result) {
            return res.status(404).send('Product not found');
        }
  
        // Redirect to the products page
        res.redirect(`/products/`);
    } catch (error) {
        logger.error(error);
        res.status(500).send('Internal Server Error');
    }
  });

  module.exports = router;
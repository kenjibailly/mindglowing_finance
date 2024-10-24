const express = require('express');
const router = express.Router();
const Product = require('../../models/product');
const authenticateToken = require('../security/authenticate');
const deleteImageFile = require('../picture_handler/deleteImageFile')

// Handle the delete request for selected products
router.post('/', authenticateToken, async (req, res) => {
    try {
        // Extract selected IDs from the request body
        const selectedIds = req.body.selectedIds;
  
        // Find the products to get the image file names
        const products = await Product.find({ _id: { $in: selectedIds } });
  
        // Delete the image files
        await Promise.all(products.map(product => deleteImageFile(product.picture)));
  
  
        // Delete the selected products in the database
        const result = await Product.deleteMany({ _id: { $in: selectedIds } });
  
        if (!result.deletedCount) {
            return res.status(404).send('No products found for deletion');
        }
  
        // Send a JSON response with a success message
        res.status(200).json({ message: 'Products deleted successfully' });
    } catch (error) {
        logger.error(error);
        res.status(500).send('Internal Server Error');
    }
});
  
module.exports = router;
const express = require('express');
const router = express.Router();
const Item = require('../../models/item');
const authenticateToken = require('../security/authenticate');
const deleteImageFile = require('../picture_handler/deleteImageFile')

// Handle the delete request for selected items
router.post('/', authenticateToken, async (req, res) => {
    try {
        // Extract selected IDs from the request body
        const selectedIds = req.body.selectedIds;
  
        // Find the items to get the image file names
        const items = await Item.find({ _id: { $in: selectedIds } });
  
        // Delete the image files
        await Promise.all(items.map(item => deleteImageFile(item.picture)));
  
  
        // Delete the selected items in the database
        const result = await Item.deleteMany({ _id: { $in: selectedIds } });
  
        if (!result.deletedCount) {
            return res.status(404).send('No items found for deletion');
        }
  
        // Send a JSON response with a success message
        res.status(200).json({ message: 'Items deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});
  
module.exports = router;
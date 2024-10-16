const express = require('express');
const router = express.Router();
const Invoice = require('../../models/invoice');
const authenticateToken = require('../security/authenticate');

// Handle the delete request for selected invoices
router.post('/', authenticateToken, async (req, res) => {
    try {
        // Extract selected IDs from the request body
        const selectedIds = req.body.selectedIds;
  
        // Delete the selected invoices in the database
        const result = await Invoice.deleteMany({ _id: { $in: selectedIds } });
  
        if (!result.deletedCount) {
            return res.status(404).send('No invoices found for deletion');
        }
  
        // Send a JSON response with a success message
        res.status(200).json({ message: 'Invoices deleted successfully' });
    } catch (error) {
        logger.error(error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;  
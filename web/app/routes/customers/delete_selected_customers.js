const express = require('express');
const router = express.Router();
const Customer = require('../../models/customer');
const authenticateToken = require('../security/authenticate');

// Handle the delete request for selected customers
router.post('/', authenticateToken, async (req, res) => {
    try {
        // Extract selected IDs from the request body
        const selectedIds = req.body.selectedIds;
  
        // Delete the selected customers in the database
        const result = await Customer.deleteMany({ _id: { $in: selectedIds } });
  
        if (!result.deletedCount) {
            return res.status(404).send('No customers found for deletion');
        }
  
        // Send a JSON response with a success message
        res.status(200).json({ message: 'Customers deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;  
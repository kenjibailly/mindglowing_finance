const express = require('express');
const router = express.Router();
const PaymentMethod = require('../../../models/payment_method');
const authenticateToken = require('../../security/authenticate');

// Handle the delete request for selected payment methods
router.post('/', authenticateToken, async (req, res) => {
    try {
        // Extract selected IDs from the request body
        const selectedIds = req.body.selectedIds;
  
        // Delete the selected payment methods in the database
        const result = await PaymentMethod.deleteMany({ _id: { $in: selectedIds } });
  
        if (!result.deletedCount) {
            return res.status(404).send('No payment methods found for deletion');
        }
  
        // Send a JSON response with a success message
        return res.status(200).json({ message: 'Payment methods deleted successfully' });
    } catch (error) {
        logger.error(error);
        return res.status(500).send('Internal Server Error');
    }
});

module.exports = router;  
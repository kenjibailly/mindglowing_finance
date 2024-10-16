const express = require('express');
const router = express.Router();
const ShippingCompany = require('../../../models/shipping_company');
const authenticateToken = require('../../security/authenticate');

// Handle the delete request for selected shipping companies
router.post('/', authenticateToken, async (req, res) => {
    try {
        // Extract selected IDs from the request body
        const selectedIds = req.body.selectedIds;
  
        // Delete the selected shipping companies in the database
        const result = await ShippingCompany.deleteMany({ _id: { $in: selectedIds } });
  
        if (!result.deletedCount) {
            return res.status(404).send('No shipping companies found for deletion');
        }
  
        // Send a JSON response with a success message
        return res.status(200).json({ message: 'Shipping companies deleted successfully' });
    } catch (error) {
        logger.error(error);
        return res.status(500).send('Internal Server Error');
    }
});

module.exports = router;  
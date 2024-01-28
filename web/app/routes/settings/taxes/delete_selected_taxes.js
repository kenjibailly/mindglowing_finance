const express = require('express');
const router = express.Router();
const Tax = require('../../../models/tax');
const authenticateToken = require('../../security/authenticate');

// Handle the delete request for selected taxes
router.post('/', authenticateToken, async (req, res) => {
    try {
        // Extract selected IDs from the request body
        const selectedIds = req.body.selectedIds;
  
        // Delete the selected taxes in the database
        const result = await Tax.deleteMany({ _id: { $in: selectedIds } });
  
        if (!result.deletedCount) {
            return res.status(404).send('No taxes found for deletion');
        }
  
        // Send a JSON response with a success message
        return res.status(200).json({ message: 'Taxes deleted successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).send('Internal Server Error');
    }
});

module.exports = router;  
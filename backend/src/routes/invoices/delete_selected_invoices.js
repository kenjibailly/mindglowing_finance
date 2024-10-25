const express = require('express');
const router = express.Router();
const Invoice = require('../../models/invoice');
const Project = require('../../models/project');
const authenticateToken = require('../security/authenticate');

// Handle the delete request for selected invoices
router.post('/', authenticateToken, async (req, res) => {
    try {
        // Extract selected IDs from the request body
        const selectedIds = req.body.selectedIds;
  
        // Retrieve the project IDs before deleting the invoices
        const invoicesToDelete = await Invoice.find({ _id: { $in: selectedIds } }).select('project_billed.id');

        // Extract project IDs
        const projectIds = invoicesToDelete.map(invoice => invoice.project_billed.id).filter(id => id);

        // Delete multiple invoices
        const result = await Invoice.deleteMany({ _id: { $in: selectedIds } });

        // Check if any invoices were deleted
        if (result.deletedCount > 0 && projectIds.length > 0) {
            // Update projects to set billed to false
            await Project.updateMany(
                { _id: { $in: projectIds } },
                { $set: { billed: false } }
            );
        }
  
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
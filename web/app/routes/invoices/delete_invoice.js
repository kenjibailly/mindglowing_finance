const express = require('express');
const router = express.Router();
const Invoice = require('../../models/invoice');
const Project = require('../../models/project');
const authenticateToken = require('../security/authenticate');

// Handle the update request
router.post('/:id', authenticateToken, async (req, res) => {
    try {
        const invoiceId = req.params.id;
  
        // Perform any validation or additional processing as needed
  
        // Update the invoice in the database
        const result = await Invoice.findByIdAndDelete(invoiceId);

        // Check if the invoice had a project_billed.id
        if (result && result.project_billed && result.project_billed.id) {
            const projectId = result.project_billed.id;

            // Update the project to set billed to false
            await Project.updateOne(
                { _id: projectId }, // Find project by ID
                { $set: { billed: false } } // Set billed to false
            );
        }
  
        if (!result) {
            return res.status(404).send('Invoice not found');
        }
  
        // Redirect to the invoices page
        res.redirect(`/invoices/`);
    } catch (error) {
        logger.error(error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;
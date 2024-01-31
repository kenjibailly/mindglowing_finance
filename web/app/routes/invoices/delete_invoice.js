const express = require('express');
const router = express.Router();
const Invoice = require('../../models/invoice');
const authenticateToken = require('../security/authenticate');

// Handle the update request
router.post('/:id', authenticateToken, async (req, res) => {
    try {
        const invoiceId = req.params.id;
  
        // Perform any validation or additional processing as needed
  
        // Update the invoice in the database
        const result = await Invoice.findByIdAndDelete(invoiceId);
  
        if (!result) {
            return res.status(404).send('Invoice not found');
        }
  
        // Redirect to the invoices page
        res.redirect(`/invoices/`);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;
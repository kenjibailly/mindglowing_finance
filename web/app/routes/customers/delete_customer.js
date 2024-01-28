const express = require('express');
const router = express.Router();
const Customer = require('../../models/customer');
const authenticateToken = require('../security/authenticate');

// Handle the update request
router.post('/:id', authenticateToken, async (req, res) => {
    try {
        const customerId = req.params.id;
  
        // Perform any validation or additional processing as needed
  
        // Update the customer in the database
        const result = await Customer.findByIdAndDelete(customerId);
  
        if (!result) {
            return res.status(404).send('Customer not found');
        }
  
        // Redirect to the customers page
        res.redirect(`/customers/`);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;
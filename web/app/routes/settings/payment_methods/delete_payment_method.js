const express = require('express');
const router = express.Router();
const PaymentMethod = require('../../../models/payment_method');
const authenticateToken = require('../../security/authenticate');

// Handle the delete request
router.post('/:id', authenticateToken, async (req, res) => {
    try {
        const payment_method_id = req.params.id;
  
        // Find the payment method by id
        const payment_method = await PaymentMethod.findById(payment_method_id);
  
        if (!payment_method) {
            return res.status(404).send('Payment method not found');
        }        
  
        // Delete the payment method in the database
        const result = await PaymentMethod.findByIdAndDelete(payment_method_id);
  
        if (!result) {
            return res.status(404).send('Payment method not found');
        }
  
        // Redirect to the payment methods page
        res.redirect(`/settings/payment-methods/`);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
  });

  module.exports = router;
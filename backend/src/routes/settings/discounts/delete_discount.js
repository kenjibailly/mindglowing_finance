const express = require('express');
const router = express.Router();
const Discount = require('../../../models/discount');
const authenticateToken = require('../../security/authenticate');

// Handle the delete request
router.post('/:id', authenticateToken, async (req, res) => {
    try {
        const discount_id = req.params.id;
  
        // Find the discount by id
        const discount = await Discount.findById(discount_id);
  
        if (!discount) {
            return res.status(404).send('Discount not found');
        }        
  
        // Delete the discount in the database
        const result = await Discount.findByIdAndDelete(discount_id);
  
        if (!result) {
            return res.status(404).send('Discount not found');
        }
  
        // Redirect to the discounts page
        res.redirect(`/settings/discounts/`);
    } catch (error) {
        logger.error(error);
        res.status(500).send('Internal Server Error');
    }
  });

  module.exports = router;
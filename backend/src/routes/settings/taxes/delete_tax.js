const express = require('express');
const router = express.Router();
const Tax = require('../../../models/tax');
const authenticateToken = require('../../security/authenticate');

// Handle the delete request
router.post('/:id', authenticateToken, async (req, res) => {
    try {
        const tax_id = req.params.id;
  
        // Find the tax by id
        const tax = await Tax.findById(tax_id);
  
        if (!tax) {
            return res.status(404).send('Tax not found');
        }        
  
        // Delete the tax in the database
        const result = await Tax.findByIdAndDelete(tax_id);
  
        if (!result) {
            return res.status(404).send('Tax not found');
        }
  
        // Redirect to the taxes page
        res.redirect(`/settings/taxes/`);
    } catch (error) {
        logger.error(error);
        res.status(500).send('Internal Server Error');
    }
  });

  module.exports = router;
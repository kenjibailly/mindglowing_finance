const express = require('express');
const router = express.Router();
const ShippingCompany = require('../../../models/shipping_company');
const authenticateToken = require('../../security/authenticate');

// Handle the delete request
router.post('/:id', authenticateToken, async (req, res) => {
    try {
        const shipping_company_id = req.params.id;
  
        // Find the shipping company by id
        const shipping_company = await ShippingCompany.findById(shipping_company_id);
  
        if (!shipping_company) {
            return res.status(404).send('Shipping company not found');
        }        
  
        // Delete the shipping company in the database
        const result = await ShippingCompany.findByIdAndDelete(shipping_company_id);
  
        if (!result) {
            return res.status(404).send('Shipping company not found');
        }
  
        // Redirect to the shipping companies page
        res.redirect(`/settings/shipping-companies/`);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
  });

  module.exports = router;
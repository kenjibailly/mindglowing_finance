const express = require('express');
const router = express.Router();
const ShippingCompany = require('../../../models/shipping_company');
const authenticateToken = require('../../security/authenticate');
const User = require('../../../models/user');

// Get the /settings/shipping-companies page by id
router.get('/:id', authenticateToken, async function(req, res, next) {
    // Get the session user that's logged in
    const user = req.session.user;
    // If the user is logged in
      if(!user) {
          // Render the login page
          return res.redirect('/login');
      }
      try {
        // Use the find method to get all shipping companies
        const shipping_company = await ShippingCompany.findById(req.params.id);
        // Use the find method to get the user settings
        const user_settings = await User.findOne({ username: user.username });
        // Check if success is true in the url
        const success = req.query.success;
        // Render the edit shipping company page
        res.render('settings/shipping_companies/edit_shipping_company', { 
            user: user_settings, 
            shipping_company: shipping_company, 
            access_token_expiry: process.env.ACCESS_TOKEN_EXPIRY_IN_SECONDS, 
            success: success,
            site_title: 'Edit Shipping Company',
        });
      } catch (error) {
        console.error(error);
        res.render('/settings/shipping-companies/');
    }
  });
  
  
  // Handle the update request
  router.post('/:id', authenticateToken, async (req, res) => {
    try {
        const shipping_company_id = req.params.id;
        const { 
            shipping_company_name, 
            shipping_company_description 
        } = req.body;
  
        // Find the old shipping company
        const old_shipping_company = await ShippingCompany.findById(shipping_company_id);
  
        if (!old_shipping_company) {
            return res.status(404).send('Shipping company not found');
        }
  
        // Update the shipping company in the database
        const result = await ShippingCompany.findByIdAndUpdate(
            shipping_company_id,
            { $set: { 
                name: shipping_company_name,
                description: shipping_company_description 
            }},
            { new: true }
        );
  
        if (!result) {
            return res.status(404).send('Shipping company not found');
        }
      
      // Get the shipping company
      const shipping_company = await ShippingCompany.findById(req.params.id);
      // Render the shipping company again with a success message
      return res.redirect('/settings/shipping-companies/edit/' + shipping_company.id + '?success=true');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;
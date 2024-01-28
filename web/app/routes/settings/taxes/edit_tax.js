const express = require('express');
const router = express.Router();
const Tax = require('../../../models/tax');
const authenticateToken = require('../../security/authenticate');
const User = require('../../../models/user');

// Get the /settings/payment-methods page by id
router.get('/:id', authenticateToken, async function(req, res, next) {
    // Get the session user that's logged in
    const user = req.session.user;
    // If the user is logged in
      if(!user) {
          // Render the login page
          return res.redirect('/login');
      }
      try {
        // Use the find method to get all taxes
        const tax = await Tax.findById(req.params.id);
        // Use the find method to get the user settings
        const user_settings = await User.findOne({ username: user.username });
        // Check if success is true in the url
        const success = req.query.success;
        // Render the edit tax page
        res.render('settings/taxes/edit_tax', { 
            user: user_settings, 
            tax: tax, 
            access_token_expiry: process.env.ACCESS_TOKEN_EXPIRY_IN_SECONDS, 
            success: success,
            site_title: 'Edit Tax',
        });
      } catch (error) {
        console.error(error);
        res.render('/settings/taxes/');
    }
  });
  
  
  // Handle the update request
  router.post('/:id', authenticateToken, async (req, res) => {
    try {
        const tax_id = req.params.id;
        const { 
            tax_name, 
            tax_percentage, 
            tax_description 
        } = req.body;
  
        // Find the old tax
        const old_tax = await Tax.findById(tax_id);
  
        if (!old_tax) {
            return res.status(404).send('Tax not found');
        }
  
        // Update the tax in the database
        const result = await Tax.findByIdAndUpdate(
            tax_id,
            { $set: { 
                name: tax_name,
                percentage: tax_percentage,
                description: tax_description 
            }},
            { new: true }
        );
  
        if (!result) {
            return res.status(404).send('Tax not found');
        }
      
      // Get the tax
      const tax = await Tax.findById(req.params.id);
      // Render the tax again with a success message
      return res.redirect('/settings/taxes/edit/' + tax.id + '?success=true');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;
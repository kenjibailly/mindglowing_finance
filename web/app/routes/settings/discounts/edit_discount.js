const express = require('express');
const router = express.Router();
const Discount = require('../../../models/discount');
const authenticateToken = require('../../security/authenticate');
const User = require('../../../models/user');

// Get the /settings/discounts page by id
router.get('/:id', authenticateToken, async function(req, res, next) {
    // Get the session user that's logged in
    const user = req.session.user;
    // If the user is logged in
      if(!user) {
          // Render the login page
          return res.redirect('/login');
      }
      try {
        // Use the find method to get all discounts
        const discount = await Discount.findById(req.params.id);
        // Use the find method to get the user settings
        const user_settings = await User.findOne({ username: user.username });
        // Check if success is true in the url
        const success = req.query.success;
        // Render the edit discount page
        res.render('settings/discounts/edit_discount', { 
            user: user_settings, 
            discount: discount, access_token_expiry: process.env.ACCESS_TOKEN_EXPIRY_IN_SECONDS, 
            success: success,
            site_title: 'Edit Discount',
        });
      } catch (error) {
        console.error(error);
        res.render('/settings/discounts/');
    }
  });
  
  
  // Handle the update request
  router.post('/:id', authenticateToken, async (req, res) => {
    try {
        const discount_id = req.params.id;
        const { 
            discount_name, 
            discount_code, 
            discount_amount_total, 
            discount_amount_percentage, 
            discount_description 
        } = req.body;
  
        // Find the old discount
        const old_discount = await Discount.findById(discount_id);
  
        if (!old_discount) {
            return res.status(404).send('Discount not found');
        }
  
        // Update the discount in the database
        const result = await Discount.findByIdAndUpdate(
            discount_id,
            { $set: { 
                name: discount_name,
                code: discount_code,
                'amount.total': discount_amount_total,
                'amount.percentage': discount_amount_percentage,
                description: discount_description 
            }},
            { new: true }
        );
  
        if (!result) {
            return res.status(404).send('Discount not found');
        }
      
      // Get the discount
      const discount = await Discount.findById(req.params.id);
      // Render the discount again with a success message
      return res.redirect('/settings/discounts/edit/' + discount.id + '?success=true');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;
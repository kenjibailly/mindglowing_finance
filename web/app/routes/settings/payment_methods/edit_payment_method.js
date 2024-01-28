const express = require('express');
const router = express.Router();
const PaymentMethod = require('../../../models/payment_method');
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
        // Use the find method to get all payment methods
        const payment_method = await PaymentMethod.findById(req.params.id);
        // Use the find method to get the user settings
        const user_settings = await User.findOne({ username: user.username });
        // Check if success is true in the url
        const success = req.query.success;
        // Render the edit payment method page
        res.render('settings/payment_methods/edit_payment_method', { 
          user: user_settings, 
          payment_method: payment_method, 
          access_token_expiry: process.env.ACCESS_TOKEN_EXPIRY_IN_SECONDS, 
          success: success ,
          site_title: 'Edit Payment Method',
        });
      } catch (error) {
        console.error(error);
        res.redirect('/settings/payment-methods/');
    }
  });
  
  
  // Handle the update request
  router.post('/:id', authenticateToken, async (req, res) => {
    try {
        const payment_method_id = req.params.id;
        const { 
          payment_method_name, 
          payment_method_description 
        } = req.body;
  
        // Find the old payment method
        const old_payment_method = await PaymentMethod.findById(payment_method_id);
  
        if (!old_payment_method) {
            return res.status(404).send('Payment method not found');
        }
  
        // Update the payment method in the database
        const result = await PaymentMethod.findByIdAndUpdate(
            payment_method_id,
            { $set: { 
                name: payment_method_name,
                description: payment_method_description 
            }},
            { new: true }
        );
  
        if (!result) {
            return res.status(404).send('Payment method not found');
        }
      
      // Get the payment method
      const payment_method = await PaymentMethod.findById(req.params.id);
      // Render the payment method again with a success message
      return res.redirect('/settings/payment-methods/edit/' + payment_method.id + '?success=true');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;
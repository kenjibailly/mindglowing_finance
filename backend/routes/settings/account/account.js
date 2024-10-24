const express = require('express');
const router = express.Router();
const User = require('../../../models/user');
const authenticateToken = require('../../security/authenticate');
const uploadConfig = require('../../picture_handler/multerConfig');
const deleteImageFile = require('../../picture_handler/deleteImageFile');

/* GET /settings/settings page. */
router.get('/', authenticateToken, async function(req, res, next) {
  // Get the session user that's logged in
  const user = req.session.user;
  // If the user is logged in
    if(!user) {
        // Render the login page
        return res.redirect('/login');
    }

    // Use the find method to get the user settings
    const user_settings = await User.findOne({ username: user.username });

    // Check if success is true in the url
    const success = req.query.success;
    
    // Render the settings page
    res.render('settings/account/account', { 
      access_token_expiry: process.env.ACCESS_TOKEN_EXPIRY_IN_SECONDS, 
      user: user_settings,
      site_title: 'Account',
      success: success,
    });

});


  // Handle the update request
  router.post('/', authenticateToken, uploadConfig.upload, uploadConfig.resizeAndCompressImage, async (req, res) => {
    try {

        // Get the session user that's logged in
        const user = req.session.user;
        // If the user is logged in
          if(!user) {
              // Render the login page
              return res.redirect('/login');
          }

        // Use the find method to get the user settings
        const user_settings = await User.findOne({ username: user.username });

        const {
          date_format,
          time_zone,
          currency,
          'personal_information.first_name': first_name,
          'personal_information.last_name': last_name,
          'personal_information.email': email,
          'personal_information.company_name': company_name,
          'address_information.street': street,
          'address_information.street2': street2,
          'address_information.city': city,
          'address_information.state': state,
          'address_information.zip': zip,
          'address_information.country': country,
      } = req.body;
  
        if (!user_settings) {
            return res.status(404).send('User not found');
        }

        const currency_name = currency.split(' ')[0];
        const currency_symbol = currency.split(' ')[1].replace(/[()]/g, '');;
  
        var picture;
        // Check if a file was uploaded
        if(req.file) {
          picture = req.file.filename;
        // Otherwise keep the old picture
        } else {
          picture = user_settings.picture;
        }

        logger.log('picture', picture);
  
        // If the item had a picture and there's a new one
        if(user_settings.picture && req.file) {
          // Delete the image file
          await deleteImageFile(user_settings.picture);
        }
  
        // Update the item in the database
        const result = await User.findByIdAndUpdate(
          user_settings._id,
          { $set: { 
            setup: false,
            date_format: date_format,
            time_zone: time_zone,
            currency_name: currency_name,
            currency_symbol: currency_symbol,
            'personal_information.first_name': first_name,
            'personal_information.last_name': last_name,
            'personal_information.email': email,
            'personal_information.company_name': company_name,
            'address_information.street': street,
            'address_information.street2': street2,
            'address_information.city': city,
            'address_information.state': state,
            'address_information.zip': zip,
            'address_information.country': country,
            picture: picture,
          }},
          { new: true }
        );
  
        if (!result) {
            return res.status(404).send('User not found');
        }
      
      return res.redirect('/settings/account/?success=true');
    } catch (error) {
        logger.error(error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;
const express = require('express');
const router = express.Router();
const Item = require('../../models/item');
const User = require('../../models/user');
const Customization = require('../../models/customization');
const authenticateToken = require('../security/authenticate');
const paginateArray = require('../pagination/pagination');

/* GET /customers page. */
router.get('/', authenticateToken, async function(req, res, next) {
  // Get the session user that's logged in
  const user = req.session.user;
  // If the user is logged in
    if(!user) {
        // Render the login page
        return res.redirect('/login');
    }
    
    // Use the find method to get all customers
    const items = await Item.find().lean();
    // Use the find method to get the user settings
    const user_settings = await User.findOne({ username: user.username });

    // Use the find method to get the customization settings
    const customization = await Customization.findOne();

    // Pagination
    const { pageItems, currentPage, totalPages } = paginateArray(items, customization.items_per_page, parseInt(req.query.page) || 1);

    res.render('items/items', { 
      user: user_settings, 
      items: pageItems, 
      currentPage: currentPage,
      totalPages: totalPages,
      access_token_expiry: process.env.ACCESS_TOKEN_EXPIRY_IN_SECONDS,
      site_title: 'Items',
    });

});

module.exports = router;
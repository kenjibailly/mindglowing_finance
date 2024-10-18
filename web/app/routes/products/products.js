const express = require('express');
const router = express.Router();
const Product = require('../../models/product');
const User = require('../../models/user');
const Customization = require('../../models/customization');
const authenticateToken = require('../security/authenticate');

/* GET /customers page. */
router.get('/', authenticateToken, async function(req, res, next) {
  // Get the session user that's logged in
  const user = req.session.user;
  // If the user is logged in
  if(!user) {
      // Render the login page
      return res.redirect('/login');
  }

  const { page = 1 } = req.query;

  try {
    
    // Use the find method to get the user settings
    const user_settings = await User.findOne({ username: user.username });

    // Use the find method to get the customization settings
    const customization_settings = await Customization.findOne();

    // Calculate the number of items to skip based on the page
    const skip = (page - 1) * customization_settings.items_per_page;

    const products = await Product.aggregate([
      // Sort by the specified field, and add _id as a secondary sort key
      {
        $sort: {
          _id: -1 // Always sort by _id as the secondary key to ensure stable sorting
        }
      },
      // Apply pagination after sorting
      { $skip: skip },
      { $limit: customization_settings.items_per_page }
    ]);

    // Count the total number of invoices
    const totalProducts = await Product.countDocuments();

    // Calculate total pages
    const totalPages = Math.ceil(totalProducts / customization_settings.items_per_page);

    res.render('products/products', { 
      user: user_settings, 
      products: products, 
      currentPage: parseInt(page),
      totalPages: totalPages,
      access_token_expiry: process.env.ACCESS_TOKEN_EXPIRY_IN_SECONDS,
      site_title: 'Products',
    });
  } catch (error) {
    logger.error(error);
    // Render the products page
    return res.render('products/products', { 
      access_token_expiry: process.env.ACCESS_TOKEN_EXPIRY_IN_SECONDS, 
      site_title: 'Products',
      error: error,
    });
  }

});



router.get('/sort', authenticateToken, async function(req, res, next) {
  // Get the session user that's logged in
  const user = req.session.user;
  // If the user is logged in
  if(!user) {
      // Render the login page
      return res.redirect('/login');
  }

  const { sort_by = 'created_on', sort_order = 'asc', reload = true, page = 1 } = req.query;

  const sortDirection = sort_order === 'asc' ? 1 : -1;
  const sortOptions = {};
  sortOptions[sort_by] = sortDirection;

  try {
      // Use the find method to get the customization settings
    const customization_settings = await Customization.findOne();

    // Format the invoices as necessary (similar to your existing logic)
    const user_settings = await User.findOne({ username: req.session.user.username });

    // Calculate the number of items to skip based on the page
    const skip = (page - 1) * customization_settings.items_per_page;

    const products = await Product.aggregate([
      // Sort by the specified field dynamically and also by _id in descending order
      {
        $sort: {
          [sort_by]: sortDirection, // Dynamic sorting by the specified field
          _id: -1 // Always sort by _id in descending order as a secondary key
        }
      },
      // Apply pagination after sorting
      { $skip: skip },
      { $limit: customization_settings.items_per_page }
    ]);

    // Count the total number of invoices
    const totalProducts = await Product.countDocuments();

    // Calculate total pages
    const totalPages = Math.ceil(totalProducts / customization_settings.items_per_page);

    if (reload === 'true') {  
      // Render the products page
      return res.render('products/products', { 
        user: user_settings, 
        products: products, 
        currentPage: parseInt(page),
        totalPages: totalPages,
        access_token_expiry: process.env.ACCESS_TOKEN_EXPIRY_IN_SECONDS,
        site_title: 'Products',
      });
    } else {      
      // Send the sorted invoices and pagination info back as JSON
      return res.json({ data: products, totalPages, currentPage: parseInt(page), user_settings: user_settings });
    }
  } catch (error) {
    logger.error(error);

    if (reload === 'true') {  
      // Render the products page
      return res.render('products/products', { 
        access_token_expiry: process.env.ACCESS_TOKEN_EXPIRY_IN_SECONDS, 
        site_title: 'Products',
        error: error,
      });
    } else {
      return res.json({error: "error"})
    }

  }
});

module.exports = router;
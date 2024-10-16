const express = require('express');
const router = express.Router();
const Customer = require('../../models/customer');
const User = require('../../models/user');
const Customization = require('../../models/customization');
const authenticateToken = require('../security/authenticate');
const formatDate = require('../formatters/date_formatter');
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
    const customers = await Customer.find().lean();
    // Use the find method to get the user settings
    const user_settings = await User.findOne({ username: user.username });
    // Loop through the customers array and update the format of the created_on field
    const updatedCustomers = customers.map((customer) => {
      return {
        ...customer,
        created_on: formatDate(customer.created_on, user_settings), // Change the locale based on your requirements
      };
    });

    // Use the find method to get the customization settings
    const customization = await Customization.findOne();

    // Pagination
    const { pageItems, currentPage, totalPages } = paginateArray(updatedCustomers, customization.items_per_page, parseInt(req.query.page) || 1);

    // Render the customers page
    return res.render('customers/customers', { 
      user: user_settings, 
      customers: pageItems, 
      currentPage: currentPage,
      totalPages: totalPages,
      access_token_expiry: process.env.ACCESS_TOKEN_EXPIRY_IN_SECONDS,
      site_title: 'Customers',
    });

});


router.get('/sort', authenticateToken, async function(req, res, next) {
  // Get the session user that's logged in
  const user = req.session.user;
  // If the user is logged in
  if(!user) {
      // Render the login page
      return res.redirect('/login');
  }

  const { sort_by = 'created_on', sort_order = 'asc', sort_type = "alphabetical", reload = true } = req.query;
  let { page = 1 } = req.query;

  const sortDirection = sort_order === 'asc' ? 1 : -1;
  const sortOptions = {};
  sortOptions[sort_by] = sortDirection;

  // Use the find method to get the user settings
  const user_settings = await User.findOne({ username: user.username });

  // Use the find method to get the customization settings
  const customization_settings = await Customization.findOne();

  if (reload === 'true') {  
    // Use the find method to get all customers
    const customers = await Customer.find()
      .lean()
      .sort(sortOptions);

    // Loop through the customers array and update the format of the created_on field
    const updatedCustomers = customers.map((customer) => {
      return {
        ...customer,
        created_on: formatDate(customer.created_on, user_settings), // Change the locale based on your requirements
      };
    });

    // Pagination
    const { pageItems, currentPage, totalPages } = paginateArray(updatedCustomers, customization_settings.items_per_page, parseInt(req.query.page) || 1);

    // Render the customers page
    return res.render('customers/customers', { 
      user: user_settings, 
      customers: pageItems, 
      currentPage: currentPage,
      totalPages: totalPages,
      access_token_expiry: process.env.ACCESS_TOKEN_EXPIRY_IN_SECONDS,
      site_title: 'Customers',
    });
  } else {
    // Calculate the number of items to skip based on the page
    const skip = (page - 1) * customization_settings.items_per_page;

    // Use the find method to get all customers
    const customers = await Customer.find()
      .lean()
      .sort(sortOptions)
      .skip(skip) // Skip invoices based on the current page
      .limit(customization_settings.items_per_page); // Limit to the number of items per page

    // Count the total number of invoices for pagination
    const totalCustomers = await Customer.countDocuments();
    
    // Calculate total pages
    const totalPages = Math.ceil(totalCustomers / customization_settings.items_per_page);


    // Loop through the customers array and update the format of the created_on field
    const updatedCustomers = customers.map((customer) => {
      let name;
      if (customer.personal_information.company) {
        name = customer.personal_information.company;
      } else {
        name = customer.personal_information.first_name + " " + customer.personal_information.last_name
      }

      return {
        ...customer,
        name: name,
        created_on: formatDate(customer.created_on, user_settings), // Change the locale based on your requirements
        amount_due: "placeholder",
        user: user_settings
      };
    });

    if (sort_by === "customer") {
      // Sort the updated customers based on name
      updatedCustomers.sort((a, b) => {
          const nameA = a.name.toLowerCase(); // Case insensitive sorting
          const nameB = b.name.toLowerCase();
  
          if (sort_order === 'asc') {
              if (nameA < nameB) return -1; // nameA comes before nameB
              if (nameA > nameB) return 1; // nameA comes after nameB
          } else if (sort_order === 'desc') {
              if (nameA > nameB) return -1; // nameA comes before nameB (for descending)
              if (nameA < nameB) return 1; // nameA comes after nameB (for descending)
          }
          return 0; // names are equal
      });
    }
  
  
    // Send the sorted invoices and pagination info back as JSON
    res.json({ data: updatedCustomers, totalPages, currentPage: parseInt(page), user_settings: user_settings });
  }
});

module.exports = router;
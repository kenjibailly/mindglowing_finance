const express = require('express');
const router = express.Router();
const Project = require('../../models/project');
const Customer = require('../../models/customer');
const Customization = require('../../models/customization');
const User = require('../../models/user');
const authenticateToken = require('../security/authenticate');
const paginateArray = require('../pagination/pagination');

/* GET /projects page. */
router.get('/', authenticateToken, async function(req, res, next) {
  // Get the session user that's logged in
  const user = req.session.user;
  // If the user is logged in
    if(!user) {
        // Render the login page
        return res.redirect('/login');
    }
    
    // Use the find method to get all projects
    const projects = await Project.find().lean();

    // Add the customer info to the projects array
    const projectsWithCustomerInfo = await Promise.all(projects.map(async (project) => {
        // Fetch customer information based on customer_id
        const customer = await Customer.findOne({ _id: project.customer_id });
      
        // If customer is found, add first_name and last_name to the project
        if (customer) {
            project.customer = {
                first_name: customer.personal_information.first_name,
                last_name: customer.personal_information.last_name,
                // You can include other customer details here if needed
              };
        }
        return project;
    }));

    // Check if success is true in the url
    const success_query = req.query.success;
    var success;
    if(success_query == "") {
        success = true;
    }

    // Use the find method to get the customization settings
    const customization = await Customization.findOne();

    // Pagination
    const { pageItems, currentPage, totalPages } = paginateArray(projectsWithCustomerInfo, customization.items_per_page, parseInt(req.query.page) || 1);


    // Use the find method to get the user settings
    const user_settings = await User.findOne({ username: user.username });
    res.render('projects/projects', { 
      user: user_settings, 
      projects: pageItems, 
      currentPage: currentPage,
      totalPages: totalPages,
      success: success,
      access_token_expiry: process.env.ACCESS_TOKEN_EXPIRY_IN_SECONDS,
      site_title: 'Projects',
    });

});

module.exports = router;
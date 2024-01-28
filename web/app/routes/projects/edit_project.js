const express = require('express');
const router = express.Router();
const Project = require('../../models/project');
const Customer = require('../../models/customer');
const authenticateToken = require('../security/authenticate');
const User = require('../../models/user');

// Get the project page by id
router.get('/:id', authenticateToken, async function(req, res, next) {
    // Get the session user that's logged in
    const user = req.session.user;
    // If the user is logged in
      if(!user) {
          // Render the login page
          return res.redirect('/login');
      }
      try {
        // Use the find method to get the project by id
        const project = await Project.findById(req.params.id);
        // Use the find method to get the customer by id
        const customer = await Customer.findById(project.customer_id);
        // Add the customer info to the project
        if (customer) {
            // Access customer information and add it to the project object
            project.customer = {
              first_name: customer.personal_information.first_name,
              last_name: customer.personal_information.last_name,
              // Add other customer details as needed
            };
        }
         // Use the find method to get all customers
        const customers = await Customer.find().lean();
        // Use the find method to get the user settings
        const user_settings = await User.findOne({ username: user.username });
        // Check if success is true in the url
        const success = req.query.success;
        // Render the projects page
        res.render('projects/edit_project', { 
          user: user_settings, 
          project: project, 
          customer: customer,
          customers: customers,
          access_token_expiry: process.env.ACCESS_TOKEN_EXPIRY_IN_SECONDS, 
          user_settings: user_settings, 
          success: success,
          site_title: 'Edit Project',
        });
      } catch (error) {
        console.error(error);
        res.render('projects/projects', { username: user.username, access_token_expiry: process.env.ACCESS_TOKEN_EXPIRY_IN_SECONDS});
    }
  });
  
  
  // Handle the update request
  router.post('/:id', authenticateToken, async (req, res) => {
    try {
        const projectId = req.params.id;
        console.log(projectId);
        const { 
          name, 
          customer_id, 
          description 
        } = req.body;
  
        // Update the project in the database
        const result = await Project.findByIdAndUpdate(
          projectId,
          { $set: { name, customer_id, description } },
          { new: true }
        );
  
        if (!result) {
            return res.status(404).send('Project not found');
        }
        // Get the project
        const project = await Project.findById(req.params.id);
        return res.redirect('/projects/edit/' + project.id + '?success=true');
        } catch (error) {
            console.error(error);
            res.status(500).send('Internal Server Error');
        }
});

module.exports = router;
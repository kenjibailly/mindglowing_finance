const express = require('express');
const router = express.Router();
const Project = require('../../models/project');
const Customer = require('../../models/customer');
const User = require('../../models/user');
const authenticateToken = require('../security/authenticate');

/* GET /project/create page. */
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

    // Get all customers
    const customers = await Customer.find();
    
    // Render the create projects page
    res.render('projects/create_project', { 
        user: user_settings, 
        customers: customers,
        access_token_expiry: process.env.ACCESS_TOKEN_EXPIRY_IN_SECONDS, 
        user_settings: user_settings,
        site_title: 'Create Project',
    });

});

// Handle the POST request to add a project
router.post('/', authenticateToken, async (req, res) => {
    // Extract form data from the request
    const { 
        project_name, 
        customer_id,
        description 
    } = req.body;

    try {
        // Create a new item instance with the form details
        const newProject = new Project({
            name: project_name,
            customer_id,
            description,
        });

        // Save the item to the database
        const savedProject = await newProject.save();
        res.redirect('/projects');
    } catch (error) {
        console.error(error);

        // Check if the error is a duplicate key violation
        if (error.code === 11000 && error.keyPattern && error.keyPattern['name']) {
            // Duplicate name error
            res.status(400).json({ message: 'Item with the same name already exists' });
        } else {
            // Other internal server error
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }
});

module.exports = router;
const express = require('express');
const router = express.Router();
const Project = require('../../models/project');
const Customer = require('../../models/customer');
const User = require('../../models/user');
const Customization = require('../../models/customization');
const authenticateToken = require('../security/authenticate');
const formatDateTime = require('../formatters/date_time_formatter');
const paginateArray = require('../pagination/pagination');

// Get the project page by id
router.get('/:id', authenticateToken, async function(req, res, next) {
    // Get the session user that's logged in
    const user = req.session.user;
    // Get the project id
    const project_id = req.params.id;
    // If the user is logged in
      if(!user) {
          // Render the login page
          return res.redirect('/login');
      }
      try {
        // Use the find method to get project by id
        const project = await Project.findById(project_id);
        const customer = await Customer.findOne({ _id: project.customer_id });
        // Add the customer info to the project
        if (customer) {
          var customer_name;
          // Add customer information to the invoice
          if (customer.personal_information.company) {
            customer_name = customer.personal_information.company;
          } else {
            customer_name = customer.personal_information.first_name + " " + customer.personal_information.last_name;
          }
          // Access customer information and add it to the project object
          project.customer = {
            name: customer_name,
          };
        }

        // Use the find method to get the user settings
        const user_settings = await User.findOne({ username: user.username });

        // Get the current time
        const currentTime = new Date();

        const timeTrackingArray = project.timeTracking.map(entry => {
          var timePassed = Math.floor((currentTime - entry.start) / 1000); // in seconds
          // Check if there's already a stop time, then format that time and change the timePassed
          var stop = "";
          if (entry.stop) {
            stop = formatDateTime(entry.stop, user_settings);
            timePassed = Math.floor((entry.stop - entry.start) / 1000);
          }
          return {
              _id: entry._id,
              name: entry.name, // Assuming you have a 'name' property in your timeTracking entry
              start: formatDateTime(entry.start, user_settings),
              stop: stop,
              timePassed: formatTime(timePassed),
          };
        });

        // Calculate the total time passed of all the time tracking
        // Calculate total seconds
        const totalSeconds = timeTrackingArray.reduce((total, entry) => {
          const [hours, minutes, seconds] = entry.timePassed.split(':').map(Number);
          return total + hours * 3600 + minutes * 60 + seconds;
        }, 0);
        // Use your formatTime function to get the formatted result
        const totalTimePassed = formatTime(totalSeconds);

        // Use the find method to get the customization settings
        const customization = await Customization.findOne();

        // Pagination
        const { pageItems, currentPage, totalPages } = paginateArray(timeTrackingArray, customization.items_per_page, parseInt(req.query.page) || 1);

        // Render the items page
        res.render('projects/project', { 
          user: user_settings, 
          project: project, 
          totalTimePassed: totalTimePassed,
          customization: customization,
          timeTracking: pageItems,
          currentPage: currentPage,
          totalPages: totalPages,
          access_token_expiry: process.env.ACCESS_TOKEN_EXPIRY_IN_SECONDS, 
          user_settings: user_settings, 
          site_title: 'Project',
        });
      } catch (error) {
        console.error(error);
        res.render('projects/projects', { username: user.username, access_token_expiry: process.env.ACCESS_TOKEN_EXPIRY_IN_SECONDS});
    }
  });

  function formatTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    const formattedTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
    return formattedTime;
}

  module.exports = router;
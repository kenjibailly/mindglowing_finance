const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Project = require('../../models/project');
const Invoice = require('../../models/invoice');
const User = require('../../models/user');
const Customization = require('../../models/customization');
const authenticateToken = require('../security/authenticate');
const formatDateTime = require('../formatters/date_time_formatter');
const formatTime = require('../formatters/time_formatter');

// Get the project page by id
router.get('/:id', authenticateToken, async function(req, res, next) {
    // Get the session user that's logged in
    const user = req.session.user;
    // Get the project id
    const project_id = req.params.id;
    const { page = 1 } = req.query;
    // If the user is logged in
    if(!user) {
        // Render the login page
        return res.redirect('/login');
    }
    try {
      
      // Use the find method to get the user settings
      const user_settings = await User.findOne({ username: user.username });

      // Use the find method to get the customization settings
      const customization_settings = await Customization.findOne();

      // Calculate the number of items to skip based on the page
      const skip = (page - 1) * customization_settings.items_per_page;


      const projectObjectId = new mongoose.Types.ObjectId(project_id);

      let project = await Project.aggregate([
        // Match the project by its project_id
        {
          $match: {
            _id: projectObjectId
          }
        },
        // Convert customer_id to ObjectId if stored as a string
        {
          $addFields: {
            customer_id: { $toObjectId: "$customer_id" } // Only if customer_id is stored as a string
          }
        },
        // Join with Customer collection to get customer details
        {
          $lookup: {
            from: "customers",
            localField: "customer_id",
            foreignField: "_id",
            as: "customer_details"
          }
        },
        {
          $unwind: {
            path: "$customer_details",
            preserveNullAndEmptyArrays: true // Keeps the project even if no customer is found
          }
        },
        // Add a new field customer_name based on personal_information from the customer_details
        {
          $addFields: {
            customer_name: {
              $cond: {
                if: { $or: [{ $eq: ["$customer_details.personal_information.company", ""] }, { $eq: ["$customer_details.personal_information.company", null] }] },
                then: { $concat: ["$customer_details.personal_information.first_name", " ", "$customer_details.personal_information.last_name"] },
                else: "$customer_details.personal_information.company"
              }
            }
          }
        },
        // Calculate total time for timeTracking in seconds
        {
          $addFields: {
            total_time_seconds: {
              $reduce: {
                input: {
                  $map: {
                    input: "$timeTracking",
                    as: "entry",
                    in: {
                      $cond: {
                        if: { $ifNull: ["$$entry.stop", false] },
                        then: {
                          $divide: [{ $subtract: ["$$entry.stop", "$$entry.start"] }, 1000] // Stop - Start in seconds
                        },
                        else: {
                          $divide: [{ $subtract: [new Date(), "$$entry.start"] }, 1000] // Ongoing (current time - start)
                        }
                      }
                    }
                  }
                },
                initialValue: 0,
                in: { $add: ["$$value", "$$this"] }
              }
            }
          }
        },
        // Add formatted total_time to the project as well (for easy display) without fractional seconds
        {
          $addFields: {
            total_time: {
              $let: {
                vars: {
                  total_seconds: { $floor: "$total_time_seconds" }, // Correctly floor total_time_seconds to remove fraction
                  hours: { $floor: { $divide: [{ $floor: "$total_time_seconds" }, 3600] } },
                  minutes: { $mod: [{ $floor: { $divide: [{ $floor: "$total_time_seconds" }, 60] } }, 60] },
                  seconds: { $mod: [{ $floor: "$total_time_seconds" }, 60] } // Floor seconds as well
                },
                in: {
                  $concat: [
                    { $toString: "$$hours" }, ":",
                    { $cond: [{ $gte: ["$$minutes", 10] }, { $toString: "$$minutes" }, { $concat: ["0", { $toString: "$$minutes" }] }] }, ":",
                    { $cond: [{ $gte: ["$$seconds", 10] }, { $toString: "$$seconds" }, { $concat: ["0", { $toString: "$$seconds" }] }] }
                  ]
                }
              }
            }
          }
        },
        // Paginate timeTracking array
        {
          $addFields: {
            timeTracking: { $slice: ["$timeTracking", skip, customization_settings.items_per_page] }, // Apply pagination here
            total_timeTracking_count: { $size: "$timeTracking" } // Count the total number of timeTracking entries
          }
        },
      ]);
      

      project = project[0];

      // Get the current time
      const currentTime = new Date();

      const timeTrackingArray = project.timeTracking.map(entry => {
        let timePassed = Math.round((currentTime - entry.start) / 1000); // in seconds
        // Check if there's already a stop time, then format that time and change the timePassed
        let stop = "";
        if (entry.stop) {
          stop = formatDateTime(entry.stop, user_settings);
          timePassed = Math.round((entry.stop - entry.start) / 1000);
        }
        return {
            _id: entry._id,
            name: entry.name, // Assuming you have a 'name' property in your timeTracking entry
            start: formatDateTime(entry.start, user_settings),
            stop: stop,
            timePassed: formatTime(timePassed),
        };
      });

      // Calculate total pages
      const totalPages = Math.ceil(project.total_timeTracking_count / customization_settings.items_per_page);

      // Find the invoice which is billed
      const invoice = await Invoice.findOne(
        { 'project_billed.id': project_id }, // Filter by project_billed.id
        { _id: 1, number: 1 } // Project only the _id and number fields
      );      

      // Render the items page
      res.render('projects/project', { 
        user: user_settings, 
        project: project, 
        invoice: invoice,
        customization: customization_settings,
        timeTracking: timeTrackingArray,
        currentPage: parseInt(page),
        totalPages: totalPages,
        access_token_expiry: process.env.ACCESS_TOKEN_EXPIRY_IN_SECONDS, 
        user_settings: user_settings, 
        site_title: 'Project',
      });
    } catch (error) {
      logger.error(error);
      // Render the products page
      return res.render('projects/projects', { 
        access_token_expiry: process.env.ACCESS_TOKEN_EXPIRY_IN_SECONDS, 
        site_title: 'Projects',
        error: error,
      });
    }
});

  module.exports = router;
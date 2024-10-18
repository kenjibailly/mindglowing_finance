const express = require('express');
const router = express.Router();
const Project = require('../../models/project');
const Customization = require('../../models/customization');
const User = require('../../models/user');
const authenticateToken = require('../security/authenticate');
const formatTime = require('../formatters/time_formatter');
const formatDateTime = require('../formatters/date_time_formatter');

/* GET /projects page. */
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

        const updatedProjectsWithCustomerInfo = await Project.aggregate([
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
                preserveNullAndEmptyArrays: true // Keeps the invoice even if no customer is found
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
            // Sort by the specified field, and add _id as a secondary sort key
            {
                $sort: {
                created_on: -1, // Descendng order by created_on
                _id: 1 // Always sort by _id as the secondary key to ensure stable sorting
                }
            },
            // Apply pagination after sorting
            { $skip: skip },
            { $limit: customization_settings.items_per_page }
        ]);

        // Count the total number of invoices
        const totalProjects = await Project.countDocuments();

        // Calculate total pages
        const totalPages = Math.ceil(totalProjects / customization_settings.items_per_page);


        // Add the customer info to the projects array
        const projectsWithCustomerInfo = await Promise.all(updatedProjectsWithCustomerInfo.map(async (project) => {

            // Get the current time
            const currentTime = new Date();
            
            // Calculate total time tracking for the current project
            const timeTrackingArray = project.timeTracking.map(entry => {
                var timePassed = Math.round((currentTime - entry.start) / 1000); // in seconds
                // Check if there's already a stop time, then format that time and change the timePassed
                var stop = "";
                if (entry.stop) {
                    stop = formatDateTime(entry.stop, user_settings);
                    timePassed = Math.round((entry.stop - entry.start) / 1000);
                }
                return {
                    _id: entry._id,
                    name: entry.name,
                    start: formatDateTime(entry.start, user_settings),
                    stop: stop,
                    timePassed: formatTime(timePassed),
                };
            });

            // Calculate the total time passed of all the time tracking for the current project
            const totalSeconds = timeTrackingArray.reduce((total, entry) => {
                const [hours, minutes, seconds] = entry.timePassed.split(':').map(Number);
                return total + hours * 3600 + minutes * 60 + seconds;
            }, 0);

            // Use your formatTime function to get the formatted result
            const totalTimePassed = formatTime(totalSeconds);

            return {
                ...project,
                total_time: totalTimePassed // Add total time to the project
            };
        }));

        // Check if success is true in the url
        const success_query = req.query.success;
        var success;
        if(success_query == "") {
            success = true;
        }

        return res.render('projects/projects', { 
            user: user_settings, 
            projects: projectsWithCustomerInfo, 
            currentPage: parseInt(page),
            totalPages: totalPages,
            success: success,
            access_token_expiry: process.env.ACCESS_TOKEN_EXPIRY_IN_SECONDS,
            site_title: 'Projects',
        });        
    } catch (error) {
        logger.error(error);
        res.render('projects/projects', { 
            error: error,
            access_token_expiry: process.env.ACCESS_TOKEN_EXPIRY_IN_SECONDS,
            site_title: 'Projects',
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

    const { sort_by, sort_order = 'asc', reload = true, page = 1 } = req.query;

    const sortDirection = sort_order === 'asc' ? 1 : -1;
    const sortOptions = {};
    sortOptions[sort_by] = sortDirection;

    try {
        // Use the find method to get the user settings
        const user_settings = await User.findOne({ username: user.username });

        // Use the find method to get the customization settings
        const customization_settings = await Customization.findOne();

        // Calculate the number of items to skip based on the page
        const skip = (page - 1) * customization_settings.items_per_page;

        const updatedProjectsWithCustomerInfo = await Project.aggregate([
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
            // Convert project.billed to "Yes" or "No"
            {
                $addFields: {
                    billed: {
                        $cond: { if: { $eq: ["$billed", true] }, then: "Yes", else: "No" }
                    }
                }
            },
            // Sort by the specified field, including the newly calculated total_time_seconds if needed
            {
                $sort: {
                    [sort_by === 'total_time' ? 'total_time_seconds' : sort_by]: sort_order === 'asc' ? 1 : -1, // Sort dynamically based on the field selected
                    _id: 1 // Always sort by _id as the secondary key to ensure stable sorting
                }
            },
            // Apply pagination after sorting
            { $skip: skip },
            { $limit: customization_settings.items_per_page }
        ]);
        
        // Count the total number of invoices
        const totalProjects = await Project.countDocuments();

        // Calculate total pages
        const totalPages = Math.ceil(totalProjects / customization_settings.items_per_page);

        if (reload === 'true') {  

            const link_options = `?sort_by=${sort_by}&sort_order=${sort_order}&reload=true`;

            // Render the projects page
            return res.render('projects/projects', { 
                user: user_settings, 
                projects: updatedProjectsWithCustomerInfo, 
                currentPage: parseInt(page),
                totalPages: totalPages,
                link_options: link_options,
                access_token_expiry: process.env.ACCESS_TOKEN_EXPIRY_IN_SECONDS,
                site_title: 'Products',
            });
        } else {

            // Send the sorted invoices and pagination info back as JSON
            return res.json({ data: updatedProjectsWithCustomerInfo, totalPages, currentPage: parseInt(page), user_settings: user_settings });
        }
    } catch (error) {
        logger.error(error);
        
        if (reload === 'true') {  
            // Render the products page
            return res.render('projects/projects', { 
              access_token_expiry: process.env.ACCESS_TOKEN_EXPIRY_IN_SECONDS, 
              site_title: 'Projects',
              error: error,
            });
        } else {
            return res.json({error: "error"})
        }
    }

});


module.exports = router;
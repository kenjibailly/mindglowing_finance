import express, { Request, Response } from "express";
import Project from "../../../models/project";
import User from "../../../models/user";
import { authenticateToken } from "../../security/authenticate";

const router = express.Router({ mergeParams: true });

// Get the project page by id
router.get("/", authenticateToken, async function (req, res, next) {
  // Get the session user that's logged in
  const user = req.session.user;
  // Get the projectId
  const projectId = req.params.project_id;
  // If the user is logged in
  if (!user) {
    // Render the login page
    return res.redirect("/login");
  }
  try {
    // Use the find method to get the user settings
    const user_settings = await User.findOne({ username: user.username });
    // Get the project
    const project = await Project.findOne({ _id: projectId });
    // Get the current time
    const currentTime = new Date();
    // Filter timeTracking entries with no stop date
    const activeTimeTrackings = project.timeTracking.filter(
      (entry) => !entry.stop
    );

    // Create an array with relevant information and calculate timePassed
    const timeTrackingArray = activeTimeTrackings.map((entry) => {
      const timePassed = Math.floor((currentTime - entry.start) / 1000); // in seconds
      return {
        name: entry.name, // Assuming you have a 'name' property in your timeTracking entry
        start: entry.start,
        timePassed: timePassed,
      };
    });

    // Now, timeTrackingArray contains the information for active timeTrackings
    logger.log(timeTrackingArray);

    // Render the items page
    res.render("projects/time_tracking/time_tracking", {
      user: user_settings,
      project_id: req.params.id,
      timeTracking: timeTrackingArray,
      access_token_expiry: process.env.ACCESS_TOKEN_EXPIRY_IN_SECONDS,
      user_settings: user_settings,
      site_title: "Time Tracking",
    });
  } catch (error) {
    logger.error(error);
    res.render("projects/time_tracking/time_tracking", {
      username: user.username,
      access_token_expiry: process.env.ACCESS_TOKEN_EXPIRY_IN_SECONDS,
    });
  }
});

export default router;

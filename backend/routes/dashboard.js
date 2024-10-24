const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const authenticateToken = require("./security/authenticate.js");

/* GET home page. */
router.get("/", authenticateToken, async function (req, res, next) {
  // Get the session user that's logged in
  const user = req.session.user;
  // If the user is logged in
  if (user) {
    // Find the user by username
    User.findOne({ username: user.username })
      .then((user) => {
        // If user is logged in and setup is true
        if (user && user.setup === true) {
          res.redirect("/setup");
          // If user is logged in and setup is false
        } else if (user && user.setup === false) {
          // Render the dashboard page
          res.render("dashboard", {
            access_token_expiry: process.env.ACCESS_TOKEN_EXPIRY_IN_SECONDS,
            site_title: "Dashboard",
            user: user,
          });
        } else {
          logger.log("User not found or setup is false.");
          // Handle the case where the user is not found or setup is false
        }
      })
      .catch((error) => {
        logger.error("Error:", error);
        // Handle any errors that occurred during the query
      });
  } else {
    // Redirect to the login page
    res.redirect("/login");
  }
});

module.exports = router;

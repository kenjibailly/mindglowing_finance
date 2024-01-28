const express = require('express');
const router = express.Router();
const User = require('../models/user.js');
const authenticateToken = require('./security/authenticate.js');

/* GET home page. */
router.get('/', authenticateToken, function(req, res, next) {
  // Get the session user that's logged in
  const user = req.session.user;
  // If the user is logged in
  if(user) {
    // Find the user by username
    User.findOne({ username: user.username })
      .then((user) => {
        // If user is logged in and setup is true
        if (user && user.setup === true) {
          res.redirect('/setup');
          // If user is logged in and setup is false
        } else if (user && user.setup === false) {
          // Render the dashboard page
          res.redirect('/dashboard');
        } else {
          console.log('User not found or setup is false.');
          // Handle the case where the user is not found or setup is false
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        // Handle any errors that occurred during the query
      });
  } else {
    // Redirect to the login page
    res.redirect('/login');
  }

});

module.exports = router;

const express = require('express');
const router = express.Router();
const User = require('../models/user.js');
const authenticateToken = require('./security/authenticate.js');

/* GET home page. */
router.get('/', authenticateToken, function(req, res, next) {
    // Get the session user that's logged in
    const user = req.session.user;
    // If the user is logged in
    if(!user) {
        // Render the login page
        return res.redirect('/login');
    }
    // Render the setup page
    res.render('setup');
});


router.post('/', authenticateToken, async function(req, res, next) {
    try {
        const user = req.session.user; // Assuming you have the user information in the session

        if (!user) {
            return res.status(401).send('User not authenticated');
        }

        // Extract the date format from the form submission
        const dateFormat = req.body['date-format'];

        // Update the user document in the database
        const updatedUser = await User.findOneAndUpdate(
            { username: user.username },
            { $set: { setup: false, date_format: dateFormat } },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).send('User not found');
        }

        // Redirect or respond as needed
        res.redirect('/');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;
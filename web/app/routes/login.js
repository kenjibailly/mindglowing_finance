const express = require('express');
const router = express.Router();
const User = require('../models/user.js');
const jwt = require('jsonwebtoken');
const config = require('config');
const crypto = require('crypto'); // Import the crypto module

/* GET login page. */
router.get('/', function(req, res, next) {
    // Get the session user that's logged in
    const user = req.session.user;
    // If the user is logged in
    if(user) {
        // Render the index page
        return res.redirect('/');
    } else {
        // Render the login page
        return res.render('login');
    }
});

/* POST login page. */
router.post('/', async function(req, res, next) {
    // Get the session user that's logged in
    const user = req.session.user;
    // If the user is logged in
    if(user) {
        // Render the index page
        return res.redirect('/');
    }

    // Get the username and password from the request
    const { 
        username, 
        password 
    } = req.body;


        // Find the user in the database
        User.findOne({ username }).then((user) => {
            // If user can't be found send error
            if (!user) {
            return res.render('login', { error: "<p class='error'>Invalid username or password</p>" });
            }

            // Hash the entered password
            const hashedEnteredPassword = crypto.createHash('sha256').update(password).digest('hex');

            // If hashed entered password doesn't match stored hashed password send error
            if (user.password !== hashedEnteredPassword) {
            return res.render('login', { error: "<p class='error'>Invalid username or password</p>" });
            }

            // Generate JWT tokens
            const accessToken = jwt.sign({ username: user.username }, process.env.SECRET_KEY, { expiresIn: process.env.ACCESS_TOKEN_EXPIRY_IN_SECONDS+'s' });
            const refreshToken = jwt.sign({ username: user.username }, process.env.SECRET_KEY_REFRESH, { expiresIn: '7d' });

            const cookieOptions = {
                httpOnly: true,
                sameSite: 'Strict',
                secure: config.get('secure_session_cookie'), // Can be found in /app/config/development.json and production.json
            }

            // Creates the token cookie
            res.cookie(
                'token', 
                accessToken, 
                cookieOptions
            )

            // Creates the refresh token cookie
            res.cookie(
                'refreshToken', 
                refreshToken, 
                cookieOptions
            )

            // Creates a session with the user logged in
            req.session.user = { username };

            // Redirects the page to the dashboard
            return res.redirect('/');
        }).catch((error) => {
            logger.log(error)
        });
});

module.exports = router;
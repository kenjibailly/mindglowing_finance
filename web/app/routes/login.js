const express = require('express');
const router = express.Router();
const User = require('../models/user.js');
const jwt = require('jsonwebtoken');

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
    const { username, password } = req.body;

    try {
        // Find the user in the database
        const user = await User.findOne({ username });

        // If user can't be found send error
        if (!user) {
            return res.render('login', { error: "<p class='error'>Invalid username or password</p>" });
        }

        // If password doesn't match user send error
        if (user.password !== password) {
            return res.render('login', { error: "<p class='error'>Invalid username or password</p>" });
        }

        // Generate JWT
        const accessToken = jwt.sign({ username: user.username }, process.env.SECRET_KEY, { expiresIn: '1h' });
        const refreshToken = jwt.sign({ username: user.username }, process.env.SECRET_KEY_REFRESH, { expiresIn: '7d' });

        // Set the JWT and refresh token as cookies
        // res.cookie('token', accessToken, { httpOnly: true, path: '/', expires: new Date(Date.now() + 1 * 3600000) });  // Adjust expiry time
        // res.cookie('refreshToken', refreshToken, { httpOnly: true, path: '/', expires: new Date(Date.now() + 7 * 24 * 3600000) });  // Adjust expiry time

        // Send the tokens in the response
        // res.json({ success: true, token: accessToken, refreshToken: refreshToken });



        const cookieOptions = {
            httpOnly: false,
            sameSite: 'Strict'
        }

        // if(process.env.NODE_ENV === 'production') {
            // these options work on a https server
            cookieOptions.secure = true 
        // }

        res.cookie(
            'token', 
            accessToken, 
            cookieOptions
        )

        res.cookie(
            'refreshToken', 
            refreshToken, 
            cookieOptions
        )



        // Creates a session with the user logged in
        req.session.user = { username };

        // Redirects the page to the dashboard
        return res.redirect('/');
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
});

module.exports = router;
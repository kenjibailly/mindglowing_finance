const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

// Replace this with your secret key
const secretKey = process.env.SECRET_KEY;

// Endpoint for token renewal
router.post('/renew-token', (req, res) => {
  // Extract the token from the request
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({ success: false, message: 'Refresh token not provided' });
  }

  try {
    // Verify the refresh token
    const decoded = jwt.verify(refreshToken, process.env.SECRET_KEY_REFRESH);

    // Log details for debugging
    console.log('Decoded Refresh Token:', decoded);

    // Generate a new access token
    const accessToken = jwt.sign({ username: decoded.username }, process.env.SECRET_KEY, { expiresIn: '1h' });

    const cookieOptions = {
      httpOnly: false,    // safety, does not allow cookie to be read in the frontend javascript
      sameSite: 'Strict' // works for local development
    }

    // if(process.env.NODE_ENV === 'production') {

        // these options work on a https server
        // cookieOptions.secure = true 
        // cookieOptions.sameSite= 'None'
    // }

    res.cookie(
        'token', 
        accessToken, 
        cookieOptions
    )

    // Send the new access token in the response
    // res.cookie('token', accessToken, { httpOnly: true });
    res.json({ success: true, token: accessToken });
  } catch (error) {
    console.error('Error verifying refresh token:', error);
    res.status(401).json({ success: false, message: 'Invalid refresh token' });
  }
});

module.exports = router;
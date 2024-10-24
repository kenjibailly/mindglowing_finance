const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const config = require('config')

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

    // Generate a new JWT access token
    const accessToken = jwt.sign({ username: decoded.username }, process.env.SECRET_KEY, { expiresIn: process.env.ACCESS_TOKEN_EXPIRY_IN_SECONDS+'s' });

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

    return res.json({ success: true, token: accessToken });
  } catch (error) {
    logger.error('Error verifying refresh token:', error);
    return res.status(401).json({ success: false, message: 'Invalid refresh token' });
  }
});

module.exports = router;
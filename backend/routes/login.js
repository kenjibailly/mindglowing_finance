const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const jwt = require("jsonwebtoken");
const config = require("config");
const crypto = require("crypto"); // Import the crypto module

/* POST login. */
router.post("/", async function (req, res, next) {
  const { username, password } = req.body;

  // Check if user is already logged in
  if (req.session.user) {
    return res.status(200).json({ message: "Already logged in" });
  }

  try {
    // Find the user in the database
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    // Hash the entered password
    const hashedEnteredPassword = crypto
      .createHash("sha256")
      .update(password)
      .digest("hex");

    // Check if the hashed password matches
    if (user.password !== hashedEnteredPassword) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    // Generate JWT tokens
    const accessToken = jwt.sign(
      { username: user.username },
      process.env.SECRET_KEY,
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRY_IN_SECONDS + "s" }
    );
    const refreshToken = jwt.sign(
      { username: user.username },
      process.env.SECRET_KEY_REFRESH,
      { expiresIn: "7d" }
    );

    const cookieOptions = {
      httpOnly: true,
      sameSite: "Strict",
      secure: config.get("secure_session_cookie"),
    };

    // Send cookies for the tokens
    res.cookie("token", accessToken, cookieOptions);
    res.cookie("refreshToken", refreshToken, cookieOptions);

    // Set the user in the session
    req.session.user = { username };

    // Send success response
    return res.status(200).json({ message: "Login successful" });
  } catch (error) {
    logger.log(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;

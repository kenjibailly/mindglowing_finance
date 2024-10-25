const express = require("express");
const router = express.Router();
const authenticateToken = require("./authenticate");

// Endpoint to check authentication
router.get("/", authenticateToken, (req, res) => {
  // Check if session or user info is available
  if (req.session && req.session.user) {
    res.json({ isAuthenticated: true });
    logger.success("Authenticated");
  } else {
    res.json({ isAuthenticated: false });
    logger.warn("Not Authenticated");
  }
});

module.exports = router;

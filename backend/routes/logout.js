const express = require("express");
const router = express.Router();

router.post("/", (req, res) => {
  // Destroy the user session
  req.session.destroy((err) => {
    if (err) {
      logger.error("Error destroying session:", err);
      return res.status(401).json({ error: "Invalid username or password" });
    } else {
      // Redirect to home after logging out
      return res.status(200).json({ message: "Logout successful" });
    }
  });
});

module.exports = router;

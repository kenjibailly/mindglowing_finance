const jwt = require("jsonwebtoken");

function authenticateToken(req, res, next) {
  const token = req.cookies.token; // Assuming token is in cookies
  if (!token) {
    return res.status(401).json({ message: "Unauthorized, please log in" });
  }

  jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
    if (err) {
      logger.error("Invalid or expired token");
      return res
        .status(403)
        .json({ message: "Invalid or expired token, please log in" });
    }

    req.user = user;
    next();
  });
}

module.exports = authenticateToken;

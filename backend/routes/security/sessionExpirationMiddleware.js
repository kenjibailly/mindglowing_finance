// sessionExpirationMiddleware.js
function sessionExpirationMiddleware(req, res, next) {
    // Check if the session exists and has an expiration time
    if (req.session && req.session.cookie && req.session.cookie.expires) {
      const currentTime = new Date();
      const sessionExpirationTime = new Date(req.session.cookie.expires);
  
      // Check if the session has expired
      if (currentTime > sessionExpirationTime) {
        // Destroy the user session
        req.session.destroy(err => {
          if (err) {
            logger.error('Error destroying session:', err);
          }
        });
      }
    }
  
    // Continue with the next middleware or route handler
    next();
  }
  
  module.exports = sessionExpirationMiddleware;
  
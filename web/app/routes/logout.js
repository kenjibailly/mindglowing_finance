const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    // Destroy the user session
    req.session.destroy(err => {
        if (err) {
            console.error('Error destroying session:', err);
        } else {
            // Redirect to home after logging out
            res.redirect('/login');
        }
    });
});

module.exports = router;
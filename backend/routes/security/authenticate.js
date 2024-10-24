const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
    const token = req.cookies.token; // Assuming you store the token in a cookie

    if (!token) {
        // Redirect to the login page
        return res.redirect('/logout');
    }

    jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
        if (err) {
            // Redirect to the login page
            return res.redirect('/logout');
        }

        req.user = user;
        next();
    });
}

module.exports = authenticateToken;
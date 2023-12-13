const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
    const token = req.cookies.token; // Assuming you store the token in a cookie

    if (!token) {
        return res.status(401).send('Unauthorized');
    }

    jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
        if (err) {
            return res.status(403).send('Forbidden');
        }

        req.user = user;
        next();
    });
}

module.exports = authenticateToken;
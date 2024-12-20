if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    const token = req.cookies.token;
    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.SECRET);
            req.user = { userId: decoded.userId };
            next();
        } catch (err) {
            return res.status(403).send("Access denied.");
        }
    } else {
        return res.status(401).send("No token provided.");
    }
};

module.exports = { authenticateToken };

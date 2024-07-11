if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
    // const token = req.header('Authorization')?.split(' ')[1];
    // if (!token) return res.status(401).send('Access denied');
    // jwt.verify(token, process.env.SECRET, (err, user) => {
    //     if (err) return res.status(403).send('Invalid token');
    //     req.user = user;
    //     next();
    // });
    next();
}

module.exports = { authenticateToken };

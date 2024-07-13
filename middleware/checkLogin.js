if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const jwt = require('jsonwebtoken');

const addUserToLocals = async (req, res, next) => {
    const token = req.cookies.token;
    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.SECRET);
            res.locals.isLoggedIn = true;
            res.locals.userId = decoded.userId;
        } catch (err) {
            res.locals.isLoggedIn = false;
        }
    } else {
        res.locals.isLoggedIn = false;
    }
    next();
};

module.exports = { addUserToLocals };
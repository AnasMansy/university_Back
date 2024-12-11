// middleware/protect.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]; // Get the token from the Authorization header

    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify token with secret
        req.user = await User.findById(decoded.id); // Find the user based on the decoded token
        next(); // Proceed to the next middleware or route
    } catch (err) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};

module.exports = protect;

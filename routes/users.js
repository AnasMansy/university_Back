// routes/users.js
const express = require('express');
const User = require('../models/User'); // Import the User model
const protect = require('../middleware/protect'); // Import the protect middleware
const router = express.Router();
router.get('/me', protect, async (req, res) => {
    try {
        // The user is already added to req.user by the protect middleware
        const user = req.user;

        // Returning more details, such as name, major, term, etc.
        const userInfo = {
            name: user.name,
            major: user.major,
            term: user.term,
            email: user.email,
            // Add more fields as needed
        };

        res.status(200).json(userInfo); // Return the user information as JSON
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user information', error: error.message });
    }
});


module.exports = router;

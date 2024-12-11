const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// Login Route
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Check if user exists
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: 'Invalid username or password' });
        }

        // Check password match
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid username or password' });
        }

        // Create JWT token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({
            message: 'Login successful',
            token
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
// Logout Route
router.post('/logout', (req, res) => {
    // Log the user out by just deleting the token in the frontend
    res.json({ message: 'Logout successful' });
});

// Signup Route
router.post('/signup', async (req, res) => {
    const { username, password, email, fullName, role } = req.body;

    try {
        const userExists = await User.findOne({ username });
        if (userExists) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            username,
            password: hashedPassword,
            email,
            fullName,
            role
        });

        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});







// Middleware to verify JWT token and extract user information
const protect = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]; // Extract token from Authorization header

    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify the token with secret
        req.user = decoded; // Save decoded user data (id, role, etc.) in request object
        next(); // Proceed to the next middleware or route handler
    } catch (err) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};

// GET: Retrieve logged-in user's role
router.get('/role', protect, async (req, res) => {
    try {
        // Retrieve user data from database (if needed, based on the token data)
        const user = await User.findById(req.user.id); // Assuming you store the user's ID in the token

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Send the user's role in the response
        res.status(200).json({ role: user.role }); // Assuming `role` is a field in the user model
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
   
module.exports = router;

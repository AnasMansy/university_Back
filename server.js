// server.js
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose'); 
const authRoutes = require('./routes/auth');
const bookRoutes = require('./routes/books');
const userRoutes = require('./routes/users'); // Import the user routes
const cartRoutes = require('./routes/cart');
const borrowingRoutes = require('./routes/borrowing'); // Make sure this line is included
const issueRoutes = require('./routes/issues');
const protect = require('./middleware/protect');

require('dotenv').config();  // Load environment variables

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());               // Enable CORS for all requests
app.use(express.json());       // Parse incoming JSON requests
app.use('/api/books', bookRoutes);  // Use the book routes for `/api/books` path 
app.use('/api/auth', authRoutes); 
app.use('/api/users', userRoutes);
app.use('/api/borrowing', borrowingRoutes); // Ensure this line is included
//app.use('/api/issues', issueRoutes);



// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.log('MongoDB connection error:', err));

// Test route
app.get('/', (req, res) => {
  res.send('Book Center Backend is running');
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
 

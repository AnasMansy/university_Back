// models/Book.js
const mongoose = require('mongoose');


const bookSchema = new mongoose.Schema({
  title: String,
  department: String,
  course: String,
  term: String,
  required: Boolean,
  availableCopies: Number,
  digitalCopy: String,  // URL to digital copy if available
  reviews: [{
      rating: Number,
      review: String,
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  }]
});
const jwt = require('jsonwebtoken');
const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(401).send('Access denied');
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).send('Invalid token');
    req.user = user;
    next();
  });
};

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;

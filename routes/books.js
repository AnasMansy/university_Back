// routes/books.js
const express = require('express');
const Book = require('../models/Book');  // Import the Book model
const router = express.Router();



router.post('/', async (req, res) => {
    try {
        console.log(req.body);  // Log the incoming request body to confirm it's correctly parsed

        const { title, author, edition, isbn, availableCopies, digitalCopyAvailable, course, department } = req.body;

        if (!title || !author) {
            return res.status(400).json({ message: "Title and author are required." });
        }

        const newBook = new Book({
            title,
            author,
            edition,
            isbn,
            availableCopies,
            digitalCopyAvailable,
            course,
            department
        });

        const savedBook = await newBook.save();
        res.status(201).json(savedBook);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// GET: Get all books
router.get('/', async (req, res) => {
  try {
    const books = await Book.find();  // Get all books from the database
    res.status(200).json(books);      // Return books as JSON
  } catch (error) {
    res.status(500).json({ message: error.message });  // Return error if database operation fails
  }
});

router.put('/:id', async (req, res) => {
  try {
    const updatedBook = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedBook) return res.status(404).json({ message: 'Book not found' });
    res.status(200).json(updatedBook);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});




router.get('/required', async (req, res) => {
  try {
      const books = await Book.find({ term: req.user.term, required: true });
      res.status(200).json(books);
  } catch (error) {
      res.status(500).json({ message: 'Error fetching required books', error: error.message });
  }
});

// Search for books
router.get('/search', async (req, res) => {
  const { department, course, title } = req.query;
  const filter = {};

  if (department) filter.department = department;
  if (course) filter.course = course;
  if (title) filter.title = new RegExp(title, 'i'); // Case-insensitive search

  try {
      const books = await Book.find(filter);
      res.status(200).json(books);
  } catch (error) {
      res.status(500).json({ message: 'Error searching books', error: error.message });
  }
});

// Get book details
router.get('/:id', async (req, res) => {
  try {
      const book = await Book.findById(req.params.id);
      if (!book) return res.status(404).json({ message: 'Book not found' });

      res.status(200).json(book);
  } catch (error) {
      res.status(500).json({ message: 'Error fetching book details', error: error.message });
  }
});

// Submit a review for a book
router.post('/:id/reviews', async (req, res) => {
  const { rating, review } = req.body;

  try {
      const book = await Book.findById(req.params.id);
      if (!book) return res.status(404).json({ message: 'Book not found' });

      book.reviews.push({ rating, review, user: req.user.id });
      await book.save();

      res.status(201).json({ message: 'Review added successfully', book });
  } catch (error) {
      res.status(500).json({ message: 'Error adding review', error: error.message });
  }
});





module.exports = router;  // Export the router for use in server.js

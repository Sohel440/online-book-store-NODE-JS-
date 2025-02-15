const express = require('express');
const mongoose = require('mongoose');
const { jwtMiddleware } = require('../jwt');
const { Book } = require('../models/book');
const { User } = require('../models/user'); 
const router = express.Router();


const isAdmin = async (userId) => {
    try {
        const user = await User.findById(userId);
        return user && user.role === 'admin';
    } catch (err) {
        console.error(err);
        return false;
    }
};


router.get('/', async (req, res) => {
    try {
        const books = await Book.find();
        console.log("Data fetched!");
        res.status(200).json(books);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error!" });
    }
});


router.post('/add', jwtMiddleware, async (req, res) => {
    try {
        if (!(await isAdmin(req.user.id)))
            return res.status(403).json({ message: 'User does not have admin role' });

        const newBook = new Book(req.body);
        const savedBook = await newBook.save();
        
        console.log('New Book added:', savedBook);
        res.status(201).json(savedBook);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// 🔹 Update book by ID (Admin only)
router.put('/:id', jwtMiddleware, async (req, res) => {
    try {
        if (!(await isAdmin(req.user.id)))
            return res.status(403).json({ message: 'User does not have admin role' });

        const bookId = req.params.id; 
        const updatedData = req.body;

        const updatedBook = await Book.findByIdAndUpdate(bookId, updatedData, {
            new: true,
            runValidators: true
        });

        if (!updatedBook) {
            return res.status(404).json({ error: "Book not found!" });
        }

        console.log("Data updated!");
        res.status(200).json(updatedBook);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


router.delete('/:id', jwtMiddleware, async (req, res) => {
    try {
        if (!(await isAdmin(req.user.id)))
            return res.status(403).json({ message: 'User does not have admin role' });

        const bookId = req.params.id;
        const deletedBook = await Book.findByIdAndDelete(bookId);

        if (!deletedBook) {
            return res.status(404).json({ error: "Book not found!" });
        }

        res.status(200).json({ message: "Book deleted successfully!" });
    } catch (err) {
        console.error("Error deleting book:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router ;


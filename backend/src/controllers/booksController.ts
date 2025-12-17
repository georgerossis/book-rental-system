import { Response } from 'express';
import Book from '../models/Book';
import { AuthRequest } from '../middleware/auth';

export const booksController = {
  getAllBooks: async (req: AuthRequest, res: Response) => {
    try {
      const books = await Book.find().sort({ createdAt: -1 });
      res.json(books);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch books', error });
    }
  },

  createBook: async (req: AuthRequest, res: Response) => {
    try {
      const { title, author, isbn, description, genre, publishedYear, totalCopies } = req.body;
      if (!title || !author || !isbn || !genre || !publishedYear || !totalCopies) {
        return res.status(400).json({ message: 'Missing required fields' });
      }
      const existing = await Book.findOne({ isbn });
      if (existing) return res.status(409).json({ message: 'Book with this ISBN already exists' });

      const book = new Book({
        title,
        author,
        isbn,
        description: description || '',
        genre,
        publishedYear,
        totalCopies,
        availableCopies: totalCopies,
      });
      await book.save();
      res.status(201).json(book);
    } catch (error) {
      res.status(500).json({ message: 'Failed to create book', error });
    }
  },

  updateBook: async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      const book = await Book.findByIdAndUpdate(id, updates, { new: true });
      if (!book) return res.status(404).json({ message: 'Book not found' });
      res.json(book);
    } catch (error) {
      res.status(500).json({ message: 'Failed to update book', error });
    }
  },

  deleteBook: async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;
      const book = await Book.findByIdAndDelete(id);
      if (!book) return res.status(404).json({ message: 'Book not found' });
      res.json({ message: 'Book deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Failed to delete book', error });
    }
  },
};

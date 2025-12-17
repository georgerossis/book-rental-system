import { Router, Response } from 'express';
import Rental from '../models/Rental';
import Book from '../models/Book';
import { authenticateToken, authorizeRole, AuthRequest } from '../middleware/auth';

const router = Router();

// POST /api/rentals  – rent a book (customer)
router.post('/', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { bookId } = req.body;
    const userId = req.user?.id;

    if (!userId || !bookId) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    if (book.availableCopies <= 0) {
      return res.status(400).json({ message: 'No copies available for rent' });
    }

    const dueAt = new Date();
    dueAt.setDate(dueAt.getDate() + 14);

    const rental = new Rental({
      userId,
      bookId,
      dueAt,
      status: 'active',
    });
    await rental.save();

    book.availableCopies -= 1;
    await book.save();

    res.status(201).json(rental);
  } catch (error) {
    res.status(500).json({ message: 'Failed to rent book', error });
  }
});

// GET /api/rentals – list rentals (customer: own, admin: all or by userId)
router.get('/', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { userId } = req.query;
    const query: any = {};

    if (req.user?.role === 'customer') {
      query.userId = req.user.id;
    } else if (userId) {
      query.userId = userId;
    }

    const rentals = await Rental.find(query)
      .populate('userId', 'name email')
      .populate('bookId', 'title author isbn')
      .sort({ createdAt: -1 });

    res.json(rentals);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch rentals', error });
  }
});

// POST /api/rentals/:id/return – return rental (owner or admin)
router.post('/:id/return', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const rental = await Rental.findById(id);

    if (!rental) return res.status(404).json({ message: 'Rental not found' });

    if (req.user?.role === 'customer' && rental.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    if (rental.status !== 'active') {
      return res.status(400).json({ message: 'Rental is not active' });
    }

    rental.status = 'returned';
    rental.returnedAt = new Date();
    await rental.save();

    const book = await Book.findById(rental.bookId);
    if (book) {
      book.availableCopies += 1;
      await book.save();
    }

    res.json(rental);
  } catch (error) {
    res.status(500).json({ message: 'Failed to return rental', error });
  }
});

// POST /api/rentals/:id/cancel – cancel rental (admin only)
router.post(
  '/:id/cancel',
  authenticateToken,
  authorizeRole(['admin']),
  async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;
      const rental = await Rental.findById(id);

      if (!rental) return res.status(404).json({ message: 'Rental not found' });
      if (rental.status !== 'active') {
        return res.status(400).json({ message: 'Rental is not active' });
      }

      rental.status = 'canceled';
      await rental.save();

      const book = await Book.findById(rental.bookId);
      if (book) {
        book.availableCopies += 1;
        await book.save();
      }

      res.json(rental);
    } catch (error) {
      res.status(500).json({ message: 'Failed to cancel rental', error });
    }
  }
);

export default router;

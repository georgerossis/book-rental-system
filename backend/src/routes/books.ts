import { Router } from 'express';
import { booksController } from '../controllers/booksController';
import { authenticateToken, authorizeRole } from '../middleware/auth';

const router = Router();

router.get('/', authenticateToken, booksController.getAllBooks);
router.post('/', authenticateToken, authorizeRole(['admin']), booksController.createBook);
router.put('/:id', authenticateToken, authorizeRole(['admin']), booksController.updateBook);
router.delete('/:id', authenticateToken, authorizeRole(['admin']), booksController.deleteBook);

export default router;

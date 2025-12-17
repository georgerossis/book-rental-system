import { Router, Response } from 'express';
import bcryptjs from 'bcryptjs';
import User from '../models/User';
import { authenticateToken, authorizeRole, AuthRequest } from '../middleware/auth';

const router = Router();

// GET /api/users – list all users (admin)
router.get(
  '/',
  authenticateToken,
  authorizeRole(['admin']),
  async (req: AuthRequest, res: Response) => {
    try {
      const users = await User.find().select('-password').sort({ createdAt: -1 });
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch users', error });
    }
  }
);

// POST /api/users – create user (admin)
router.post(
  '/',
  authenticateToken,
  authorizeRole(['admin']),
  async (req: AuthRequest, res: Response) => {
    try {
      const { name, email, password, role = 'customer' } = req.body;

      if (!name || !email || !password) {
        return res.status(400).json({ message: 'Missing required fields' });
      }

      const existing = await User.findOne({ email });
      if (existing) {
        return res.status(409).json({ message: 'User already exists' });
      }

      const salt = await bcryptjs.genSalt(10);
      const hashedPassword = await bcryptjs.hash(password, salt);

      const newUser = new User({
        name,
        email,
        password: hashedPassword,
        role,
        active: true,
      });
      await newUser.save();

      res.status(201).json({
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        active: newUser.active,
      });
    } catch (error) {
      res.status(500).json({ message: 'Failed to create user', error });
    }
  }
);

// PUT /api/users/:id – update user (admin)
router.put(
  '/:id',
  authenticateToken,
  authorizeRole(['admin']),
  async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;
      const { name, email, role, active, password } = req.body;

      const user = await User.findById(id);
      if (!user) return res.status(404).json({ message: 'User not found' });

      if (name) user.name = name;
      if (email) user.email = email;
      if (role) user.role = role;
      if (typeof active === 'boolean') user.active = active;
      if (password) {
        const salt = await bcryptjs.genSalt(10);
        user.password = await bcryptjs.hash(password, salt);
      }

      await user.save();

      res.json({
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        active: user.active,
      });
    } catch (error) {
      res.status(500).json({ message: 'Failed to update user', error });
    }
  }
);

// DELETE /api/users/:id – delete user (admin)
router.delete(
  '/:id',
  authenticateToken,
  authorizeRole(['admin']),
  async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;
      const user = await User.findByIdAndDelete(id);
      if (!user) return res.status(404).json({ message: 'User not found' });

      res.json({ message: 'User deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Failed to delete user', error });
    }
  }
);

export default router;

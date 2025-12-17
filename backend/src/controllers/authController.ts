import { Response } from 'express';
import jwt from 'jsonwebtoken';
import bcryptjs from 'bcryptjs';
import User from '../models/User';
import { AuthRequest } from '../middleware/auth';

const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';

export const authController = {
  register: async (req: AuthRequest, res: Response) => {
    try {
      const { name, email, password, role = 'customer' } = req.body;
      if (!name || !email || !password) {
        return res.status(400).json({ message: 'Missing required fields' });
      }
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(409).json({ message: 'User already exists' });
      }
      const salt = await bcryptjs.genSalt(10);
      const hashedPassword = await bcryptjs.hash(password, salt);

      const newUser = new User({ name, email, password: hashedPassword, role, active: true });
      await newUser.save();

      const token = jwt.sign(
        { id: newUser._id, email: newUser.email, role: newUser.role },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      res.status(201).json({
        message: 'User registered successfully',
        user: { id: newUser._id, name: newUser.name, email: newUser.email, role: newUser.role },
        token,
      });
    } catch (error) {
      res.status(500).json({ message: 'Registration failed', error });
    }
  },

  login: async (req: AuthRequest, res: Response) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ message: 'Email and password required' });
      }
      const user = await User.findOne({ email });
      if (!user) return res.status(401).json({ message: 'Invalid email or password' });
      if (!user.active) return res.status(403).json({ message: 'User account is inactive' });

      const ok = await bcryptjs.compare(password, user.password);
      if (!ok) return res.status(401).json({ message: 'Invalid email or password' });

      const token = jwt.sign(
        { id: user._id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      res.json({
        message: 'Login successful',
        user: { id: user._id, name: user.name, email: user.email, role: user.role },
        token,
      });
    } catch (error) {
      res.status(500).json({ message: 'Login failed', error });
    }
  },

  verify: async (req: AuthRequest, res: Response) => {
    try {
      if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
      const user = await User.findById(req.user.id).select('-password');
      res.json({ user });
    } catch (error) {
      res.status(500).json({ message: 'Verification failed', error });
    }
  },
};

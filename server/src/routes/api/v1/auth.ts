import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { AuthService } from '../../../services/authService';

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  try {
    const { email, password, username, fullname } = req.body;

    if (!email || !password || !username || !fullname) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const user = await AuthService.createUser(email, password, username, fullname);

    // Generate JWT token
    const token = jwt.sign(
      { id: user.uid, email: user.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      user,
      token,
      message: 'User created successfully'
    });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await AuthService.authenticateUser(email, password);

    // Generate JWT token
    const token = jwt.sign(
      { id: user.uid, email: user.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.json({
      user,
      token,
      message: 'Login successful'
    });
  } catch (error: any) {
    res.status(401).json({ error: error.message });
  }
});

// Get current user profile
router.get('/me', async (req, res) => {
  try {
    // This would use auth middleware to get user ID
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const user = await AuthService.getUserById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// Update profile
router.put('/profile', async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const updates = req.body;
    await AuthService.updateUserProfile(userId, updates);

    res.json({ message: 'Profile updated successfully' });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
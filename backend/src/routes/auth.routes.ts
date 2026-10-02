import { Router } from 'express';
import { register, login, logout, me } from '../controllers/auth.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);

// Protected routes
router.get('/me', authenticateToken, me);

export default router;

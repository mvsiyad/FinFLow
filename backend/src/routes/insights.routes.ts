import { Router } from 'express';
import { getInsights } from '../controllers/insights.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

// All insights routes require authentication
router.use(authenticateToken);

router.get('/', getInsights);

export default router;

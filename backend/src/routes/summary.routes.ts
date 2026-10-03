import { Router } from 'express';
import { getSummary } from '../controllers/summary.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

// All summary routes require authentication
router.use(authenticateToken);

router.get('/', getSummary);

export default router;

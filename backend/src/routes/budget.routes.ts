import { Router } from 'express';
import {
  getBudgets,
  setBudget,
  deleteBudget,
} from '../controllers/budget.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

// All budget routes require authentication
router.use(authenticateToken);

router.get('/', getBudgets);
router.post('/', setBudget);
router.delete('/:id', deleteBudget);

export default router;

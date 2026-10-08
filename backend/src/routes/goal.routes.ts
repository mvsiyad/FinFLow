import { Router } from 'express';
import {
  getGoals,
  createGoal,
  updateGoal,
  depositToGoal,
  deleteGoal,
} from '../controllers/goal.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

// All goal routes require authentication
router.use(authenticateToken);

router.get('/', getGoals);
router.post('/', createGoal);
router.put('/:id', updateGoal);
router.post('/:id/deposit', depositToGoal);
router.delete('/:id', deleteGoal);

export default router;

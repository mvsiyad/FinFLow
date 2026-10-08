import { Response } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

// Validation Schemas
const createGoalSchema = z.object({
  title: z.string().trim().min(1, 'Title is required').max(100, 'Title cannot exceed 100 characters'),
  targetAmount: z.coerce.number().positive('Target amount must be greater than zero'),
  currentAmount: z.coerce.number().min(0, 'Current amount cannot be negative').default(0),
  deadline: z.string().datetime().optional().nullable(),
  category: z.string().trim().max(50).optional().nullable(),
  color: z.string().regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/, 'Invalid hex color').optional().default('#10b981'),
});

const updateGoalSchema = createGoalSchema.partial();

const depositSchema = z.object({
  amount: z.coerce.number().positive('Amount must be greater than zero'),
  type: z.enum(['DEPOSIT', 'WITHDRAW']).default('DEPOSIT'),
});

/**
 * Enriches a goal with computed metrics (percentage, remaining, days left)
 */
export const enrichGoal = (goal: any) => {
  const percentage = Number(
    Math.min(100, (goal.currentAmount / goal.targetAmount) * 100).toFixed(1)
  );
  const remainingAmount = Number(
    Math.max(0, goal.targetAmount - goal.currentAmount).toFixed(2)
  );
  const isCompleted = goal.currentAmount >= goal.targetAmount;

  let daysRemaining: number | null = null;
  if (goal.deadline) {
    const now = new Date().getTime();
    const target = new Date(goal.deadline).getTime();
    const diff = target - now;
    daysRemaining = Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  }

  return {
    ...goal,
    percentage,
    remainingAmount,
    isCompleted,
    daysRemaining,
  };
};

/**
 * Get all savings goals & vaults for user
 * GET /api/goals
 */
export const getGoals = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const goals = await prisma.goal.findMany({
      where: { userId },
      orderBy: [{ createdAt: 'desc' }],
    });

    const enrichedGoals = goals.map(enrichGoal);

    // Summary metrics across all vaults
    const totalTarget = Number(
      goals.reduce((acc, g) => acc + g.targetAmount, 0).toFixed(2)
    );
    const totalSaved = Number(
      goals.reduce((acc, g) => acc + g.currentAmount, 0).toFixed(2)
    );
    const overallProgress =
      totalTarget > 0 ? Number(((totalSaved / totalTarget) * 100).toFixed(1)) : 0;
    const completedCount = goals.filter((g) => g.currentAmount >= g.targetAmount).length;

    res.status(200).json({
      success: true,
      data: enrichedGoals,
      metrics: {
        totalVaults: goals.length,
        totalTarget,
        totalSaved,
        overallProgress,
        completedCount,
        activeCount: goals.length - completedCount,
      },
    });
  } catch (error) {
    console.error('[getGoals Error]:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve goals' });
  }
};

/**
 * Create a new savings goal vault
 * POST /api/goals
 */
export const createGoal = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const parseResult = createGoalSchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: parseResult.error.flatten().fieldErrors,
      });
      return;
    }

    const { title, targetAmount, currentAmount, deadline, category, color } = parseResult.data;

    const newGoal = await prisma.goal.create({
      data: {
        userId,
        title,
        targetAmount,
        currentAmount: currentAmount || 0,
        deadline: deadline ? new Date(deadline) : null,
        category: category || 'General',
        color: color || '#10b981',
      },
    });

    res.status(201).json({
      success: true,
      message: 'Savings vault created successfully',
      data: enrichGoal(newGoal),
    });
  } catch (error) {
    console.error('[createGoal Error]:', error);
    res.status(500).json({ success: false, message: 'Failed to create goal' });
  }
};

/**
 * Deposit or withdraw funds from a vault
 * POST /api/goals/:id/deposit
 */
export const depositToGoal = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const { id } = req.params;

    if (!userId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const parseResult = depositSchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: parseResult.error.flatten().fieldErrors,
      });
      return;
    }

    const { amount, type } = parseResult.data;

    const goal = await prisma.goal.findUnique({
      where: { id },
    });

    if (!goal || goal.userId !== userId) {
      res.status(404).json({ success: false, message: 'Goal vault not found' });
      return;
    }

    let newAmount = goal.currentAmount;
    if (type === 'DEPOSIT') {
      newAmount += amount;
    } else if (type === 'WITHDRAW') {
      if (amount > goal.currentAmount) {
        res.status(400).json({
          success: false,
          message: `Cannot withdraw more than current vault balance ($${goal.currentAmount.toFixed(2)})`,
        });
        return;
      }
      newAmount -= amount;
    }

    newAmount = Number(Math.max(0, newAmount).toFixed(2));

    const updatedGoal = await prisma.goal.update({
      where: { id },
      data: { currentAmount: newAmount },
    });

    res.status(200).json({
      success: true,
      message: `${type === 'DEPOSIT' ? 'Deposited' : 'Withdrew'} $${amount.toFixed(2)} successfully`,
      data: enrichGoal(updatedGoal),
    });
  } catch (error) {
    console.error('[depositToGoal Error]:', error);
    res.status(500).json({ success: false, message: 'Failed to process vault transaction' });
  }
};

/**
 * Update a goal
 * PUT /api/goals/:id
 */
export const updateGoal = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const { id } = req.params;

    if (!userId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const parseResult = updateGoalSchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: parseResult.error.flatten().fieldErrors,
      });
      return;
    }

    const existingGoal = await prisma.goal.findUnique({
      where: { id },
    });

    if (!existingGoal || existingGoal.userId !== userId) {
      res.status(404).json({ success: false, message: 'Goal vault not found' });
      return;
    }

    const { deadline, ...otherData } = parseResult.data;

    const updatedGoal = await prisma.goal.update({
      where: { id },
      data: {
        ...otherData,
        ...(deadline !== undefined ? { deadline: deadline ? new Date(deadline) : null } : {}),
      },
    });

    res.status(200).json({
      success: true,
      message: 'Goal updated successfully',
      data: enrichGoal(updatedGoal),
    });
  } catch (error) {
    console.error('[updateGoal Error]:', error);
    res.status(500).json({ success: false, message: 'Failed to update goal' });
  }
};

/**
 * Delete a goal vault
 * DELETE /api/goals/:id
 */
export const deleteGoal = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const { id } = req.params;

    if (!userId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const goal = await prisma.goal.findUnique({
      where: { id },
    });

    if (!goal || goal.userId !== userId) {
      res.status(404).json({ success: false, message: 'Goal vault not found' });
      return;
    }

    await prisma.goal.delete({
      where: { id },
    });

    res.status(200).json({
      success: true,
      message: 'Goal vault deleted successfully',
    });
  } catch (error) {
    console.error('[deleteGoal Error]:', error);
    res.status(500).json({ success: false, message: 'Failed to delete goal' });
  }
};

import { Response } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

// Validation Schemas
const setBudgetSchema = z.object({
  category: z.string().trim().min(1, 'Category is required').max(50, 'Category cannot exceed 50 characters'),
  limitAmount: z.coerce.number().positive('Budget limit must be greater than zero'),
  monthYear: z
    .string()
    .regex(/^\d{4}-(0[1-9]|1[0-2])$/, 'monthYear must be in "YYYY-MM" format (e.g. "2026-10")'),
});

const getBudgetsQuerySchema = z.object({
  monthYear: z
    .string()
    .regex(/^(\d{4}-(0[1-9]|1[0-2])|all)$/, 'monthYear must be "YYYY-MM" or "all"')
    .optional(),
});

/**
 * Helper to get date boundaries for a YYYY-MM string
 */
export const getMonthDateRange = (monthYear: string) => {
  const [yearStr, monthStr] = monthYear.split('-');
  const year = parseInt(yearStr, 10);
  const monthIndex = parseInt(monthStr, 10) - 1; // 0-indexed

  const startDate = new Date(Date.UTC(year, monthIndex, 1, 0, 0, 0, 0));
  // Day 0 of next month is the last day of current month
  const endDate = new Date(Date.UTC(year, monthIndex + 1, 0, 23, 59, 59, 999));

  return { startDate, endDate };
};

/**
 * Get budgets with calculated spent amount and status
 * GET /api/budgets
 */
export const getBudgets = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const queryResult = getBudgetsQuerySchema.safeParse(req.query);
    if (!queryResult.success) {
      res.status(400).json({
        success: false,
        message: 'Invalid query parameters',
        errors: queryResult.error.flatten().fieldErrors,
      });
      return;
    }

    // Default to current month if not specified
    const currentMonthYear = new Date().toISOString().slice(0, 7);
    const filterMonthYear = queryResult.data?.monthYear || currentMonthYear;

    const where: any = { userId };
    if (filterMonthYear !== 'all') {
      where.monthYear = filterMonthYear;
    }

    const budgets = await prisma.budget.findMany({
      where,
      orderBy: [{ monthYear: 'desc' }, { category: 'asc' }],
    });

    // Compute actual spending for each budget
    const enrichedBudgets = await Promise.all(
      budgets.map(async (b) => {
        const { startDate, endDate } = getMonthDateRange(b.monthYear);

        const spending = await prisma.transaction.aggregate({
          where: {
            userId,
            type: 'EXPENSE',
            category: { equals: b.category, mode: 'insensitive' },
            date: {
              gte: startDate,
              lte: endDate,
            },
          },
          _sum: { amount: true },
        });

        const spentAmount = spending._sum.amount || 0;
        const remainingAmount = Number((b.limitAmount - spentAmount).toFixed(2));
        const percentageUsed = Number(((spentAmount / b.limitAmount) * 100).toFixed(1));

        let alertLevel: 'green' | 'amber' | 'red' = 'green';
        if (percentageUsed >= 90) {
          alertLevel = 'red';
        } else if (percentageUsed >= 70) {
          alertLevel = 'amber';
        }

        return {
          id: b.id,
          category: b.category,
          limitAmount: b.limitAmount,
          monthYear: b.monthYear,
          spentAmount,
          remainingAmount,
          percentageUsed,
          alertLevel,
          createdAt: b.createdAt,
          updatedAt: b.updatedAt,
        };
      })
    );

    res.status(200).json({
      success: true,
      monthYear: filterMonthYear,
      data: enrichedBudgets,
    });
  } catch (error) {
    console.error('[getBudgets Error]:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch budgets',
    });
  }
};

/**
 * Create or update a monthly budget limit for a category
 * POST /api/budgets
 */
export const setBudget = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const parseResult = setBudgetSchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: parseResult.error.flatten().fieldErrors,
      });
      return;
    }

    const { category, limitAmount, monthYear } = parseResult.data;

    // Upsert budget to avoid duplicate category budgets in the same month
    const budget = await prisma.budget.upsert({
      where: {
        userId_category_monthYear: {
          userId,
          category,
          monthYear,
        },
      },
      update: {
        limitAmount,
      },
      create: {
        userId,
        category,
        limitAmount,
        monthYear,
      },
    });

    res.status(200).json({
      success: true,
      message: 'Budget saved successfully',
      data: budget,
    });
  } catch (error) {
    console.error('[setBudget Error]:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to set budget',
    });
  }
};

/**
 * Delete a budget limit
 * DELETE /api/budgets/:id
 */
export const deleteBudget = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const { id } = req.params;

    if (!userId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const existing = await prisma.budget.findFirst({
      where: { id, userId },
    });

    if (!existing) {
      res.status(404).json({
        success: false,
        message: 'Budget not found or unauthorized to delete',
      });
      return;
    }

    await prisma.budget.delete({
      where: { id },
    });

    res.status(200).json({
      success: true,
      message: 'Budget deleted successfully',
      data: { id },
    });
  } catch (error) {
    console.error('[deleteBudget Error]:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete budget',
    });
  }
};

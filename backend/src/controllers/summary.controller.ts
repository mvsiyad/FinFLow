import { Response } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { getMonthDateRange } from './budget.controller';

const summaryQuerySchema = z.object({
  monthYear: z
    .string()
    .regex(/^\d{4}-(0[1-9]|1[0-2])$/, 'monthYear must be in "YYYY-MM" format')
    .optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

/**
 * Get financial summary, net balance, and category breakdown
 * GET /api/summary
 */
export const getSummary = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const queryResult = summaryQuerySchema.safeParse(req.query);
    if (!queryResult.success) {
      res.status(400).json({
        success: false,
        message: 'Invalid query parameters',
        errors: queryResult.error.flatten().fieldErrors,
      });
      return;
    }

    const currentMonthYear = new Date().toISOString().slice(0, 7);
    const monthYear = queryResult.data.monthYear || currentMonthYear;

    let startDate: Date;
    let endDate: Date;

    if (queryResult.data.startDate && queryResult.data.endDate) {
      startDate = new Date(queryResult.data.startDate);
      endDate = new Date(queryResult.data.endDate);
      if (!queryResult.data.endDate.includes('T')) {
        endDate.setHours(23, 59, 59, 999);
      }
    } else {
      const range = getMonthDateRange(monthYear);
      startDate = range.startDate;
      endDate = range.endDate;
    }

    // Query transactions in range
    const transactions = await prisma.transaction.findMany({
      where: {
        userId,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: { date: 'desc' },
    });

    let totalIncome = 0;
    let totalExpense = 0;
    const expenseByCategory: Record<string, number> = {};
    const incomeByCategory: Record<string, number> = {};

    for (const t of transactions) {
      if (t.type === 'INCOME') {
        totalIncome += t.amount;
        incomeByCategory[t.category] = (incomeByCategory[t.category] || 0) + t.amount;
      } else if (t.type === 'EXPENSE') {
        totalExpense += t.amount;
        expenseByCategory[t.category] = (expenseByCategory[t.category] || 0) + t.amount;
      }
    }

    totalIncome = Number(totalIncome.toFixed(2));
    totalExpense = Number(totalExpense.toFixed(2));
    const netBalance = Number((totalIncome - totalExpense).toFixed(2));
    const savingsRate =
      totalIncome > 0
        ? Number(Math.max(0, ((totalIncome - totalExpense) / totalIncome) * 100).toFixed(1))
        : 0;

    // Build category breakdowns with percentages for charts
    const categoryBreakdown = Object.entries(expenseByCategory)
      .map(([category, amount]) => ({
        category,
        amount: Number(amount.toFixed(2)),
        percentage: totalExpense > 0 ? Number(((amount / totalExpense) * 100).toFixed(1)) : 0,
      }))
      .sort((a, b) => b.amount - a.amount);

    // Get budgets for the period to calculate overall budget health
    const budgets = await prisma.budget.findMany({
      where: {
        userId,
        monthYear,
      },
    });

    const totalBudgetLimit = Number(
      budgets.reduce((acc, b) => acc + b.limitAmount, 0).toFixed(2)
    );
    const budgetUsedPercentage =
      totalBudgetLimit > 0
        ? Number(((totalExpense / totalBudgetLimit) * 100).toFixed(1))
        : 0;

    // Recent 5 transactions
    const recentTransactions = transactions.slice(0, 5);

    res.status(200).json({
      success: true,
      data: {
        period: {
          monthYear,
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
        },
        metrics: {
          totalIncome,
          totalExpense,
          netBalance,
          savingsRate,
          totalBudgetLimit,
          budgetUsedPercentage,
        },
        categoryBreakdown,
        recentTransactions,
      },
    });
  } catch (error) {
    console.error('[getSummary Error]:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate financial summary',
    });
  }
};

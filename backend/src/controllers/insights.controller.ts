import { Response } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { getMonthDateRange } from './budget.controller';

const insightsQuerySchema = z.object({
  monthYear: z
    .string()
    .regex(/^\d{4}-(0[1-9]|1[0-2])$/, 'monthYear must be in "YYYY-MM" format')
    .optional(),
});

export interface SmartInsight {
  id: string;
  type: 'POSITIVE' | 'WARNING' | 'ALERT' | 'TIP';
  title: string;
  description: string;
  impact?: string;
  category?: string;
}

export const getInsights = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const queryResult = insightsQuerySchema.safeParse(req.query);
    if (!queryResult.success) {
      res.status(400).json({
        success: false,
        message: 'Invalid query parameters',
        errors: queryResult.error.flatten().fieldErrors,
      });
      return;
    }

    const currentMonthYear = new Date().toISOString().slice(0, 7);
    const monthYear = queryResult.data?.monthYear || currentMonthYear;

    const { startDate, endDate } = getMonthDateRange(monthYear);

    const [transactions, budgets] = await Promise.all([
      prisma.transaction.findMany({
        where: {
          userId,
          date: {
            gte: startDate,
            lte: endDate,
          },
        },
        orderBy: { date: 'desc' },
      }),
      prisma.budget.findMany({
        where: {
          userId,
          monthYear,
        },
      }),
    ]);

    let totalIncome = 0;
    let totalExpense = 0;
    const expenseByCategory: Record<string, number> = {};

    for (const tx of transactions) {
      if (tx.type === 'INCOME') {
        totalIncome += tx.amount;
      } else if (tx.type === 'EXPENSE') {
        totalExpense += tx.amount;
        expenseByCategory[tx.category] = (expenseByCategory[tx.category] || 0) + tx.amount;
      }
    }

    totalIncome = Number(totalIncome.toFixed(2));
    totalExpense = Number(totalExpense.toFixed(2));
    const netBalance = Number((totalIncome - totalExpense).toFixed(2));
    const savingsRate =
      totalIncome > 0
        ? Number(Math.max(0, ((totalIncome - totalExpense) / totalIncome) * 100).toFixed(1))
        : 0;

    const now = new Date();
    const isCurrentMonth = monthYear === currentMonthYear;
    const totalDaysInMonth = new Date(
      startDate.getFullYear(),
      startDate.getMonth() + 1,
      0
    ).getDate();

    const daysElapsed = isCurrentMonth ? Math.min(now.getDate(), totalDaysInMonth) : totalDaysInMonth;
    const daysRemaining = Math.max(0, totalDaysInMonth - daysElapsed);

    const averageDailyBurn = Number(
      (totalExpense / Math.max(1, daysElapsed)).toFixed(2)
    );
    const projectedMonthEndExpense = Number(
      (averageDailyBurn * totalDaysInMonth).toFixed(2)
    );
    const projectedSurplus = Number(
      (totalIncome - projectedMonthEndExpense).toFixed(2)
    );

    const savingsScore = Math.min(40, (savingsRate / 40) * 40);

    let budgetScore = 35;
    if (budgets.length > 0) {
      let overBudgetCount = 0;
      for (const b of budgets) {
        const spent = expenseByCategory[b.category] || 0;
        if (spent >= b.limitAmount) overBudgetCount += 1;
        else if (spent / b.limitAmount >= 0.9) overBudgetCount += 0.5;
      }
      budgetScore = Math.max(0, 35 - (overBudgetCount / budgets.length) * 35);
    }

    let cashFlowScore = 25;
    if (totalIncome === 0 && totalExpense > 0) {
      cashFlowScore = 5;
    } else if (netBalance < 0) {
      cashFlowScore = Math.max(0, 25 - (Math.abs(netBalance) / (totalIncome || 1)) * 25);
    }

    const healthScoreNumber = Math.round(savingsScore + budgetScore + cashFlowScore);
    let grade = 'B';
    let statusText = 'Stable Financial Standing';
    let summaryText = 'Your finances are balanced with room for optimization.';

    if (healthScoreNumber >= 90) {
      grade = 'A+';
      statusText = 'Exceptional Wealth Builder';
      summaryText = 'Outstanding cash flow surplus and disciplined budget allocation.';
    } else if (healthScoreNumber >= 80) {
      grade = 'A';
      statusText = 'Healthy & Prospering';
      summaryText = 'Solid positive cash flow with consistent savings margins.';
    } else if (healthScoreNumber >= 70) {
      grade = 'B';
      statusText = 'Moderate & Stable';
      summaryText = 'Maintaining positive balance, but watch out for near-capacity budgets.';
    } else if (healthScoreNumber >= 55) {
      grade = 'C';
      statusText = 'Caution Recommended';
      summaryText = 'Spending velocity is high relative to earnings. Limit discretionary purchases.';
    } else {
      grade = 'D';
      statusText = 'Budget Overrun Alert';
      summaryText = 'Monthly expenses exceed income or major spending caps are breached.';
    }

    const insights: SmartInsight[] = [];

    for (const b of budgets) {
      const spent = expenseByCategory[b.category] || 0;
      const percentage = Number(((spent / b.limitAmount) * 100).toFixed(1));
      const remaining = Number((b.limitAmount - spent).toFixed(2));

      if (percentage >= 90) {
        insights.push({
          id: `budget-crit-${b.id}`,
          type: 'ALERT',
          category: b.category,
          title: `${b.category} Cap Critical (${percentage}% Used)`,
          description: `You have spent $${spent.toFixed(2)} of your $${b.limitAmount.toFixed(2)} limit. Only $${Math.max(0, remaining).toFixed(2)} remains for ${daysRemaining} days.`,
          impact: 'Critical Attention',
        });
      } else if (percentage >= 70) {
        insights.push({
          id: `budget-warn-${b.id}`,
          type: 'WARNING',
          category: b.category,
          title: `${b.category} Approaching Threshold (${percentage}%)`,
          description: `Spending is at ${percentage}%. Slow down non-essential spend in this category to stay under limit.`,
          impact: 'Warning',
        });
      }
    }

    if (savingsRate >= 30) {
      insights.push({
        id: 'insight-savings-high',
        type: 'POSITIVE',
        title: `Elite ${savingsRate}% Savings Velocity`,
        description: `You are saving over 30% of total revenue this month, comfortably surpassing the standard 50/30/20 benchmark rule.`,
        impact: `+$${netBalance.toFixed(2)} net growth`,
      });
    } else if (savingsRate > 0) {
      insights.push({
        id: 'insight-savings-positive',
        type: 'POSITIVE',
        title: `Positive ${savingsRate}% Savings Margin`,
        description: `You have retained $${netBalance.toFixed(2)} in surplus this month.`,
        impact: `+$${netBalance.toFixed(2)} surplus`,
      });
    } else if (totalExpense > totalIncome) {
      insights.push({
        id: 'insight-deficit',
        type: 'ALERT',
        title: 'Negative Cash Flow Run',
        description: `Current outlays ($${totalExpense.toFixed(2)}) exceed total income ($${totalIncome.toFixed(2)}) by $${Math.abs(netBalance).toFixed(2)}.`,
        impact: `-$${Math.abs(netBalance).toFixed(2)} deficit`,
      });
    }

    // 3. Top Category Optimization Tip
    const sortedCategories = Object.entries(expenseByCategory).sort((a, b) => b[1] - a[1]);
    if (sortedCategories.length > 0) {
      const [topCategory, topAmount] = sortedCategories[0];
      const potentialMonthlySaving = Number((topAmount * 0.1).toFixed(2));
      const potentialAnnualSaving = Number((potentialMonthlySaving * 12).toFixed(2));

      insights.push({
        id: 'insight-top-category-opt',
        type: 'TIP',
        category: topCategory,
        title: `10% Optimization on ${topCategory}`,
        description: `${topCategory} is your largest expense at $${topAmount.toFixed(2)}. Trimming just 10% would save ~$${potentialMonthlySaving}/mo ($${potentialAnnualSaving}/yr).`,
        impact: `+$${potentialAnnualSaving}/yr potential`,
      });
    }

    if (isCurrentMonth && daysRemaining > 0 && totalExpense > 0) {
      insights.push({
        id: 'insight-burn-rate',
        type: 'TIP',
        title: `Month-End Projection ($${projectedMonthEndExpense.toFixed(0)})`,
        description: `At your current pace of ~$${averageDailyBurn.toFixed(0)}/day, you are on track to spend $${projectedMonthEndExpense.toFixed(0)} and conclude with $${projectedSurplus.toFixed(0)} surplus.`,
        impact: `${daysRemaining} days left`,
      });
    }

    res.status(200).json({
      success: true,
      data: {
        period: {
          monthYear,
          daysElapsed,
          daysRemaining,
          totalDaysInMonth,
        },
        healthScore: {
          score: healthScoreNumber,
          grade,
          status: statusText,
          summary: summaryText,
        },
        burnRate: {
          dailyAverage: averageDailyBurn,
          daysElapsed,
          daysRemaining,
          projectedExpense: projectedMonthEndExpense,
          projectedSurplus,
        },
        insights,
      },
    });
  } catch (error) {
    console.error('[getInsights Error]:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate financial insights',
    });
  }
};

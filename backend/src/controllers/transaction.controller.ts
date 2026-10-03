import { Response } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

// Validation Schemas
const createTransactionSchema = z.object({
  title: z.string().trim().min(1, 'Title is required').max(100, 'Title cannot exceed 100 characters'),
  amount: z.coerce.number().positive('Amount must be greater than zero'),
  type: z.enum(['INCOME', 'EXPENSE'], {
    errorMap: () => ({ message: "Type must be either 'INCOME' or 'EXPENSE'" }),
  }),
  category: z.string().trim().min(1, 'Category is required').max(50, 'Category cannot exceed 50 characters'),
  date: z.coerce.date().optional(),
});

const updateTransactionSchema = createTransactionSchema.partial();

const queryTransactionSchema = z.object({
  type: z.enum(['INCOME', 'EXPENSE']).optional(),
  category: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  limit: z.coerce.number().int().positive().max(200).optional(),
  page: z.coerce.number().int().positive().optional(),
});

/**
 * Get transactions for the authenticated user with filters
 * GET /api/transactions
 */
export const getTransactions = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const queryResult = queryTransactionSchema.safeParse(req.query);
    if (!queryResult.success) {
      res.status(400).json({
        success: false,
        message: 'Invalid query parameters',
        errors: queryResult.error.flatten().fieldErrors,
      });
      return;
    }

    const { type, category, startDate, endDate, limit = 100, page = 1 } = queryResult.data;

    // Build Prisma where filter
    const where: any = { userId };

    if (type) {
      where.type = type;
    }

    if (category) {
      where.category = { equals: category, mode: 'insensitive' };
    }

    if (startDate || endDate) {
      where.date = {};
      if (startDate) {
        where.date.gte = new Date(startDate);
      }
      if (endDate) {
        const end = new Date(endDate);
        // Include full end-day if time not specified
        if (!endDate.includes('T')) {
          end.setHours(23, 59, 59, 999);
        }
        where.date.lte = end;
      }
    }

    const skip = (page - 1) * limit;

    const [transactions, totalCount] = await Promise.all([
      prisma.transaction.findMany({
        where,
        orderBy: { date: 'desc' },
        skip,
        take: limit,
      }),
      prisma.transaction.count({ where }),
    ]);

    res.status(200).json({
      success: true,
      data: transactions,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    });
  } catch (error) {
    console.error('[getTransactions Error]:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch transactions',
    });
  }
};

/**
 * Get a single transaction by ID
 * GET /api/transactions/:id
 */
export const getTransactionById = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const { id } = req.params;

    if (!userId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const transaction = await prisma.transaction.findFirst({
      where: { id, userId },
    });

    if (!transaction) {
      res.status(404).json({
        success: false,
        message: 'Transaction not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: transaction,
    });
  } catch (error) {
    console.error('[getTransactionById Error]:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve transaction',
    });
  }
};

/**
 * Create a new transaction
 * POST /api/transactions
 */
export const createTransaction = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const parseResult = createTransactionSchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: parseResult.error.flatten().fieldErrors,
      });
      return;
    }

    const { title, amount, type, category, date } = parseResult.data;

    const transaction = await prisma.transaction.create({
      data: {
        userId,
        title,
        amount,
        type,
        category,
        date: date || new Date(),
      },
    });

    res.status(201).json({
      success: true,
      message: 'Transaction created successfully',
      data: transaction,
    });
  } catch (error) {
    console.error('[createTransaction Error]:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create transaction',
    });
  }
};

/**
 * Update an existing transaction
 * PUT /api/transactions/:id
 */
export const updateTransaction = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const { id } = req.params;

    if (!userId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const parseResult = updateTransactionSchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: parseResult.error.flatten().fieldErrors,
      });
      return;
    }

    // Ensure transaction exists and belongs to the user
    const existing = await prisma.transaction.findFirst({
      where: { id, userId },
    });

    if (!existing) {
      res.status(404).json({
        success: false,
        message: 'Transaction not found or unauthorized to edit',
      });
      return;
    }

    const updatedTransaction = await prisma.transaction.update({
      where: { id },
      data: parseResult.data,
    });

    res.status(200).json({
      success: true,
      message: 'Transaction updated successfully',
      data: updatedTransaction,
    });
  } catch (error) {
    console.error('[updateTransaction Error]:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update transaction',
    });
  }
};

/**
 * Delete a transaction
 * DELETE /api/transactions/:id
 */
export const deleteTransaction = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const { id } = req.params;

    if (!userId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    // Verify ownership
    const existing = await prisma.transaction.findFirst({
      where: { id, userId },
    });

    if (!existing) {
      res.status(404).json({
        success: false,
        message: 'Transaction not found or unauthorized to delete',
      });
      return;
    }

    await prisma.transaction.delete({
      where: { id },
    });

    res.status(200).json({
      success: true,
      message: 'Transaction deleted successfully',
      data: { id },
    });
  } catch (error) {
    console.error('[deleteTransaction Error]:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete transaction',
    });
  }
};

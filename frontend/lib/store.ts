import { create } from 'zustand';
import {
  User,
  Transaction,
  Budget,
  SummaryData,
  authService,
  transactionService,
  budgetService,
  summaryService,
} from './api';

// Realistic sample data for instant showcase and offline resilience
const SAMPLE_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx-1',
    userId: 'demo-user',
    title: 'Senior Software Engineer Salary',
    amount: 6500.0,
    type: 'INCOME',
    category: 'Salary',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'tx-2',
    userId: 'demo-user',
    title: 'Downtown Apartment Rent',
    amount: 1950.0,
    type: 'EXPENSE',
    category: 'Housing & Rent',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'tx-3',
    userId: 'demo-user',
    title: 'Whole Foods Market',
    amount: 184.5,
    type: 'EXPENSE',
    category: 'Groceries & Dining',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'tx-4',
    userId: 'demo-user',
    title: 'Freelance UI/UX Design Contract',
    amount: 1200.0,
    type: 'INCOME',
    category: 'Freelance',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6).toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'tx-5',
    userId: 'demo-user',
    title: 'Electric & Fiber Internet',
    amount: 145.0,
    type: 'EXPENSE',
    category: 'Utilities & Bills',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 8).toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'tx-6',
    userId: 'demo-user',
    title: 'Equinox Gym Membership',
    amount: 180.0,
    type: 'EXPENSE',
    category: 'Health & Fitness',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const SAMPLE_BUDGETS: Budget[] = [
  {
    id: 'bg-1',
    category: 'Housing & Rent',
    limitAmount: 2000,
    monthYear: new Date().toISOString().slice(0, 7),
    spentAmount: 1950,
    remainingAmount: 50,
    percentageUsed: 97.5,
    alertLevel: 'red',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'bg-2',
    category: 'Groceries & Dining',
    limitAmount: 600,
    monthYear: new Date().toISOString().slice(0, 7),
    spentAmount: 430,
    remainingAmount: 170,
    percentageUsed: 71.7,
    alertLevel: 'amber',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'bg-3',
    category: 'Utilities & Bills',
    limitAmount: 300,
    monthYear: new Date().toISOString().slice(0, 7),
    spentAmount: 145,
    remainingAmount: 155,
    percentageUsed: 48.3,
    alertLevel: 'green',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'bg-4',
    category: 'Entertainment',
    limitAmount: 250,
    monthYear: new Date().toISOString().slice(0, 7),
    spentAmount: 95,
    remainingAmount: 155,
    percentageUsed: 38.0,
    alertLevel: 'green',
    createdAt: new Date().toISOString(),
  },
];

interface FinFlowState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  selectedMonthYear: string;
  transactions: Transaction[];
  budgets: Budget[];
  summary: SummaryData | null;
  isAddTransactionOpen: boolean;
  isAddBudgetOpen: boolean;

  // Actions
  setUser: (user: User | null) => void;
  login: (credentials: { email: string; password: string }) => Promise<{ success: boolean; message?: string }>;
  register: (data: { name: string; email: string; password: string }) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
  loginWithDemo: () => void;
  setSelectedMonthYear: (monthYear: string) => void;
  setAddTransactionOpen: (isOpen: boolean) => void;
  setAddBudgetOpen: (isOpen: boolean) => void;
  initApp: () => Promise<void>;
  fetchTransactions: (params?: any) => Promise<void>;
  addTransaction: (data: {
    title: string;
    amount: number;
    type: 'INCOME' | 'EXPENSE';
    category: string;
    date?: string;
  }) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  fetchBudgets: (monthYear?: string) => Promise<void>;
  saveBudget: (data: {
    category: string;
    limitAmount: number;
    monthYear: string;
  }) => Promise<void>;
  deleteBudget: (id: string) => Promise<void>;
  fetchSummary: (monthYear?: string) => Promise<void>;
}

export const useFinFlowStore = create<FinFlowState>((set, get) => ({
  user: {
    id: 'demo-user',
    name: 'Alex Rivera',
    email: 'alex.rivera@finflow.dev',
    createdAt: new Date().toISOString(),
  },
  isAuthenticated: true,
  isLoading: false,
  selectedMonthYear: new Date().toISOString().slice(0, 7),
  transactions: SAMPLE_TRANSACTIONS,
  budgets: SAMPLE_BUDGETS,
  summary: {
    period: {
      monthYear: new Date().toISOString().slice(0, 7),
      startDate: new Date().toISOString(),
      endDate: new Date().toISOString(),
    },
    metrics: {
      totalIncome: 7700.0,
      totalExpense: 2459.5,
      netBalance: 5240.5,
      savingsRate: 68.1,
      totalBudgetLimit: 3150.0,
      budgetUsedPercentage: 78.1,
    },
    categoryBreakdown: [
      { category: 'Housing & Rent', amount: 1950.0, percentage: 79.3 },
      { category: 'Groceries & Dining', amount: 184.5, percentage: 7.5 },
      { category: 'Health & Fitness', amount: 180.0, percentage: 7.3 },
      { category: 'Utilities & Bills', amount: 145.0, percentage: 5.9 },
    ],
    recentTransactions: SAMPLE_TRANSACTIONS.slice(0, 5),
  },
  isAddTransactionOpen: false,
  isAddBudgetOpen: false,

  setUser: (user) => set({ user, isAuthenticated: !!user }),

  login: async (credentials) => {
    try {
      set({ isLoading: true });
      const res = await authService.login(credentials);
      const user = res.user;
      set({ user, isAuthenticated: true });
      await Promise.all([
        get().fetchSummary(get().selectedMonthYear),
        get().fetchTransactions(),
        get().fetchBudgets(get().selectedMonthYear),
      ]);
      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        message: error?.message || 'Login failed. Please check your credentials.',
      };
    } finally {
      set({ isLoading: false });
    }
  },

  register: async (data) => {
    try {
      set({ isLoading: true });
      const res = await authService.register(data);
      const user = res.user;
      set({ user, isAuthenticated: true });
      await Promise.all([
        get().fetchSummary(get().selectedMonthYear),
        get().fetchTransactions(),
        get().fetchBudgets(get().selectedMonthYear),
      ]);
      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        message: error?.message || 'Registration failed. Please try again.',
      };
    } finally {
      set({ isLoading: false });
    }
  },

  logout: async () => {
    try {
      await authService.logout();
    } catch {
      // ignore
    } finally {
      set({
        user: null,
        isAuthenticated: false,
      });
    }
  },

  loginWithDemo: () => {
    set({
      user: {
        id: 'demo-user',
        name: 'Alex Rivera',
        email: 'alex.rivera@finflow.dev',
        createdAt: new Date().toISOString(),
      },
      isAuthenticated: true,
      transactions: SAMPLE_TRANSACTIONS,
      budgets: SAMPLE_BUDGETS,
    });
  },

  setSelectedMonthYear: (monthYear) => {
    set({ selectedMonthYear: monthYear });
    get().fetchSummary(monthYear);
    get().fetchBudgets(monthYear);
  },
  setAddTransactionOpen: (isOpen) => set({ isAddTransactionOpen: isOpen }),
  setAddBudgetOpen: (isOpen) => set({ isAddBudgetOpen: isOpen }),

  initApp: async () => {
    try {
      set({ isLoading: true });
      const user = await authService.me();
      set({ user, isAuthenticated: true });
      await Promise.all([
        get().fetchSummary(get().selectedMonthYear),
        get().fetchTransactions(),
        get().fetchBudgets(get().selectedMonthYear),
      ]);
    } catch {
      // Backend not running or unauthenticated - keep graceful showcase demo data
      console.info('[FinFlow Store] Operating with live interactive demo data');
    } finally {
      set({ isLoading: false });
    }
  },

  fetchTransactions: async (params) => {
    try {
      const response = await transactionService.list(params);
      if (response?.data?.length) {
        set({ transactions: response.data });
      }
    } catch {
      // Keep state resilient
    }
  },

  addTransaction: async (data) => {
    try {
      const newTx = await transactionService.create(data);
      set((state) => ({
        transactions: [newTx, ...state.transactions],
      }));
    } catch {
      // Fallback local addition for offline demo mode
      const mockTx: Transaction = {
        id: `tx-${Date.now()}`,
        userId: 'demo-user',
        title: data.title,
        amount: data.amount,
        type: data.type,
        category: data.category,
        date: data.date || new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      set((state) => {
        const updated = [mockTx, ...state.transactions];
        return { transactions: updated };
      });
    }
    // Recompute summary
    await get().fetchSummary(get().selectedMonthYear);
  },

  deleteTransaction: async (id) => {
    try {
      await transactionService.delete(id);
    } catch {
      // Fallback local deletion
    }
    set((state) => ({
      transactions: state.transactions.filter((t) => t.id !== id),
    }));
    await get().fetchSummary(get().selectedMonthYear);
  },

  fetchBudgets: async (monthYear) => {
    try {
      const targetMonth = monthYear || get().selectedMonthYear;
      const res = await budgetService.list(targetMonth);
      if (res?.data?.length) {
        set({ budgets: res.data });
      }
    } catch {
      // Keep resilient
    }
  },

  saveBudget: async (data) => {
    try {
      const newBudget = await budgetService.set(data);
      set((state) => {
        const exists = state.budgets.some((b) => b.id === newBudget.id);
        return {
          budgets: exists
            ? state.budgets.map((b) => (b.id === newBudget.id ? newBudget : b))
            : [...state.budgets, newBudget],
        };
      });
    } catch {
      // Fallback local addition
      const mockBudget: Budget = {
        id: `bg-${Date.now()}`,
        category: data.category,
        limitAmount: data.limitAmount,
        monthYear: data.monthYear,
        spentAmount: 0,
        remainingAmount: data.limitAmount,
        percentageUsed: 0,
        alertLevel: 'green',
        createdAt: new Date().toISOString(),
      };
      set((state) => {
        const filtered = state.budgets.filter(
          (b) => !(b.category === data.category && b.monthYear === data.monthYear)
        );
        return { budgets: [...filtered, mockBudget] };
      });
    }
  },

  deleteBudget: async (id) => {
    try {
      await budgetService.delete(id);
    } catch {
      // Resilient local delete
    }
    set((state) => ({
      budgets: state.budgets.filter((b) => b.id !== id),
    }));
  },

  fetchSummary: async (monthYear) => {
    const targetMonth = monthYear || get().selectedMonthYear;
    try {
      const data = await summaryService.get(targetMonth);
      set({ summary: data });
    } catch {
      // Recalculate from active transactions
      const txs = get().transactions;
      let income = 0;
      let expense = 0;
      const catMap: Record<string, number> = {};

      txs.forEach((t) => {
        if (t.type === 'INCOME') income += t.amount;
        if (t.type === 'EXPENSE') {
          expense += t.amount;
          catMap[t.category] = (catMap[t.category] || 0) + t.amount;
        }
      });

      const net = income - expense;
      const rate = income > 0 ? (net / income) * 100 : 0;
      const breakdown = Object.entries(catMap).map(([category, amount]) => ({
        category,
        amount,
        percentage: expense > 0 ? (amount / expense) * 100 : 0,
      }));

      set({
        summary: {
          period: {
            monthYear: targetMonth || new Date().toISOString().slice(0, 7),
            startDate: new Date().toISOString(),
            endDate: new Date().toISOString(),
          },
          metrics: {
            totalIncome: Number(income.toFixed(2)),
            totalExpense: Number(expense.toFixed(2)),
            netBalance: Number(net.toFixed(2)),
            savingsRate: Number(rate.toFixed(1)),
            totalBudgetLimit: get().budgets.reduce((acc, b) => acc + b.limitAmount, 0),
            budgetUsedPercentage:
              get().budgets.length > 0
                ? Number(
                    (
                      (expense /
                        get().budgets.reduce((acc, b) => acc + b.limitAmount, 0)) *
                      100
                    ).toFixed(1)
                  )
                : 0,
          },
          categoryBreakdown: breakdown,
          recentTransactions: txs.slice(0, 5),
        },
      });
    }
  },
}));

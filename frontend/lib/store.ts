import { create } from 'zustand';
import {
  User,
  Transaction,
  Budget,
  SummaryData,
  InsightsData,
  Goal,
  authService,
  transactionService,
  budgetService,
  summaryService,
  insightsService,
  goalService,
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

const SAMPLE_INSIGHTS: InsightsData = {
  period: {
    monthYear: new Date().toISOString().slice(0, 7),
    daysElapsed: 7,
    daysRemaining: 24,
    totalDaysInMonth: 31,
  },
  healthScore: {
    score: 86,
    grade: 'A',
    status: 'Healthy & Prospering',
    summary: 'Strong net cash flow with healthy 68.1% savings velocity.',
  },
  burnRate: {
    dailyAverage: 79.3,
    daysElapsed: 7,
    daysRemaining: 24,
    projectedExpense: 2459.5,
    projectedSurplus: 5240.5,
  },
  insights: [
    {
      id: 'ins-1',
      type: 'ALERT',
      category: 'Housing & Rent',
      title: 'Housing & Rent at 97.5% Cap',
      description: 'You have consumed $1,950 of your $2,000 monthly limit. Only $50 remains for the rest of this period.',
      impact: 'Critical Attention',
    },
    {
      id: 'ins-2',
      type: 'POSITIVE',
      title: 'Top 10% Savings Rate (68.1%)',
      description: 'Your savings rate of 68.1% significantly exceeds standard personal finance recommendations (20%).',
      impact: '+$5,240.50 surplus',
    },
    {
      id: 'ins-3',
      type: 'WARNING',
      category: 'Groceries & Dining',
      title: 'Groceries & Dining at 71.7%',
      description: 'Spent $430 of $600 limit with 24 days remaining. Consider slowing discretionary dining out.',
      impact: 'Watch Threshold',
    },
    {
      id: 'ins-4',
      type: 'TIP',
      category: 'Groceries & Dining',
      title: '10% Optimization on Dining',
      description: 'Trimming just 10% from groceries and restaurants could preserve ~$43/mo ($516/yr) in additional net savings.',
      impact: '+$516/yr potential',
    },
  ],
};

const SAMPLE_GOALS: Goal[] = [
  {
    id: 'goal-1',
    title: 'Emergency Reserve Fund',
    targetAmount: 10000,
    currentAmount: 6800,
    percentage: 68.0,
    remainingAmount: 3200,
    isCompleted: false,
    deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 180).toISOString(),
    daysRemaining: 180,
    category: 'Emergency',
    color: '#10b981',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'goal-2',
    title: 'Kyoto & Tokyo Autumn Trip',
    targetAmount: 3500,
    currentAmount: 2450,
    percentage: 70.0,
    remainingAmount: 1050,
    isCompleted: false,
    deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 115).toISOString(),
    daysRemaining: 115,
    category: 'Travel',
    color: '#06b6d4',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'goal-3',
    title: 'Next-Gen M-Series Studio',
    targetAmount: 2200,
    currentAmount: 1800,
    percentage: 81.8,
    remainingAmount: 400,
    isCompleted: false,
    deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 45).toISOString(),
    daysRemaining: 45,
    category: 'Tech',
    color: '#8b5cf6',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'goal-4',
    title: 'Index Fund Investment Vault',
    targetAmount: 5000,
    currentAmount: 5000,
    percentage: 100.0,
    remainingAmount: 0,
    isCompleted: true,
    deadline: new Date().toISOString(),
    daysRemaining: 0,
    category: 'Investments',
    color: '#f59e0b',
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
  insights: InsightsData | null;
  goals: Goal[];
  isAddTransactionOpen: boolean;
  isAddBudgetOpen: boolean;
  isAddGoalOpen: boolean;
  isDepositGoalOpen: boolean;
  activeGoalForDeposit: Goal | null;

  // Actions
  setUser: (user: User | null) => void;
  login: (credentials: { email: string; password: string }) => Promise<{ success: boolean; message?: string }>;
  register: (data: { name: string; email: string; password: string }) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
  loginWithDemo: () => void;
  setSelectedMonthYear: (monthYear: string) => void;
  setAddTransactionOpen: (isOpen: boolean) => void;
  setAddBudgetOpen: (isOpen: boolean) => void;
  setAddGoalOpen: (isOpen: boolean) => void;
  setDepositGoalOpen: (isOpen: boolean) => void;
  setActiveGoalForDeposit: (goal: Goal | null) => void;
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
  fetchInsights: (monthYear?: string) => Promise<void>;
  fetchGoals: () => Promise<void>;
  addGoal: (data: {
    title: string;
    targetAmount: number;
    currentAmount?: number;
    deadline?: string | null;
    category?: string | null;
    color?: string;
  }) => Promise<void>;
  depositToGoal: (
    id: string,
    amount: number,
    type: 'DEPOSIT' | 'WITHDRAW'
  ) => Promise<{ success: boolean; message?: string }>;
  deleteGoal: (id: string) => Promise<void>;
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
  insights: SAMPLE_INSIGHTS,
  goals: SAMPLE_GOALS,
  isAddTransactionOpen: false,
  isAddBudgetOpen: false,
  isAddGoalOpen: false,
  isDepositGoalOpen: false,
  activeGoalForDeposit: null,

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
        get().fetchInsights(get().selectedMonthYear),
        get().fetchGoals(),
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
        get().fetchInsights(get().selectedMonthYear),
        get().fetchGoals(),
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
      insights: SAMPLE_INSIGHTS,
      goals: SAMPLE_GOALS,
    });
  },

  setSelectedMonthYear: (monthYear) => {
    set({ selectedMonthYear: monthYear });
    get().fetchSummary(monthYear);
    get().fetchBudgets(monthYear);
    get().fetchInsights(monthYear);
  },
  setAddTransactionOpen: (isOpen) => set({ isAddTransactionOpen: isOpen }),
  setAddBudgetOpen: (isOpen) => set({ isAddBudgetOpen: isOpen }),
  setAddGoalOpen: (isOpen) => set({ isAddGoalOpen: isOpen }),
  setDepositGoalOpen: (isOpen) => set({ isDepositGoalOpen: isOpen }),
  setActiveGoalForDeposit: (goal) => set({ activeGoalForDeposit: goal, isDepositGoalOpen: !!goal }),

  initApp: async () => {
    try {
      set({ isLoading: true });
      const user = await authService.me();
      set({ user, isAuthenticated: true });
      await Promise.all([
        get().fetchSummary(get().selectedMonthYear),
        get().fetchTransactions(),
        get().fetchBudgets(get().selectedMonthYear),
        get().fetchInsights(get().selectedMonthYear),
        get().fetchGoals(),
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

  fetchInsights: async (monthYear) => {
    const targetMonth = monthYear || get().selectedMonthYear;
    try {
      const data = await insightsService.get(targetMonth);
      if (data?.healthScore) {
        set({ insights: data });
      }
    } catch {
      // Keep resilient demo/sample insights
    }
  },

  fetchGoals: async () => {
    try {
      const response = await goalService.list();
      if (response?.data) {
        set({ goals: response.data });
      }
    } catch {
      // Keep resilient fallback
    }
  },

  addGoal: async (data) => {
    try {
      const newGoal = await goalService.create(data);
      set((state) => ({
        goals: [newGoal, ...state.goals],
      }));
    } catch {
      const target = data.targetAmount;
      const current = data.currentAmount || 0;
      const mockGoal: Goal = {
        id: `goal-${Date.now()}`,
        title: data.title,
        targetAmount: target,
        currentAmount: current,
        percentage: Number(Math.min(100, (current / target) * 100).toFixed(1)),
        remainingAmount: Number(Math.max(0, target - current).toFixed(2)),
        isCompleted: current >= target,
        deadline: data.deadline,
        category: data.category || 'General',
        color: data.color || '#10b981',
        createdAt: new Date().toISOString(),
      };
      set((state) => ({
        goals: [mockGoal, ...state.goals],
      }));
    }
  },

  depositToGoal: async (id, amount, type) => {
    try {
      const updated = await goalService.deposit(id, { amount, type });
      set((state) => ({
        goals: state.goals.map((g) => (g.id === id ? updated : g)),
      }));
      return { success: true };
    } catch (error: any) {
      let errMsg = '';
      set((state) => ({
        goals: state.goals.map((g) => {
          if (g.id !== id) return g;
          let newCurrent = g.currentAmount;
          if (type === 'DEPOSIT') {
            newCurrent += amount;
          } else {
            if (amount > g.currentAmount) {
              errMsg = 'Cannot withdraw more than balance';
              return g;
            }
            newCurrent -= amount;
          }
          const percentage = Number(Math.min(100, (newCurrent / g.targetAmount) * 100).toFixed(1));
          return {
            ...g,
            currentAmount: Number(newCurrent.toFixed(2)),
            percentage,
            remainingAmount: Number(Math.max(0, g.targetAmount - newCurrent).toFixed(2)),
            isCompleted: newCurrent >= g.targetAmount,
          };
        }),
      }));
      if (errMsg) return { success: false, message: errMsg };
      return { success: true };
    }
  },

  deleteGoal: async (id) => {
    try {
      await goalService.delete(id);
    } catch {
      // Offline fallback
    }
    set((state) => ({
      goals: state.goals.filter((g) => g.id !== id),
    }));
  },
}));

import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach Authorization header if stored locally as fallback
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('finflow_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Response interceptor for error normalization
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message || error.message || 'Something went wrong';
    return Promise.reject(new Error(message));
  }
);

// Types
export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export interface Transaction {
  id: string;
  userId: string;
  title: string;
  amount: number;
  type: 'INCOME' | 'EXPENSE';
  category: string;
  date: string;
  createdAt: string;
  updatedAt: string;
}

export interface Budget {
  id: string;
  category: string;
  limitAmount: number;
  monthYear: string;
  spentAmount: number;
  remainingAmount: number;
  percentageUsed: number;
  alertLevel: 'green' | 'amber' | 'red';
  createdAt: string;
}

export interface SummaryData {
  period: {
    monthYear: string;
    startDate: string;
    endDate: string;
  };
  metrics: {
    totalIncome: number;
    totalExpense: number;
    netBalance: number;
    savingsRate: number;
    totalBudgetLimit: number;
    budgetUsedPercentage: number;
  };
  categoryBreakdown: Array<{
    category: string;
    amount: number;
    percentage: number;
  }>;
  recentTransactions: Transaction[];
}

// API Service calls
export const authService = {
  login: async (credentials: { email: string; password: string }) => {
    const res = await api.post('/auth/login', credentials);
    if (res.data.token && typeof window !== 'undefined') {
      localStorage.setItem('finflow_token', res.data.token);
    }
    return res.data;
  },
  register: async (data: { name: string; email: string; password: string }) => {
    const res = await api.post('/auth/register', data);
    if (res.data.token && typeof window !== 'undefined') {
      localStorage.setItem('finflow_token', res.data.token);
    }
    return res.data;
  },
  logout: async () => {
    try {
      await api.post('/auth/logout');
    } finally {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('finflow_token');
      }
    }
  },
  me: async (): Promise<User> => {
    const res = await api.get('/auth/me');
    return res.data.data;
  },
};

export const transactionService = {
  list: async (params?: {
    type?: 'INCOME' | 'EXPENSE';
    category?: string;
    startDate?: string;
    endDate?: string;
    limit?: number;
    page?: number;
  }): Promise<{ data: Transaction[]; pagination: any }> => {
    const res = await api.get('/transactions', { params });
    return res.data;
  },
  create: async (data: {
    title: string;
    amount: number;
    type: 'INCOME' | 'EXPENSE';
    category: string;
    date?: string;
  }): Promise<Transaction> => {
    const res = await api.post('/transactions', data);
    return res.data.data;
  },
  update: async (
    id: string,
    data: Partial<{
      title: string;
      amount: number;
      type: 'INCOME' | 'EXPENSE';
      category: string;
      date?: string;
    }>
  ): Promise<Transaction> => {
    const res = await api.put(`/transactions/${id}`, data);
    return res.data.data;
  },
  delete: async (id: string): Promise<void> => {
    await api.delete(`/transactions/${id}`);
  },
};

export const budgetService = {
  list: async (monthYear?: string): Promise<{ data: Budget[]; monthYear: string }> => {
    const res = await api.get('/budgets', { params: { monthYear } });
    return res.data;
  },
  set: async (data: {
    category: string;
    limitAmount: number;
    monthYear: string;
  }): Promise<Budget> => {
    const res = await api.post('/budgets', data);
    return res.data.data;
  },
  delete: async (id: string): Promise<void> => {
    await api.delete(`/budgets/${id}`);
  },
};

export const summaryService = {
  get: async (monthYear?: string): Promise<SummaryData> => {
    const res = await api.get('/summary', { params: { monthYear } });
    return res.data.data;
  },
};

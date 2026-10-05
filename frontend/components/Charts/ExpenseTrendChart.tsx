'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Transaction } from '@/lib/api';
import { TrendingUp, ArrowDownRight, ArrowUpRight } from 'lucide-react';

interface ExpenseTrendChartProps {
  transactions: Transaction[];
  title?: string;
  subtitle?: string;
}

export const ExpenseTrendChart: React.FC<ExpenseTrendChartProps> = ({
  transactions,
  title = 'Cash Flow & Spending Trend',
  subtitle = 'Income vs Expenses timeline over recorded transactions',
}) => {
  const [isMounted, setIsMounted] = useState(false);
  const [filterMode, setFilterMode] = useState<'BOTH' | 'EXPENSE' | 'INCOME'>('BOTH');

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Aggregate transactions by date chronologically
  const chartData = useMemo(() => {
    if (!transactions || transactions.length === 0) return [];

    // Sort chronologically ascending
    const sorted = [...transactions].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    const grouped: {
      [key: string]: {
        dateKey: string;
        displayDate: string;
        income: number;
        expense: number;
        net: number;
      };
    } = {};

    for (const tx of sorted) {
      const d = new Date(tx.date);
      const dateKey = d.toISOString().split('T')[0];
      const displayDate = d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });

      if (!grouped[dateKey]) {
        grouped[dateKey] = {
          dateKey,
          displayDate,
          income: 0,
          expense: 0,
          net: 0,
        };
      }

      if (tx.type === 'INCOME') {
        grouped[dateKey].income += tx.amount;
      } else {
        grouped[dateKey].expense += tx.amount;
      }
      grouped[dateKey].net = grouped[dateKey].income - grouped[dateKey].expense;
    }

    return Object.values(grouped);
  }, [transactions]);

  const totalExpense = useMemo(
    () => chartData.reduce((acc, curr) => acc + curr.expense, 0),
    [chartData]
  );
  const totalIncome = useMemo(
    () => chartData.reduce((acc, curr) => acc + curr.income, 0),
    [chartData]
  );

  if (!isMounted) {
    return (
      <div className="h-72 flex items-center justify-center text-slate-500 text-xs">
        Loading trend visualization...
      </div>
    );
  }

  if (chartData.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-md text-center">
        <h3 className="text-sm font-bold text-white tracking-tight">{title}</h3>
        <p className="text-xs text-slate-400 mt-1 mb-8">{subtitle}</p>
        <div className="h-48 flex flex-col items-center justify-center text-slate-500 text-xs">
          <span>No transaction timeline data available</span>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 sm:p-6 backdrop-blur-md shadow-lg shadow-black/20 flex flex-col">
      {/* Header with Title and Mode Toggles */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <TrendingUp className="w-4 h-4" />
            </div>
            <h3 className="text-sm sm:text-base font-bold text-white tracking-tight">
              {title}
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">{subtitle}</p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 bg-slate-950/80 p-1 rounded-xl border border-slate-800/80 self-start sm:self-auto text-xs">
          <button
            onClick={() => setFilterMode('BOTH')}
            className={`px-3 py-1 rounded-lg font-medium transition-all ${
              filterMode === 'BOTH'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilterMode('EXPENSE')}
            className={`px-3 py-1 rounded-lg font-medium transition-all flex items-center gap-1 ${
              filterMode === 'EXPENSE'
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ArrowDownRight className="w-3.5 h-3.5" />
            <span>Expense</span>
          </button>
          <button
            onClick={() => setFilterMode('INCOME')}
            className={`px-3 py-1 rounded-lg font-medium transition-all flex items-center gap-1 ${
              filterMode === 'INCOME'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>Income</span>
          </button>
        </div>
      </div>

      {/* Mini Summary stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6 p-3 rounded-xl bg-slate-950/40 border border-slate-800/60">
        <div>
          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            Total Flow In
          </span>
          <p className="text-sm sm:text-base font-bold text-emerald-400">
            +{formatCurrency(totalIncome)}
          </p>
        </div>
        <div>
          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            Total Flow Out
          </span>
          <p className="text-sm sm:text-base font-bold text-rose-400">
            -{formatCurrency(totalExpense)}
          </p>
        </div>
        <div className="col-span-2 sm:col-span-1">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            Net Differential
          </span>
          <p
            className={`text-sm sm:text-base font-bold ${
              totalIncome - totalExpense >= 0 ? 'text-teal-400' : 'text-amber-400'
            }`}
          >
            {formatCurrency(totalIncome - totalExpense)}
          </p>
        </div>
      </div>

      {/* Trend Area Chart */}
      <div className="h-64 sm:h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <defs>
              {/* Income Gradient */}
              <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
              </linearGradient>
              {/* Expense Gradient */}
              <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#334155"
              opacity={0.35}
              vertical={false}
            />

            <XAxis
              dataKey="displayDate"
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: '#334155' }}
            />
            <YAxis
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              tickFormatter={(val) => `$${val}`}
            />

            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="rounded-xl border border-slate-700 bg-slate-950/95 p-3.5 shadow-2xl backdrop-blur-md">
                      <p className="text-xs font-semibold text-slate-300 mb-2 border-b border-slate-800 pb-1">
                        {data.displayDate}
                      </p>
                      <div className="space-y-1.5 text-xs">
                        {(filterMode === 'BOTH' || filterMode === 'INCOME') && (
                          <div className="flex items-center justify-between gap-4">
                            <span className="flex items-center gap-1.5 text-emerald-400">
                              <span className="w-2 h-2 rounded-full bg-emerald-400" />
                              Income:
                            </span>
                            <span className="font-bold text-white">
                              +{formatCurrency(data.income)}
                            </span>
                          </div>
                        )}
                        {(filterMode === 'BOTH' || filterMode === 'EXPENSE') && (
                          <div className="flex items-center justify-between gap-4">
                            <span className="flex items-center gap-1.5 text-rose-400">
                              <span className="w-2 h-2 rounded-full bg-rose-400" />
                              Expense:
                            </span>
                            <span className="font-bold text-white">
                              -{formatCurrency(data.expense)}
                            </span>
                          </div>
                        )}
                        {filterMode === 'BOTH' && (
                          <div className="flex items-center justify-between gap-4 pt-1.5 border-t border-slate-800">
                            <span className="text-slate-400 font-medium">Net:</span>
                            <span
                              className={`font-bold ${
                                data.net >= 0 ? 'text-teal-400' : 'text-rose-400'
                              }`}
                            >
                              {data.net >= 0 ? '+' : ''}
                              {formatCurrency(data.net)}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />

            {(filterMode === 'BOTH' || filterMode === 'INCOME') && (
              <Area
                type="monotone"
                dataKey="income"
                stroke="#10b981"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#incomeGradient)"
                name="Income"
              />
            )}

            {(filterMode === 'BOTH' || filterMode === 'EXPENSE') && (
              <Area
                type="monotone"
                dataKey="expense"
                stroke="#f43f5e"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#expenseGradient)"
                name="Expense"
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

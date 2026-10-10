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
      <div className="rounded-2xl border border-[#17274f] bg-[#0c1630]/75 p-6 backdrop-blur-md text-center">
        <h3 className="font-serif text-sm font-bold text-white tracking-tight">{title}</h3>
        <p className="text-xs text-slate-400 mt-1 mb-8">{subtitle}</p>
        <div className="h-48 flex flex-col items-center justify-center text-slate-500 text-xs font-mono">
          <span>No transaction timeline data available</span>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-[#17274f] bg-[#0c1630]/75 p-5 sm:p-6 backdrop-blur-md shadow-lg shadow-black/20 flex flex-col">
      {/* Header with Title and Mode Toggles */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-[#132247] text-amber-400 border border-[#1b2f5f]">
              <TrendingUp className="w-4 h-4" />
            </div>
            <h3 className="font-serif text-sm sm:text-base font-bold text-white tracking-tight">
              {title}
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">{subtitle}</p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 bg-[#091226] p-1 rounded-xl border border-[#17274f] self-start sm:self-auto text-xs">
          <button
            onClick={() => setFilterMode('BOTH')}
            className={`px-3 py-1 rounded-lg font-medium transition-all ${
              filterMode === 'BOTH'
                ? 'bg-[#14234b] text-white shadow-sm font-semibold'
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
                ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>Income</span>
          </button>
        </div>
      </div>

      {/* Mini Summary stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6 p-3 rounded-xl bg-[#091226]/80 border border-[#17274f]/60">
        <div>
          <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            Total Flow In
          </span>
          <p className="font-mono text-sm sm:text-base font-bold text-amber-300 tabular-nums">
            +{formatCurrency(totalIncome)}
          </p>
        </div>
        <div>
          <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            Total Flow Out
          </span>
          <p className="font-mono text-sm sm:text-base font-bold text-rose-400 tabular-nums">
            -{formatCurrency(totalExpense)}
          </p>
        </div>
        <div className="col-span-2 sm:col-span-1">
          <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            Net Differential
          </span>
          <p
            className={`font-mono text-sm sm:text-base font-bold tabular-nums ${
              totalIncome - totalExpense >= 0 ? 'text-amber-400' : 'text-rose-400'
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
              {/* Income Gold Gradient */}
              <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
              </linearGradient>
              {/* Expense Coral Gradient */}
              <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#1b2b52"
              opacity={0.5}
              vertical={false}
            />

            <XAxis
              dataKey="displayDate"
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: '#1b2b52' }}
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
                    <div className="rounded-xl border border-[#1b2b52] bg-[#091226]/95 p-3.5 shadow-2xl backdrop-blur-md">
                      <p className="font-mono text-xs font-semibold text-slate-300 mb-2 border-b border-[#17274f] pb-1">
                        {data.displayDate}
                      </p>
                      <div className="space-y-1.5 text-xs font-mono">
                        {(filterMode === 'BOTH' || filterMode === 'INCOME') && (
                          <div className="flex items-center justify-between gap-4">
                            <span className="flex items-center gap-1.5 text-amber-300">
                              <span className="w-2 h-2 rounded-full bg-amber-400" />
                              Income:
                            </span>
                            <span className="font-bold text-white tabular-nums">
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
                            <span className="font-bold text-white tabular-nums">
                              -{formatCurrency(data.expense)}
                            </span>
                          </div>
                        )}
                        {filterMode === 'BOTH' && (
                          <div className="flex items-center justify-between gap-4 pt-1.5 border-t border-[#17274f]">
                            <span className="text-slate-400 font-medium">Net:</span>
                            <span
                              className={`font-bold tabular-nums ${
                                data.net >= 0 ? 'text-amber-300' : 'text-rose-400'
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
                stroke="#f59e0b"
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

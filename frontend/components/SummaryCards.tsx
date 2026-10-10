'use client';

import React from 'react';
import {
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  Percent,
} from 'lucide-react';
import { useFinFlowStore } from '@/lib/store';
import { formatCurrency } from '@/lib/utils';

export const SummaryCards: React.FC = () => {
  const { summary } = useFinFlowStore();
  const metrics = summary?.metrics || {
    totalIncome: 0,
    totalExpense: 0,
    netBalance: 0,
    savingsRate: 0,
    totalBudgetLimit: 0,
    budgetUsedPercentage: 0,
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
      {/* Net Balance Card */}
      <div className="relative overflow-hidden rounded-2xl border border-[#17274f] bg-[#0c1630]/75 p-5 backdrop-blur-md shadow-lg shadow-black/20 hover:border-amber-400/30 transition-all duration-200">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Net Cash Flow
          </span>
          <div className="p-2.5 rounded-xl bg-amber-400/10 text-amber-300 border border-amber-400/20">
            <Wallet className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3">
          <div className="font-mono text-2xl sm:text-3xl font-bold tracking-tight text-white tabular-nums">
            {formatCurrency(metrics.netBalance)}
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-xs">
            <span
              className={`inline-flex items-center gap-1 font-mono font-semibold px-2 py-0.5 rounded-full text-[11px] ${
                metrics.netBalance >= 0
                  ? 'bg-amber-400/10 text-amber-300 border border-amber-400/20'
                  : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
              }`}
            >
              {metrics.netBalance >= 0 ? '+' : ''}
              {metrics.netBalance >= 0 ? 'Surplus' : 'Deficit'}
            </span>
            <span className="text-slate-400">billing period</span>
          </div>
        </div>
      </div>

      {/* Total Income Card */}
      <div className="relative overflow-hidden rounded-2xl border border-[#17274f] bg-[#0c1630]/75 p-5 backdrop-blur-md shadow-lg shadow-black/20 hover:border-amber-400/30 transition-all duration-200">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Total Inflow
          </span>
          <div className="p-2.5 rounded-xl bg-amber-400/10 text-amber-300 border border-amber-400/20">
            <ArrowUpRight className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3">
          <div className="font-mono text-2xl sm:text-3xl font-bold tracking-tight text-amber-300 tabular-nums">
            {formatCurrency(metrics.totalIncome)}
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-xs text-slate-400">
            <span className="text-amber-300/90 font-medium">Income & Deposits</span>
          </div>
        </div>
      </div>

      {/* Total Expense Card */}
      <div className="relative overflow-hidden rounded-2xl border border-[#17274f] bg-[#0c1630]/75 p-5 backdrop-blur-md shadow-lg shadow-black/20 hover:border-rose-400/30 transition-all duration-200">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Total Outflow
          </span>
          <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <ArrowDownRight className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3">
          <div className="font-mono text-2xl sm:text-3xl font-bold tracking-tight text-rose-400 tabular-nums">
            {formatCurrency(metrics.totalExpense)}
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-xs text-slate-400">
            <span className="text-rose-400/90 font-medium">Debits & Outlays</span>
          </div>
        </div>
      </div>

      {/* Savings Rate Card */}
      <div className="relative overflow-hidden rounded-2xl border border-[#17274f] bg-[#0c1630]/75 p-5 backdrop-blur-md shadow-lg shadow-black/20 hover:border-amber-400/30 transition-all duration-200">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Savings Efficiency
          </span>
          <div className="p-2.5 rounded-xl bg-sky-400/10 text-sky-300 border border-sky-400/20">
            <Percent className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3">
          <div className="font-mono text-2xl sm:text-3xl font-bold tracking-tight text-sky-200 tabular-nums">
            {metrics.savingsRate.toFixed(1)}%
          </div>
          <div className="flex items-center gap-2 mt-2">
            <div className="flex-1 h-1.5 rounded-full bg-[#142349] overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-amber-400 to-sky-400"
                style={{ width: `${Math.min(100, Math.max(0, metrics.savingsRate))}%` }}
              />
            </div>
            <span className="font-mono text-[11px] font-semibold text-slate-400">Retained</span>
          </div>
        </div>
      </div>
    </div>
  );
};

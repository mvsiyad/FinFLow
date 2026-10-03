'use client';

import React from 'react';
import { Sparkles, PlusCircle } from 'lucide-react';
import { SummaryCards } from '@/components/SummaryCards';
import { RecentTransactions } from '@/components/RecentTransactions';
import { BudgetProgressCards } from '@/components/BudgetProgressCards';
import { useFinFlowStore } from '@/lib/store';
import { formatCurrency } from '@/lib/utils';

export default function DashboardPage() {
  const { user, summary, setAddTransactionOpen } = useFinFlowStore();
  const breakdown = summary?.categoryBreakdown || [];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900/90 to-emerald-950/40 p-6 sm:p-8 backdrop-blur-xl shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Phase 3 Interactive Workspace</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Welcome back, {user?.name || 'Investor'}!
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-xl">
              Here is your financial pulse. Track your cash flow, monitor monthly category caps,
              and optimize savings for this period.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setAddTransactionOpen(true)}
              className="flex items-center gap-2 py-3 px-5 rounded-xl font-semibold text-sm text-slate-950 bg-gradient-to-r from-emerald-400 to-teal-300 hover:from-emerald-300 hover:to-teal-200 transition-all duration-200 shadow-lg shadow-emerald-500/25 active:scale-95 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4 stroke-[2.5]" />
              <span>Add Transaction</span>
            </button>
          </div>
        </div>

        {/* Ambient background glow */}
        <div className="absolute -right-10 -bottom-10 w-72 h-72 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
      </div>

      {/* Top 4 KPI Metrics */}
      <SummaryCards />

      {/* Main Content Grid: Transactions & Budgets */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Transactions (2 cols on large screen) */}
        <div className="lg:col-span-2 space-y-6">
          <RecentTransactions />
        </div>

        {/* Budgets & Category Breakdown (1 col) */}
        <div className="space-y-6">
          <BudgetProgressCards />

          {/* Quick Category Spending Breakdown */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 sm:p-6 backdrop-blur-md shadow-lg shadow-black/20">
            <h3 className="text-sm font-bold text-white tracking-tight mb-1">
              Top Spending Categories
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Expense distribution for current period
            </p>

            <div className="space-y-3">
              {breakdown.length === 0 ? (
                <p className="text-xs text-slate-500 text-center py-4">No expense records</p>
              ) : (
                breakdown.slice(0, 4).map((item) => (
                  <div key={item.category} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-slate-300">{item.category}</span>
                      <span className="font-semibold text-slate-100">
                        {formatCurrency(item.amount)} ({item.percentage}%)
                      </span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-teal-400 to-emerald-400"
                        style={{ width: `${Math.min(100, item.percentage)}%` }}
                      />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

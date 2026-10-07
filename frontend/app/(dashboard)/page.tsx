'use client';

import React from 'react';
import { Sparkles, PlusCircle } from 'lucide-react';
import { SummaryCards } from '@/components/SummaryCards';
import { RecentTransactions } from '@/components/RecentTransactions';
import { BudgetProgressCards } from '@/components/BudgetProgressCards';
import { BudgetAlertBanner } from '@/components/BudgetAlertBanner';
import { SmartInsightsCard } from '@/components/SmartInsightsCard';
import { ExpenseTrendChart } from '@/components/Charts/ExpenseTrendChart';
import { CategoryDoughnutChart } from '@/components/Charts/CategoryDoughnutChart';
import { useFinFlowStore } from '@/lib/store';

export default function DashboardPage() {
  const { user, summary, transactions, setAddTransactionOpen } = useFinFlowStore();
  const breakdown = summary?.categoryBreakdown || [];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900/90 to-emerald-950/40 p-6 sm:p-8 backdrop-blur-xl shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Full-Stack Finance Intelligence</span>
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

      {/* Dynamic Budget Alert Notifications (Red 90%+ / Amber 70%) */}
      <BudgetAlertBanner />

      {/* Top 4 KPI Metrics */}
      <SummaryCards />

      {/* FinFlow AI Spending Insights & Intelligence */}
      <SmartInsightsCard />

      {/* Interactive Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ExpenseTrendChart
            transactions={transactions}
            title="Monthly Cash Flow & Spending Trend"
            subtitle="Interactive timeline of earnings and expenditures"
          />
        </div>
        <div className="lg:col-span-1">
          <CategoryDoughnutChart
            data={breakdown}
            title="Category Expense Share"
            subtitle="Current period category allocation"
          />
        </div>
      </div>

      {/* Details Row: Recent Transactions & Category Budgets */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <RecentTransactions />
        </div>
        <div className="lg:col-span-1 space-y-6">
          <BudgetProgressCards />
        </div>
      </div>
    </div>
  );
}

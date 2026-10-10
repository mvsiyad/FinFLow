'use client';

import React from 'react';
import { Sparkles, PlusCircle } from 'lucide-react';
import { SummaryCards } from '@/components/SummaryCards';
import { RecentTransactions } from '@/components/RecentTransactions';
import { BudgetProgressCards } from '@/components/BudgetProgressCards';
import { VaultsOverviewWidget } from '@/components/VaultsOverviewWidget';
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
      <div className="relative overflow-hidden rounded-3xl border border-[#1a2d59] bg-gradient-to-r from-[#0b162f] via-[#091328] to-[#121c3b] p-6 sm:p-8 backdrop-blur-xl shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-mono font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Full-Stack Finance Intelligence</span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-tight">
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
              className="flex items-center gap-2 py-3 px-5 rounded-xl font-bold text-xs sm:text-sm text-slate-950 bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 transition-all duration-200 shadow-lg shadow-amber-500/25 active:scale-95 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4 stroke-[2.5]" />
              <span>Add Transaction</span>
            </button>
          </div>
        </div>

        {/* Ambient background glow */}
        <div className="absolute -right-10 -bottom-10 w-72 h-72 rounded-full bg-amber-400/10 blur-3xl pointer-events-none" />
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
          <VaultsOverviewWidget />
        </div>
      </div>
    </div>
  );
}

'use client';

import React from 'react';
import {
  PieChart as PieIcon,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  ShieldCheck,
  Percent,
} from 'lucide-react';
import { useFinFlowStore } from '@/lib/store';
import { formatCurrency } from '@/lib/utils';
import { CategoryDoughnutChart } from '@/components/Charts/CategoryDoughnutChart';
import { ExpenseTrendChart } from '@/components/Charts/ExpenseTrendChart';
import { CashFlowBarChart } from '@/components/Charts/CashFlowBarChart';
import { BudgetAlertBanner } from '@/components/BudgetAlertBanner';
import { SmartInsightsCard } from '@/components/SmartInsightsCard';

export default function AnalyticsPage() {
  const { summary, transactions, selectedMonthYear } = useFinFlowStore();

  const metrics = summary?.metrics || {
    totalIncome: 0,
    totalExpense: 0,
    netBalance: 0,
    savingsRate: 0,
    totalBudgetLimit: 0,
    budgetUsedPercentage: 0,
  };

  const categoryBreakdown = summary?.categoryBreakdown || [];

  const topCategory = categoryBreakdown.length > 0 ? categoryBreakdown[0] : null;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-mono font-semibold mb-2">
            <PieIcon className="w-3.5 h-3.5 text-amber-400" />
            <span>Interactive Data Visualization</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Financial Analytics & Insights
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Visual trends, spending breakdowns, and cash flow intelligence for {selectedMonthYear}
          </p>
        </div>
      </div>

      {/* Dynamic Budget Alert Banner if thresholds triggered */}
      <BudgetAlertBanner />

      {/* Top 4 KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Inflow */}
        <div className="p-4 sm:p-5 rounded-2xl border border-[#17274f] bg-[#0c1630]/75 backdrop-blur-md">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Total Inflow
            </span>
            <div className="p-2 rounded-xl bg-amber-400/10 text-amber-300 border border-amber-400/20">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <p className="font-mono text-xl sm:text-2xl font-extrabold text-amber-300 mt-2 tabular-nums">
            +{formatCurrency(metrics.totalIncome)}
          </p>
          <span className="font-mono text-[11px] text-slate-500 mt-1 block">
            Aggregated earnings
          </span>
        </div>

        {/* Total Outflow */}
        <div className="p-4 sm:p-5 rounded-2xl border border-[#17274f] bg-[#0c1630]/75 backdrop-blur-md">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Total Outflow
            </span>
            <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
              <ArrowDownRight className="w-4 h-4" />
            </div>
          </div>
          <p className="font-mono text-xl sm:text-2xl font-extrabold text-rose-400 mt-2 tabular-nums">
            -{formatCurrency(metrics.totalExpense)}
          </p>
          <span className="font-mono text-[11px] text-slate-500 mt-1 block">
            Recorded expenditures
          </span>
        </div>

        {/* Savings Rate */}
        <div className="p-4 sm:p-5 rounded-2xl border border-[#17274f] bg-[#0c1630]/75 backdrop-blur-md">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Savings Rate
            </span>
            <div className="p-2 rounded-xl bg-sky-400/10 text-sky-300 border border-sky-400/20">
              <Percent className="w-4 h-4" />
            </div>
          </div>
          <p className="font-mono text-xl sm:text-2xl font-extrabold text-white mt-2 tabular-nums">
            {metrics.savingsRate.toFixed(1)}%
          </p>
          <span className="font-mono text-[11px] text-slate-500 mt-1 block">
            Retained cash flow margin
          </span>
        </div>

        {/* Top Expense Category */}
        <div className="p-4 sm:p-5 rounded-2xl border border-[#17274f] bg-[#0c1630]/75 backdrop-blur-md">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Top Category
            </span>
            <div className="p-2 rounded-xl bg-[#132247] text-amber-400 border border-[#1b2f5f]">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <p className="text-base sm:text-lg font-bold text-white mt-2 truncate">
            {topCategory ? topCategory.category : 'None'}
          </p>
          <span className="font-mono text-[11px] text-slate-400 mt-1 block tabular-nums">
            {topCategory
              ? `${formatCurrency(topCategory.amount)} (${topCategory.percentage}%)`
              : 'No recorded expenses'}
          </span>
        </div>
      </div>

      {/* FinFlow AI Intelligence & Health Score */}
      <SmartInsightsCard />

      {/* Main Trend Line / Area Chart */}
      <ExpenseTrendChart
        transactions={transactions}
        title="Income & Expense Timeline Trend"
        subtitle="Chronological flow of earnings vs expenditures"
      />

      {/* Dual Column Visualization: Doughnut Breakdown + Category Bar Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CategoryDoughnutChart
          data={categoryBreakdown}
          title="Monthly Category Breakdown"
          subtitle="Proportional distribution of expenses"
        />

        <CashFlowBarChart
          data={categoryBreakdown}
          title="Top Category Expenditures"
          subtitle="Direct comparison across budget categories"
        />
      </div>
    </div>
  );
}

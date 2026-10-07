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
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-2">
            <PieIcon className="w-3.5 h-3.5" />
            <span>Interactive Data Visualization</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
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
        <div className="p-4 sm:p-5 rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Total Inflow
            </span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-extrabold text-emerald-400 mt-2">
            +{formatCurrency(metrics.totalIncome)}
          </p>
          <span className="text-[11px] text-slate-500 mt-1 block">
            Aggregated earnings
          </span>
        </div>

        {/* Total Outflow */}
        <div className="p-4 sm:p-5 rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Total Outflow
            </span>
            <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
              <ArrowDownRight className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-extrabold text-rose-400 mt-2">
            -{formatCurrency(metrics.totalExpense)}
          </p>
          <span className="text-[11px] text-slate-500 mt-1 block">
            Recorded expenditures
          </span>
        </div>

        {/* Savings Rate */}
        <div className="p-4 sm:p-5 rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Savings Rate
            </span>
            <div className="p-2 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20">
              <Percent className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-extrabold text-white mt-2">
            {metrics.savingsRate.toFixed(1)}%
          </p>
          <span className="text-[11px] text-slate-500 mt-1 block">
            Retained cash flow margin
          </span>
        </div>

        {/* Top Expense Category */}
        <div className="p-4 sm:p-5 rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Top Category
            </span>
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <p className="text-lg sm:text-xl font-extrabold text-white mt-2 truncate">
            {topCategory ? topCategory.category : 'None'}
          </p>
          <span className="text-[11px] text-slate-500 mt-1 block">
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

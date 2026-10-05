'use client';

import React from 'react';
import { Target, Plus, ShieldAlert, CheckCircle2, AlertTriangle, Trash2 } from 'lucide-react';
import { useFinFlowStore } from '@/lib/store';
import { formatCurrency } from '@/lib/utils';
import { BudgetAlertBanner } from '@/components/BudgetAlertBanner';

export default function BudgetsPage() {
  const { budgets, deleteBudget, setAddBudgetOpen } = useFinFlowStore();

  const totalLimit = budgets.reduce((acc, b) => acc + b.limitAmount, 0);
  const totalSpent = budgets.reduce((acc, b) => acc + b.spentAmount, 0);
  const overallPercentage = totalLimit > 0 ? (totalSpent / totalLimit) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Title & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Monthly Budgets</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Configure monthly category thresholds to prevent spending overruns
          </p>
        </div>

        <button
          onClick={() => setAddBudgetOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm text-slate-950 bg-teal-400 hover:bg-teal-300 transition-all shadow-md shadow-teal-500/20 active:scale-95 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Set Category Budget</span>
        </button>
      </div>

      {/* Dynamic Alert Banner */}
      <BudgetAlertBanner />

      {/* Overview Stat Banner */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 sm:p-6 backdrop-blur-md">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Total Budget Allocated
            </span>
            <p className="text-2xl font-extrabold text-white mt-1">{formatCurrency(totalLimit)}</p>
            <p className="text-xs text-slate-400 mt-1">Across {budgets.length} active categories</p>
          </div>

          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Total Budget Consumed
            </span>
            <p className="text-2xl font-extrabold text-teal-400 mt-1">{formatCurrency(totalSpent)}</p>
            <p className="text-xs text-slate-400 mt-1">
              {formatCurrency(Math.max(0, totalLimit - totalSpent))} remaining allowance
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-300">Overall Budget Utilization</span>
              <span className="font-bold text-slate-100">{overallPercentage.toFixed(1)}%</span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  overallPercentage >= 90
                    ? 'bg-rose-500'
                    : overallPercentage >= 70
                    ? 'bg-amber-400'
                    : 'bg-emerald-400'
                }`}
                style={{ width: `${Math.min(100, overallPercentage)}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Category Budgets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {budgets.length === 0 ? (
          <div className="col-span-full py-16 text-center rounded-2xl border border-dashed border-slate-800 bg-slate-900/20">
            <Target className="w-10 h-10 mx-auto text-slate-600 mb-3" />
            <h3 className="text-base font-semibold text-slate-300">No category budgets yet</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
              Set spending limits for dining, housing, utilities or entertainment to receive instant alerts.
            </p>
            <button
              onClick={() => setAddBudgetOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-slate-950 bg-teal-400 hover:bg-teal-300 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add First Budget</span>
            </button>
          </div>
        ) : (
          budgets.map((b) => {
            const isCritical = b.percentageUsed >= 90;
            const isWarning = b.percentageUsed >= 70 && !isCritical;

            const statusIcon = isCritical ? (
              <ShieldAlert className="w-4 h-4 text-rose-400" />
            ) : isWarning ? (
              <AlertTriangle className="w-4 h-4 text-amber-400" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            );

            const statusText = isCritical
              ? 'Critical (>90%)'
              : isWarning
              ? 'Near Cap (>70%)'
              : 'On Track';

            const statusColor = isCritical
              ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
              : isWarning
              ? 'bg-amber-400/10 text-amber-300 border-amber-400/20'
              : 'bg-emerald-400/10 text-emerald-400 border-emerald-400/20';

            const progressBarColor = isCritical
              ? 'bg-rose-500'
              : isWarning
              ? 'bg-amber-400'
              : 'bg-emerald-400';

            return (
              <div
                key={b.id}
                className="relative rounded-2xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-md shadow-lg flex flex-col justify-between hover:border-slate-700/80 transition-all"
              >
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
                    <div>
                      <h3 className="text-base font-bold text-slate-100">{b.category}</h3>
                      <p className="text-[11px] text-slate-400">{b.monthYear} Budget</p>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <div
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${statusColor}`}
                      >
                        {statusIcon}
                        <span>{statusText}</span>
                      </div>

                      <button
                        onClick={() => deleteBudget(b.id)}
                        title="Delete budget limit"
                        className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Limit & Spent Numbers */}
                  <div className="flex items-baseline justify-between mt-4">
                    <div>
                      <span className="text-xs text-slate-400">Spent</span>
                      <p className="text-xl font-extrabold text-white">
                        {formatCurrency(b.spentAmount)}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-slate-400">Limit</span>
                      <p className="text-base font-semibold text-slate-300">
                        {formatCurrency(b.limitAmount)}
                      </p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-4">
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="text-slate-400">Consumption</span>
                      <span className="font-bold text-slate-200">
                        {b.percentageUsed.toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${progressBarColor}`}
                        style={{ width: `${Math.min(100, b.percentageUsed)}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-400">
                  <span>Remaining</span>
                  <span
                    className={`font-semibold ${
                      b.remainingAmount < 0 ? 'text-rose-400' : 'text-emerald-400'
                    }`}
                  >
                    {formatCurrency(b.remainingAmount)}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

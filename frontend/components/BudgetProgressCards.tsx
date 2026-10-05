'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldAlert, Plus, ExternalLink, Target } from 'lucide-react';
import { useFinFlowStore } from '@/lib/store';
import { formatCurrency } from '@/lib/utils';

export const BudgetProgressCards: React.FC = () => {
  const { budgets, setAddBudgetOpen } = useFinFlowStore();

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 sm:p-6 backdrop-blur-md shadow-lg shadow-black/20">
      <div className="flex items-center justify-between pb-4 border-b border-slate-800/80">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-slate-800 text-teal-400">
            <Target className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white tracking-tight">
              Monthly Budgets & Alerts
            </h2>
            <p className="text-xs text-slate-400">Real-time category spending thresholds</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setAddBudgetOpen(true)}
            className="flex items-center gap-1 text-xs font-semibold text-teal-400 hover:text-teal-300 transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Set Cap</span>
          </button>
          <Link
            href="/budgets"
            className="flex items-center gap-1 text-xs font-semibold text-slate-400 hover:text-slate-200 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      <div className="mt-5 space-y-4">
        {budgets.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-xs text-slate-400">No monthly budgets defined yet.</p>
            <button
              onClick={() => setAddBudgetOpen(true)}
              className="mt-2 text-xs font-semibold text-teal-400 hover:underline"
            >
              Set your first category budget
            </button>
          </div>
        ) : (
          budgets.slice(0, 4).map((b) => {
            const isCritical = b.percentageUsed >= 90;
            const isWarning = b.percentageUsed >= 70 && !isCritical;

            const progressColor = isCritical
              ? 'bg-rose-500'
              : isWarning
              ? 'bg-amber-400'
              : 'bg-emerald-400';

            const badgeColor = isCritical
              ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
              : isWarning
              ? 'bg-amber-400/10 text-amber-300 border-amber-400/20'
              : 'bg-emerald-400/10 text-emerald-400 border-emerald-400/20';

            return (
              <div key={b.id} className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-slate-200">{b.category}</span>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${badgeColor}`}
                    >
                      {b.percentageUsed.toFixed(0)}% used
                    </span>
                    {isCritical && (
                      <span title="Budget critical threshold reached">
                        <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                      </span>
                    )}
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${progressColor}`}
                    style={{ width: `${Math.min(100, b.percentageUsed)}%` }}
                  />
                </div>

                <div className="flex items-center justify-between mt-2 text-xs text-slate-400">
                  <span>
                    Spent: <strong className="text-slate-200">{formatCurrency(b.spentAmount)}</strong>
                  </span>
                  <span>
                    Cap: <span className="text-slate-300">{formatCurrency(b.limitAmount)}</span>
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ShieldAlert, AlertTriangle, ChevronRight, X, Sparkles } from 'lucide-react';
import { useFinFlowStore } from '@/lib/store';
import { formatCurrency } from '@/lib/utils';

export const BudgetAlertBanner: React.FC = () => {
  const { budgets } = useFinFlowStore();
  const [dismissed, setDismissed] = useState(false);

  if (dismissed || !budgets || budgets.length === 0) return null;

  // Filter budgets exceeding 90% (Red Alert) and 70%-89% (Amber Warning)
  const redAlerts = budgets.filter((b) => b.percentageUsed >= 90);
  const amberAlerts = budgets.filter((b) => b.percentageUsed >= 70 && b.percentageUsed < 90);

  if (redAlerts.length === 0 && amberAlerts.length === 0) {
    return null;
  }

  const isCritical = redAlerts.length > 0;
  const primaryAlert = isCritical ? redAlerts[0] : amberAlerts[0];
  const totalAlertCount = redAlerts.length + amberAlerts.length;

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border p-4 sm:p-5 backdrop-blur-md transition-all duration-300 shadow-lg ${
        isCritical
          ? 'bg-rose-950/40 border-rose-500/30 text-rose-100 shadow-rose-950/30'
          : 'bg-amber-950/40 border-amber-500/30 text-amber-100 shadow-amber-950/30'
      }`}
    >
      <div className="flex items-start sm:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3.5">
          <div
            className={`p-2.5 rounded-xl shrink-0 ${
              isCritical
                ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
            }`}
          >
            {isCritical ? (
              <ShieldAlert className="w-5 h-5 animate-pulse" />
            ) : (
              <AlertTriangle className="w-5 h-5" />
            )}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span
                className={`text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                  isCritical
                    ? 'bg-rose-500 text-slate-950'
                    : 'bg-amber-400 text-slate-950'
                }`}
              >
                {isCritical ? 'Critical Budget Alert' : 'Spending Cap Warning'}
              </span>
              {totalAlertCount > 1 && (
                <span className="text-xs text-slate-400 font-medium">
                  +{totalAlertCount - 1} other category threshold{totalAlertCount > 2 ? 's' : ''}
                </span>
              )}
            </div>

            <p className="text-xs sm:text-sm font-semibold mt-1">
              <span className="font-bold underline decoration-slate-600 underline-offset-2">
                {primaryAlert.category}
              </span>{' '}
              is at{' '}
              <span className="font-extrabold">
                {primaryAlert.percentageUsed.toFixed(0)}%
              </span>{' '}
              of capacity ({formatCurrency(primaryAlert.spentAmount)} spent of{' '}
              {formatCurrency(primaryAlert.limitAmount)} limit).
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
          <Link
            href="/budgets"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              isCritical
                ? 'bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 border border-rose-500/30'
                : 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-500/30'
            }`}
          >
            <span>Review Limits</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>

          <button
            onClick={() => setDismissed(true)}
            aria-label="Dismiss alert"
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

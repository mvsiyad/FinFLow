'use client';

import React from 'react';
import Link from 'next/link';
import { Target, Plus, ChevronRight, Trophy } from 'lucide-react';
import { useFinFlowStore } from '@/lib/store';
import { formatCurrency } from '@/lib/utils';

export const VaultsOverviewWidget: React.FC = () => {
  const {
    goals,
    setAddGoalOpen,
    setActiveGoalForDeposit,
    setDepositGoalOpen,
  } = useFinFlowStore();

  const activeVaults = goals.slice(0, 3);

  return (
    <div className="rounded-3xl border border-[#17274f] bg-[#0c1630]/75 p-5 sm:p-6 backdrop-blur-md shadow-xl">
      <div className="flex items-center justify-between pb-4 border-b border-[#17274f]/80">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-[#132247] text-amber-400 border border-[#1b2f5f]">
            <Target className="w-4 h-4" />
          </div>
          <div>
            <h2 className="font-serif text-base font-bold text-white tracking-tight">
              Savings Vaults
            </h2>
            <p className="text-xs text-slate-400">Target milestones & fund allocation</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setAddGoalOpen(true)}
            className="flex items-center gap-1 text-xs font-semibold text-amber-400 hover:text-amber-300 transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">New Vault</span>
          </button>
          <Link
            href="/goals"
            className="flex items-center gap-0.5 text-xs font-semibold text-slate-400 hover:text-slate-200 transition-colors ml-1"
          >
            <span className="font-mono text-xs">All ({goals.length})</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      <div className="mt-4 space-y-3.5">
        {activeVaults.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-xs text-slate-400">No savings vaults created yet.</p>
            <button
              onClick={() => setAddGoalOpen(true)}
              className="mt-2 text-xs font-semibold text-amber-400 hover:underline cursor-pointer"
            >
              Create your first target vault
            </button>
          </div>
        ) : (
          activeVaults.map((g) => {
            const vaultColor = g.color || '#eab308';

            return (
              <div
                key={g.id}
                className="p-3.5 rounded-2xl bg-[#091226]/80 border border-[#17274f]/80 hover:border-amber-400/30 transition-all"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 truncate">
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: vaultColor }}
                    />
                    <span className="text-xs font-bold text-slate-100 truncate">
                      {g.title}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="font-mono text-xs font-extrabold text-white">
                      {g.percentage.toFixed(0)}%
                    </span>
                    <button
                      onClick={() => {
                        setActiveGoalForDeposit(g);
                        setDepositGoalOpen(true);
                      }}
                      className="px-2 py-0.5 rounded-md text-[10px] font-bold text-slate-950 bg-gradient-to-r from-amber-400 to-yellow-300 hover:from-amber-300 hover:to-yellow-200 transition-colors cursor-pointer"
                    >
                      + Fund
                    </button>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-1.5 rounded-full bg-[#132247] overflow-hidden mb-2">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min(100, g.percentage)}%`,
                      backgroundColor: vaultColor,
                    }}
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span className="font-mono text-[11px]">
                    Saved: <strong className="text-slate-200 tabular-nums">{formatCurrency(g.currentAmount)}</strong>
                  </span>
                  <span className="font-mono text-[11px]">
                    Goal: <span className="text-slate-300 tabular-nums">{formatCurrency(g.targetAmount)}</span>
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

'use client';

import React, { useState } from 'react';
import {
  Target,
  Plus,
  Trophy,
  Sparkles,
  CheckCircle2,
  TrendingUp,
  Shield,
} from 'lucide-react';
import { useFinFlowStore } from '@/lib/store';
import { formatCurrency } from '@/lib/utils';
import { GoalCard } from '@/components/GoalCard';

export default function GoalsPage() {
  const { goals, setAddGoalOpen } = useFinFlowStore();
  const [filter, setFilter] = useState<'ALL' | 'ACTIVE' | 'COMPLETED'>('ALL');

  const totalTarget = goals.reduce((acc, g) => acc + g.targetAmount, 0);
  const totalSaved = goals.reduce((acc, g) => acc + g.currentAmount, 0);
  const overallProgress = totalTarget > 0 ? (totalSaved / totalTarget) * 100 : 0;
  const completedGoals = goals.filter((g) => g.percentage >= 100);
  const activeGoals = goals.filter((g) => g.percentage < 100);

  const displayedGoals = goals.filter((g) => {
    if (filter === 'ACTIVE') return g.percentage < 100;
    if (filter === 'COMPLETED') return g.percentage >= 100;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Title & Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-mono font-semibold mb-2">
            <Target className="w-3.5 h-3.5 text-amber-400" />
            <span>Forward-Looking Wealth Building</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Savings Goals & Vaults
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Earmark surplus cash flow into dedicated targets and track milestone completion
          </p>
        </div>

        <button
          onClick={() => setAddGoalOpen(true)}
          className="flex items-center gap-2 py-3 px-5 rounded-xl font-bold text-xs sm:text-sm text-slate-950 bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 transition-all duration-200 shadow-lg shadow-amber-500/20 active:scale-95 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>New Savings Vault</span>
        </button>
      </div>

      {/* Aggregate Vaults Overview Banner */}
      <div className="rounded-3xl border border-[#17274f] bg-[#0c1630]/75 p-5 sm:p-7 backdrop-blur-xl shadow-xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          <div>
            <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Total Goals Target
            </span>
            <p className="font-mono text-2xl sm:text-3xl font-extrabold text-white mt-1 tabular-nums">
              {formatCurrency(totalTarget)}
            </p>
            <p className="text-xs text-slate-400 mt-1 font-mono">Across {goals.length} target milestones</p>
          </div>

          <div>
            <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Total Accumulated
            </span>
            <p className="font-mono text-2xl sm:text-3xl font-extrabold text-amber-300 mt-1 tabular-nums">
              {formatCurrency(totalSaved)}
            </p>
            <p className="text-xs text-slate-400 mt-1 font-mono">
              {formatCurrency(Math.max(0, totalTarget - totalSaved))} remaining to fully fund all
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-300">Portfolio Completion</span>
              <span className="font-mono font-extrabold text-white">{overallProgress.toFixed(1)}%</span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-[#132247] overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-300 transition-all duration-500"
                style={{ width: `${Math.min(100, overallProgress)}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 font-mono">
              <span>{activeGoals.length} in progress</span>
              <span className="text-amber-300 font-semibold">
                {completedGoals.length} completed
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between gap-3 pt-2">
        <div className="flex items-center gap-2 p-1 rounded-xl bg-[#091226] border border-[#17274f] text-xs">
          <button
            onClick={() => setFilter('ALL')}
            className={`px-3.5 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
              filter === 'ALL'
                ? 'bg-[#14234b] text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All Vaults ({goals.length})
          </button>
          <button
            onClick={() => setFilter('ACTIVE')}
            className={`px-3.5 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
              filter === 'ACTIVE'
                ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Active ({activeGoals.length})
          </button>
          <button
            onClick={() => setFilter('COMPLETED')}
            className={`px-3.5 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
              filter === 'COMPLETED'
                ? 'bg-sky-400/20 text-sky-300 border border-sky-400/30 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Completed ({completedGoals.length})
          </button>
        </div>
      </div>

      {/* Vaults Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {displayedGoals.length === 0 ? (
          <div className="col-span-full py-16 text-center rounded-3xl border border-dashed border-[#17274f] bg-[#0c1630]/30">
            <Target className="w-12 h-12 mx-auto text-slate-600 mb-3" />
            <h3 className="font-serif text-base font-bold text-slate-300">No savings vaults found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
              {filter === 'COMPLETED'
                ? 'None of your vaults have reached 100% yet. Keep saving!'
                : 'Create dedicated target vaults for emergency funds, tech gear, or travel.'}
            </p>
            <button
              onClick={() => setAddGoalOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Create First Vault</span>
            </button>
          </div>
        ) : (
          displayedGoals.map((goal) => <GoalCard key={goal.id} goal={goal} />)
        )}
      </div>
    </div>
  );
}

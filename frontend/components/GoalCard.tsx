'use client';

import React from 'react';
import {
  Target,
  Plus,
  ArrowDownRight,
  Calendar,
  CheckCircle2,
  Trash2,
  Trophy,
  Flame,
} from 'lucide-react';
import { Goal } from '@/lib/api';
import { useFinFlowStore } from '@/lib/store';
import { formatCurrency, formatDate } from '@/lib/utils';

interface GoalCardProps {
  goal: Goal;
}

export const GoalCard: React.FC<GoalCardProps> = ({ goal }) => {
  const { setActiveGoalForDeposit, setDepositGoalOpen, deleteGoal } = useFinFlowStore();

  const isCompleted = goal.percentage >= 100;
  const isNearComplete = goal.percentage >= 75 && !isCompleted;
  const isHalfway = goal.percentage >= 50 && goal.percentage < 75;

  const handleOpenDeposit = () => {
    setActiveGoalForDeposit(goal);
    setDepositGoalOpen(true);
  };

  // SVG Circular progress ring calculations
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (Math.min(100, goal.percentage) / 100) * circumference;

  const vaultColor = goal.color || '#10b981';

  return (
    <div
      className={`relative rounded-3xl border bg-slate-900/70 p-5 sm:p-6 backdrop-blur-xl transition-all duration-300 shadow-xl flex flex-col justify-between hover:border-slate-700/80 group ${
        isCompleted
          ? 'border-emerald-500/40 shadow-emerald-950/20'
          : 'border-slate-800'
      }`}
    >
      {/* Top Header */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <span
              className="w-2.5 h-2.5 rounded-full shrink-0"
              style={{ backgroundColor: vaultColor }}
            />
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              {goal.category || 'Savings Vault'}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {isCompleted && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[10px] font-extrabold uppercase tracking-wider">
                <Trophy className="w-3 h-3 text-emerald-400" />
                <span>Achieved</span>
              </span>
            )}
            <button
              onClick={() => deleteGoal(goal.id)}
              className="p-1 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
              title="Delete Vault"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <h3 className="text-base sm:text-lg font-extrabold text-white tracking-tight line-clamp-1">
          {goal.title}
        </h3>

        {/* Center: Radial Progress Ring + Balances */}
        <div className="flex items-center justify-between gap-4 my-4 p-3.5 rounded-2xl bg-slate-950/50 border border-slate-800/80">
          <div>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block">
              Accumulated
            </span>
            <p className="text-lg sm:text-xl font-extrabold text-white mt-0.5">
              {formatCurrency(goal.currentAmount)}
            </p>
            <span className="text-xs text-slate-400 block mt-0.5">
              Target: <strong className="text-slate-200">{formatCurrency(goal.targetAmount)}</strong>
            </span>
          </div>

          {/* SVG Circular Progress Gauge */}
          <div className="relative w-20 h-20 shrink-0 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 90 90">
              {/* Background Track */}
              <circle
                cx="45"
                cy="45"
                r={radius}
                className="stroke-slate-800"
                strokeWidth="7"
                fill="none"
              />
              {/* Animated Progress Circle */}
              <circle
                cx="45"
                cy="45"
                r={radius}
                stroke={vaultColor}
                strokeWidth="7"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="none"
                className="transition-all duration-700 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-xs font-black text-white">
                {goal.percentage.toFixed(0)}%
              </span>
            </div>
          </div>
        </div>

        {/* Milestone Indicator & Remaining */}
        <div className="space-y-1.5 text-xs text-slate-400 mb-4">
          <div className="flex items-center justify-between">
            <span className="text-[11px]">Milestone Status:</span>
            <span className="font-bold text-slate-200">
              {isCompleted
                ? 'Goal Fully Funded! 🎉'
                : isNearComplete
                ? 'Final Stretch (75%+)'
                : isHalfway
                ? 'Halfway There (50%+)'
                : 'Accumulating'}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[11px]">Remaining to Target:</span>
            <span className="font-semibold text-emerald-400">
              {formatCurrency(goal.remainingAmount)}
            </span>
          </div>

          {goal.deadline && (
            <div className="flex items-center justify-between pt-1 border-t border-slate-800/60">
              <div className="flex items-center gap-1 text-[11px] text-slate-400">
                <Calendar className="w-3 h-3 text-slate-500" />
                <span>{formatDate(goal.deadline)}</span>
              </div>
              <span className="text-[11px] font-medium text-slate-300">
                {goal.daysRemaining !== null
                  ? `${goal.daysRemaining} days left`
                  : 'Open-ended'}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Action Toolbar */}
      <div className="flex items-center gap-2 pt-2 border-t border-slate-800/80">
        <button
          onClick={handleOpenDeposit}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl font-bold text-xs text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-all shadow-md shadow-emerald-500/20 active:scale-95 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>Add Funds</span>
        </button>

        <button
          onClick={handleOpenDeposit}
          className="p-2 rounded-xl text-slate-400 hover:text-slate-100 bg-slate-950/80 hover:bg-slate-800 border border-slate-800 transition-colors cursor-pointer"
          title="Withdraw Funds"
        >
          <ArrowDownRight className="w-4 h-4 text-rose-400" />
        </button>
      </div>
    </div>
  );
};

'use client';

import React, { useState } from 'react';
import { X, ArrowDownRight, ArrowUpRight, DollarSign, Sparkles } from 'lucide-react';
import { useFinFlowStore } from '@/lib/store';
import { formatCurrency } from '@/lib/utils';

const QUICK_AMOUNTS = [50, 100, 250, 500];

export const DepositModal: React.FC = () => {
  const {
    isDepositGoalOpen,
    activeGoalForDeposit,
    setDepositGoalOpen,
    setActiveGoalForDeposit,
    depositToGoal,
  } = useFinFlowStore();

  const [mode, setMode] = useState<'DEPOSIT' | 'WITHDRAW'>('DEPOSIT');
  const [amount, setAmount] = useState<string>('100');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isDepositGoalOpen || !activeGoalForDeposit) return null;

  const goal = activeGoalForDeposit;
  const numAmount = parseFloat(amount) || 0;

  // Real-time calculation of new vault balance
  const projectedBalance =
    mode === 'DEPOSIT'
      ? goal.currentAmount + numAmount
      : Math.max(0, goal.currentAmount - numAmount);

  const projectedPercentage = Number(
    Math.min(100, (projectedBalance / goal.targetAmount) * 100).toFixed(1)
  );

  const handleClose = () => {
    setAmount('100');
    setErrorMessage(null);
    setDepositGoalOpen(false);
    setActiveGoalForDeposit(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (numAmount <= 0) {
      setErrorMessage('Please enter an amount greater than zero.');
      return;
    }

    if (mode === 'WITHDRAW' && numAmount > goal.currentAmount) {
      setErrorMessage(
        `Cannot withdraw more than current balance (${formatCurrency(goal.currentAmount)})`
      );
      return;
    }

    setIsSubmitting(true);
    const res = await depositToGoal(goal.id, numAmount, mode);
    setIsSubmitting(false);

    if (res.success) {
      handleClose();
    } else {
      setErrorMessage(res.message || 'Transaction failed');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-3xl border border-[#1b2b52] bg-[#0b162f]/98 p-6 sm:p-7 text-slate-100 shadow-2xl shadow-black/60 backdrop-blur-xl">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#17274f]/80">
          <div>
            <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Savings Vault Action
            </span>
            <h2 className="font-serif text-lg font-bold text-white tracking-tight mt-0.5">
              {goal.title}
            </h2>
          </div>

          <button
            onClick={handleClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-[#122246] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Balance Summary */}
        <div className="my-4 p-4 rounded-2xl bg-[#091226]/80 border border-[#17274f]/80 flex items-center justify-between">
          <div>
            <span className="font-mono text-[11px] text-slate-400 font-semibold block">Current Balance</span>
            <span className="font-mono text-xl font-extrabold text-white tabular-nums">
              {formatCurrency(goal.currentAmount)}
            </span>
          </div>
          <div className="text-right">
            <span className="font-mono text-[11px] text-slate-400 font-semibold block">Goal Target</span>
            <span className="font-mono text-sm font-bold text-slate-300 tabular-nums">
              {formatCurrency(goal.targetAmount)} ({goal.percentage}%)
            </span>
          </div>
        </div>

        {/* Mode Selector Tabs */}
        <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-[#070e20] border border-[#17274f] mb-4">
          <button
            type="button"
            onClick={() => {
              setMode('DEPOSIT');
              setErrorMessage(null);
            }}
            className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              mode === 'DEPOSIT'
                ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ArrowUpRight className="w-4 h-4 text-amber-400" />
            <span>Deposit / Allocate</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setMode('WITHDRAW');
              setErrorMessage(null);
            }}
            className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              mode === 'WITHDRAW'
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ArrowDownRight className="w-4 h-4 text-rose-400" />
            <span>Withdraw Funds</span>
          </button>
        </div>

        {/* Error notification */}
        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs">
            {errorMessage}
          </div>
        )}

        {/* Amount Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 font-mono">
              Amount to {mode === 'DEPOSIT' ? 'Deposit' : 'Withdraw'}
            </label>
            <div className="relative">
              <DollarSign className="w-5 h-5 absolute left-3.5 top-3 text-slate-500" />
              <input
                type="number"
                step="any"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="100.00"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#070e20] border border-[#17274f] text-base font-mono font-bold text-white focus:outline-none focus:border-amber-400 transition-all"
              />
            </div>
          </div>

          {/* Quick Increment Chips */}
          <div className="flex items-center gap-2">
            <span className="font-mono text-[11px] text-slate-500 font-semibold mr-1">Quick:</span>
            {QUICK_AMOUNTS.map((amt) => (
              <button
                key={amt}
                type="button"
                onClick={() => setAmount(amt.toString())}
                className="px-2.5 py-1 rounded-lg bg-[#132247] hover:bg-[#1a2f60] text-xs font-mono font-semibold text-slate-200 transition-colors cursor-pointer"
              >
                +${amt}
              </button>
            ))}
          </div>

          {/* Live Preview Card */}
          <div className="p-3.5 rounded-xl bg-[#091226]/80 border border-[#17274f]/60 text-xs">
            <div className="flex items-center justify-between text-slate-300 mb-1.5 font-mono">
              <span>New Vault Balance:</span>
              <strong className="text-white font-extrabold text-sm tabular-nums">
                {formatCurrency(projectedBalance)}
              </strong>
            </div>

            <div className="w-full h-1.5 rounded-full bg-[#132247] overflow-hidden">
              <div
                className="h-full rounded-full bg-amber-400 transition-all duration-300"
                style={{ width: `${projectedPercentage}%` }}
              />
            </div>
            <div className="flex justify-between items-center font-mono text-[10px] text-slate-400 mt-1">
              <span>Progress: {projectedPercentage}%</span>
              <span>Remaining: {formatCurrency(Math.max(0, goal.targetAmount - projectedBalance))}</span>
            </div>
          </div>

          {/* Submit Action */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#17274f]/80">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || numAmount <= 0}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md active:scale-95 disabled:opacity-50 cursor-pointer ${
                mode === 'DEPOSIT'
                  ? 'bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-slate-950 shadow-amber-500/20'
                  : 'bg-rose-500 hover:bg-rose-400 text-white shadow-rose-500/20'
              }`}
            >
              {isSubmitting
                ? 'Processing...'
                : mode === 'DEPOSIT'
                ? `Confirm Deposit (+${formatCurrency(numAmount)})`
                : `Confirm Withdrawal (-${formatCurrency(numAmount)})`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

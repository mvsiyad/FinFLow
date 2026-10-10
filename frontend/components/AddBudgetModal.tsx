'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, DollarSign, Tag, Calendar } from 'lucide-react';
import { useFinFlowStore } from '@/lib/store';
import { TRANSACTION_CATEGORIES } from '@/lib/utils';

const budgetSchema = z.object({
  category: z.string().min(1, 'Category is required'),
  limitAmount: z.coerce.number().positive('Limit must be greater than $0'),
  monthYear: z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/, 'Invalid month format'),
});

type BudgetFormData = z.infer<typeof budgetSchema>;

export const AddBudgetModal: React.FC = () => {
  const { isAddBudgetOpen, setAddBudgetOpen, saveBudget, selectedMonthYear } = useFinFlowStore();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<BudgetFormData>({
    resolver: zodResolver(budgetSchema),
    defaultValues: {
      category: 'Groceries & Dining',
      limitAmount: undefined,
      monthYear: selectedMonthYear,
    },
  });

  if (!isAddBudgetOpen) return null;

  const onSubmit = async (data: BudgetFormData) => {
    try {
      await saveBudget(data);
      reset();
      setAddBudgetOpen(false);
    } catch (err) {
      console.error('Failed to set budget', err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={() => setAddBudgetOpen(false)}
        className="fixed inset-0 bg-black/75 backdrop-blur-md transition-opacity"
      />

      {/* Modal Dialog Card */}
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-[#1b2b52] bg-[#0b162f]/98 p-6 sm:p-8 shadow-2xl shadow-black/60 backdrop-blur-xl z-10 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between pb-5 border-b border-[#17274f]">
          <div>
            <h3 className="font-serif text-xl font-bold text-white tracking-tight">Set Category Budget</h3>
            <p className="text-xs text-slate-400 mt-0.5">Define spending thresholds and alerts</p>
          </div>
          <button
            onClick={() => setAddBudgetOpen(false)}
            className="rounded-lg p-1.5 text-slate-400 hover:text-slate-100 hover:bg-[#122246] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-5">
          {/* Category Dropdown */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Category</label>
            <div className="relative">
              <span className="absolute left-3.5 top-2.5 text-slate-400 pointer-events-none">
                <Tag className="w-4 h-4" />
              </span>
              <select
                {...register('category')}
                className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-[#070e20] border border-[#17274f] text-sm text-slate-100 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/30 transition-all cursor-pointer"
              >
                {TRANSACTION_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat} className="bg-[#0b162f] text-slate-200">
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            {errors.category && (
              <p className="text-xs text-rose-400 mt-1">{errors.category.message}</p>
            )}
          </div>

          {/* Limit Amount */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Monthly Limit Amount (USD)
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-2.5 text-slate-400">
                <DollarSign className="w-4 h-4" />
              </span>
              <input
                type="number"
                step="1"
                placeholder="500"
                {...register('limitAmount')}
                className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-[#070e20] border border-[#17274f] text-sm font-mono text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/30 transition-all"
              />
            </div>
            {errors.limitAmount && (
              <p className="text-xs text-rose-400 mt-1">{errors.limitAmount.message}</p>
            )}
          </div>

          {/* Month/Year */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Target Month</label>
            <div className="relative">
              <span className="absolute left-3.5 top-2.5 text-slate-400 pointer-events-none">
                <Calendar className="w-4 h-4" />
              </span>
              <input
                type="month"
                {...register('monthYear')}
                className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-[#070e20] border border-[#17274f] text-sm font-mono text-slate-100 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/30 transition-all cursor-pointer"
              />
            </div>
            {errors.monthYear && (
              <p className="text-xs text-rose-400 mt-1">{errors.monthYear.message}</p>
            )}
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#17274f]">
            <button
              type="button"
              onClick={() => setAddBudgetOpen(false)}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-100 hover:bg-[#122246] transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 transition-all shadow-md shadow-amber-500/20 active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? 'Saving...' : 'Set Budget Limit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, ArrowDownRight, ArrowUpRight, DollarSign, Calendar, Tag } from 'lucide-react';
import { useFinFlowStore } from '@/lib/store';
import { TRANSACTION_CATEGORIES, cn } from '@/lib/utils';

const transactionSchema = z.object({
  title: z.string().trim().min(2, 'Title must be at least 2 characters').max(80),
  amount: z.coerce.number().positive('Amount must be greater than $0'),
  type: z.enum(['INCOME', 'EXPENSE']),
  category: z.string().min(1, 'Please select a category'),
  date: z.string().min(1, 'Date is required'),
});

type TransactionFormData = z.infer<typeof transactionSchema>;

export const AddTransactionModal: React.FC = () => {
  const { isAddTransactionOpen, setAddTransactionOpen, addTransaction } = useFinFlowStore();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      title: '',
      amount: undefined,
      type: 'EXPENSE',
      category: 'Groceries & Dining',
      date: new Date().toISOString().slice(0, 10),
    },
  });

  const selectedType = watch('type');

  if (!isAddTransactionOpen) return null;

  const onSubmit = async (data: TransactionFormData) => {
    try {
      await addTransaction({
        title: data.title,
        amount: data.amount,
        type: data.type,
        category: data.category,
        date: new Date(data.date).toISOString(),
      });
      reset();
      setAddTransactionOpen(false);
    } catch (err) {
      console.error('Failed to add transaction', err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={() => setAddTransactionOpen(false)}
        className="fixed inset-0 bg-black/75 backdrop-blur-md transition-opacity"
      />

      {/* Modal Dialog Card */}
      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/95 p-6 sm:p-8 shadow-2xl shadow-emerald-950/20 backdrop-blur-xl z-10 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-5 border-b border-slate-800">
          <div>
            <h3 className="text-xl font-bold text-white tracking-tight">Record Transaction</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Add a new income movement or expense deduction
            </p>
          </div>
          <button
            onClick={() => setAddTransactionOpen(false)}
            className="rounded-lg p-1.5 text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-5">
          {/* Segmented Type Switcher */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-slate-950 rounded-xl border border-slate-800">
            <button
              type="button"
              onClick={() => setValue('type', 'EXPENSE')}
              className={cn(
                'flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer',
                selectedType === 'EXPENSE'
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              )}
            >
              <ArrowDownRight className="w-4 h-4 text-rose-400" />
              <span>Expense</span>
            </button>
            <button
              type="button"
              onClick={() => setValue('type', 'INCOME')}
              className={cn(
                'flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer',
                selectedType === 'INCOME'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              )}
            >
              <ArrowUpRight className="w-4 h-4 text-emerald-400" />
              <span>Income</span>
            </button>
          </div>

          {/* Title Field */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Transaction Title
            </label>
            <input
              type="text"
              placeholder="e.g. Salary, Supermarket, Electricity Bill"
              {...register('title')}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30 transition-all"
            />
            {errors.title && (
              <p className="text-xs text-rose-400 mt-1">{errors.title.message}</p>
            )}
          </div>

          {/* Amount and Date (Grid) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Amount (USD)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-2.5 text-slate-400">
                  <DollarSign className="w-4 h-4" />
                </span>
                <input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  {...register('amount')}
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30 transition-all"
                />
              </div>
              {errors.amount && (
                <p className="text-xs text-rose-400 mt-1">{errors.amount.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Date</label>
              <div className="relative">
                <span className="absolute left-3.5 top-2.5 text-slate-400 pointer-events-none">
                  <Calendar className="w-4 h-4" />
                </span>
                <input
                  type="date"
                  {...register('date')}
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-sm text-slate-100 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30 transition-all"
                />
              </div>
              {errors.date && (
                <p className="text-xs text-rose-400 mt-1">{errors.date.message}</p>
              )}
            </div>
          </div>

          {/* Category Dropdown */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Category</label>
            <div className="relative">
              <span className="absolute left-3.5 top-2.5 text-slate-400 pointer-events-none">
                <Tag className="w-4 h-4" />
              </span>
              <select
                {...register('category')}
                className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-sm text-slate-100 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30 transition-all cursor-pointer"
              >
                {TRANSACTION_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat} className="bg-slate-900 text-slate-200">
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            {errors.category && (
              <p className="text-xs text-rose-400 mt-1">{errors.category.message}</p>
            )}
          </div>

          {/* Submit Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setAddTransactionOpen(false)}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-100 hover:bg-slate-800/80 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-950 bg-gradient-to-r from-emerald-400 to-teal-300 hover:from-emerald-300 hover:to-teal-200 transition-all shadow-md shadow-emerald-500/20 active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? 'Saving...' : 'Save Transaction'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

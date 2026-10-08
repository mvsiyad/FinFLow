'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Target, DollarSign, Calendar, Tag, Palette } from 'lucide-react';
import { useFinFlowStore } from '@/lib/store';

const COLOR_OPTIONS = [
  { label: 'Emerald', hex: '#10b981' },
  { label: 'Cyan', hex: '#06b6d4' },
  { label: 'Indigo', hex: '#6366f1' },
  { label: 'Violet', hex: '#8b5cf6' },
  { label: 'Amber', hex: '#f59e0b' },
  { label: 'Rose', hex: '#f43f5e' },
];

const CATEGORIES = [
  'Emergency',
  'Travel',
  'Tech & Gear',
  'Property',
  'Investments',
  'Education',
  'Vehicles',
  'Lifestyle',
  'General',
];

const goalSchema = z.object({
  title: z.string().trim().min(1, 'Vault title is required').max(100),
  targetAmount: z.coerce.number().positive('Target amount must be greater than zero'),
  currentAmount: z.coerce.number().min(0, 'Initial deposit cannot be negative'),
  category: z.string().min(1, 'Category is required'),
  deadline: z.string().optional(),
  color: z.string().min(1),
});

type GoalFormData = z.infer<typeof goalSchema>;

export const AddGoalModal: React.FC = () => {
  const { isAddGoalOpen, setAddGoalOpen, addGoal } = useFinFlowStore();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<GoalFormData>({
    resolver: zodResolver(goalSchema),
    defaultValues: {
      title: '',
      targetAmount: undefined,
      currentAmount: 0,
      category: 'General',
      deadline: '',
      color: '#10b981',
    },
  });

  const selectedColor = watch('color');

  if (!isAddGoalOpen) return null;

  const handleClose = () => {
    reset();
    setAddGoalOpen(false);
  };

  const onSubmit = async (data: GoalFormData) => {
    await addGoal({
      title: data.title,
      targetAmount: data.targetAmount,
      currentAmount: data.currentAmount || 0,
      category: data.category,
      deadline: data.deadline ? new Date(data.deadline).toISOString() : null,
      color: data.color,
    });
    handleClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-3xl border border-slate-800 bg-slate-900/95 p-6 sm:p-8 text-slate-100 shadow-2xl shadow-black/60 backdrop-blur-xl">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800/80">
          <div className="flex items-center gap-2.5">
            <div
              className="p-2.5 rounded-xl text-slate-950 font-bold"
              style={{ backgroundColor: selectedColor || '#10b981' }}
            >
              <Target className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-white tracking-tight">
                Create Savings Vault
              </h2>
              <p className="text-xs text-slate-400">
                Set a milestone target to lock and accumulate funds
              </p>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-slate-800/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-5">
          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Vault Name
            </label>
            <input
              {...register('title')}
              type="text"
              placeholder="e.g. Kyoto Trip 2027, Emergency Stash"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 transition-all"
            />
            {errors.title && (
              <p className="text-xs text-rose-400 mt-1 font-medium">{errors.title.message}</p>
            )}
          </div>

          {/* Target Amount & Initial Deposit */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Target Amount ($)
              </label>
              <div className="relative">
                <DollarSign className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                <input
                  {...register('targetAmount')}
                  type="number"
                  step="0.01"
                  placeholder="5000.00"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 transition-all"
                />
              </div>
              {errors.targetAmount && (
                <p className="text-xs text-rose-400 mt-1 font-medium">
                  {errors.targetAmount.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Initial Deposit ($)
              </label>
              <div className="relative">
                <DollarSign className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                <input
                  {...register('currentAmount')}
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 transition-all"
                />
              </div>
              {errors.currentAmount && (
                <p className="text-xs text-rose-400 mt-1 font-medium">
                  {errors.currentAmount.message}
                </p>
              )}
            </div>
          </div>

          {/* Category & Deadline */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Category
              </label>
              <div className="relative">
                <Tag className="w-4 h-4 absolute left-3 top-3 text-slate-500 pointer-events-none" />
                <select
                  {...register('category')}
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-sm text-slate-100 focus:outline-none focus:border-emerald-500 cursor-pointer"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat} className="bg-slate-900 text-slate-200">
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Target Date (Optional)
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 absolute left-3 top-3 text-slate-500 pointer-events-none" />
                <input
                  {...register('deadline')}
                  type="date"
                  className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-slate-950/70 border border-slate-800 text-sm text-slate-100 focus:outline-none focus:border-emerald-500 cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Color Accent Picker */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Vault Accent Color
            </label>
            <div className="flex items-center gap-2.5">
              {COLOR_OPTIONS.map((c) => (
                <button
                  key={c.hex}
                  type="button"
                  onClick={() => setValue('color', c.hex)}
                  className={`w-7 h-7 rounded-full transition-all cursor-pointer ${
                    selectedColor === c.hex
                      ? 'ring-2 ring-white ring-offset-2 ring-offset-slate-900 scale-110'
                      : 'hover:scale-105 opacity-80 hover:opacity-100'
                  }`}
                  style={{ backgroundColor: c.hex }}
                  title={c.label}
                />
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800/80">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-all shadow-md shadow-emerald-500/20 active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? 'Creating...' : 'Create Vault'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

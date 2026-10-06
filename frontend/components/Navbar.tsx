'use client';

import React from 'react';
import Link from 'next/link';
import { Menu, Calendar, Plus, WalletCards, Settings } from 'lucide-react';
import { useFinFlowStore } from '@/lib/store';

interface NavbarProps {
  onMenuClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onMenuClick }) => {
  const {
    selectedMonthYear,
    setSelectedMonthYear,
    setAddTransactionOpen,
    setAddBudgetOpen,
  } = useFinFlowStore();

  // Generate recent 6 months for quick switching
  const getAvailableMonths = () => {
    const months = [];
    const now = new Date();
    for (let i = 0; i < 6; i++) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const val = d.toISOString().slice(0, 7);
      const label = d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
      months.push({ val, label });
    }
    return months;
  };

  const months = getAvailableMonths();

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-20 px-4 sm:px-8 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">
      <div className="flex items-center gap-4">
        {/* Mobile menu button */}
        <button
          onClick={onMenuClick}
          className="p-2 -ml-2 text-slate-400 hover:text-slate-100 rounded-lg lg:hidden hover:bg-slate-800/60"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            Financial Overview
          </h1>
          <p className="text-xs text-slate-400 hidden sm:block">
            Track real-time cash flow, category budgets, and savings rates
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2.5 sm:gap-4">
        {/* Month Selector Dropdown */}
        <div className="relative flex items-center bg-slate-900/90 border border-slate-800 rounded-xl px-3 py-1.5 shadow-inner">
          <Calendar className="w-3.5 h-3.5 text-emerald-400 mr-2 shrink-0" />
          <select
            value={selectedMonthYear}
            onChange={(e) => setSelectedMonthYear(e.target.value)}
            className="bg-transparent text-xs sm:text-sm font-medium text-slate-200 focus:outline-none cursor-pointer pr-1"
          >
            {months.map((m) => (
              <option key={m.val} value={m.val} className="bg-slate-900 text-slate-200">
                {m.label}
              </option>
            ))}
          </select>
        </div>

        {/* Add Budget Quick Trigger */}
        <button
          onClick={() => setAddBudgetOpen(true)}
          className="hidden sm:flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-850 border border-slate-800 rounded-xl transition-all hover:border-slate-700 cursor-pointer"
        >
          <WalletCards className="w-3.5 h-3.5 text-teal-400" />
          <span>Set Budget</span>
        </button>

        {/* Quick Add Transaction Button */}
        <button
          onClick={() => setAddTransactionOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-xl shadow-md shadow-emerald-500/20 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span className="hidden sm:inline">Transaction</span>
          <span className="sm:hidden">Add</span>
        </button>

        {/* Quick Settings Link */}
        <Link
          href="/settings"
          title="Account Settings & Profile"
          className="p-2 text-slate-400 hover:text-slate-100 bg-slate-900/90 hover:bg-slate-800 border border-slate-800 rounded-xl transition-all cursor-pointer"
        >
          <Settings className="w-4 h-4" />
        </Link>
      </div>
    </header>
  );
};

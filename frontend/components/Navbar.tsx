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
    <header className="sticky top-0 z-30 flex items-center justify-between h-20 px-4 sm:px-8 border-b border-[#152347] bg-[#070e20]/85 backdrop-blur-xl">
      <div className="flex items-center gap-4">
        {/* Mobile menu button */}
        <button
          onClick={onMenuClick}
          className="p-2 -ml-2 text-slate-400 hover:text-amber-200 rounded-lg lg:hidden hover:bg-[#0f1d3c]/60"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h1 className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-white">
            Financial Overview
          </h1>
          <p className="text-xs text-slate-400 hidden sm:block">
            Track real-time cash flow, category budgets, and savings rates
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2.5 sm:gap-4">
        {/* Month Selector Dropdown */}
        <div className="relative flex items-center bg-[#0b162f] border border-[#17274f] rounded-xl px-3 py-1.5 shadow-inner">
          <Calendar className="w-3.5 h-3.5 text-amber-400 mr-2 shrink-0" />
          <select
            value={selectedMonthYear}
            onChange={(e) => setSelectedMonthYear(e.target.value)}
            className="bg-transparent text-xs sm:text-sm font-mono font-medium text-slate-200 focus:outline-none cursor-pointer pr-1"
          >
            {months.map((m) => (
              <option key={m.val} value={m.val} className="bg-[#0b162f] text-slate-200">
                {m.label}
              </option>
            ))}
          </select>
        </div>

        {/* Add Budget Quick Trigger */}
        <button
          onClick={() => setAddBudgetOpen(true)}
          className="hidden sm:flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-[#0b162f] hover:bg-[#122246] border border-[#17274f] rounded-xl transition-all hover:border-amber-400/30 cursor-pointer"
        >
          <WalletCards className="w-3.5 h-3.5 text-amber-400" />
          <span>Set Budget</span>
        </button>

        {/* Quick Add Transaction Button */}
        <button
          onClick={() => setAddTransactionOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-bold text-slate-950 bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 rounded-xl shadow-md shadow-amber-500/20 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span className="hidden sm:inline">Transaction</span>
          <span className="sm:hidden">Add</span>
        </button>

        {/* Quick Settings Link */}
        <Link
          href="/settings"
          title="Account Settings & Profile"
          className="p-2 text-slate-400 hover:text-amber-200 bg-[#0b162f] hover:bg-[#122246] border border-[#17274f] rounded-xl transition-all cursor-pointer"
        >
          <Settings className="w-4 h-4" />
        </Link>
      </div>
    </header>
  );
};

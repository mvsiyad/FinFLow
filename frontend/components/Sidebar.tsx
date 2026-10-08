'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  ArrowLeftRight,
  PieChart,
  Wallet,
  Target,
  Settings,
  PlusCircle,
  TrendingUp,
  LogOut,
} from 'lucide-react';
import { useFinFlowStore } from '@/lib/store';
import { cn } from '@/lib/utils';

const navItems = [
  {
    name: 'Dashboard',
    href: '/',
    icon: LayoutDashboard,
  },
  {
    name: 'Transactions',
    href: '/transactions',
    icon: ArrowLeftRight,
  },
  {
    name: 'Budgets & Limits',
    href: '/budgets',
    icon: Wallet,
  },
  {
    name: 'Savings & Vaults',
    href: '/goals',
    icon: Target,
  },
  {
    name: 'Analytics',
    href: '/analytics',
    icon: PieChart,
  },
  {
    name: 'Settings',
    href: '/settings',
    icon: Settings,
  },
];

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { setAddTransactionOpen, user, logout } = useFinFlowStore();

  const handleLogout = async () => {
    await logout();
    if (onClose) onClose();
    router.push('/login');
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden transition-opacity"
        />
      )}

      <aside
        className={cn(
          'fixed top-0 bottom-0 left-0 z-50 flex flex-col w-64 border-r transition-transform duration-300 ease-in-out lg:static lg:translate-x-0',
          'bg-slate-950/95 border-slate-800/80 text-slate-200 backdrop-blur-xl',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Brand Header */}
        <div className="flex items-center gap-3 px-6 h-20 border-b border-slate-800/60">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 text-slate-950 font-black text-xl">
            <TrendingUp className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
              FinFlow
            </span>
            <span className="block text-[10px] uppercase tracking-wider text-emerald-400 font-semibold">
              Personal Wealth OS
            </span>
          </div>
        </div>

        {/* Primary Action Button */}
        <div className="px-4 pt-6 pb-2">
          <button
            onClick={() => {
              setAddTransactionOpen(true);
              if (onClose) onClose();
            }}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-medium text-sm text-slate-950 bg-gradient-to-r from-emerald-400 to-teal-300 hover:from-emerald-300 hover:to-teal-200 transition-all duration-200 shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 active:scale-[0.98] cursor-pointer"
          >
            <PlusCircle className="w-4 h-4 stroke-[2.5]" />
            <span>New Transaction</span>
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
          <div className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Navigation
          </div>
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== '/' && pathname.startsWith(item.href));
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  'flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group relative',
                  isActive
                    ? 'text-emerald-400 bg-emerald-500/10 font-semibold'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900/60'
                )}
              >
                {isActive && (
                  <span className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r-full bg-emerald-500" />
                )}
                <Icon
                  className={cn(
                    'w-4 h-4 transition-colors',
                    isActive
                      ? 'text-emerald-400'
                      : 'text-slate-400 group-hover:text-slate-200'
                  )}
                />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Footer Profile */}
        <div className="p-3.5 border-t border-slate-800/60 bg-slate-900/40 flex items-center justify-between gap-2">
          <Link
            href="/settings"
            onClick={onClose}
            className="flex items-center gap-2.5 min-w-0 flex-1 p-1 rounded-xl hover:bg-slate-800/50 transition-colors group"
            title="Open Settings"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-500 to-cyan-500 flex items-center justify-center font-bold text-slate-950 text-xs shadow-md shrink-0">
              {user?.name ? user.name.slice(0, 2).toUpperCase() : 'FF'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-slate-200 truncate group-hover:text-emerald-400 transition-colors">
                {user?.name || 'Alex Rivera'}
              </p>
              <p className="text-[10px] text-slate-400 truncate">
                {user?.email || 'demo@finflow.dev'}
              </p>
            </div>
          </Link>

          <button
            onClick={handleLogout}
            title="Sign out"
            className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer shrink-0"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>
    </>
  );
};

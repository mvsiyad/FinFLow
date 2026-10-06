'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  User as UserIcon,
  Shield,
  Key,
  Globe,
  Bell,
  Download,
  LogOut,
  Sparkles,
  Check,
  FileSpreadsheet,
} from 'lucide-react';
import { useFinFlowStore } from '@/lib/store';
import { exportTransactionsToCSV } from '@/lib/csvExport';

const CURRENCIES = [
  { code: 'USD', symbol: '$', label: 'US Dollar (USD)' },
  { code: 'EUR', symbol: '€', label: 'Euro (EUR)' },
  { code: 'GBP', symbol: '£', label: 'British Pound (GBP)' },
  { code: 'CAD', symbol: 'CA$', label: 'Canadian Dollar (CAD)' },
  { code: 'INR', symbol: '₹', label: 'Indian Rupee (INR)' },
  { code: 'JPY', symbol: '¥', label: 'Japanese Yen (JPY)' },
];

export default function SettingsPage() {
  const router = useRouter();
  const { user, transactions, logout, loginWithDemo } = useFinFlowStore();
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [savedFeedback, setSavedFeedback] = useState(false);

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  const handleSavePreferences = () => {
    setSavedFeedback(true);
    setTimeout(() => setSavedFeedback(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Settings & Profile
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Manage your account profile, workspace currency, alerts, and security settings
        </p>
      </div>

      {/* User Profile Card */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-md shadow-xl">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <UserIcon className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white tracking-tight">User Profile</h2>
            <p className="text-xs text-slate-400">Account identity and credentials</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">
              Account Name
            </span>
            <p className="text-sm font-bold text-slate-100">{user?.name || 'Investor'}</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">
              Email Address
            </span>
            <p className="text-sm font-bold text-slate-100">{user?.email || 'user@finflow.dev'}</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">
              Account ID
            </span>
            <p className="text-xs font-mono text-slate-400 truncate">
              {user?.id || 'demo-user-session'}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">
              Security Protocol
            </span>
            <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
              <Shield className="w-3.5 h-3.5" />
              <span>JWT + HTTP-Only Cookie</span>
            </div>
          </div>
        </div>
      </div>

      {/* Regional & Currency Preferences */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-md shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">Display Currency</h2>
              <p className="text-xs text-slate-400">Configure financial symbol and standard formatting</p>
            </div>
          </div>

          <button
            onClick={handleSavePreferences}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-950 bg-teal-400 hover:bg-teal-300 transition-all cursor-pointer shadow-md active:scale-95"
          >
            {savedFeedback ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Saved!</span>
              </>
            ) : (
              <span>Save Choice</span>
            )}
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
          {CURRENCIES.map((c) => (
            <button
              key={c.code}
              onClick={() => setSelectedCurrency(c.code)}
              className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                selectedCurrency === c.code
                  ? 'bg-teal-500/10 border-teal-500/40 text-teal-200 ring-1 ring-teal-500/30'
                  : 'bg-slate-950/60 border-slate-800/80 text-slate-300 hover:bg-slate-800/40'
              }`}
            >
              <span className="text-xs font-bold block">{c.label}</span>
              <span className="text-sm font-extrabold text-white mt-1 block">{c.symbol}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Alert Policy & Intelligence */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-md shadow-xl">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Bell className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white tracking-tight">Budget Alert Thresholds</h2>
            <p className="text-xs text-slate-400">Automated warning thresholds configured across FinFlow</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-emerald-500/20">
            <span className="font-bold text-emerald-400 block mb-1">&lt; 70% Consumption</span>
            <p className="text-slate-400">Normal healthy status indicator. Spending is fully within allowance.</p>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-amber-500/20">
            <span className="font-bold text-amber-300 block mb-1">70% – 89.9% Consumption</span>
            <p className="text-slate-400">Amber warning status. Near capacity notification banner triggers.</p>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-rose-500/20">
            <span className="font-bold text-rose-400 block mb-1">&ge; 90% Consumption</span>
            <p className="text-slate-400">Critical alert status. High priority banner requiring budget review.</p>
          </div>
        </div>
      </div>

      {/* Data Export & Backup */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-md shadow-xl">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <FileSpreadsheet className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white tracking-tight">Data Export & Backup</h2>
            <p className="text-xs text-slate-400">Export financial ledgers and records</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
          <div>
            <p className="text-xs text-slate-300 font-semibold">
              Download Full Transaction History (.CSV)
            </p>
            <p className="text-xs text-slate-500 mt-0.5">
              Exports all {transactions.length} recorded items to an RFC-4180 standard spreadsheet.
            </p>
          </div>

          <button
            onClick={() => exportTransactionsToCSV(transactions, 'finflow-backup')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs text-slate-200 bg-slate-950/90 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 transition-all cursor-pointer shadow-sm active:scale-95 shrink-0 self-start sm:self-auto"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            <span>Download CSV Ledger</span>
          </button>
        </div>
      </div>

      {/* Danger Zone & Logout */}
      <div className="rounded-2xl border border-rose-900/30 bg-rose-950/10 p-6 backdrop-blur-md shadow-xl">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <Key className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-rose-200 tracking-tight">Account & Session</h2>
            <p className="text-xs text-rose-300/70">Session controls and security options</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
          <div>
            <p className="text-xs font-semibold text-slate-200">
              Sign out of this session
            </p>
            <p className="text-xs text-slate-400 mt-0.5">
              Clears the HTTP-only cookie and ends your authenticated session.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                loginWithDemo();
                router.push('/');
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-300 bg-slate-900/90 hover:bg-slate-800 border border-slate-800 transition-all cursor-pointer active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Reset Demo Data</span>
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-rose-100 bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/30 transition-all cursor-pointer active:scale-95"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

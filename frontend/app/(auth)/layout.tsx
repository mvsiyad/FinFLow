import React from 'react';
import Link from 'next/link';
import { TrendingUp, ShieldCheck } from 'lucide-react';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between relative overflow-hidden selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* Ambient background glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[450px] bg-gradient-to-b from-emerald-500/10 via-teal-500/5 to-transparent blur-3xl pointer-events-none rounded-full" />
      <div className="absolute bottom-0 -right-20 w-80 h-80 bg-emerald-500/5 blur-3xl pointer-events-none rounded-full" />

      {/* Header with FinFlow Brand */}
      <header className="relative z-10 w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 text-slate-950 font-black text-xl group-hover:scale-105 transition-transform">
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
        </Link>

        <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-400">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>256-Bit SSL Encrypted & Protected</span>
        </div>
      </header>

      {/* Auth Content */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          {children}
        </div>
      </main>

      {/* Minimal Footer */}
      <footer className="relative z-10 py-6 text-center text-xs text-slate-500 border-t border-slate-800/40">
        <p>&copy; {new Date().getFullYear()} FinFlow. Personal Finance & Wealth Intelligence.</p>
      </footer>
    </div>
  );
}

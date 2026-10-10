import React from 'react';
import Link from 'next/link';
import { TrendingUp, ShieldCheck } from 'lucide-react';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#070e20] text-slate-100 flex flex-col justify-between relative overflow-hidden selection:bg-amber-400/30 selection:text-amber-200">
      {/* Ambient background glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[450px] bg-gradient-to-b from-amber-400/10 via-amber-500/5 to-transparent blur-3xl pointer-events-none rounded-full" />
      <div className="absolute bottom-0 -right-20 w-80 h-80 bg-amber-400/5 blur-3xl pointer-events-none rounded-full" />

      {/* Header with FinFlow Brand */}
      <header className="relative z-10 w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-400 via-amber-300 to-yellow-400 flex items-center justify-center shadow-lg shadow-amber-500/20 text-slate-950 font-black text-xl group-hover:scale-105 transition-transform">
            <TrendingUp className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <span className="font-serif text-2xl font-bold tracking-tight bg-gradient-to-r from-amber-100 via-white to-amber-200 bg-clip-text text-transparent">
              FinFlow
            </span>
            <span className="block font-mono text-[9px] uppercase tracking-widest text-amber-400/90 font-semibold">
              Wealth OS
            </span>
          </div>
        </Link>

        <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-400 font-mono">
          <ShieldCheck className="w-4 h-4 text-amber-400" />
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
      <footer className="relative z-10 py-6 text-center text-xs text-slate-500 border-t border-[#17274f]/40 font-mono">
        <p>&copy; {new Date().getFullYear()} FinFlow. Bespoke Personal Wealth & Finance Intelligence.</p>
      </footer>
    </div>
  );
}

'use client';

import React from 'react';
import Link from 'next/link';
import {
  ArrowDownRight,
  ArrowUpRight,
  Trash2,
  ExternalLink,
  Receipt,
} from 'lucide-react';
import { useFinFlowStore } from '@/lib/store';
import { formatCurrency, formatDate } from '@/lib/utils';

export const RecentTransactions: React.FC = () => {
  const { transactions, deleteTransaction, setAddTransactionOpen } = useFinFlowStore();
  const recent = transactions.slice(0, 6);

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 sm:p-6 backdrop-blur-md shadow-lg shadow-black/20">
      <div className="flex items-center justify-between pb-4 border-b border-slate-800/80">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-slate-800 text-slate-300">
            <Receipt className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white tracking-tight">
              Recent Transactions
            </h2>
            <p className="text-xs text-slate-400">Latest activity across all categories</p>
          </div>
        </div>

        <Link
          href="/transactions"
          className="flex items-center gap-1 text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
        >
          <span>View All</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="mt-4 divide-y divide-slate-800/60">
        {recent.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-sm text-slate-400">No transactions recorded yet.</p>
            <button
              onClick={() => setAddTransactionOpen(true)}
              className="mt-3 text-xs font-semibold text-emerald-400 hover:underline"
            >
              + Add your first transaction
            </button>
          </div>
        ) : (
          recent.map((tx) => {
            const isIncome = tx.type === 'INCOME';
            return (
              <div
                key={tx.id}
                className="flex items-center justify-between py-3.5 group hover:bg-slate-800/20 px-2 rounded-xl transition-colors"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${
                      isIncome
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                    }`}
                  >
                    {isIncome ? (
                      <ArrowUpRight className="w-4 h-4" />
                    ) : (
                      <ArrowDownRight className="w-4 h-4" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-100 truncate">
                      {tx.title}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-400">
                      <span className="inline-block px-2 py-0.5 rounded-md bg-slate-800 text-[10px] font-medium text-slate-300">
                        {tx.category}
                      </span>
                      <span>•</span>
                      <span>{formatDate(tx.date)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3.5">
                  <div className="text-right">
                    <p
                      className={`text-sm font-bold ${
                        isIncome ? 'text-emerald-400' : 'text-slate-100'
                      }`}
                    >
                      {isIncome ? '+' : '-'}
                      {formatCurrency(tx.amount)}
                    </p>
                    <span className="text-[10px] uppercase font-semibold text-slate-400">
                      {tx.type}
                    </span>
                  </div>

                  <button
                    onClick={() => deleteTransaction(tx.id)}
                    title="Delete transaction"
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

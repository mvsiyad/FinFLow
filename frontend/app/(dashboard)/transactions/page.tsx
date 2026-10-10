'use client';

import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  Trash2,
  Calendar,
  Layers,
  Download,
} from 'lucide-react';
import { useFinFlowStore } from '@/lib/store';
import { formatCurrency, formatDate, TRANSACTION_CATEGORIES } from '@/lib/utils';
import { exportTransactionsToCSV } from '@/lib/csvExport';

export default function TransactionsPage() {
  const { transactions, deleteTransaction, setAddTransactionOpen } = useFinFlowStore();

  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState<'ALL' | 'INCOME' | 'EXPENSE'>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  // Filtered transactions
  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      const matchesSearch =
        tx.title.toLowerCase().includes(search.toLowerCase()) ||
        tx.category.toLowerCase().includes(search.toLowerCase());

      const matchesType =
        selectedType === 'ALL' || tx.type === selectedType;

      const matchesCategory =
        selectedCategory === 'ALL' || tx.category === selectedCategory;

      return matchesSearch && matchesType && matchesCategory;
    });
  }, [transactions, search, selectedType, selectedCategory]);

  return (
    <div className="space-y-6">
      {/* Page Title & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold tracking-tight text-white">Transactions History</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Manage, filter, and inspect your recorded earnings and expenditures
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <button
            onClick={() => exportTransactionsToCSV(filteredTransactions, 'finflow-transactions')}
            className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm text-slate-200 bg-[#0b162f] hover:bg-[#122246] border border-[#17274f] hover:border-amber-400/30 transition-all shadow-md active:scale-95 cursor-pointer"
            title="Export filtered records to CSV"
          >
            <Download className="w-4 h-4 text-amber-400" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => setAddTransactionOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-slate-950 bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 transition-all shadow-md shadow-amber-500/20 active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>New Transaction</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-2xl border border-[#17274f] bg-[#0c1630]/75 backdrop-blur-md">
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title or category..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#070e20] border border-[#17274f] text-xs sm:text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-amber-400"
          />
        </div>

        {/* Type Filter */}
        <div className="relative">
          <Filter className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400 pointer-events-none" />
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value as any)}
            className="w-full pl-8 pr-3 py-2 rounded-xl bg-[#070e20] border border-[#17274f] text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-amber-400 cursor-pointer"
          >
            <option value="ALL">All Types</option>
            <option value="INCOME">Income Only</option>
            <option value="EXPENSE">Expense Only</option>
          </select>
        </div>

        {/* Category Filter */}
        <div className="relative">
          <Layers className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400 pointer-events-none" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full pl-8 pr-3 py-2 rounded-xl bg-[#070e20] border border-[#17274f] text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-amber-400 cursor-pointer"
          >
            <option value="ALL">All Categories</option>
            {TRANSACTION_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="rounded-2xl border border-[#17274f] bg-[#0c1630]/75 overflow-hidden backdrop-blur-md shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="border-b border-[#17274f] bg-[#070e20]/90 text-[11px] font-mono font-semibold uppercase tracking-wider text-slate-400">
              <tr>
                <th className="py-3.5 px-4 sm:px-6">Description</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4 text-right">Amount</th>
                <th className="py-3.5 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#17274f]/60 text-slate-200">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-500 font-mono text-xs">
                    No transactions match the selected filters.
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((tx) => {
                  const isIncome = tx.type === 'INCOME';
                  return (
                    <tr
                      key={tx.id}
                      className="hover:bg-[#122246]/40 transition-colors group"
                    >
                      <td className="py-3.5 px-4 sm:px-6">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${
                              isIncome
                                ? 'bg-amber-400/10 text-amber-300 border-amber-400/20'
                                : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                            }`}
                          >
                            {isIncome ? (
                              <ArrowUpRight className="w-4 h-4" />
                            ) : (
                              <ArrowDownRight className="w-4 h-4" />
                            )}
                          </div>
                          <span className="font-semibold text-slate-100">{tx.title}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="inline-block px-2.5 py-1 rounded-md bg-[#132247] text-[11px] font-mono font-medium text-slate-300">
                          {tx.category}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-400 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 font-mono text-xs">
                          <Calendar className="w-3.5 h-3.5 text-slate-500" />
                          <span>{formatDate(tx.date)}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <span
                          className={`font-mono font-bold tabular-nums ${
                            isIncome ? 'text-amber-400' : 'text-slate-100'
                          }`}
                        >
                          {isIncome ? '+' : '-'}
                          {formatCurrency(tx.amount)}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={() => deleteTransaction(tx.id)}
                          title="Delete transaction"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

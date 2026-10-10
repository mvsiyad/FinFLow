'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  TrendingUp,
  AlertTriangle,
  ShieldAlert,
  CheckCircle2,
  Lightbulb,
  ArrowUpRight,
  Flame,
  Calendar,
  RefreshCw,
  Zap,
} from 'lucide-react';
import { useFinFlowStore } from '@/lib/store';
import { formatCurrency } from '@/lib/utils';
import { SmartInsight } from '@/lib/api';

export const SmartInsightsCard: React.FC = () => {
  const { insights, selectedMonthYear, fetchInsights, isLoading } = useFinFlowStore();
  const [selectedFilter, setSelectedFilter] = useState<'ALL' | 'ALERT' | 'TIP' | 'POSITIVE'>('ALL');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchInsights(selectedMonthYear);
    setTimeout(() => setIsRefreshing(false), 600);
  };

  if (!insights) return null;

  const { healthScore, burnRate, insights: items = [] } = insights;

  const filteredItems = items.filter((item) => {
    if (selectedFilter === 'ALL') return true;
    if (selectedFilter === 'ALERT') return item.type === 'ALERT' || item.type === 'WARNING';
    return item.type === selectedFilter;
  });

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10';
    if (score >= 70) return 'text-teal-400 border-teal-500/30 bg-teal-500/10';
    if (score >= 55) return 'text-amber-300 border-amber-500/30 bg-amber-500/10';
    return 'text-rose-400 border-rose-500/30 bg-rose-500/10';
  };

  const getInsightIcon = (type: SmartInsight['type']) => {
    switch (type) {
      case 'ALERT':
        return <ShieldAlert className="w-4 h-4 text-rose-400" />;
      case 'WARNING':
        return <AlertTriangle className="w-4 h-4 text-amber-300" />;
      case 'POSITIVE':
        return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
      case 'TIP':
        return <Lightbulb className="w-4 h-4 text-cyan-400" />;
    }
  };

  const getInsightBadgeStyle = (type: SmartInsight['type']) => {
    switch (type) {
      case 'ALERT':
        return 'bg-rose-500/10 text-rose-300 border-rose-500/20';
      case 'WARNING':
        return 'bg-amber-400/10 text-amber-300 border-amber-400/20';
      case 'POSITIVE':
        return 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20';
      case 'TIP':
        return 'bg-cyan-500/10 text-cyan-300 border-cyan-500/20';
    }
  };

  return (
    <div className="relative overflow-hidden rounded-3xl border border-[#1a2d59] bg-gradient-to-b from-[#0b162f]/95 via-[#081126]/90 to-[#060b18]/95 p-5 sm:p-7 backdrop-blur-xl shadow-2xl shadow-black/40">
      {/* Ambient background accent */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-b from-amber-400/10 via-amber-500/5 to-transparent blur-3xl pointer-events-none rounded-full" />

      {/* Header with Title and AI Badge */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#17274f]/80">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-400 via-amber-300 to-yellow-400 flex items-center justify-center text-slate-950 font-bold shadow-lg shadow-amber-500/20">
            <Zap className="w-5 h-5 fill-slate-950 stroke-none" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-serif text-base sm:text-lg font-bold text-white tracking-tight">
                FinFlow AI Spending Insights
              </h2>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-[10px] font-mono font-bold uppercase tracking-wider">
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>Smart Engine</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Heuristic cash flow health diagnostics and predictive savings insights
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={handleRefresh}
            disabled={isRefreshing || isLoading}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-300 bg-[#091226]/80 hover:bg-[#122246] border border-[#17274f] transition-all cursor-pointer disabled:opacity-50 active:scale-95"
            title="Recalculate AI Insights"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-amber-400 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Recalculate</span>
          </button>
        </div>
      </div>

      {/* Top Intelligence Grid: Health Score & Burn Rate */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-5 my-6">
        {/* Financial Health Score (5 cols) */}
        <div className="lg:col-span-5 p-5 rounded-2xl bg-[#091226]/80 border border-[#17274f] flex flex-col justify-between">
          <div>
            <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Financial Health Score
            </span>
            <div className="flex items-baseline gap-3 mt-2">
              <span className="font-mono text-4xl sm:text-5xl font-black text-white tracking-tight tabular-nums">
                {healthScore.score}
              </span>
              <span className="font-mono text-xs text-slate-500 font-semibold">/100</span>

              <div
                className={`ml-auto px-3 py-1 rounded-xl font-mono text-xs font-extrabold border ${getScoreColor(
                  healthScore.score
                )}`}
              >
                Grade {healthScore.grade}
              </div>
            </div>

            <p className="font-serif text-base font-bold text-slate-200 mt-3">{healthScore.status}</p>
            <p className="text-xs text-slate-400 mt-1">{healthScore.summary}</p>
          </div>

          {/* Progress Indicator */}
          <div className="mt-4 pt-3 border-t border-[#17274f]/60">
            <div className="w-full h-2 rounded-full bg-[#132247] overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-amber-400 via-yellow-300 to-sky-300 transition-all duration-700"
                style={{ width: `${Math.min(100, healthScore.score)}%` }}
              />
            </div>
            <div className="flex justify-between items-center font-mono text-[10px] text-slate-500 mt-1 font-semibold">
              <span>0 (At Risk)</span>
              <span>70 (Target)</span>
              <span>100 (Optimal)</span>
            </div>
          </div>
        </div>

        {/* Burn Rate & Runway Metrics (7 cols) */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Daily Burn Rate */}
          <div className="p-4 rounded-2xl bg-[#091226]/80 border border-[#17274f] flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-1.5 text-slate-400 text-xs font-semibold mb-1">
                <Flame className="w-3.5 h-3.5 text-amber-400" />
                <span>Daily Burn Rate</span>
              </div>
              <p className="font-mono text-xl sm:text-2xl font-extrabold text-white mt-1 tabular-nums">
                {formatCurrency(burnRate.dailyAverage)}
              </p>
            </div>
            <span className="font-mono text-[11px] text-slate-500 mt-2 block">
              Avg outflow across {burnRate.daysElapsed} days
            </span>
          </div>

          {/* Projected Expense */}
          <div className="p-4 rounded-2xl bg-[#091226]/80 border border-[#17274f] flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-1.5 text-slate-400 text-xs font-semibold mb-1">
                <Calendar className="w-3.5 h-3.5 text-sky-400" />
                <span>Projected Month End</span>
              </div>
              <p className="font-mono text-xl sm:text-2xl font-extrabold text-sky-300 mt-1 tabular-nums">
                {formatCurrency(burnRate.projectedExpense)}
              </p>
            </div>
            <span className="font-mono text-[11px] text-slate-500 mt-2 block">
              Expected total for {selectedMonthYear}
            </span>
          </div>

          {/* Projected Month-End Surplus */}
          <div className="p-4 rounded-2xl bg-[#091226]/80 border border-[#17274f] flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-1.5 text-slate-400 text-xs font-semibold mb-1">
                <TrendingUp className="w-3.5 h-3.5 text-amber-400" />
                <span>Forecast Surplus</span>
              </div>
              <p
                className={`font-mono text-xl sm:text-2xl font-extrabold mt-1 tabular-nums ${
                  burnRate.projectedSurplus >= 0 ? 'text-amber-300' : 'text-rose-400'
                }`}
              >
                {burnRate.projectedSurplus >= 0 ? '+' : ''}
                {formatCurrency(burnRate.projectedSurplus)}
              </p>
            </div>
            <span className="font-mono text-[11px] text-slate-500 mt-2 block">
              {burnRate.daysRemaining} days remaining in cycle
            </span>
          </div>
        </div>
      </div>

      {/* Filter Tabs for Actionable Insights */}
      <div className="relative z-10 flex items-center justify-between gap-3 mb-3 pt-2">
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs pb-1">
          <button
            onClick={() => setSelectedFilter('ALL')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
              selectedFilter === 'ALL'
                ? 'bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-slate-200 bg-[#091226] border border-[#17274f]'
            }`}
          >
            All Insights ({items.length})
          </button>
          <button
            onClick={() => setSelectedFilter('ALERT')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
              selectedFilter === 'ALERT'
                ? 'bg-rose-500 text-white shadow-md shadow-rose-500/20'
                : 'text-slate-400 hover:text-slate-200 bg-[#091226] border border-[#17274f]'
            }`}
          >
            Alerts & Warnings
          </button>
          <button
            onClick={() => setSelectedFilter('TIP')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
              selectedFilter === 'TIP'
                ? 'bg-amber-300 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-slate-200 bg-[#091226] border border-[#17274f]'
            }`}
          >
            AI Opportunities
          </button>
          <button
            onClick={() => setSelectedFilter('POSITIVE')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
              selectedFilter === 'POSITIVE'
                ? 'bg-sky-400 text-slate-950 shadow-md shadow-sky-500/20'
                : 'text-slate-400 hover:text-slate-200 bg-[#091226] border border-[#17274f]'
            }`}
          >
            Wins
          </button>
        </div>
      </div>

      {/* Insights Cards Grid */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {filteredItems.length === 0 ? (
          <div className="col-span-full py-8 text-center text-xs text-slate-500 font-mono">
            No insights found under this filter.
          </div>
        ) : (
          filteredItems.map((insight) => (
            <div
              key={insight.id}
              className="p-4 rounded-2xl bg-[#091226]/85 border border-[#17274f] hover:border-amber-400/30 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    {getInsightIcon(insight.type)}
                    <h3 className="font-serif text-xs sm:text-sm font-bold text-white tracking-tight">
                      {insight.title}
                    </h3>
                  </div>

                  <span
                    className={`text-[10px] font-mono font-extrabold px-2 py-0.5 rounded-md border shrink-0 ${getInsightBadgeStyle(
                      insight.type
                    )}`}
                  >
                    {insight.type}
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed mt-1">
                  {insight.description}
                </p>
              </div>

              {insight.impact && (
                <div className="mt-3 pt-2.5 border-t border-[#17274f]/60 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-slate-400 font-medium">Estimated Impact:</span>
                  <span className="font-mono font-bold text-amber-300">{insight.impact}</span>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

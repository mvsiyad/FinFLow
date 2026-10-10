'use client';

import React, { useState, useEffect } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { formatCurrency } from '@/lib/utils';

const CATEGORY_COLORS = [
  '#f59e0b', // warm amber-gold
  '#38bdf8', // crisp sky blue
  '#fbbf24', // light golden yellow
  '#818cf8', // periwinkle
  '#f43f5e', // coral rose
  '#34d399', // soft mint
  '#c084fc', // amethyst
  '#fb923c', // warm tangerine
  '#2dd4bf', // teal
  '#cbd5e1', // platinum
];

interface CategoryDoughnutChartProps {
  data: Array<{
    category: string;
    amount: number;
    percentage: number;
  }>;
  title?: string;
  subtitle?: string;
}

export const CategoryDoughnutChart: React.FC<CategoryDoughnutChartProps> = ({
  data,
  title = 'Expense by Category',
  subtitle = 'Breakdown of current monthly expenditure',
}) => {
  const [isMounted, setIsMounted] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const totalExpense = data.reduce((acc, item) => acc + item.amount, 0);

  if (!isMounted) {
    return (
      <div className="h-72 flex items-center justify-center text-slate-500 text-xs font-mono">
        Loading chart visualization...
      </div>
    );
  }

  if (data.length === 0 || totalExpense === 0) {
    return (
      <div className="rounded-2xl border border-[#17274f] bg-[#0c1630]/75 p-6 backdrop-blur-md text-center">
        <h3 className="font-serif text-sm font-bold text-white tracking-tight">{title}</h3>
        <p className="text-xs text-slate-400 mt-1 mb-8">{subtitle}</p>
        <div className="h-48 flex flex-col items-center justify-center text-slate-500 text-xs font-mono">
          <span>No expense data recorded for this period</span>
        </div>
      </div>
    );
  }

  const chartData = data.map((item, index) => ({
    name: item.category,
    value: item.amount,
    percentage: item.percentage,
    color: CATEGORY_COLORS[index % CATEGORY_COLORS.length],
  }));

  const activeItem = activeIndex !== null ? chartData[activeIndex] : null;

  return (
    <div className="rounded-2xl border border-[#17274f] bg-[#0c1630]/75 p-5 sm:p-6 backdrop-blur-md shadow-lg shadow-black/20 flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-serif text-sm sm:text-base font-bold text-white tracking-tight">{title}</h3>
          <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>
        </div>
        <div className="text-right">
          <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-slate-400 block">
            Total Spend
          </span>
          <span className="font-mono text-sm font-extrabold text-white tabular-nums">
            {formatCurrency(totalExpense)}
          </span>
        </div>
      </div>

      <div className="relative h-64 sm:h-72 w-full flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const current = payload[0].payload;
                  return (
                    <div className="rounded-xl border border-[#1b2b52] bg-[#091226]/95 p-3 shadow-xl backdrop-blur-md">
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: current.color }}
                        />
                        <span className="text-xs font-semibold text-white">
                          {current.name}
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-4 text-xs font-mono">
                        <span className="text-slate-400">Amount:</span>
                        <span className="font-bold text-slate-100 tabular-nums">
                          {formatCurrency(current.value)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-4 text-xs mt-0.5 font-mono">
                        <span className="text-slate-400">Share:</span>
                        <span className="font-bold text-amber-300">
                          {current.percentage}%
                        </span>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={68}
              outerRadius={95}
              paddingAngle={3}
              onMouseEnter={(_, index) => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(null)}
              cursor="pointer"
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color}
                  stroke="#091226"
                  strokeWidth={2}
                  className="transition-all duration-200 hover:opacity-85"
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        {/* Center label inside doughnut */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            {activeItem ? activeItem.name : 'Expenses'}
          </span>
          <span className="font-mono text-lg font-extrabold text-white mt-0.5 tabular-nums">
            {activeItem
              ? `${activeItem.percentage}%`
              : formatCurrency(totalExpense)}
          </span>
          {activeItem && (
            <span className="font-mono text-[11px] text-slate-400 tabular-nums">
              {formatCurrency(activeItem.value)}
            </span>
          )}
        </div>
      </div>

      {/* Dynamic legend grid */}
      <div className="mt-4 pt-4 border-t border-[#17274f]/80 grid grid-cols-2 gap-2 max-h-36 overflow-y-auto pr-1">
        {chartData.map((item, index) => (
          <div
            key={item.name}
            onMouseEnter={() => setActiveIndex(index)}
            onMouseLeave={() => setActiveIndex(null)}
            className={`flex items-center justify-between p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
              activeIndex === index
                ? 'bg-[#122246] ring-1 ring-[#1b2f5f]'
                : 'hover:bg-[#122246]/40'
            }`}
          >
            <div className="flex items-center gap-2 truncate">
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-slate-300 font-medium truncate">{item.name}</span>
            </div>
            <span className="font-mono text-slate-400 font-semibold shrink-0 ml-2">
              {item.percentage}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

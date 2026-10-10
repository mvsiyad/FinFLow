'use client';

import React, { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { formatCurrency } from '@/lib/utils';
import { BarChart3 } from 'lucide-react';

interface CashFlowBarChartProps {
  data: Array<{
    category: string;
    amount: number;
    percentage: number;
  }>;
  title?: string;
  subtitle?: string;
}

export const CashFlowBarChart: React.FC<CashFlowBarChartProps> = ({
  data,
  title = 'Category Expenditure Comparison',
  subtitle = 'Distribution across expense categories',
}) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="h-72 flex items-center justify-center text-slate-500 text-xs">
        Loading chart visualization...
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="rounded-2xl border border-[#17274f] bg-[#0c1630]/75 p-6 backdrop-blur-md text-center">
        <h3 className="font-serif text-sm font-bold text-white tracking-tight">{title}</h3>
        <p className="text-xs text-slate-400 mt-1 mb-8">{subtitle}</p>
        <div className="h-48 flex flex-col items-center justify-center text-slate-500 text-xs font-mono">
          <span>No expenditure data available</span>
        </div>
      </div>
    );
  }

  const chartData = data.slice(0, 6).map((item) => ({
    name: item.category.length > 14 ? `${item.category.slice(0, 12)}...` : item.category,
    fullName: item.category,
    amount: item.amount,
    percentage: item.percentage,
  }));

  return (
    <div className="rounded-2xl border border-[#17274f] bg-[#0c1630]/75 p-5 sm:p-6 backdrop-blur-md shadow-lg shadow-black/20 flex flex-col">
      <div className="flex items-center gap-2 mb-1">
        <div className="p-1.5 rounded-lg bg-[#132247] text-amber-400 border border-[#1b2f5f]">
          <BarChart3 className="w-4 h-4" />
        </div>
        <h3 className="font-serif text-sm sm:text-base font-bold text-white tracking-tight">
          {title}
        </h3>
      </div>
      <p className="text-xs text-slate-400 mb-6">{subtitle}</p>

      <div className="h-64 sm:h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 10, right: 10, left: -20, bottom: 20 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#1b2b52"
              opacity={0.5}
              vertical={false}
            />
            <XAxis
              dataKey="name"
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: '#1b2b52' }}
              interval={0}
              angle={-20}
              textAnchor="end"
            />
            <YAxis
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              tickFormatter={(val) => `$${val}`}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const item = payload[0].payload;
                  return (
                    <div className="rounded-xl border border-[#1b2b52] bg-[#091226]/95 p-3 shadow-xl backdrop-blur-md">
                      <p className="font-serif text-xs font-semibold text-slate-200 mb-1">
                        {item.fullName}
                      </p>
                      <div className="flex items-center justify-between gap-4 text-xs font-mono">
                        <span className="text-slate-400">Total Spent:</span>
                        <span className="font-bold text-amber-300 tabular-nums">
                          {formatCurrency(item.amount)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-4 text-xs mt-0.5 font-mono">
                        <span className="text-slate-400">Proportion:</span>
                        <span className="font-bold text-slate-200">
                          {item.percentage}%
                        </span>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar
              dataKey="amount"
              fill="#eab308"
              radius={[6, 6, 0, 0]}
              className="hover:opacity-85 transition-opacity"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

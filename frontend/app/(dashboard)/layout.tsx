'use client';

import React, { useState, useEffect } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Navbar } from '@/components/Navbar';
import { AddTransactionModal } from '@/components/AddTransactionModal';
import { AddBudgetModal } from '@/components/AddBudgetModal';
import { AddGoalModal } from '@/components/AddGoalModal';
import { DepositModal } from '@/components/DepositModal';
import { useFinFlowStore } from '@/lib/store';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { initApp } = useFinFlowStore();

  useEffect(() => {
    initApp();
  }, [initApp]);

  return (
    <div className="flex min-h-screen bg-[#070e20] text-slate-100 relative">
      {/* Subtle ambient lighting */}
      <div className="fixed top-0 left-1/4 w-[600px] h-[350px] bg-amber-400/[0.03] blur-[120px] pointer-events-none rounded-full" />
      <div className="fixed bottom-0 right-10 w-[500px] h-[350px] bg-sky-500/[0.03] blur-[120px] pointer-events-none rounded-full" />

      {/* Sidebar Navigation */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 relative z-10">
        <Navbar onMenuClick={() => setSidebarOpen(true)} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          {children}
        </main>
      </div>

      {/* Interactive Modals */}
      <AddTransactionModal />
      <AddBudgetModal />
      <AddGoalModal />
      <DepositModal />
    </div>
  );
}

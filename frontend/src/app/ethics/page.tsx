"use client";

import React, { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import {
  EthicsScoreCard,
  ConflictScanner,
  TimingDetector,
  BehaviorTracker,
  DelayChecker,
} from "../../components/EthicsComponents";

export default function EthicsPage() {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-[#050505] text-zinc-900 dark:text-zinc-200 font-sans transition-colors duration-300">
      {/* Background Accents (Red/Amber for Ethics theme) */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-rose-600/5 dark:bg-rose-600/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-amber-600/5 dark:bg-amber-600/10 blur-[120px] rounded-full pointer-events-none" />

      <main className="p-6 lg:p-12 relative">
        {/* Header */}
        <header className="mb-12">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white mb-2">
            Ethics Monitor
          </h1>
          <p className="text-zinc-500 text-sm font-medium uppercase tracking-[0.2em]">
            Real-time Conflict & Compliance Analysis
          </p>
        </header>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Row 1: Score & Behavior */}
          <div className="col-span-1 md:col-span-4">
            <EthicsScoreCard score={85} riskLevel="HIGH" />
          </div>
          <div className="col-span-1 md:col-span-8">
            <BehaviorTracker />
          </div>

          {/* Row 2: Deep Dives */}
          <div className="col-span-1 md:col-span-6">
            <ConflictScanner />
          </div>
          <div className="col-span-1 md:col-span-6">
            <TimingDetector />
          </div>

          {/* Row 3: Compliance Data */}
          <div className="col-span-1 md:col-span-12">
            <DelayChecker />
          </div>
        </div>
        
        <footer className="mt-20 py-12 border-t border-zinc-200 dark:border-zinc-900 flex flex-col items-center gap-4 text-zinc-500 text-xs tracking-widest uppercase">
          Nexus Protocol © 2026 • Encrypted Data Stream
        </footer>
      </main>
    </div>
  );
}

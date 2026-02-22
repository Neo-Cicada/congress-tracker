"use client";

import React, { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import {
  EthicsScoreCard,
  ConflictScanner,
  TimingDetector,
  BehaviorTracker,
  DelayChecker,
  ComplianceRecord,
  Conflict,
  SuspiciousTrade,
  BehaviorStats
} from "../../components/EthicsComponents";

interface EthicsData {
    score: number;
    riskLevel: "LOW" | "MEDIUM" | "HIGH";
    complianceRecords: ComplianceRecord[];
    conflicts: Conflict[];
    suspiciousTrades: SuspiciousTrade[];
    violationCount: number;
    lateCount: number;
    totalTrades: number;
    behavior?: BehaviorStats;
}

export default function EthicsPage() {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [data, setData] = useState<EthicsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
    fetch('/api/ethics/summary', { cache: 'no-store' })
        .then(res => res.json())
        .then(data => {
            setData(data);
            setLoading(false);
        })
        .catch(err => {
            console.error('Failed to fetch ethics data:', err);
            setLoading(false);
        });
  }, []);

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
            {loading ? (
                 <div className="h-4 w-48 bg-zinc-200 dark:bg-zinc-800 animate-pulse rounded" />
            ) : (
                <p className="text-zinc-500 text-sm font-medium uppercase tracking-[0.2em] flex items-center gap-2">
                    Real-time Analysis • <span className="text-zinc-900 dark:text-white">{data?.totalTrades || 0} Trades Scanned</span>
                </p>
            )}
        </header>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Row 1: Score & Behavior */}
          <div className="col-span-1 md:col-span-4">
             {loading ? (
                <div className="h-64 rounded-[2.5rem] bg-zinc-100 dark:bg-zinc-900 animate-pulse" />
             ) : (
                <EthicsScoreCard score={data?.score || 100} riskLevel={data?.riskLevel || 'LOW'} />
             )}
          </div>
          <div className="col-span-1 md:col-span-8">
            <BehaviorTracker stats={data?.behavior} />
          </div>

          {/* Row 2: Deep Dives */}
          <div className="col-span-1 md:col-span-6">
             {loading ? (
                <div className="h-[400px] rounded-3xl bg-zinc-100 dark:bg-zinc-900 animate-pulse" />
             ) : (
                <ConflictScanner conflicts={data?.conflicts || []} />
             )}
          </div>
          <div className="col-span-1 md:col-span-6">
             {loading ? (
                <div className="h-[400px] rounded-3xl bg-zinc-100 dark:bg-zinc-900 animate-pulse" />
             ) : (
                <TimingDetector trades={data?.suspiciousTrades || []} />
             )}
          </div>

          {/* Row 3: Compliance Data */}
          <div className="col-span-1 md:col-span-12">
             {loading ? (
                <div className="h-64 rounded-3xl bg-zinc-100 dark:bg-zinc-900 animate-pulse" />
             ) : (
                <DelayChecker records={data?.complianceRecords || []} />
             )}
          </div>
        </div>
        
        <footer className="mt-20 py-12 border-t border-zinc-200 dark:border-zinc-900 flex flex-col items-center gap-4 text-zinc-500 text-xs tracking-widest uppercase">
          Nexus Protocol © 2026 • Encrypted Data Stream
        </footer>
      </main>
    </div>
  );
}

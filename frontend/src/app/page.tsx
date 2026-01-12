"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useTheme } from "next-themes";
import { TradeCard, Trade } from "../components/TradeCard";
import { Leaderboard } from "../components/Leaderboard";
import { Sidebar } from "../components/Sidebar";
import {
  TrendingUp,
  Activity,
  ShieldCheck,
  Search,
  LayoutGrid,
  List,
  Sun,
  Moon,
} from "lucide-react";

const TRADES: Trade[] = [
  {
    id: "1",
    name: "Nancy Pelosi",
    party: "D",
    ticker: "NVDA",
    type: "Buy",
    amount: "$1M+",
    date: "2h ago",
    reliability: 98,
  },
  {
    id: "2",
    name: "Tommy Tuberville",
    party: "R",
    ticker: "XOM",
    type: "Sell",
    amount: "$50K",
    date: "5h ago",
    reliability: 85,
  },
  {
    id: "3",
    name: "Josh Gottheimer",
    party: "D",
    ticker: "MSFT",
    type: "Buy",
    amount: "$250K",
    date: "1d ago",
    reliability: 92,
  },
  {
    id: "4",
    name: "Michael McCaul",
    party: "R",
    ticker: "META",
    type: "Buy",
    amount: "$500K",
    date: "1d ago",
    reliability: 95,
  },
  {
    id: "5",
    name: "Ro Khanna",
    party: "D",
    ticker: "AAPL",
    type: "Sell",
    amount: "$15K",
    date: "2d ago",
    reliability: 88,
  },
  {
    id: "6",
    name: "Mark Green",
    party: "R",
    ticker: "NRT",
    type: "Buy",
    amount: "$250K",
    date: "2d ago",
    reliability: 99,
  },
];

export default function NexusDashboard() {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");

  // --- LOGIC: FILTERING ---
  const filteredTrades = useMemo(() => {
    return TRADES.filter((trade) => {
      const searchLower = searchQuery.toLowerCase();
      return (
        trade.name.toLowerCase().includes(searchLower) ||
        trade.ticker.toLowerCase().includes(searchLower) ||
        trade.party.toLowerCase().includes(searchLower)
      );
    });
  }, [searchQuery]);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const toggleTheme = () =>
    setTheme(resolvedTheme === "dark" ? "light" : "dark");

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-[#050505] text-zinc-900 dark:text-zinc-200 font-sans transition-colors duration-300">
      {/* Background Accents */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-cyan-600/5 dark:bg-cyan-600/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-purple-600/5 dark:bg-purple-600/10 blur-[120px] rounded-full pointer-events-none" />

      {/* Sidebar */}
      <Sidebar
        toggleTheme={() =>
          setTheme(resolvedTheme === "dark" ? "light" : "dark")
        }
        resolvedTheme={resolvedTheme}
      />

      <main className="lg:ml-20 p-6 lg:p-12 relative">
        {/* Sticky Header */}
        <header className="sticky top-0 z-40 bg-zinc-50/80 dark:bg-[#050505]/80 backdrop-blur-md pb-6 flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white mb-2">
              Nexus Alpha
            </h1>
            <p className="text-zinc-500 text-sm font-medium uppercase tracking-[0.2em]">
              Institutional Transparency Protocol
            </p>
          </div>

          {/* <div className="flex items-center gap-3 bg-white dark:bg-zinc-900/50 p-1 rounded-2xl border border-zinc-200 dark:border-zinc-800/50 backdrop-blur-sm shadow-sm dark:shadow-none">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-xl ${
                viewMode === "grid"
                  ? "bg-zinc-100 dark:bg-zinc-800 text-cyan-500"
                  : "text-zinc-400"
              }`}
            >
              <LayoutGrid size={20} />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-xl ${
                viewMode === "list"
                  ? "bg-zinc-100 dark:bg-zinc-800 text-cyan-500"
                  : "text-zinc-400"
              }`}
            >
              <List size={20} />
            </button>
          </div> */}
        </header>

        {/* Search Bar - Linked to State */}
        <div className="relative max-w-2xl mb-12 group">
          <Search
            className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-500 group-focus-within:text-cyan-500 transition-colors"
            size={20}
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search politicians, tickers, or parties..."
            className="w-full bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800/50 py-4 pl-14 pr-6 rounded-2xl outline-none focus:border-cyan-500/50 focus:ring-4 ring-cyan-500/5 transition-all text-lg placeholder:text-zinc-400 dark:placeholder:text-zinc-600 shadow-sm dark:shadow-none"
          />
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-12 gap-8">
          {/* Section 1: Whale Leaderboard (Spans 4 columns) */}
          <div className="col-span-12 lg:col-span-4">
            <Leaderboard />
          </div>

          {/* Section 2: Trade Feed (Spans 8 columns) */}
          <div className="col-span-12 lg:col-span-8">
            <div
              className={`grid gap-6 ${
                viewMode === "grid"
                  ? "grid-cols-1 md:grid-cols-2"
                  : "grid-cols-1"
              }`}
            >
              {filteredTrades.map((trade) => (
                <TradeCard key={trade.id} trade={trade} />
              ))}
              {filteredTrades.length === 0 && (
                <div className="col-span-full py-20 text-center text-zinc-500 italic border border-dashed border-zinc-800 rounded-[2rem]">
                  No protocol matches found for "{searchQuery}"
                </div>
              )}
            </div>
          </div>
        </div>

        <footer className="mt-20 py-12 border-t border-zinc-200 dark:border-zinc-900 flex flex-col items-center gap-4 text-zinc-500 text-xs tracking-widest uppercase">
          Nexus Protocol © 2026 • Encrypted Data Stream
        </footer>
      </main>
    </div>
  );
}

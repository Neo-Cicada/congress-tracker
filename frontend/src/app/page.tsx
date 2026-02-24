"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useTheme } from "next-themes";
import { TradeCard, Trade } from "../components/TradeCard";
import { Leaderboard } from "../components/Leaderboard";
import { fetchWithCache } from "../lib/apiCache";
import {
  TrendingUp,
  Activity,
  ShieldCheck,
  Search,
  LayoutGrid,
  List,
  Sun,
  Moon,
  Loader2,
} from "lucide-react";

export default function NexusDashboard() {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const LIMIT = 50;
  
  useEffect(() => setMounted(true), []);

  // --- LOGIC: DEBOUNCE SEARCH ---
  useEffect(() => {
    setLoading(true);
    const delayDebounceFn = setTimeout(() => {
      setOffset(0); // Reset pagination on search
      fetchTrades(0, true);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const fetchTrades = async (currentOffset = 0, isInitial = false) => {
    try {
      if (currentOffset === 0) setLoading(true);
      
      const queryParams = new URLSearchParams({
        limit: LIMIT.toString(),
        skip: currentOffset.toString(),
        ...(searchQuery && { search: searchQuery })
      });

      const url = `http://localhost:4000/api/trades?${queryParams}`;
      
      const data = await (currentOffset === 0 
        ? fetchWithCache(url) 
        : fetch(url).then(res => res.json()));
      
      const formattedTrades = data.trades.map((trade: any) => ({
        id: trade.externalId || trade._id,
        politicianId: trade.politicianId,
        name: trade.politicianName,
        party: trade.party,
        ticker: trade.ticker,
        type: trade.transactionType,
        amount: trade.amountRange,
        date: new Date(trade.transactionDate || trade.filedDate || Date.now()).toLocaleDateString(),
        reliability: 90,
      }));

      // If we got fewer items than limit, no more data
      if (formattedTrades.length < LIMIT) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }

      setTrades(prev => isInitial ? formattedTrades : [...prev, ...formattedTrades]);
      setOffset(currentOffset + LIMIT);
    } catch (err) {
      console.error("Error fetching trades:", err);
      setError("Failed to load live trade data.");
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = () => {
    fetchTrades(offset);
  };
  
  // No more client-side filtering needed
  const filteredTrades = trades;

  if (!mounted) return null;

  const toggleTheme = () =>
    setTheme(resolvedTheme === "dark" ? "light" : "dark");

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-[#050505] text-zinc-900 dark:text-zinc-200 font-sans transition-colors duration-300">
      {/* Background Accents */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-cyan-600/5 dark:bg-cyan-600/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-purple-600/5 dark:bg-purple-600/10 blur-[120px] rounded-full pointer-events-none" />

      <main className="p-6 lg:p-12 relative">
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
              {loading ? (
                 <div className="col-span-full py-20 flex flex-col items-center justify-center text-zinc-500">
                    <Loader2 className="w-8 h-8 animate-spin mb-4 text-cyan-500" />
                    <p>Syncing encrypted trade data...</p>
                 </div>
              ) : error ? (
                <div className="col-span-full py-20 text-center text-red-500 border border-dashed border-red-800/20 rounded-[2rem] bg-red-500/5">
                  {error}
                </div>
              ) : (
                <>
                  {filteredTrades.map((trade) => (
                    <TradeCard key={trade.id} trade={trade} />
                  ))}
                  {filteredTrades.length === 0 && (
                    <div className="col-span-full py-20 text-center text-zinc-500 italic border border-dashed border-zinc-800 rounded-[2rem]">
                      No protocol matches found for "{searchQuery}"
                    </div>
                  )}
                </>
              )}
            </div>
            
            {/* Load More Button */}
            {!loading && hasMore && trades.length > 0 && !error && (
               <div className="mt-12 flex justify-center">
                  <button 
                    onClick={handleLoadMore}
                    className="group relative px-8 py-3 bg-zinc-900 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-900 font-bold uppercase text-xs tracking-widest rounded-xl hover:scale-105 active:scale-95 transition-all shadow-xl hover:shadow-cyan-500/20"
                  >
                    Load More Data
                    <div className="absolute inset-0 rounded-xl ring-2 ring-white/20 dark:ring-black/10 group-hover:ring-cyan-500/50 transition-all" />
                  </button>
               </div>
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

"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { useTheme } from "next-themes";
import { TradeCard, Trade } from "../../../components/TradeCard";
import { Leaderboard } from "../../../components/Leaderboard";
import { fetchWithCache } from "../../../lib/apiCache";
import { getApiUrl } from "../../../lib/api";
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
  ArrowUpDown,
  Filter,
} from "lucide-react";

type SortOption = "newest" | "oldest" | "amount_high" | "amount_low";
type TypeFilter = "all" | "Buy" | "Sell";
type PartyFilter = "all" | "D" | "R";

// Helper to parse amount ranges like "$1,001 - $15,000" into a sortable number
const parseAmount = (amount: string): number => {
  if (!amount) return 0;
  const match = amount.replace(/,/g, '').match(/\d+/g);
  if (!match) return 0;
  return parseInt(match[match.length - 1]) || 0;
};

export default function NexusDashboard() {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const LIMIT = 50;
  const [loadingMore, setLoadingMore] = useState(false);
  const offsetRef = useRef(0);

  // Sort & Filter state
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");
  const [partyFilter, setPartyFilter] = useState<PartyFilter>("all");
  
  useEffect(() => setMounted(true), []);

  // --- LOGIC: DEBOUNCE SEARCH ---
  useEffect(() => {
    setLoading(true);
    const delayDebounceFn = setTimeout(() => {
      offsetRef.current = 0;
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

      const url = getApiUrl(`trades?${queryParams}`);
      
      const data = await (currentOffset === 0 
        ? fetchWithCache(url) 
        : fetch(url).then(res => res.json()));
      
      const formattedTrades = data.trades.map((trade: any) => ({
        id: trade._id,
        politicianId: trade.politicianId,
        name: trade.politicianName,
        party: trade.party,
        ticker: trade.ticker,
        type: trade.transactionType,
        amount: trade.amountRange,
        date: new Date(trade.transactionDate || trade.filedDate || Date.now()).toLocaleDateString(),
        rawDate: trade.transactionDate || trade.filedDate || new Date().toISOString(),
        reliability: 90,
      }));

      // If we got fewer items than limit, no more data
      if (formattedTrades.length < LIMIT) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }

      setTrades(prev => {
        const combined = isInitial ? formattedTrades : [...prev, ...formattedTrades];
        const uniqueTrades: any[] = [];
        const seen = new Set<string>();
        
        for (const t of combined) {
          const sig = `${t.name}|${t.ticker}|${t.type}|${t.date}|${t.amount}`;
          if (!seen.has(sig)) {
            seen.add(sig);
            uniqueTrades.push(t);
          }
        }
        return uniqueTrades;
      });
      
      offsetRef.current = currentOffset + LIMIT;
    } catch (err) {
      console.error("Error fetching trades:", err);
      setError("Failed to load live trade data.");
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = async () => {
    setLoadingMore(true);
    await fetchTrades(offsetRef.current);
    setLoadingMore(false);
  };
  
  // Client-side sort + filter
  const filteredTrades = useMemo(() => {
    let result = [...trades];

    // Filter by type
    if (typeFilter !== "all") {
      result = result.filter(t => t.type === typeFilter);
    }

    // Filter by party
    if (partyFilter !== "all") {
      result = result.filter(t => t.party === partyFilter);
    }

    // Sort
    result.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date((b as any).rawDate).getTime() - new Date((a as any).rawDate).getTime();
        case "oldest":
          return new Date((a as any).rawDate).getTime() - new Date((b as any).rawDate).getTime();
        case "amount_high":
          return parseAmount(b.amount) - parseAmount(a.amount);
        case "amount_low":
          return parseAmount(a.amount) - parseAmount(b.amount);
        default:
          return 0;
      }
    });

    return result;
  }, [trades, sortBy, typeFilter, partyFilter]);

  if (!mounted) return null;

  const toggleTheme = () =>
    setTheme(resolvedTheme === "dark" ? "light" : "dark");

  const activeCount = (typeFilter !== "all" ? 1 : 0) + (partyFilter !== "all" ? 1 : 0);

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

        {/* Search Bar */}
        <div className="relative max-w-2xl mb-6 group">
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

        {/* Sort & Filter Bar */}
        <div className="flex flex-wrap items-center gap-2 mb-10 max-w-2xl">
          {/* Sort */}
          <div className="flex items-center gap-1.5 bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800/50 rounded-xl px-3 py-2">
            <ArrowUpDown size={14} className="text-zinc-400 shrink-0" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="bg-transparent text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 outline-none cursor-pointer appearance-none pr-4"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="amount_high">Highest Amount</option>
              <option value="amount_low">Lowest Amount</option>
            </select>
          </div>

          {/* Type Filter */}
          <div className="flex rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800/50">
            {(["all", "Buy", "Sell"] as TypeFilter[]).map((type) => (
              <button
                key={type}
                onClick={() => setTypeFilter(type)}
                className={`px-3 py-2 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                  typeFilter === type
                    ? type === "Buy"
                      ? "bg-emerald-500 text-white"
                      : type === "Sell"
                      ? "bg-rose-500 text-white"
                      : "bg-cyan-500 text-white"
                    : "bg-white dark:bg-zinc-900/40 text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
                }`}
              >
                {type === "all" ? "All" : type}
              </button>
            ))}
          </div>

          {/* Party Filter */}
          <div className="flex rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800/50">
            {([
              { value: "all", label: "All" },
              { value: "D", label: "Dem" },
              { value: "R", label: "Rep" },
            ] as { value: PartyFilter; label: string }[]).map(({ value, label }) => (
              <button
                key={value}
                onClick={() => setPartyFilter(value)}
                className={`px-3 py-2 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                  partyFilter === value
                    ? value === "D"
                      ? "bg-blue-500 text-white"
                      : value === "R"
                      ? "bg-red-500 text-white"
                      : "bg-cyan-500 text-white"
                    : "bg-white dark:bg-zinc-900/40 text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Active filter count */}
          {activeCount > 0 && (
            <button
              onClick={() => { setTypeFilter("all"); setPartyFilter("all"); setSortBy("newest"); }}
              className="px-3 py-2 text-xs font-bold text-zinc-500 hover:text-red-500 transition-colors cursor-pointer"
            >
              Clear ({activeCount})
            </button>
          )}

          {/* Results count */}
          <span className="ml-auto text-[10px] font-mono text-zinc-400 uppercase tracking-widest">
            {filteredTrades.length} trades
          </span>
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
                      {trades.length > 0 ? "No trades match your filters" : `No protocol matches found for "${searchQuery}"`}
                    </div>
                  )}
                </>
              )}
            </div>
            
            {/* Load More Button */}
            {!loading && hasMore && trades.length > 0 && !error && (
               <div className="mt-12 flex flex-col items-center gap-2">
                  <button 
                    onClick={handleLoadMore}
                    disabled={loadingMore}
                    className="group relative px-8 py-3 bg-zinc-900 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-900 font-bold uppercase text-xs tracking-widest rounded-xl hover:scale-105 active:scale-95 transition-all shadow-xl hover:shadow-cyan-500/20 disabled:opacity-50 disabled:hover:scale-100 flex items-center gap-2"
                  >
                    {loadingMore ? (
                      <><Loader2 size={14} className="animate-spin" /> Loading...</>
                    ) : (
                      "Load More Data"
                    )}
                    <div className="absolute inset-0 rounded-xl ring-2 ring-white/20 dark:ring-black/10 group-hover:ring-cyan-500/50 transition-all pointer-events-none" />
                  </button>
                  {(typeFilter !== "all" || partyFilter !== "all") && (
                    <p className="text-[10px] text-zinc-400 italic">Some loaded trades may be hidden by your active filters</p>
                  )}
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


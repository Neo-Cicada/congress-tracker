'use client';

import React, { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { 
  TrendingUp, 
  Activity, 
  ShieldCheck, 
  ArrowUpRight, 
  ArrowDownRight, 
  Search,
  LayoutGrid,
  List,
  ChevronRight,
  Sun,
  Moon
} from 'lucide-react';

const TRADES = [
  { id: '1', name: 'Nancy Pelosi', party: 'D', ticker: 'NVDA', type: 'Buy', amount: '$1M+', date: '2h ago', reliability: 98 },
  { id: '2', name: 'Tommy Tuberville', party: 'R', ticker: 'XOM', type: 'Sell', amount: '$50K', date: '5h ago', reliability: 85 },
  { id: '3', name: 'Josh Gottheimer', party: 'D', ticker: 'MSFT', type: 'Buy', amount: '$250K', date: '1d ago', reliability: 92 },
];

export default function NexusDashboard() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Prevent hydration mismatch
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const toggleTheme = () => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-[#050505] text-zinc-900 dark:text-zinc-200 font-sans transition-colors duration-300">
      {/* --- BLURRY BACKGROUND ACCENTS --- */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-cyan-600/5 dark:bg-cyan-600/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-purple-600/5 dark:bg-purple-600/10 blur-[120px] rounded-full pointer-events-none" />

      {/* --- SIDEBAR NAV --- */}
      <aside className="fixed left-0 top-0 h-full w-20 border-r border-zinc-200 dark:border-zinc-800 bg-white/40 dark:bg-black/40 backdrop-blur-md hidden lg:flex flex-col items-center py-8 gap-10 z-50">
        <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/20">
          <TrendingUp size={24} className="text-white" />
        </div>
        <nav className="flex flex-col gap-8 text-zinc-500">
          <Activity className="hover:text-cyan-500 cursor-pointer transition-colors" />
          <ShieldCheck className="hover:text-cyan-500 cursor-pointer transition-colors" />
          
          {/* Theme Toggle */}
          <button 
            onClick={toggleTheme}
            className="p-2 rounded-xl hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-all text-zinc-600 dark:text-zinc-400"
          >
            {resolvedTheme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </nav>
      </aside>

      <main className="lg:ml-20 p-6 lg:p-12 relative">
        {/* --- TOP HEADER --- */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white mb-2">Nexus Alpha</h1>
            <p className="text-zinc-500 text-sm font-medium uppercase tracking-[0.2em]">Institutional Transparency Protocol</p>
          </div>
          
          <div className="flex items-center gap-3 bg-white dark:bg-zinc-900/50 p-1 rounded-2xl border border-zinc-200 dark:border-zinc-800/50 backdrop-blur-sm shadow-sm dark:shadow-none">
            <button 
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-zinc-100 dark:bg-zinc-800 text-cyan-500 shadow-inner' : 'text-zinc-400'}`}
            >
              <LayoutGrid size={20} />
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-xl transition-all ${viewMode === 'list' ? 'bg-zinc-100 dark:bg-zinc-800 text-cyan-500 shadow-inner' : 'text-zinc-400'}`}
            >
              <List size={20} />
            </button>
          </div>
        </header>

        {/* --- SEARCH BAR --- */}
        <div className="relative max-w-2xl mb-12 group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-500 group-focus-within:text-cyan-500 transition-colors" size={20} />
          <input 
            type="text" 
            placeholder="Search politicians, tickers, or parties..."
            className="w-full bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800/50 py-4 pl-14 pr-6 rounded-2xl outline-none focus:border-cyan-500/50 focus:ring-4 ring-cyan-500/5 transition-all text-lg placeholder:text-zinc-400 dark:placeholder:text-zinc-600 shadow-sm dark:shadow-none"
          />
        </div>

        {/* --- MAIN CONTENT BENTO --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {TRADES.map((trade) => (
            <div 
              key={trade.id} 
              className="group bg-white dark:bg-zinc-900/20 border border-zinc-200 dark:border-zinc-800/50 hover:border-cyan-500/30 rounded-[2rem] p-6 backdrop-blur-xl transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-cyan-500/5"
            >
              <div className="flex justify-between items-start mb-8">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg ${trade.party === 'D' ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400' : 'bg-red-500/10 text-red-600 dark:text-red-400'}`}>
                    {trade.party}
                  </div>
                  <div>
                    <h3 className="font-bold text-zinc-800 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-300 transition-colors">{trade.name}</h3>
                    <p className="text-xs text-zinc-400 dark:text-zinc-500 font-mono tracking-tighter uppercase">{trade.date}</p>
                  </div>
                </div>
                <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${trade.type === 'Buy' ? 'border-emerald-500/20 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400' : 'border-rose-500/20 bg-rose-500/5 text-rose-600 dark:text-rose-400'}`}>
                  {trade.type}
                </div>
              </div>

              <div className="flex items-end justify-between">
                <div>
                  <p className="text-[10px] text-zinc-400 dark:text-zinc-500 uppercase font-bold tracking-widest mb-1">Asset Class</p>
                  <div className="flex items-center gap-2">
                    <span className="text-3xl font-black text-zinc-900 dark:text-white tracking-tighter italic">{trade.ticker}</span>
                    {trade.type === 'Buy' ? <ArrowUpRight className="text-emerald-500" /> : <ArrowDownRight className="text-rose-500" />}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-zinc-400 dark:text-zinc-500 uppercase font-bold tracking-widest mb-1">Estimated Value</p>
                  <span className="text-xl font-mono font-bold text-zinc-700 dark:text-zinc-100">{trade.amount}</span>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-zinc-100 dark:border-zinc-800/50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
                  <span className="text-[10px] text-zinc-400 font-bold uppercase">Reliability Score: {trade.reliability}%</span>
                </div>
                <button className="flex items-center gap-1 text-[10px] font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-widest hover:gap-2 transition-all">
                  Deep Dive <ChevronRight size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* --- FOOTER CTA --- */}
        <footer className="mt-20 py-12 border-t border-zinc-200 dark:border-zinc-900 flex flex-col items-center gap-4">
          <p className="text-zinc-500 text-xs tracking-widest uppercase text-center font-medium">Nexus Protocol © 2026 • Encrypted Data Stream</p>
        </footer>
      </main>
    </div>
  );
}
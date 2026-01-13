"use client";

import React from "react";
import { TrendingUp, TrendingDown, Users } from "lucide-react";

// --- PARTY PERFORMANCE CHART ---
export const PartyPerformanceChart = () => {
  return (
    <div className="bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 h-full">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-lg font-bold text-zinc-900 dark:text-white flex items-center gap-2">
          <Users size={20} className="text-zinc-400" />
          Party Alpha
        </h3>
        <span className="text-[10px] uppercase font-bold tracking-widest bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded text-zinc-500">
            YTD Returns
        </span>
      </div>

      <div className="flex gap-4 h-48 items-end justify-center">
        {/* DEMOCRAT BAR */}
        <div className="w-1/3 flex flex-col items-center group">
            <span className="mb-2 font-bold text-blue-500 animate-pulse">+24.5%</span>
            <div className="w-full bg-blue-500/20 rounded-t-2xl relative overflow-hidden h-32 group-hover:h-36 transition-all duration-500">
                <div className="absolute bottom-0 left-0 right-0 h-[70%] bg-blue-500 skew-y-6 transform origin-bottom-left group-hover:bg-blue-400 transition-colors" />
            </div>
            <span className="mt-3 font-bold text-zinc-900 dark:text-white">DEM</span>
        </div>

        {/* REPUBLICAN BAR */}
        <div className="w-1/3 flex flex-col items-center group">
            <span className="mb-2 font-bold text-red-500 animate-pulse">+18.2%</span>
            <div className="w-full bg-red-500/20 rounded-t-2xl relative overflow-hidden h-24 group-hover:h-28 transition-all duration-500">
                <div className="absolute bottom-0 left-0 right-0 h-[60%] bg-red-500 -skew-y-6 transform origin-bottom-right group-hover:bg-red-400 transition-colors" />
            </div>
            <span className="mt-3 font-bold text-zinc-900 dark:text-white">REP</span>
        </div>
      </div>
      
      <p className="mt-6 text-center text-xs text-zinc-500 max-w-[200px] mx-auto italic">
        Democrats are currently outperforming the S&P 500 by <span className="text-emerald-500 font-bold">12%</span> on average.
      </p>
    </div>
  );
};

// --- POPULAR STOCKS LIST ---
const POPULAR_STOCKS = [
    { ticker: "NVDA", name: "NVIDIA Corp", count: 42, sentiment: "Bullish", change: "+12%" },
    { ticker: "MSFT", name: "Microsoft", count: 35, sentiment: "Bullish", change: "+8%" },
    { ticker: "XOM", name: "Exxon Mobil", count: 28, sentiment: "Bearish", change: "-3%" },
    { ticker: "LMT", name: "Lockheed Martin", count: 19, sentiment: "Bullish", change: "+15%" },
];

export const PopularStocksList = () => {
    return (
        <div className="bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 h-full">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-zinc-900 dark:text-white">Crowded Trades</h3>
                <span className="text-xs text-zinc-500">Last 30 Days</span>
            </div>

            <div className="space-y-4">
                {POPULAR_STOCKS.map((stock) => (
                    <div key={stock.ticker} className="flex items-center justify-between p-3 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 rounded-xl transition-colors cursor-pointer group">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center font-bold text-xs text-zinc-700 dark:text-zinc-300 group-hover:bg-cyan-500/10 group-hover:text-cyan-500 transition-colors">
                                {stock.ticker}
                            </div>
                            <div>
                                <div className="font-bold text-sm text-zinc-900 dark:text-zinc-100">{stock.name}</div>
                                <div className="text-[10px] text-zinc-500 uppercase tracking-wider">{stock.count} Members Trading</div>
                            </div>
                        </div>
                        <div className={`text-sm font-bold ${stock.change.startsWith('+') ? 'text-emerald-500' : 'text-rose-500'} flex items-center gap-1`}>
                            {stock.change.startsWith('+') ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                            {stock.change}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

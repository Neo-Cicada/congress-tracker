"use client";

import React, { useState, useEffect } from "react";
import { ProfileHeader, Watchlist, CopyTradeControls } from "../../components/ProfileComponents";
import { TradeCard, Trade } from "../../components/TradeCard";
import { Activity } from "lucide-react";

// Mock saved trades
const SAVED_TRADES: Trade[] = [
    {
      id: "s1",
      name: "Nancy Pelosi",
      party: "D",
      ticker: "PANW",
      type: "Buy",
      amount: "$1M+",
      date: "Feb 12",
      reliability: 98,
    },
    {
      id: "s2",
      name: "Rick Scott",
      party: "R",
      ticker: "WMT",
      type: "Sell",
      amount: "$500K",
      date: "Jan 30",
      reliability: 92,
    }
];

export default function ProfilePage() {
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);
    if (!mounted) return null;

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-[#050505] text-zinc-900 dark:text-zinc-200 font-sans p-6 lg:p-12 animate-in fade-in duration-500">
             {/* Background Effects */}
             <div className="fixed top-0 right-0 w-[600px] h-[600px] bg-cyan-500/5 blur-[120px] rounded-full pointer-events-none" />

             <div className="max-w-7xl mx-auto space-y-8">
                {/* 1. Header Section */}
                <ProfileHeader />

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* 2. Left Column: Settings & Watchlist (Col-4) */}
                    <div className="lg:col-span-4 space-y-8">
                        <Watchlist />
                        <CopyTradeControls />
                    </div>

                    {/* 3. Right Column: Saved Activity (Col-8) */}
                    <div className="lg:col-span-8">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-blue-500/10 rounded-xl text-blue-500">
                                <Activity size={20} />
                            </div>
                            <h3 className="text-xl font-bold text-zinc-900 dark:text-white">Saved Alpha</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {SAVED_TRADES.map((trade) => (
                                <TradeCard key={trade.id} trade={trade} />
                            ))}
                            {/* Upsell / Empty State */}
                            <div className="border border-dashed border-zinc-200 dark:border-zinc-800 rounded-[2rem] p-8 flex flex-col items-center justify-center text-center gap-4 min-h-[200px] hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors cursor-pointer group">
                                <div className="w-12 h-12 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-400 group-hover:text-cyan-500 group-hover:bg-cyan-500/10 transition-colors">
                                    <Activity size={24} />
                                </div>
                                <div>
                                    <div className="font-bold text-zinc-900 dark:text-zinc-200">Explore More Trades</div>
                                    <p className="text-xs text-zinc-500 mt-1">Find and pin more suspicious activity to your board.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
             </div>
        </div>
    );
}

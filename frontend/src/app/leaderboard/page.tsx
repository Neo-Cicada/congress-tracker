"use client";

import React, { useState, useEffect } from "react";
import { PartyPerformanceChart, PopularStocksList } from "../../components/LeaderboardCharts";
import { User, TrendingUp, TrendingDown, ArrowRight, ShieldAlert } from "lucide-react";
import { TradeCard } from "../../components/TradeCard";
import Link from "next/link";

// --- MOCK DATA ---
const TOP_GAINERS = [
    { rank: 1, name: "Nancy Pelosi", party: "D", return: "+65.4%", trade: "NVDA calls" },
    { rank: 2, name: "Mark Green", party: "R", return: "+52.1%", trade: "NRT energy" },
    { rank: 3, name: "Josh Gottheimer", party: "D", return: "+48.9%", trade: "MSFT early entry" },
];

const TOP_LOSERS = [
    { rank: 1, name: "Warren Davidson", party: "R", return: "-22.4%", trade: "Crypto crash" },
    { rank: 2, name: "Marie Newman", party: "D", return: "-18.5%", trade: "Bio-tech miss" },
    { rank: 3, name: "Peter Meijer", party: "R", return: "-12.1%", trade: "Retail slump" },
];

export default function LeaderboardPage() {
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);
    if (!mounted) return null;

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-[#050505] text-zinc-900 dark:text-zinc-200 font-sans p-6 lg:p-12 animate-in fade-in duration-500">
             {/* Background Effects */}
             <div className="fixed top-20 right-0 w-[500px] h-[500px] bg-cyan-500/5 blur-[100px] rounded-full pointer-events-none" />
             <div className="fixed bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/5 blur-[100px] rounded-full pointer-events-none" />

            {/* Header */}
            <header className="mb-12 max-w-5xl mx-auto">
                <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-white mb-3">
                    Alpha Leaderboard
                </h1>
                <p className="text-zinc-500 text-sm font-medium uppercase tracking-[0.2em]">
                    Tracking Performance, Volume, and Suspicious Alpha
                </p>
            </header>

            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-6 pb-20">
                {/* --- ROW 1: PRIMARY METRICS --- */}
                
                {/* Top Gainers - Col 4 */}
                <div className="md:col-span-4 bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-cyan-500" />
                    <div className="flex items-center justify-between mb-6">
                         <h3 className="font-bold text-lg flex items-center gap-2">
                            <TrendingUp className="text-emerald-500" size={20} />
                            Top Gainers
                         </h3>
                         <span className="text-xs font-mono text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded">YTD</span>
                    </div>
                    <div className="space-y-4">
                        {TOP_GAINERS.map((g, i) => (
                            <div key={i} className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <span className="text-xl font-black text-zinc-300 dark:text-zinc-700 italic">0{g.rank}</span>
                                    <div>
                                        <div className="font-bold text-sm text-zinc-800 dark:text-zinc-200">{g.name} <span className={`text-[10px] ${g.party === 'D' ? 'text-blue-500' : 'text-red-500'}`}>({g.party})</span></div>
                                        <div className="text-[10px] text-zinc-500">{g.trade}</div>
                                    </div>
                                </div>
                                <span className="font-mono font-bold text-emerald-500">{g.return}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Top Losers - Col 4 */}
                <div className="md:col-span-4 bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-rose-500 to-orange-500" />
                    <div className="flex items-center justify-between mb-6">
                         <h3 className="font-bold text-lg flex items-center gap-2">
                            <TrendingDown className="text-rose-500" size={20} />
                            Top Losers
                         </h3>
                         <span className="text-xs font-mono text-rose-500 bg-rose-500/10 px-2 py-1 rounded">YTD</span>
                    </div>
                    <div className="space-y-4">
                        {TOP_LOSERS.map((g, i) => (
                            <div key={i} className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <span className="text-xl font-black text-zinc-300 dark:text-zinc-700 italic">0{g.rank}</span>
                                    <div>
                                        <div className="font-bold text-sm text-zinc-800 dark:text-zinc-200">{g.name} <span className={`text-[10px] ${g.party === 'D' ? 'text-blue-500' : 'text-red-500'}`}>({g.party})</span></div>
                                        <div className="text-[10px] text-zinc-500">{g.trade}</div>
                                    </div>
                                </div>
                                <span className="font-mono font-bold text-rose-500">{g.return}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Party Stats - Col 4 */}
                <div className="md:col-span-4">
                    <PartyPerformanceChart />
                </div>


                {/* --- ROW 2: DETAILED ANALYTICS --- */}

                {/* Popular Stocks - Col 8 */}
                <div className="md:col-span-8">
                     <PopularStocksList />
                </div>

                {/* Suspicious Activity - Col 4 */}
                <div className="md:col-span-4 bg-gradient-to-b from-amber-500/10 to-transparent border border-amber-500/20 rounded-3xl p-6">
                    <div className="flex items-center gap-2 mb-6 text-amber-500">
                        <ShieldAlert size={24} />
                        <h3 className="font-bold text-lg text-amber-600 dark:text-amber-400">Suspicious Timing</h3>
                    </div>
                    <div className="space-y-6">
                        <div className="bg-white/50 dark:bg-black/20 p-4 rounded-2xl border border-amber-500/10">
                            <div className="flex justify-between items-start mb-2">
                                <div className="font-bold text-sm dark:text-zinc-200">Tommy Tuberville</div>
                                <span className="px-2 py-0.5 bg-amber-500/20 text-amber-600 dark:text-amber-400 text-[10px] font-bold rounded uppercase">High Risk</span>
                            </div>
                            <p className="text-xs text-zinc-500 leading-relaxed">
                                Bought <span className="font-bold text-zinc-700 dark:text-zinc-300">Humana (HUM)</span> puts 2 days before Medicare reimbursement cuts were announced.
                            </p>
                             <div className="mt-3 flex items-center gap-2 text-[10px] text-amber-600/80 font-mono">
                                <span className="font-bold">Gain: +420%</span>
                                <span className="w-1 h-1 rounded-full bg-amber-500/50" />
                                <span>2d Hold</span>
                            </div>
                        </div>

                        <div className="bg-white/50 dark:bg-black/20 p-4 rounded-2xl border border-amber-500/10">
                             <div className="flex justify-between items-start mb-2">
                                <div className="font-bold text-sm dark:text-zinc-200">Ro Khanna</div>
                                <span className="px-2 py-0.5 bg-amber-500/20 text-amber-600 dark:text-amber-400 text-[10px] font-bold rounded uppercase">Medium Risk</span>
                            </div>
                             <p className="text-xs text-zinc-500 leading-relaxed">
                                Heavy volume in <span className="font-bold text-zinc-700 dark:text-zinc-300">Defense Stocks</span> prior to committee budget approval.
                            </p>
                        </div>
                    </div>
                     <Link href="/ethics" className="block mt-6 text-center text-xs font-bold text-amber-600 dark:text-amber-500 hover:opacity-80 transition-opacity">
                        VIEW ETHICS REPORT &rarr;
                    </Link>
                </div>
            </div>
        </div>
    );
}

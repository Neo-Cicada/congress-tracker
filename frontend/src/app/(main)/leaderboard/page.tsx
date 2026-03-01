"use client";

import React, { useState, useEffect } from "react";
import { PartyPerformanceChart, PopularStocksList } from "../../../components/LeaderboardCharts";
import { User, TrendingUp, TrendingDown, ArrowRight, ShieldAlert, Loader2 } from "lucide-react";
import { TradeCard } from "../../../components/TradeCard";
import Link from "next/link";
import { fetchWithCache } from "../../../lib/apiCache";
import { getApiUrl } from "../../../lib/api";

interface LeaderboardItem {
    rank: number;
    name: string;
    party: string;
    return: string;
    trade: string;
}

export default function LeaderboardPage() {
    const [mounted, setMounted] = useState(false);
    const [loading, setLoading] = useState(true);
    const [gainers, setGainers] = useState<LeaderboardItem[]>([]);
    const [losers, setLosers] = useState<LeaderboardItem[]>([]);
    const [suspiciousTrades, setSuspiciousTrades] = useState<any[]>([]);

    useEffect(() => {
        setMounted(true);
        const fetchLeaderboards = async () => {
            try {
                const [gainersData, losersData, ethicsData] = await Promise.all([
                    fetchWithCache(getApiUrl('leaderboard?sort=desc')),
                    fetchWithCache(getApiUrl('leaderboard?sort=asc')),
                    fetchWithCache(getApiUrl('ethics/summary'))
                ]);
                
                if (ethicsData && ethicsData.suspiciousTrades) {
                    setSuspiciousTrades(ethicsData.suspiciousTrades.slice(0, 2));
                }
                
                const formatData = (data: any[]): LeaderboardItem[] => data.map((p, i) => {
                    const party = p.party?.startsWith("R") ? "R" : p.party?.startsWith("D") ? "D" : "I";
                    const ret = (p.stats?.ytdReturn || 0).toFixed(1);
                    return {
                        rank: i + 1,
                        name: p.name,
                        party,
                        return: p.stats?.ytdReturn > 0 ? `+${ret}%` : `${ret}%`,
                        trade: p.stats?.topHolding || "Active Trader"
                    };
                });

                if (Array.isArray(gainersData)) setGainers(formatData(gainersData).slice(0, 10));
                if (Array.isArray(losersData)) setLosers(formatData(losersData).slice(0, 10));
            } catch (error) {
                console.error('Failed to fetch leaderboard data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchLeaderboards();
    }, []);

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
                {loading ? (
                    <>
                        {/* Skeleton: Top Gainers */}
                        <div className="md:col-span-4 bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 animate-pulse">
                            <div className="h-1 w-full bg-gradient-to-r from-emerald-500/30 to-cyan-500/30 rounded absolute top-0 left-0" />
                            <div className="flex items-center justify-between mb-6">
                                <div className="h-6 w-32 bg-zinc-200 dark:bg-zinc-800 rounded" />
                                <div className="h-5 w-10 bg-emerald-500/10 rounded" />
                            </div>
                            <div className="space-y-5">
                                {[...Array(5)].map((_, i) => (
                                    <div key={i} className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="h-6 w-6 bg-zinc-200 dark:bg-zinc-800 rounded" />
                                            <div className="space-y-1.5">
                                                <div className="h-4 w-28 bg-zinc-200 dark:bg-zinc-800 rounded" />
                                                <div className="h-2.5 w-16 bg-zinc-100 dark:bg-zinc-800/60 rounded" />
                                            </div>
                                        </div>
                                        <div className="h-4 w-14 bg-emerald-500/10 rounded" />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Skeleton: Top Losers */}
                        <div className="md:col-span-4 bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 animate-pulse">
                            <div className="flex items-center justify-between mb-6">
                                <div className="h-6 w-28 bg-zinc-200 dark:bg-zinc-800 rounded" />
                                <div className="h-5 w-10 bg-rose-500/10 rounded" />
                            </div>
                            <div className="space-y-5">
                                {[...Array(5)].map((_, i) => (
                                    <div key={i} className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="h-6 w-6 bg-zinc-200 dark:bg-zinc-800 rounded" />
                                            <div className="space-y-1.5">
                                                <div className="h-4 w-28 bg-zinc-200 dark:bg-zinc-800 rounded" />
                                                <div className="h-2.5 w-16 bg-zinc-100 dark:bg-zinc-800/60 rounded" />
                                            </div>
                                        </div>
                                        <div className="h-4 w-14 bg-rose-500/10 rounded" />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Skeleton: Party Stats */}
                        <div className="md:col-span-4 bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 animate-pulse">
                            <div className="h-6 w-40 bg-zinc-200 dark:bg-zinc-800 rounded mb-6" />
                            <div className="h-48 bg-zinc-100 dark:bg-zinc-800/40 rounded-2xl" />
                        </div>

                        {/* Skeleton: Popular Stocks */}
                        <div className="md:col-span-8 bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 animate-pulse">
                            <div className="h-6 w-36 bg-zinc-200 dark:bg-zinc-800 rounded mb-6" />
                            <div className="space-y-4">
                                {[...Array(4)].map((_, i) => (
                                    <div key={i} className="h-12 bg-zinc-100 dark:bg-zinc-800/40 rounded-xl" />
                                ))}
                            </div>
                        </div>

                        {/* Skeleton: Suspicious Activity */}
                        <div className="md:col-span-4 bg-gradient-to-b from-amber-500/5 to-transparent border border-amber-500/10 rounded-3xl p-6 animate-pulse">
                            <div className="h-6 w-44 bg-zinc-200 dark:bg-zinc-800 rounded mb-6" />
                            <div className="space-y-4">
                                <div className="h-24 bg-zinc-100 dark:bg-zinc-800/30 rounded-2xl" />
                                <div className="h-24 bg-zinc-100 dark:bg-zinc-800/30 rounded-2xl" />
                            </div>
                        </div>
                    </>
                ) : (
                    <>
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
                        {gainers.map((g, i) => (
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
                        {losers.map((g, i) => (
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
                        {suspiciousTrades.length > 0 ? (
                            suspiciousTrades.map((trade, i) => {
                                const isBefore = trade.daysDiff < 0;
                                const daysStr = Math.abs(trade.daysDiff);
                                const riskLevel = daysStr <= 3 ? "High Risk" : "Medium Risk";
                                return (
                                    <div key={i} className="bg-white/50 dark:bg-black/20 p-4 rounded-2xl border border-amber-500/10">
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="font-bold text-sm dark:text-zinc-200">{trade.politicianName}</div>
                                            <span className="px-2 py-0.5 bg-amber-500/20 text-amber-600 dark:text-amber-400 text-[10px] font-bold rounded uppercase">{riskLevel}</span>
                                        </div>
                                        <p className="text-xs text-zinc-500 leading-relaxed">
                                            {trade.type === 'Buy' ? 'Bought' : 'Sold'} <span className="font-bold text-zinc-700 dark:text-zinc-300">{trade.ticker}</span> {daysStr} {daysStr === 1 ? 'day' : 'days'} {isBefore ? 'before' : 'after'} {trade.event}.
                                        </p>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="text-sm text-zinc-500 italic px-4 py-2">No suspicious trades detected recently.</div>
                        )}
                    </div>
                     <Link href="/ethics" className="block mt-6 text-center text-xs font-bold text-amber-600 dark:text-amber-500 hover:opacity-80 transition-opacity">
                        VIEW ETHICS REPORT &rarr;
                    </Link>
                </div>
                    </>
                )}
            </div>
        </div>
    );
}

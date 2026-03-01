"use client";

import React, { useState, useEffect } from "react";
import { ProfileHeader, Watchlist, SubscriptionCard } from "../../../components/ProfileComponents";
import { TradeCard, Trade } from "../../../components/TradeCard";
import { Activity, Loader2 } from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
import { getApiUrl } from "../../../lib/api";

export default function ProfilePage() {
    const [mounted, setMounted] = useState(false);
    const { token, savedTrades: savedTradeIds } = useAuth();
    const [savedTradesData, setSavedTradesData] = useState<Trade[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => setMounted(true), []);

    // Sync local state when a trade is unsaved from the profile
    useEffect(() => {
        setSavedTradesData(prevData => prevData.filter(trade => savedTradeIds.includes(trade.id)));
    }, [savedTradeIds]);

    useEffect(() => {
        const fetchSavedTradesData = async () => {
            if (!token) {
                setLoading(false);
                return;
            }
            try {
                const res = await fetch(getApiUrl("users/saved-trades"), {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    const formattedTrades: Trade[] = data.map((t: any) => ({
                        id: t._id,
                        politicianId: t.politicianId,
                        name: t.politicianName || 'Unknown',
                        party: t.party || 'IND',
                        ticker: t.ticker,
                        type: t.transactionType,
                        amount: t.amountRange || 'Unknown',
                        date: new Date(t.transactionDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                        reliability: 95
                    }));
                    // Sort descending by date locally just in case
                    formattedTrades.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
                    setSavedTradesData(formattedTrades);
                }
            } catch (err) {
                console.error("Error fetching saved trades data:", err);
            } finally {
                setLoading(false);
            }
        };

        // Only fetch on initial mount or full refresh, trust local sync effect for deletions
        if (savedTradesData.length === 0) {
            fetchSavedTradesData();
        }
    }, [token]);

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
                        <SubscriptionCard />
                        <Watchlist />
                    </div>

                    {/* 3. Right Column: Saved Activity (Col-8) */}
                    <div className="lg:col-span-8">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-500/10 rounded-xl text-blue-500">
                                    <Activity size={20} />
                                </div>
                                <h3 className="text-xl font-bold text-zinc-900 dark:text-white">Saved Alpha</h3>
                            </div>
                            <span className="text-[10px] font-mono font-bold text-zinc-500 uppercase tracking-widest bg-zinc-100 dark:bg-zinc-800 px-3 py-1.5 rounded-full">
                                {savedTradesData.length} Saved Trades
                            </span>
                        </div>

                        {loading ? (
                            <div className="flex items-center justify-center p-12 min-h-[300px]">
                                <Loader2 size={32} className="animate-spin text-cyan-500" />
                            </div>
                        ) : savedTradesData.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {savedTradesData.map((trade) => (
                                    <TradeCard key={trade.id} trade={trade} />
                                ))}
                            </div>
                        ) : (
                            <div className="border border-dashed border-zinc-200 dark:border-zinc-800 rounded-[2rem] p-8 flex flex-col items-center justify-center text-center gap-4 min-h-[300px] bg-white/50 dark:bg-zinc-900/10 backdrop-blur-sm">
                                <div className="w-16 h-16 rounded-2xl bg-zinc-100 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/50 flex items-center justify-center text-zinc-400">
                                    <Activity size={28} />
                                </div>
                                <div>
                                    <div className="font-bold text-zinc-900 dark:text-zinc-200 text-lg">No Saved Alpha</div>
                                    <p className="text-sm text-zinc-500 mt-2 max-w-[250px] mx-auto leading-relaxed">Find and bookmark suspicious trades across the platform to pin them to your board.</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
             </div>
        </div>
    );
}

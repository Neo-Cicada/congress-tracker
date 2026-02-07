"use client";

import React, { use } from "react";
import { PoliticianHeader } from "../../../components/PoliticianHeader";
import { TradeCard, Trade } from "../../../components/TradeCard";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

// --- MOCK DATA FOR DEMO ---
const MOCK_TRADES: Trade[] = [
  {
    id: "101",
    name: "Nancy Pelosi",
    party: "D",
    ticker: "NVDA",
    type: "Buy",
    amount: "$1M+",
    date: "2h ago",
    reliability: 98,
  },
  {
    id: "102",
    name: "Nancy Pelosi",
    party: "D",
    ticker: "AAPL",
    type: "Sell",
    amount: "$500K",
    date: "3d ago",
    reliability: 98,
  },
  {
    id: "103",
    name: "Nancy Pelosi",
    party: "D",
    ticker: "MSFT",
    type: "Buy",
    amount: "$250K",
    date: "1w ago",
    reliability: 98,
  },
];

export default function PoliticianPage() {
    const params = useParams();
    const router = useRouter(); // Use useRouter for navigation if needed or invalid ID
    
    // State
    const [data, setData] = React.useState<any>(null);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState('');

    React.useEffect(() => {
        const fetchPoliticianData = async () => {
            if (!params?.id) return;
            try {
                const res = await fetch(`http://localhost:4000/api/politician/${params.id}`);
                if (!res.ok) throw new Error('Failed to fetch politician data');
                const json = await res.json();
                console.log(json);
                setData(json);
            } catch (err) {
                console.error(err);
                setError('Failed to load politician data.');
            } finally {
                setLoading(false);
            }
        };
        fetchPoliticianData();
    }, [params?.id]);

    if (loading) {
         return (
            <div className="min-h-screen bg-zinc-50 dark:bg-[#050505] flex items-center justify-center">
                <div className="text-zinc-500 animate-pulse font-mono tracking-widest">LOADING WHALE DATA...</div>
            </div>
         );
    }

    if (error || !data) {
         return (
            <div className="min-h-screen bg-zinc-50 dark:bg-[#050505] flex items-center justify-center flex-col gap-4">
                <div className="text-red-500 font-mono tracking-widest">{error || 'POLITICIAN NOT FOUND'}</div>
                <Link href="/" className="px-4 py-2 bg-zinc-200 dark:bg-zinc-800 rounded-lg text-xs font-bold uppercase">Back to Home</Link>
            </div>
         );
    }

    // Helper to format mock trade object for TradeCard if needed, 
    // but TradeCard might expect specific shape. 
    // Adapting backend trade to TradeCard props:
    const formattedTrades = data.trades.map((t: any) => ({
        id: t._id,
        name: data.politician.name,
        party: data.politician.party,
        ticker: t.ticker,
        type: t.transactionType,
        amount: t.amountRange,
        date: new Date(t.transactionDate).toLocaleDateString(),
        reliability: 85, // Mock reliability for now
        // TradeCard visual depends on these
    }));

    const politicianReturn = data.comparison?.politicianYtd || 0;
    const spyReturn = data.comparison?.spyYtd || 0;
    const isOutperforming = politicianReturn > spyReturn;

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-[#050505] text-zinc-900 dark:text-zinc-200 font-sans transition-colors duration-300">
            <main className="p-6 lg:p-12 relative animate-in fade-in duration-500">
                 {/* Back Button */}
                 <div className="mb-8">
                    <Link href="/" className="inline-flex items-center gap-2 text-zinc-500 hover:text-cyan-500 transition-colors bg-white dark:bg-zinc-900/50 px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800">
                        <ArrowLeft size={16} />
                        <span className="text-xs font-bold uppercase tracking-widest">Back to Dashboard</span>
                    </Link>
                 </div>

                {/* Header */}
                <PoliticianHeader 
                    name={data.politician.name}
                    party={data.politician.party as "D" | "R"}
                    chamber={data.politician.chamber}
                    state={data.politician.state || "US"}
                />

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* LEFT COLUMN - STATS & COMPARISON */}
                    <div className="lg:col-span-8 space-y-6">
                         {/* INDEX COMPARISON CHART / VISUAL */}
                         <div className="bg-white dark:bg-zinc-900/20 border border-zinc-200 dark:border-zinc-800/50 rounded-[2rem] p-8">
                            <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-6">Index Comparison (YTD)</h3>
                            <div className="flex flex-col gap-6">
                                {/* Politician Bar */}
                                <div>
                                    <div className="flex justify-between text-sm font-bold mb-2">
                                        <span>{data.politician.name}</span>
                                        <span className={politicianReturn >= 0 ? "text-emerald-500" : "text-rose-500"}>{politicianReturn > 0 ? '+' : ''}{politicianReturn}%</span>
                                    </div>
                                    <div className="w-full h-12 bg-zinc-100 dark:bg-zinc-800/50 rounded-xl overflow-hidden relative">
                                        <div 
                                            className={`h-full ${politicianReturn >= 0 ? "bg-emerald-500" : "bg-rose-500"} transition-all duration-1000 flex items-center px-4 text-white font-black text-xs`}
                                            style={{ width: `${Math.min(Math.abs(politicianReturn) * 2, 100)}%` }} // Scaling for visual
                                        >
                                        </div>
                                    </div>
                                </div>
                                
                                {/* SPY Bar */}
                                <div>
                                    <div className="flex justify-between text-sm font-bold mb-2">
                                        <span className="text-zinc-500">S&P 500 (SPY)</span>
                                        <span className={spyReturn >= 0 ? "text-emerald-500" : "text-rose-500"}>{spyReturn > 0 ? '+' : ''}{spyReturn}%</span>
                                    </div>
                                    <div className="w-full h-12 bg-zinc-100 dark:bg-zinc-800/50 rounded-xl overflow-hidden relative">
                                        <div 
                                            className={`h-full ${spyReturn >= 0 ? "bg-cyan-500" : "bg-rose-500"} transition-all duration-1000 flex items-center px-4 text-black/50 font-black text-xs`}
                                            style={{ width: `${Math.min(Math.abs(spyReturn) * 2, 100)}%` }} // Scaling for visual
                                        >
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="mt-4 p-4 bg-zinc-100 dark:bg-zinc-800/30 rounded-xl text-center">
                                    <p className="text-sm text-zinc-600 dark:text-zinc-400 font-medium">
                                        {isOutperforming 
                                          ? `🔥 Outperforming the market by ${(politicianReturn - spyReturn).toFixed(2)}%` 
                                          : `📉 Underperforming the market by ${(spyReturn - politicianReturn).toFixed(2)}%`}
                                    </p>
                                </div>
                            </div>
                         </div>
                    </div>

                    {/* RIGHT COLUMN - ALPHA STRATEGY */}
                     <div className="lg:col-span-4 flex flex-col gap-6">
                        <div className="bg-gradient-to-br from-cyan-500/10 to-blue-600/10 border border-cyan-500/20 rounded-[2rem] p-8 h-full">
                            <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-4">Alpha Strategy</h3>
                            <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed mb-6 font-medium">
                                {data.analysis?.strategy || "No strategy analysis available."}
                            </p>
                            <div className="flex gap-2 flex-wrap">
                                {data.analysis?.topTickers?.map((ticker: string) => (
                                    <span key={ticker} className="px-3 py-1 bg-white/50 dark:bg-white/10 border border-white/20 dark:border-white/5 text-zinc-700 dark:text-zinc-300 rounded-lg text-xs font-bold uppercase">
                                        {ticker}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* FULL WIDTH - RECENT TRADES */}
                    <div className="lg:col-span-12">
                         <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-6 flex items-center gap-2">
                            Recent Activity <span className="text-xs font-normal text-zinc-500 uppercase tracking-widest bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded">Live Feed</span>
                         </h3>
                         {formattedTrades.length > 0 ? (
                             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {formattedTrades.map((trade: any) => (
                                    <TradeCard key={trade.id} trade={trade} />
                                ))}
                             </div>
                         ) : (
                             <div className="p-12 text-center border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl text-zinc-500 font-mono text-sm">
                                 NO RECENT TRADES FOUND
                             </div>
                         )}
                    </div>
                </div>
            </main>
        </div>
    );
}

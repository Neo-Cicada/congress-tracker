"use client";

import React, { use } from "react";
import { PoliticianHeader } from "../../../components/PoliticianHeader";
import { PortfolioChart } from "../../../components/PortfolioChart";
import { TradeCard, Trade } from "../../../components/TradeCard";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

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
    // In Next.js 15/16, params is a Promise or can be unwrapped with React.use()
    const params = useParams();
    
    // In a real app, fetch data based on params.id
    // For now, we mock it based on ID or fallback
    const politicianName = typeof params?.id === 'string' && params.id == '1' ? 'Nancy Pelosi' : 'Politician Name';
    const party = "D"; // Mock

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
                    name={politicianName}
                    party={party as "D" | "R"}
                    chamber="House" // Mock
                    state="CA" // Mock
                />

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* LEFT COLUMN - CHART */}
                    <div className="lg:col-span-8">
                         <PortfolioChart />
                    </div>

                    {/* RIGHT COLUMN - STATS / EXTRA (Optional, maybe top holdings?) */}
                     <div className="lg:col-span-4 flex flex-col gap-6">
                        <div className="bg-gradient-to-br from-cyan-500/10 to-blue-600/10 border border-cyan-500/20 rounded-[2rem] p-8">
                            <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-4">Alpha Strategy</h3>
                            <p className="text-zinc-500 text-sm leading-relaxed mb-6">
                                Dominant strategy appears to be momentum trading in large-cap tech. Historical correlation with committee hearings is high.
                            </p>
                            <div className="flex gap-2 flex-wrap">
                                <span className="px-3 py-1 bg-cyan-500/10 text-cyan-600 rounded-lg text-xs font-bold uppercase">Tech</span>
                                <span className="px-3 py-1 bg-blue-500/10 text-blue-600 rounded-lg text-xs font-bold uppercase">AI</span>
                                <span className="px-3 py-1 bg-emerald-500/10 text-emerald-600 rounded-lg text-xs font-bold uppercase">Chips</span>
                            </div>
                        </div>
                    </div>

                    {/* FULL WIDTH - RECENT TRADES */}
                    <div className="lg:col-span-12">
                         <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-6 flex items-center gap-2">
                            Recent Activity <span className="text-xs font-normal text-zinc-500 uppercase tracking-widest bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded">Live Feed</span>
                         </h3>
                         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {MOCK_TRADES.map((trade) => (
                                <TradeCard key={trade.id} trade={trade} />
                            ))}
                         </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

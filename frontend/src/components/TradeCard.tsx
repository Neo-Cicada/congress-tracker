import React from 'react';
import Link from "next/link";
import { ArrowUpRight, ArrowDownRight, ChevronRight, Clock, Bookmark } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
export interface Trade {
  id: string;
  politicianId?: string;
  name: string;
  party: 'D' | 'R';
  ticker: string;
  type: string;
  amount: string;
  date: string;
  reliability: number;
  filingDelay?: number; // Days between trade and report
  disableLink?: boolean;
}

export const TradeCard: React.FC<{ trade: Trade }> = ({ trade }) => {
  const isBuy = trade.type.toLowerCase() === 'buy';
  const { savedTrades, toggleSavedTrade, user } = useAuth();
  const isSaved = savedTrades?.includes(trade.id);

  return (
    <div className="relative group bg-white dark:bg-zinc-900/20 border border-zinc-200 dark:border-zinc-800/50 hover:border-cyan-500/30 rounded-[2rem] p-6 backdrop-blur-xl transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-cyan-500/5">
      <div className="flex justify-between items-start mb-8">
        <div className="flex items-center gap-4">
          {/* Party Indicator with better contrast */}
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg shadow-inner ${
            trade.party === 'D' 
              ? 'bg-blue-500/10 text-blue-600 dark:bg-blue-500/20' 
              : 'bg-red-500/10 text-red-600 dark:bg-red-500/20'
          }`}>
            {trade.party}
          </div>
          <div>
            {trade.disableLink ? (
               <span className="font-bold text-zinc-800 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-300 transition-colors">
                  {trade.name}
               </span>
            ) : (
                <Link href={`/politician/${trade.politicianId || trade.id}`} className="font-bold text-zinc-800 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-300 transition-colors hover:underline decoration-cyan-500/30">
                  {trade.name}
                </Link>
            )}
            <div className="flex items-center gap-1.5 text-[10px] text-zinc-400 dark:text-zinc-500 font-mono tracking-tighter uppercase">
              <Clock size={10} /> {trade.date}
            </div>
          </div>
        </div>
        
        {/* Top Right: Transaction Badge & Bookmark */}
        <div className="flex items-center gap-3">
          {user && (
            <button 
              onClick={(e) => { e.preventDefault(); toggleSavedTrade(trade.id); }}
              className={`p-2 rounded-xl flex items-center justify-center border transition-all duration-300 z-10 hover:scale-110 active:scale-95 cursor-pointer ${
                isSaved 
                  ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.2)]' 
                  : 'bg-zinc-100/50 dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-700/50 text-zinc-400 hover:text-cyan-500 hover:border-cyan-500/30 hover:bg-cyan-500/5'
              }`}
              title={isSaved ? "Remove from Saved Alpha" : "Save to Alpha"}
            >
              <Bookmark size={14} className={isSaved ? "fill-current" : ""} />
            </button>
          )}
          <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border transition-colors ${
            isBuy 
              ? 'border-emerald-500/20 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400 group-hover:bg-emerald-500/20' 
              : 'border-rose-500/20 bg-rose-500/5 text-rose-600 dark:text-rose-400 group-hover:bg-rose-500/20'
          }`}>
            {trade.type}
          </div>
        </div>
      </div>

      <div className="flex items-end justify-between">
        <div>
          <p className="text-[10px] text-zinc-400 dark:text-zinc-500 uppercase font-bold tracking-widest mb-1">Ticker</p>
          <div className="flex items-center gap-2">
            <span className="text-3xl font-black text-zinc-900 dark:text-white tracking-tighter italic group-hover:tracking-normal transition-all">
              {trade.ticker}
            </span>
            {isBuy ? <ArrowUpRight className="text-emerald-500" /> : <ArrowDownRight className="text-rose-500" />}
          </div>
        </div>
        <div className="text-right">
          <p className="text-[10px] text-zinc-400 dark:text-zinc-500 uppercase font-bold tracking-widest mb-1">Volume</p>
          <span className="text-xl font-mono font-bold text-zinc-700 dark:text-zinc-100">{trade.amount}</span>
        </div>
      </div>

      {/* Reliability Meter */}
      <div className="mt-8 pt-6 border-t border-zinc-100 dark:border-zinc-800/50 flex flex-col gap-3">
        <div className="flex justify-between items-center">
          <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">Reliability Score</span>
          <span className="text-[10px] text-cyan-500 font-bold">{trade.reliability}%</span>
        </div>
        <div className="w-full h-1 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-cyan-500 transition-all duration-1000" 
            style={{ width: `${trade.reliability}%` }} 
          />
        </div>
        
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${trade.reliability > 90 ? 'bg-cyan-500 animate-pulse' : 'bg-zinc-500'}`} />
            <span className="text-[9px] text-zinc-400 font-medium uppercase tracking-tighter">Verified Stream</span>
          </div>
          <button className="flex items-center gap-1 text-[10px] font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-widest hover:text-cyan-500 transition-all">
            Analysis <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};
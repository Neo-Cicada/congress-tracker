import React from "react";
import { 
    Settings, 
    Star,
    Mail,
    UserCircle
} from "lucide-react";

// --- 1. USER PROFILE HEADER ---
export const ProfileHeader = () => {
  return (
    <div className="relative overflow-hidden rounded-[1.5rem] md:rounded-[2.5rem] bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 p-6 md:p-8 text-zinc-900 dark:text-white shadow-xl dark:shadow-none backdrop-blur-sm group transition-colors">
      
      {/* Ambient Glow - Subtle */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 dark:bg-cyan-500/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/5 dark:bg-purple-500/10 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2" />

      <div className="relative z-10">
        {/* Top Bar: Network & Status */}
        <div className="flex items-center justify-between mb-6 md:mb-8">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/50 backdrop-blur-md">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                <span className="text-[10px] font-mono font-bold text-zinc-600 dark:text-zinc-400 uppercase tracking-widest">Online</span>
            </div>
            <div className="flex items-center gap-4">
                 <button className="text-zinc-400 dark:text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors">
                    <Settings size={18} />
                 </button>
            </div>
        </div>

        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 md:gap-8">
            {/* Wallet Identity */}
            <div className="flex-1 w-full">
                <div className="flex items-center gap-4 mb-2">
                    <div className="hidden md:flex w-16 h-16 rounded-full bg-zinc-100 dark:bg-zinc-800 items-center justify-center border border-zinc-200 dark:border-zinc-700">
                         <UserCircle size={32} className="text-zinc-400" />
                    </div>
                    <div>
                         <div className="flex items-center gap-2 mb-1">
                            {/* Truncate address on mobile */}
                            <h2 className="text-xl md:text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
                                Demo User
                            </h2>
                         </div>
                         <div className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
                            <Mail size={14} />
                            <span>user@example.com</span>
                         </div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

// --- 2. WATCHLIST GRID ---
const WATCHLIST_ITEMS = [
    { name: "Nancy Pelosi", party: "D", ticker: "NVDA", return: "+65%", img: "bg-blue-500" },
    { name: "Tommy Tuberville", party: "R", ticker: "XOM", return: "+32%", img: "bg-red-500" },
    { name: "Ro Khanna", party: "D", ticker: "LMT", return: "+24%", img: "bg-blue-500" },
];

export const Watchlist = () => {
    return (
        <div className="bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 relative overflow-hidden transition-colors backdrop-blur-sm">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-mono font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                    <Star size={18} className="text-amber-500" />
                    Watchlist
                </h3>
                <button className="text-[10px] font-mono font-bold text-zinc-500 hover:text-cyan-500 transition-colors uppercase tracking-widest">
                    Manage
                </button>
            </div>

            <div className="space-y-3">
                {WATCHLIST_ITEMS.map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-100 dark:border-zinc-800 hover:border-cyan-500/30 transition-all cursor-pointer group">
                        <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-white font-mono font-bold text-xs ${item.img}`}>
                                {item.party}
                            </div>
                            <div>
                                <div className="font-mono font-bold text-sm text-zinc-900 dark:text-zinc-200 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">{item.name}</div>
                                <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">{item.ticker} <span className="text-zinc-300 dark:text-zinc-700">|</span> 24h</div>
                            </div>
                        </div>
                        <div className="text-right">
                             <div className="font-mono font-bold text-emerald-500">{item.return}</div>
                             <div className="text-[10px] font-mono text-zinc-600 uppercase">ROE</div>
                        </div>
                    </div>
                ))}
                
                <button className="w-full py-3 rounded-xl border border-dashed border-zinc-300 dark:border-zinc-800 text-zinc-400 dark:text-zinc-600 text-[10px] font-mono font-bold uppercase tracking-widest hover:border-cyan-500 hover:text-cyan-500 transition-all">
                    + Add Protocol
                </button>
            </div>
        </div>
    )
}

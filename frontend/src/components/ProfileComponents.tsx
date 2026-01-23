import React from "react";
import { 
    User, 
    Settings, 
    Bell, 
    ShieldAlert, 
    TrendingUp, 
    LogOut,
    ChevronRight,
    Star,
    Zap,
    Copy,
    ExternalLink
} from "lucide-react";

// --- 1. WEB3 WALLET HEADER ---
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
                <span className="text-[10px] font-mono font-bold text-zinc-600 dark:text-zinc-400 uppercase tracking-widest">Solana Mainnet</span>
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
                    <div className="hidden md:flex w-12 h-12 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 items-center justify-center shadow-lg shadow-cyan-500/20">
                         <Zap size={24} className="text-white fill-white" />
                    </div>
                    <div>
                         <div className="flex items-center gap-2 mb-1">
                            {/* Truncate address on mobile */}
                            <h2 className="text-xl md:text-2xl font-mono font-bold tracking-tight text-zinc-900 dark:text-white whitespace-nowrap">
                                <span className="md:hidden">5ZwF...jK8p</span>
                                <span className="hidden md:inline">5ZwF...jK8p</span>
                            </h2>
                            <Copy size={14} className="text-zinc-500 hover:text-cyan-500 cursor-pointer transition-colors" />
                            <ExternalLink size={14} className="text-zinc-500 hover:text-cyan-500 cursor-pointer transition-colors" />
                         </div>
                         <div className="flex items-center gap-2 text-xs font-mono text-zinc-500 dark:text-zinc-400">
                            <span>Connected via Phantom</span>
                         </div>
                    </div>
                </div>
            </div>

            {/* Portfolio Stats (Terminal Style) */}
            <div className="w-full md:w-auto flex flex-col sm:flex-row sm:items-end gap-6 md:gap-8 bg-zinc-50 dark:bg-zinc-800/50 p-5 md:p-6 rounded-2xl border border-zinc-200 dark:border-zinc-700/50 backdrop-blur-md">
                <div className="flex flex-col gap-1">
                    <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-widest">Total Equity</span>
                    <div className="flex items-baseline gap-2">
                        <span className="text-3xl md:text-4xl font-mono font-bold text-zinc-900 dark:text-white tracking-tighter truncate max-w-[200px] md:max-w-none">$24,420.69</span>
                    </div>
                    <span className="text-xs font-mono text-zinc-500 dark:text-zinc-400">◎ 145.2 SOL</span>
                </div>

                <div className="flex flex-col gap-1 items-start sm:items-end pl-0 sm:pl-8 border-t sm:border-t-0 sm:border-l border-zinc-200 dark:border-zinc-700/50 pt-4 sm:pt-0">
                     <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-widest">All Time PnL</span>
                     <div className="flex items-center gap-2 text-emerald-500">
                        <TrendingUp size={20} />
                        <span className="text-xl md:text-2xl font-mono font-bold tracking-tighter">+124.5%</span>
                     </div>
                     <span className="text-xs font-mono text-emerald-500/70">+$13,204</span>
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

// --- 3. COPY-TRADE CONTROLS ---
export const CopyTradeControls = () => {
    return (
        <div className="bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 relative overflow-hidden transition-colors backdrop-blur-sm">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            
             <div className="flex items-center justify-between mb-8 relative z-10">
                <h3 className="text-lg font-mono font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                    <TrendingUp size={18} className="text-cyan-500" />
                    Auto-Copy
                </h3>
                <span className="px-2 py-1 rounded bg-emerald-500/10 text-emerald-500 text-[10px] font-mono font-bold uppercase tracking-wider border border-emerald-500/20">Active</span>
            </div>

            <div className="space-y-8 relative z-10">
                {/* Allocation Slider */}
                <div>
                     <div className="flex justify-between items-end mb-4">
                        <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest">Portfolio Allocation</span>
                        <span className="text-xl font-mono font-bold text-zinc-900 dark:text-white">15<span className="text-cyan-500">%</span></span>
                     </div>
                     <div className="h-2 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                        <div className="h-full w-[15%] bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.5)]" />
                     </div>
                     <div className="flex justify-between mt-2 text-[10px] font-mono text-zinc-600">
                        <span>0%</span>
                        <span>Max 20%</span>
                     </div>
                </div>

                {/* Risk Settings */}
                <div className="space-y-4">
                    <ToggleItem 
                        label="Auto-Execute" 
                        desc="Instant buy on disclosure" 
                        active={true} 
                    />
                    <ToggleItem 
                        label="Stop Loss Protection" 
                        desc="Auto-sell if politician sells" 
                        active={true} 
                    />
                     <ToggleItem 
                        label="Front-Run Mode" 
                        desc="High priority fees (0.01 SOL)" 
                        active={false} 
                    />
                </div>

                {/* Terminal Actions */}
                 <div className="pt-6 border-t border-zinc-200 dark:border-zinc-800 flex gap-3">
                    <button className="flex-1 py-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-500 font-mono font-bold text-xs hover:bg-cyan-500 hover:text-white transition-all uppercase tracking-normal">
                        View Logs
                    </button>
                    <button className="flex-1 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 font-mono font-bold text-xs hover:bg-red-500 hover:text-white transition-all uppercase tracking-normal">
                        Pause All
                    </button>
                 </div>
            </div>
        </div>
    )
}

const ToggleItem = ({ label, desc, active }: { label: string, desc: string, active: boolean }) => (
    <div className="flex items-start justify-between">
        <div>
            <div className="font-mono font-bold text-sm text-zinc-700 dark:text-zinc-200">{label}</div>
            <div className="text-[10px] font-mono text-zinc-500 max-w-[200px] mt-1">{desc}</div>
        </div>
        <div className={`w-8 h-4 rounded-full p-0.5 transition-colors cursor-pointer ${active ? 'bg-cyan-500' : 'bg-zinc-200 dark:bg-zinc-700'}`}>
            <div className={`w-3 h-3 rounded-full bg-white shadow-sm transition-transform ${active ? 'translate-x-4' : 'translate-x-0'}`} />
        </div>
    </div>
)

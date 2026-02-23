import React from "react";
import {
  AlertTriangle,
  Clock,
  TrendingDown,
  TrendingUp,
  FileText,
  ShieldAlert,
  Calendar,
  CheckCircle,
  XCircle,
  AlertOctagon,
  Info,
} from "lucide-react";

// --- Types ---
export interface Conflict {
  id: string;
  politicianName: string;
  committee: string;
  ticker: string;
  sector: string;
  date: string;
  severity: "high" | "medium" | "low";
}

export interface SuspiciousTrade {
  id: string;
  politicianName: string;
  ticker: string;
  type: "Buy" | "Sell";
  date: string;
  event: string;
  daysDiff: number; // e.g. -3 means 3 days before
}

export interface ComplianceRecord {
  id: string;
  politicianName: string;
  ticker: string;
  tradeDate: string;
  reportDate: string;
  daysLate: number;
  status: "on-time" | "late" | "violation";
}

// Mock Data structure removed for Conflicts, Suspicious Trades, and Compliance as they now come from the API

// --- 1. Ethics Score Card ---
export const EthicsScoreCard = ({
  score,
  riskLevel,
}: {
  score: number;
  riskLevel: "LOW" | "MEDIUM" | "HIGH";
}) => {
  const color =
    riskLevel === "LOW"
      ? "text-emerald-500 from-emerald-500/20 to-emerald-500/5 border-emerald-500/20"
      : riskLevel === "MEDIUM"
      ? "text-amber-500 from-amber-500/20 to-amber-500/5 border-amber-500/20"
      : "text-rose-600 from-rose-600/20 to-rose-600/5 border-rose-600/20"; // High Risk

  return (
    <div className={`relative overflow-hidden rounded-[2.5rem] p-8 border bg-gradient-to-br ${color} backdrop-blur-xl`}>
      <div className="absolute top-0 right-0 p-8 opacity-20">
        <ShieldAlert size={120} />
      </div>

      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-4">
          <div className={`p-2 rounded-xl bg-white/10 backdrop-blur-md`}>
            <AlertOctagon size={24} />
          </div>
          <h3 className="font-bold text-lg uppercase tracking-widest opacity-80">
            Ethics Risk Level
          </h3>
        </div>

        <div className="flex items-baseline gap-4">
          <span className="text-6xl font-black tracking-tighter">
            {riskLevel}
          </span>
          <span className="text-2xl font-bold opacity-60">
            / {score} RTS
          </span>
        </div>

        <p className="mt-4 max-w-md opacity-80 font-medium leading-relaxed">
          Based on analysis of late filings, committee conflicts, suspicious
          timing relative to market-moving events, and overall trading frequency.
        </p>

        <div className="mt-8 flex gap-2">
            {[1,2,3,4,5].map(i => (
                <div key={i} className={`h-2 flex-1 rounded-full ${i <= (riskLevel === 'HIGH' ? 5 : riskLevel === 'MEDIUM' ? 3 : 1) ? 'bg-current' : 'bg-black/10'}`} />
            ))}
        </div>
      </div>
    </div>
  );
};

// --- 2. Conflict of Interest Scanner ---
export const ConflictScanner = ({ conflicts }: { conflicts: Conflict[] }) => {
  return (
    <div className="bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800/50 rounded-3xl p-6 backdrop-blur-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 bg-rose-100 dark:bg-rose-500/10 text-rose-600 rounded-xl">
          <AlertTriangle size={20} />
        </div>
        <div>
          <h3 className="font-bold text-zinc-900 dark:text-white">
            Conflict of Interest Scanner
          </h3>
          <p className="text-xs text-zinc-500 font-medium uppercase tracking-wider">
            Detected Violations
          </p>
        </div>
      </div>

      <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
        {conflicts.map((conflict) => (
          <div
            key={conflict.id}
            className="group flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/30 border border-zinc-100 dark:border-zinc-800 hover:border-rose-500/30 transition-all"
          >
            <div className="flex flex-col gap-1">
              <span className="font-bold text-zinc-800 dark:text-zinc-200">
                {conflict.politicianName}
              </span>
              <div className="flex items-center gap-2 text-xs text-zinc-500">
                <span className="px-1.5 py-0.5 rounded bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300">
                  {conflict.ticker}
                </span>
                <span>in</span>
                <span className="font-medium text-zinc-700 dark:text-zinc-300">
                  {conflict.sector}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
                <span className="text-xs font-mono text-zinc-400">{conflict.date}</span>
                <div className="px-3 py-1.5 rounded-lg bg-rose-50 dark:bg-rose-900/20 border border-rose-100 dark:border-rose-800 text-rose-600 dark:text-rose-400 text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                    <ShieldAlert size={12} />
                    {conflict.committee}
                </div>
            </div>
          </div>
        ))}

        {conflicts.length === 0 && (
          <div className="p-8 text-center text-zinc-500 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl">
            No conflicts of interest detected in recent trades.
          </div>
        )}
      </div>
    </div>
  );
};

// --- 3. Suspicious Timing Detector ---
export const TimingDetector = ({ trades = [] }: { trades?: SuspiciousTrade[] }) => {
  return (
    <div className="bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800/50 rounded-3xl p-6 backdrop-blur-sm h-full">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-100 dark:bg-amber-500/10 text-amber-600 rounded-xl">
            <Clock size={20} />
            </div>
            <div>
            <h3 className="font-bold text-zinc-900 dark:text-white">
                Suspicious Timing Detector
            </h3>
            <p className="text-xs text-zinc-500 font-medium uppercase tracking-wider">
                Event Correlation
            </p>
            </div>
        </div>
        
        <div className="relative group flex items-center">
            <button 
                className="text-zinc-400 hover:text-amber-500 cursor-help transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 rounded"
            >
                <Info size={16} />
            </button>
            <div className="absolute right-0 top-full mt-2 w-64 p-3 bg-zinc-900 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-900 text-xs rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible focus-within:opacity-100 focus-within:visible transition-all shadow-xl z-50 pointer-events-none font-medium text-left">
                Highlights trades that occurred suspiciously close (within 14 days) to major market-moving events or hearings relevant to the traded asset.
                <svg className="absolute text-zinc-900 dark:text-zinc-100 h-2 w-full left-0 bottom-full rotate-180" x="0px" y="0px" viewBox="0 0 255 255"><polygon className="fill-current" points="0,0 127.5,127.5 255,0" /></svg>
            </div>
        </div>
      </div>

      <div className="relative border-l-2 border-zinc-200 dark:border-zinc-800 ml-3 space-y-8 pl-8 py-2 overflow-y-auto max-h-[500px] pr-2">
        {trades.map((trade) => (
          <div key={trade.id} className="relative">
            {/* Timeline Node */}
            <div className="absolute -left-[3.25rem] top-0 w-6 h-6 rounded-full bg-zinc-100 dark:bg-zinc-900 border-2 border-amber-500 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            </div>

            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/30 border border-zinc-100 dark:border-zinc-800 hover:border-amber-500/30 transition-all">
                <div>
                     <div className="flex items-center gap-2 mb-2">
                        <span className="font-bold text-zinc-900 dark:text-white">{trade.politicianName}</span>
                        <span className={`text-xs font-bold px-2 py-0.5 rounded ${trade.type === 'Buy' ? 'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400' : 'bg-rose-100 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400'}`}>
                            {trade.type} {trade.ticker}
                        </span>
                     </div>
                     <p className="text-sm text-zinc-600 dark:text-zinc-400">
                        Occurred <strong className="text-zinc-900 dark:text-zinc-200">{Math.abs(trade.daysDiff)} days {trade.daysDiff < 0 ? 'before' : 'after'}</strong>
                     </p>
                     <div className="relative group flex items-center gap-1 mt-1 w-fit">
                        <Info size={14} className="text-amber-600 dark:text-amber-500 cursor-help" /> 
                        <span className="text-sm font-medium text-amber-600 dark:text-amber-500">{trade.event}</span>
                        <div className="absolute bottom-full left-0 mb-2 w-56 p-3 bg-zinc-900 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-900 text-xs rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible focus-within:opacity-100 focus-within:visible transition-all shadow-xl z-50 pointer-events-none font-medium text-left">
                            This event was flagged as highly relevant to the traded asset, occurring suspiciously close to the transaction date.
                            <svg className="absolute text-zinc-900 dark:text-zinc-100 h-2 w-full left-2 top-full" x="0px" y="0px" viewBox="0 0 255 255"><polygon className="fill-current" points="0,0 127.5,127.5 255,0" /></svg>
                        </div>
                     </div>
                </div>
                <div className="text-right">
                    <span className="text-xs font-mono text-zinc-400 block">{trade.date}</span>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-amber-500 mt-1 block">Flagged</span>
                </div>
            </div>
          </div>
        ))}
        {trades.length === 0 && (
          <div className="p-8 text-center text-zinc-500 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl -ml-2">
             No highly suspicious event correlations found recently.
          </div>
        )}
      </div>
    </div>
  );
};

// --- 4. Delay Violation Checker ---
export interface DelayCheckerProps {
    records: ComplianceRecord[];
}

export const DelayChecker = ({ records }: DelayCheckerProps) => {
    return (
      <div className="bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800/50 rounded-3xl p-6 backdrop-blur-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 bg-blue-100 dark:bg-blue-500/10 text-blue-600 rounded-xl">
            <Calendar size={20} />
          </div>
          <div>
            <h3 className="font-bold text-zinc-900 dark:text-white">
              Delay Violation Checker
            </h3>
            <p className="text-xs text-zinc-500 font-medium uppercase tracking-wider">
              STOCK Act Compliance
            </p>
          </div>
        </div>
  
        <div className="overflow-x-auto max-h-[500px]">
            <table className="w-full text-sm text-left">
                <thead className="text-xs text-zinc-500 uppercase bg-zinc-50/50 dark:bg-zinc-800/20 rounded-lg sticky top-0 backdrop-blur-md">
                    <tr>
                        <th className="px-4 py-3 rounded-l-lg">Politician</th>
                        <th className="px-4 py-3">Ticker</th>
                        <th className="px-4 py-3">Delay</th>
                        <th className="px-4 py-3 rounded-r-lg">Status</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                    {records.map((record) => (
                        <tr key={record.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors">
                            <td className="px-4 py-4 font-medium text-zinc-900 dark:text-zinc-200">{record.politicianName}</td>
                            <td className="px-4 py-4 text-zinc-500">{record.ticker}</td>
                            <td className="px-4 py-4 font-mono">
                                <span className={record.daysLate > 45 ? "text-rose-500 font-bold" : "text-zinc-500"}>
                                    {record.daysLate} days
                                </span>
                            </td>
                            <td className="px-4 py-4">
                                {record.status === 'on-time' && (
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                                        <CheckCircle size={12} /> On Time
                                    </span>
                                )}
                                {record.status === 'late' && (
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400">
                                        <Clock size={12} /> Late
                                    </span>
                                )}
                                {record.status === 'violation' && (
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400">
                                        <XCircle size={12} /> Violation
                                    </span>
                                )}
                            </td>
                        </tr>
                    ))}
                    {records.length === 0 && (
                        <tr>
                            <td colSpan={4} className="px-4 py-8 text-center text-zinc-500">
                                No delay violations found in recent records.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
      </div>
    );
  };

export interface BehaviorStats {
    winRate: number;
    winRateVsMarket: number;
    topSector: string;
    topSectorTradeCount: number;
    luckyTimingScore: number;
}

export const BehaviorTracker = ({ stats }: { stats?: BehaviorStats }) => {
    if (!stats) {
        return (
            <div className="bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800/50 rounded-3xl p-6 backdrop-blur-sm h-full flex flex-col justify-center items-center">
                <div className="animate-pulse bg-zinc-200 dark:bg-zinc-800 h-8 w-48 rounded mb-4" />
                <div className="animate-pulse bg-zinc-100 dark:bg-zinc-800/50 h-32 w-full rounded" />
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800/50 rounded-3xl p-6 backdrop-blur-sm h-full">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-purple-100 dark:bg-purple-500/10 text-purple-600 rounded-xl">
                    <TrendingUp size={20} />
                </div>
                <div>
                    <h3 className="font-bold text-zinc-900 dark:text-white">
                        Behavior Analysis
                    </h3>
                    <p className="text-xs text-zinc-500 font-medium uppercase tracking-wider">
                        Platform-Wide Pattern Recognition
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/30 border border-zinc-100 dark:border-zinc-800">
                    <div className="text-zinc-500 text-xs font-bold uppercase tracking-wider mb-2">Unusual Win Rate</div>
                    <div className="text-3xl font-black text-zinc-900 dark:text-white">{stats.winRate}%</div>
                    <div className={`${stats.winRateVsMarket >= 0 ? 'text-emerald-500' : 'text-rose-500'} text-xs font-medium mt-1 inline-flex items-center gap-1 flex-wrap`}>
                        {stats.winRateVsMarket >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />} 
                        {stats.winRateVsMarket >= 0 ? '+' : ''}{stats.winRateVsMarket}% vs Market
                    </div>
                </div>
                <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/30 border border-zinc-100 dark:border-zinc-800 flex flex-col justify-between">
                    <div className="text-zinc-500 text-xs font-bold uppercase tracking-wider mb-2">Sector Focus</div>
                    <div className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-white truncate" title={stats.topSector}>
                        {stats.topSector}
                    </div>
                    <div className="text-zinc-400 text-xs mt-1">
                        {stats.topSectorTradeCount} Recent Trades
                    </div>
                </div>
                <div className="col-span-2 p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/30 border border-zinc-100 dark:border-zinc-800">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-zinc-500 text-xs font-bold uppercase tracking-wider">Lucky Timing Score</span>
                        <div className="relative group flex items-center">
                            <button 
                                className="text-zinc-400 hover:text-cyan-500 cursor-help transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500 rounded"
                            >
                                <Info size={14} />
                            </button>
                            {/* Make it appear on hover or focus of the button */}
                            <div className="absolute bottom-full right-0 mb-2 w-64 p-3 bg-zinc-900 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-900 text-xs rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible focus-within:opacity-100 focus-within:visible transition-all shadow-xl z-50 pointer-events-none font-medium text-left">
                                This score evaluates the ratio of trades placed suspiciously close to market events or within conflicted sectors. A higher score indicates a higher frequency of suspiciously "lucky" timing across the platform.
                                <svg className="absolute text-zinc-900 dark:text-zinc-100 h-2 w-full left-0 top-full" x="0px" y="0px" viewBox="0 0 255 255"><polygon className="fill-current" points="0,0 127.5,127.5 255,0" /></svg>
                            </div>
                        </div>
                    </div>
                    <div className="w-full bg-zinc-200 dark:bg-zinc-700 h-2 rounded-full overflow-hidden">
                        <div 
                            className={`h-full ${stats.luckyTimingScore > 75 ? 'bg-rose-500' : stats.luckyTimingScore > 50 ? 'bg-amber-500' : 'bg-emerald-500'}`} 
                            style={{ width: `${stats.luckyTimingScore}%` }} 
                        />
                    </div>
                    <div className="flex justify-between mt-2 text-xs font-medium">
                        <span className="text-zinc-400">Average</span>
                        <span className={stats.luckyTimingScore > 75 ? 'text-rose-500' : stats.luckyTimingScore > 50 ? 'text-amber-500' : 'text-emerald-500'}>
                            {stats.luckyTimingScore > 75 ? 'Suspiciously High' : stats.luckyTimingScore > 50 ? 'Elevated' : 'Normal'} ({stats.luckyTimingScore}/100)
                        </span>
                    </div>
                </div>
            </div>
        </div>
    )
}

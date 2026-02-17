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

// --- Mock Data ---
const CONFLICTS: Conflict[] = [
  {
    id: "c1",
    politicianName: "Sen. Banking Member",
    committee: "Banking, Housing, and Urban Affairs",
    ticker: "JPM",
    sector: "Finance",
    date: "2 days ago",
    severity: "high",
  },
  {
    id: "c2",
    politicianName: "Rep. Armed Services",
    committee: "Armed Services",
    ticker: "RTX",
    sector: "Defense",
    date: "1 week ago",
    severity: "high",
  },
  {
    id: "c3",
    politicianName: "Sen. Energy Member",
    committee: "Energy and Natural Resources",
    ticker: "XOM",
    sector: "Energy",
    date: "3 weeks ago",
    severity: "medium",
  },
];

const SUSPICIOUS_TRADES: SuspiciousTrade[] = [
  {
    id: "s1",
    politicianName: "Nancy Pelosi",
    ticker: "NVDA",
    type: "Buy",
    date: "2024-01-10",
    event: "CHIPS Act Hearing",
    daysDiff: -3,
  },
  {
    id: "s2",
    politicianName: "Tommy Tuberville",
    ticker: "AG",
    type: "Sell",
    date: "2024-02-05",
    event: "Commodities Regulation Vote",
    daysDiff: 1,
  },
];

const COMPLIANCE_RECORDS: ComplianceRecord[] = [
  {
    id: "r1",
    politicianName: "Ro Khanna",
    ticker: "AAPL",
    tradeDate: "2024-01-15",
    reportDate: "2024-01-20",
    daysLate: 0,
    status: "on-time",
  },
  {
    id: "r2",
    politicianName: "Pat Fallon",
    ticker: "MSFT",
    tradeDate: "2023-12-01",
    reportDate: "2024-02-15",
    daysLate: 30,
    status: "late",
  },
  {
    id: "r3",
    politicianName: "Diana Harshbarger",
    ticker: "LLY",
    tradeDate: "2023-11-10",
    reportDate: "2024-03-01",
    daysLate: 65,
    status: "violation",
  },
];

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
export const ConflictScanner = () => {
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

      <div className="space-y-4">
        {CONFLICTS.map((conflict) => (
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
      </div>
    </div>
  );
};

// --- 3. Suspicious Timing Detector ---
export const TimingDetector = () => {
  return (
    <div className="bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800/50 rounded-3xl p-6 backdrop-blur-sm">
      <div className="flex items-center gap-3 mb-6">
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

      <div className="relative border-l-2 border-zinc-200 dark:border-zinc-800 ml-3 space-y-8 pl-8 py-2">
        {SUSPICIOUS_TRADES.map((trade) => (
          <div key={trade.id} className="relative">
            {/* Timeline Node */}
            <div className="absolute -left-[3.25rem] top-0 w-6 h-6 rounded-full bg-zinc-100 dark:bg-zinc-900 border-2 border-amber-500 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            </div>

            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/30 border border-zinc-100 dark:border-zinc-800">
                <div>
                     <div className="flex items-center gap-2 mb-2">
                        <span className="font-bold text-zinc-900 dark:text-white">{trade.politicianName}</span>
                        <span className={`text-xs font-bold px-2 py-0.5 rounded ${trade.type === 'Buy' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                            {trade.type} {trade.ticker}
                        </span>
                     </div>
                     <p className="text-sm text-zinc-600 dark:text-zinc-400">
                        Occurred <strong className="text-zinc-900 dark:text-zinc-200">{Math.abs(trade.daysDiff)} days {trade.daysDiff < 0 ? 'before' : 'after'}</strong>
                     </p>
                     <p className="text-sm font-medium text-amber-600 dark:text-amber-500 flex items-center gap-1 mt-1">
                        <AlertOctagon size={14} /> {trade.event}
                     </p>
                </div>
                <div className="text-right">
                    <span className="text-xs font-mono text-zinc-400 block">{trade.date}</span>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-300 dark:text-zinc-600">Flagged</span>
                </div>
            </div>
          </div>
        ))}
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

// --- 5. Repeated Behavior Tracker ---
export const BehaviorTracker = () => {
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
                        Pattern Recognition
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/30 border border-zinc-100 dark:border-zinc-800">
                    <div className="text-zinc-500 text-xs font-bold uppercase tracking-wider mb-2">Unusual Win Rate</div>
                    <div className="text-3xl font-black text-zinc-900 dark:text-white">78%</div>
                    <div className="text-emerald-500 text-xs font-medium mt-1 inline-flex items-center gap-1">
                        <TrendingUp size={12} /> +12% vs Market
                    </div>
                </div>
                <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/30 border border-zinc-100 dark:border-zinc-800">
                    <div className="text-zinc-500 text-xs font-bold uppercase tracking-wider mb-2">Sector Focus</div>
                    <div className="text-xl font-bold text-zinc-900 dark:text-white truncate">Technology</div>
                    <div className="text-zinc-400 text-xs mt-1">
                        45 Trades in 2024
                    </div>
                </div>
                <div className="col-span-2 p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/30 border border-zinc-100 dark:border-zinc-800">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-zinc-500 text-xs font-bold uppercase tracking-wider">Lucky Timing Score</span>
                        <Info size={14} className="text-zinc-400" />
                    </div>
                    <div className="w-full bg-zinc-200 dark:bg-zinc-700 h-2 rounded-full overflow-hidden">
                        <div className="bg-purple-500 h-full w-[85%]" />
                    </div>
                    <div className="flex justify-between mt-2 text-xs font-medium">
                        <span className="text-zinc-400">Average</span>
                        <span className="text-purple-500">Suspiciously High (85/100)</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

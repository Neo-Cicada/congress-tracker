"use client";

import React from "react";
import { TrendingUp, TrendingDown, Users } from "lucide-react";
import { fetchWithCache } from "../lib/apiCache";
import { getApiUrl } from "../lib/api";
import { useAuth } from "../context/AuthContext";

// --- PARTY PERFORMANCE CHART ---
export const PartyPerformanceChart = () => {
  const [data, setData] = React.useState<{ demReturn: number; repReturn: number } | null>(null);
  const [loading, setLoading] = React.useState(true);
  const { token } = useAuth();

  React.useEffect(() => {
    if (!token) { setLoading(false); return; }

    const fetchPartyPerformance = async () => {
      try {
        const result = await fetchWithCache(getApiUrl("leaderboard/party-performance"), {
          headers: { Authorization: `Bearer ${token}` }
        });
        setData(result);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchPartyPerformance();
  }, [token]);

  if (loading || !data) {
      return (
        <div className="bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 h-full animate-pulse">
          <div className="h-6 w-1/3 bg-zinc-200 dark:bg-zinc-800 rounded mb-8"></div>
          <div className="flex gap-4 h-48 items-end justify-center">
            <div className="w-1/3 h-32 bg-zinc-200 dark:bg-zinc-800 rounded-t-2xl"></div>
            <div className="w-1/3 h-24 bg-zinc-200 dark:bg-zinc-800 rounded-t-2xl"></div>
          </div>
        </div>
      );
  }

  // Calculate dynamic heights (max 100% of the container)
  const maxReturn = Math.max(Math.abs(data.demReturn), Math.abs(data.repReturn), 1); // Avoid division by zero
  const demHeightPct = Math.min((Math.abs(data.demReturn) / maxReturn) * 80, 100) + 20; // Ensure at least 20% height
  const repHeightPct = Math.min((Math.abs(data.repReturn) / maxReturn) * 80, 100) + 20;
  
  const isDemHigher = data.demReturn > data.repReturn;
  const outperformingParty = isDemHigher ? "Democrats" : "Republicans";
  const underperformingParty = isDemHigher ? "Republicans" : "Democrats";
  const diff = Math.abs(data.demReturn - data.repReturn).toFixed(1);

  return (
    <div className="bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 h-full flex flex-col justify-between group hover:border-cyan-500/30 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-cyan-500/5">
      <div>
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold text-zinc-900 dark:text-white flex items-center gap-2">
              <Users size={20} className="text-zinc-400 group-hover:text-cyan-500 transition-colors" />
              Party Alpha
            </h3>
            <span className="text-[10px] uppercase font-bold tracking-widest bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded text-zinc-500">
                YTD Returns
            </span>
          </div>

          <div className="flex gap-4 h-48 items-end justify-center">
            {/* DEMOCRAT BAR */}
            <div className="w-1/3 flex flex-col items-center group/bar cursor-default">
                <span className={`mb-2 font-bold ${data.demReturn >= 0 ? 'text-blue-500' : 'text-rose-500'} group-hover/bar:scale-110 transition-transform`}>
                    {data.demReturn >= 0 ? '+' : ''}{data.demReturn.toFixed(1)}%
                </span>
                <div className="w-full bg-blue-500/10 rounded-t-2xl relative overflow-hidden h-40 transition-all duration-500 group-hover/bar:bg-blue-500/20 border-t border-x border-blue-500/20">
                    <div 
                        className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-blue-600 to-blue-400 skew-y-6 transform origin-bottom-left transition-all duration-700 ease-out shadow-[0_0_15px_rgba(59,130,246,0.5)]" 
                        style={{ height: `${demHeightPct}%` }}
                    />
                </div>
                <span className="mt-3 font-bold text-zinc-900 dark:text-white text-sm">DEM</span>
            </div>

            {/* REPUBLICAN BAR */}
            <div className="w-1/3 flex flex-col items-center group/bar cursor-default">
                <span className={`mb-2 font-bold ${data.repReturn >= 0 ? 'text-red-500' : 'text-rose-500'} group-hover/bar:scale-110 transition-transform`}>
                    {data.repReturn >= 0 ? '+' : ''}{data.repReturn.toFixed(1)}%
                </span>
                <div className="w-full bg-red-500/10 rounded-t-2xl relative overflow-hidden h-40 transition-all duration-500 group-hover/bar:bg-red-500/20 border-t border-x border-red-500/20">
                    <div 
                        className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-red-600 to-red-400 -skew-y-6 transform origin-bottom-right transition-all duration-700 ease-out shadow-[0_0_15px_rgba(239,68,68,0.5)]" 
                        style={{ height: `${repHeightPct}%` }}
                    />
                </div>
                <span className="mt-3 font-bold text-zinc-900 dark:text-white text-sm">REP</span>
            </div>
          </div>
      </div>
      
      <p className="mt-6 text-center text-xs text-zinc-500 max-w-[220px] mx-auto italic">
        <span className="font-bold text-zinc-700 dark:text-zinc-300">{outperformingParty}</span> are currently outperforming {underperformingParty} by <span className="text-emerald-500 font-bold">{diff}%</span> on average.
      </p>
    </div>
  );
};

// --- POPULAR STOCKS LIST ---
interface PopularStock {
  ticker: string;
  name: string;
  count: number;
  sentiment: string;
  change: string;
}

export const PopularStocksList = () => {
    const [stocks, setStocks] = React.useState<PopularStock[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState("");

    React.useEffect(() => {
        const fetchPopularStocks = async () => {
            try {
                const data = await fetchWithCache(getApiUrl("trades/popular"));
                setStocks(data);
            } catch (err: any) {
                console.error(err);
                setError(err.message || "Failed to load crowded trades");
            } finally {
                setLoading(false);
            }
        };

        fetchPopularStocks();
    }, []);

    return (
        <div className="bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 h-full">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-zinc-900 dark:text-white">Crowded Trades</h3>
                <span className="text-xs text-zinc-500">Last 30 Days</span>
            </div>

            {loading ? (
                <div className="flex items-center justify-center h-48 animate-pulse text-zinc-500 text-sm">Loading...</div>
            ) : error ? (
                <div className="flex items-center justify-center h-48 text-rose-500 text-sm">{error}</div>
            ) : stocks.length === 0 ? (
                <div className="flex items-center justify-center h-48 text-zinc-500 text-sm">No crowded trades found in the last 30 days.</div>
            ) : (
                <div className="space-y-4">
                    {stocks.map((stock) => (
                    <div key={stock.ticker} className="flex items-center justify-between p-3 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 rounded-xl transition-colors cursor-pointer group">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center font-bold text-xs text-zinc-700 dark:text-zinc-300 group-hover:bg-cyan-500/10 group-hover:text-cyan-500 transition-colors">
                                {stock.ticker}
                            </div>
                            <div>
                                <div className="font-bold text-sm text-zinc-900 dark:text-zinc-100">{stock.name}</div>
                                <div className="text-[10px] text-zinc-500 uppercase tracking-wider">{stock.count} Members Trading</div>
                            </div>
                        </div>
                        <div className={`text-sm font-bold flex items-center gap-1 ${stock.change.startsWith('-') ? 'text-rose-500' : 'text-emerald-500'}`}>
                            {stock.change.startsWith('-') ? <TrendingDown size={14} /> : <TrendingUp size={14} />}
                            {stock.change}
                        </div>
                    </div>
                ))}
                </div>
            )}
        </div>
    );
}

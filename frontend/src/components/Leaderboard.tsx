import React from "react";
import Link from "next/link";
import { Crown, TrendingUp, User, ChevronRight } from "lucide-react";
import { fetchWithCache } from "../lib/apiCache";

interface LeaderboardEntry {
  rank: number;
  name: string;
  party: "D" | "R";
  returns: number;
  topHolding: string;
  id?: string;
}

const LEADERS: LeaderboardEntry[] = [
  {
    rank: 1,
    name: "Nancy Pelosi",
    party: "D",
    returns: 65.4,
    topHolding: "NVDA",
  },
  { rank: 2, name: "Mark Green", party: "R", returns: 52.1, topHolding: "NRT" },
  {
    rank: 3,
    name: "Josh Gottheimer",
    party: "D",
    returns: 48.9,
    topHolding: "MSFT",
  },
  {
    rank: 4,
    name: "Michael McCaul",
    party: "R",
    returns: 44.2,
    topHolding: "META",
  },
  { rank: 5, name: "Bill Hagerty", party: "R", returns: 41.8, topHolding: "V" },
  { rank: 6, name: "Ro Khanna", party: "D", returns: 39.5, topHolding: "AAPL" },
  {
    rank: 7,
    name: "Tommy Tuberville",
    party: "R",
    returns: 37.1,
    topHolding: "XOM",
  },
  {
    rank: 8,
    name: "Dan Meuser",
    party: "R",
    returns: 35.6,
    topHolding: "AMZN",
  },
  {
    rank: 9,
    name: "Kathy Manning",
    party: "D",
    returns: 33.9,
    topHolding: "GOOGL",
  },
  {
    rank: 10,
    name: "Rick Scott",
    party: "R",
    returns: 31.2,
    topHolding: "WMT",
  },
];

const Leaderboard = () => {
  const [leaders, setLeaders] = React.useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const data = await fetchWithCache("http://localhost:4000/api/leaderboard");
        
        const mapped: LeaderboardEntry[] = data.map((p: any, index: number) => ({
          rank: index + 1,
          name: p.name,
          party: p.party || "I",
          returns: p.stats?.ytdReturn || 0,
          topHolding: p.stats?.topHolding || "N/A",
          id: p._id // Verify if we need ID for linking
        }));
        setLeaders(mapped);
      } catch (error) {
        console.error(error);
        // Fallback or empty state could be handled here
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  if (loading) {
     return (
        <div className="group bg-white dark:bg-zinc-900/20 border border-zinc-200 dark:border-zinc-800/50 rounded-[2rem] p-8 h-fit animate-pulse">
            <div className="h-8 bg-zinc-200 dark:bg-zinc-800 rounded w-1/3 mb-4"></div>
            <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-16 bg-zinc-200 dark:bg-zinc-800 rounded-2xl"></div>
                ))}
            </div>
        </div>
     );
  }

  return (
    /* MATCHING THE TRADECARD CONTAINER STYLE */
    <div className="group bg-white dark:bg-zinc-900/20 border border-zinc-200 dark:border-zinc-800/50 hover:border-cyan-500/30 rounded-[2rem] p-8 backdrop-blur-xl transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-cyan-500/5 h-fit">
      {/* HEADER SECTION */}
      <div className="flex items-center justify-between mb-10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="p-1.5 bg-yellow-500/10 rounded-lg">
              <Crown className="text-yellow-500" size={18} />
            </div>
            <h2 className="text-xl font-bold text-zinc-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-300 transition-colors">
              Whale Alpha
            </h2>
          </div>
          <p className="text-[10px] text-zinc-400 dark:text-zinc-500 font-bold uppercase tracking-widest">
            Institutional Leaderboard
          </p>
        </div>
        <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
      </div>

      {/* LEADERS LIST */}
      <div className="space-y-8">
        {leaders.map((leader) => (
          <Link
            href={`/politician/${leader.id || leader.rank}`} // Use ID if available
            key={leader.rank}
            className="relative flex items-center justify-between group/row cursor-pointer hover:bg-zinc-50 dark:hover:bg-white/5 p-4 rounded-2xl transition-all"
          >
            <div className="flex items-center gap-4">
              {/* RANK INDICATOR */}
              <span className="text-xs font-black text-zinc-400 dark:text-zinc-600 font-mono italic w-4">
                {leader.rank < 10 ? `0${leader.rank}` : leader.rank}
              </span>

              {/* PROFILE AVATAR WITH PARTY INDICATOR */}
              <div className="relative">
                <div className="w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-zinc-800/50 flex items-center justify-center border border-zinc-200 dark:border-zinc-800 group-hover/row:border-cyan-500/50 transition-all shadow-inner">
                  <User
                    size={20}
                    className="text-zinc-400 dark:text-zinc-600"
                  />
                </div>
                <div
                  className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-lg border-2 border-white dark:border-[#050505] flex items-center justify-center text-[9px] font-black text-white ${
                    leader.party === "D"
                      ? "bg-blue-500 shadow-blue-500/20"
                      : leader.party === "R"
                      ? "bg-red-500 shadow-red-500/20"
                      : "bg-purple-500 shadow-purple-500/20"
                  } shadow-lg`}
                >
                  {leader.party}
                </div>
              </div>

              <div>
                <p className="font-bold text-zinc-800 dark:text-zinc-100 text-sm">
                  {leader.name}
                </p>
                <p className="text-[10px] text-zinc-400 dark:text-zinc-500 uppercase font-bold tracking-tighter italic">
                  Top: {leader.topHolding}
                </p>
              </div>
            </div>

            {/* PERFORMANCE METRICS */}
            <div className="text-right">
              <div className={`flex items-center justify-end gap-1 ${leader.returns >= 0 ? 'text-emerald-500 dark:text-emerald-400' : 'text-rose-500 dark:text-rose-400'} font-mono font-black text-lg italic tracking-tighter`}>
                <TrendingUp size={16} className={leader.returns < 0 ? 'rotate-180' : ''} />
                {leader.returns >= 0 ? '+' : ''}{leader.returns}%
              </div>

              {/* MATCHING THE RELIABILITY BAR FROM TRADECARD */}
              <div className="w-20 h-1 bg-zinc-100 dark:bg-zinc-800 rounded-full mt-2 ml-auto overflow-hidden">
                <div
                  className={`h-full ${leader.returns >= 0 ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]' : 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.4)]'} transition-all duration-1000`}
                  style={{ width: `${Math.min(Math.abs(leader.returns), 100)}%` }}
                />
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* FOOTER CTA */}
      <div className="mt-10 pt-6 border-t border-zinc-100 dark:border-zinc-800/50 flex items-center justify-center">
        <button className="flex items-center gap-1 text-[10px] font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-widest hover:gap-2 transition-all">
          View All Whales <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
};
export { Leaderboard };

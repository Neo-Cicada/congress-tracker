import React from "react";
import { Crown, TrendingUp, User, ChevronRight } from "lucide-react";

interface LeaderboardEntry {
  rank: number;
  name: string;
  party: "D" | "R";
  returns: number;
  topHolding: string;
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

export const Leaderboard = () => {
  return (
    /* MATCHING THE TRADECARD CONTAINER STYLE */
    <div className="group bg-white dark:bg-zinc-900/20 border border-zinc-200 dark:border-zinc-800/50 hover:border-cyan-500/30 rounded-[2rem] p-8 backdrop-blur-xl transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-cyan-500/5 h-full">
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
        {LEADERS.map((leader) => (
          <div
            key={leader.rank}
            className="relative flex items-center justify-between group/row cursor-pointer"
          >
            <div className="flex items-center gap-4">
              {/* RANK INDICATOR */}
              <span className="text-xs font-black text-zinc-400 dark:text-zinc-600 font-mono italic w-4">
                0{leader.rank}
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
                      : "bg-red-500 shadow-red-500/20"
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
              <div className="flex items-center justify-end gap-1 text-emerald-500 dark:text-emerald-400 font-mono font-black text-lg italic tracking-tighter">
                <TrendingUp size={16} />+{leader.returns}%
              </div>

              {/* MATCHING THE RELIABILITY BAR FROM TRADECARD */}
              <div className="w-20 h-1 bg-zinc-100 dark:bg-zinc-800 rounded-full mt-2 ml-auto overflow-hidden">
                <div
                  className="h-full bg-emerald-500 transition-all duration-1000 shadow-[0_0_8px_rgba(16,185,129,0.4)]"
                  style={{ width: `${(leader.returns / 70) * 100}%` }}
                />
              </div>
            </div>
          </div>
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

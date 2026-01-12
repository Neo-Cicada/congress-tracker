"use client";

import React from "react";
import { User, ShieldCheck, Activity, Users } from "lucide-react";

interface Props {
  name: string;
  party: "D" | "R";
  chamber: "House" | "Senate";
  state: string;
  photoUrl?: string; // Optional for now
}

export const PoliticianHeader: React.FC<Props> = ({
  name,
  party,
  chamber,
  state,
}) => {
  return (
    <div className="relative mb-8">
      {/* BACKGROUND BLUR */}
      <div
        className={`absolute inset-0 blur-[100px] opacity-20 pointer-events-none rounded-full ${
          party === "D" ? "bg-blue-600" : "bg-red-600"
        }`}
      />

      <div className="relative flex flex-col md:flex-row items-center md:items-start gap-8 bg-white/50 dark:bg-zinc-900/30 border border-zinc-200 dark:border-zinc-800/50 p-8 rounded-[3rem] backdrop-blur-md">
        {/* AVATAR */}
        <div className="relative group">
          <div className="w-32 h-32 rounded-3xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center shadow-lg border-4 border-white dark:border-zinc-900">
            <User size={64} className="text-zinc-300 dark:text-zinc-600" />
          </div>
          <div
            className={`absolute -bottom-3 -right-3 w-10 h-10 rounded-xl border-4 border-white dark:border-zinc-900 flex items-center justify-center text-lg font-black text-white shadow-lg ${
              party === "D" ? "bg-blue-500" : "bg-red-500"
            }`}
          >
            {party}
          </div>
        </div>

        {/* INFO */}
        <div className="text-center md:text-left flex-1">
          <div className="flex flex-col md:flex-row md:items-center gap-3 mb-2">
            <h1 className="text-4xl font-black text-zinc-900 dark:text-white tracking-tighter">
              {name}
            </h1>
            <div className="flex items-center justify-center md:justify-start gap-2">
                <span className="px-3 py-1 bg-zinc-100 dark:bg-zinc-800 rounded-full text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                    {chamber}
                </span>
                <span className="px-3 py-1 bg-zinc-100 dark:bg-zinc-800 rounded-full text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                    {state}
                </span>
            </div>
          </div>
          
          <p className="text-zinc-500 max-w-lg mx-auto md:mx-0 text-sm font-medium">
            Serves in the United States {chamber}. Tracks legislative activity
            correlated with market positions.
          </p>

          {/* QUICK STATS ROW */}
          <div className="flex items-center justify-center md:justify-start gap-8 mt-6">
            <div className="text-center md:text-left">
              <div className="flex items-center gap-1 text-[10px] text-zinc-400 font-bold uppercase tracking-widest mb-1">
                <Activity size={12} /> Win Rate
              </div>
              <p className="text-2xl font-mono font-black text-emerald-500">68%</p>
            </div>
            <div className="w-px h-8 bg-zinc-200 dark:bg-zinc-800" />
            <div className="text-center md:text-left">
              <div className="flex items-center gap-1 text-[10px] text-zinc-400 font-bold uppercase tracking-widest mb-1">
                <ShieldCheck size={12} /> Reliability
              </div>
              <p className="text-2xl font-mono font-black text-cyan-500">92/100</p>
            </div>
            <div className="w-px h-8 bg-zinc-200 dark:bg-zinc-800" />
             <div className="text-center md:text-left">
              <div className="flex items-center gap-1 text-[10px] text-zinc-400 font-bold uppercase tracking-widest mb-1">
                <Users size={12} /> Committees
              </div>
              <p className="text-2xl font-mono font-black text-zinc-700 dark:text-zinc-200">4</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

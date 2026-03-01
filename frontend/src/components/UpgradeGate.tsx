"use client";

import React from "react";
import { useAuth } from "../context/AuthContext";
import { Lock, Sparkles } from "lucide-react";
import Link from "next/link";

interface UpgradeGateProps {
  children: React.ReactNode;
  featureName?: string;
}

/**
 * Wraps premium content. For free users, renders static placeholder
 * blocks instead of real content — nothing real is in the DOM.
 */
export default function UpgradeGate({ children, featureName = "this feature" }: UpgradeGateProps) {
  const { isPremium, user } = useAuth();

  if (isPremium) {
    return <>{children}</>;
  }

  // Free users: render FAKE placeholder content + overlay (no real data in DOM)
  return (
    <div className="relative min-h-[500px]">
      {/* Static placeholder blocks — no real data */}
      <div className="pointer-events-none select-none filter blur-sm opacity-30">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="col-span-1 md:col-span-4 h-64 rounded-[2rem] bg-zinc-200 dark:bg-zinc-800/50" />
          <div className="col-span-1 md:col-span-8 h-64 rounded-[2rem] bg-zinc-200 dark:bg-zinc-800/50" />
          <div className="col-span-1 md:col-span-6 h-80 rounded-3xl bg-zinc-200 dark:bg-zinc-800/50" />
          <div className="col-span-1 md:col-span-6 h-80 rounded-3xl bg-zinc-200 dark:bg-zinc-800/50" />
          <div className="col-span-1 md:col-span-12 h-48 rounded-3xl bg-zinc-200 dark:bg-zinc-800/50" />
        </div>
      </div>

      {/* Upgrade overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-start pt-12 bg-zinc-50/80 dark:bg-zinc-950/80 backdrop-blur-sm rounded-2xl z-10">
        <div className="flex flex-col items-center text-center max-w-md px-6">
          <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-cyan-500/20">
            <Lock size={28} className="text-white" />
          </div>
          
          <h3 className="text-2xl font-bold mb-2 text-zinc-900 dark:text-zinc-100">
            Unlock {featureName}
          </h3>
          <p className="text-zinc-500 dark:text-zinc-400 mb-6 text-sm">
            Upgrade to a Pro plan to access {featureName}, real-time alerts, and all premium analytics.
          </p>

          <Link
            href="/pricing"
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-bold rounded-xl hover:scale-105 active:scale-95 transition-all shadow-lg shadow-cyan-500/25"
          >
            <Sparkles size={18} />
            {user ? "Upgrade Now" : "Get Started"}
          </Link>
        </div>
      </div>
    </div>
  );
}

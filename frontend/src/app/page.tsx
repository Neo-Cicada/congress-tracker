"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import { ShieldCheck, TrendingUp, Activity, Lock, ArrowRight } from "lucide-react";

export default function LandingPage() {
  const { user } = useAuth();
  const router = useRouter();

  // If user is already logged in, redirect them to dashboard
  useEffect(() => {
    if (user) {
      router.push("/dashboard");
    }
  }, [user, router]);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-[#050505] text-zinc-900 dark:text-zinc-200 overflow-hidden relative">
      {/* Background gradients */}
      <div className="absolute top-0 left-1/4 w-[50rem] h-[50rem] bg-cyan-600/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[50rem] h-[50rem] bg-purple-600/10 blur-[150px] rounded-full pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 pt-8 pb-24 relative z-10 flex flex-col min-h-screen">
        {/* Navigation */}
        <nav className="flex justify-between items-center py-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-zinc-900 dark:bg-white rounded-xl flex items-center justify-center shadow-xl">
              <span className="text-white dark:text-zinc-900 font-bold text-xl leading-none">N</span>
            </div>
            <span className="text-xl font-bold tracking-tight">Nexus Alpha</span>
          </div>
          
          <div className="flex items-center gap-4">
            <Link 
              href="/login" 
              className="px-5 py-2.5 text-sm font-medium hover:text-cyan-500 transition-colors"
            >
              Sign In
            </Link>
            <Link 
              href="/signup" 
              className="px-5 py-2.5 bg-zinc-900 dark:bg-white text-zinc-50 dark:text-zinc-900 text-sm font-bold rounded-full hover:scale-105 transition-all shadow-lg hover:shadow-cyan-500/25"
            >
              Get Started
            </Link>
          </div>
        </nav>

        {/* Hero Section */}
        <main className="flex-1 flex flex-col items-center justify-center text-center mt-12 md:mt-24">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 text-sm font-medium mb-8 border border-cyan-500/20">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </span>
            Live Institutional Tracker
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight max-w-4xl mb-8 leading-tight">
            Track Congressional Trading & <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-purple-500">Institutional Alpha</span>
          </h1>
          
          <p className="text-lg md:text-xl text-zinc-500 dark:text-zinc-400 max-w-2xl mb-12">
            Gain an edge by analyzing real-time financial disclosures from US politicians and powerful institutions. Discover crowded trades, flag suspicious timing, and see the data they don't want you to see.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Link 
              href="/signup" 
              className="flex items-center gap-2 px-8 py-4 bg-zinc-900 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-900 font-bold rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl hover:shadow-cyan-500/25 text-lg"
            >
              Start Tracking Now <ArrowRight size={20} />
            </Link>
            <Link 
              href="/login" 
              className="flex items-center gap-2 px-8 py-4 bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 font-bold rounded-2xl hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-all text-lg"
            >
              Login to Protocol
            </Link>
          </div>
        </main>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-32">
          <div className="p-8 rounded-[2rem] bg-white/50 dark:bg-zinc-900/20 border border-zinc-200 dark:border-zinc-800/50 backdrop-blur-xl">
            <div className="w-12 h-12 bg-green-500/10 rounded-2xl flex items-center justify-center text-green-500 mb-6">
              <TrendingUp size={24} />
            </div>
            <h3 className="text-xl font-bold mb-3">Live Trade Feed</h3>
            <p className="text-zinc-500 dark:text-zinc-400">Monitor continuous incoming disclosures from the Senate and House of Representatives as soon as they are filed.</p>
          </div>
          
          <div className="p-8 rounded-[2rem] bg-white/50 dark:bg-zinc-900/20 border border-zinc-200 dark:border-zinc-800/50 backdrop-blur-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 text-zinc-900/5 dark:text-white/5">
              <Lock size={120} className="transform rotate-12" />
            </div>
            <div className="w-12 h-12 bg-purple-500/10 rounded-2xl flex items-center justify-center text-purple-500 mb-6 relative z-10">
              <ShieldCheck size={24} />
            </div>
            <h3 className="text-xl font-bold mb-3 relative z-10">Suspicious Timing</h3>
            <p className="text-zinc-500 dark:text-zinc-400 relative z-10">Advanced algorithms flag trades executed dangerously close to major market catalysts or confidential briefings.</p>
          </div>
          
          <div className="p-8 rounded-[2rem] bg-white/50 dark:bg-zinc-900/20 border border-zinc-200 dark:border-zinc-800/50 backdrop-blur-xl">
            <div className="w-12 h-12 bg-cyan-500/10 rounded-2xl flex items-center justify-center text-cyan-500 mb-6">
              <Activity size={24} />
            </div>
            <h3 className="text-xl font-bold mb-3">Whale Leaderboard</h3>
            <p className="text-zinc-500 dark:text-zinc-400">See the most profitable politicians and the most actively traded assets aggregated across the entire government.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

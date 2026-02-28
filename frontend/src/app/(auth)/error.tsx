"use client";

import { useEffect } from "react";
import Link from "next/link";
import { TrendingUp, ArrowLeft, RefreshCw, AlertTriangle } from "lucide-react";

export default function AuthError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Auth error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-[#050505] text-zinc-900 dark:text-zinc-200 overflow-hidden relative flex items-center justify-center">
      {/* Background gradients */}
      <div className="absolute top-1/4 left-1/3 w-[40rem] h-[40rem] bg-red-600/8 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/3 w-[40rem] h-[40rem] bg-orange-600/8 blur-[150px] rounded-full pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-lg">
        {/* Logo */}
        <Link href="/" className="group mb-12">
          <div className="w-14 h-14 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:scale-110 transition-transform duration-300">
            <TrendingUp size={28} className="text-white" />
          </div>
        </Link>

        {/* Icon */}
        <div className="w-20 h-20 bg-red-500/10 border border-red-500/20 rounded-3xl flex items-center justify-center mb-8">
          <AlertTriangle size={36} className="text-red-500" />
        </div>

        {/* Error heading */}
        <h1 className="text-4xl font-extrabold tracking-tight mb-4">
          Something Went Wrong
        </h1>

        {/* Message */}
        <p className="text-zinc-500 dark:text-zinc-400 mb-10 leading-relaxed">
          An error occurred while loading this page. Please try again or head back to the home page.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <button
            onClick={reset}
            className="flex items-center gap-2 px-7 py-3.5 bg-zinc-900 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-900 font-bold rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl hover:shadow-red-500/25 cursor-pointer"
          >
            <RefreshCw size={18} />
            Try Again
          </button>
          <Link
            href="/"
            className="flex items-center gap-2 px-7 py-3.5 bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 font-bold rounded-2xl hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-all"
          >
            <ArrowLeft size={18} />
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}

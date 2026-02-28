"use client";

import Link from "next/link";
import { TrendingUp, ArrowLeft, SearchX } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-[#050505] text-zinc-900 dark:text-zinc-200 overflow-hidden relative flex items-center justify-center">
      {/* Background gradients */}
      <div className="absolute top-1/4 left-1/3 w-[40rem] h-[40rem] bg-cyan-600/8 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/3 w-[40rem] h-[40rem] bg-purple-600/8 blur-[150px] rounded-full pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-lg">
        {/* Logo */}
        <Link href="/" className="group mb-12">
          <div className="w-14 h-14 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:scale-110 transition-transform duration-300">
            <TrendingUp size={28} className="text-white" />
          </div>
        </Link>

        {/* Icon */}
        <div className="w-20 h-20 bg-zinc-100 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 rounded-3xl flex items-center justify-center mb-8">
          <SearchX size={36} className="text-zinc-400 dark:text-zinc-600" />
        </div>

        {/* Error Code */}
        <h1 className="text-8xl font-extrabold tracking-tighter mb-2">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-purple-500">
            404
          </span>
        </h1>

        {/* Message */}
        <h2 className="text-2xl font-bold mb-4">Page Not Found</h2>
        <p className="text-zinc-500 dark:text-zinc-400 mb-10 leading-relaxed">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
          It might have been classified.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 px-7 py-3.5 bg-zinc-900 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-900 font-bold rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl hover:shadow-cyan-500/25"
          >
            <ArrowLeft size={18} />
            Back to Dashboard
          </Link>
          <Link
            href="/"
            className="flex items-center gap-2 px-7 py-3.5 bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 font-bold rounded-2xl hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-all"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}

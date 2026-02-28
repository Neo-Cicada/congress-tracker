"use client";

import { useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, RefreshCw, AlertTriangle } from "lucide-react";

export default function MainError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="flex-1 flex items-center justify-center min-h-[60vh] px-6">
      <div className="flex flex-col items-center text-center max-w-md">
        {/* Icon */}
        <div className="w-20 h-20 bg-red-500/10 border border-red-500/20 rounded-3xl flex items-center justify-center mb-8">
          <AlertTriangle size={36} className="text-red-500" />
        </div>

        {/* Error heading */}
        <h1 className="text-4xl font-extrabold tracking-tight mb-2">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">
            Oops!
          </span>
        </h1>

        <h2 className="text-xl font-bold mb-4 text-zinc-900 dark:text-zinc-100">
          Something Went Wrong
        </h2>

        {/* Message */}
        <p className="text-zinc-500 dark:text-zinc-400 mb-10 leading-relaxed">
          An unexpected error occurred while loading this page. Our team has been notified and is looking into it.
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
            href="/dashboard"
            className="flex items-center gap-2 px-7 py-3.5 bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 font-bold rounded-2xl hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-all"
          >
            <ArrowLeft size={18} />
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}

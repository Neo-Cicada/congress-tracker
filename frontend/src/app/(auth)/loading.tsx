import { TrendingUp } from "lucide-react";

export default function AuthLoading() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-[#050505] flex items-center justify-center">
      {/* Background gradients */}
      <div className="absolute top-1/4 left-1/3 w-[40rem] h-[40rem] bg-cyan-600/8 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/3 w-[40rem] h-[40rem] bg-purple-600/8 blur-[150px] rounded-full pointer-events-none" />

      <div className="flex flex-col items-center gap-6 relative z-10">
        {/* Logo with pulse */}
        <div className="w-14 h-14 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-cyan-500/20 animate-pulse">
          <TrendingUp size={28} className="text-white" />
        </div>

        {/* Skeleton form card */}
        <div className="w-[400px] max-w-[90vw] animate-pulse space-y-6">
          <div className="h-8 w-48 bg-zinc-200 dark:bg-zinc-800 rounded-lg mx-auto" />
          <div className="space-y-4">
            <div className="h-12 bg-zinc-100 dark:bg-zinc-900/60 rounded-xl border border-zinc-200 dark:border-zinc-800" />
            <div className="h-12 bg-zinc-100 dark:bg-zinc-900/60 rounded-xl border border-zinc-200 dark:border-zinc-800" />
            <div className="h-12 bg-zinc-200 dark:bg-zinc-800 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}

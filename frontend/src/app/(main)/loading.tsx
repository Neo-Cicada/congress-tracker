export default function MainLoading() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-[#050505] text-zinc-900 dark:text-zinc-200 font-sans p-6 lg:p-12 animate-pulse">
      {/* Header skeleton */}
      <div className="mb-12">
        <div className="h-8 w-64 bg-zinc-200 dark:bg-zinc-800 rounded-lg mb-3" />
        <div className="h-4 w-48 bg-zinc-200 dark:bg-zinc-800/60 rounded" />
      </div>

      {/* Content grid skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left column */}
        <div className="col-span-1 md:col-span-4 space-y-6">
          <div className="h-64 rounded-[2rem] bg-zinc-100 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800/50" />
          <div className="h-48 rounded-[2rem] bg-zinc-100 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800/50" />
        </div>

        {/* Right column - card grid */}
        <div className="col-span-1 md:col-span-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="h-52 rounded-[2rem] bg-zinc-100 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800/50"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

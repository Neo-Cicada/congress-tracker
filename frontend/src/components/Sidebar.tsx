"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import {
  TrendingUp,
  Activity,
  ShieldCheck,
  LayoutGrid,
  Sun,
  Moon,
} from "lucide-react";

export const Sidebar = () => {
  const { setTheme, resolvedTheme } = useTheme();
  const pathname = usePathname();

  // Helper to check if a link is active
  const isActive = (path: string) => pathname === path;

  // Toggle theme handler
  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  return (
    <aside className="fixed left-0 top-0 h-full w-20 border-r border-zinc-200 dark:border-zinc-800 bg-white/40 dark:bg-black/60 backdrop-blur-xl hidden lg:flex flex-col items-center py-8 z-50">
      {/* Logo */}
      <div className="group cursor-pointer mb-12">
        <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:scale-110 transition-transform duration-300">
          <TrendingUp size={24} className="text-white" />
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-10 flex-1">
        <SidebarIcon
          icon={<Activity size={22} />}
          label="Live Feed"
          active={true} // Hardcoded for now, or use isActive('/')
        />
        <SidebarIcon icon={<ShieldCheck size={22} />} label="Ethics Monitor" />
        <SidebarIcon icon={<LayoutGrid size={22} />} label="Leaderboard" />
      </nav>

      {/* Bottom Actions */}
      <div className="flex flex-col gap-6 mt-auto">
        <button
          onClick={toggleTheme}
          className="p-3 rounded-2xl bg-zinc-100 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-cyan-500 hover:border-cyan-500/30 transition-all duration-300"
        >
          {resolvedTheme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        <div className="w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center cursor-pointer hover:border-cyan-500/30 transition-all group">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-500 to-pink-500 opacity-80 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>
    </aside>
  );
};

// Sub-component for individual icons to keep code clean
const SidebarIcon = ({
  icon,
  label,
  active = false,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}) => (
  <div className="group relative cursor-pointer">
    <div
      className={`${
        active ? "text-cyan-500" : "text-zinc-400 dark:text-zinc-600"
      } group-hover:text-cyan-500 transition-colors`}
    >
      {icon}
    </div>
    {active && (
      <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-1 h-6 bg-cyan-500 rounded-r-full shadow-[0_0_10px_rgba(6,182,212,0.5)]" />
    )}
    <span className="absolute left-14 top-1/2 -translate-y-1/2 px-2 py-1 bg-zinc-900 text-white text-[10px] font-bold rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap uppercase tracking-widest border border-zinc-800 z-50">
      {label}
    </span>
  </div>
);

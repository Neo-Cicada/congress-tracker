"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { useAuth } from "../context/AuthContext";
import {
  TrendingUp,
  Activity,
  ShieldCheck,
  LayoutGrid,
  Sun,
  Moon,
  User,
  LogOut,
} from "lucide-react";

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const { setTheme, resolvedTheme } = useTheme();
  const { logout } = useAuth();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Helper to check if a link is active
  const isActive = (path: string) => pathname === path;

  // Toggle theme handler
  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  // Reusable Sidebar Content
  const SidebarContent = () => (
    <div className="flex flex-col h-full items-center py-8">
      {/* Logo */}
      <Link href="/">
        <div className="group cursor-pointer mb-12">
          <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:scale-110 transition-transform duration-300">
            <TrendingUp size={24} className="text-white" />
          </div>
        </div>
      </Link>

      {/* Navigation */}
      <nav className="flex flex-col gap-10 flex-1 w-full px-6 lg:px-0 items-center">
        <SidebarIcon
          icon={<Activity size={22} />}
          label="Live Feed"
          href="/dashboard"
          active={isActive("/dashboard")}
        />
        <SidebarIcon
          icon={<ShieldCheck size={22} />}
          label="Ethics Monitor"
          href="/ethics"
          active={isActive("/ethics")}
        />
        <SidebarIcon
          icon={<LayoutGrid size={22} />}
          label="Leaderboard"
          href="/leaderboard"
          active={isActive("/leaderboard")} 
        />
        <SidebarIcon
          icon={<User size={22} />}
          label="Profile"
          href="/profile"
          active={isActive("/profile")} 
        />
      </nav>

      {/* Bottom Actions */}
      <div className="flex flex-col gap-6 mt-auto">
        <button
          onClick={logout}
          className="p-3 rounded-2xl bg-zinc-100 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-300 group relative"
        >
          <LogOut size={20} />
          <span className="hidden lg:block absolute left-14 top-1/2 -translate-y-1/2 px-2 py-1 bg-zinc-900 text-white text-[10px] font-bold rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap uppercase tracking-widest border border-zinc-800 z-50">
            Logout
          </span>
        </button>

        <button
          onClick={toggleTheme}
          className="p-3 rounded-2xl bg-zinc-100 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-cyan-500 hover:border-cyan-500/30 transition-all duration-300"
        >
          {mounted ? (
            resolvedTheme === "dark" ? <Sun size={20} /> : <Moon size={20} />
          ) : (
             <div className="w-5 h-5" /> // Placeholder to prevent layout shift
          )}
        </button>


      </div>
    </div>
  );

  return (
    <>
      {/* DESKTOP SIDEBAR */}
      <aside className="fixed left-0 top-0 h-full w-20 border-r border-zinc-200 dark:border-zinc-800 bg-white/40 dark:bg-black/60 backdrop-blur-xl hidden lg:flex flex-col items-center z-50">
        <SidebarContent />
      </aside>
    </>
  );
};

// Sub-component for individual icons to keep code clean
const SidebarIcon = ({
  icon,
  label,
  href,
  active = false,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  href?: string;
  active?: boolean;
  onClick?: () => void;
}) => {
  const content = (
    <div className="group relative cursor-pointer flex items-center lg:block">
      <div
        className={`${
          active ? "text-cyan-500" : "text-zinc-400 dark:text-zinc-600"
        } group-hover:text-cyan-500 transition-colors mr-4 lg:mr-0`}
      >
        {icon}
      </div>

      {/* Active Indicator (Desktop) */}
      {active && (
        <div className="hidden lg:block absolute -left-4 top-1/2 -translate-y-1/2 w-1 h-6 bg-cyan-500 rounded-r-full shadow-[0_0_10px_rgba(6,182,212,0.5)]" />
      )}

      {/* Active Indicator (Mobile) */}
      {active && (
        <div className="lg:hidden w-1.5 h-1.5 rounded-full bg-cyan-500 mr-2" />
      )}

      {/* Label (Desktop - Hover Tooltip) */}
      <span className="hidden lg:block absolute left-14 top-1/2 -translate-y-1/2 px-2 py-1 bg-zinc-900 text-white text-[10px] font-bold rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap uppercase tracking-widest border border-zinc-800 z-50">
        {label}
      </span>

      {/* Label (Mobile - Inline) */}
      <span
        className={`lg:hidden text-lg font-bold uppercase tracking-widest ${
          active ? "text-zinc-900 dark:text-white" : "text-zinc-400"
        }`}
      >
        {label}
      </span>
    </div>
  );

  return href ? (
    <Link href={href} onClick={onClick}>
      {content}
    </Link>
  ) : (
    <div onClick={onClick}>{content}</div>
  );
};

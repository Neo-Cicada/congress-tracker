"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import {
  Activity,
  ShieldCheck,
  LayoutGrid,
  Sun,
  Moon,
  User,
} from "lucide-react";

export const MobileNavbar = () => {
  const { setTheme, resolvedTheme } = useTheme();
  const pathname = usePathname();
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

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-20 bg-white/80 dark:bg-[#050505]/80 backdrop-blur-xl border-t border-zinc-200 dark:border-zinc-800 lg:hidden z-50 px-6 flex items-center justify-between pb-2">
      <Link href="/">
        <MobileNavIcon
          icon={<Activity size={24} />}
          label="Feed"
          active={isActive("/")} 
        />
      </Link>
      <Link href="/ethics">
        <MobileNavIcon
          icon={<ShieldCheck size={24} />}
          label="Ethics"
          active={isActive("/ethics")}
        />
      </Link>
      
      {/* Theme Toggle in center for easy access */}
      <button
        onClick={toggleTheme}
        className="relative -top-4 w-14 h-14 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/30 border-4 border-white dark:border-[#050505]"
      >
        {mounted ? (
           resolvedTheme === "dark" ? (
            <Sun size={24} className="text-white" />
          ) : (
            <Moon size={24} className="text-white" />
          )
        ) : (
           <div className="w-6 h-6" /> // Placeholder
        )}
      </button>

      <Link href="/leaderboard">
        <MobileNavIcon
          icon={<LayoutGrid size={24} />}
          label="Leaders"
          active={isActive("/leaderboard")}
        />
      </Link>
      <Link href="/profile">
        <MobileNavIcon
          icon={<User size={24} />}
          label="Profile"
          active={isActive("/profile")}
        />
      </Link>

    </nav>
  );
};

// Sub-component for individual icons
const MobileNavIcon = ({
  icon,
  label,
  active = false,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}) => (
  <div className="flex flex-col items-center gap-1 cursor-pointer group">
    <div
      className={`${
        active ? "text-cyan-600 dark:text-cyan-400" : "text-zinc-400 dark:text-zinc-500"
      } group-hover:text-cyan-500 transition-colors`}
    >
      {icon}
    </div>
    <span className={`text-[10px] font-bold uppercase tracking-widest ${
        active ? "text-cyan-600 dark:text-cyan-400" : "text-zinc-400 dark:text-zinc-500"
    }`}>
      {label}
    </span>
  </div>
);

"use client";

import React from "react";
import { Sidebar } from "./Sidebar";
import { MobileNavbar } from "./MobileNavbar";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Sidebar />
      <MobileNavbar />
      <div className="lg:ml-20 pb-20 lg:pb-0 relative min-h-screen">
        {children}
      </div>
    </>
  );
}

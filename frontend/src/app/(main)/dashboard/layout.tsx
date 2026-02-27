import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Live Trade Feed — Dashboard",
  description:
    "Monitor real-time congressional stock trades, search by politician or ticker, and discover institutional alpha on the Nexus Alpha dashboard.",
  alternates: {
    canonical: "/dashboard",
  },
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ethics Monitor — Suspicious Trading Analysis",
  description:
    "Analyze suspicious congressional trading patterns, conflict-of-interest flags, and STOCK Act compliance. Real-time ethics scoring for US politicians.",
  alternates: {
    canonical: "/ethics",
  },
};

export default function EthicsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

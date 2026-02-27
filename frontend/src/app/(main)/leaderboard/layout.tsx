import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Whale Leaderboard — Top Congressional Traders",
  description:
    "See the most profitable politicians and biggest losers in congressional stock trading. Track YTD returns, popular stocks, and party performance.",
  alternates: {
    canonical: "/leaderboard",
  },
};

export default function LeaderboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

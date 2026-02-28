import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from './providers';
import { AuthProvider } from "../context/AuthContext";
import { GoogleOAuthProvider } from '@react-oauth/google';
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://nexusalpha.io"),
  title: {
    default: "Nexus Alpha — Track Congressional Trading & Institutional Alpha",
    template: "%s | Nexus Alpha",
  },
  description:
    "Gain an edge by tracking real-time congressional stock trades, suspicious timing flags, and institutional alpha. Monitor US politicians' financial disclosures as they happen.",
  keywords: [
    "congressional trading",
    "politician stock trades",
    "congress stock tracker",
    "insider trading",
    "institutional alpha",
    "STOCK Act",
    "senate trades",
    "house trades",
    "political stock trading",
    "financial disclosures",
    "congress stock watch",
    "politician investments",
  ],
  authors: [{ name: "Nexus Alpha" }],
  creator: "Nexus Alpha",
  publisher: "Nexus Alpha",
  icons: {
    icon: "/favicon.svg",
    apple: "/logo.png",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Nexus Alpha",
    title: "Nexus Alpha — Track Congressional Trading & Institutional Alpha",
    description:
      "Monitor real-time congressional stock trades, suspicious timing flags, and whale leaderboards. See the data politicians don't want you to see.",
    images: [
      {
        url: "/logo.png",
        width: 512,
        height: 512,
        alt: "Nexus Alpha — Congressional Trading Tracker",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Nexus Alpha — Track Congressional Trading & Institutional Alpha",
    description:
      "Monitor real-time congressional stock trades, suspicious timing flags, and whale leaderboards.",
    images: ["/logo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased transition-colors duration-300" suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID_HERE'}>
            <AuthProvider>
              {children}
            </AuthProvider>
          </GoogleOAuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

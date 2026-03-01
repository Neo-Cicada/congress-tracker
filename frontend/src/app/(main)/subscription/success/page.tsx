"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "../../../../context/AuthContext";
import { useRouter } from "next/navigation";
import { CheckCircle, Loader2, Sparkles } from "lucide-react";

export default function SubscriptionSuccessPage() {
  const { refreshSubscription, isPremium } = useAuth();
  const [polling, setPolling] = useState(true);
  const [pollCount, setPollCount] = useState(0);
  const router = useRouter();

  useEffect(() => {
    if (isPremium) {
      setPolling(false);
      // Auto-redirect after showing success
      const timer = setTimeout(() => router.push("/dashboard"), 3000);
      return () => clearTimeout(timer);
    }

    // Poll for subscription activation (webhook may take a few seconds)
    if (pollCount >= 20) {
      setPolling(false);
      return;
    }

    const timer = setTimeout(async () => {
      await refreshSubscription();
      setPollCount((c) => c + 1);
    }, 2000);

    return () => clearTimeout(timer);
  }, [isPremium, pollCount, refreshSubscription, router]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {isPremium ? (
          <>
            <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle size={48} className="text-green-500" />
            </div>
            <h1 className="text-3xl font-extrabold mb-3">
              Welcome to{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-purple-500">
                Pro
              </span>
              !
            </h1>
            <p className="text-zinc-500 dark:text-zinc-400 mb-6">
              Your subscription is now active. All premium features are unlocked.
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-zinc-400">
              <Sparkles size={14} />
              Redirecting to dashboard...
            </div>
          </>
        ) : polling ? (
          <>
            <div className="w-20 h-20 bg-cyan-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Loader2 size={40} className="text-cyan-500 animate-spin" />
            </div>
            <h1 className="text-3xl font-extrabold mb-3">
              Activating Your Subscription
            </h1>
            <p className="text-zinc-500 dark:text-zinc-400 mb-4">
              We&apos;re confirming your payment. This usually takes just a moment...
            </p>
            <div className="w-48 h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-full mx-auto overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full transition-all duration-1000"
                style={{ width: `${Math.min((pollCount / 20) * 100, 95)}%` }}
              />
            </div>
          </>
        ) : (
          <>
            <div className="w-20 h-20 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Sparkles size={40} className="text-amber-500" />
            </div>
            <h1 className="text-3xl font-extrabold mb-3">
              Almost There!
            </h1>
            <p className="text-zinc-500 dark:text-zinc-400 mb-6">
              Your payment is being processed. It may take a minute for your subscription to activate. Try refreshing the page.
            </p>
            <button
              onClick={() => {
                setPollCount(0);
                setPolling(true);
              }}
              className="px-6 py-3 bg-cyan-500 text-white font-bold rounded-xl hover:bg-cyan-400 transition-colors"
            >
              Check Again
            </button>
          </>
        )}
      </div>
    </div>
  );
}

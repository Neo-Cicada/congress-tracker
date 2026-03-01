"use client";

import React, { useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import { getApiUrl } from "../../../lib/api";
import { Check, Sparkles, Zap, Crown, Loader2 } from "lucide-react";
import Link from "next/link";

const PLANS = [
  {
    id: "weekly",
    name: "Weekly Access",
    price: "$9",
    period: "/week",
    icon: Zap,
    color: "cyan",
    features: [
      "Full trade history",
      "Real-time alerts",
      "Basic analytics",
    ],
    popular: false,
  },
  {
    id: "monthly",
    name: "Monthly Access",
    price: "$29",
    period: "/month",
    icon: Sparkles,
    color: "cyan",
    features: [
      "Everything in Weekly",
      "Whale Leaderboards",
      "Suspicious timing flags",
      "Priority support",
    ],
    popular: true,
  },
  {
    id: "yearly",
    name: "Yearly Access",
    price: "$249",
    period: "/year",
    icon: Crown,
    color: "purple",
    features: [
      "Everything in Monthly",
      "2 Months Free ($290 value)",
      "API Access (Beta)",
      "Exclusive Alpha Reports",
    ],
    popular: false,
  },
];

export default function PricingPage() {
  const { user, token, isPremium, subscription } = useAuth();
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubscribe = async (plan: string) => {
    if (!user || !token) {
      window.location.href = `/signup?plan=${plan}`;
      return;
    }

    setLoadingPlan(plan);
    setError(null);

    try {
      const res = await fetch(getApiUrl("subscription/checkout"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ plan }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Failed to create checkout");
        return;
      }

      // Redirect to Lemon Squeezy hosted checkout
      window.location.href = data.checkoutUrl;
    } catch (err) {
      setError("Something went wrong. Please try again.");
      console.error("Checkout error:", err);
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
            {isPremium ? "Your " : "Choose Your "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-purple-500">
              {isPremium ? "Subscription" : "Plan"}
            </span>
          </h1>
          <p className="text-lg text-zinc-500 dark:text-zinc-400">
            {isPremium
              ? `You're on the ${subscription?.plan} plan. Manage your subscription below.`
              : "Unlock premium features and get ahead of the market."}
          </p>
        </div>

        {isPremium && (
          <div className="mb-12 p-6 rounded-2xl bg-green-500/10 border border-green-500/20 text-center">
            <p className="text-green-600 dark:text-green-400 font-semibold text-lg">
              ✅ You have an active <span className="capitalize">{subscription?.plan}</span> subscription
              {subscription?.cancelAtPeriodEnd && (
                <span className="text-amber-500"> (cancels at period end)</span>
              )}
            </p>
            {subscription?.currentPeriodEnd && (
              <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">
                {subscription.cancelAtPeriodEnd ? "Access until" : "Renews"}: {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
              </p>
            )}
          </div>
        )}

        {error && (
          <div className="mb-8 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-center">
            {error}
          </div>
        )}

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {PLANS.map((plan) => {
            const isCurrentPlan = isPremium && subscription?.plan === plan.id;
            const Icon = plan.icon;

            return (
              <div
                key={plan.id}
                className={`p-8 rounded-[2rem] flex flex-col items-center text-center relative transition-all ${
                  plan.popular
                    ? "bg-zinc-900 dark:bg-white border-2 border-cyan-500 transform md:-translate-y-4 shadow-2xl shadow-cyan-500/20"
                    : "bg-white/50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800/50"
                } backdrop-blur-xl`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 bg-cyan-500 text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider shadow-lg">
                    Most Popular
                  </div>
                )}

                {isCurrentPlan && (
                  <div className="absolute -top-4 bg-green-500 text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider shadow-lg">
                    Current Plan
                  </div>
                )}

                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 mt-2 ${
                  plan.popular
                    ? "bg-cyan-500/20 text-cyan-400"
                    : plan.color === "purple"
                    ? "bg-purple-500/10 text-purple-500"
                    : "bg-cyan-500/10 text-cyan-500"
                }`}>
                  <Icon size={28} />
                </div>

                <h3 className={`text-2xl font-bold mb-2 ${
                  plan.popular ? "text-white dark:text-zinc-900" : ""
                }`}>
                  {plan.name}
                </h3>

                <div className={`flex items-baseline gap-1 mb-6 ${
                  plan.popular ? "text-white dark:text-zinc-900" : ""
                }`}>
                  <span className={`${plan.popular ? "text-5xl" : "text-4xl"} font-extrabold`}>
                    {plan.price}
                  </span>
                  <span className={`${
                    plan.popular
                      ? "text-zinc-400 dark:text-zinc-500"
                      : "text-zinc-500 dark:text-zinc-400"
                  } font-medium`}>
                    {plan.period}
                  </span>
                </div>

                <ul className={`space-y-4 mb-8 w-full text-left ${
                  plan.popular
                    ? "text-zinc-300 dark:text-zinc-600"
                    : "text-zinc-600 dark:text-zinc-300"
                }`}>
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                        plan.color === "purple"
                          ? "bg-purple-500/20 text-purple-500"
                          : "bg-cyan-500/20 text-cyan-400"
                      }`}>
                        <Check size={12} strokeWidth={3} />
                      </div>
                      {feature}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleSubscribe(plan.id)}
                  disabled={isCurrentPlan || loadingPlan === plan.id}
                  className={`w-full py-3.5 px-6 rounded-xl font-bold text-center transition-all mt-auto disabled:opacity-50 disabled:cursor-not-allowed ${
                    plan.popular
                      ? "bg-cyan-500 text-white hover:bg-cyan-400 hover:scale-105 shadow-lg shadow-cyan-500/25 text-lg"
                      : isCurrentPlan
                      ? "bg-green-500/10 text-green-500 border border-green-500/20"
                      : "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white hover:bg-zinc-200 dark:hover:bg-zinc-700"
                  }`}
                >
                  {loadingPlan === plan.id ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 size={18} className="animate-spin" />
                      Loading...
                    </span>
                  ) : isCurrentPlan ? (
                    "Current Plan"
                  ) : isPremium ? (
                    "Switch Plan"
                  ) : (
                    `Get ${plan.name}`
                  )}
                </button>
              </div>
            );
          })}
        </div>

        {/* Back to dashboard */}
        <div className="text-center mt-12">
          <Link
            href="/dashboard"
            className="text-zinc-500 dark:text-zinc-400 hover:text-cyan-500 transition-colors text-sm"
          >
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}

"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { useRouter } from "next/navigation";
import { getApiUrl } from "../lib/api";

interface Subscription {
  status: 'free' | 'active' | 'past_due' | 'cancelled' | 'expired';
  plan: 'weekly' | 'monthly' | 'yearly' | null;
  currentPeriodEnd: string | null;
  cancelAtPeriodEnd: boolean;
}

interface User {
  _id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  hasPassword?: boolean;
  subscription?: Subscription;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  savedTrades: string[];
  subscription: Subscription | null;
  isPremium: boolean;
  login: (userData: User, token: string) => void;
  logout: () => void;
  toggleSavedTrade: (tradeId: string) => Promise<void>;
  refreshSubscription: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEFAULT_SUBSCRIPTION: Subscription = {
  status: 'free',
  plan: null,
  currentPeriodEnd: null,
  cancelAtPeriodEnd: false,
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [savedTrades, setSavedTrades] = useState<string[]>([]);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const isPremium = subscription?.status === 'active';

  const fetchSavedTrades = async (currentToken: string) => {
    try {
      const res = await fetch(getApiUrl('users/saved-trades'), {
        headers: { Authorization: `Bearer ${currentToken}` }
      });
      if (res.ok) {
        const data = await res.json();
        const tradeIds = data.map((t: any) => t._id || t);
        setSavedTrades(tradeIds);
      }
    } catch (err) {
      console.error("Failed to fetch saved trades:", err);
    }
  };

  const refreshSubscription = useCallback(async () => {
    const currentToken = token || localStorage.getItem("token");
    if (!currentToken) return;

    try {
      const res = await fetch(getApiUrl('subscription/status'), {
        headers: { Authorization: `Bearer ${currentToken}` }
      });
      if (res.ok) {
        const data = await res.json();
        setSubscription(data.subscription || DEFAULT_SUBSCRIPTION);

        // Also update user object's subscription
        setUser(prev => prev ? { ...prev, subscription: data.subscription } : prev);
      }
    } catch (err) {
      console.error("Failed to fetch subscription:", err);
    }
  }, [token]);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    if (storedUser && storedToken) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setToken(storedToken);
      setSubscription(parsedUser.subscription || DEFAULT_SUBSCRIPTION);
      fetchSavedTrades(storedToken);

      // Auto-refresh subscription from API to catch DB changes
      fetch(getApiUrl('subscription/status'), {
        headers: { Authorization: `Bearer ${storedToken}` }
      })
        .then(res => res.ok ? res.json() : null)
        .then(data => {
          if (data?.subscription) {
            setSubscription(data.subscription);
            // Update localStorage so next load is also fresh
            const updated = { ...parsedUser, subscription: data.subscription };
            localStorage.setItem("user", JSON.stringify(updated));
          }
        })
        .catch(() => {}); // Silently fail if API is unreachable
    }
    setLoading(false);
  }, []);

  const toggleSavedTrade = async (tradeId: string) => {
    if (!token) return;

    const isSaved = savedTrades.includes(tradeId);
    
    // Optimistic update
    if (isSaved) {
      setSavedTrades(prev => prev.filter(id => id !== tradeId));
    } else {
      setSavedTrades(prev => [...prev, tradeId]);
    }

    try {
      const url = isSaved ? getApiUrl(`users/saved-trades/${tradeId}`) : getApiUrl('users/saved-trades');
      const method = isSaved ? 'DELETE' : 'POST';
      const body = isSaved ? undefined : JSON.stringify({ tradeId });
      
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body
      });

      if (!res.ok) {
        // Revert on failure
        fetchSavedTrades(token);
      }
    } catch (err) {
      console.error('Toggle saved trade error:', err);
      fetchSavedTrades(token);
    }
  };

  const login = (userData: User, newToken: string) => {
    setUser(userData);
    setToken(newToken);
    setSubscription(userData.subscription || DEFAULT_SUBSCRIPTION);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", newToken);
    fetchSavedTrades(newToken);
    router.push("/dashboard");
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setSavedTrades([]);
    setSubscription(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    router.push("/"); 
  };

  return (
    <AuthContext.Provider value={{ user, token, savedTrades, subscription, isPremium, toggleSavedTrade, login, logout, refreshSubscription, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}


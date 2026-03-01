"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { getApiUrl } from "../lib/api";

interface User {
  _id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  hasPassword?: boolean;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  savedTrades: string[];
  login: (userData: User, token: string) => void;
  logout: () => void;
  toggleSavedTrade: (tradeId: string) => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [savedTrades, setSavedTrades] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

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

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
      fetchSavedTrades(storedToken);
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
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", newToken);
    fetchSavedTrades(newToken);
    router.push("/dashboard");
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setSavedTrades([]);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    router.push("/"); 
  };

  return (
    <AuthContext.Provider value={{ user, token, savedTrades, toggleSavedTrade, login, logout, loading }}>
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

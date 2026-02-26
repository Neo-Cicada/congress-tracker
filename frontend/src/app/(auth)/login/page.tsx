"use client";

import React, { useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Lock, Mail, Loader2 } from "lucide-react";
import { getApiUrl } from "../../../lib/api";
import { useGoogleLogin } from '@react-oauth/google';

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch(getApiUrl("auth/login"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to login");
      }

      login(data, data.token); // this will redirect to dashboard
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const googleLoginHandler = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setIsLoading(true);
      setError("");
      try {
        const res = await fetch(getApiUrl("auth/google"), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ googleToken: tokenResponse.access_token }),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Failed to login with Google");
        }

        login(data, data.token);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    },
    onError: (error) => setError("Google Login Failed"),
  });

  return (
    <div className="flex min-h-screen bg-zinc-50 dark:bg-[#050505] text-zinc-900 dark:text-zinc-200">
      {/* Left side: Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-24 relative z-10">
        <div className="w-full max-w-md">
          <Link href="/" className="inline-flex items-center justify-center w-12 h-12 bg-zinc-900 dark:bg-white rounded-2xl mb-12 shadow-xl hover:scale-105 transition-all">
             <span className="text-white dark:text-zinc-900 font-bold text-2xl">N</span>
          </Link>

          <h1 className="text-3xl font-extrabold tracking-tight mb-2">Welcome Back</h1>
          <p className="text-zinc-500 mb-8">Access the institutional protocol dashboard.</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl text-sm font-medium">
                {error}
              </div>
            )}

            <div className="space-y-1 relative">
              <label className="text-sm font-bold ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-2xl focus:outline-none focus:ring-4 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all"
                  placeholder="investor@firm.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-bold ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-2xl focus:outline-none focus:ring-4 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-8 py-4 bg-zinc-900 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-900 font-bold rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-xl hover:shadow-cyan-500/25 disabled:opacity-70 disabled:pointer-events-none"
            >
              {isLoading ? <Loader2 className="animate-spin" size={20} /> : "Initialize Session"} <ArrowRight size={18} />
            </button>
            
            <div className="relative flex items-center py-4">
              <div className="flex-grow border-t border-zinc-200 dark:border-zinc-800"></div>
              <span className="flex-shrink-0 mx-4 text-zinc-400 text-sm font-medium">or continue with</span>
              <div className="flex-grow border-t border-zinc-200 dark:border-zinc-800"></div>
            </div>
            
            <button
              type="button"
              onClick={() => googleLoginHandler()}
              disabled={isLoading}
              className="w-full py-4 bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 font-bold rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 shadow-sm hover:border-zinc-300 dark:hover:border-zinc-700 disabled:opacity-70 disabled:pointer-events-none flex-row"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="24px" height="24px">
                <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
                <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
                <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/>
                <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/>
              </svg>
              Google
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-zinc-500">
            Don't have clearance yet?{" "}
            <Link href="/signup" className="font-bold text-zinc-900 dark:text-zinc-100 underline hover:text-cyan-500 dark:hover:text-cyan-400">
              Apply for access
            </Link>
          </p>
        </div>
      </div>

      {/* Right side: Artistic/Graphic */}
      <div className="hidden lg:flex w-1/2 bg-zinc-900 dark:bg-[#020202] relative items-center justify-center overflow-hidden border-l border-zinc-200/50 dark:border-zinc-800">
        <div className="absolute top-1/4 -right-1/4 w-[40rem] h-[40rem] bg-cyan-600/20 blur-[150px] rounded-full" />
        <div className="absolute bottom-1/4 -left-1/4 w-[40rem] h-[40rem] bg-purple-600/20 blur-[150px] rounded-full" />
        
        <div className="relative z-10 max-w-lg p-12 glassmorphism border border-white/10 rounded-[2rem] bg-white/5 backdrop-blur-3xl shadow-2xl">
           <h2 className="text-3xl font-bold text-white mb-4">"The market is a device for transferring money from the impatient to the patient."</h2>
           <p className="text-zinc-400 font-mono text-sm uppercase tracking-widest border-t border-white/10 pt-4 mt-4 inline-block">Warren Buffett</p>
        </div>
      </div>
    </div>
  );
}

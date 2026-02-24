"use client";

import React, { useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Lock, Mail, User, Loader2 } from "lucide-react";

export default function SignupPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
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
      const res = await fetch("http://localhost:4000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, firstName, lastName }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to register");
      }

      login(data, data.token); // this will redirect to dashboard
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-zinc-50 dark:bg-[#050505] text-zinc-900 dark:text-zinc-200">
      {/* Right side: Artistic/Graphic (Swapped side compared to login) */}
      <div className="hidden lg:flex w-1/2 bg-zinc-900 dark:bg-[#020202] relative items-center justify-center overflow-hidden border-r border-zinc-200/50 dark:border-zinc-800">
        <div className="absolute top-1/4 -right-1/4 w-[40rem] h-[40rem] bg-cyan-600/20 blur-[150px] rounded-full" />
        <div className="absolute bottom-1/4 -left-1/4 w-[40rem] h-[40rem] bg-purple-600/20 blur-[150px] rounded-full" />
        
        <div className="relative z-10 max-w-lg p-12 glassmorphism border border-white/10 rounded-[2rem] bg-white/5 backdrop-blur-3xl shadow-2xl">
           <div className="w-16 h-16 bg-cyan-500/20 text-cyan-400 rounded-2xl flex items-center justify-center mb-6">
              <Lock size={32} />
           </div>
           <h2 className="text-3xl font-bold text-white mb-4">Unrestricted Access</h2>
           <p className="text-zinc-400 leading-relaxed">Join thousands of analysts and investors who track congressional trades seconds after they're filed. Don't be the last to know where the money is moving.</p>
        </div>
      </div>

      {/* Left side: Form (Swapped side) */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-24 relative z-10">
        <div className="w-full max-w-md">
          <Link href="/" className="inline-flex items-center justify-center w-12 h-12 bg-zinc-900 dark:bg-white rounded-2xl mb-12 shadow-xl hover:scale-105 transition-all">
             <span className="text-white dark:text-zinc-900 font-bold text-2xl">N</span>
          </Link>

          <h1 className="text-3xl font-extrabold tracking-tight mb-2">Create Protocol Key</h1>
          <p className="text-zinc-500 mb-8">Establish your credentials for the data terminal.</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl text-sm font-medium">
                {error}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-1">
                 <label className="text-sm font-bold ml-1">First Name</label>
                 <div className="relative">
                   <User className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                   <input
                     type="text"
                     value={firstName}
                     onChange={(e) => setFirstName(e.target.value)}
                     className="w-full pl-11 pr-4 py-3.5 bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-2xl focus:outline-none focus:ring-4 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all"
                     placeholder="Jane"
                   />
                 </div>
               </div>
               <div className="space-y-1">
                 <label className="text-sm font-bold ml-1">Last Name</label>
                 <div className="relative">
                   <User className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                   <input
                     type="text"
                     value={lastName}
                     onChange={(e) => setLastName(e.target.value)}
                     className="w-full pl-11 pr-4 py-3.5 bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-2xl focus:outline-none focus:ring-4 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all"
                     placeholder="Doe"
                   />
                 </div>
               </div>
            </div>

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
                  title="Password must be at least 6 characters"
                  minLength={6}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-8 py-4 bg-zinc-900 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-900 font-bold rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-xl hover:shadow-cyan-500/25 disabled:opacity-70 disabled:pointer-events-none"
            >
              {isLoading ? <Loader2 className="animate-spin" size={20} /> : "Request Clearance"} <ArrowRight size={18} />
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-zinc-500">
            Already have an active key?{" "}
            <Link href="/login" className="font-bold text-zinc-900 dark:text-zinc-100 underline hover:text-cyan-500 dark:hover:text-cyan-400">
              Access dashboard
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

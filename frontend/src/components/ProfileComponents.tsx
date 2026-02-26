import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { 
    Settings, 
    Star,
    Mail,
    UserCircle,
    X,
    Lock,
    Trash2,
    Plus,
    Loader2
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { getApiUrl } from "../lib/api";

// --- 1. USER PROFILE HEADER ---
export const ProfileHeader = () => {
  const { user, logout } = useAuth();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <>
      <div className="relative overflow-hidden rounded-[1.5rem] md:rounded-[2.5rem] bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 p-6 md:p-8 text-zinc-900 dark:text-white shadow-xl dark:shadow-none backdrop-blur-sm group transition-colors">
        
        {/* Ambient Glow - Subtle */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 dark:bg-cyan-500/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/5 dark:bg-purple-500/10 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2" />

        <div className="relative z-10">
          {/* Top Bar: Network & Status */}
          <div className="flex items-center justify-between mb-6 md:mb-8">
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/50 backdrop-blur-md">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                  <span className="text-[10px] font-mono font-bold text-zinc-600 dark:text-zinc-400 uppercase tracking-widest">Online</span>
              </div>
              <div className="flex items-center gap-4">
                  <button 
                    onClick={() => setIsSettingsOpen(true)}
                    className="text-zinc-400 dark:text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer"
                  >
                      <Settings size={18} />
                  </button>
              </div>
          </div>

          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 md:gap-8">
              {/* Wallet Identity */}
              <div className="flex-1 w-full">
                  <div className="flex items-center gap-4 mb-2">
                      <div className="hidden md:flex w-16 h-16 rounded-full bg-zinc-100 dark:bg-zinc-800 items-center justify-center border border-zinc-200 dark:border-zinc-700">
                          <UserCircle size={32} className="text-zinc-400" />
                      </div>
                      <div>
                          <div className="flex items-center gap-2 mb-1">
                              <h2 className="text-xl md:text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
                                  {user?.firstName || user?.lastName ? `${user.firstName || ''} ${user.lastName || ''}`.trim() : "Congress Tracker User"}
                              </h2>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
                              <Mail size={14} />
                              <span>{user?.email || "No Email Associated"}</span>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
        </div>
      </div>

      {isSettingsOpen && (
        <SettingsModal onClose={() => setIsSettingsOpen(false)} onLogout={logout} />
      )}
    </>
  );
};

// --- SETTINGS MODAL ---
const SettingsModal = ({ onClose, onLogout }: { onClose: () => void, onLogout: () => void }) => {
  const { token } = useAuth();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) return;

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const res = await fetch(getApiUrl("users/password"), {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ currentPassword, newPassword })
      });

      const data = await res.json();
      if (res.ok) {
        setMessage({ type: 'success', text: "Password updated successfully!" });
        setCurrentPassword("");
        setNewPassword("");
      } else {
        setMessage({ type: 'error', text: data.message || "Failed to update password" });
      }
    } catch (err) {
      setMessage({ type: 'error', text: "An error occurred" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-zinc-900/40 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-6 border-b border-zinc-200 dark:border-zinc-800">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <Settings size={20} className="text-cyan-500" />
            Settings
          </h3>
          <button onClick={onClose} className="text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6 space-y-8">
          {/* Change Password */}
          <div>
            <h4 className="text-sm font-bold text-zinc-900 dark:text-white mb-4 flex items-center gap-2">
              <Lock size={16} />
              Change Password
            </h4>
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <input 
                  type="password"
                  placeholder="Current Password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-cyan-500 transition-colors"
                />
              </div>
              <div>
                <input 
                  type="password"
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-cyan-500 transition-colors"
                />
              </div>
              {message.text && (
                <div className={`text-xs ${message.type === 'error' ? 'text-red-500' : 'text-emerald-500'}`}>
                  {message.text}
                </div>
              )}
              <button 
                type="submit"
                disabled={loading || !currentPassword || !newPassword}
                className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-3 rounded-xl text-sm transition-colors disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? <Loader2 size={16} className="animate-spin" /> : "Update Password"}
              </button>
            </form>
          </div>

          <div className="pt-6 border-t border-zinc-200 dark:border-zinc-800">
             <button 
                onClick={onLogout}
                className="w-full py-3 rounded-xl border border-red-500/20 bg-red-500/10 text-red-500 font-bold text-sm hover:bg-red-500/20 transition-colors cursor-pointer"
             >
                Log Out
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- 2. WATCHLIST GRID ---
export const Watchlist = () => {
    const { token } = useAuth();
    const [watchlist, setWatchlist] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!searchQuery.trim()) {
            setSearchResults([]);
            setShowDropdown(false);
            return;
        }

        const delayDebounceFn = setTimeout(async () => {
            setIsSearching(true);
            try {
                const res = await fetch(getApiUrl(`politician?search=${encodeURIComponent(searchQuery)}`));
                const data = await res.json();
                const results = Array.isArray(data) ? data : (data.politicians || []);
                setSearchResults(results.slice(0, 5));
                setShowDropdown(true);
            } catch (err) {
                console.error("Search error:", err);
            } finally {
                setIsSearching(false);
            }
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [searchQuery]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowDropdown(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const fetchWatchlist = async () => {
      if (!token) return;
      try {
        const res = await fetch(getApiUrl("users/watchlist"), {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (res.ok) setWatchlist(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    useEffect(() => {
        if (token) {
            fetchWatchlist();
        }
    }, [token]);

    const removeFromWatchlist = async (id: string) => {
      try {
        await fetch(getApiUrl(`users/watchlist/${id}`), {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` }
        });
        setWatchlist(watchlist.filter(p => p._id !== id));
      } catch (err) {
        console.error(err);
      }
    };

    const addToWatchlistWithId = async (politicianId: string) => {
       try {
           setIsAdding(false);
           setSearchQuery("");
           setShowDropdown(false);
           setSearchResults([]);
           
           await fetch(getApiUrl("users/watchlist"), {
              method: "POST",
              headers: { 
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}` 
              },
              body: JSON.stringify({ politicianId })
           });
           
           fetchWatchlist();
       } catch (err) {
           console.error(err);
           alert("Failed to add to watchlist.");
       }
    };

    const addToWatchlist = async () => {
       if (!searchQuery) return;
       try {
           const res = await fetch(getApiUrl(`politician?search=${encodeURIComponent(searchQuery)}`));
           const data = await res.json();
           const politician = data.politicians?.[0] || data[0];
           
           if (politician && politician._id) {
               await addToWatchlistWithId(politician._id);
           } else {
               alert("Politician not found. Try entering their full name accurately.");
           }
       } catch (err) {
           console.error(err);
       }
    };

    return (
        <div className="bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 relative transition-colors backdrop-blur-sm">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-mono font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                    <Star size={18} className="text-amber-500" />
                    Watchlist
                </h3>
                <span className="text-[10px] font-mono font-bold text-zinc-500 uppercase tracking-widest bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded-full">
                    {watchlist.length} Items
                </span>
            </div>

            <div className="space-y-3">
                {loading ? (
                  <div className="flex justify-center p-4"><Loader2 size={16} className="animate-spin text-zinc-500" /></div>
                ) : watchlist.length === 0 ? (
                  <div className="text-center p-4 text-xs font-mono text-zinc-500 uppercase flex flex-col items-center">
                    <span>Watchlist is empty</span>
                    <span className="block mt-1 text-zinc-400">Click below to add a politician</span>
                  </div>
                ) : (
                  watchlist.map((item, i) => (
                    <div key={item._id || i} className="flex items-center justify-between p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-100 dark:border-zinc-800 hover:border-cyan-500/30 transition-all group">
                        <Link href={`/politician/${item._id}`} className="flex items-center gap-3 flex-1 cursor-pointer">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-white font-mono font-bold text-xs ${item.party === 'D' ? 'bg-blue-500' : item.party === 'R' ? 'bg-red-500' : 'bg-zinc-500'}`}>
                                {item.party || '?'}
                            </div>
                            <div>
                                <div className="font-mono font-bold text-sm text-zinc-900 dark:text-zinc-200 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                                    {item.name}
                                </div>
                                <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
                                    {item.chamber}
                                </div>
                            </div>
                        </Link>
                        <div className="text-right flex items-center gap-3">
                             <button 
                               onClick={() => removeFromWatchlist(item._id)}
                               title="Remove from watchlist"
                               className="text-zinc-400 hover:text-red-500 transition-colors p-2 opacity-0 group-hover:opacity-100 focus:opacity-100 cursor-pointer"
                             >
                               <Trash2 size={16} />
                             </button>
                        </div>
                    </div>
                  ))
                )}
                
                {isAdding ? (
                   <div className="relative mt-4 fade-in animate-in" ref={dropdownRef}>
                      <div className="flex items-center gap-2">
                         <input 
                            type="text" 
                            placeholder="e.g. Nancy Pelosi"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onFocus={() => { if (searchQuery.trim()) setShowDropdown(true); }}
                            className="flex-1 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-cyan-500 transition-colors"
                            autoFocus
                            onKeyDown={(e) => e.key === 'Enter' && addToWatchlist()}
                         />
                         <button onClick={addToWatchlist} className="p-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-xl transition-colors shrink-0 cursor-pointer">
                            <Plus size={18} />
                         </button>
                         <button onClick={() => { setIsAdding(false); setSearchQuery(""); setShowDropdown(false); }} className="p-2 bg-zinc-200 dark:bg-zinc-700 hover:bg-zinc-300 dark:hover:bg-zinc-600 rounded-xl transition-colors text-zinc-600 dark:text-zinc-300 shrink-0 cursor-pointer">
                            <X size={18} />
                         </button>
                      </div>

                      {showDropdown && (
                          <div className="absolute z-50 w-full mt-2 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl shadow-xl overflow-hidden max-h-60 overflow-y-auto">
                              {isSearching ? (
                                  <div className="p-4 text-center text-zinc-500 text-sm flex justify-center items-center gap-2">
                                      <Loader2 size={16} className="animate-spin" /> Searching...
                                  </div>
                              ) : searchResults.length > 0 ? (
                                  searchResults.map((pol) => (
                                      <button
                                          key={pol._id}
                                          onClick={() => addToWatchlistWithId(pol._id)}
                                          className="w-full text-left px-4 py-3 hover:bg-zinc-100 dark:hover:bg-zinc-700/50 flex flex-col transition-colors border-b border-zinc-100 dark:border-zinc-700/50 last:border-0 cursor-pointer"
                                      >
                                          <div className="flex items-center justify-between w-full">
                                              <span className="font-bold text-zinc-900 dark:text-white text-sm">{pol.name}</span>
                                              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${pol.party === 'D' ? 'bg-blue-500/10 text-blue-500' : pol.party === 'R' ? 'bg-red-500/10 text-red-500' : 'bg-zinc-500/10 text-zinc-500'}`}>
                                                  {pol.party || 'IND'}
                                              </span>
                                          </div>
                                          <span className="text-xs text-zinc-500">{pol.chamber}</span>
                                      </button>
                                  ))
                              ) : searchQuery.trim().length > 0 ? (
                                  <div className="p-4 text-center text-zinc-500 text-sm">
                                      No politicians found.
                                  </div>
                              ) : null}
                          </div>
                      )}
                   </div>
                ) : (
                  <button 
                    onClick={() => setIsAdding(true)}
                    className="w-full mt-2 py-3 rounded-xl border border-dashed border-zinc-300 dark:border-zinc-800 text-zinc-400 dark:text-zinc-600 text-[10px] font-mono font-bold uppercase tracking-widest hover:border-cyan-500 hover:text-cyan-500 transition-all cursor-pointer"
                  >
                      + Add Protocol
                  </button>
                )}
            </div>
        </div>
    )
}

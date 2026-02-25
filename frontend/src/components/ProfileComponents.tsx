import React, { useState, useEffect } from "react";
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
                    className="text-zinc-400 dark:text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors"
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
      const res = await fetch("http://localhost:4000/api/users/password", {
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
          <button onClick={onClose} className="text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors">
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
                className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-3 rounded-xl text-sm transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 size={16} className="animate-spin" /> : "Update Password"}
              </button>
            </form>
          </div>

          <div className="pt-6 border-t border-zinc-200 dark:border-zinc-800">
             <button 
                onClick={onLogout}
                className="w-full py-3 rounded-xl border border-red-500/20 bg-red-500/10 text-red-500 font-bold text-sm hover:bg-red-500/20 transition-colors"
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

    const fetchWatchlist = async () => {
      if (!token) return;
      try {
        const res = await fetch("http://localhost:4000/api/users/watchlist", {
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
        await fetch(`http://localhost:4000/api/users/watchlist/${id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` }
        });
        setWatchlist(watchlist.filter(p => p._id !== id));
      } catch (err) {
        console.error(err);
      }
    };

    const addToWatchlist = async () => {
       if (!searchQuery) return;
       try {
           const res = await fetch(`http://localhost:4000/api/politician?search=${encodeURIComponent(searchQuery)}`);
           const data = await res.json();
           const politician = data.politicians?.[0] || data[0];
           
           if (politician && politician._id) {
               await fetch("http://localhost:4000/api/users/watchlist", {
                  method: "POST",
                  headers: { 
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}` 
                  },
                  body: JSON.stringify({ politicianId: politician._id })
               });
               setIsAdding(false);
               setSearchQuery("");
               fetchWatchlist();
           } else {
               alert("Politician not found. Try entering their full name accurately.");
           }
       } catch (err) {
           console.error(err);
       }
    };

    return (
        <div className="bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 relative overflow-hidden transition-colors backdrop-blur-sm">
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
                        <div className="flex items-center gap-3">
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
                        </div>
                        <div className="text-right flex items-center gap-3">
                             <button 
                               onClick={() => removeFromWatchlist(item._id)}
                               title="Remove from watchlist"
                               className="text-zinc-400 hover:text-red-500 transition-colors p-2 opacity-0 group-hover:opacity-100 focus:opacity-100"
                             >
                               <Trash2 size={16} />
                             </button>
                        </div>
                    </div>
                  ))
                )}
                
                {isAdding ? (
                   <div className="flex items-center gap-2 mt-4 fade-in animate-in">
                      <input 
                         type="text" 
                         placeholder="e.g. Nancy Pelosi"
                         value={searchQuery}
                         onChange={(e) => setSearchQuery(e.target.value)}
                         className="flex-1 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-cyan-500 transition-colors"
                         autoFocus
                         onKeyDown={(e) => e.key === 'Enter' && addToWatchlist()}
                      />
                      <button onClick={addToWatchlist} className="p-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-xl transition-colors">
                         <Plus size={18} />
                      </button>
                      <button onClick={() => setIsAdding(false)} className="p-2 bg-zinc-200 dark:bg-zinc-700 hover:bg-zinc-300 dark:hover:bg-zinc-600 rounded-xl transition-colors text-zinc-600 dark:text-zinc-300">
                         <X size={18} />
                      </button>
                   </div>
                ) : (
                  <button 
                    onClick={() => setIsAdding(true)}
                    className="w-full mt-2 py-3 rounded-xl border border-dashed border-zinc-300 dark:border-zinc-800 text-zinc-400 dark:text-zinc-600 text-[10px] font-mono font-bold uppercase tracking-widest hover:border-cyan-500 hover:text-cyan-500 transition-all font-bold"
                  >
                      + Add Protocol
                  </button>
                )}
            </div>
        </div>
    )
}

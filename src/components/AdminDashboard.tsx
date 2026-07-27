import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Users, 
  Mail, 
  Download, 
  Search, 
  Filter, 
  Trash2, 
  CheckCircle, 
  Clock, 
  Send, 
  Lock, 
  X, 
  RefreshCw,
  Key,
  ChevronRight
} from 'lucide-react';
import type { Subscriber } from '../services/waitlistService';
import { 
  fetchAllSubscribers, 
  updateSubscriberStatus, 
  deleteSubscriber, 
  exportSubscribersToCSV 
} from '../services/waitlistService';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ isOpen, onClose }) => {
  const [adminKey, setAdminKey] = useState<string>('');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string>('');
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'invited'>('all');

  // Load key from session if remembered
  useEffect(() => {
    const savedKey = sessionStorage.getItem('sky_admin_key');
    if (savedKey && (savedKey === 'skyadmin2026' || savedKey.length >= 4)) {
      setAdminKey(savedKey);
      setIsAuthenticated(true);
    }
  }, []);

  const loadData = async (key: string) => {
    setLoading(true);
    const data = await fetchAllSubscribers(key);
    setSubscribers(data);
    setLoading(false);
  };

  useEffect(() => {
    if (isAuthenticated && adminKey) {
      loadData(adminKey);
    }
  }, [isAuthenticated, adminKey]);

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminKey.trim() === 'skyadmin2026' || adminKey.trim().length >= 6) {
      setIsAuthenticated(true);
      setAuthError('');
      sessionStorage.setItem('sky_admin_key', adminKey.trim());
    } else {
      setAuthError('Invalid Admin Passcode. Hint: skyadmin2026');
    }
  };

  const handleStatusChange = async (id: number, newStatus: 'pending' | 'approved' | 'invited') => {
    const success = await updateSubscriberStatus(id, newStatus, adminKey);
    if (success) {
      setSubscribers(prev => prev.map((s: Subscriber) => s.id === id ? { ...s, status: newStatus } : s));
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this subscriber?')) return;
    const success = await deleteSubscriber(id, adminKey);
    if (success) {
      setSubscribers(prev => prev.filter((s: Subscriber) => s.id !== id));
    }
  };

  // Filter & Search Logic
  const filteredSubscribers = subscribers.filter((sub: Subscriber) => {
    const matchesSearch = sub.email.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          sub.ticket_number.toString().includes(searchQuery);
    const matchesFilter = statusFilter === 'all' || sub.status === statusFilter;
    return matchesSearch && matchesFilter;
  });

  const totalCount = subscribers.length;
  const approvedCount = subscribers.filter((s: Subscriber) => s.status === 'approved').length;
  const pendingCount = subscribers.filter((s: Subscriber) => s.status === 'pending').length;
  const invitedCount = subscribers.filter((s: Subscriber) => s.status === 'invited').length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl h-[85vh] sky-glass-panel rounded-3xl border border-white/30 shadow-2xl flex flex-col overflow-hidden text-left bg-[#081326]/95">
        
        {/* Header */}
        <div className="px-6 py-4 bg-white/5 border-b border-white/10 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-sky-500/20 border border-sky-400/30 text-sky-300">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-white tracking-tight font-['Outfit'] flex items-center gap-2">
                <span>SKY Waitlist CMS & Admin Dashboard</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">MySQL Live</span>
              </h2>
              <p className="text-xs text-sky-100/70">Manage waitlist mailing lists, priority tickets & access grants.</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* AUTH MODAL IF NOT LOGGED IN */}
        {!isAuthenticated ? (
          <div className="flex-1 flex items-center justify-center p-6">
            <div className="w-full max-w-md p-8 rounded-3xl bg-slate-900/90 border border-white/20 text-center space-y-6 shadow-2xl">
              <div className="w-14 h-14 rounded-2xl bg-sky-500/20 border border-sky-400/40 flex items-center justify-center mx-auto text-sky-300">
                <Lock className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white font-['Outfit']">Admin Authentication</h3>
                <p className="text-xs text-slate-400 mt-1">Enter your admin security passcode to access subscriber records.</p>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <div className="relative">
                  <Key className="absolute left-4 top-3.5 w-4 h-4 text-slate-400" />
                  <input
                    type="password"
                    value={adminKey}
                    onChange={(e) => setAdminKey(e.target.value)}
                    placeholder="Enter admin passcode (e.g. skyadmin2026)..."
                    className="w-full pl-11 pr-4 py-3 rounded-xl bg-black/60 border border-white/20 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-sky-400"
                  />
                </div>
                {authError && <p className="text-xs text-rose-400 font-medium">{authError}</p>}
                <button
                  type="submit"
                  className="w-full sky-button-primary py-3 rounded-xl text-xs font-bold text-white flex items-center justify-center gap-2"
                >
                  <span>Authenticate & Unlock CMS</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col overflow-hidden p-6 space-y-6">
            
            {/* STATS OVERVIEW CARDS */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 flex-shrink-0">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Total Subscribers</span>
                  <Users className="w-4 h-4 text-sky-400" />
                </div>
                <div className="text-2xl font-extrabold text-white font-mono">{totalCount}</div>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-400/20 space-y-1">
                <div className="flex items-center justify-between text-xs text-emerald-300">
                  <span>Approved Access</span>
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-2xl font-extrabold text-emerald-200 font-mono">{approvedCount}</div>
              </div>

              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-400/20 space-y-1">
                <div className="flex items-center justify-between text-xs text-amber-300">
                  <span>Pending Review</span>
                  <Clock className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-2xl font-extrabold text-amber-200 font-mono">{pendingCount}</div>
              </div>

              <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-400/20 space-y-1">
                <div className="flex items-center justify-between text-xs text-indigo-300">
                  <span>Invites Sent</span>
                  <Send className="w-4 h-4 text-indigo-400" />
                </div>
                <div className="text-2xl font-extrabold text-indigo-200 font-mono">{invitedCount}</div>
              </div>
            </div>

            {/* ACTION BAR: SEARCH, FILTER, EXPORT CSV */}
            <div className="flex flex-wrap items-center justify-between gap-3 flex-shrink-0 pt-2 border-t border-white/10">
              <div className="flex items-center gap-3 flex-1 min-w-[280px]">
                <div className="relative flex-1">
                  <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by email or ticket #..."
                    className="w-full pl-10 pr-4 py-2 rounded-xl bg-black/50 border border-white/20 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-400"
                  />
                </div>

                <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/15 text-xs">
                  <Filter className="w-3.5 h-3.5 text-slate-400 ml-1.5" />
                  {(['all', 'pending', 'approved', 'invited'] as const).map(f => (
                    <button
                      key={f}
                      onClick={() => setStatusFilter(f)}
                      className={`px-2.5 py-1 rounded-lg capitalize transition-colors ${statusFilter === f ? 'bg-sky-500/30 text-sky-200 font-bold border border-sky-400/40' : 'text-slate-400 hover:text-white'}`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => loadData(adminKey)}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-slate-300 hover:text-white transition-colors"
                  title="Refresh List"
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                </button>

                <button
                  onClick={() => exportSubscribersToCSV(filteredSubscribers)}
                  className="px-4 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/40 text-emerald-300 text-xs font-bold flex items-center gap-2 transition-all shadow-md"
                >
                  <Download className="w-4 h-4" />
                  <span>Export CSV</span>
                </button>
              </div>
            </div>

            {/* SUBSCRIBERS DATA TABLE */}
            <div className="flex-1 overflow-y-auto rounded-2xl border border-white/15 bg-black/40">
              <table className="w-full text-left border-collapse text-xs">
                <thead className="sticky top-0 bg-slate-900/90 backdrop-blur-md text-slate-400 border-b border-white/10">
                  <tr>
                    <th className="p-3 font-semibold">Ticket #</th>
                    <th className="p-3 font-semibold">Email Address</th>
                    <th className="p-3 font-semibold">Status</th>
                    <th className="p-3 font-semibold">Registered At</th>
                    <th className="p-3 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-slate-200">
                  {filteredSubscribers.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-slate-500 italic">
                        No subscribers found matching your search.
                      </td>
                    </tr>
                  ) : (
                    filteredSubscribers.map((sub: Subscriber) => (
                      <tr key={sub.id} className="hover:bg-white/5 transition-colors">
                        <td className="p-3 font-mono text-sky-300 font-bold">#{sub.ticket_number}</td>
                        <td className="p-3 font-medium text-white flex items-center gap-2">
                          <Mail className="w-3.5 h-3.5 text-slate-400" />
                          <span>{sub.email}</span>
                        </td>
                        <td className="p-3">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold capitalize inline-flex items-center gap-1 ${
                            sub.status === 'approved' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30' :
                            sub.status === 'invited' ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-400/30' :
                            'bg-amber-500/20 text-amber-300 border border-amber-400/30'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${
                              sub.status === 'approved' ? 'bg-emerald-400' :
                              sub.status === 'invited' ? 'bg-indigo-400' : 'bg-amber-400'
                            }`} />
                            {sub.status}
                          </span>
                        </td>
                        <td className="p-3 text-slate-400 font-mono text-[11px]">
                          {new Date(sub.created_at).toLocaleDateString()} {new Date(sub.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </td>
                        <td className="p-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {sub.status !== 'approved' && (
                              <button
                                onClick={() => handleStatusChange(sub.id, 'approved')}
                                className="px-2 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-400/30 text-[10px] font-semibold"
                              >
                                Approve
                              </button>
                            )}
                            {sub.status !== 'invited' && (
                              <button
                                onClick={() => handleStatusChange(sub.id, 'invited')}
                                className="px-2 py-1 rounded-lg bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 border border-indigo-400/30 text-[10px] font-semibold"
                              >
                                Invite
                              </button>
                            )}
                            <button
                              onClick={() => handleDelete(sub.id)}
                              className="p-1 rounded-lg hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-colors"
                              title="Delete Email"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};

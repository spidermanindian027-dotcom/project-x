'use client';

import * as React from 'react';
import {
  Users,
  Activity,
  Scan,
  Sparkles,
  ShoppingBag,
  ShieldAlert,
  Star,
  CheckCircle2,
  Clock,
  Filter,
  RefreshCw,
  Search,
} from 'lucide-react';
import { VestraButton } from '@/components/ui/vestra-button';
import { VestraCard } from '@/components/ui/vestra-card';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';

interface AdminMetrics {
  totalUsers: number;
  activeUsers: number;
  totalOutfitAnalyses: number;
  averageOutfitScore: number | null;
  totalWardrobeItems: number;
  totalTryOnJobs: number;
  totalSecurityEvents: number;
  registrationTrends: { date: string; count: number }[];
  categoryBreakdown: { category: string; count: number }[];
  errorSummary: { severity: string; count: number }[];
}

interface AuditLog {
  id: string;
  requestId: string;
  timestamp: string;
  severity: 'INFO' | 'WARN' | 'SECURITY' | 'ERROR';
  event: string;
  route: string;
  method: string;
  userId: string | null;
  details?: Record<string, unknown>;
  resolved: boolean;
}

interface ClientUser {
  id: string;
  email: string;
  fullName: string;
  role: string;
  createdAt: string;
  wardrobeCount: number;
  analysesCount: number;
  looksCount: number;
}

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = React.useState<'overview' | 'logs' | 'users'>('overview');
  const [metrics, setMetrics] = React.useState<AdminMetrics | null>(null);
  const [logs, setLogs] = React.useState<AuditLog[]>([]);
  const [users, setUsers] = React.useState<ClientUser[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const [userSearch, setUserSearch] = React.useState('');
  const [severityFilter, setSeverityFilter] = React.useState<string>('ALL');
  const [resolvingId, setResolvingId] = React.useState<string | null>(null);

  React.useEffect(() => {
    let ignore = false;
    async function loadInitial() {
      try {
        const [metricsRes, logsRes, usersRes] = await Promise.all([
          fetch('/api/admin/metrics'),
          fetch('/api/admin/logs?limit=50'),
          fetch('/api/admin/users?limit=50'),
        ]);

        if (ignore) return;

        if (metricsRes.ok) {
          const mData = await metricsRes.json();
          if (mData.success && !ignore) setMetrics(mData.metrics);
        }
        if (logsRes.ok) {
          const lData = await logsRes.json();
          if (lData.success && !ignore) setLogs(lData.logs);
        }
        if (usersRes.ok) {
          const uData = await usersRes.json();
          if (uData.success && !ignore) setUsers(uData.users);
        }
      } catch (err) {
        console.error('Failed to load admin telemetry:', err);
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    }
    void loadInitial();
    return () => {
      ignore = true;
    };
  }, []);

  const handleManualSync = async () => {
    try {
      setIsRefreshing(true);
      const [metricsRes, logsRes, usersRes] = await Promise.all([
        fetch('/api/admin/metrics'),
        fetch('/api/admin/logs?limit=50'),
        fetch('/api/admin/users?limit=50'),
      ]);
      if (metricsRes.ok) {
        const mData = await metricsRes.json();
        if (mData.success) setMetrics(mData.metrics);
      }
      if (logsRes.ok) {
        const lData = await logsRes.json();
        if (lData.success) setLogs(lData.logs);
      }
      if (usersRes.ok) {
        const uData = await usersRes.json();
        if (uData.success) setUsers(uData.users);
      }
    } catch (err) {
      console.error('Failed to sync telemetry:', err);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleToggleResolve = async (logId: string, currentStatus: boolean) => {
    try {
      setResolvingId(logId);
      const res = await fetch(`/api/admin/logs/${logId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resolved: !currentStatus }),
      });
      if (res.ok) {
        setLogs((prev) =>
          prev.map((l) => (l.id === logId ? { ...l, resolved: !currentStatus } : l))
        );
      }
    } catch (err) {
      console.error('Failed to toggle incident resolution:', err);
    } finally {
      setResolvingId(null);
    }
  };

  const filteredLogs = React.useMemo(() => {
    if (severityFilter === 'ALL') return logs;
    return logs.filter((l) => l.severity === severityFilter);
  }, [logs, severityFilter]);

  const filteredUsers = React.useMemo(() => {
    if (!userSearch.trim()) return users;
    const term = userSearch.toLowerCase();
    return users.filter(
      (u) =>
        u.fullName.toLowerCase().includes(term) ||
        u.email.toLowerCase().includes(term) ||
        u.id.toLowerCase().includes(term)
    );
  }, [users, userSearch]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <LoadingSpinner className="h-8 w-8 text-[#e8c547]" />
        <p className="font-mono text-xs text-[#9ca3af] tracking-widest uppercase">
          Synthesizing Atelier Telemetry...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Title & Navigation */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#9ca3af]/15 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] uppercase font-mono tracking-[0.2em] text-[#e8c547] bg-[#e8c547]/10 px-2 py-0.5 border border-[#e8c547]/30 rounded-sm">
              Root Governance
            </span>
            <span className="text-xs text-[#9ca3af] font-mono">Central Atelier Node</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#f5f0e8] tracking-tight">
            Administrative Command
          </h1>
          <p className="text-xs text-[#9ca3af] mt-0.5">
            Real-time platform operations, client registry metrics, and operational audit telemetry.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <VestraButton
            variant="ghost"
            size="sm"
            onClick={() => void handleManualSync()}
            disabled={isRefreshing}
            className="border border-[#9ca3af]/20 text-xs font-mono text-[#9ca3af] hover:text-[#f5f0e8]"
          >
            <RefreshCw className={`h-3.5 w-3.5 mr-1.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            Sync Telemetry
          </VestraButton>

          {/* Tab Selector */}
          <div className="flex items-center bg-[#262626] border border-[#9ca3af]/20 p-1 rounded-sm text-xs font-mono">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-3 py-1 rounded-sm transition-colors ${
                activeTab === 'overview'
                  ? 'bg-[#e8c547] text-black font-semibold'
                  : 'text-[#9ca3af] hover:text-[#f5f0e8]'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('logs')}
              className={`px-3 py-1 rounded-sm transition-colors ${
                activeTab === 'logs'
                  ? 'bg-[#e8c547] text-black font-semibold'
                  : 'text-[#9ca3af] hover:text-[#f5f0e8]'
              }`}
            >
              Audit Logs ({logs.length})
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`px-3 py-1 rounded-sm transition-colors ${
                activeTab === 'users'
                  ? 'bg-[#e8c547] text-black font-semibold'
                  : 'text-[#9ca3af] hover:text-[#f5f0e8]'
              }`}
            >
              Client Roster ({users.length})
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: OVERVIEW & TELEMETRY CHARTS */}
      {/* ========================================================================= */}
      {activeTab === 'overview' && metrics && (
        <div className="space-y-8">
          {/* Key Metric KPI Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
            <VestraCard className="p-4 border-[#9ca3af]/15 bg-[#1c1c1c]">
              <div className="flex items-center justify-between text-[#9ca3af] mb-2">
                <span className="text-[10px] uppercase font-mono tracking-wider">Clients</span>
                <Users className="h-4 w-4 text-[#e8c547]" />
              </div>
              <p className="text-2xl font-serif font-bold text-[#f5f0e8]">{metrics.totalUsers}</p>
              <p className="text-[10px] text-[#9ca3af] font-mono mt-1">Total Registered</p>
            </VestraCard>

            <VestraCard className="p-4 border-[#9ca3af]/15 bg-[#1c1c1c]">
              <div className="flex items-center justify-between text-[#9ca3af] mb-2">
                <span className="text-[10px] uppercase font-mono tracking-wider">Active 7D</span>
                <Activity className="h-4 w-4 text-emerald-400" />
              </div>
              <p className="text-2xl font-serif font-bold text-[#f5f0e8]">{metrics.activeUsers}</p>
              <p className="text-[10px] text-emerald-400/80 font-mono mt-1">Active Sessions</p>
            </VestraCard>

            <VestraCard className="p-4 border-[#9ca3af]/15 bg-[#1c1c1c]">
              <div className="flex items-center justify-between text-[#9ca3af] mb-2">
                <span className="text-[10px] uppercase font-mono tracking-wider">Scans</span>
                <Scan className="h-4 w-4 text-sky-400" />
              </div>
              <p className="text-2xl font-serif font-bold text-[#f5f0e8]">{metrics.totalOutfitAnalyses}</p>
              <p className="text-[10px] text-[#9ca3af] font-mono mt-1">Outfit Analyses</p>
            </VestraCard>

            <VestraCard className="p-4 border-[#9ca3af]/15 bg-[#1c1c1c]">
              <div className="flex items-center justify-between text-[#9ca3af] mb-2">
                <span className="text-[10px] uppercase font-mono tracking-wider">Avg Score</span>
                <Star className="h-4 w-4 text-[#e8c547]" />
              </div>
              <p className="text-2xl font-serif font-bold text-[#f5f0e8]">
                {metrics.averageOutfitScore !== null ? `${metrics.averageOutfitScore}` : '—'}
              </p>
              <p className="text-[10px] text-[#9ca3af] font-mono mt-1">Atelier Quality</p>
            </VestraCard>

            <VestraCard className="p-4 border-[#9ca3af]/15 bg-[#1c1c1c]">
              <div className="flex items-center justify-between text-[#9ca3af] mb-2">
                <span className="text-[10px] uppercase font-mono tracking-wider">Garments</span>
                <ShoppingBag className="h-4 w-4 text-purple-400" />
              </div>
              <p className="text-2xl font-serif font-bold text-[#f5f0e8]">{metrics.totalWardrobeItems}</p>
              <p className="text-[10px] text-[#9ca3af] font-mono mt-1">Cataloged</p>
            </VestraCard>

            <VestraCard className="p-4 border-[#9ca3af]/15 bg-[#1c1c1c]">
              <div className="flex items-center justify-between text-[#9ca3af] mb-2">
                <span className="text-[10px] uppercase font-mono tracking-wider">Try-Ons</span>
                <Sparkles className="h-4 w-4 text-[#e8c547]" />
              </div>
              <p className="text-2xl font-serif font-bold text-[#f5f0e8]">{metrics.totalTryOnJobs}</p>
              <p className="text-[10px] text-[#9ca3af] font-mono mt-1">VTON Syntheses</p>
            </VestraCard>

            <VestraCard className="p-4 border-[#9ca3af]/15 bg-[#1c1c1c]">
              <div className="flex items-center justify-between text-[#9ca3af] mb-2">
                <span className="text-[10px] uppercase font-mono tracking-wider">Incidents</span>
                <ShieldAlert className="h-4 w-4 text-amber-400" />
              </div>
              <p className="text-2xl font-serif font-bold text-[#f5f0e8]">{metrics.totalSecurityEvents}</p>
              <p className="text-[10px] text-[#9ca3af] font-mono mt-1">Audit Entries</p>
            </VestraCard>
          </div>

          {/* Visual Analytical Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 14-Day Registration Trajectory */}
            <VestraCard className="p-6 border-[#9ca3af]/15 bg-[#1a1a1a]">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#f5f0e8]">
                    Client Onboarding Velocity
                  </h3>
                  <p className="text-xs text-[#9ca3af] font-mono">14-Day Registration Trajectory</p>
                </div>
                <div className="text-[10px] font-mono text-[#e8c547] bg-[#e8c547]/10 px-2 py-0.5 border border-[#e8c547]/30 rounded">
                  DAILY ADMISSION
                </div>
              </div>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={metrics.registrationTrends}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#9ca3af" strokeOpacity={0.1} />
                    <XAxis
                      dataKey="date"
                      stroke="#9ca3af"
                      fontSize={10}
                      tickLine={false}
                      tickFormatter={(val: string) => val.slice(5)}
                    />
                    <YAxis stroke="#9ca3af" fontSize={10} tickLine={false} allowDecimals={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#262626',
                        borderColor: '#9ca3af33',
                        color: '#f5f0e8',
                        fontSize: '12px',
                        fontFamily: 'monospace',
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="count"
                      stroke="#e8c547"
                      strokeWidth={2}
                      dot={{ fill: '#e8c547', r: 3 }}
                      activeDot={{ r: 5 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </VestraCard>

            {/* Wardrobe Catalog Category Volume */}
            <VestraCard className="p-6 border-[#9ca3af]/15 bg-[#1a1a1a]">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#f5f0e8]">
                    Wardrobe Category Density
                  </h3>
                  <p className="text-xs text-[#9ca3af] font-mono">Total garments logged across network</p>
                </div>
                <div className="text-[10px] font-mono text-[#9ca3af] bg-white/5 px-2 py-0.5 border border-[#9ca3af]/20 rounded">
                  SPECTRUM
                </div>
              </div>
              <div className="h-64 w-full">
                {metrics.categoryBreakdown.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={metrics.categoryBreakdown}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#9ca3af" strokeOpacity={0.1} />
                      <XAxis
                        dataKey="category"
                        stroke="#9ca3af"
                        fontSize={9}
                        tickLine={false}
                        interval={0}
                        angle={-25}
                        textAnchor="end"
                      />
                      <YAxis stroke="#9ca3af" fontSize={10} tickLine={false} allowDecimals={false} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#262626',
                          borderColor: '#9ca3af33',
                          color: '#f5f0e8',
                          fontSize: '12px',
                          fontFamily: 'monospace',
                        }}
                      />
                      <Bar dataKey="count" fill="#9ca3af" radius={[2, 2, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-xs text-[#9ca3af] font-mono">
                    No wardrobe garments logged yet.
                  </div>
                )}
              </div>
            </VestraCard>
          </div>

          {/* Security Incident Breakdown */}
          <VestraCard className="p-6 border-[#9ca3af]/15 bg-[#1a1a1a]">
            <h3 className="font-serif text-lg font-bold text-[#f5f0e8] mb-1">
              Operational Incident Breakdown
            </h3>
            <p className="text-xs text-[#9ca3af] font-mono mb-4">
              Categorized system exceptions and security events
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {['INFO', 'WARN', 'SECURITY', 'ERROR'].map((sev) => {
                const found = metrics.errorSummary.find((s) => s.severity === sev);
                const count = found ? found.count : 0;
                const colors: Record<string, string> = {
                  INFO: 'text-sky-400 border-sky-400/30 bg-sky-400/10',
                  WARN: 'text-amber-400 border-amber-400/30 bg-amber-400/10',
                  SECURITY: 'text-orange-400 border-orange-400/30 bg-orange-400/10',
                  ERROR: 'text-red-400 border-red-400/30 bg-red-400/10',
                };
                return (
                  <div
                    key={sev}
                    className={`p-4 border rounded-sm flex items-center justify-between ${colors[sev]}`}
                  >
                    <div>
                      <span className="text-[10px] font-mono font-bold tracking-wider">{sev}</span>
                      <p className="text-2xl font-serif font-bold text-[#f5f0e8] mt-1">{count}</p>
                    </div>
                    <span className="text-[10px] font-mono text-[#9ca3af]">Events</span>
                  </div>
                );
              })}
            </div>
          </VestraCard>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: OPERATIONAL LOGS VIEWER */}
      {/* ========================================================================= */}
      {activeTab === 'logs' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#1e1e1e] p-3 border border-[#9ca3af]/15 rounded-sm">
            <div className="flex items-center gap-2">
              <Filter className="h-3.5 w-3.5 text-[#9ca3af]" />
              <span className="text-xs font-mono text-[#9ca3af]">Filter Severity:</span>
              <div className="flex items-center gap-1">
                {['ALL', 'INFO', 'WARN', 'SECURITY', 'ERROR'].map((sev) => (
                  <button
                    key={sev}
                    onClick={() => setSeverityFilter(sev)}
                    className={`px-2 py-0.5 rounded text-[10px] font-mono tracking-wider transition-colors ${
                      severityFilter === sev
                        ? 'bg-[#e8c547] text-black font-bold'
                        : 'bg-white/5 text-[#9ca3af] hover:text-[#f5f0e8]'
                    }`}
                  >
                    {sev}
                  </button>
                ))}
              </div>
            </div>

            <span className="text-xs font-mono text-[#9ca3af]">
              Showing {filteredLogs.length} audit entries
            </span>
          </div>

          <VestraCard className="border-[#9ca3af]/15 bg-[#1a1a1a] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#9ca3af]/15 bg-[#222222] font-mono text-[10px] uppercase tracking-wider text-[#9ca3af]">
                    <th className="py-3 px-4">Severity</th>
                    <th className="py-3 px-4">Event Type</th>
                    <th className="py-3 px-4">Route & Method</th>
                    <th className="py-3 px-4">Request ID</th>
                    <th className="py-3 px-4">Timestamp</th>
                    <th className="py-3 px-4 text-right">Status / Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#9ca3af]/10 font-mono">
                  {filteredLogs.length > 0 ? (
                    filteredLogs.map((log) => {
                      const sevBadgeStyles: Record<string, string> = {
                        INFO: 'text-sky-400 bg-sky-400/10 border-sky-400/30',
                        WARN: 'text-amber-400 bg-amber-400/10 border-amber-400/30',
                        SECURITY: 'text-orange-400 bg-orange-400/10 border-orange-400/30',
                        ERROR: 'text-red-400 bg-red-400/10 border-red-400/30',
                      };
                      return (
                        <tr key={log.id} className="hover:bg-white/[0.02] transition-colors">
                          <td className="py-3 px-4">
                            <span
                              className={`inline-block text-[9px] font-bold px-1.5 py-0.5 border rounded-sm ${
                                sevBadgeStyles[log.severity] || 'text-[#9ca3af]'
                              }`}
                            >
                              {log.severity}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-[#f5f0e8] font-semibold">{log.event}</td>
                          <td className="py-3 px-4 text-[#d4cfc7]">
                            <span className="text-[#9ca3af] mr-1.5">{log.method}</span>
                            {log.route}
                          </td>
                          <td className="py-3 px-4 text-[#9ca3af] text-[11px] truncate max-w-[120px]">
                            {log.requestId}
                          </td>
                          <td className="py-3 px-4 text-[#9ca3af] text-[11px]">
                            {new Date(log.timestamp).toLocaleString()}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <button
                              onClick={() => void handleToggleResolve(log.id, log.resolved)}
                              disabled={resolvingId === log.id}
                              className={`px-2.5 py-1 rounded text-[10px] font-mono tracking-wider transition-colors inline-flex items-center gap-1 ${
                                log.resolved
                                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20'
                                  : 'bg-white/5 text-[#9ca3af] border border-[#9ca3af]/20 hover:text-[#f5f0e8]'
                              }`}
                            >
                              {log.resolved ? (
                                <>
                                  <CheckCircle2 className="h-3 w-3" />
                                  <span>RESOLVED</span>
                                </>
                              ) : (
                                <>
                                  <Clock className="h-3 w-3" />
                                  <span>OPEN</span>
                                </>
                              )}
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={6} className="text-center py-8 text-xs text-[#9ca3af]">
                        No audit events recorded under this filter.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </VestraCard>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: CLIENT USER ROSTER */}
      {/* ========================================================================= */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#1e1e1e] p-3 border border-[#9ca3af]/15 rounded-sm">
            <div className="relative flex-1 max-w-md">
              <Search className="h-3.5 w-3.5 text-[#9ca3af] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search clients by name, email, or client ID..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                className="w-full bg-[#141414] border border-[#9ca3af]/20 rounded-sm pl-9 pr-3 py-1.5 text-xs text-[#f5f0e8] placeholder-[#9ca3af]/50 focus:border-[#e8c547] focus:outline-none"
              />
            </div>
            <span className="text-xs font-mono text-[#9ca3af]">
              {filteredUsers.length} client dossiers
            </span>
          </div>

          <VestraCard className="border-[#9ca3af]/15 bg-[#1a1a1a] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#9ca3af]/15 bg-[#222222] font-mono text-[10px] uppercase tracking-wider text-[#9ca3af]">
                    <th className="py-3 px-4">Client Name</th>
                    <th className="py-3 px-4">Email</th>
                    <th className="py-3 px-4">Role Tier</th>
                    <th className="py-3 px-4 text-center">Wardrobe Items</th>
                    <th className="py-3 px-4 text-center">Analyses</th>
                    <th className="py-3 px-4 text-center">Looks</th>
                    <th className="py-3 px-4 text-right">Joined Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#9ca3af]/10 font-mono">
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((u) => (
                      <tr key={u.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="py-3 px-4 font-semibold text-[#f5f0e8] font-sans">
                          {u.fullName}
                        </td>
                        <td className="py-3 px-4 text-[#9ca3af]">{u.email}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`inline-block text-[9px] font-bold px-1.5 py-0.5 border rounded-sm ${
                              u.role === 'ADMIN'
                                ? 'text-[#e8c547] border-[#e8c547]/40 bg-[#e8c547]/10'
                                : 'text-[#9ca3af] border-[#9ca3af]/30 bg-white/5'
                            }`}
                          >
                            {u.role}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center text-[#d4cfc7]">{u.wardrobeCount}</td>
                        <td className="py-3 px-4 text-center text-[#d4cfc7]">{u.analysesCount}</td>
                        <td className="py-3 px-4 text-center text-[#d4cfc7]">{u.looksCount}</td>
                        <td className="py-3 px-4 text-right text-[#9ca3af] text-[11px]">
                          {new Date(u.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="text-center py-8 text-xs text-[#9ca3af]">
                        No clients found matching the query.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </VestraCard>
        </div>
      )}
    </div>
  );
}

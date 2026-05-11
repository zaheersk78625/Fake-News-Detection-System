import React, {useEffect, useState} from 'react';
import {collection, getDocs, query, orderBy, limit} from 'firebase/firestore';
import {db} from '../../lib/firebase';
import {Shield, Users, Activity, AlertCircle} from 'lucide-react';

export function AdminPanel() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalChecks: 0,
    flaggedContent: 0,
  });
  const [recentLogs, setRecentLogs] = useState<any[]>([]);

  useEffect(() => {
    // In a real app, these would be aggregated. Here we just fetch counts.
    const fetchStats = async () => {
      // Mocking some stats for the demo admin panel
      setStats({
        totalUsers: 124,
        totalChecks: 852,
        flaggedContent: 42,
      });

      // Fetching some "logs" (just recent checks for now)
      try {
        const q = query(collection(db, 'newsChecks'), orderBy('createdAt', 'desc'), limit(10));
        const snap = await getDocs(q);
        setRecentLogs(snap.docs.map(d => ({id: d.id, ...d.data()})));
      } catch (e) {
        console.error(e);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      <header>
        <h2 className="text-3xl font-bold text-slate-900">System Administration</h2>
        <p className="text-slate-500 mt-1">Global system health, user activity, and model performance metrics.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mb-4">
            <Users className="w-5 h-5" />
          </div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Users</p>
          <p className="text-3xl font-bold text-slate-900">{stats.totalUsers}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-4">
            <Activity className="w-5 h-5" />
          </div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Analysis Volume</p>
          <p className="text-3xl font-bold text-slate-900">{stats.totalChecks}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="w-10 h-10 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center mb-4">
            <AlertCircle className="w-5 h-5" />
          </div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Flagged Items</p>
          <p className="text-3xl font-bold text-slate-900">{stats.flaggedContent}</p>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-slate-900">System Activity Logs</h3>
          <span className="px-2 py-1 bg-slate-100 text-[10px] font-bold rounded uppercase">Real-time</span>
        </div>
        <div className="divide-y divide-slate-100">
          {recentLogs.map((log, i) => (
            <div key={log.id} className="px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-xs font-bold text-slate-500">
                  {i + 1}
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900 max-w-sm truncate">{log.content}</p>
                  <p className="text-[10px] text-slate-400">ID: {log.id}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                  log.prediction === 'Fake' ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'
                }`}>
                  {log.prediction}
                </span>
                <button className="text-xs font-semibold text-indigo-600 hover:underline">View</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

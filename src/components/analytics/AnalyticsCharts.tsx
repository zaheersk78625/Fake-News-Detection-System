import React, {useMemo} from 'react';
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid
} from 'recharts';
import {NewsCheck} from '../../types';
import {TrendingUp, Activity, Target, ShieldCheck} from 'lucide-react';

export function AnalyticsCharts({history}: {history: NewsCheck[]}) {
  const stats = useMemo(() => {
    const total = history.length;
    const real = history.filter(c => c.prediction === 'Real').length;
    const fake = history.filter(c => c.prediction === 'Fake').length;
    const uncertain = history.filter(c => c.prediction === 'Uncertain').length;
    const avgConfidence = total > 0 
      ? history.reduce((acc, c) => acc + c.confidence, 0) / total 
      : 0;

    return { total, real, fake, uncertain, avgConfidence };
  }, [history]);

  const pieData = [
    { name: 'Real', value: stats.real, color: '#10b981' },
    { name: 'Fake', value: stats.fake, color: '#f43f5e' },
    { name: 'Uncertain', value: stats.uncertain, color: '#f59e0b' },
  ].filter(d => d.value > 0);

  const barData = useMemo(() => {
    // Group by day for the last 7 days
    const last7Days = Array.from({length: 7}, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return d.toISOString().split('T')[0];
    }).reverse();

    return last7Days.map(date => {
      const dayChecks = history.filter(h => h.createdAt.toISOString().split('T')[0] === date);
      return {
        date: new Date(date).toLocaleDateString('en-US', {month: 'short', day: 'numeric'}),
        Real: dayChecks.filter(h => h.prediction === 'Real').length,
        Fake: dayChecks.filter(h => h.prediction === 'Fake').length,
      };
    });
  }, [history]);

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      <header>
        <h2 className="text-3xl font-bold text-slate-900">Intelligence Analytics</h2>
        <p className="text-slate-500 mt-1">Key metrics and trends from your news verification activity.</p>
      </header>

      {/* Hero Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Analyzed', value: stats.total, icon: <Activity className="w-5 h-5" />, color: 'bg-indigo-50 text-indigo-600' },
          { label: 'Fake Detected', value: stats.fake, icon: <ShieldCheck className="w-5 h-5" />, color: 'bg-rose-50 text-rose-600' },
          { label: 'Avg Confidence', value: `${Math.round(stats.avgConfidence)}%`, icon: <Target className="w-5 h-5" />, color: 'bg-emerald-50 text-emerald-600' },
          { label: 'Integrity Score', value: `${Math.round(stats.real / (stats.total || 1) * 100)}%`, icon: <TrendingUp className="w-5 h-5" />, color: 'bg-amber-50 text-amber-600' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className={`p-3 rounded-xl ${stat.color}`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400 leading-none mb-1">{stat.label}</p>
              <p className="text-2xl font-bold text-slate-900 leading-none">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Composition Chart */}
        <div className="lg:col-span-1 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
          <h3 className="font-bold text-slate-900 mb-6">Article Authenticity Mix</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                />
                <Legend iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Activity Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
          <h3 className="font-bold text-slate-900 mb-6">Verification Activity (Last 7 Days)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8'}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8'}} />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                />
                <Legend iconType="circle" verticalAlign="top" align="right" wrapperStyle={{paddingBottom: '20px'}} />
                <Bar dataKey="Real" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Fake" fill="#f43f5e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

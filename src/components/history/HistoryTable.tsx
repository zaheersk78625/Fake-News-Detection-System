import React, {useEffect, useState} from 'react';
import {getUserHistory} from '../../services/dbService';
import {NewsCheck} from '../../types';
import {formatConfidence, cn} from '../../lib/utils';
import {MoreVertical, ExternalLink, Trash2, ShieldAlert, ShieldCheck, HelpCircle} from 'lucide-react';

export function HistoryTable() {
  const [history, setHistory] = useState<NewsCheck[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const data = await getUserHistory();
      setHistory(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getPredictionBadge = (prediction: string) => {
    switch (prediction) {
      case 'Real': return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
          <ShieldCheck className="w-3 h-3" /> Real
        </span>
      );
      case 'Fake': return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-800">
          <ShieldAlert className="w-3 h-3" /> Fake
        </span>
      );
      default: return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
          <HelpCircle className="w-3 h-3" /> Uncertain
        </span>
      );
    }
  };

  if (loading) {
    return (
      <div className="p-8 space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-16 bg-slate-100 animate-pulse rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Analysis History</h2>
          <p className="text-slate-500 mt-1">Review your past news authenticity checks and their results.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-semibold hover:bg-slate-50 transition-colors">
          <Trash2 className="w-4 h-4 text-slate-500" />
          Clear All
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 border-bottom border-slate-100">
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-400">Article Excerpt</th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-400">Prediction</th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-400">Confidence</th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-400">Date</th>
              <th className="px-6 py-4 text-right"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {history.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                  No checks performed yet. Start by checking a news article!
                </td>
              </tr>
            ) : (
              history.map((check) => (
                <tr key={check.id} className="group hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 max-w-md">
                    <p className="text-sm text-slate-600 line-clamp-1 group-hover:text-slate-900 transition-colors">
                      {check.content}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    {getPredictionBadge(check.prediction)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className={cn(
                            "h-full transition-all duration-500",
                            check.confidence > 80 ? "bg-emerald-500" : check.confidence > 50 ? "bg-amber-500" : "bg-rose-500"
                          )} 
                          style={{width: `${check.confidence}%`}} 
                        />
                      </div>
                      <span className="text-xs font-mono font-medium text-slate-500">{formatConfidence(check.confidence)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-xs text-slate-400 font-medium">
                      {check.createdAt.toLocaleDateString()}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 hover:bg-white hover:shadow-sm rounded-lg border border-transparent hover:border-slate-200 transition-all">
                        <ExternalLink className="w-4 h-4 text-slate-400" />
                      </button>
                      <button className="p-2 hover:bg-white hover:shadow-sm rounded-lg border border-transparent hover:border-slate-200 transition-all text-red-500">
                        <Trash2 className="w-4 h-4" />
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
  );
}

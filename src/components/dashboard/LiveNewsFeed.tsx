import React, {useState} from 'react';
import {Newspaper, ExternalLink, AlertTriangle, CheckCircle} from 'lucide-react';
import {analyzeNews} from '../../services/aiService';
import {cn} from '../../lib/utils';

interface NewsItem {
  id: string;
  title: string;
  source: string;
  time: string;
  summary: string;
  status: 'Unchecked' | 'Real' | 'Fake';
}

export function LiveNewsFeed() {
  const [news, setNews] = useState<NewsItem[]>([
    {
      id: '1',
      title: 'Global economy shows signs of unprecedented growth in Q3',
      source: 'Finance Daily',
      time: '2 mins ago',
      summary: 'Reports indicate a 12% increase in industrial output across major emerging markets...',
      status: 'Unchecked'
    },
    {
      id: '2',
      title: 'New study claims coffee prevents all known viral infections',
      source: 'HealthWire',
      time: '15 mins ago',
      summary: 'A viral social media post claims researchers in Zurich found a compound in roasted beans...',
      status: 'Unchecked'
    }
  ]);

  const [analyzing, setAnalyzing] = useState<string | null>(null);

  const handleVerify = async (id: string, content: string) => {
    setAnalyzing(id);
    try {
      const result = await analyzeNews(content);
      setNews(prev => prev.map(item => 
        item.id === id ? { ...item, status: result.prediction } : item
      ));
    } catch (e) {
      console.error(e);
    } finally {
      setAnalyzing(null);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
      <div className="bg-slate-900 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
          <h3 className="text-white font-bold text-sm uppercase tracking-wider">Live Monitoring</h3>
        </div>
        <button className="text-[10px] text-slate-400 font-bold hover:text-white transition-colors">REFRESH FEED</button>
      </div>

      <div className="divide-y divide-slate-100">
        {news.map(item => (
          <div key={item.id} className="p-6 hover:bg-slate-50 transition-colors group">
            <div className="flex items-start justify-between gap-4 mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded uppercase">{item.source}</span>
                  <span className="text-[10px] text-slate-400 font-medium">{item.time}</span>
                </div>
                <h4 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors leading-snug">{item.title}</h4>
              </div>
              <div className="flex items-center gap-2">
                {item.status === 'Real' && <CheckCircle className="w-5 h-5 text-emerald-500" />}
                {item.status === 'Fake' && <AlertTriangle className="w-5 h-5 text-rose-500" />}
              </div>
            </div>
            
            <p className="text-xs text-slate-500 line-clamp-2 mb-4 leading-relaxed">{item.summary}</p>
            
            <div className="flex items-center gap-3">
              {item.status === 'Unchecked' ? (
                <button 
                  onClick={() => handleVerify(item.id, item.title + ' ' + item.summary)}
                  disabled={!!analyzing}
                  className="px-4 py-2 bg-slate-900 text-white rounded-lg text-[10px] font-bold hover:bg-slate-800 disabled:opacity-50 transition-all flex items-center gap-2"
                >
                  {analyzing === item.id ? 'Analyzing...' : 'Auto-Verify'}
                </button>
              ) : (
                <span className={cn(
                  "px-3 py-1 rounded-lg text-[10px] font-bold uppercase",
                  item.status === 'Real' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                )}>
                  Verified: {item.status}
                </span>
              )}
              <button className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all">
                <ExternalLink className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

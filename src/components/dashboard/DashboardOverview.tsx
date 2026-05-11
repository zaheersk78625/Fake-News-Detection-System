import React from 'react';
import {Shield, Newspaper, Users, Zap, ArrowRight, MessageSquare} from 'lucide-react';
import {LiveNewsFeed} from './LiveNewsFeed';

export function DashboardOverview({onNavigate}: {onNavigate: (tab: string) => void}) {
  return (
    <div className="p-8 max-w-6xl mx-auto space-y-12">
      <header className="relative isolate overflow-hidden bg-slate-900 px-8 py-16 rounded-[2rem] text-white shadow-2xl">
        {/* ... existing header content ... */}
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-5xl font-bold tracking-tight mb-6">Defend Against Disinformation.</h1>
          <p className="text-slate-400 text-lg leading-relaxed mb-10">
            Powered by advanced neural networks and Gemini AI, Verity provides 
            real-time verification of news headlines, articles, and social media claims.
          </p>
          <div className="flex gap-4">
            <button 
              onClick={() => onNavigate('checker')}
              className="bg-white text-slate-900 px-8 py-4 rounded-xl font-bold flex items-center gap-2 hover:bg-slate-100 transition-all shadow-lg active:scale-95"
            >
              Start Analysis <ArrowRight className="w-5 h-5" />
            </button>
            <button className="bg-white/10 text-white border border-white/20 px-8 py-4 rounded-xl font-bold hover:bg-white/20 transition-all">
              Enterprise APIs
            </button>
          </div>
        </div>
        
        <div className="absolute top-0 right-0 p-12 opacity-10">
          <Shield className="w-96 h-96 -mr-24 -mt-24 rotate-12" />
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 flex flex-col gap-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                title: 'Real-time Verification',
                description: 'Instantly analyze text or URLs using state-of-the-art NLP models.',
                icon: <Zap className="w-5 h-5" />,
                color: 'bg-amber-100 text-amber-600'
              },
              {
                title: 'Deep Context Analysis',
                description: 'Our AI understands nuance, sarcasm, and misleading narratives.',
                icon: <Newspaper className="w-5 h-5" />,
                color: 'bg-indigo-100 text-indigo-600'
              }
            ].map((feature, i) => (
              <div key={i} className="p-6 bg-white border border-slate-200 rounded-3xl hover:shadow-lg transition-all">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${feature.color}`}>
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-slate-500 leading-relaxed text-xs">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>

          <section className="bg-slate-50 border border-slate-100 p-8 rounded-[2rem] flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1 space-y-4">
              <h2 className="text-2xl font-bold tracking-tight">Global News Intel</h2>
              <p className="text-slate-500 leading-relaxed text-sm">
                Verity AI supports 50+ languages, enabling verification for global news cycles.
              </p>
            </div>
            <div className="w-full md:w-1/2 grid grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                <p className="text-2xl font-bold text-slate-900">98%</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Accuracy</p>
              </div>
              <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                <p className="text-2xl font-bold text-slate-900">2ms</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Latency</p>
              </div>
            </div>
          </section>
        </div>

        <div className="lg:col-span-1">
          <LiveNewsFeed />
        </div>
      </div>
    </div>
  );
}

function CheckCircle({className}: {className?: string}) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
    </svg>
  );
}

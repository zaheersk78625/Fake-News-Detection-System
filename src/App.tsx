import React, {useState, useEffect} from 'react';
import {onAuthStateChanged, signInWithPopup} from 'firebase/auth';
import {auth, googleProvider} from './lib/firebase';
import {AppLayout} from './components/layout/AppLayout';
import {DashboardOverview} from './components/dashboard/DashboardOverview';
import {NewsChecker} from './components/checker/NewsChecker';
import {HistoryTable} from './components/history/HistoryTable';
import {AnalyticsCharts} from './components/analytics/AnalyticsCharts';
import {AdminPanel} from './components/admin/AdminPanel';
import {getUserHistory} from './services/dbService';
import {NewsCheck} from './types';
import {Shield, LogIn} from 'lucide-react';
import {motion} from 'motion/react';
import {Toaster, toast} from 'sonner';

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [history, setHistory] = useState<NewsCheck[]>([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
      if (u) {
        fetchHistory();
      }
    });
    return unsubscribe;
  }, []);

  const fetchHistory = async () => {
    try {
      const data = await getUserHistory();
      setHistory(data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      toast.success('Successfully logged in!');
    } catch (error) {
      toast.error('Login failed. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Shield className="w-12 h-12 text-white animate-pulse" />
          <p className="text-slate-400 font-mono text-sm animate-pulse">Initializing Verity AI...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-6 text-center">
        <Toaster position="top-center" />
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           className="max-w-md w-full space-y-8"
        >
          <div className="bg-white/5 p-4 rounded-2xl inline-block mb-4 border border-white/10">
            <Shield className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white tracking-tight">Verity AI</h1>
          <p className="text-slate-400 text-lg">
            Professional AI-powered fake news detection. Login with your Google account to start protecting your information landscape.
          </p>

          <button
            onClick={handleLogin}
            className="w-full bg-white text-slate-900 py-4 rounded-xl font-bold flex items-center justify-center gap-3 hover:bg-slate-100 transition-all shadow-2xl active:scale-95 group"
          >
            <LogIn className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            Sign in with Google
          </button>
          
          <div className="pt-12 grid grid-cols-3 gap-4 opacity-50 grayscale hover:grayscale-0 transition-all duration-700">
             <div className="flex flex-col items-center cursor-default">
               <div className="h-0.5 w-full bg-white/20 mb-3" />
               <p className="text-[10px] text-white font-bold tracking-widest uppercase">NLP 3.0</p>
             </div>
             <div className="flex flex-col items-center cursor-default">
               <div className="h-0.5 w-full bg-white/20 mb-3" />
               <p className="text-[10px] text-white font-bold tracking-widest uppercase">Gemini 2.0</p>
             </div>
             <div className="flex flex-col items-center cursor-default">
               <div className="h-0.5 w-full bg-white/20 mb-3" />
               <p className="text-[10px] text-white font-bold tracking-widest uppercase">Real-Time</p>
             </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <AppLayout activeTab={activeTab} setActiveTab={setActiveTab}>
      <Toaster position="top-right" />
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
        {activeTab === 'dashboard' && <DashboardOverview onNavigate={setActiveTab} />}
        {activeTab === 'checker' && <NewsChecker />}
        {activeTab === 'history' && <HistoryTable />}
        {activeTab === 'analytics' && <AnalyticsCharts history={history} />}
        {activeTab === 'admin' && <AdminPanel />}
      </div>
    </AppLayout>
  );
}

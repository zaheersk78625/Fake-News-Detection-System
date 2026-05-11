import React from 'react';
import {Shield, User, LogOut, LayoutDashboard, Search, History, BarChart3} from 'lucide-react';
import {auth} from '../../lib/firebase';
import {signOut} from 'firebase/auth';
import {cn} from '../../lib/utils';

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick: () => void;
}

const NavItem = ({icon, label, active, onClick}: NavItemProps) => (
  <button
    onClick={onClick}
    className={cn(
      "flex items-center gap-3 w-full px-4 py-3 text-sm font-medium transition-all duration-200 rounded-lg",
      active 
        ? "bg-slate-900 text-white shadow-lg shadow-slate-200" 
        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
    )}
  >
    {icon}
    {label}
  </button>
);

export function AppLayout({children, activeTab, setActiveTab}: {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}) {
  const user = auth.currentUser;

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Sidebar */}
      <aside className="w-64 border-r border-slate-200 bg-white p-6 flex flex-col gap-8 sticky top-0 h-screen">
        <div className="flex items-center gap-2 px-2">
          <div className="bg-slate-900 p-2 rounded-xl">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <h1 className="font-bold text-xl tracking-tight">Verity AI</h1>
        </div>

        <nav className="flex-1 flex flex-col gap-2">
          <NavItem 
            icon={<LayoutDashboard className="w-5 h-5" />} 
            label="Dashboard" 
            active={activeTab === 'dashboard'} 
            onClick={() => setActiveTab('dashboard')} 
          />
          <NavItem 
            icon={<Search className="w-5 h-5" />} 
            label="News Checker" 
            active={activeTab === 'checker'} 
            onClick={() => setActiveTab('checker')} 
          />
          <NavItem 
            icon={<History className="w-5 h-5" />} 
            label="History" 
            active={activeTab === 'history'} 
            onClick={() => setActiveTab('history')} 
          />
          <NavItem 
            icon={<BarChart3 className="w-5 h-5" />} 
            label="Analytics" 
            active={activeTab === 'analytics'} 
            onClick={() => setActiveTab('analytics')} 
          />
          {user?.email === 'zaheersk991@gmail.com' && (
            <NavItem 
              icon={<Shield className="w-5 h-5" />} 
              label="Admin Panel" 
              active={activeTab === 'admin'} 
              onClick={() => setActiveTab('admin')} 
            />
          )}
        </nav>

        <div className="border-t border-slate-100 pt-6 flex flex-col gap-4">
          {user && (
            <div className="px-4 py-3 bg-slate-50 rounded-xl flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center">
                <User className="w-4 h-4 text-slate-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold truncate">{user.displayName || user.email}</p>
                <p className="text-[10px] text-slate-400">Premium Plan</p>
              </div>
            </div>
          )}
          <button 
            onClick={() => signOut(auth)}
            className="flex items-center gap-3 w-full px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}

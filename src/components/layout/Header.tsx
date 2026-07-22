import React, { useState } from 'react';
import { 
  Menu, Search, Bell, Building2, User, 
  ShieldCheck, CheckCircle2, Clock, X, RefreshCw
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface HeaderProps {
  onToggleSidebar: () => void;
  activeTabTitle: string;
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar, activeTabTitle }) => {
  const { currentUser, config, searchQuery, setSearchQuery, auditLogs } = useApp();
  const [showNotifications, setShowNotifications] = useState(false);

  const recentLogs = auditLogs.slice(0, 5);

  const formattedDate = new Date().toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  return (
    <header className="h-16 bg-white border-b border-slate-200 sticky top-0 z-30 px-6 flex items-center justify-between shadow-xs shrink-0">
      {/* Left section: Mobile Toggle & Header Info */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 rounded-md text-slate-600 hover:bg-slate-100 transition-colors"
          aria-label="Toggle menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden lg:flex items-center gap-2 text-slate-500 text-xs">
          <Building2 className="w-4 h-4 text-sky-600" />
          <span className="font-bold text-slate-800">{config.name}</span>
          <span className="text-slate-300">•</span>
          <span className="text-slate-500 font-medium">{activeTabTitle}</span>
        </div>

        <div className="lg:hidden">
          <h2 className="font-bold text-slate-800 text-sm">{activeTabTitle}</h2>
        </div>
      </div>

      {/* Middle section: High Density Global Search Bar */}
      <div className="hidden md:flex items-center bg-slate-100 px-3 py-1.5 rounded-md w-96 max-w-full">
        <Search className="w-4 h-4 text-slate-400 mr-2 rounded-full shrink-0" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Cari Pasien, RM, atau Kamar..."
          className="bg-transparent text-sm outline-none w-full text-slate-800 placeholder:text-slate-400 font-normal"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="text-slate-400 hover:text-slate-600 ml-1"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Right section: Date, Shift, Notifications & Profile */}
      <div className="flex items-center gap-4">
        <div className="text-right hidden sm:block">
          <p className="text-xs text-slate-500">{formattedDate}</p>
          <p className="text-sm font-bold text-sky-700">Shift Pagi</p>
        </div>

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="w-10 h-10 border border-slate-200 rounded-full flex items-center justify-center relative hover:bg-slate-50 transition-colors cursor-pointer"
            aria-label="Notifikasi"
          >
            <Bell className="w-4 h-4 text-slate-700" />
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-[10px] text-white flex items-center justify-center rounded-full border-2 border-white font-bold">
              {recentLogs.length}
            </div>
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-xl shadow-xl z-50 overflow-hidden animate-in fade-in duration-150">
              <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-sky-600" />
                  <h3 className="font-bold text-xs text-slate-800">Aktivitas Terkini</h3>
                </div>
                <button
                  onClick={() => setShowNotifications(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto">
                {recentLogs.map((log) => (
                  <div key={log.id} className="p-3 hover:bg-slate-50 transition-colors">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-xs font-semibold text-slate-800">{log.action}</p>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {new Date(log.timestamp).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 mt-0.5 line-clamp-2">{log.details}</p>
                    <p className="text-[10px] text-sky-600 mt-1 font-semibold">Oleh: {log.userName}</p>
                  </div>
                ))}
              </div>

              <div className="p-2 bg-slate-50 border-t border-slate-200 text-center">
                <p className="text-[10px] text-slate-500 font-semibold">Database DietCare Auto-Sync</p>
              </div>
            </div>
          )}
        </div>

        {/* Profile Avatar */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
          <div className="w-8 h-8 bg-slate-700 text-white rounded-full flex items-center justify-center font-bold text-xs">
            {currentUser?.name.substring(0, 2) || 'AD'}
          </div>
        </div>
      </div>
    </header>
  );
};

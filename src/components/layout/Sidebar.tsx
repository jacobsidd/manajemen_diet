import React from 'react';
import { 
  LayoutDashboard, Users, UtensilsCrossed, Bed, Stethoscope, 
  BookOpen, UserCog, FileBarChart, Settings, ClipboardList,
  ShieldAlert, Activity, LogOut, ChevronRight, HeartPulse
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export type NavTab = 
  | 'dashboard'
  | 'patients'
  | 'diets'
  | 'distribution'
  | 'rooms'
  | 'diagnoses'
  | 'dietTypes'
  | 'users'
  | 'reports'
  | 'settings';

interface SidebarProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, isOpen, setIsOpen }) => {
  const { currentUser, logout, switchRoleQuickly } = useApp();

  const navItems = [
    { id: 'dashboard' as NavTab, label: 'Dashboard', icon: LayoutDashboard, role: 'all' },
    { id: 'patients' as NavTab, label: 'Manajemen Pasien', icon: Users, role: 'all' },
    { id: 'diets' as NavTab, label: 'Input Diet Pasien', icon: UtensilsCrossed, role: 'all' },
    { id: 'distribution' as NavTab, label: 'Distribusi Makanan', icon: ClipboardList, role: 'all', badge: 'Utama' },
    { id: 'rooms' as NavTab, label: 'Daftar Kamar', icon: Bed, role: 'all' },
    { id: 'diagnoses' as NavTab, label: 'Diagnosa ICD-10', icon: Stethoscope, role: 'all' },
    { id: 'dietTypes' as NavTab, label: 'Master Jenis Diet', icon: BookOpen, role: 'all' },
    { id: 'users' as NavTab, label: 'Manajemen User', icon: UserCog, role: 'Admin' },
    { id: 'reports' as NavTab, label: 'Laporan Gizi', icon: FileBarChart, role: 'all' },
    { id: 'settings' as NavTab, label: 'Pengaturan & Backup', icon: Settings, role: 'Admin' },
  ];

  const filteredNavItems = navItems.filter(item => {
    if (item.role === 'Admin' && currentUser?.role !== 'Admin') return false;
    return true;
  });

  return (
    <>
      {/* Mobile overlay backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside className={`
        fixed top-0 left-0 bottom-0 z-50 w-64 bg-[#0F172A] text-slate-300 flex flex-col shrink-0 transition-transform duration-200 ease-in-out lg:static lg:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        border-r border-slate-800 shadow-xl
      `}>
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-800 bg-[#0A101D]">
          <div className="flex items-center gap-2.5 text-white font-bold italic text-xl tracking-tight">
            <div className="w-8 h-8 bg-sky-500 rounded flex items-center justify-center not-italic font-black text-white text-base shadow-sm">
              D
            </div>
            <span>DietCare</span>
          </div>
          <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-widest font-bold">
            Hospital Management System
          </p>
        </div>

        {/* User Role Switcher Quick Bar */}
        <div className="px-3 pt-3">
          <button
            onClick={() => switchRoleQuickly(currentUser?.role === 'Admin' ? 'Petugas' : 'Admin')}
            className="w-full text-left px-3 py-1.5 rounded bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 text-slate-300 text-xs flex items-center justify-between transition-colors cursor-pointer"
            title="Satu klik untuk simulasi alih peran akses"
          >
            <span className="flex items-center gap-1.5 font-medium">
              <Activity className="w-3.5 h-3.5 text-sky-400" />
              Peran: <strong className="text-white">{currentUser?.role}</strong>
            </span>
            <span className="text-[10px] text-sky-400 font-bold hover:underline">Switch</span>
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto custom-scrollbar">
          <p className="px-3 pt-1 pb-1 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
            Navigasi Utama
          </p>
          {filteredNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsOpen(false);
                }}
                className={`
                  w-full flex items-center justify-between px-3 py-2 rounded text-sm font-medium transition-colors cursor-pointer
                  ${isActive 
                    ? 'bg-sky-600 text-white shadow-xs font-semibold' 
                    : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'}
                `}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                    isActive ? 'bg-white/20 text-white' : 'bg-sky-500/20 text-sky-300'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* User Profile & Logout Box */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/80 flex items-center justify-between">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-9 h-9 bg-slate-700 rounded-full flex items-center justify-center font-bold text-white uppercase shrink-0 text-xs">
              {currentUser?.name.substring(0, 2) || 'AD'}
            </div>
            <div className="text-xs min-w-0">
              <p className="font-semibold text-white truncate">{currentUser?.name}</p>
              <p className="text-slate-400 text-[11px] truncate">{currentUser?.role === 'Admin' ? 'Administrator' : 'Petugas Gizi'}</p>
            </div>
          </div>

          <button
            onClick={logout}
            className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded transition-colors cursor-pointer"
            title="Keluar"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>
    </>
  );
};

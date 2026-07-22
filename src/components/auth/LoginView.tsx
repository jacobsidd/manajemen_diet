import React, { useState } from 'react';
import { HeartPulse, Lock, User as UserIcon, ShieldCheck, ArrowRight, AlertCircle, Eye, EyeOff, Building2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const LoginView: React.FC = () => {
  const { login, config } = useApp();
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    setTimeout(() => {
      const res = login(username, password);
      setIsLoading(false);
      if (!res.success) {
        setErrorMsg(res.message);
      }
    }, 350);
  };

  const handleQuickPreset = (presetUser: string, presetPass: string) => {
    setUsername(presetUser);
    setPassword(presetPass);
    setErrorMsg('');
  };

  return (
    <div className="min-h-screen bg-[#0F172A] flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200 z-10 animate-in fade-in zoom-in-95 duration-200">
        {/* Header Branding */}
        <div className="bg-gradient-to-br from-sky-700 via-sky-600 to-blue-800 p-8 text-white text-center relative">
          <div className="w-14 h-14 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center mx-auto mb-3 shadow-md">
            <HeartPulse className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-black tracking-tight">DietCare System</h1>
          <div className="flex items-center justify-center gap-1.5 text-xs text-sky-100/90 mt-1 font-semibold">
            <Building2 className="w-3.5 h-3.5 text-sky-200" />
            <span>{config.name}</span>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-sky-100 text-[11px] font-bold mt-3 backdrop-blur-xs border border-white/15">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
            <span>Sistem Informasi Manajemen Diet Pasien</span>
          </div>
        </div>

        {/* Login Form */}
        <div className="p-7 space-y-5">
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span className="font-semibold">{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1 uppercase tracking-wider">
                Username
              </label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  placeholder="Masukkan username..."
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white focus:border-sky-600 rounded-xl text-xs font-semibold text-slate-800 outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Masukkan password..."
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white focus:border-sky-600 rounded-xl text-xs font-semibold text-slate-800 outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between py-0.5">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded text-sky-600 focus:ring-sky-500 border-slate-300"
                />
                <span className="text-xs text-slate-600 font-medium">Ingat Saya</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 px-4 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-xl shadow-md shadow-sky-600/30 transition-all flex items-center justify-center gap-2 group cursor-pointer disabled:opacity-70"
            >
              {isLoading ? (
                <span>Memproses Login...</span>
              ) : (
                <>
                  <span>Masuk ke Dashboard</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Quick Preset Selector for Demo & Testing */}
          <div className="pt-4 border-t border-slate-100">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 text-center">
              Pilih Akun Demo Uji Coba
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickPreset('admin', 'admin123')}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                  username === 'admin' 
                    ? 'border-sky-500 bg-sky-50/80 text-sky-900 font-semibold' 
                    : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-slate-50'
                }`}
              >
                <p className="text-xs font-bold text-slate-800">Admin</p>
                <p className="text-[10px] text-slate-500 font-mono">admin / admin123</p>
              </button>

              <button
                type="button"
                onClick={() => handleQuickPreset('petugas1', 'petugas123')}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                  username === 'petugas1' 
                    ? 'border-emerald-500 bg-emerald-50/80 text-emerald-900 font-semibold' 
                    : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-slate-50'
                }`}
              >
                <p className="text-xs font-bold text-slate-800">Petugas Gizi</p>
                <p className="text-[10px] text-slate-500 font-mono">petugas1 / petugas123</p>
              </button>
            </div>
          </div>
        </div>

        <div className="bg-slate-50 px-6 py-3 border-t border-slate-100 text-center">
          <p className="text-[11px] text-slate-500 font-medium">
            © 2026 {config.name}. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

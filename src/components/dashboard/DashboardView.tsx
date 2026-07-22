import React from 'react';
import { 
  Users, Bed, Stethoscope, UtensilsCrossed, UserCheck, 
  UserPlus, UserMinus, Activity, TrendingUp, Clock, ChevronRight,
  Sparkles, CheckCircle2, AlertCircle
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend, AreaChart, Area, CartesianGrid 
} from 'recharts';
import { useApp } from '../../context/AppContext';

interface DashboardViewProps {
  onNavigate: (tab: any) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onNavigate }) => {
  const { patients, rooms, diagnoses, dietTypes, patientDiets, users, auditLogs, currentUser } = useApp();

  const todayStr = new Date().toISOString().split('T')[0];

  // Stats calculation
  const totalPatientsRawatInap = patients.filter(p => p.status === 'Rawat Inap').length;
  const totalKamar = rooms.length;
  const occupiedKamar = rooms.filter(r => r.status === 'Penuh').length;
  const availableKamar = rooms.filter(r => r.status === 'Tersedia').length;
  const totalDiagnosa = diagnoses.length;
  const activeDietsCount = patientDiets.filter(pd => pd.status === 'Aktif').length;
  const totalUsers = users.length;

  const patientsAdmittedToday = patients.filter(p => p.admissionDate === todayStr).length;
  const patientsDischargedToday = patients.filter(p => p.dischargeDate === todayStr).length;

  // Meal distribution totals
  const activeDiets = patientDiets.filter(pd => pd.status === 'Aktif');
  const breakfastCount = activeDiets.filter(d => d.breakfast).length;
  const lunchCount = activeDiets.filter(d => d.lunch).length;
  const dinnerCount = activeDiets.filter(d => d.dinner).length;

  // Chart Data 1: Patients per Ward (Ruangan)
  const wardDataMap: Record<string, number> = {};
  patients.filter(p => p.status === 'Rawat Inap').forEach(p => {
    const room = rooms.find(r => r.id === p.roomId);
    const wardName = room ? room.ward : 'Lainnya';
    wardDataMap[wardName] = (wardDataMap[wardName] || 0) + 1;
  });

  const chartWardData = Object.keys(wardDataMap).map(ward => ({
    ward,
    pasien: wardDataMap[ward]
  }));

  // Chart Data 2: Patients per Diet Type
  const dietDataMap: Record<string, number> = {};
  patientDiets.filter(pd => pd.status === 'Aktif').forEach(pd => {
    const dt = dietTypes.find(d => d.id === pd.dietTypeId);
    const name = dt ? dt.name.split('(')[0].trim() : 'Lainnya';
    dietDataMap[name] = (dietDataMap[name] || 0) + 1;
  });

  const COLORS = ['#2563eb', '#16a34a', '#d97706', '#9333ea', '#0284c7', '#ea580c', '#64748b'];

  const chartDietData = Object.keys(dietDataMap).map(name => ({
    name,
    value: dietDataMap[name]
  }));

  // Chart Data 3: Meal Distribution Time
  const chartMealData = [
    { waktu: 'Pagi (06:30)', porsi: breakfastCount, fill: '#3b82f6' },
    { waktu: 'Siang (11:30)', porsi: lunchCount, fill: '#10b981' },
    { waktu: 'Malam (17:30)', porsi: dinnerCount, fill: '#8b5cf6' },
  ];

  // Chart Data 4: Weekly Trend
  const chartWeeklyTrend = [
    { hari: 'Sen', pasien: Math.max(1, totalPatientsRawatInap - 4), diet: activeDietsCount - 3 },
    { hari: 'Sel', pasien: Math.max(1, totalPatientsRawatInap - 3), diet: activeDietsCount - 2 },
    { hari: 'Rab', pasien: Math.max(1, totalPatientsRawatInap - 2), diet: activeDietsCount - 1 },
    { hari: 'Kam', pasien: Math.max(1, totalPatientsRawatInap - 1), diet: activeDietsCount - 1 },
    { hari: 'Jum', pasien: totalPatientsRawatInap, diet: activeDietsCount },
    { hari: 'Sab', pasien: totalPatientsRawatInap, diet: activeDietsCount },
    { hari: 'Min', pasien: totalPatientsRawatInap, diet: activeDietsCount },
  ];

  return (
    <div className="space-y-5 pb-12">
      {/* Top Welcome / Header Bar */}
      <div className="p-5 rounded-xl bg-gradient-to-r from-sky-700 via-sky-600 to-blue-800 text-white shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span className="text-[11px] font-bold text-sky-100 uppercase tracking-wider">
              Instalasi Gizi & Manajerial RS
            </span>
          </div>
          <h1 className="text-xl font-bold tracking-tight">
            Selamat Datang, {currentUser?.name}!
          </h1>
          <p className="text-xs text-sky-100/90 mt-0.5 max-w-xl">
            Sistem monitoring distribusi makanan pasien, resep gizi klinis, dan keterisian kamar inap.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-3.5 py-2 rounded-lg border border-white/20">
          <Clock className="w-4 h-4 text-amber-300 shrink-0" />
          <div>
            <p className="text-[10px] text-sky-100 font-medium">Distribusi Makanan Berikutnya</p>
            <p className="text-xs font-bold text-white">Malam (17:30 WIB)</p>
          </div>
        </div>
      </div>

      {/* Primary Statistic Cards Grid - High Density Design */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div 
          onClick={() => onNavigate('patients')}
          className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:border-sky-300 transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Pasien Rawat Inap</span>
            <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">{totalPatientsRawatInap}</span>
            <span className="text-xs text-slate-500 font-medium">pasien</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-[11px]">
            <span className="text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.5 rounded">
              +{patientsAdmittedToday} baru
            </span>
            <span className="text-slate-400 font-medium">{patientsDischargedToday} pulang</span>
          </div>
        </div>

        <div 
          onClick={() => onNavigate('diets')}
          className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:border-sky-300 transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Diet Aktif</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <UtensilsCrossed className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">{activeDietsCount}</span>
            <span className="text-xs text-slate-500 font-medium">resep</span>
          </div>
          <div className="mt-2 text-[11px] text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.5 rounded inline-block w-fit">
            100% Tercover Gizi
          </div>
        </div>

        <div 
          onClick={() => onNavigate('rooms')}
          className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:border-sky-300 transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Kamar & Bed</span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Bed className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">{occupiedKamar}/{totalKamar}</span>
            <span className="text-xs text-slate-500 font-medium">terisi</span>
          </div>
          <div className="mt-2 text-[11px] text-amber-700 font-bold bg-amber-50 px-1.5 py-0.5 rounded inline-block w-fit">
            {availableKamar} kamar kosong
          </div>
        </div>

        <div 
          onClick={() => onNavigate('diagnoses')}
          className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:border-sky-300 transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Diagnosa Master</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Stethoscope className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">{totalDiagnosa}</span>
            <span className="text-xs text-slate-500 font-medium">ICD-10</span>
          </div>
          <div className="mt-2 text-[11px] text-sky-700 font-bold bg-sky-50 px-1.5 py-0.5 rounded inline-block w-fit truncate max-w-full">
            DM & Hipertensi
          </div>
        </div>
      </div>

      {/* Secondary Quick Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3 bg-white rounded-lg border border-slate-200 flex items-center gap-3">
          <div className="w-8 h-8 rounded-md bg-sky-600 text-white flex items-center justify-center shrink-0">
            <UserPlus className="w-4 h-4" />
          </div>
          <div>
            <p className="text-[11px] text-slate-500 font-medium">Pasien Masuk Hari Ini</p>
            <p className="text-xs font-bold text-slate-900">{patientsAdmittedToday} Pasien</p>
          </div>
        </div>

        <div className="p-3 bg-white rounded-lg border border-slate-200 flex items-center gap-3">
          <div className="w-8 h-8 rounded-md bg-emerald-600 text-white flex items-center justify-center shrink-0">
            <UserMinus className="w-4 h-4" />
          </div>
          <div>
            <p className="text-[11px] text-slate-500 font-medium">Pasien Pulang Hari Ini</p>
            <p className="text-xs font-bold text-slate-900">{patientsDischargedToday} Pasien</p>
          </div>
        </div>

        <div className="p-3 bg-white rounded-lg border border-slate-200 flex items-center gap-3">
          <div className="w-8 h-8 rounded-md bg-indigo-600 text-white flex items-center justify-center shrink-0">
            <UserCheck className="w-4 h-4" />
          </div>
          <div>
            <p className="text-[11px] text-slate-500 font-medium">Pengguna Sistem</p>
            <p className="text-xs font-bold text-slate-900">{totalUsers} User Aktif</p>
          </div>
        </div>

        <div className="p-3 bg-white rounded-lg border border-slate-200 flex items-center gap-3">
          <div className="w-8 h-8 rounded-md bg-amber-600 text-white flex items-center justify-center shrink-0">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <p className="text-[11px] text-slate-500 font-medium">Aktivitas Audit Log</p>
            <p className="text-xs font-bold text-slate-900">{auditLogs.length} Entri</p>
          </div>
        </div>
      </div>

      {/* Interactive Charts Section Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Chart 1: Pasien Berdasarkan Kamar/Ruangan */}
        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Pasien Per Ruangan</h3>
              <p className="text-[11px] text-slate-500">Jumlah pasien rawat inap di tiap bangsal</p>
            </div>
            <button 
              onClick={() => onNavigate('rooms')}
              className="text-xs font-semibold text-sky-600 hover:text-sky-700 flex items-center gap-0.5 cursor-pointer"
            >
              <span>Detail</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartWardData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="ward" tick={{ fontSize: 10 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 10 }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '11px' }}
                />
                <Bar dataKey="pasien" fill="#0284c7" radius={[4, 4, 0, 0]} name="Jumlah Pasien" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Proporsi Pasien Berdasarkan Jenis Diet */}
        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Distribusi Jenis Diet</h3>
              <p className="text-[11px] text-slate-500">Persentase resep makanan pasien aktif</p>
            </div>
            <button 
              onClick={() => onNavigate('diets')}
              className="text-xs font-semibold text-sky-600 hover:text-sky-700 flex items-center gap-0.5 cursor-pointer"
            >
              <span>Kelola</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartDietData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={75}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {chartDietData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '11px' }}
                />
                <Legend 
                  layout="vertical" 
                  align="right" 
                  verticalAlign="middle" 
                  wrapperStyle={{ fontSize: '10px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Distribusi Makanan Per Waktu */}
        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Distribusi Makanan Per Waktu</h3>
              <p className="text-[11px] text-slate-500">Total porsi makanan diproduksi dapur (Pagi, Siang, Malam)</p>
            </div>
            <button 
              onClick={() => onNavigate('distribution')}
              className="text-xs font-semibold text-sky-600 hover:text-sky-700 flex items-center gap-0.5 cursor-pointer"
            >
              <span>Daftar</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartMealData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="waktu" tick={{ fontSize: 10 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 10 }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '11px' }}
                />
                <Bar dataKey="porsi" radius={[6, 6, 0, 0]} name="Jumlah Porsi">
                  {chartMealData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 4: Trend Mingguan */}
        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Trend Pelayanan Gizi Mingguan</h3>
              <p className="text-[11px] text-slate-500">Grafik perbandingan pasien & resep diet terlayani</p>
            </div>
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartWeeklyTrend}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="hari" tick={{ fontSize: 10 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 10 }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '11px' }}
                />
                <Area type="monotone" dataKey="pasien" stroke="#0284c7" fill="#e0f2fe" name="Jumlah Pasien" />
                <Area type="monotone" dataKey="diet" stroke="#16a34a" fill="#dcfce7" name="Resep Diet" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Activity Log Section */}
      <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-sky-600" />
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Log Aktivitas Terbaru</h3>
          </div>
          <span className="text-[10px] text-slate-400 font-mono font-semibold">Realtime Audit</span>
        </div>

        <div className="divide-y divide-slate-100">
          {auditLogs.slice(0, 5).map((log) => (
            <div key={log.id} className="py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-slate-50 px-2 rounded transition-colors">
              <div className="flex items-start gap-2.5">
                <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  {log.userName.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-800">{log.action}</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-sky-50 text-sky-700 font-bold border border-sky-100">
                      {log.userRole}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-0.5">{log.details}</p>
                </div>
              </div>

              <div className="text-left sm:text-right shrink-0">
                <span className="text-[10px] text-slate-400 font-mono">
                  {new Date(log.timestamp).toLocaleString('id-ID', {
                    day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
                  })}
                </span>
                <p className="text-[10px] text-slate-500 font-medium">{log.userName}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { 
  FileBarChart, Download, FileSpreadsheet, Calendar, 
  Filter, Building2, Stethoscope, Utensils, Flame, CheckCircle2,
  TrendingUp, PieChart as PieChartIcon
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { generateDistributionPDF, exportToExcel } from '../../utils/exportUtils';

export const ReportsView: React.FC = () => {
  const { patients, patientDiets, dietTypes, rooms, diagnoses, config } = useApp();

  const [reportType, setReportType] = useState<'harian' | 'mingguan' | 'bulanan' | 'ruangan' | 'diagnosa'>('harian');
  const [selectedWard, setSelectedWard] = useState('All');

  const wards = Array.from(new Set(rooms.map(r => r.ward)));

  // Generate Report Table Data based on reportType
  const activeDiets = patientDiets.filter(pd => pd.status === 'Aktif');

  // Calculated Stats
  const totalCal = activeDiets.reduce((sum, d) => sum + d.calories, 0);
  const avgCal = activeDiets.length ? Math.round(totalCal / activeDiets.length) : 0;
  const totalMealsDaily = activeDiets.reduce((sum, d) => sum + (d.breakfast ? 1 : 0) + (d.lunch ? 1 : 0) + (d.dinner ? 1 : 0), 0);

  const handleExportPDF = () => {
    let headers: string[] = [];
    let rows: (string | number)[][] = [];
    let title = 'Laporan Pelayanan Gizi Rumah Sakit';

    if (reportType === 'ruangan') {
      title = 'Laporan Distribusi Diet Berdasarkan Ruangan';
      headers = ['Bangsal / Ruangan', 'Total Pasien', 'Diet Diabetes', 'Diet Rendah Garam', 'Diet Lunak', 'Diet Biasa'];
      
      rows = wards.map(w => {
        const wardPatients = patients.filter(p => p.status === 'Rawat Inap' && rooms.find(r => r.id === p.roomId)?.ward === w);
        const wardDiets = wardPatients.map(p => activeDiets.find(d => d.patientId === p.id));
        
        const countDM = wardDiets.filter(d => dietTypes.find(dt => dt.id === d?.dietTypeId)?.name.includes('Diabetes')).length;
        const countRG = wardDiets.filter(d => dietTypes.find(dt => dt.id === d?.dietTypeId)?.name.includes('Garam')).length;
        const countDL = wardDiets.filter(d => dietTypes.find(dt => dt.id === d?.dietTypeId)?.name.includes('Lunak')).length;
        const countDB = wardDiets.filter(d => dietTypes.find(dt => dt.id === d?.dietTypeId)?.name.includes('Biasa')).length;

        return [w, wardPatients.length, countDM, countRG, countDL, countDB];
      });
    } else {
      headers = ['No. RM', 'Nama Pasien', 'Kamar', 'Diagnosa', 'Jenis Diet', 'Kalori (kcal)', 'Waktu Pemberian'];
      rows = patients.filter(p => p.status === 'Rawat Inap').map(p => {
        const room = rooms.find(r => r.id === p.roomId);
        const diag = diagnoses.find(d => d.id === p.diagnosisId);
        const diet = activeDiets.find(d => d.patientId === p.id);
        const dt = dietTypes.find(d => d.id === diet?.dietTypeId);

        return [
          p.medicalRecordNumber,
          p.name,
          `${room?.ward || ''} ${room?.roomNumber || ''}`,
          diag?.name || '-',
          dt?.name || '-',
          `${diet?.calories || 0} kcal`,
          `${diet?.breakfast ? 'Pagi ' : ''}${diet?.lunch ? 'Siang ' : ''}${diet?.dinner ? 'Malam' : ''}`
        ];
      });
    }

    generateDistributionPDF(title, `Tipe Laporan: ${reportType.toUpperCase()}`, headers, rows, config);
  };

  const handleExportExcel = () => {
    const headers = ['No. RM', 'Nama Pasien', 'Kamar', 'Diagnosa', 'Jenis Diet', 'Kalori', 'Protein', 'Lemak', 'Karbo'];
    const rows = patients.filter(p => p.status === 'Rawat Inap').map(p => {
      const room = rooms.find(r => r.id === p.roomId);
      const diag = diagnoses.find(d => d.id === p.diagnosisId);
      const diet = activeDiets.find(d => d.patientId === p.id);
      const dt = dietTypes.find(d => d.id === diet?.dietTypeId);

      return [
        p.medicalRecordNumber,
        p.name,
        `${room?.ward || ''} ${room?.roomNumber || ''}`,
        diag?.name || '',
        dt?.name || '',
        diet?.calories || 0,
        diet?.protein || 0,
        diet?.fat || 0,
        diet?.carbohydrate || 0
      ];
    });

    exportToExcel(`Laporan_Gizi_${reportType}`, 'Laporan', headers, rows);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <FileBarChart className="w-6 h-6 text-blue-600" />
            <span>Laporan & Rekapitulasi Pelayanan Gizi</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Laporan harian, mingguan, bulanan, rekap per bangsal, dan rekapitulasi diagnosa
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportPDF}
            className="px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Cetak PDF</span>
          </button>

          <button
            onClick={handleExportExcel}
            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Export Excel</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <Utensils className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500">Total Porsi Makanan Harian</p>
            <p className="text-xl font-black text-slate-800">{totalMealsDaily} Porsi / Hari</p>
            <p className="text-[11px] text-emerald-600 font-medium">Pagi, Siang & Malam</p>
          </div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <Flame className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500">Rata-rata Target Energi</p>
            <p className="text-xl font-black text-slate-800">{avgCal} kcal / Pasien</p>
            <p className="text-[11px] text-slate-500">Sesuai Kebutuhan Klinis</p>
          </div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500">Cakupan Bangsal Rawat</p>
            <p className="text-xl font-black text-slate-800">{wards.length} Bangsal Active</p>
            <p className="text-[11px] text-emerald-600 font-medium">100% Terlayani</p>
          </div>
        </div>
      </div>

      {/* Report Category Selectors */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 rounded-xl">
          {[
            { id: 'harian', label: 'Laporan Harian' },
            { id: 'mingguan', label: 'Laporan Mingguan' },
            { id: 'bulanan', label: 'Laporan Bulanan' },
            { id: 'ruangan', label: 'Per Bangsal / Ruangan' },
            { id: 'diagnosa', label: 'Per Diagnosa' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setReportType(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                reportType === tab.id 
                  ? 'bg-blue-600 text-white shadow-xs font-bold' 
                  : 'text-slate-600 hover:text-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Report Data Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 font-bold text-xs text-slate-800 uppercase tracking-wider">
          Tampilan Laporan: {reportType.toUpperCase()}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                <th className="py-3 px-4">No. RM</th>
                <th className="py-3 px-4">Nama Pasien</th>
                <th className="py-3 px-4">Ruangan / Kamar</th>
                <th className="py-3 px-4">Diagnosa (ICD)</th>
                <th className="py-3 px-4">Jenis Diet</th>
                <th className="py-3 px-4">Kalori</th>
                <th className="py-3 px-4">Waktu Pemberian</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-800">
              {patients.filter(p => p.status === 'Rawat Inap').map((p) => {
                const room = rooms.find(r => r.id === p.roomId);
                const diag = diagnoses.find(d => d.id === p.diagnosisId);
                const diet = activeDiets.find(d => d.patientId === p.id);
                const dt = dietTypes.find(d => d.id === diet?.dietTypeId);

                return (
                  <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-blue-600">{p.medicalRecordNumber}</td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">{p.name}</td>
                    <td className="py-3.5 px-4">{room?.ward} - {room?.roomNumber} ({p.bed})</td>
                    <td className="py-3.5 px-4">{diag ? `[${diag.code}] ${diag.name}` : '-'}</td>
                    <td className="py-3.5 px-4 font-bold text-emerald-800">{dt?.name || '-'}</td>
                    <td className="py-3.5 px-4 font-bold">{diet?.calories || 0} kcal</td>
                    <td className="py-3.5 px-4">
                      <div className="flex gap-1 text-[10px] font-bold">
                        {diet?.breakfast && <span className="px-1.5 py-0.2 bg-blue-100 text-blue-800 rounded">Pagi</span>}
                        {diet?.lunch && <span className="px-1.5 py-0.2 bg-emerald-100 text-emerald-800 rounded">Siang</span>}
                        {diet?.dinner && <span className="px-1.5 py-0.2 bg-purple-100 text-purple-800 rounded">Malam</span>}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

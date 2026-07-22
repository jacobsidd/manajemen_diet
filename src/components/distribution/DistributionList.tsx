import React, { useState } from 'react';
import { 
  ClipboardList, Printer, Download, FileSpreadsheet, FileCheck, 
  Calendar, Filter, CheckCircle2, Circle, Clock, Utensils,
  Search, ShieldAlert, Sparkles, Building2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { generateDistributionPDF, exportToExcel } from '../../utils/exportUtils';

export const DistributionList: React.FC = () => {
  const { patients, patientDiets, dietTypes, rooms, diagnoses, config } = useApp();

  const todayStr = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(todayStr);
  const [selectedWard, setSelectedWard] = useState('All');
  const [selectedMealTime, setSelectedMealTime] = useState<'All' | 'Pagi' | 'Siang' | 'Malam'>('All');
  const [selectedDietType, setSelectedDietType] = useState('All');
  const [deliveredMap, setDeliveredMap] = useState<Record<string, boolean>>({});

  // Unique Wards
  const wards = Array.from(new Set(rooms.map(r => r.ward)));

  // Filter Patients & Active Diets for distribution
  const distributionData = patients
    .filter(p => p.status === 'Rawat Inap')
    .map(p => {
      const room = rooms.find(r => r.id === p.roomId);
      const activeDiet = patientDiets.find(pd => pd.patientId === p.id && pd.status === 'Aktif');
      const dietType = activeDiet ? dietTypes.find(dt => dt.id === activeDiet.dietTypeId) : null;
      const diag = diagnoses.find(d => d.id === p.diagnosisId);

      return {
        patient: p,
        room,
        activeDiet,
        dietType,
        diag
      };
    })
    .filter(item => {
      if (!item.activeDiet) return false;

      // Filter Ward
      if (selectedWard !== 'All' && item.room?.ward !== selectedWard) return false;

      // Filter Diet Type
      if (selectedDietType !== 'All' && item.dietType?.id !== selectedDietType) return false;

      // Filter Meal Time
      if (selectedMealTime === 'Pagi' && !item.activeDiet.breakfast) return false;
      if (selectedMealTime === 'Siang' && !item.activeDiet.lunch) return false;
      if (selectedMealTime === 'Malam' && !item.activeDiet.dinner) return false;

      return true;
    });

  const toggleDelivered = (patientId: string) => {
    setDeliveredMap(prev => ({
      ...prev,
      [patientId]: !prev[patientId]
    }));
  };

  // Export Handlers
  const handleExportPDF = () => {
    const headers = ['Ruangan & Bed', 'No. RM', 'Nama Pasien', 'Diagnosa', 'Jenis Diet', 'Kalori (kcal)', 'Pantangan & Catatan', 'Waktu'];
    
    const rows = distributionData.map(item => [
      `${item.room?.ward || ''} ${item.room?.roomNumber || ''} (${item.patient.bed})`,
      item.patient.medicalRecordNumber,
      item.patient.name,
      item.diag?.code ? `[${item.diag.code}] ${item.diag.name}` : '-',
      item.dietType?.name || '-',
      `${item.activeDiet?.calories || 0} kcal`,
      `${item.activeDiet?.restrictions || ''} | ${item.activeDiet?.notes || ''}`,
      `${item.activeDiet?.breakfast ? 'Pagi ' : ''}${item.activeDiet?.lunch ? 'Siang ' : ''}${item.activeDiet?.dinner ? 'Malam' : ''}`
    ]);

    const title = 'Daftar Distribusi Makanan Pasien';
    const subtitle = `Tanggal: ${selectedDate} | Bangsal: ${selectedWard} | Waktu: ${selectedMealTime}`;

    generateDistributionPDF(title, subtitle, headers, rows, config);
  };

  const handleExportExcel = () => {
    const headers = ['Ruangan', 'No. Kamar', 'Bed', 'No. RM', 'Nama Pasien', 'Diagnosa', 'Jenis Diet', 'Kalori', 'Protein (g)', 'Lemak (g)', 'Karbo (g)', 'Pantangan', 'Catatan', 'Pagi', 'Siang', 'Malam'];
    
    const rows = distributionData.map(item => [
      item.room?.ward || '',
      item.room?.roomNumber || '',
      item.patient.bed,
      item.patient.medicalRecordNumber,
      item.patient.name,
      item.diag?.name || '',
      item.dietType?.name || '',
      item.activeDiet?.calories || 0,
      item.activeDiet?.protein || 0,
      item.activeDiet?.fat || 0,
      item.activeDiet?.carbohydrate || 0,
      item.activeDiet?.restrictions || '',
      item.activeDiet?.notes || '',
      item.activeDiet?.breakfast ? 'Ya' : 'Tidak',
      item.activeDiet?.lunch ? 'Ya' : 'Tidak',
      item.activeDiet?.dinner ? 'Ya' : 'Tidak'
    ]);

    exportToExcel('Distribusi_Makanan_Pasien', 'Distribusi', headers, rows);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 print:hidden">
        <div>
          <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <ClipboardList className="w-6 h-6 text-blue-600" />
            <span>Daftar Distribusi Makanan Pasien</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Lembar kerja distribusi hidangan makanan pasien ke ruang rawat inap
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportPDF}
            className="px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Export PDF</span>
          </button>

          <button
            onClick={handleExportExcel}
            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Export Excel</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak / Print</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 print:hidden">
        <div>
          <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Tanggal Distribusi</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Bangsal / Ruangan</label>
          <select
            value={selectedWard}
            onChange={(e) => setSelectedWard(e.target.value)}
            className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 outline-none focus:border-blue-500"
          >
            <option value="All">Semua Bangsal</option>
            {wards.map((w) => (
              <option key={w} value={w}>{w}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Waktu Pemberian</label>
          <select
            value={selectedMealTime}
            onChange={(e) => setSelectedMealTime(e.target.value as any)}
            className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 outline-none focus:border-blue-500"
          >
            <option value="All">Semua Waktu (Pagi/Siang/Malam)</option>
            <option value="Pagi">Pagi (06:30 WIB)</option>
            <option value="Siang">Siang (11:30 WIB)</option>
            <option value="Malam">Malam (17:30 WIB)</option>
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Jenis Diet</label>
          <select
            value={selectedDietType}
            onChange={(e) => setSelectedDietType(e.target.value)}
            className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 outline-none focus:border-blue-500"
          >
            <option value="All">Semua Jenis Diet</option>
            {dietTypes.map((dt) => (
              <option key={dt.id} value={dt.id}>{dt.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Print View Header Notice */}
      <div className="hidden print:block mb-6 p-4 border-b-2 border-slate-900 text-center">
        <h1 className="text-xl font-bold uppercase">{config.name}</h1>
        <p className="text-xs">{config.address} - Telp: {config.phone}</p>
        <h2 className="text-base font-bold underline mt-2">LEMBAR DISTRIBUSI MAKANAN PASIEN</h2>
        <p className="text-xs">Tanggal: {selectedDate} | Waktu: {selectedMealTime} | Bangsal: {selectedWard}</p>
      </div>

      {/* Distribution Sheet Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <Utensils className="w-4 h-4 text-blue-600" />
            <span className="text-xs font-bold text-slate-800">
              Daftar Pasien Siap Antar ({distributionData.length} Porsi)
            </span>
          </div>
          <span className="text-[11px] text-slate-500 font-medium">
            Tersusun berdasarkan Kamar & Bangsal
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                <th className="py-3 px-4 w-12 text-center print:hidden">Status</th>
                <th className="py-3 px-4">Kamar & Bed</th>
                <th className="py-3 px-4">Nama Pasien / No. RM</th>
                <th className="py-3 px-4">Diagnosa</th>
                <th className="py-3 px-4">Jenis Diet</th>
                <th className="py-3 px-4">Energi</th>
                <th className="py-3 px-4">Waktu</th>
                <th className="py-3 px-4">Pantangan & Catatan Khusus</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-xs text-slate-800">
              {distributionData.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    <ClipboardList className="w-10 h-10 mx-auto mb-2 opacity-30" />
                    <p className="font-semibold text-slate-600">Tidak ada porsi makanan untuk filter ini.</p>
                  </td>
                </tr>
              ) : (
                distributionData.map(({ patient, room, activeDiet, dietType, diag }) => {
                  const isDelivered = !!deliveredMap[patient.id];

                  return (
                    <tr 
                      key={patient.id} 
                      className={`transition-colors ${isDelivered ? 'bg-emerald-50/50' : 'hover:bg-slate-50'}`}
                    >
                      {/* Checkbox status */}
                      <td className="py-3 px-4 text-center print:hidden">
                        <button
                          onClick={() => toggleDelivered(patient.id)}
                          className="text-slate-400 hover:text-emerald-600 transition-colors cursor-pointer"
                        >
                          {isDelivered ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-100" />
                          ) : (
                            <Circle className="w-5 h-5 text-slate-300" />
                          )}
                        </button>
                      </td>

                      {/* Room & Bed */}
                      <td className="py-3 px-4 font-bold text-slate-900">
                        <div>{room?.ward} - {room?.roomNumber}</div>
                        <div className="text-[10px] text-blue-600 font-semibold">{patient.bed} ({room?.class})</div>
                      </td>

                      {/* Patient Name */}
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900">{patient.name}</div>
                        <div className="text-[10px] font-mono text-slate-500">{patient.medicalRecordNumber}</div>
                      </td>

                      {/* Diagnosis */}
                      <td className="py-3 px-4 text-slate-700">
                        {diag ? `[${diag.code}] ${diag.name}` : '-'}
                      </td>

                      {/* Diet Type */}
                      <td className="py-3 px-4">
                        <span className="font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 inline-block">
                          {dietType?.name}
                        </span>
                      </td>

                      {/* Calories */}
                      <td className="py-3 px-4 font-bold text-slate-800">
                        {activeDiet?.calories} kcal
                      </td>

                      {/* Meal Times */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1 text-[10px] font-bold">
                          {activeDiet?.breakfast && <span className="px-1.5 py-0.2 bg-blue-100 text-blue-800 rounded">Pagi</span>}
                          {activeDiet?.lunch && <span className="px-1.5 py-0.2 bg-emerald-100 text-emerald-800 rounded">Siang</span>}
                          {activeDiet?.dinner && <span className="px-1.5 py-0.2 bg-purple-100 text-purple-800 rounded">Malam</span>}
                        </div>
                      </td>

                      {/* Restrictions & Notes */}
                      <td className="py-3 px-4 max-w-xs">
                        {activeDiet?.restrictions && (
                          <span className="font-semibold text-rose-700 block text-[11px]">
                            🚫 {activeDiet.restrictions}
                          </span>
                        )}
                        <span className="text-slate-600 italic text-[11px]">
                          📝 {activeDiet?.notes || 'Biasa'}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { 
  UtensilsCrossed, Plus, Search, Filter, Edit3, CheckCircle2, 
  XCircle, Flame, Activity, Clock, FileText, Check, X, Sparkles,
  Info, AlertTriangle, ShieldAlert
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PatientDiet, DietStatus } from '../../types';

interface PatientDietManagementProps {
  initialSelectedPatientId?: string | null;
}

export const PatientDietManagement: React.FC<PatientDietManagementProps> = ({ initialSelectedPatientId }) => {
  const { 
    patients, dietTypes, diagnoses, rooms, patientDiets, 
    assignPatientDiet, updatePatientDiet, searchQuery, setSearchQuery 
  } = useApp();

  const [statusFilter, setStatusFilter] = useState<string>('Aktif');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDiet, setEditingDiet] = useState<PatientDiet | null>(null);

  // Form states
  const [patientId, setPatientId] = useState('');
  const [dietTypeId, setDietTypeId] = useState('');
  const [calories, setCalories] = useState(1900);
  const [protein, setProtein] = useState(65);
  const [fat, setFat] = useState(50);
  const [carbohydrate, setCarbohydrate] = useState(250);
  const [restrictions, setRestrictions] = useState('');
  const [notes, setNotes] = useState('');
  const [breakfast, setBreakfast] = useState(true);
  const [lunch, setLunch] = useState(true);
  const [dinner, setDinner] = useState(true);
  const [effectiveDate, setEffectiveDate] = useState(new Date().toISOString().split('T')[0]);
  const [status, setStatus] = useState<DietStatus>('Aktif');

  // Trigger modal automatically if navigated with a specific patient
  useEffect(() => {
    if (initialSelectedPatientId) {
      openAddModal(initialSelectedPatientId);
    }
  }, [initialSelectedPatientId]);

  const openAddModal = (targetPatientId?: string) => {
    setEditingDiet(null);
    const selectedPid = targetPatientId || patients.find(p => p.status === 'Rawat Inap')?.id || patients[0]?.id || '';
    setPatientId(selectedPid);

    // Pick first diet type
    const defaultDt = dietTypes[0];
    setDietTypeId(defaultDt?.id || '');
    setCalories(defaultDt?.defaultCalories || 1900);
    setProtein(defaultDt?.defaultProtein || 65);
    setFat(defaultDt?.defaultFat || 50);
    setCarbohydrate(defaultDt?.defaultCarbs || 250);

    setRestrictions('Gula pasir, Santan kental, Makanan digoreng');
    setNotes('Porsi sedang, tekstur lunak/biasa.');
    setBreakfast(true);
    setLunch(true);
    setDinner(true);
    setEffectiveDate(new Date().toISOString().split('T')[0]);
    setStatus('Aktif');
    setIsModalOpen(true);
  };

  const openEditModal = (diet: PatientDiet) => {
    setEditingDiet(diet);
    setPatientId(diet.patientId);
    setDietTypeId(diet.dietTypeId);
    setCalories(diet.calories);
    setProtein(diet.protein);
    setFat(diet.fat);
    setCarbohydrate(diet.carbohydrate);
    setRestrictions(diet.restrictions);
    setNotes(diet.notes);
    setBreakfast(diet.breakfast);
    setLunch(diet.lunch);
    setDinner(diet.dinner);
    setEffectiveDate(diet.effectiveDate);
    setStatus(diet.status);
    setIsModalOpen(true);
  };

  const handleDietTypeChange = (dtId: string) => {
    setDietTypeId(dtId);
    const dt = dietTypes.find(d => d.id === dtId);
    if (dt) {
      if (dt.defaultCalories) setCalories(dt.defaultCalories);
      if (dt.defaultProtein) setProtein(dt.defaultProtein);
      if (dt.defaultFat) setFat(dt.defaultFat);
      if (dt.defaultCarbs) setCarbohydrate(dt.defaultCarbs);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientId || !dietTypeId) return;

    if (editingDiet) {
      updatePatientDiet(editingDiet.id, {
        patientId,
        dietTypeId,
        calories,
        protein,
        fat,
        carbohydrate,
        restrictions,
        notes,
        breakfast,
        lunch,
        dinner,
        effectiveDate,
        status
      });
    } else {
      assignPatientDiet({
        patientId,
        dietTypeId,
        calories,
        protein,
        fat,
        carbohydrate,
        restrictions,
        notes,
        breakfast,
        lunch,
        dinner,
        effectiveDate,
        status
      });
    }

    setIsModalOpen(false);
  };

  // Macro calorie calculation (Protein: 4 kcal/g, Fat: 9 kcal/g, Carbs: 4 kcal/g)
  const calcProteinCal = protein * 4;
  const calcFatCal = fat * 9;
  const calcCarbCal = carbohydrate * 4;
  const totalCalcCal = calcProteinCal + calcFatCal + calcCarbCal || 1;

  const proteinPct = Math.round((calcProteinCal / totalCalcCal) * 100);
  const fatPct = Math.round((calcFatCal / totalCalcCal) * 100);
  const carbPct = Math.round((calcCarbCal / totalCalcCal) * 100);

  // Filter list
  const filteredDiets = patientDiets.filter(pd => {
    const p = patients.find(x => x.id === pd.patientId);
    const dt = dietTypes.find(x => x.id === pd.dietTypeId);

    const matchesSearch = 
      p?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p?.medicalRecordNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dt?.name.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'All' ? true : pd.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <UtensilsCrossed className="w-6 h-6 text-emerald-600" />
            <span>Preskripsi & Input Diet Pasien</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Penetapan kebutuhan kalori, makronutrisi, pantangan, dan waktu pemberian makanan pasien
          </p>
        </div>

        <button
          onClick={() => openAddModal()}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-600/20 flex items-center gap-2 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Input Resep Diet Baru</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between gap-3">
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl">
          {['Aktif', 'Tidak Aktif', 'All'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                statusFilter === st 
                  ? 'bg-white text-emerald-700 shadow-xs font-bold' 
                  : 'text-slate-600 hover:text-slate-800'
              }`}
            >
              {st === 'All' ? 'Semua Status' : st}
            </button>
          ))}
        </div>

        <div className="text-xs text-slate-500 font-medium">
          Total Resep: <span className="font-bold text-slate-800">{filteredDiets.length}</span>
        </div>
      </div>

      {/* Diet Prescriptions Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-4">Pasien & Kamar</th>
                <th className="py-3.5 px-4">Jenis Diet</th>
                <th className="py-3.5 px-4">Kebutuhan Energi & Nutrisi</th>
                <th className="py-3.5 px-4">Pantangan & Catatan</th>
                <th className="py-3.5 px-4">Waktu Makan</th>
                <th className="py-3.5 px-4">Tgl Berlaku</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {filteredDiets.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    <UtensilsCrossed className="w-10 h-10 mx-auto mb-2 opacity-40 text-slate-400" />
                    <p className="font-semibold text-slate-600">Tidak ada data resep diet yang sesuai.</p>
                  </td>
                </tr>
              ) : (
                filteredDiets.map((diet) => {
                  const patient = patients.find(p => p.id === diet.patientId);
                  const room = rooms.find(r => r.id === patient?.roomId);
                  const dietType = dietTypes.find(dt => dt.id === diet.dietTypeId);

                  return (
                    <tr key={diet.id} className="hover:bg-slate-50/80 transition-colors">
                      {/* Patient & Room */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-800 text-xs">{patient?.name || 'Pasien'}</div>
                        <div className="text-[11px] font-mono text-blue-600 font-semibold">{patient?.medicalRecordNumber}</div>
                        <div className="text-[10px] text-slate-500">{room?.ward} - {room?.roomNumber} ({patient?.bed})</div>
                      </td>

                      {/* Diet Type */}
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 inline-block">
                          {dietType?.name}
                        </span>
                      </td>

                      {/* Energy & Macros */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5 font-bold text-slate-800 text-xs">
                          <Flame className="w-3.5 h-3.5 text-amber-500" />
                          <span>{diet.calories} kcal</span>
                        </div>
                        <div className="text-[10px] text-slate-500 mt-1 flex items-center gap-2">
                          <span className="text-blue-600 font-semibold">P: {diet.protein}g</span>
                          <span className="text-amber-600 font-semibold">L: {diet.fat}g</span>
                          <span className="text-emerald-600 font-semibold">K: {diet.carbohydrate}g</span>
                        </div>
                      </td>

                      {/* Restrictions & Notes */}
                      <td className="py-3.5 px-4 max-w-xs">
                        {diet.restrictions && (
                          <div className="text-[11px] font-medium text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-100 mb-1">
                            🚫 {diet.restrictions}
                          </div>
                        )}
                        <div className="text-[10px] text-slate-600 italic">
                          📝 {diet.notes || 'Tidak ada catatan khusus.'}
                        </div>
                      </td>

                      {/* Meal Times */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1">
                          <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                            diet.breakfast ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-400 line-through'
                          }`}>
                            Pagi
                          </span>
                          <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                            diet.lunch ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-400 line-through'
                          }`}>
                            Siang
                          </span>
                          <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                            diet.dinner ? 'bg-purple-100 text-purple-800' : 'bg-slate-100 text-slate-400 line-through'
                          }`}>
                            Malam
                          </span>
                        </div>
                      </td>

                      {/* Effective Date */}
                      <td className="py-3.5 px-4 text-slate-700 font-mono text-[11px]">
                        {diet.effectiveDate}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          diet.status === 'Aktif' 
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
                            : 'bg-slate-100 text-slate-600 border border-slate-200'
                        }`}>
                          {diet.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={() => openEditModal(diet)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit Resep Diet"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Diet Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden border border-slate-200 my-8 animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-slate-900 px-6 py-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <UtensilsCrossed className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-sm">
                  {editingDiet ? 'Edit Resep Diet Pasien' : 'Form Preskripsi Diet Baru'}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Pilih Pasien Rawat Inap
                  </label>
                  <select
                    value={patientId}
                    onChange={(e) => setPatientId(e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 outline-none focus:border-emerald-600"
                  >
                    {patients.map((p) => {
                      const r = rooms.find(rm => rm.id === p.roomId);
                      return (
                        <option key={p.id} value={p.id}>
                          {p.name} ({p.medicalRecordNumber}) - {r ? `${r.ward} ${r.roomNumber}` : ''}
                        </option>
                      );
                    })}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Jenis Diet Utama
                  </label>
                  <select
                    value={dietTypeId}
                    onChange={(e) => handleDietTypeChange(e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-emerald-800 outline-none focus:border-emerald-600"
                  >
                    {dietTypes.map((dt) => (
                      <option key={dt.id} value={dt.id}>{dt.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Macro & Energy Targets */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Flame className="w-4 h-4 text-amber-500" />
                    Target Kebutuhan Kalori & Makronutrisi
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">
                    Total Kalkulasi: ~{calcProteinCal + calcFatCal + calcCarbCal} kcal
                  </span>
                </div>

                <div className="grid grid-cols-4 gap-2">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Kalori (kcal)</label>
                    <input
                      type="number"
                      value={calories}
                      onChange={(e) => setCalories(parseInt(e.target.value) || 0)}
                      required
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-amber-600 outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-blue-600 uppercase mb-1">Protein (gram)</label>
                    <input
                      type="number"
                      value={protein}
                      onChange={(e) => setProtein(parseInt(e.target.value) || 0)}
                      required
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-blue-600 outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-amber-600 uppercase mb-1">Lemak (gram)</label>
                    <input
                      type="number"
                      value={fat}
                      onChange={(e) => setFat(parseInt(e.target.value) || 0)}
                      required
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-amber-600 outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-emerald-600 uppercase mb-1">Karbo (gram)</label>
                    <input
                      type="number"
                      value={carbohydrate}
                      onChange={(e) => setCarbohydrate(parseInt(e.target.value) || 0)}
                      required
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-emerald-600 outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                {/* Macro Distribution Visual Progress Bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] text-slate-500 font-semibold">
                    <span>Distribusi Kalori:</span>
                    <span>Protein ({proteinPct}%) • Lemak ({fatPct}%) • Karbo ({carbPct}%)</span>
                  </div>
                  <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden flex">
                    <div style={{ width: `${proteinPct}%` }} className="bg-blue-500" title={`Protein ${proteinPct}%`} />
                    <div style={{ width: `${fatPct}%` }} className="bg-amber-500" title={`Lemak ${fatPct}%`} />
                    <div style={{ width: `${carbPct}%` }} className="bg-emerald-500" title={`Karbo ${carbPct}%`} />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Pantangan / Alergi Makanan
                </label>
                <input
                  type="text"
                  value={restrictions}
                  onChange={(e) => setRestrictions(e.target.value)}
                  placeholder="Contoh: Gula pasir, Santan kental, Telur, Seafood..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-rose-700 outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Catatan Khusus Pengolahan / Porsi
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Contoh: Porsi kecil 3x makan + 2x selingan, nasi merah..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 outline-none focus:border-emerald-600"
                />
              </div>

              {/* Delivery Times Checklist */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-2">
                  Waktu Pemberian Makanan Hari Ini
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <label className={`p-2.5 rounded-xl border flex items-center gap-2 cursor-pointer transition-all ${
                    breakfast ? 'border-blue-500 bg-blue-50 text-blue-900 font-bold' : 'border-slate-200 bg-slate-50 text-slate-600'
                  }`}>
                    <input
                      type="checkbox"
                      checked={breakfast}
                      onChange={(e) => setBreakfast(e.target.checked)}
                      className="w-4 h-4 text-blue-600 rounded"
                    />
                    <span className="text-xs">☑ Pagi (06:30)</span>
                  </label>

                  <label className={`p-2.5 rounded-xl border flex items-center gap-2 cursor-pointer transition-all ${
                    lunch ? 'border-emerald-500 bg-emerald-50 text-emerald-900 font-bold' : 'border-slate-200 bg-slate-50 text-slate-600'
                  }`}>
                    <input
                      type="checkbox"
                      checked={lunch}
                      onChange={(e) => setLunch(e.target.checked)}
                      className="w-4 h-4 text-emerald-600 rounded"
                    />
                    <span className="text-xs">☑ Siang (11:30)</span>
                  </label>

                  <label className={`p-2.5 rounded-xl border flex items-center gap-2 cursor-pointer transition-all ${
                    dinner ? 'border-purple-500 bg-purple-50 text-purple-900 font-bold' : 'border-slate-200 bg-slate-50 text-slate-600'
                  }`}>
                    <input
                      type="checkbox"
                      checked={dinner}
                      onChange={(e) => setDinner(e.target.checked)}
                      className="w-4 h-4 text-purple-600 rounded"
                    />
                    <span className="text-xs">☑ Malam (17:30)</span>
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Tanggal Berlaku</label>
                  <input
                    type="date"
                    value={effectiveDate}
                    onChange={(e) => setEffectiveDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 outline-none focus:border-emerald-600"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Status Resep</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as DietStatus)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 outline-none focus:border-emerald-600"
                  >
                    <option value="Aktif">Aktif</option>
                    <option value="Tidak Aktif">Tidak Aktif</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20"
                >
                  {editingDiet ? 'Simpan Perubahan' : 'Simpan Resep Diet'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

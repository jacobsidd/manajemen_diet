import React, { useState } from 'react';
import { 
  Users, Plus, Search, Filter, Edit3, LogOut, CheckCircle2, 
  AlertCircle, Bed, Stethoscope, User, Calendar, ArrowRightLeft,
  X, Check, UtensilsCrossed, RefreshCw
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Patient, PatientStatus, Gender } from '../../types';

interface PatientManagementProps {
  onPrescribeDiet: (patientId: string) => void;
}

export const PatientManagement: React.FC<PatientManagementProps> = ({ onPrescribeDiet }) => {
  const { 
    patients, rooms, diagnoses, patientDiets, dietTypes,
    addPatient, updatePatient, dischargePatient, searchQuery, setSearchQuery 
  } = useApp();

  const [statusFilter, setStatusFilter] = useState<string>('Rawat Inap');
  const [wardFilter, setWardFilter] = useState<string>('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);

  // Form states
  const [medicalRecordNumber, setMedicalRecordNumber] = useState('');
  const [name, setName] = useState('');
  const [gender, setGender] = useState<Gender>('L');
  const [birthDate, setBirthDate] = useState('1980-01-01');
  const [age, setAge] = useState(46);
  const [doctor, setDoctor] = useState('dr. Hendra, Sp.PD');
  const [roomId, setRoomId] = useState('');
  const [diagnosisId, setDiagnosisId] = useState('');
  const [bed, setBed] = useState('Bed A');
  const [admissionDate, setAdmissionDate] = useState(new Date().toISOString().split('T')[0]);
  const [status, setStatus] = useState<PatientStatus>('Rawat Inap');

  // Generate unique RM number option
  const generateRM = () => {
    const randomNum = Math.floor(100 + Math.random() * 900);
    return `RM-2026-${randomNum}`;
  };

  const openAddModal = () => {
    setEditingPatient(null);
    setMedicalRecordNumber(generateRM());
    setName('');
    setGender('L');
    setBirthDate('1980-01-01');
    setAge(46);
    setDoctor('dr. Hendra, Sp.PD');
    setRoomId(rooms[0]?.id || '');
    setDiagnosisId(diagnoses[0]?.id || '');
    setBed('Bed A');
    setAdmissionDate(new Date().toISOString().split('T')[0]);
    setStatus('Rawat Inap');
    setIsModalOpen(true);
  };

  const openEditModal = (p: Patient) => {
    setEditingPatient(p);
    setMedicalRecordNumber(p.medicalRecordNumber);
    setName(p.name);
    setGender(p.gender);
    setBirthDate(p.birthDate);
    setAge(p.age);
    setDoctor(p.doctor);
    setRoomId(p.roomId);
    setDiagnosisId(p.diagnosisId);
    setBed(p.bed);
    setAdmissionDate(p.admissionDate);
    setStatus(p.status);
    setIsModalOpen(true);
  };

  const handleBirthDateChange = (dateVal: string) => {
    setBirthDate(dateVal);
    if (dateVal) {
      const birth = new Date(dateVal);
      const now = new Date();
      let calculatedAge = now.getFullYear() - birth.getFullYear();
      const monthDiff = now.getMonth() - birth.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < birth.getDate())) {
        calculatedAge--;
      }
      setAge(Math.max(0, calculatedAge));
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingPatient) {
      updatePatient(editingPatient.id, {
        medicalRecordNumber,
        name,
        gender,
        birthDate,
        age,
        doctor,
        roomId,
        diagnosisId,
        bed,
        admissionDate,
        status
      });
    } else {
      addPatient({
        medicalRecordNumber,
        name,
        gender,
        birthDate,
        age,
        doctor,
        roomId,
        diagnosisId,
        bed,
        admissionDate,
        status
      });
    }

    setIsModalOpen(false);
  };

  // Unique list of wards
  const wards = Array.from(new Set(rooms.map(r => r.ward)));

  // Filtering
  const filteredPatients = patients.filter(p => {
    // Search query
    const matchesSearch = 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.medicalRecordNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.doctor.toLowerCase().includes(searchQuery.toLowerCase());

    // Status filter
    const matchesStatus = statusFilter === 'All' ? true : p.status === statusFilter;

    // Ward filter
    const room = rooms.find(r => r.id === p.roomId);
    const matchesWard = wardFilter === 'All' ? true : room?.ward === wardFilter;

    return matchesSearch && matchesStatus && matchesWard;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Users className="w-6 h-6 text-blue-600" />
            <span>Manajemen Pasien Inap</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Kelola data registrasi pasien, nomor rekam medis, kamar, dan status rawat
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-600/20 flex items-center gap-2 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Pasien Baru</span>
        </button>
      </div>

      {/* Filters & Search Controls */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl">
          {['Rawat Inap', 'Pulang', 'Pindah', 'All'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                statusFilter === st 
                  ? 'bg-white text-blue-700 shadow-xs font-bold' 
                  : 'text-slate-600 hover:text-slate-800'
              }`}
            >
              {st === 'All' ? 'Semua Status' : st}
            </button>
          ))}
        </div>

        {/* Ward Dropdown Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-semibold text-slate-600">Bangsal:</span>
          <select
            value={wardFilter}
            onChange={(e) => setWardFilter(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 outline-none focus:border-blue-500"
          >
            <option value="All">Semua Ruangan</option>
            {wards.map((w) => (
              <option key={w} value={w}>{w}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Patients Data Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-4">Pasien & No. RM</th>
                <th className="py-3.5 px-4">Gender / Umur</th>
                <th className="py-3.5 px-4">Kamar & Bed</th>
                <th className="py-3.5 px-4">Diagnosa (ICD)</th>
                <th className="py-3.5 px-4">Diet Aktif</th>
                <th className="py-3.5 px-4">Dokter DPJP</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {filteredPatients.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    <Users className="w-10 h-10 mx-auto mb-2 opacity-40 text-slate-400" />
                    <p className="font-semibold text-slate-600">Tidak ada data pasien yang cocok.</p>
                    <p className="text-[11px] mt-0.5">Coba ubah kata kunci pencarian atau filter status.</p>
                  </td>
                </tr>
              ) : (
                filteredPatients.map((p) => {
                  const room = rooms.find(r => r.id === p.roomId);
                  const diag = diagnoses.find(d => d.id === p.diagnosisId);
                  const activeDiet = patientDiets.find(pd => pd.patientId === p.id && pd.status === 'Aktif');
                  const dietType = activeDiet ? dietTypes.find(dt => dt.id === activeDiet.dietTypeId) : null;

                  return (
                    <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                      {/* Name & RM */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-800 text-xs">{p.name}</div>
                        <div className="text-[11px] font-mono text-blue-600 font-semibold">{p.medicalRecordNumber}</div>
                        <div className="text-[10px] text-slate-400">Masuk: {p.admissionDate}</div>
                      </td>

                      {/* Gender & Age */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5 font-medium">
                          <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                            p.gender === 'L' ? 'bg-blue-100 text-blue-800' : 'bg-pink-100 text-pink-800'
                          }`}>
                            {p.gender === 'L' ? 'Laki-laki' : 'Perempuan'}
                          </span>
                          <span>{p.age} Thn</span>
                        </div>
                      </td>

                      {/* Room & Bed */}
                      <td className="py-3.5 px-4">
                        {room ? (
                          <div>
                            <span className="font-bold text-slate-800">{room.ward} - {room.roomNumber}</span>
                            <div className="text-[11px] text-slate-500">{p.bed} ({room.class})</div>
                          </div>
                        ) : (
                          <span className="text-slate-400 font-italic">Kamar tidak diset</span>
                        )}
                      </td>

                      {/* Diagnosis */}
                      <td className="py-3.5 px-4 max-w-xs">
                        {diag ? (
                          <div>
                            <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 mr-1">
                              {diag.code}
                            </span>
                            <span className="font-medium text-slate-700">{diag.name}</span>
                          </div>
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </td>

                      {/* Active Diet */}
                      <td className="py-3.5 px-4">
                        {dietType ? (
                          <div>
                            <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 inline-block text-[11px]">
                              {dietType.name.split('(')[0]}
                            </span>
                            <div className="text-[10px] text-slate-500 mt-0.5">
                              {activeDiet.calories} kcal ({activeDiet.protein}P/{activeDiet.fat}L/{activeDiet.carbohydrate}K)
                            </div>
                          </div>
                        ) : (
                          <button
                            onClick={() => onPrescribeDiet(p.id)}
                            className="text-[11px] text-amber-600 hover:text-amber-700 font-bold bg-amber-50 hover:bg-amber-100 px-2 py-1 rounded-lg border border-amber-200 flex items-center gap-1"
                          >
                            <UtensilsCrossed className="w-3 h-3" />
                            <span>Input Diet</span>
                          </button>
                        )}
                      </td>

                      {/* Doctor */}
                      <td className="py-3.5 px-4 text-slate-700 font-medium">
                        {p.doctor}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          p.status === 'Rawat Inap' 
                            ? 'bg-blue-100 text-blue-800 border border-blue-200' 
                            : p.status === 'Pulang'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            : 'bg-amber-100 text-amber-800 border border-amber-200'
                        }`}>
                          {p.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => onPrescribeDiet(p.id)}
                            title="Kelola / Resepkan Diet"
                            className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                          >
                            <UtensilsCrossed className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => openEditModal(p)}
                            title="Edit Data Pasien"
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>

                          {p.status === 'Rawat Inap' && (
                            <button
                              onClick={() => dischargePatient(p.id)}
                              title="Set Pasien Pulang"
                              className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            >
                              <LogOut className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Patient Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl overflow-hidden border border-slate-200 my-8 animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-slate-900 px-6 py-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-400" />
                <h3 className="font-bold text-sm">
                  {editingPatient ? 'Edit Data Pasien' : 'Registrasi Pasien Baru'}
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
                    No. Rekam Medis (RM)
                  </label>
                  <div className="flex gap-1.5">
                    <input
                      type="text"
                      value={medicalRecordNumber}
                      onChange={(e) => setMedicalRecordNumber(e.target.value)}
                      required
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-blue-700 outline-none focus:border-blue-600"
                    />
                    <button
                      type="button"
                      onClick={() => setMedicalRecordNumber(generateRM())}
                      className="px-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-[10px] font-bold rounded-xl shrink-0"
                      title="Generate RM Otomatis"
                    >
                      Auto
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Nama Lengkap Pasien
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="Contoh: Bambang Sudirjo"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 outline-none focus:border-blue-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Jenis Kelamin</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as Gender)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 outline-none focus:border-blue-600"
                  >
                    <option value="L">Laki-laki (L)</option>
                    <option value="P">Perempuan (P)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Tgl Lahir</label>
                  <input
                    type="date"
                    value={birthDate}
                    onChange={(e) => handleBirthDateChange(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 outline-none focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Umur (Thn)</label>
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-none focus:border-blue-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Dokter DPJP</label>
                  <input
                    type="text"
                    value={doctor}
                    onChange={(e) => setDoctor(e.target.value)}
                    required
                    placeholder="dr. Ahmad, Sp.PD"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 outline-none focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Diagnosa Utama (ICD)</label>
                  <select
                    value={diagnosisId}
                    onChange={(e) => setDiagnosisId(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 outline-none focus:border-blue-600"
                  >
                    {diagnoses.map((d) => (
                      <option key={d.id} value={d.id}>[{d.code}] {d.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Pilih Kamar Inap</label>
                  <select
                    value={roomId}
                    onChange={(e) => setRoomId(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 outline-none focus:border-blue-600"
                  >
                    {rooms.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.ward} - Kamar {r.roomNumber} ({r.class}) [{r.occupied}/{r.capacity}]
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Nomor Bed</label>
                  <input
                    type="text"
                    value={bed}
                    onChange={(e) => setBed(e.target.value)}
                    placeholder="Bed A"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 outline-none focus:border-blue-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Tanggal Masuk</label>
                  <input
                    type="date"
                    value={admissionDate}
                    onChange={(e) => setAdmissionDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 outline-none focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Status Rawat</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as PatientStatus)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 outline-none focus:border-blue-600"
                  >
                    <option value="Rawat Inap">Rawat Inap</option>
                    <option value="Pulang">Pulang</option>
                    <option value="Pindah">Pindah</option>
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
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-600/20"
                >
                  {editingPatient ? 'Simpan Perubahan' : 'Daftarkan Pasien'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import { 
  Settings, Database, Download, Upload, RefreshCw, 
  Building2, ShieldCheck, Clock, CheckCircle2, AlertTriangle, FileText
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const SettingsView: React.FC = () => {
  const { 
    config, updateConfig, backupDatabaseJSON, restoreDatabaseJSON, 
    resetToSeedData, auditLogs 
  } = useApp();

  const [hospitalName, setHospitalName] = useState(config.name);
  const [address, setAddress] = useState(config.address);
  const [phone, setPhone] = useState(config.phone);
  const [email, setEmail] = useState(config.email);
  const [chiefDietitian, setChiefDietitian] = useState(config.chiefDietitian);
  const [licenseNumber, setLicenseNumber] = useState(config.licenseNumber);

  const [saveSuccess, setSaveSuccess] = useState(false);
  const [restoreStatus, setRestoreStatus] = useState<string | null>(null);

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    updateConfig({
      name: hospitalName,
      address,
      phone,
      email,
      chiefDietitian,
      licenseNumber
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleDownloadBackup = () => {
    const jsonStr = backupDatabaseJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dietcare_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleRestoreFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const success = restoreDatabaseJSON(content);
      if (success) {
        setRestoreStatus('Database berhasil dipulihkan dari file cadangan.');
      } else {
        setRestoreStatus('Format file backup tidak valid. Pemulihan gagal.');
      }
      setTimeout(() => setRestoreStatus(null), 4000);
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Settings className="w-6 h-6 text-slate-700" />
            <span>Pengaturan Sistem & Backup Database</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Konfigurasi identitas rumah sakit, pencadangan database SQLite/JSON, dan audit log
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hospital Identity Form */}
        <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
            <Building2 className="w-5 h-5 text-blue-600" />
            <h2 className="text-sm font-bold text-slate-800">Profil Rumah Sakit & Instalasi Gizi</h2>
          </div>

          {saveSuccess && (
            <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Profil rumah sakit berhasil diperbarui.</span>
            </div>
          )}

          <form onSubmit={handleSaveConfig} className="space-y-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Nama Rumah Sakit</label>
              <input
                type="text"
                value={hospitalName}
                onChange={(e) => setHospitalName(e.target.value)}
                required
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-none focus:border-blue-600"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Alamat Lengkap</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 outline-none focus:border-blue-600"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Telepon</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Email Resmi</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 outline-none focus:border-blue-600"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Kepala Instalasi Gizi</label>
                <input
                  type="text"
                  value={chiefDietitian}
                  onChange={(e) => setChiefDietitian(e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">No. SIPG / Izin</label>
                <input
                  type="text"
                  value={licenseNumber}
                  onChange={(e) => setLicenseNumber(e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-blue-700 outline-none focus:border-blue-600"
                />
              </div>
            </div>

            <button
              type="submit"
              className="mt-2 w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-600/20 transition-all cursor-pointer"
            >
              Simpan Profil Rumah Sakit
            </button>
          </form>
        </div>

        {/* Backup & Restore Database Section */}
        <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
              <Database className="w-5 h-5 text-emerald-600" />
              <h2 className="text-sm font-bold text-slate-800">Pencadangan & Pemulihan Database (Backup / Restore)</h2>
            </div>

            <p className="text-xs text-slate-600 mb-4 leading-relaxed">
              Anda dapat mengunduh salinan cadangan instan seluruh data pasien, resep diet, kamar, diagnosa, dan pengguna sistem dalam format terenkripsi/JSON yang kompatibel dengan database SQLite.
            </p>

            {restoreStatus && (
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 text-blue-800 rounded-xl text-xs font-semibold">
                {restoreStatus}
              </div>
            )}

            <div className="space-y-3">
              <button
                type="button"
                onClick={handleDownloadBackup}
                className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Unduh Backup Database (.JSON)</span>
              </button>

              <label className="w-full py-3 px-4 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer">
                <Upload className="w-4 h-4" />
                <span>Restore Database dari File</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleRestoreFile}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-slate-100">
            <div className="p-3 bg-rose-50 rounded-xl border border-rose-200 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-rose-900">Reset Pabrik Sistem</p>
                <p className="text-[10px] text-rose-700">Kembalikan data ke awal (Seed Data)</p>
              </div>

              <button
                type="button"
                onClick={() => {
                  if (confirm('Apakah Anda yakin ingin mereset seluruh database ke data pabrik?')) {
                    resetToSeedData();
                  }
                }}
                className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-lg shadow-xs"
              >
                Reset System
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Audit Log Full View */}
      <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-600" />
            <h2 className="text-sm font-bold text-slate-800">Catatan Audit Trail Log Sistem</h2>
          </div>
          <span className="text-xs text-slate-500 font-medium">Total: {auditLogs.length} Entri</span>
        </div>

        <div className="overflow-x-auto max-h-80 overflow-y-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-2.5 px-3">Waktu</th>
                <th className="py-2.5 px-3">User</th>
                <th className="py-2.5 px-3">Role</th>
                <th className="py-2.5 px-3">Tindakan</th>
                <th className="py-2.5 px-3">Detail</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {auditLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50">
                  <td className="py-2.5 px-3 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                    {new Date(log.timestamp).toLocaleString('id-ID')}
                  </td>
                  <td className="py-2.5 px-3 font-bold text-slate-800 whitespace-nowrap">{log.userName}</td>
                  <td className="py-2.5 px-3 whitespace-nowrap">
                    <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                      {log.userRole}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 font-semibold text-blue-700 whitespace-nowrap">{log.action}</td>
                  <td className="py-2.5 px-3 text-slate-600">{log.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

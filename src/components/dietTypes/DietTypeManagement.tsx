import React, { useState } from 'react';
import { BookOpen, Plus, Search, Edit3, Trash2, Flame, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { DietType } from '../../types';

export const DietTypeManagement: React.FC = () => {
  const { dietTypes, addDietType, updateDietType, deleteDietType, searchQuery } = useApp();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDietType, setEditingDietType] = useState<DietType | null>(null);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [defaultCalories, setDefaultCalories] = useState(1900);
  const [defaultProtein, setDefaultProtein] = useState(65);
  const [defaultFat, setDefaultFat] = useState(50);
  const [defaultCarbs, setDefaultCarbs] = useState(280);

  const openAddModal = () => {
    setEditingDietType(null);
    setName('');
    setDescription('');
    setDefaultCalories(1900);
    setDefaultProtein(65);
    setDefaultFat(50);
    setDefaultCarbs(280);
    setIsModalOpen(true);
  };

  const openEditModal = (dt: DietType) => {
    setEditingDietType(dt);
    setName(dt.name);
    setDescription(dt.description);
    setDefaultCalories(dt.defaultCalories || 1900);
    setDefaultProtein(dt.defaultProtein || 65);
    setDefaultFat(dt.defaultFat || 50);
    setDefaultCarbs(dt.defaultCarbs || 280);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !description) return;

    if (editingDietType) {
      updateDietType(editingDietType.id, {
        name,
        description,
        defaultCalories,
        defaultProtein,
        defaultFat,
        defaultCarbs
      });
    } else {
      addDietType({
        name,
        description,
        defaultCalories,
        defaultProtein,
        defaultFat,
        defaultCarbs
      });
    }

    setIsModalOpen(false);
  };

  const filteredDietTypes = dietTypes.filter(dt => 
    dt.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    dt.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-blue-600" />
            <span>Master Jenis Diet Rumah Sakit</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Daftar kualifikasi jenis diet khusus (Diet DM, Rendah Garam, TKTP, Diet Lunak, dll)
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-600/20 flex items-center gap-2 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Jenis Diet</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDietTypes.map((dt) => (
          <div key={dt.id} className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-bold text-sm text-slate-800">{dt.name}</h3>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => openEditModal(dt)}
                    className="p-1 text-slate-400 hover:text-blue-600 transition-colors"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteDietType(dt.id)}
                    className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <p className="text-xs text-slate-600 mt-2 line-clamp-3 leading-relaxed">
                {dt.description}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="flex items-center gap-1 font-bold text-amber-600">
                <Flame className="w-4 h-4" />
                <span>{dt.defaultCalories || 1900} kcal</span>
              </span>
              <span className="text-[10px] text-slate-500 font-mono font-semibold">
                P:{dt.defaultProtein || 65}g | L:{dt.defaultFat || 50}g | K:{dt.defaultCarbs || 280}g
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-slate-900 px-6 py-4 text-white flex items-center justify-between">
              <h3 className="font-bold text-sm">
                {editingDietType ? 'Edit Master Jenis Diet' : 'Tambah Jenis Diet Baru'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Nama Jenis Diet</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="Contoh: Diet Diabetes Mellitus (RG/DM)"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Keterangan / Indikasi</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  placeholder="Contoh: Diet khusus penderita diabetes dengan pengaturan karbohidrat..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 outline-none focus:border-blue-600"
                />
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <span className="text-xs font-bold text-slate-700">Acuan Default Nutrisi:</span>
                <div className="grid grid-cols-4 gap-2 text-xs">
                  <div>
                    <label className="text-[10px] font-semibold text-slate-500">Kalori</label>
                    <input
                      type="number"
                      value={defaultCalories}
                      onChange={(e) => setDefaultCalories(parseInt(e.target.value) || 0)}
                      className="w-full px-2 py-1 bg-white border border-slate-200 rounded text-xs font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-semibold text-slate-500">Protein</label>
                    <input
                      type="number"
                      value={defaultProtein}
                      onChange={(e) => setDefaultProtein(parseInt(e.target.value) || 0)}
                      className="w-full px-2 py-1 bg-white border border-slate-200 rounded text-xs font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-semibold text-slate-500">Lemak</label>
                    <input
                      type="number"
                      value={defaultFat}
                      onChange={(e) => setDefaultFat(parseInt(e.target.value) || 0)}
                      className="w-full px-2 py-1 bg-white border border-slate-200 rounded text-xs font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-semibold text-slate-500">Karbo</label>
                    <input
                      type="number"
                      value={defaultCarbs}
                      onChange={(e) => setDefaultCarbs(parseInt(e.target.value) || 0)}
                      className="w-full px-2 py-1 bg-white border border-slate-200 rounded text-xs font-bold"
                    />
                  </div>
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
                  Simpan Jenis Diet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

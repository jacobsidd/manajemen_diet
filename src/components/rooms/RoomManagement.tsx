import React, { useState } from 'react';
import { Bed, Plus, Search, Edit3, Trash2, CheckCircle2, AlertCircle, Wrench, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Room, RoomStatus } from '../../types';

export const RoomManagement: React.FC = () => {
  const { rooms, addRoom, updateRoom, deleteRoom, searchQuery } = useApp();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);

  const [roomNumber, setRoomNumber] = useState('');
  const [ward, setWard] = useState('Melati');
  const [roomClass, setRoomClass] = useState('Kelas 1');
  const [capacity, setCapacity] = useState(2);
  const [status, setStatus] = useState<RoomStatus>('Tersedia');

  const openAddModal = () => {
    setEditingRoom(null);
    setRoomNumber('103');
    setWard('Mawar');
    setRoomClass('Kelas 1');
    setCapacity(2);
    setStatus('Tersedia');
    setIsModalOpen(true);
  };

  const openEditModal = (r: Room) => {
    setEditingRoom(r);
    setRoomNumber(r.roomNumber);
    setWard(r.ward);
    setRoomClass(r.class);
    setCapacity(r.capacity);
    setStatus(r.status);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomNumber || !ward) return;

    if (editingRoom) {
      updateRoom(editingRoom.id, {
        roomNumber,
        ward,
        class: roomClass,
        capacity,
        status
      });
    } else {
      addRoom({
        roomNumber,
        ward,
        class: roomClass,
        capacity,
        status
      });
    }

    setIsModalOpen(false);
  };

  const filteredRooms = rooms.filter(r => 
    r.roomNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.ward.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.class.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Bed className="w-6 h-6 text-purple-600" />
            <span>Manajemen Kamar & Ruangan Inap</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Pengelolaan nomor kamar, bangsal/ruangan, kelas rawat inap, dan kapasitas bed
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-md shadow-purple-600/20 flex items-center gap-2 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Kamar Baru</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-4">No. Kamar</th>
                <th className="py-3.5 px-4">Bangsal / Ruangan</th>
                <th className="py-3.5 px-4">Kelas Rawat</th>
                <th className="py-3.5 px-4">Kapasitas / Terisi</th>
                <th className="py-3.5 px-4">Occupancy</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {filteredRooms.map((r) => {
                const occupancyPct = Math.round((r.occupied / r.capacity) * 100);

                return (
                  <tr key={r.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-800">
                      Kamar {r.roomNumber}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-purple-700">
                      {r.ward}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded font-medium text-[11px]">
                        {r.class}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-800">
                      {r.occupied} / {r.capacity} Bed
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2 max-w-xs">
                        <div className="w-20 h-2 bg-slate-200 rounded-full overflow-hidden">
                          <div 
                            style={{ width: `${occupancyPct}%` }} 
                            className={`h-full ${
                              occupancyPct >= 100 ? 'bg-rose-500' : occupancyPct > 50 ? 'bg-amber-500' : 'bg-emerald-500'
                            }`}
                          />
                        </div>
                        <span className="text-[10px] text-slate-500 font-mono font-bold">{occupancyPct}%</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        r.status === 'Tersedia' 
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : r.status === 'Penuh'
                          ? 'bg-rose-100 text-rose-800 border border-rose-200'
                          : 'bg-amber-100 text-amber-800 border border-amber-200'
                      }`}>
                        {r.status === 'Pemeliharaan' && <Wrench className="w-3 h-3" />}
                        {r.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => openEditModal(r)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteRoom(r.id)}
                          className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-slate-900 px-6 py-4 text-white flex items-center justify-between">
              <h3 className="font-bold text-sm">
                {editingRoom ? 'Edit Data Kamar' : 'Tambah Kamar Inap Baru'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Nomor Kamar</label>
                <input
                  type="text"
                  value={roomNumber}
                  onChange={(e) => setRoomNumber(e.target.value)}
                  required
                  placeholder="Contoh: 101 atau VIP 03"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-none focus:border-purple-600"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Bangsal / Ruangan</label>
                <input
                  type="text"
                  value={ward}
                  onChange={(e) => setWard(e.target.value)}
                  required
                  placeholder="Contoh: Melati, Mawar, Anggrek, VIP Utama"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 outline-none focus:border-purple-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Kelas Rawat</label>
                  <select
                    value={roomClass}
                    onChange={(e) => setRoomClass(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 outline-none focus:border-purple-600"
                  >
                    <option value="VIP">VIP</option>
                    <option value="Kelas 1">Kelas 1</option>
                    <option value="Kelas 2">Kelas 2</option>
                    <option value="Kelas 3">Kelas 3</option>
                    <option value="ICU">ICU / ICCU</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Kapasitas Bed</label>
                  <input
                    type="number"
                    value={capacity}
                    onChange={(e) => setCapacity(parseInt(e.target.value) || 1)}
                    min={1}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-none focus:border-purple-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Status Kamar</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as RoomStatus)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 outline-none focus:border-purple-600"
                >
                  <option value="Tersedia">Tersedia</option>
                  <option value="Penuh">Penuh</option>
                  <option value="Pemeliharaan">Pemeliharaan / Perbaikan</option>
                </select>
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
                  className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow-md shadow-purple-600/20"
                >
                  Simpan Data Kamar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

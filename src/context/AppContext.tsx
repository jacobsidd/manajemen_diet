import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User, Room, Diagnosis, DietType, Patient, PatientDiet, AuditLog, HospitalConfig
} from '../types';
import {
  initialUsers, initialRooms, initialDiagnoses, initialDietTypes,
  initialPatients, initialPatientDiets, initialAuditLogs, initialHospitalConfig
} from '../data/seedData';

interface AppContextType {
  currentUser: User | null;
  users: User[];
  rooms: Room[];
  diagnoses: Diagnosis[];
  dietTypes: DietType[];
  patients: Patient[];
  patientDiets: PatientDiet[];
  auditLogs: AuditLog[];
  config: HospitalConfig;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  
  // Auth
  login: (username: string, password?: string) => { success: boolean; message: string };
  logout: () => void;
  switchRoleQuickly: (role: 'Admin' | 'Petugas') => void;

  // CRUD Users
  addUser: (user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateUser: (id: string, updates: Partial<User>) => void;
  deleteUser: (id: string) => void;
  resetUserPassword: (id: string) => { success: boolean; message: string };
  setUserPassword: (id: string, newPassword: string) => { success: boolean; message: string };

  // CRUD Rooms
  addRoom: (room: Omit<Room, 'id' | 'occupied' | 'createdAt' | 'updatedAt'>) => void;
  updateRoom: (id: string, updates: Partial<Room>) => void;
  deleteRoom: (id: string) => void;

  // CRUD Diagnoses
  addDiagnosis: (diag: Omit<Diagnosis, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateDiagnosis: (id: string, updates: Partial<Diagnosis>) => void;
  deleteDiagnosis: (id: string) => void;

  // CRUD Diet Types
  addDietType: (dt: Omit<DietType, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateDietType: (id: string, updates: Partial<DietType>) => void;
  deleteDietType: (id: string) => void;

  // CRUD Patients
  addPatient: (patient: Omit<Patient, 'id' | 'createdAt' | 'updatedAt'>) => Patient;
  updatePatient: (id: string, updates: Partial<Patient>) => void;
  dischargePatient: (id: string) => void;

  // CRUD Patient Diets
  assignPatientDiet: (diet: Omit<PatientDiet, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updatePatientDiet: (id: string, updates: Partial<PatientDiet>) => void;

  // Config & System
  updateConfig: (cfg: Partial<HospitalConfig>) => void;
  backupDatabaseJSON: () => string;
  restoreDatabaseJSON: (jsonString: string) => boolean;
  resetToSeedData: () => void;
  addLog: (action: string, details: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'dietcare_manager_v1_store';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_user`);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return initialUsers[0]; // Default logged in as Admin for easy testing
  });

  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_users`);
    return saved ? JSON.parse(saved) : initialUsers;
  });

  const [rooms, setRooms] = useState<Room[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_rooms`);
    return saved ? JSON.parse(saved) : initialRooms;
  });

  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_diagnoses`);
    return saved ? JSON.parse(saved) : initialDiagnoses;
  });

  const [dietTypes, setDietTypes] = useState<DietType[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_dietTypes`);
    return saved ? JSON.parse(saved) : initialDietTypes;
  });

  const [patients, setPatients] = useState<Patient[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_patients`);
    return saved ? JSON.parse(saved) : initialPatients;
  });

  const [patientDiets, setPatientDiets] = useState<PatientDiet[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_patientDiets`);
    return saved ? JSON.parse(saved) : initialPatientDiets;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_auditLogs`);
    return saved ? JSON.parse(saved) : initialAuditLogs;
  });

  const [config, setConfig] = useState<HospitalConfig>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_config`);
    return saved ? JSON.parse(saved) : initialHospitalConfig;
  });

  const [searchQuery, setSearchQuery] = useState('');

  // Persist state
  useEffect(() => {
    if (currentUser) localStorage.setItem(`${LOCAL_STORAGE_KEY}_user`, JSON.stringify(currentUser));
    else localStorage.removeItem(`${LOCAL_STORAGE_KEY}_user`);
  }, [currentUser]);

  useEffect(() => { localStorage.setItem(`${LOCAL_STORAGE_KEY}_users`, JSON.stringify(users)); }, [users]);
  useEffect(() => { localStorage.setItem(`${LOCAL_STORAGE_KEY}_rooms`, JSON.stringify(rooms)); }, [rooms]);
  useEffect(() => { localStorage.setItem(`${LOCAL_STORAGE_KEY}_diagnoses`, JSON.stringify(diagnoses)); }, [diagnoses]);
  useEffect(() => { localStorage.setItem(`${LOCAL_STORAGE_KEY}_dietTypes`, JSON.stringify(dietTypes)); }, [dietTypes]);
  useEffect(() => { localStorage.setItem(`${LOCAL_STORAGE_KEY}_patients`, JSON.stringify(patients)); }, [patients]);
  useEffect(() => { localStorage.setItem(`${LOCAL_STORAGE_KEY}_patientDiets`, JSON.stringify(patientDiets)); }, [patientDiets]);
  useEffect(() => { localStorage.setItem(`${LOCAL_STORAGE_KEY}_auditLogs`, JSON.stringify(auditLogs)); }, [auditLogs]);
  useEffect(() => { localStorage.setItem(`${LOCAL_STORAGE_KEY}_config`, JSON.stringify(config)); }, [config]);

  // Sync room occupancy based on patients in Rawat Inap
  useEffect(() => {
    setRooms(prevRooms => prevRooms.map(rm => {
      const currentOccupied = patients.filter(p => p.roomId === rm.id && p.status === 'Rawat Inap').length;
      let newStatus = rm.status;
      if (rm.status !== 'Pemeliharaan') {
        newStatus = currentOccupied >= rm.capacity ? 'Penuh' : 'Tersedia';
      }
      return { ...rm, occupied: currentOccupied, status: newStatus };
    }));
  }, [patients]);

  const addLog = (action: string, details: string) => {
    const newLog: AuditLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      userId: currentUser?.id || 'sys',
      userName: currentUser?.name || 'Sistem',
      userRole: currentUser?.role || 'Admin',
      action,
      details
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  // Auth Methods
  const login = (username: string, password?: string) => {
    const user = users.find(u => u.username.toLowerCase() === username.toLowerCase().trim());
    if (!user) {
      return { success: false, message: 'Username tidak ditemukan.' };
    }
    if (user.status !== 'Aktif') {
      return { success: false, message: 'Akun Anda tidak aktif. Silakan hubungi Administrator.' };
    }
    // Password check if password is defined on user account
    if (user.password && password && user.password !== password) {
      return { success: false, message: 'Password yang Anda masukkan salah.' };
    }
    if (password && password.length < 4) {
      return { success: false, message: 'Password minimal 4 karakter.' };
    }
    setCurrentUser(user);
    addLog('User Login', `User ${user.name} (${user.role}) berhasil masuk ke sistem.`);
    return { success: true, message: 'Login berhasil.' };
  };

  const logout = () => {
    if (currentUser) {
      addLog('User Logout', `User ${currentUser.name} keluar dari sistem.`);
    }
    setCurrentUser(null);
  };

  const switchRoleQuickly = (role: 'Admin' | 'Petugas') => {
    const target = users.find(u => u.role === role && u.status === 'Aktif') || {
      id: role === 'Admin' ? 'usr-1' : 'usr-2',
      name: role === 'Admin' ? 'Administrator Gizi' : 'Siti Rahma, S.Gz',
      username: role === 'Admin' ? 'admin' : 'petugas1',
      role,
      status: 'Aktif' as const,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setCurrentUser(target);
    addLog('Switch Role', `Beralih peran ke ${target.role} (${target.name}).`);
  };

  // CRUD Users
  const addUser = (userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newUser: User = {
      ...userData,
      id: `usr-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setUsers(prev => [...prev, newUser]);
    addLog('Tambah User', `Menambahkan pengguna baru ${newUser.name} (${newUser.role}).`);
  };

  const updateUser = (id: string, updates: Partial<User>) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, ...updates, updatedAt: new Date().toISOString() } : u));
    const u = users.find(x => x.id === id);
    if (u) addLog('Edit User', `Memperbarui data pengguna ${u.name}.`);
  };

  const deleteUser = (id: string) => {
    const u = users.find(x => x.id === id);
    setUsers(prev => prev.filter(x => x.id !== id));
    if (u) addLog('Hapus User', `Menghapus pengguna ${u.name}.`);
  };

  const setUserPassword = (id: string, newPassword: string): { success: boolean; message: string } => {
    if (!newPassword || newPassword.trim().length < 4) {
      return { success: false, message: 'Password minimal harus 4 karakter!' };
    }
    const cleanPass = newPassword.trim();
    setUsers(prev => prev.map(u => u.id === id ? { ...u, password: cleanPass, updatedAt: new Date().toISOString() } : u));
    
    // Update current user if changing own password
    if (currentUser && currentUser.id === id) {
      setCurrentUser(prev => prev ? { ...prev, password: cleanPass, updatedAt: new Date().toISOString() } : null);
    }

    const u = users.find(x => x.id === id);
    if (u) {
      addLog('Atur Password', `Memperbarui password pengguna ${u.name} (${u.username}).`);
    }
    return { success: true, message: `Password untuk user ${u?.name || ''} berhasil diperbarui!` };
  };

  const resetUserPassword = (id: string): { success: boolean; message: string } => {
    const defaultPass = '123456';
    setUsers(prev => prev.map(u => u.id === id ? { ...u, password: defaultPass, updatedAt: new Date().toISOString() } : u));
    
    if (currentUser && currentUser.id === id) {
      setCurrentUser(prev => prev ? { ...prev, password: defaultPass, updatedAt: new Date().toISOString() } : null);
    }

    const u = users.find(x => x.id === id);
    if (u) {
      addLog('Reset Password', `Mereset password pengguna ${u.name} (${u.username}) ke default (123456).`);
    }
    return { success: true, message: `Password ${u?.name || ''} berhasil direset ke '${defaultPass}'.` };
  };

  // CRUD Rooms
  const addRoom = (roomData: Omit<Room, 'id' | 'occupied' | 'createdAt' | 'updatedAt'>) => {
    const newRoom: Room = {
      ...roomData,
      id: `rm-${Date.now()}`,
      occupied: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setRooms(prev => [...prev, newRoom]);
    addLog('Tambah Kamar', `Menambahkan Kamar ${newRoom.roomNumber} (${newRoom.ward}).`);
  };

  const updateRoom = (id: string, updates: Partial<Room>) => {
    setRooms(prev => prev.map(r => r.id === id ? { ...r, ...updates, updatedAt: new Date().toISOString() } : r));
    addLog('Edit Kamar', `Memperbarui data kamar ID: ${id}.`);
  };

  const deleteRoom = (id: string) => {
    const r = rooms.find(x => x.id === id);
    setRooms(prev => prev.filter(x => x.id !== id));
    if (r) addLog('Hapus Kamar', `Menghapus Kamar ${r.roomNumber} (${r.ward}).`);
  };

  // CRUD Diagnoses
  const addDiagnosis = (diagData: Omit<Diagnosis, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newDiag: Diagnosis = {
      ...diagData,
      id: `diag-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setDiagnoses(prev => [...prev, newDiag]);
    addLog('Tambah Diagnosa', `Menambahkan diagnosa [${newDiag.code}] ${newDiag.name}.`);
  };

  const updateDiagnosis = (id: string, updates: Partial<Diagnosis>) => {
    setDiagnoses(prev => prev.map(d => d.id === id ? { ...d, ...updates, updatedAt: new Date().toISOString() } : d));
    addLog('Edit Diagnosa', `Memperbarui diagnosa ID: ${id}.`);
  };

  const deleteDiagnosis = (id: string) => {
    const d = diagnoses.find(x => x.id === id);
    setDiagnoses(prev => prev.filter(x => x.id !== id));
    if (d) addLog('Hapus Diagnosa', `Menghapus diagnosa ${d.code} - ${d.name}.`);
  };

  // CRUD Diet Types
  const addDietType = (dtData: Omit<DietType, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newDt: DietType = {
      ...dtData,
      id: `dt-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setDietTypes(prev => [...prev, newDt]);
    addLog('Tambah Jenis Diet', `Menambahkan Jenis Diet: ${newDt.name}.`);
  };

  const updateDietType = (id: string, updates: Partial<DietType>) => {
    setDietTypes(prev => prev.map(dt => dt.id === id ? { ...dt, ...updates, updatedAt: new Date().toISOString() } : dt));
    addLog('Edit Jenis Diet', `Memperbarui jenis diet ID: ${id}.`);
  };

  const deleteDietType = (id: string) => {
    const dt = dietTypes.find(x => x.id === id);
    setDietTypes(prev => prev.filter(x => x.id !== id));
    if (dt) addLog('Hapus Jenis Diet', `Menghapus jenis diet ${dt?.name}.`);
  };

  // CRUD Patients
  const addPatient = (patientData: Omit<Patient, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newPatient: Patient = {
      ...patientData,
      id: `pat-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setPatients(prev => [newPatient, ...prev]);
    addLog('Input Pasien', `Pendaftaran pasien baru ${newPatient.name} (${newPatient.medicalRecordNumber}).`);
    return newPatient;
  };

  const updatePatient = (id: string, updates: Partial<Patient>) => {
    setPatients(prev => prev.map(p => p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p));
    const p = patients.find(x => x.id === id);
    if (p) addLog('Edit Pasien', `Memperbarui data pasien ${p.name}.`);
  };

  const dischargePatient = (id: string) => {
    const today = new Date().toISOString().split('T')[0];
    setPatients(prev => prev.map(p => p.id === id ? {
      ...p,
      status: 'Pulang',
      dischargeDate: today,
      updatedAt: new Date().toISOString()
    } : p));
    
    // Deactivate active diet
    setPatientDiets(prev => prev.map(pd => pd.patientId === id ? { ...pd, status: 'Tidak Aktif' } : pd));

    const p = patients.find(x => x.id === id);
    if (p) addLog('Pasien Pulang', `Mengubah status pasien ${p.name} (${p.medicalRecordNumber}) menjadi Pulang.`);
  };

  // CRUD Patient Diets
  const assignPatientDiet = (dietData: Omit<PatientDiet, 'id' | 'createdAt' | 'updatedAt'>) => {
    // Nonaktifkan diet aktif sebelumnya untuk pasien ini
    setPatientDiets(prev => prev.map(pd => pd.patientId === dietData.patientId ? { ...pd, status: 'Tidak Aktif' } : pd));

    const newDiet: PatientDiet = {
      ...dietData,
      id: `pd-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setPatientDiets(prev => [newDiet, ...prev]);
    
    const p = patients.find(x => x.id === dietData.patientId);
    const dt = dietTypes.find(x => x.id === dietData.dietTypeId);
    addLog('Input Diet Pasien', `Menentukan diet ${dt?.name || ''} (${newDiet.calories} kcal) untuk pasien ${p?.name || ''}.`);
  };

  const updatePatientDiet = (id: string, updates: Partial<PatientDiet>) => {
    setPatientDiets(prev => prev.map(pd => pd.id === id ? { ...pd, ...updates, updatedAt: new Date().toISOString() } : pd));
    addLog('Edit Diet Pasien', `Memperbarui resep diet pasien ID: ${id}.`);
  };

  const updateConfig = (cfg: Partial<HospitalConfig>) => {
    setConfig(prev => ({ ...prev, ...cfg }));
    addLog('Pengaturan Rumah Sakit', 'Memperbarui profil dan konfigurasi rumah sakit.');
  };

  // Backup & Restore
  const backupDatabaseJSON = () => {
    const backupObj = {
      version: "1.0",
      backupDate: new Date().toISOString(),
      config,
      users,
      rooms,
      diagnoses,
      dietTypes,
      patients,
      patientDiets,
      auditLogs
    };
    addLog('Backup Database', 'Membuat file cadangan database (JSON/SQLite format).');
    return JSON.stringify(backupObj, null, 2);
  };

  const restoreDatabaseJSON = (jsonString: string): boolean => {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed.users && parsed.patients && parsed.rooms) {
        if (parsed.config) setConfig(parsed.config);
        if (parsed.users) setUsers(parsed.users);
        if (parsed.rooms) setRooms(parsed.rooms);
        if (parsed.diagnoses) setDiagnoses(parsed.diagnoses);
        if (parsed.dietTypes) setDietTypes(parsed.dietTypes);
        if (parsed.patients) setPatients(parsed.patients);
        if (parsed.patientDiets) setPatientDiets(parsed.patientDiets);
        if (parsed.auditLogs) setAuditLogs(parsed.auditLogs);
        addLog('Restore Database', 'Berhasil memulihkan data dari file backup.');
        return true;
      }
      return false;
    } catch (e) {
      console.error("Restore failed:", e);
      return false;
    }
  };

  const resetToSeedData = () => {
    setConfig(initialHospitalConfig);
    setUsers(initialUsers);
    setRooms(initialRooms);
    setDiagnoses(initialDiagnoses);
    setDietTypes(initialDietTypes);
    setPatients(initialPatients);
    setPatientDiets(initialPatientDiets);
    setAuditLogs(initialAuditLogs);
    addLog('Reset System', 'Mereset ulang data sistem ke data awal pabrik.');
  };

  return (
    <AppContext.Provider value={{
      currentUser, users, rooms, diagnoses, dietTypes, patients, patientDiets,
      auditLogs, config, searchQuery, setSearchQuery,
      login, logout, switchRoleQuickly,
      addUser, updateUser, deleteUser, resetUserPassword, setUserPassword,
      addRoom, updateRoom, deleteRoom,
      addDiagnosis, updateDiagnosis, deleteDiagnosis,
      addDietType, updateDietType, deleteDietType,
      addPatient, updatePatient, dischargePatient,
      assignPatientDiet, updatePatientDiet,
      updateConfig, backupDatabaseJSON, restoreDatabaseJSON, resetToSeedData, addLog
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};

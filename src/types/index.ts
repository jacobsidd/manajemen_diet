export type UserRole = 'Admin' | 'Petugas';

export type UserStatus = 'Aktif' | 'Nonaktif';

export interface User {
  id: string;
  name: string;
  username: string;
  role: UserRole;
  status: UserStatus;
  password?: string;
  createdAt: string;
  updatedAt: string;
}

export type RoomStatus = 'Tersedia' | 'Penuh' | 'Pemeliharaan';

export interface Room {
  id: string;
  roomNumber: string;
  ward: string; // e.g. "Melati", "Mawar", "Anggrek", "VIP Utama", "ICU"
  class: string; // e.g. "VIP", "Kelas 1", "Kelas 2", "Kelas 3", "ICU"
  capacity: number;
  occupied: number;
  status: RoomStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Diagnosis {
  id: string;
  code: string; // ICD-10 e.g. "E11"
  name: string; // e.g. "Diabetes Mellitus Tipe 2"
  createdAt: string;
  updatedAt: string;
}

export interface DietType {
  id: string;
  name: string; // e.g. "Diet Diabetes Mellitus"
  description: string;
  defaultCalories?: number;
  defaultProtein?: number;
  defaultFat?: number;
  defaultCarbs?: number;
  createdAt: string;
  updatedAt: string;
}

export type PatientStatus = 'Rawat Inap' | 'Pulang' | 'Pindah';
export type Gender = 'L' | 'P';

export interface Patient {
  id: string;
  medicalRecordNumber: string; // No RM e.g. "RM-2026-001"
  name: string;
  gender: Gender;
  birthDate: string;
  age: number;
  doctor: string;
  roomId: string;
  diagnosisId: string;
  bed: string; // e.g. "Bed A"
  admissionDate: string; // Tanggal Masuk YYYY-MM-DD
  dischargeDate?: string; // Tanggal Pulang YYYY-MM-DD
  status: PatientStatus;
  createdAt: string;
  updatedAt: string;
}

export type DietStatus = 'Aktif' | 'Tidak Aktif';

export interface PatientDiet {
  id: string;
  patientId: string;
  dietTypeId: string;
  calories: number; // kcal
  protein: number; // grams
  fat: number; // grams
  carbohydrate: number; // grams
  restrictions: string; // Pantangan e.g. "Gula pasir, Santan kental"
  notes: string; // Catatan Khusus e.g. "Porsi lunak, blendered"
  breakfast: boolean; // Pagi
  lunch: boolean; // Siang
  dinner: boolean; // Malam
  effectiveDate: string; // YYYY-MM-DD
  status: DietStatus;
  createdAt: string;
  updatedAt: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  action: string;
  details: string;
}

export interface HospitalConfig {
  name: string;
  address: string;
  phone: string;
  email: string;
  chiefDietitian: string;
  licenseNumber: string;
}

import { User, Room, Diagnosis, DietType, Patient, PatientDiet, AuditLog, HospitalConfig } from '../types';

export const initialHospitalConfig: HospitalConfig = {
  name: "Rumah Sakit Umum Daerah (RSUD) Sehat Bersama",
  address: "Jl. Kesehatan Raya No. 45, Jakarta Selatan",
  phone: "(021) 789-1234",
  email: "gizi@rsudsehatbersama.go.id",
  chiefDietitian: "Siti Rahma, S.Gz, RD",
  licenseNumber: "SIPG-1092/2024"
};

export const initialUsers: User[] = [
  {
    id: "usr-1",
    name: "Administrator Gizi",
    username: "admin",
    role: "Admin",
    status: "Aktif",
    password: "admin123",
    createdAt: "2026-01-01T08:00:00Z",
    updatedAt: "2026-01-01T08:00:00Z"
  },
  {
    id: "usr-2",
    name: "Siti Rahma, S.Gz",
    username: "petugas1",
    role: "Petugas",
    status: "Aktif",
    password: "petugas123",
    createdAt: "2026-01-10T08:00:00Z",
    updatedAt: "2026-01-10T08:00:00Z"
  },
  {
    id: "usr-3",
    name: "Budi Santoso, A.Md.Gz",
    username: "petugas2",
    role: "Petugas",
    status: "Aktif",
    password: "petugas123",
    createdAt: "2026-02-01T08:00:00Z",
    updatedAt: "2026-02-01T08:00:00Z"
  }
];

export const initialRooms: Room[] = [
  {
    id: "rm-101",
    roomNumber: "101",
    ward: "Mawar",
    class: "Kelas 1",
    capacity: 2,
    occupied: 2,
    status: "Penuh",
    createdAt: "2026-01-01T00:00:00Z",
    updatedAt: "2026-01-01T00:00:00Z"
  },
  {
    id: "rm-102",
    roomNumber: "102",
    ward: "Mawar",
    class: "Kelas 1",
    capacity: 2,
    occupied: 1,
    status: "Tersedia",
    createdAt: "2026-01-01T00:00:00Z",
    updatedAt: "2026-01-01T00:00:00Z"
  },
  {
    id: "rm-201",
    roomNumber: "201",
    ward: "Melati",
    class: "Kelas 2",
    capacity: 4,
    occupied: 3,
    status: "Tersedia",
    createdAt: "2026-01-01T00:00:00Z",
    updatedAt: "2026-01-01T00:00:00Z"
  },
  {
    id: "rm-202",
    roomNumber: "202",
    ward: "Melati",
    class: "Kelas 2",
    capacity: 4,
    occupied: 2,
    status: "Tersedia",
    createdAt: "2026-01-01T00:00:00Z",
    updatedAt: "2026-01-01T00:00:00Z"
  },
  {
    id: "rm-301",
    roomNumber: "VIP 01",
    ward: "VIP Utama",
    class: "VIP",
    capacity: 1,
    occupied: 1,
    status: "Penuh",
    createdAt: "2026-01-01T00:00:00Z",
    updatedAt: "2026-01-01T00:00:00Z"
  },
  {
    id: "rm-302",
    roomNumber: "VIP 02",
    ward: "VIP Utama",
    class: "VIP",
    capacity: 1,
    occupied: 0,
    status: "Tersedia",
    createdAt: "2026-01-01T00:00:00Z",
    updatedAt: "2026-01-01T00:00:00Z"
  },
  {
    id: "rm-401",
    roomNumber: "Anggrek 01",
    ward: "Anggrek",
    class: "Kelas 3",
    capacity: 6,
    occupied: 4,
    status: "Tersedia",
    createdAt: "2026-01-01T00:00:00Z",
    updatedAt: "2026-01-01T00:00:00Z"
  },
  {
    id: "rm-501",
    roomNumber: "ICU 01",
    ward: "ICU",
    class: "ICU",
    capacity: 2,
    occupied: 1,
    status: "Tersedia",
    createdAt: "2026-01-01T00:00:00Z",
    updatedAt: "2026-01-01T00:00:00Z"
  }
];

export const initialDiagnoses: Diagnosis[] = [
  {
    id: "diag-1",
    code: "E11",
    name: "Diabetes Mellitus Tipe 2",
    createdAt: "2026-01-01T00:00:00Z",
    updatedAt: "2026-01-01T00:00:00Z"
  },
  {
    id: "diag-2",
    code: "I10",
    name: "Hipertensi Esensial (Primer)",
    createdAt: "2026-01-01T00:00:00Z",
    updatedAt: "2026-01-01T00:00:00Z"
  },
  {
    id: "diag-3",
    code: "K35",
    name: "Appendicitis Akut",
    createdAt: "2026-01-01T00:00:00Z",
    updatedAt: "2026-01-01T00:00:00Z"
  },
  {
    id: "diag-4",
    code: "N18",
    name: "Gagal Ginjal Kronik (Chronic Kidney Disease)",
    createdAt: "2026-01-01T00:00:00Z",
    updatedAt: "2026-01-01T00:00:00Z"
  },
  {
    id: "diag-5",
    code: "E66",
    name: "Obesitas Klas II",
    createdAt: "2026-01-01T00:00:00Z",
    updatedAt: "2026-01-01T00:00:00Z"
  },
  {
    id: "diag-6",
    code: "K29",
    name: "Gastritis Akut / Dispepsia",
    createdAt: "2026-01-01T00:00:00Z",
    updatedAt: "2026-01-01T00:00:00Z"
  },
  {
    id: "diag-7",
    code: "J44",
    name: "Penyakit Paru Obstruktif Kronis (PPOK)",
    createdAt: "2026-01-01T00:00:00Z",
    updatedAt: "2026-01-01T00:00:00Z"
  }
];

export const initialDietTypes: DietType[] = [
  {
    id: "dt-1",
    name: "Diet Diabetes Mellitus (RG/DM)",
    description: "Diet khusus penderita diabetes dengan pembatasan karbohidrat sederhana dan pengaturan indeks glikemik.",
    defaultCalories: 1700,
    defaultProtein: 60,
    defaultFat: 45,
    defaultCarbs: 230,
    createdAt: "2026-01-01T00:00:00Z",
    updatedAt: "2026-01-01T00:00:00Z"
  },
  {
    id: "dt-2",
    name: "Diet Rendah Garam (RG)",
    description: "Pembatasan asupan natrium/garam dapur untuk pasien hipertensi, edema, dan gagal jantung.",
    defaultCalories: 1900,
    defaultProtein: 65,
    defaultFat: 50,
    defaultCarbs: 280,
    createdAt: "2026-01-01T00:00:00Z",
    updatedAt: "2026-01-01T00:00:00Z"
  },
  {
    id: "dt-3",
    name: "Diet Rendah Lemak & Kolesterol (RL)",
    description: "Pengurangan bahan makanan tinggi asam lemak jenuh dan kolesterol.",
    defaultCalories: 1800,
    defaultProtein: 65,
    defaultFat: 35,
    defaultCarbs: 280,
    createdAt: "2026-01-01T00:00:00Z",
    updatedAt: "2026-01-01T00:00:00Z"
  },
  {
    id: "dt-4",
    name: "Diet Tinggi Kalori Tinggi Protein (TKTP)",
    description: "Diberikan pada pasien pasca operasi, luka bakar, atau gizi kurang untuk mempercepat pemulihan.",
    defaultCalories: 2400,
    defaultProtein: 90,
    defaultFat: 65,
    defaultCarbs: 330,
    createdAt: "2026-01-01T00:00:00Z",
    updatedAt: "2026-01-01T00:00:00Z"
  },
  {
    id: "dt-5",
    name: "Diet Lunak (DL)",
    description: "Makanan berbumbu lembut, mudah dicerna, tekstur agak lunak (bubur/nasi tim) untuk gangguan pencernaan ringan.",
    defaultCalories: 1900,
    defaultProtein: 60,
    defaultFat: 50,
    defaultCarbs: 270,
    createdAt: "2026-01-01T00:00:00Z",
    updatedAt: "2026-01-01T00:00:00Z"
  },
  {
    id: "dt-6",
    name: "Diet Cair / Saring (DC)",
    description: "Formula cair penuh atau saring halus untuk pasien tidak dapat mengunyah/menelan atau via pipa NGT.",
    defaultCalories: 1500,
    defaultProtein: 50,
    defaultFat: 40,
    defaultCarbs: 210,
    createdAt: "2026-01-01T00:00:00Z",
    updatedAt: "2026-01-01T00:00:00Z"
  },
  {
    id: "dt-7",
    name: "Diet Biasa (DB)",
    description: "Makanan seimbang sesuai kecukupan gizi tanpa pembatasan khusus untuk pasien tanpa komplikasi.",
    defaultCalories: 2100,
    defaultProtein: 70,
    defaultFat: 55,
    defaultCarbs: 300,
    createdAt: "2026-01-01T00:00:00Z",
    updatedAt: "2026-01-01T00:00:00Z"
  },
  {
    id: "dt-8",
    name: "Diet Rendah Protein / Ginjal (RP)",
    description: "Diet terkontrol protein dan kalium untuk pasien penurunan fungsi ginjal stadium lanjut.",
    defaultCalories: 1800,
    defaultProtein: 40,
    defaultFat: 50,
    defaultCarbs: 290,
    createdAt: "2026-01-01T00:00:00Z",
    updatedAt: "2026-01-01T00:00:00Z"
  }
];

const today = new Date().toISOString().split('T')[0];

export const initialPatients: Patient[] = [
  {
    id: "pat-1",
    medicalRecordNumber: "RM-2026-001",
    name: "Bambang Sudirjo",
    gender: "L",
    birthDate: "1968-05-12",
    age: 58,
    doctor: "dr. Hendra, Sp.PD",
    roomId: "rm-101",
    diagnosisId: "diag-1", // DM
    bed: "Bed A",
    admissionDate: today,
    status: "Rawat Inap",
    createdAt: `${today}T08:30:00Z`,
    updatedAt: `${today}T08:30:00Z`
  },
  {
    id: "pat-2",
    medicalRecordNumber: "RM-2026-002",
    name: "Siti Aminah",
    gender: "P",
    birthDate: "1975-09-20",
    age: 50,
    doctor: "dr. Anita, Sp.PD-KEMD",
    roomId: "rm-101",
    diagnosisId: "diag-2", // Hipertensi
    bed: "Bed B",
    admissionDate: today,
    status: "Rawat Inap",
    createdAt: `${today}T09:15:00Z`,
    updatedAt: `${today}T09:15:00Z`
  },
  {
    id: "pat-3",
    medicalRecordNumber: "RM-2026-003",
    name: "Ahmad Fauzi",
    gender: "L",
    birthDate: "1992-03-14",
    age: 34,
    doctor: "dr. Lukman, Sp.B",
    roomId: "rm-102",
    diagnosisId: "diag-3", // Appendicitis
    bed: "Bed A",
    admissionDate: "2026-07-20",
    status: "Rawat Inap",
    createdAt: "2026-07-20T10:00:00Z",
    updatedAt: "2026-07-20T10:00:00Z"
  },
  {
    id: "pat-4",
    medicalRecordNumber: "RM-2026-004",
    name: "Dewi Kartika",
    gender: "P",
    birthDate: "1963-11-05",
    age: 62,
    doctor: "dr. Rizky, Sp.PD-KGH",
    roomId: "rm-201",
    diagnosisId: "diag-4", // Gagal Ginjal
    bed: "Bed A",
    admissionDate: "2026-07-19",
    status: "Rawat Inap",
    createdAt: "2026-07-19T11:20:00Z",
    updatedAt: "2026-07-19T11:20:00Z"
  },
  {
    id: "pat-5",
    medicalRecordNumber: "RM-2026-005",
    name: "Hasan Basri",
    gender: "L",
    birthDate: "1980-01-30",
    age: 46,
    doctor: "dr. Hendra, Sp.PD",
    roomId: "rm-201",
    diagnosisId: "diag-6", // Gastritis
    bed: "Bed B",
    admissionDate: "2026-07-21",
    status: "Rawat Inap",
    createdAt: "2026-07-21T14:00:00Z",
    updatedAt: "2026-07-21T14:00:00Z"
  },
  {
    id: "pat-6",
    medicalRecordNumber: "RM-2026-006",
    name: "Sri Wahyuni",
    gender: "P",
    birthDate: "1955-08-18",
    age: 70,
    doctor: "dr. Maya, Sp.JP",
    roomId: "rm-301",
    diagnosisId: "diag-2", // Hipertensi
    bed: "Utama",
    admissionDate: today,
    status: "Rawat Inap",
    createdAt: `${today}T11:00:00Z`,
    updatedAt: `${today}T11:00:00Z`
  },
  {
    id: "pat-7",
    medicalRecordNumber: "RM-2026-007",
    name: "Rian Hidayat",
    gender: "L",
    birthDate: "1988-12-02",
    age: 37,
    doctor: "dr. Lukman, Sp.B",
    roomId: "rm-202",
    diagnosisId: "diag-3",
    bed: "Bed C",
    admissionDate: "2026-07-15",
    dischargeDate: today,
    status: "Pulang",
    createdAt: "2026-07-15T09:00:00Z",
    updatedAt: `${today}T10:00:00Z`
  }
];

export const initialPatientDiets: PatientDiet[] = [
  {
    id: "pd-1",
    patientId: "pat-1",
    dietTypeId: "dt-1", // Diet Diabetes
    calories: 1700,
    protein: 60,
    fat: 45,
    carbohydrate: 230,
    restrictions: "Gula pasir, Sirup, Kue manis, Santan kental",
    notes: "Porsi kecil 3 kali makan utama + 2 kali selingan. Nasi merah/nasi tiwul.",
    breakfast: true,
    lunch: true,
    dinner: true,
    effectiveDate: today,
    status: "Aktif",
    createdAt: `${today}T08:45:00Z`,
    updatedAt: `${today}T08:45:00Z`
  },
  {
    id: "pd-2",
    patientId: "pat-2",
    dietTypeId: "dt-2", // Diet Rendah Garam
    calories: 1900,
    protein: 65,
    fat: 50,
    carbohydrate: 280,
    restrictions: "Garam dapur berlebih, Ikan asin, Makanan kaleng, MSG",
    notes: "Bumbu rempah diperbanyak (bawang putih, jahe, asam Jawa) pengganti garam.",
    breakfast: true,
    lunch: true,
    dinner: true,
    effectiveDate: today,
    status: "Aktif",
    createdAt: `${today}T09:30:00Z`,
    updatedAt: `${today}T09:30:00Z`
  },
  {
    id: "pd-3",
    patientId: "pat-3",
    dietTypeId: "dt-5", // Diet Lunak
    calories: 2000,
    protein: 70,
    fat: 55,
    carbohydrate: 290,
    restrictions: "Makanan pedas, Asam, Berminyak tinggi",
    notes: "Pasca operasi appendik hari ke-2. Tekstur lunak (Bubur halus + lauk cincang).",
    breakfast: true,
    lunch: true,
    dinner: true,
    effectiveDate: "2026-07-21",
    status: "Aktif",
    createdAt: "2026-07-21T08:00:00Z",
    updatedAt: "2026-07-21T08:00:00Z"
  },
  {
    id: "pd-4",
    patientId: "pat-4",
    dietTypeId: "dt-8", // Diet Ginjal / Rendah Protein
    calories: 1800,
    protein: 40,
    fat: 50,
    carbohydrate: 290,
    restrictions: "Pisang, Tomat, Jeruk (tinggi kalium), Jeroan, Garam tinggi",
    notes: "Cairan dibatasi max 1000ml/hari. Protein diutamakan nilai biologi tinggi (telur/ikan).",
    breakfast: true,
    lunch: true,
    dinner: true,
    effectiveDate: "2026-07-19",
    status: "Aktif",
    createdAt: "2026-07-19T12:00:00Z",
    updatedAt: "2026-07-19T12:00:00Z"
  },
  {
    id: "pd-5",
    patientId: "pat-5",
    dietTypeId: "dt-5", // Diet Lunak Gastritis
    calories: 1900,
    protein: 60,
    fat: 45,
    carbohydrate: 280,
    restrictions: "Kopi, Teh pekat, Cokelat, Cabai, Merica, Ketan",
    notes: "Nasi tim lembut. Hindari bumbu merangsang pencernaan.",
    breakfast: true,
    lunch: true,
    dinner: true,
    effectiveDate: "2026-07-21",
    status: "Aktif",
    createdAt: "2026-07-21T15:00:00Z",
    updatedAt: "2026-07-21T15:00:00Z"
  },
  {
    id: "pd-6",
    patientId: "pat-6",
    dietTypeId: "dt-2", // Diet RG VIP
    calories: 1900,
    protein: 65,
    fat: 50,
    carbohydrate: 280,
    restrictions: "Ikan asin, Kecap asin, Keripik bergaram",
    notes: "Penyajian hangat di wadah keramik VIP.",
    breakfast: false, // Sudah lewat breakfast saat masuk
    lunch: true,
    dinner: true,
    effectiveDate: today,
    status: "Aktif",
    createdAt: `${today}T11:15:00Z`,
    updatedAt: `${today}T11:15:00Z`
  }
];

export const initialAuditLogs: AuditLog[] = [
  {
    id: "log-1",
    timestamp: `${today}T08:00:00Z`,
    userId: "usr-1",
    userName: "Administrator Gizi",
    userRole: "Admin",
    action: "User Login",
    details: "Berhasil masuk ke sistem manajemen gizi."
  },
  {
    id: "log-2",
    timestamp: `${today}T08:30:00Z`,
    userId: "usr-2",
    userName: "Siti Rahma, S.Gz",
    userRole: "Petugas",
    action: "Input Pasien",
    details: "Menambahkan pasien baru Bambang Sudirjo (RM-2026-001) di Kamar 101."
  },
  {
    id: "log-3",
    timestamp: `${today}T08:45:00Z`,
    userId: "usr-2",
    userName: "Siti Rahma, S.Gz",
    userRole: "Petugas",
    action: "Input Diet Pasien",
    details: "Menentukan Diet Diabetes Mellitus (1700 kcal) untuk Bambang Sudirjo."
  },
  {
    id: "log-4",
    timestamp: `${today}T09:15:00Z`,
    userId: "usr-3",
    userName: "Budi Santoso, A.Md.Gz",
    userRole: "Petugas",
    action: "Input Pasien",
    details: "Menambahkan pasien Siti Aminah (RM-2026-002) di Kamar 101."
  },
  {
    id: "log-5",
    timestamp: `${today}T10:00:00Z`,
    userId: "usr-2",
    userName: "Siti Rahma, S.Gz",
    userRole: "Petugas",
    action: "Edit Data Pasien",
    details: "Memperbarui status pasien Rian Hidayat menjadi Pulang."
  }
];

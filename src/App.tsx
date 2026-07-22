import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar, NavTab } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { LoginView } from './components/auth/LoginView';

// Tab Views
import { DashboardView } from './components/dashboard/DashboardView';
import { PatientManagement } from './components/patients/PatientManagement';
import { PatientDietManagement } from './components/diets/PatientDietManagement';
import { DistributionList } from './components/distribution/DistributionList';
import { RoomManagement } from './components/rooms/RoomManagement';
import { DiagnosisManagement } from './components/diagnoses/DiagnosisManagement';
import { DietTypeManagement } from './components/dietTypes/DietTypeManagement';
import { UserManagement } from './components/users/UserManagement';
import { ReportsView } from './components/reports/ReportsView';
import { SettingsView } from './components/settings/SettingsView';

const tabTitles: Record<NavTab, string> = {
  dashboard: 'Dashboard Monitoring',
  patients: 'Manajemen Pasien Inap',
  diets: 'Preskripsi & Input Diet',
  distribution: 'Daftar Distribusi Makanan',
  rooms: 'Manajemen Kamar Inap',
  diagnoses: 'Diagnosa Medis (ICD-10)',
  dietTypes: 'Master Jenis Diet',
  users: 'Manajemen Pengguna',
  reports: 'Laporan & Rekapitulasi',
  settings: 'Pengaturan & Backup'
};

const MainAppContent: React.FC = () => {
  const { currentUser } = useApp();
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [targetPatientForDiet, setTargetPatientForDiet] = useState<string | null>(null);

  if (!currentUser) {
    return <LoginView />;
  }

  const handleNavigateToPrescribeDiet = (patientId: string) => {
    setTargetPatientForDiet(patientId);
    setActiveTab('diets');
  };

  const renderActiveTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView onNavigate={(tab) => setActiveTab(tab)} />;
      case 'patients':
        return <PatientManagement onPrescribeDiet={handleNavigateToPrescribeDiet} />;
      case 'diets':
        return <PatientDietManagement initialSelectedPatientId={targetPatientForDiet} />;
      case 'distribution':
        return <DistributionList />;
      case 'rooms':
        return <RoomManagement />;
      case 'diagnoses':
        return <DiagnosisManagement />;
      case 'dietTypes':
        return <DietTypeManagement />;
      case 'users':
        return currentUser.role === 'Admin' ? <UserManagement /> : <DashboardView onNavigate={setActiveTab} />;
      case 'reports':
        return <ReportsView />;
      case 'settings':
        return currentUser.role === 'Admin' ? <SettingsView /> : <DashboardView onNavigate={setActiveTab} />;
      default:
        return <DashboardView onNavigate={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col lg:flex-row font-sans text-slate-800 antialiased selection:bg-blue-600 selection:text-white">
      {/* Sidebar Navigation */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={(t) => {
          setTargetPatientForDiet(null);
          setActiveTab(t);
        }} 
        isOpen={isSidebarOpen} 
        setIsOpen={setIsSidebarOpen} 
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        <Header 
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
          activeTabTitle={tabTitles[activeTab]} 
        />

        <main className="flex-1 p-4 lg:p-8 max-w-7xl w-full mx-auto animate-in fade-in duration-150">
          {renderActiveTabContent()}
        </main>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}

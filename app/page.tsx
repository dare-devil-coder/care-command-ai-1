'use client';

import { useState } from 'react';
import { AuthProvider } from '@/lib/auth-context';
import LoginPage from '@/components/pages/login-page';
import NurseDashboard from '@/components/pages/nurse-dashboard';
import PatientMissionPage from '@/components/pages/patient-mission-page';
import CareTimelinePage from '@/components/pages/care-timeline-page';
import AdminDashboard from '@/components/pages/admin-dashboard';
import BreakModePage from '@/components/pages/break-mode-page';
import DoctorDashboard from '@/components/dashboards/doctor-dashboard';
import PatientPortal from '@/components/pages/patient-portal';

type PageType = 'login' | 'nurse' | 'mission' | 'timeline' | 'admin' | 'break' | 'doctor' | 'patient';
type UserRole = 'nurse' | 'doctor' | 'admin' | 'patient';

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageType>('login');
  const [currentRole, setCurrentRole] = useState<UserRole>('nurse');
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);

  const handleLogin = (role: UserRole) => {
    setCurrentRole(role);
    if (role === 'nurse') {
      setCurrentPage('nurse');
    } else if (role === 'doctor') {
      setCurrentPage('doctor');
    } else if (role === 'admin') {
      setCurrentPage('admin');
    } else if (role === 'patient') {
      setCurrentPage('patient');
    } else {
      setCurrentPage('nurse');
    }
  };

  const handleNavigate = (page: PageType, patientId?: string) => {
    setCurrentPage(page);
    if (patientId) {
      setSelectedPatientId(patientId);
    }
  };

  const handleLogout = () => {
    setCurrentPage('login');
  };

  const navigationProps = {
    onNavigate: handleNavigate,
    onLogout: handleLogout,
    currentPage,
  };

  return (
    <AuthProvider>
      <div className="w-full min-h-screen bg-background text-foreground">
        {currentPage === 'login' && (
          <LoginPage onLogin={handleLogin} />
        )}
        {currentPage === 'nurse' && (
          <NurseDashboard
            {...navigationProps}
            onStartMission={(patientId) => handleNavigate('mission', patientId)}
          />
        )}
        {currentPage === 'mission' && (
          <PatientMissionPage
            patientId={selectedPatientId || '1'}
            {...navigationProps}
          />
        )}
        {currentPage === 'timeline' && (
          <CareTimelinePage
            patientId={selectedPatientId || '1'}
            {...navigationProps}
          />
        )}
        {currentPage === 'admin' && (
          <AdminDashboard {...navigationProps} />
        )}
        {currentPage === 'break' && (
          <BreakModePage
            {...navigationProps}
            onResumeShift={() => handleNavigate('nurse')}
          />
        )}
        {currentPage === 'doctor' && (
          <DoctorDashboard {...navigationProps} />
        )}
        {currentPage === 'patient' && (
          <PatientPortal {...navigationProps} />
        )}
      </div>
    </AuthProvider>
  );
}

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';

interface NavItem {
  icon: React.ReactNode;
  label: string;
  href: string;
}

const adminNav: NavItem[] = [
  { icon: '📊', label: 'Dashboard', href: '/dashboard' },
  { icon: '👥', label: 'Staff Management', href: '/admin/staff' },
  { icon: '🏥', label: 'Departments', href: '/admin/departments' },
  { icon: '📈', label: 'Analytics', href: '/admin/analytics' },
  { icon: '⚙️', label: 'System Settings', href: '/admin/settings' },
];

const doctorNav: NavItem[] = [
  { icon: '📊', label: 'Dashboard', href: '/dashboard' },
  { icon: '👨‍⚕️', label: 'My Patients', href: '/doctor/patients' },
  { icon: '📋', label: 'Diagnoses', href: '/doctor/diagnoses' },
  { icon: '📝', label: 'Prescriptions', href: '/doctor/prescriptions' },
  { icon: '📊', label: 'Reports', href: '/doctor/reports' },
];

const nurseNav: NavItem[] = [
  { icon: '📊', label: 'Dashboard', href: '/dashboard' },
  { icon: '🚨', label: 'Active Tasks', href: '/nurse/tasks' },
  { icon: '📱', label: 'QR Scanner', href: '/nurse/qr-scanner' },
  { icon: '📊', label: 'Patient Care', href: '/nurse/patients' },
  { icon: '📈', label: 'Vital Signs', href: '/nurse/vitals' },
  { icon: '📋', label: 'Care Plans', href: '/nurse/care-plans' },
];

const technicianNav: NavItem[] = [
  { icon: '📊', label: 'Dashboard', href: '/dashboard' },
  { icon: '🔬', label: 'Tests', href: '/technician/tests' },
  { icon: '🖼️', label: 'Imaging', href: '/technician/imaging' },
  { icon: '📋', label: 'Results', href: '/technician/results' },
  { icon: '⚙️', label: 'Equipment', href: '/technician/equipment' },
];

const getNavigation = (role: string): NavItem[] => {
  switch (role) {
    case 'admin':
      return adminNav;
    case 'doctor':
      return doctorNav;
    case 'nurse':
      return nurseNav;
    case 'technician':
      return technicianNav;
    default:
      return [];
  }
};

export default function Sidebar() {
  const { user } = useAuth();
  const pathname = usePathname();
  const nav = getNavigation(user?.role || '');

  return (
    <div className="glass-lg fixed left-0 top-0 h-screen w-64 p-6 overflow-y-auto flex flex-col">
      {/* Logo */}
      <Link href="/dashboard" className="flex items-center gap-3 mb-8 group">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-600 to-purple-600 flex items-center justify-center group-hover:shadow-lg group-hover:shadow-violet-500/50 transition-shadow">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div>
          <p className="font-bold text-slate-900 dark:text-white">CareCommand</p>
          <p className="text-xs text-slate-600 dark:text-slate-400">AI System</p>
        </div>
      </Link>

      {/* Navigation */}
      <nav className="flex-1 space-y-2">
        {nav.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-violet-500/20 to-purple-500/20 text-violet-700 dark:text-violet-300 font-semibold border border-violet-200 dark:border-violet-800'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-white/50 dark:hover:bg-slate-800/50'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer info */}
      <div className="pt-4 border-t border-white/20 dark:border-white/10">
        <div className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
          <p>Role: <span className="font-semibold capitalize">{user?.role}</span></p>
          <p>Dept: <span className="font-semibold">{user?.department}</span></p>
        </div>
      </div>
    </div>
  );
}

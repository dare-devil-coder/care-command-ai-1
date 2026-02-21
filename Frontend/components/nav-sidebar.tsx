'use client';

import { useAuth } from '@/lib/auth-context';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

export function NavSidebar() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  if (!user) return null;

  const navItems = getNavItemsForRole(user.role);

  return (
    <div className="flex flex-col justify-between h-full">
      {/* Top Section */}
      <div className="flex flex-col">
        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <span className="text-2xl">⚕️</span>
            <div>
              <h1 className="font-bold text-lg text-white">CareCommand</h1>
              <p className="text-xs text-slate-400">AI Hospital System</p>
            </div>
          </div>
        </div>

        {/* User Profile */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            {user.avatar && user.avatar.startsWith('http') ? (
              <img 
                src={user.avatar} 
                alt={user.name}
                className="w-10 h-10 rounded-full object-cover border border-blue-500/30"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-blue-600/20 flex items-center justify-center text-lg border border-blue-500/30">
                {user.avatar || '👤'}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm truncate text-white">{user.name}</p>
              <p className="text-xs text-slate-400 capitalize">{user.role}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
            return (
              <Link key={item.href} href={item.href}>
                <button 
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm font-medium ${
                    isActive 
                      ? "bg-blue-600/20 border-l-4 border-blue-500 text-white shadow-lg shadow-blue-500/20" 
                      : "text-slate-400 hover:bg-white/5 hover:text-white hover:-translate-y-0.5"
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section - Logout */}
      <div className="p-4 border-t border-white/10">
        <Button
          onClick={handleLogout}
          variant="outline"
          className="w-full justify-start gap-2 border-white/20 hover:bg-red-600/20 hover:border-red-500/30 hover:text-red-400 transition-all duration-200 rounded-xl"
        >
          <LogOut size={16} />
          Sign Out
        </Button>
      </div>
    </div>
  );
}

function getNavItemsForRole(role: string) {
  const roleItems: Record<string, Array<{ label: string; href: string; icon: string }>> = {
    nurse: [
      { label: 'Dashboard', href: '/dashboard/nurse', icon: '📊' },
      { label: 'Task Queue', href: '/dashboard/nurse/assignments', icon: '✓' },
      { label: 'QR Scanner', href: '/dashboard/nurse/qr-scan', icon: '📱' },
      { label: 'Patients', href: '/dashboard/nurse/patients', icon: '🏥' },
      { label: 'Rewards', href: '/dashboard/nurse/rewards', icon: '🏆' },
    ],
    doctor: [
      { label: 'Dashboard', href: '/dashboard/doctor', icon: '📊' },
      { label: 'Patient Queue', href: '/dashboard/doctor/patient-queue', icon: '👥' },
      { label: 'Risk Assessment', href: '/dashboard/doctor/risk-assessment', icon: '⚠️' },
      { label: 'My Patients', href: '/dashboard/doctor/patients', icon: '🏥' },
    ],
    admin: [
      { label: 'Dashboard', href: '/dashboard/admin', icon: '📊' },
      { label: 'Staff Management', href: '/dashboard/admin/staff-management', icon: '👤' },
      { label: 'Analytics', href: '/dashboard/admin/analytics', icon: '📈' },
      { label: 'Generate QR Codes', href: '/dashboard/admin/generate-qr', icon: '📱' },
      { label: 'Settings', href: '/dashboard/admin/settings', icon: '⚙️' },
    ],
    patient: [
      { label: 'Dashboard', href: '/dashboard/patient', icon: '📊' },
      { label: 'Medical Records', href: '/dashboard/patient/records', icon: '📋' },
      { label: 'Appointments', href: '/dashboard/patient/appointments', icon: '📅' },
    ],
    technician: [
      { label: 'Dashboard', href: '/dashboard/technician', icon: '📊' },
      { label: 'Equipment', href: '/dashboard/technician/equipment', icon: '🔧' },
      { label: 'Maintenance', href: '/dashboard/technician/maintenance', icon: '🛠️' },
    ],
  };

  return roleItems[role] || [];
}

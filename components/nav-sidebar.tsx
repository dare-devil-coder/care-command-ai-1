'use client';

import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { LogOut, Menu, X, Bell } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { useNotifications } from '@/components/notifications';

export function NavSidebar() {
  const { currentUser, logout } = useAuth();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const { notifications } = useNotifications();
  const unreadCount = notifications.filter(n => !n.read).length;

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  if (!currentUser) return null;

  const navItems = getNavItemsForRole(currentUser.role);

  return (
    <>
      {/* Mobile menu toggle */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 glass-sm z-40 flex items-center justify-between px-4">
        <span className="text-lg font-bold text-primary">CareCommand</span>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 hover:bg-white/20 rounded-lg"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 h-screen glass-lg border-r border-white/20 dark:border-white/10 w-64 z-30 pt-20 md:pt-0 transition-transform duration-300',
          !isOpen && 'md:translate-x-0 -translate-x-full'
        )}
      >
        {/* Logo */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <span className="text-2xl">⚕️</span>
            <div>
              <h1 className="font-bold text-lg">CareCommand</h1>
              <p className="text-xs text-muted-foreground">AI Hospital System</p>
            </div>
          </div>
        </div>

        {/* User Profile */}
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-lg">
              {currentUser.avatar || '👤'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm truncate">{currentUser.name}</p>
              <p className="text-xs text-muted-foreground capitalize">{currentUser.role}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2 flex-1 overflow-y-auto">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <button className="w-full flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-white/10 dark:hover:bg-white/5 transition-colors">
                <span className="text-lg">{item.icon}</span>
                <span className="text-sm font-medium">{item.label}</span>
              </button>
            </Link>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-white/10">
          <Button
            onClick={handleLogout}
            variant="outline"
            className="w-full justify-start gap-2 border-white/20 dark:border-white/10"
          >
            <LogOut size={16} />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Main content offset */}
      <div className="md:ml-64" />
    </>
  );
}

function getNavItemsForRole(role: string) {
  const baseItems = [
    { label: 'Dashboard', href: '/dashboard', icon: '📊' },
  ];

  const roleItems: Record<string, Array<{ label: string; href: string; icon: string }>> = {
    nurse: [
      { label: 'Dashboard', href: '/dashboard/nurse', icon: '📊' },
      { label: 'Task Queue', href: '/dashboard/nurse/assignments', icon: '✓' },
      { label: 'QR Scanner', href: '/dashboard/nurse/qr-scan', icon: '📱' },
      { label: 'Patients', href: '/dashboard/nurse/patients', icon: '🏥' },
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

  return roleItems[role] || baseItems;
}

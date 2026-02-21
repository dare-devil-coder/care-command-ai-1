'use client';

import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DashboardRouter() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      // Redirect to role-specific dashboard
      const roleRoutes: Record<string, string> = {
        admin: '/dashboard/admin',
        doctor: '/dashboard/doctor',
        nurse: '/dashboard/nurse',
        technician: '/dashboard/technician',
        patient: '/dashboard/patient'
      };
      
      const redirectPath = roleRoutes[user.role] || '/dashboard/nurse';
      router.push(redirectPath);
    }
  }, [user, router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
  );
}

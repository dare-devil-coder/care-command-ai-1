'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';

export default function App() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      if (user) {
        // User is logged in, redirect to their dashboard
        const roleRoutes: Record<string, string> = {
          admin: '/dashboard/admin',
          doctor: '/dashboard/doctor',
          nurse: '/dashboard/nurse',
          technician: '/dashboard/technician',
          patient: '/dashboard/patient'
        };
        
        const redirectPath = roleRoutes[user.role] || '/dashboard';
        router.push(redirectPath);
      } else {
        // User is not logged in, redirect to login
        router.push('/login');
      }
    }
  }, [user, isLoading, router]);

  // Show loading spinner while checking auth
  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-slate-950 dark:via-slate-900 dark:to-purple-950 flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
  );
}

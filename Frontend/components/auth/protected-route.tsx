'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/lib/store';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const router = useRouter();
  const { isLoggedIn, user } = useStore();

  useEffect(() => {
    if (!isLoggedIn || !user) {
      router.push('/login');
      return;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
      // Redirect to correct dashboard based on role
      const roleRoutes: Record<string, string> = {
        nurse: '/dashboard/nurse',
        doctor: '/dashboard/doctor',
        admin: '/dashboard/admin',
        patient: '/dashboard/patient',
      };
      router.push(roleRoutes[user.role] || '/login');
    }
  }, [isLoggedIn, user, allowedRoles, router]);

  if (!isLoggedIn || !user) {
    return null;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return null;
  }

  return <>{children}</>;
}

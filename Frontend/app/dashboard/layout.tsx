'use client';

import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { NavSidebar } from '@/components/nav-sidebar';
import { getNotifications } from '@/lib/notificationStore';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  // Load notifications for current user role
  useEffect(() => {
    if (user) {
      const userNotifications = getNotifications(user.role);
      setNotifications(userNotifications);
    }
  }, [user]);

  // Refresh notifications periodically
  useEffect(() => {
    if (!user) return;
    
    const interval = setInterval(() => {
      const userNotifications = getNotifications(user.role);
      setNotifications(userNotifications);
    }, 5000); // Refresh every 5 seconds

    return () => clearInterval(interval);
  }, [user]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen flex bg-slate-950 text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900/95 backdrop-blur-md border-r border-white/10 flex flex-col z-20">
        <NavSidebar />
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-16 border-b border-white/10 flex items-center justify-between px-8 bg-slate-950 z-10">
          <div>
            <h2 className="text-lg font-semibold">CareCommand AI</h2>
          </div>
          <div className="flex items-center gap-4">
            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <span className="text-xl">🔔</span>
                {notifications.filter(n => !n.read).length > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-slate-900 border border-white/10 rounded-lg shadow-lg shadow-black/30 max-h-96 overflow-y-auto z-50">
                  <div className="p-4 border-b border-white/10">
                    <h3 className="font-semibold">Notifications</h3>
                  </div>
                  <div className="divide-y divide-white/10">
                    {notifications.length === 0 ? (
                      <div className="p-4 text-center text-slate-400 text-sm">
                        No notifications
                      </div>
                    ) : (
                      notifications.map((notif) => (
                        <div
                          key={notif.id}
                          className={`p-4 hover:bg-white/5 transition-colors ${
                            !notif.read ? 'bg-blue-500/10' : ''
                          }`}
                        >
                          <p className="text-sm">{notif.message}</p>
                          <p className="text-xs text-slate-400 mt-1">
                            {new Date(notif.time).toLocaleTimeString()}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-8 py-6 space-y-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { Card } from '@/components/ui/card';
import { Notification, mockNotifications } from '@/lib/mock-data';

export default function NotificationsCenter() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showPanel, setShowPanel] = useState(false);

  useEffect(() => {
    // Get notifications for current user
    const userNotifications = mockNotifications.filter((n) => n.userId === user?.id);
    setNotifications(userNotifications);
    setUnreadCount(userNotifications.filter((n) => !n.read).length);
  }, [user]);

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
    setUnreadCount(Math.max(0, unreadCount - 1));
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'alert':
        return 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800';
      case 'task':
        return 'bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800';
      case 'update':
        return 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800';
      default:
        return 'bg-slate-50 dark:bg-slate-950/20 border-slate-200 dark:border-slate-800';
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'alert':
        return '🚨';
      case 'task':
        return '📋';
      case 'update':
        return '📢';
      default:
        return '📬';
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowPanel(!showPanel)}
        className="relative p-2 rounded-lg hover:bg-white/50 dark:hover:bg-slate-800/50 transition-colors"
      >
        <svg className="w-6 h-6 text-slate-700 dark:text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {showPanel && (
        <div className="absolute right-0 mt-2 w-80 glass rounded-lg shadow-2xl z-50 max-h-96 overflow-y-auto">
          <div className="sticky top-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-4 border-b border-white/20 dark:border-white/10">
            <h3 className="font-bold text-slate-900 dark:text-white">Notifications</h3>
            {unreadCount > 0 && (
              <p className="text-xs text-slate-600 dark:text-slate-400">{unreadCount} unread</p>
            )}
          </div>

          <div className="p-4 space-y-3">
            {notifications.length > 0 ? (
              notifications.map((notif) => (
                <button
                  key={notif.id}
                  onClick={() => markAsRead(notif.id)}
                  className={`w-full text-left p-3 rounded-lg border transition-all ${
                    notif.read
                      ? 'opacity-60'
                      : getNotificationColor(notif.type)
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <span className="text-lg flex-shrink-0">{getNotificationIcon(notif.type)}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-slate-900 dark:text-white text-sm">{notif.title}</p>
                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 line-clamp-2">
                        {notif.message}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-500 mt-2">
                        {new Date(notif.createdAt).toLocaleTimeString()}
                      </p>
                    </div>
                    {!notif.read && (
                      <div className="w-2 h-2 rounded-full bg-violet-600 dark:bg-violet-400 flex-shrink-0 mt-1"></div>
                    )}
                  </div>
                </button>
              ))
            ) : (
              <p className="text-center text-slate-600 dark:text-slate-400 py-8">No notifications</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

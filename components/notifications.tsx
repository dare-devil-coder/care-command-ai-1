'use client';

import { useEffect, useState } from 'react';
import { getNotifications, addNotification } from '@/lib/storage';
import { useAuth } from '@/lib/auth';
import { Notification } from '@/lib/schemas';

// Hook to create notifications from AI events
export function useNotifications() {
  const { currentUser } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    if (!currentUser) return;

    // Load existing notifications
    const existing = getNotifications().filter(n => n.userId === currentUser.id);
    setNotifications(existing);

    // Simulate real-time notifications
    const interval = setInterval(() => {
      if (Math.random() > 0.8) {
        const notificationMessages = [
          { title: 'New Task Assigned', message: 'Patient vitals check for John Smith', type: 'info' as const },
          { title: 'Critical Alert', message: 'Patient BP elevated to 180/120', type: 'alert' as const },
          { title: 'Task Complete', message: 'Medication administered successfully', type: 'success' as const },
          { title: 'Equipment Alert', message: 'Ventilator Unit A needs calibration', type: 'warning' as const }
        ];

        const randomMsg = notificationMessages[Math.floor(Math.random() * notificationMessages.length)];
        const newNotif = addNotification({
          userId: currentUser.id,
          title: randomMsg.title,
          message: randomMsg.message,
          type: randomMsg.type,
          read: false
        });

        setNotifications(prev => [newNotif, ...prev]);
      }
    }, 30000); // Every 30 seconds

    return () => clearInterval(interval);
  }, [currentUser]);

  return { notifications };
}

// Notification Toast Component
export function NotificationToast({ notification }: { notification: Notification }) {
  const bgColors: Record<string, string> = {
    info: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800/30',
    warning: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800/30',
    alert: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800/30',
    success: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800/30'
  };

  const textColors: Record<string, string> = {
    info: 'text-blue-800 dark:text-blue-300',
    warning: 'text-yellow-800 dark:text-yellow-300',
    alert: 'text-red-800 dark:text-red-300',
    success: 'text-green-800 dark:text-green-300'
  };

  const icons: Record<string, string> = {
    info: '📢',
    warning: '⚠️',
    alert: '🚨',
    success: '✅'
  };

  return (
    <div className={`p-4 border rounded-lg ${bgColors[notification.type]} ${textColors[notification.type]}`}>
      <div className="flex items-start gap-3">
        <span className="text-xl mt-1">{icons[notification.type]}</span>
        <div>
          <p className="font-semibold text-sm">{notification.title}</p>
          <p className="text-sm mt-1">{notification.message}</p>
        </div>
      </div>
    </div>
  );
}

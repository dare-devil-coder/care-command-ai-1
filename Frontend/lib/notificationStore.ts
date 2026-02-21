// Simple global notification store
export interface Notification {
  id: string;
  role: string;
  message: string;
  time: number;
  read: boolean;
}

export const notifications: Notification[] = [];

export const addNotification = (role: string, message: string) => {
  notifications.unshift({
    id: `notif-${Date.now()}`,
    role,
    message,
    time: Date.now(),
    read: false
  });
};

export const getNotifications = (role: string) => {
  return notifications.filter(n => n.role === role);
};

export const markAsRead = (id: string) => {
  const notif = notifications.find(n => n.id === id);
  if (notif) {
    notif.read = true;
  }
};

// Nurse-specific notifications
export const nurseNotifications: {
  id: number;
  message: string;
  time: number;
  read: boolean;
}[] = [];

export const addNurseNotification = (message: string) => {
  nurseNotifications.unshift({
    id: Date.now(),
    message,
    time: Date.now(),
    read: false,
  });
  // Also add to general notifications
  addNotification('nurse', message);
};

// localStorage utilities for data persistence
'use client';

import { getInitialData } from './data';
import {
  Patient, Task, Equipment, MaintenanceRequest, Appointment, Notification
} from './schemas';

const STORAGE_KEYS = {
  PATIENTS: 'cc_patients',
  TASKS: 'cc_tasks',
  EQUIPMENT: 'cc_equipment',
  MAINTENANCE: 'cc_maintenance',
  APPOINTMENTS: 'cc_appointments',
  NOTIFICATIONS: 'cc_notifications'
};

// Initialize storage with mock data if empty
export const initializeStorage = () => {
  if (typeof window === 'undefined') return;

  if (!localStorage.getItem(STORAGE_KEYS.PATIENTS)) {
    const data = getInitialData();
    localStorage.setItem(STORAGE_KEYS.PATIENTS, JSON.stringify(data.patients));
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(data.tasks));
    localStorage.setItem(STORAGE_KEYS.EQUIPMENT, JSON.stringify(data.equipment));
    localStorage.setItem(STORAGE_KEYS.MAINTENANCE, JSON.stringify(data.maintenanceRequests));
    localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(data.appointments));
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify([]));
  }
};

// ============ PATIENTS ============
export const getPatients = (): Patient[] => {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.PATIENTS) || '[]');
  } catch {
    return [];
  }
};

export const getPatient = (id: string): Patient | null => {
  const patients = getPatients();
  return patients.find(p => p.id === id) || null;
};

export const updatePatient = (patient: Patient) => {
  const patients = getPatients();
  const index = patients.findIndex(p => p.id === patient.id);
  if (index !== -1) {
    patients[index] = { ...patient, lastUpdated: Date.now() };
    localStorage.setItem(STORAGE_KEYS.PATIENTS, JSON.stringify(patients));
  }
};

// ============ TASKS ============
export const getTasks = (): Task[] => {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.TASKS) || '[]');
  } catch {
    return [];
  }
};

export const getTask = (id: string): Task | null => {
  const tasks = getTasks();
  return tasks.find(t => t.id === id) || null;
};

export const updateTask = (task: Task) => {
  const tasks = getTasks();
  const index = tasks.findIndex(t => t.id === task.id);
  if (index !== -1) {
    tasks[index] = task;
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
  }
};

export const createTask = (task: Omit<Task, 'id' | 'createdAt'>): Task => {
  const tasks = getTasks();
  const newTask: Task = {
    ...task,
    id: `task_${Date.now()}`,
    createdAt: Date.now()
  };
  tasks.push(newTask);
  localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
  return newTask;
};

export const deleteTask = (id: string) => {
  const tasks = getTasks();
  const filtered = tasks.filter(t => t.id !== id);
  localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(filtered));
};

// ============ EQUIPMENT ============
export const getEquipment = (): Equipment[] => {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.EQUIPMENT) || '[]');
  } catch {
    return [];
  }
};

export const getEquipmentById = (id: string): Equipment | null => {
  const equipment = getEquipment();
  return equipment.find(e => e.id === id) || null;
};

export const updateEquipment = (equipment: Equipment) => {
  const items = getEquipment();
  const index = items.findIndex(e => e.id === equipment.id);
  if (index !== -1) {
    items[index] = equipment;
    localStorage.setItem(STORAGE_KEYS.EQUIPMENT, JSON.stringify(items));
  }
};

// ============ MAINTENANCE REQUESTS ============
export const getMaintenanceRequests = (): MaintenanceRequest[] => {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.MAINTENANCE) || '[]');
  } catch {
    return [];
  }
};

export const createMaintenanceRequest = (request: Omit<MaintenanceRequest, 'id' | 'createdAt'>): MaintenanceRequest => {
  const requests = getMaintenanceRequests();
  const newRequest: MaintenanceRequest = {
    ...request,
    id: `maint_${Date.now()}`,
    createdAt: Date.now()
  };
  requests.push(newRequest);
  localStorage.setItem(STORAGE_KEYS.MAINTENANCE, JSON.stringify(requests));
  return newRequest;
};

export const updateMaintenanceRequest = (request: MaintenanceRequest) => {
  const requests = getMaintenanceRequests();
  const index = requests.findIndex(r => r.id === request.id);
  if (index !== -1) {
    requests[index] = request;
    localStorage.setItem(STORAGE_KEYS.MAINTENANCE, JSON.stringify(requests));
  }
};

// ============ APPOINTMENTS ============
export const getAppointments = (): Appointment[] => {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.APPOINTMENTS) || '[]');
  } catch {
    return [];
  }
};

export const createAppointment = (appointment: Omit<Appointment, 'id'>): Appointment => {
  const appointments = getAppointments();
  const newAppointment: Appointment = {
    ...appointment,
    id: `appt_${Date.now()}`
  };
  appointments.push(newAppointment);
  localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(appointments));
  return newAppointment;
};

// ============ NOTIFICATIONS ============
export const getNotifications = (): Notification[] => {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS) || '[]');
  } catch {
    return [];
  }
};

export const addNotification = (notification: Omit<Notification, 'id' | 'createdAt'>): Notification => {
  const notifications = getNotifications();
  const newNotification: Notification = {
    ...notification,
    id: `notif_${Date.now()}`,
    createdAt: Date.now()
  };
  notifications.unshift(newNotification);
  // Keep only last 50 notifications
  if (notifications.length > 50) {
    notifications.pop();
  }
  localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
  return newNotification;
};

export const markNotificationAsRead = (id: string) => {
  const notifications = getNotifications();
  const notification = notifications.find(n => n.id === id);
  if (notification) {
    notification.read = true;
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
  }
};

export const clearNotifications = (userId: string) => {
  const notifications = getNotifications().filter(n => n.userId !== userId);
  localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
};

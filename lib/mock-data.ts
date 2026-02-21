// Mock data for CareCommand AI
export type UserRole = 'admin' | 'doctor' | 'nurse' | 'technician';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  department: string;
  phone: string;
}

export interface Patient {
  id: string;
  qrCode: string;
  name: string;
  age: number;
  gender: 'M' | 'F';
  bloodType: string;
  allergies: string[];
  conditions: string[];
  medications: string[];
  lastCheckup: string;
  vitalSigns: {
    heartRate: number;
    temperature: number;
    bloodPressure: string;
    respiratoryRate: number;
    oxygenLevel: number;
  };
  riskScore: number;
  assignedDoctor: string;
  assignedNurse: string;
}

export interface Task {
  id: string;
  patientId: string;
  title: string;
  description: string;
  type: 'check-vitals' | 'medication' | 'test' | 'consultation' | 'follow-up';
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'in-progress' | 'completed';
  assignedTo: string;
  dueTime: string;
  createdAt: string;
  notes?: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'alert' | 'task' | 'update' | 'system';
  read: boolean;
  createdAt: string;
}

// Mock Users
export const mockUsers: Record<string, User> = {
  admin1: {
    id: 'admin1',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@hospital.com',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
    department: 'Administration',
    phone: '+1-555-0101',
  },
  doctor1: {
    id: 'doctor1',
    name: 'Dr. Michael Chen',
    email: 'michael.chen@hospital.com',
    role: 'doctor',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
    department: 'Cardiology',
    phone: '+1-555-0102',
  },
  nurse1: {
    id: 'nurse1',
    name: 'Emily Rodriguez',
    email: 'emily.rodriguez@hospital.com',
    role: 'nurse',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop',
    department: 'ICU',
    phone: '+1-555-0103',
  },
  technician1: {
    id: 'technician1',
    name: 'James Wilson',
    email: 'james.wilson@hospital.com',
    role: 'technician',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop',
    department: 'Radiology',
    phone: '+1-555-0104',
  },
};

// Mock Patients
export const mockPatients: Patient[] = [
  {
    id: 'patient1',
    qrCode: 'QR-2024-001-HXYZ7',
    name: 'Robert Thompson',
    age: 68,
    gender: 'M',
    bloodType: 'O+',
    allergies: ['Penicillin', 'Shellfish'],
    conditions: ['Hypertension', 'Type 2 Diabetes'],
    medications: ['Lisinopril', 'Metformin', 'Aspirin'],
    lastCheckup: '2024-02-10',
    vitalSigns: {
      heartRate: 78,
      temperature: 98.6,
      bloodPressure: '140/88',
      respiratoryRate: 16,
      oxygenLevel: 98,
    },
    riskScore: 7.2,
    assignedDoctor: 'doctor1',
    assignedNurse: 'nurse1',
  },
  {
    id: 'patient2',
    qrCode: 'QR-2024-002-ABCD5',
    name: 'Margaret Lee',
    age: 55,
    gender: 'F',
    bloodType: 'A-',
    allergies: ['Sulfonamides'],
    conditions: ['Asthma', 'Arthritis'],
    medications: ['Albuterol', 'Ibuprofen'],
    lastCheckup: '2024-02-12',
    vitalSigns: {
      heartRate: 72,
      temperature: 98.2,
      bloodPressure: '125/80',
      respiratoryRate: 14,
      oxygenLevel: 99,
    },
    riskScore: 3.1,
    assignedDoctor: 'doctor1',
    assignedNurse: 'nurse1',
  },
  {
    id: 'patient3',
    qrCode: 'QR-2024-003-EFGH9',
    name: 'David Martinez',
    age: 72,
    gender: 'M',
    bloodType: 'B+',
    allergies: [],
    conditions: ['Heart Disease', 'Chronic Kidney Disease'],
    medications: ['Atorvastatin', 'Furosemide', 'ACE Inhibitor'],
    lastCheckup: '2024-02-08',
    vitalSigns: {
      heartRate: 82,
      temperature: 99.1,
      bloodPressure: '158/92',
      respiratoryRate: 18,
      oxygenLevel: 96,
    },
    riskScore: 8.9,
    assignedDoctor: 'doctor1',
    assignedNurse: 'nurse1',
  },
];

// Mock Tasks
export const mockTasks: Task[] = [
  {
    id: 'task1',
    patientId: 'patient1',
    title: 'Check Vital Signs',
    description: 'Record blood pressure, heart rate, and temperature',
    type: 'check-vitals',
    priority: 'high',
    status: 'pending',
    assignedTo: 'nurse1',
    dueTime: '14:30',
    createdAt: '2024-02-20T08:00:00Z',
  },
  {
    id: 'task2',
    patientId: 'patient1',
    title: 'Administer Medication',
    description: 'Give Lisinopril 10mg tablet',
    type: 'medication',
    priority: 'high',
    status: 'in-progress',
    assignedTo: 'nurse1',
    dueTime: '12:00',
    createdAt: '2024-02-20T07:30:00Z',
  },
  {
    id: 'task3',
    patientId: 'patient3',
    title: 'ECG Test',
    description: 'Perform electrocardiogram and record results',
    type: 'test',
    priority: 'critical',
    status: 'pending',
    assignedTo: 'technician1',
    dueTime: '15:00',
    createdAt: '2024-02-20T08:15:00Z',
  },
  {
    id: 'task4',
    patientId: 'patient2',
    title: 'Follow-up Consultation',
    description: 'Review asthma control and medication compliance',
    type: 'follow-up',
    priority: 'medium',
    status: 'pending',
    assignedTo: 'doctor1',
    dueTime: '16:00',
    createdAt: '2024-02-20T08:30:00Z',
  },
];

// Mock Notifications
export const mockNotifications: Notification[] = [
  {
    id: 'notif1',
    userId: 'nurse1',
    title: 'High Priority Task',
    message: 'Patient Robert Thompson requires immediate vital sign check',
    type: 'alert',
    read: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'notif2',
    userId: 'doctor1',
    title: 'Risk Alert',
    message: 'Patient David Martinez has high risk score (8.9) - Review recommended',
    type: 'alert',
    read: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'notif3',
    userId: 'admin1',
    title: 'System Update',
    message: 'CareCommand AI system updated to v2.1.0',
    type: 'system',
    read: true,
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
];

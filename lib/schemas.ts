// TypeScript interfaces and types for CareCommand AI

export type UserRole = 'nurse' | 'doctor' | 'admin' | 'patient' | 'technician';

export interface User {
  id: string;
  username: string;
  password: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  department?: string;
  specialization?: string;
  licenseNumber?: string;
  phone?: string;
  lastLogin?: number;
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  medicalRecordNumber: string;
  gender: 'M' | 'F' | 'Other';
  bloodType: string;
  allergies: string[];
  conditions: string[];
  medications: Medication[];
  vitals: VitalSigns;
  riskScore?: number;
  riskLevel?: 'low' | 'medium' | 'high' | 'critical';
  lastUpdated: number;
  admissionDate?: number;
  primaryDoctor?: string;
  notes?: string;
}

export interface VitalSigns {
  bloodPressure: {
    systolic: number;
    diastolic: number;
  };
  heartRate: number;
  temperature: number;
  respiratoryRate: number;
  oxygenSaturation: number;
  bloodGlucose?: number;
  timestamp: number;
}

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  startDate: number;
  endDate?: number;
  prescribedBy: string;
  reason: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  patientId: string;
  assignedTo: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  dueDate: number;
  createdBy: string;
  createdAt: number;
  completedAt?: number;
  notes?: string;
}

export interface Equipment {
  id: string;
  name: string;
  type: string;
  location: string;
  status: 'available' | 'in-use' | 'maintenance' | 'out-of-service';
  lastMaintenance: number;
  nextMaintenance: number;
  serialNumber: string;
  assignedTo?: string;
  notes?: string;
}

export interface MaintenanceRequest {
  id: string;
  equipmentId: string;
  equipmentName: string;
  issueDescription: string;
  priority: 'low' | 'medium' | 'high';
  status: 'open' | 'in-progress' | 'completed';
  requestedBy: string;
  assignedTo?: string;
  createdAt: number;
  completedAt?: number;
  notes?: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  dateTime: number;
  duration: number;
  type: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'no-show';
  notes?: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'alert' | 'success';
  read: boolean;
  createdAt: number;
  actionUrl?: string;
}

export interface QRCodeData {
  type: 'patient' | 'equipment';
  id: string;
  name: string;
  location?: string;
  timestamp: number;
}

export interface AnalyticsData {
  totalPatients: number;
  activePatients: number;
  completedTasks: number;
  pendingTasks: number;
  averageRiskScore: number;
  equipmentUtilization: number;
  staffWorkload: Record<string, number>;
  departmentMetrics: Record<string, any>;
  timestamp: number;
}

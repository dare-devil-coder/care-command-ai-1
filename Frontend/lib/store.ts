import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Types
export interface User {
  id: string;
  name: string;
  role: 'nurse' | 'doctor' | 'admin' | 'patient';
  hospitalId: string;
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  room: string;
  condition: string;
  riskScore: number;
  assignedNurse: string;
  assignedDoctor: string;
  vitalSigns: {
    heartRate: number;
    bloodPressure: string;
    temperature: number;
    oxygenSaturation: number;
    respiratoryRate: number;
  };
  affectedAreas: Array<{
    name: string;
    severity: 'critical' | 'high' | 'medium' | 'low';
    description: string;
    icon?: React.ReactNode;
  }>;
  status: 'stable' | 'monitoring' | 'critical';
}

export interface Task {
  id: string;
  patientId: string;
  patientName: string;
  title: string;
  description: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  status: 'pending' | 'in-progress' | 'completed';
  assignedTo: string;
  dueTime: string;
  completedAt?: string;
}

export interface TimelineRecord {
  id: string;
  patientId: string;
  timestamp: string;
  action: string;
  performedBy: string;
  verified: boolean;
  blockchainHash: string;
}

export interface HelpRequest {
  id: string;
  patientId: string;
  patientName: string;
  requestedBy: string;
  urgency: 'critical' | 'high' | 'medium';
  type: string;
  status: 'pending' | 'accepted' | 'completed';
  timestamp: string;
  acceptedBy?: string;
}

export interface Notification {
  id: string;
  message: string;
  type: 'emergency' | 'help' | 'risk' | 'info';
  roleTarget: string[];
  timestamp: string;
  read: boolean;
  patientId?: string;
}

export interface CognitiveMetrics {
  nurseId: string;
  stressLevel: number;
  burnoutRisk: number;
  tasksCompleted: number;
  hoursWorked: number;
  breaksTaken: number;
  lastBreak?: string;
}

interface AppState {
  // Auth State
  user: User | null;
  isLoggedIn: boolean;
  
  // Hospital Data
  patients: Patient[];
  tasks: Task[];
  timelineRecords: TimelineRecord[];
  helpRequests: HelpRequest[];
  notifications: Notification[];
  cognitiveMetrics: Record<string, CognitiveMetrics>;
  
  // Actions
  login: (user: User) => void;
  logout: () => void;
  
  // Patient Actions
  updatePatientRisk: (patientId: string, riskScore: number) => void;
  updatePatientStatus: (patientId: string, status: Patient['status']) => void;
  
  // Task Actions
  addTask: (task: Task) => void;
  updateTaskStatus: (taskId: string, status: Task['status']) => void;
  completeTask: (taskId: string, performedBy: string) => void;
  
  // Timeline Actions
  addTimelineRecord: (record: Omit<TimelineRecord, 'id' | 'blockchainHash' | 'verified'>) => void;
  
  // Help Request Actions
  createHelpRequest: (request: Omit<HelpRequest, 'id' | 'timestamp' | 'status'>) => void;
  acceptHelpRequest: (requestId: string, acceptedBy: string) => void;
  completeHelpRequest: (requestId: string) => void;
  
  // Notification Actions
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markNotificationRead: (notificationId: string) => void;
  clearNotifications: () => void;
  
  // Emergency Actions
  triggerEmergency: (patientId: string, triggeredBy: string) => void;
  
  // Cognitive Actions
  updateCognitiveMetrics: (nurseId: string, metrics: Partial<CognitiveMetrics>) => void;
  takeBreak: (nurseId: string) => void;
  
  // Initialize mock data
  initializeMockData: () => void;
}

// Generate blockchain hash
const generateBlockchainHash = () => {
  return '0x' + Array.from({ length: 64 }, () => 
    Math.floor(Math.random() * 16).toString(16)
  ).join('');
};

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial State
      user: null,
      isLoggedIn: false,
      patients: [],
      tasks: [],
      timelineRecords: [],
      helpRequests: [],
      notifications: [],
      cognitiveMetrics: {},
      
      // Auth Actions
      login: (user) => {
        console.log('[Store] Login called with user:', user);
        set({ user, isLoggedIn: true });
        localStorage.setItem('userRole', user.role);
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userName', user.name);
        localStorage.setItem('userId', user.id);
        console.log('[Store] Login state updated:', { user, isLoggedIn: true });
      },
      
      logout: () => {
        set({ user: null, isLoggedIn: false });
        localStorage.removeItem('userRole');
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('userName');
      },
      
      // Patient Actions
      updatePatientRisk: (patientId, riskScore) => {
        set((state) => ({
          patients: state.patients.map((p) =>
            p.id === patientId ? { ...p, riskScore } : p
          ),
        }));
        
        // Trigger notification if high risk
        if (riskScore > 75) {
          const patient = get().patients.find(p => p.id === patientId);
          if (patient) {
            get().addNotification({
              message: `⚠️ ${patient.name} - High Risk Alert (${riskScore}%)`,
              type: 'risk',
              roleTarget: ['nurse', 'doctor'],
              patientId,
            });
          }
        }
      },
      
      updatePatientStatus: (patientId, status) => {
        set((state) => ({
          patients: state.patients.map((p) =>
            p.id === patientId ? { ...p, status } : p
          ),
        }));
      },
      
      // Task Actions
      addTask: (task) => {
        set((state) => ({
          tasks: [...state.tasks, task],
        }));
      },
      
      updateTaskStatus: (taskId, status) => {
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === taskId ? { ...t, status } : t
          ),
        }));
      },
      
      completeTask: (taskId, performedBy) => {
        const task = get().tasks.find(t => t.id === taskId);
        if (!task) return;
        
        const completedAt = new Date().toISOString();
        
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === taskId 
              ? { ...t, status: 'completed' as const, completedAt } 
              : t
          ),
        }));
        
        // Add to timeline
        get().addTimelineRecord({
          patientId: task.patientId,
          timestamp: completedAt,
          action: `Completed: ${task.title}`,
          performedBy,
        });
        
        // Update cognitive metrics
        const user = get().user;
        if (user && user.role === 'nurse') {
          const metrics = get().cognitiveMetrics[user.id] || {
            nurseId: user.id,
            stressLevel: 0,
            burnoutRisk: 0,
            tasksCompleted: 0,
            hoursWorked: 0,
            breaksTaken: 0,
          };
          
          get().updateCognitiveMetrics(user.id, {
            tasksCompleted: metrics.tasksCompleted + 1,
            stressLevel: Math.min(metrics.stressLevel + 5, 100),
          });
        }
      },
      
      // Timeline Actions
      addTimelineRecord: (record) => {
        const newRecord: TimelineRecord = {
          ...record,
          id: `record-${Date.now()}-${Math.random()}`,
          blockchainHash: generateBlockchainHash(),
          verified: true,
        };
        
        set((state) => ({
          timelineRecords: [...state.timelineRecords, newRecord],
        }));
      },
      
      // Help Request Actions
      createHelpRequest: (request) => {
        const newRequest: HelpRequest = {
          ...request,
          id: `help-${Date.now()}`,
          timestamp: new Date().toISOString(),
          status: 'pending',
        };
        
        set((state) => ({
          helpRequests: [...state.helpRequests, newRequest],
        }));
        
        // Notify other nurses
        get().addNotification({
          message: `🤝 Help requested for ${request.patientName} - ${request.type}`,
          type: 'help',
          roleTarget: ['nurse'],
          patientId: request.patientId,
        });
      },
      
      acceptHelpRequest: (requestId, acceptedBy) => {
        set((state) => ({
          helpRequests: state.helpRequests.map((r) =>
            r.id === requestId 
              ? { ...r, status: 'accepted' as const, acceptedBy } 
              : r
          ),
        }));
      },
      
      completeHelpRequest: (requestId) => {
        set((state) => ({
          helpRequests: state.helpRequests.map((r) =>
            r.id === requestId ? { ...r, status: 'completed' as const } : r
          ),
        }));
      },
      
      // Notification Actions
      addNotification: (notification) => {
        const newNotification: Notification = {
          ...notification,
          id: `notif-${Date.now()}`,
          timestamp: new Date().toISOString(),
          read: false,
        };
        
        set((state) => ({
          notifications: [newNotification, ...state.notifications],
        }));
      },
      
      markNotificationRead: (notificationId) => {
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === notificationId ? { ...n, read: true } : n
          ),
        }));
      },
      
      clearNotifications: () => {
        set({ notifications: [] });
      },
      
      // Emergency Actions
      triggerEmergency: (patientId, triggeredBy) => {
        const patient = get().patients.find(p => p.id === patientId);
        if (!patient) return;
        
        // Update patient status
        get().updatePatientStatus(patientId, 'critical');
        
        // Add timeline record
        get().addTimelineRecord({
          patientId,
          timestamp: new Date().toISOString(),
          action: '🚨 EMERGENCY ALERT TRIGGERED',
          performedBy: triggeredBy,
        });
        
        // Notify all relevant staff
        get().addNotification({
          message: `🚨 EMERGENCY: ${patient.name} in Room ${patient.room}`,
          type: 'emergency',
          roleTarget: ['nurse', 'doctor', 'admin'],
          patientId,
        });
      },
      
      // Cognitive Actions
      updateCognitiveMetrics: (nurseId, metrics) => {
        set((state) => ({
          cognitiveMetrics: {
            ...state.cognitiveMetrics,
            [nurseId]: {
              ...(state.cognitiveMetrics[nurseId] || {
                nurseId,
                stressLevel: 0,
                burnoutRisk: 0,
                tasksCompleted: 0,
                hoursWorked: 0,
                breaksTaken: 0,
              }),
              ...metrics,
            },
          },
        }));
      },
      
      takeBreak: (nurseId) => {
        const metrics = get().cognitiveMetrics[nurseId];
        if (!metrics) return;
        
        get().updateCognitiveMetrics(nurseId, {
          stressLevel: Math.max(metrics.stressLevel - 10, 0),
          breaksTaken: metrics.breaksTaken + 1,
          lastBreak: new Date().toISOString(),
        });
      },
      
      // Initialize Mock Data
      initializeMockData: () => {
        const mockPatients: Patient[] = [
          {
            id: 'P001',
            name: 'Sarah Johnson',
            age: 45,
            room: '302-A',
            condition: 'Post-Surgery Recovery',
            riskScore: 65,
            assignedNurse: 'N001',
            assignedDoctor: 'D001',
            status: 'monitoring',
            vitalSigns: {
              heartRate: 88,
              bloodPressure: '125/80',
              temperature: 37.2,
              oxygenSaturation: 96,
              respiratoryRate: 16,
            },
            affectedAreas: [
              {
                name: 'Cardiovascular',
                severity: 'medium',
                description: 'Slightly elevated heart rate, monitoring required',
                icon: '❤️',
              },
            ],
          },
          {
            id: 'P002',
            name: 'Michael Chen',
            age: 62,
            room: '305-B',
            condition: 'Cardiac Monitoring',
            riskScore: 82,
            assignedNurse: 'N001',
            assignedDoctor: 'D001',
            status: 'critical',
            vitalSigns: {
              heartRate: 105,
              bloodPressure: '145/95',
              temperature: 37.8,
              oxygenSaturation: 92,
              respiratoryRate: 20,
            },
            affectedAreas: [
              {
                name: 'Cardiovascular',
                severity: 'high',
                description: 'Elevated heart rate and blood pressure',
                icon: '❤️',
              },
            ],
          },
          {
            id: 'P003',
            name: 'Emma Davis',
            age: 34,
            room: '301-C',
            condition: 'Recovery',
            riskScore: 45,
            assignedNurse: 'N001',
            assignedDoctor: 'D001',
            status: 'stable',
            vitalSigns: {
              heartRate: 72,
              bloodPressure: '118/75',
              temperature: 36.8,
              oxygenSaturation: 98,
              respiratoryRate: 14,
            },
            affectedAreas: [],
          },
        ];
        
        const mockTasks: Task[] = [
          {
            id: 'T001',
            patientId: 'P001',
            patientName: 'Sarah Johnson',
            title: 'Check Vital Signs',
            description: 'Monitor post-surgery vitals',
            priority: 'high',
            status: 'pending',
            assignedTo: 'N001',
            dueTime: '14:00',
          },
          {
            id: 'T002',
            patientId: 'P002',
            patientName: 'Michael Chen',
            title: 'Administer Medication',
            description: 'Blood pressure medication',
            priority: 'critical',
            status: 'pending',
            assignedTo: 'N001',
            dueTime: '13:30',
          },
          {
            id: 'T003',
            patientId: 'P003',
            patientName: 'Emma Davis',
            title: 'Wound Dressing Change',
            description: 'Change surgical dressing',
            priority: 'medium',
            status: 'in-progress',
            assignedTo: 'N001',
            dueTime: '15:00',
          },
        ];
        
        const mockTimeline: TimelineRecord[] = [
          {
            id: 'TL001',
            patientId: 'P001',
            timestamp: new Date(Date.now() - 3600000).toISOString(),
            action: 'Vital signs checked',
            performedBy: 'Nurse Emily',
            verified: true,
            blockchainHash: generateBlockchainHash(),
          },
          {
            id: 'TL002',
            patientId: 'P001',
            timestamp: new Date(Date.now() - 7200000).toISOString(),
            action: 'Medication administered',
            performedBy: 'Nurse Emily',
            verified: true,
            blockchainHash: generateBlockchainHash(),
          },
        ];
        
        set({
          patients: mockPatients,
          tasks: mockTasks,
          timelineRecords: mockTimeline,
          helpRequests: [],
          notifications: [],
        });
      },
    }),
    {
      name: 'carecommand-storage',
      partialize: (state) => ({
        user: state.user,
        isLoggedIn: state.isLoggedIn,
        patients: state.patients,
        tasks: state.tasks,
        timelineRecords: state.timelineRecords,
        cognitiveMetrics: state.cognitiveMetrics,
      }),
    }
  )
);

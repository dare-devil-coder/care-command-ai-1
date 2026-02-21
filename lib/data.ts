// Mock data generator and CRUD operations
import {
  User, Patient, Task, Equipment, MaintenanceRequest, Appointment, VitalSigns
} from './schemas';

// ============ DEMO USERS ============
export const DEMO_USERS: User[] = [
  {
    id: 'nurse_001',
    username: 'nurse1',
    password: 'nurse123',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@hospital.com',
    role: 'nurse',
    department: 'ICU',
    avatar: '👩‍⚕️',
    phone: '+1-555-0101'
  },
  {
    id: 'doctor_001',
    username: 'doctor1',
    password: 'doctor123',
    name: 'Dr. Michael Chen',
    email: 'michael.chen@hospital.com',
    role: 'doctor',
    department: 'Cardiology',
    specialization: 'Cardiothoracic Surgery',
    licenseNumber: 'MD-2015-08392',
    avatar: '👨‍⚕️',
    phone: '+1-555-0102'
  },
  {
    id: 'admin_001',
    username: 'admin1',
    password: 'admin123',
    name: 'Lisa Rodriguez',
    email: 'lisa.rodriguez@hospital.com',
    role: 'admin',
    department: 'Administration',
    avatar: '👩‍💼',
    phone: '+1-555-0103'
  },
  {
    id: 'patient_001',
    username: 'patient1',
    password: 'patient123',
    name: 'John Smith',
    email: 'john.smith@email.com',
    role: 'patient',
    avatar: '👨‍🦱',
    phone: '+1-555-0104'
  },
  {
    id: 'tech_001',
    username: 'tech1',
    password: 'tech123',
    name: 'Robert Wilson',
    email: 'robert.wilson@hospital.com',
    role: 'technician',
    department: 'Medical Equipment',
    avatar: '👨‍🔧',
    phone: '+1-555-0105'
  }
];

// ============ MOCK PATIENTS ============
const generatePatients = (): Patient[] => {
  const firstNames = ['James', 'Maria', 'Robert', 'Jennifer', 'Michael', 'Patricia', 'William', 'Linda'];
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis'];
  const conditions = ['Hypertension', 'Diabetes', 'Heart Disease', 'Asthma', 'COPD', 'Arthritis', 'Pneumonia'];
  const medications = [
    { name: 'Metoprolol', dosage: '50mg', reason: 'Blood pressure' },
    { name: 'Lisinopril', dosage: '10mg', reason: 'Hypertension' },
    { name: 'Metformin', dosage: '500mg', reason: 'Diabetes' },
    { name: 'Atorvastatin', dosage: '20mg', reason: 'Cholesterol' },
    { name: 'Aspirin', dosage: '81mg', reason: 'Cardiovascular health' }
  ];

  const patients: Patient[] = [];
  for (let i = 1; i <= 20; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const age = 30 + Math.floor(Math.random() * 60);
    
    patients.push({
      id: `patient_${String(i).padStart(3, '0')}`,
      name: `${firstName} ${lastName}`,
      age,
      medicalRecordNumber: `MRN${String(i).padStart(6, '0')}`,
      gender: Math.random() > 0.5 ? 'M' : 'F',
      bloodType: ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'][Math.floor(Math.random() * 8)],
      allergies: Math.random() > 0.6 ? ['Penicillin', 'Sulfa'] : [],
      conditions: [conditions[Math.floor(Math.random() * conditions.length)]],
      medications: [
        {
          id: `med_${i}_1`,
          ...medications[Math.floor(Math.random() * medications.length)],
          prescribedBy: 'doctor_001',
          startDate: Date.now() - 30 * 24 * 60 * 60 * 1000
        }
      ],
      vitals: {
        bloodPressure: { systolic: 110 + Math.floor(Math.random() * 40), diastolic: 65 + Math.floor(Math.random() * 25) },
        heartRate: 60 + Math.floor(Math.random() * 40),
        temperature: 36.5 + Math.random() * 1.5,
        respiratoryRate: 12 + Math.floor(Math.random() * 8),
        oxygenSaturation: 95 + Math.random() * 5,
        timestamp: Date.now()
      },
      lastUpdated: Date.now(),
      primaryDoctor: 'doctor_001',
      admissionDate: Date.now() - Math.floor(Math.random() * 20) * 24 * 60 * 60 * 1000
    });
  }
  return patients;
};

// ============ MOCK TASKS ============
const generateTasks = (patients: Patient[]): Task[] => {
  const taskTemplates = [
    { title: 'Patient vitals monitoring', description: 'Check and record vital signs' },
    { title: 'Medication administration', description: 'Administer scheduled medications' },
    { title: 'Wound dressing change', description: 'Change and clean wound dressing' },
    { title: 'Catheter care', description: 'Check catheter and perform care routine' },
    { title: 'Patient mobilization', description: 'Assist patient with movement and exercises' },
    { title: 'Lab sample collection', description: 'Collect blood/urine samples for testing' }
  ];

  const tasks: Task[] = [];
  for (let i = 0; i < 15; i++) {
    const template = taskTemplates[i % taskTemplates.length];
    tasks.push({
      id: `task_${String(i + 1).padStart(3, '0')}`,
      title: template.title,
      description: template.description,
      patientId: patients[i % patients.length].id,
      assignedTo: 'nurse_001',
      priority: ['low', 'medium', 'high', 'critical'][Math.floor(Math.random() * 4)] as any,
      status: ['pending', 'in-progress', 'completed'][Math.floor(Math.random() * 3)] as any,
      dueDate: Date.now() + (i * 60 * 60 * 1000),
      createdBy: 'doctor_001',
      createdAt: Date.now() - (15 - i) * 60 * 60 * 1000
    });
  }
  return tasks;
};

// ============ MOCK EQUIPMENT ============
const generateEquipment = (): Equipment[] => {
  const equipment: Equipment[] = [
    { id: 'eq_001', name: 'Ventilator Unit A', type: 'Respiratory Support', location: 'ICU Room 101', status: 'in-use', lastMaintenance: Date.now() - 7 * 24 * 60 * 60 * 1000, nextMaintenance: Date.now() + 23 * 24 * 60 * 60 * 1000, serialNumber: 'VENT-2023-001', assignedTo: 'nurse_001' },
    { id: 'eq_002', name: 'Monitor Station 1', type: 'Patient Monitoring', location: 'ICU Central', status: 'available', lastMaintenance: Date.now() - 14 * 24 * 60 * 60 * 1000, nextMaintenance: Date.now() + 16 * 24 * 60 * 60 * 1000, serialNumber: 'MON-2023-001' },
    { id: 'eq_003', name: 'Infusion Pump', type: 'IV Administration', location: 'ICU Room 102', status: 'maintenance', lastMaintenance: Date.now() - 1 * 24 * 60 * 60 * 1000, nextMaintenance: Date.now() + 29 * 24 * 60 * 60 * 1000, serialNumber: 'INF-2023-001', notes: 'Battery replacement scheduled' },
    { id: 'eq_004', name: 'Defibrillator', type: 'Emergency Equipment', location: 'ICU Hall', status: 'available', lastMaintenance: Date.now() - 2 * 24 * 60 * 60 * 1000, nextMaintenance: Date.now() + 28 * 24 * 60 * 60 * 1000, serialNumber: 'DEF-2023-001' },
    { id: 'eq_005', name: 'Ultrasound Machine', type: 'Imaging', location: 'Ultrasound Lab', status: 'in-use', lastMaintenance: Date.now() - 21 * 24 * 60 * 60 * 1000, nextMaintenance: Date.now() + 9 * 24 * 60 * 60 * 1000, serialNumber: 'USG-2023-001' }
  ];
  return equipment;
};

// ============ MOCK MAINTENANCE REQUESTS ============
const generateMaintenanceRequests = (equipment: Equipment[]): MaintenanceRequest[] => {
  return [
    {
      id: 'maint_001',
      equipmentId: 'eq_003',
      equipmentName: 'Infusion Pump',
      issueDescription: 'Battery not holding charge',
      priority: 'high',
      status: 'in-progress',
      requestedBy: 'nurse_001',
      assignedTo: 'tech_001',
      createdAt: Date.now() - 2 * 60 * 60 * 1000,
      notes: 'Battery replacement in progress'
    },
    {
      id: 'maint_002',
      equipmentId: 'eq_001',
      equipmentName: 'Ventilator Unit A',
      issueDescription: 'Routine maintenance and calibration',
      priority: 'medium',
      status: 'open',
      requestedBy: 'nurse_001',
      createdAt: Date.now() - 24 * 60 * 60 * 1000
    }
  ];
};

// ============ MOCK APPOINTMENTS ============
const generateAppointments = (patients: Patient[]): Appointment[] => {
  const appointments: Appointment[] = [];
  for (let i = 0; i < 8; i++) {
    appointments.push({
      id: `appt_${String(i + 1).padStart(3, '0')}`,
      patientId: patients[i].id,
      patientName: patients[i].name,
      doctorId: 'doctor_001',
      doctorName: 'Dr. Michael Chen',
      dateTime: Date.now() + (i * 2 * 60 * 60 * 1000),
      duration: 30,
      type: ['Check-up', 'Follow-up', 'Consultation', 'Surgery'][Math.floor(Math.random() * 4)],
      status: i < 3 ? 'scheduled' : 'completed'
    });
  }
  return appointments;
};

// ============ EXPORT INITIAL DATA ============
export const getInitialData = () => {
  const patients = generatePatients();
  const tasks = generateTasks(patients);
  const equipment = generateEquipment();
  const maintenanceRequests = generateMaintenanceRequests(equipment);
  const appointments = generateAppointments(patients);

  return {
    users: DEMO_USERS,
    patients,
    tasks,
    equipment,
    maintenanceRequests,
    appointments
  };
};

// ============ HELPER FUNCTIONS ============
export const getPatientRiskScore = (patient: Patient): number => {
  let score = 0;
  const v = patient.vitals;

  // Blood pressure scoring
  if (v.bloodPressure.systolic > 180 || v.bloodPressure.diastolic > 120) score += 40;
  else if (v.bloodPressure.systolic > 160 || v.bloodPressure.diastolic > 100) score += 30;
  else if (v.bloodPressure.systolic > 140 || v.bloodPressure.diastolic > 90) score += 15;

  // Heart rate scoring
  if (v.heartRate > 120 || v.heartRate < 40) score += 25;
  else if (v.heartRate > 100 || v.heartRate < 50) score += 15;

  // Oxygen saturation scoring
  if (v.oxygenSaturation < 90) score += 35;
  else if (v.oxygenSaturation < 94) score += 20;

  // Temperature scoring
  if (v.temperature > 39 || v.temperature < 36) score += 15;

  // Age factor
  if (patient.age > 70) score += 10;

  // Condition factor
  const criticalConditions = ['Heart Disease', 'Pneumonia'];
  if (patient.conditions.some(c => criticalConditions.includes(c))) score += 20;

  return Math.min(100, Math.max(0, score));
};

export const getRiskLevel = (score: number): 'low' | 'medium' | 'high' | 'critical' => {
  if (score >= 80) return 'critical';
  if (score >= 60) return 'high';
  if (score >= 40) return 'medium';
  return 'low';
};

export const formatVitals = (vitals: VitalSigns): string => {
  return `BP: ${vitals.bloodPressure.systolic}/${vitals.bloodPressure.diastolic} | HR: ${vitals.heartRate} | O2: ${vitals.oxygenSaturation.toFixed(1)}%`;
};

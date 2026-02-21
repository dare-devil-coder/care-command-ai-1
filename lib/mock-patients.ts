export interface Patient {
  id: string;
  name: string;
  room: string;
  age: number;
  diagnosis: string;
  riskLevel: 'Critical' | 'Moderate' | 'Stable';
  riskScore: number;
  vital: {
    bloodPressure: string;
    heartRate: number;
    oxygen: number;
    temperature: number;
  };
}

export interface Mission {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
  priority: 'high' | 'medium' | 'low';
  instructions: string[];
  estimatedTime: string;
}

export interface TimelineEntry {
  id: string;
  timestamp: string;
  action: string;
  doctor?: string;
  secured: boolean;
}

export const mockPatients: Patient[] = [
  {
    id: '1',
    name: 'Margaret Johnson',
    room: '301',
    age: 78,
    diagnosis: 'Pneumonia with sepsis risk',
    riskLevel: 'Critical',
    riskScore: 92,
    vital: {
      bloodPressure: '145/92',
      heartRate: 118,
      oxygen: 88,
      temperature: 39.2,
    },
  },
  {
    id: '2',
    name: 'Robert Chen',
    room: '302',
    age: 65,
    diagnosis: 'Post-op cardiac surgery',
    riskLevel: 'Moderate',
    riskScore: 58,
    vital: {
      bloodPressure: '135/85',
      heartRate: 88,
      oxygen: 96,
      temperature: 37.1,
    },
  },
  {
    id: '3',
    name: 'Sarah Williams',
    room: '305',
    age: 42,
    diagnosis: 'Migraine with aura',
    riskLevel: 'Stable',
    riskScore: 22,
    vital: {
      bloodPressure: '118/76',
      heartRate: 72,
      oxygen: 98,
      temperature: 36.8,
    },
  },
  {
    id: '4',
    name: 'David Martinez',
    room: '308',
    age: 71,
    diagnosis: 'Type 2 diabetes with neuropathy',
    riskLevel: 'Moderate',
    riskScore: 45,
    vital: {
      bloodPressure: '142/88',
      heartRate: 82,
      oxygen: 97,
      temperature: 37.0,
    },
  },
];

export const mockMissions: Mission[] = [
  {
    id: '1',
    title: 'Check Blood Pressure',
    description: 'Monitor vital signs and record in patient chart',
    status: 'pending',
    priority: 'high',
    instructions: [
      'Use automatic BP monitor on left arm',
      'Record reading in patient management system',
      'If systolic > 160, notify doctor immediately',
      'Patient should be seated and rested for 5 minutes before measurement',
    ],
    estimatedTime: '5 min',
  },
  {
    id: '2',
    title: 'Administer Antibiotic',
    description: 'IV administration of prescribed antibiotic course',
    status: 'pending',
    priority: 'high',
    instructions: [
      'Check patient ID and allergy bracelet',
      'Verify medication label matches prescription',
      'Prepare IV line and inject slowly over 3 minutes',
      'Monitor for any adverse reactions',
      'Document administration time in medical record',
    ],
    estimatedTime: '10 min',
  },
  {
    id: '3',
    title: 'Change IV Fluid',
    description: 'Replace IV fluid bag with new saline solution',
    status: 'pending',
    priority: 'medium',
    instructions: [
      'Wash hands and wear gloves',
      'Check IV line for integrity and patency',
      'Remove old bag and replace with new saline 0.9%',
      'Prime tubing to remove air bubbles',
      'Adjust flow rate to 100 mL/hr',
      'Document fluid change and volume infused',
    ],
    estimatedTime: '8 min',
  },
];

export const mockTimelineEntries: TimelineEntry[] = [
  {
    id: '1',
    timestamp: '9:00 AM',
    action: 'BP Checked - Systolic 145, Diastolic 92',
    doctor: 'Dr. Smith',
    secured: true,
  },
  {
    id: '2',
    timestamp: '10:00 AM',
    action: 'Antibiotic Administered - Cefixime 400mg IV',
    doctor: 'Nurse Priya',
    secured: true,
  },
  {
    id: '3',
    timestamp: '11:30 AM',
    action: 'Doctor Updated Care Plan - Increased fluid intake',
    doctor: 'Dr. Smith',
    secured: true,
  },
  {
    id: '4',
    timestamp: '1:00 PM',
    action: 'IV Fluid Changed - Normal Saline 0.9%',
    doctor: 'Nurse Priya',
    secured: true,
  },
  {
    id: '5',
    timestamp: '3:00 PM',
    action: 'Vital Signs Stable - No adverse reactions',
    doctor: 'Nurse Priya',
    secured: true,
  },
];

// Simulated AI functions for risk prediction, recommendations, and smart matching
import { Patient, Task, User } from './schemas';
import { getPatientRiskScore, getRiskLevel } from './data';

// ============ 1. DYNAMIC RISK SCORE CALCULATION ============
/**
 * Calculate dynamic risk score based on vital signs
 * Risk increases for abnormal values: BP, HR, O2, Temp
 */
export const calculateDynamicRiskScore = (patient: any): { score: number; level: string; details: string[] } => {
  // Support both schema versions (vitals) and mock-patients versions (vital)
  const v = patient.vitals || patient.vital;
  
  if (!v) {
    return { score: 0, level: 'Low', details: [] };
  }

  let baseScore = 20; // Starting baseline
  const details: string[] = [];

  // Parse blood pressure (can be string "145/92" or object)
  let bpSystolic = 120;
  let bpDiastolic = 80;
  
  if (typeof v.bloodPressure === 'string') {
    const [sys, dia] = v.bloodPressure.split('/').map(Number);
    bpSystolic = sys || 120;
    bpDiastolic = dia || 80;
  } else if (v.bloodPressure?.systolic !== undefined) {
    bpSystolic = v.bloodPressure.systolic;
    bpDiastolic = v.bloodPressure.diastolic;
  }

  // Blood Pressure Assessment
  if (bpSystolic > 180 || bpDiastolic > 120) {
    baseScore += 30;
    details.push(`Critical BP: ${bpSystolic}/${bpDiastolic}`);
  } else if (bpSystolic > 160 || bpDiastolic > 100) {
    baseScore += 20;
    details.push(`High BP: ${bpSystolic}/${bpDiastolic}`);
  } else if (bpSystolic > 140 || bpDiastolic > 90) {
    baseScore += 10;
    details.push(`Elevated BP: ${bpSystolic}/${bpDiastolic}`);
  }

  // Heart Rate Assessment
  const heartRate = v.heartRate || 0;
  if (heartRate > 130 || heartRate < 40) {
    baseScore += 30;
    details.push(`Critical HR: ${heartRate} bpm`);
  } else if (heartRate > 110 || heartRate < 50) {
    baseScore += 20;
    details.push(`Abnormal HR: ${heartRate} bpm`);
  } else if (heartRate > 100 || heartRate < 60) {
    baseScore += 10;
    details.push(`Elevated HR: ${heartRate} bpm`);
  }

  // Oxygen Saturation Assessment (oxygenSaturation or oxygen)
  const oxygen = v.oxygenSaturation ?? v.oxygen ?? 0;
  if (oxygen < 85) {
    baseScore += 35;
    details.push(`Critical O2: ${oxygen}%`);
  } else if (oxygen < 90) {
    baseScore += 25;
    details.push(`Low O2: ${oxygen}%`);
  } else if (oxygen < 95) {
    baseScore += 15;
    details.push(`Below normal O2: ${oxygen}%`);
  }

  // Temperature Assessment
  const temperature = v.temperature || 0;
  if (temperature > 40 || temperature < 35) {
    baseScore += 25;
    details.push(`Critical Temp: ${temperature}°C`);
  } else if (temperature > 39 || temperature < 36) {
    baseScore += 15;
    details.push(`Abnormal Temp: ${temperature}°C`);
  } else if (temperature > 38.5) {
    baseScore += 10;
    details.push(`Elevated Temp: ${temperature}°C`);
  }

  // Age factor
  if (patient.age > 75) baseScore += 5;
  
  // Pre-existing conditions factor
  const conditionsLength = patient.conditions?.length || 0;
  if (conditionsLength > 2) baseScore += 5;

  // Normalize to 0-100
  const score = Math.min(100, baseScore);
  
  // Determine risk level
  let level = 'Low';
  if (score >= 75) level = 'Critical';
  else if (score >= 50) level = 'Moderate';
  else if (score >= 25) level = 'Elevated';

  return { score, level, details };
};

export const calculatePatientRisk = (patient: Patient) => {
  const dynamicRisk = calculateDynamicRiskScore(patient);
  
  return {
    score: dynamicRisk.score,
    level: dynamicRisk.level,
    reasons: dynamicRisk.details,
    recommendation: getRecommendationForRisk(dynamicRisk.level),
    lastUpdate: new Date().toLocaleTimeString()
  };
};

const getRecommendationForRisk = (level: string): string => {
  const recommendations: Record<string, string> = {
    critical: 'Immediate intervention required. Consider ICU admission and continuous monitoring.',
    Critical: 'Immediate intervention required. Consider ICU admission and continuous monitoring.',
    Moderate: 'Close monitoring recommended. Schedule urgent consultation with attending physician.',
    high: 'Close monitoring recommended. Schedule urgent consultation with attending physician.',
    Elevated: 'Monitor closely. Standard protocols apply.',
    medium: 'Standard monitoring protocols. Schedule follow-up within 24 hours.',
    Low: 'Routine care appropriate. Continue regular monitoring schedule.',
    low: 'Routine care appropriate. Continue regular monitoring schedule.'
  };
  return recommendations[level] || '';
};

// ============ 2. COGNITIVE LOAD AI ============
/**
 * Calculate nurse cognitive load based on patient assignment complexity
 * Factors: number of patients, critical patients, pending tasks, emergency frequency
 */
export const calculateCognitiveLoad = (
  assignedPatients: Patient[] | any[] = [],
  pendingTasks: Task[] | any[] = [],
  emergencyFrequency: number = 0
): { score: number; level: string; breakdown: Record<string, number>; recommendation: string } => {
  let baseLoad = 10;
  const breakdown: Record<string, number> = {};

  // Validate input
  const patients = Array.isArray(assignedPatients) ? assignedPatients : [];
  const tasks = Array.isArray(pendingTasks) ? pendingTasks : [];

  // 1. Number of assigned patients (max 30 points)
  const patientLoad = Math.min(30, patients.length * 6);
  baseLoad += patientLoad;
  breakdown['Patient Count Load'] = patientLoad;

  // 2. Critical patients weight (max 25 points)
  const criticalCount = patients.filter(p => {
    try {
      if (!p) return false;
      const risk = calculateDynamicRiskScore(p);
      return risk.level === 'Critical';
    } catch (e) {
      console.log('[v0] Error calculating risk for patient:', p);
      return false;
    }
  }).length;
  const criticalLoad = Math.min(25, criticalCount * 12);
  baseLoad += criticalLoad;
  breakdown['Critical Patients'] = criticalLoad;

  // 3. Pending tasks (max 20 points)
  const taskLoad = Math.min(20, tasks.length * 2);
  baseLoad += taskLoad;
  breakdown['Pending Tasks'] = taskLoad;

  // 4. Emergency frequency (max 15 points)
  const emergencyLoad = Math.min(15, emergencyFrequency * 3);
  baseLoad += emergencyLoad;
  breakdown['Emergency Frequency'] = emergencyLoad;

  const score = Math.min(100, baseLoad);
  
  let level = 'Low';
  let recommendation = 'Workload is manageable. Continue normal operations.';
  
  if (score >= 80) {
    level = 'Critical';
    recommendation = 'URGENT: Workload is overwhelming. Recommend immediate assistance or patient reassignment.';
  } else if (score >= 60) {
    level = 'High';
    recommendation = 'High workload detected. Consider break or additional support.';
  } else if (score >= 40) {
    level = 'Moderate';
    recommendation = 'Moderate workload. Monitor stress levels.';
  }

  return { score, level, breakdown, recommendation };
};

// ============ 3. PREDICTIVE ALERT SIMULATION ============
/**
 * Simulate predictive alerts for patient deterioration
 * Triggers when vital signs cross critical thresholds
 */
export const generatePredictiveAlerts = (patient: any): Array<{ alert: string; severity: 'warning' | 'critical'; timeframe: string }> => {
  const alerts: Array<{ alert: string; severity: 'warning' | 'critical'; timeframe: string }> = [];
  const v = patient.vitals || patient.vital;

  if (!v) return alerts;

  // Parse blood pressure
  let bpSystolic = 120;
  if (typeof v.bloodPressure === 'string') {
    const [sys] = v.bloodPressure.split('/').map(Number);
    bpSystolic = sys || 120;
  } else if (v.bloodPressure?.systolic !== undefined) {
    bpSystolic = v.bloodPressure.systolic;
  }

  const oxygen = v.oxygenSaturation ?? v.oxygen ?? 0;
  const temperature = v.temperature || 0;
  const heartRate = v.heartRate || 0;

  // Critical deterioration signs
  if (oxygen < 90) {
    alerts.push({
      alert: `HIGH RISK: Severe hypoxemia detected (O2 ${oxygen}%). Risk of acute respiratory failure.`,
      severity: 'critical',
      timeframe: '15-30 mins'
    });
  }

  if (temperature > 39) {
    alerts.push({
      alert: `HIGH RISK: Elevated temperature (${temperature}°C). Risk of sepsis or severe infection.`,
      severity: 'critical',
      timeframe: '30 mins to 2 hours'
    });
  }

  if (heartRate > 110) {
    alerts.push({
      alert: `HIGH RISK: Tachycardia detected (HR ${heartRate}). Risk of shock or cardiac deterioration.`,
      severity: 'critical',
      timeframe: '15-60 mins'
    });
  }

  // Combined warning signs
  if (oxygen < 90 && heartRate > 110 && temperature > 38.5) {
    alerts.push({
      alert: `CRITICAL COMBINATION: Multiple deterioration signs detected. High risk of acute decompensation.`,
      severity: 'critical',
      timeframe: '15-30 mins'
    });
  }

  // Moderate alerts
  if (oxygen < 92) {
    alerts.push({
      alert: `WARNING: Low oxygen saturation (${oxygen}%). Monitor closely for deterioration.`,
      severity: 'warning',
      timeframe: 'Monitor continuously'
    });
  }

  if (heartRate > 120) {
    alerts.push({
      alert: `WARNING: Very elevated heart rate (${heartRate} bpm). Risk of cardiac compromise.`,
      severity: 'warning',
      timeframe: '1-2 hours'
    });
  }

  // Blood pressure deterioration
  if (bpSystolic < 90) {
    alerts.push({
      alert: `CRITICAL: Hypotension detected (${bpSystolic}). Risk of shock.`,
      severity: 'critical',
      timeframe: 'Immediate'
    });
  }

  return alerts;
};

// ============ CLINICAL RECOMMENDATIONS ============
export const generateClinicalRecommendations = (patient: any): string[] => {
  const recommendations: string[] = [];
  const v = patient.vitals || patient.vital;

  if (!v) return ['Continue current treatment plan. Patient stable.'];

  // Parse blood pressure
  let bpSystolic = 120;
  if (typeof v.bloodPressure === 'string') {
    const [sys] = v.bloodPressure.split('/').map(Number);
    bpSystolic = sys || 120;
  } else if (v.bloodPressure?.systolic !== undefined) {
    bpSystolic = v.bloodPressure.systolic;
  }

  const oxygen = v.oxygenSaturation ?? v.oxygen ?? 0;
  const temperature = v.temperature || 0;
  const heartRate = v.heartRate || 0;

  // Vital signs based recommendations
  if (bpSystolic > 160) {
    recommendations.push('Administer antihypertensive medication per protocol');
  }
  if (heartRate > 110) {
    recommendations.push('Monitor cardiac rhythm continuously; consider cardiology consult');
  }
  if (oxygen < 90) {
    recommendations.push('Initiate supplemental oxygen therapy immediately');
  }
  if (temperature > 38.5) {
    recommendations.push('Administer antipyretics and consider broad-spectrum antibiotics');
  }

  // Medication related
  const medicationsLength = patient.medications?.length || 0;
  if (medicationsLength === 0) {
    recommendations.push('Review and order appropriate medications for patient conditions');
  }

  // Age-based
  if (patient.age > 80) {
    recommendations.push('Increased fall risk; implement fall prevention protocols');
  }

  // Condition-based
  const conditions = patient.conditions || [];
  if (conditions.includes('Diabetes')) {
    recommendations.push('Monitor blood glucose levels; adjust insulin/medication as needed');
  }

  return recommendations.length > 0 ? recommendations : ['Continue current treatment plan. Patient stable.'];
};

// ============ 4. SMART NURSE ASSIGNMENT AI ============
/**
 * Score system for nurse assignment recommendation
 * Score = (Skill match * 0.4) + (Availability * 0.3) + (Workload inverse * 0.3)
 */
export interface NurseMatchScore {
  nurse: User;
  totalScore: number;
  skillMatch: number;
  availability: number;
  workloadInverse: number;
  recommendation: string;
}

export const generateSmartNurseAssignment = (
  task: Task,
  nurses: User[],
  nurseWorkloads: Record<string, number> = {}
): NurseMatchScore | null => {
  if (nurses.length === 0) return null;

  // Define skill requirements based on task
  const skillKeywords: Record<string, string[]> = {
    'critical': ['critical care', 'icu', 'emergency'],
    'high': ['advanced', 'experienced'],
    'medium': ['general', 'standard'],
    'low': ['any']
  };

  const requiredSkills = skillKeywords[task.priority] || ['general'];

  const scores: NurseMatchScore[] = nurses.map(nurse => {
    // 1. Skill Match (0-100): Check if nurse specialization matches task
    const nurseSpecialization = (nurse.specialization || '').toLowerCase();
    const skillMatch = requiredSkills.some(skill => nurseSpecialization.includes(skill)) ? 90 : 50;

    // 2. Availability (0-100): Simulate based on current workload
    const currentWorkload = nurseWorkloads[nurse.id] || Math.random() * 80;
    const availability = Math.max(0, 100 - currentWorkload);

    // 3. Workload Inverse (0-100): Less workload = higher score
    const workloadInverse = Math.max(0, 100 - currentWorkload);

    // Calculate weighted score
    const totalScore = (skillMatch * 0.4) + (availability * 0.3) + (workloadInverse * 0.3);

    return {
      nurse,
      totalScore: Math.round(totalScore),
      skillMatch: Math.round(skillMatch),
      availability: Math.round(availability),
      workloadInverse: Math.round(workloadInverse),
      recommendation: ''
    };
  });

  // Sort by total score (descending) and get best match
  scores.sort((a, b) => b.totalScore - a.totalScore);
  const bestMatch = scores[0];

  // Generate recommendation
  const reasonParts: string[] = [];
  if (bestMatch.skillMatch >= 80) reasonParts.push('Excellent skill match');
  else if (bestMatch.skillMatch >= 50) reasonParts.push('Good skill match');
  
  if (bestMatch.availability >= 70) reasonParts.push('Available');
  else if (bestMatch.availability >= 40) reasonParts.push('Moderately available');
  
  bestMatch.recommendation = reasonParts.join(', ') || 'Best available match';

  return bestMatch;
};

// ============ SMART TASK MATCHING ============
export interface TaskMatchResult {
  score: number;
  reason: string;
  estimatedTime: number;
  confidence: number;
}

export const matchTaskToNurse = (task: Task, nurses: User[]): { nurse: User; match: TaskMatchResult } | null => {
  const assignment = generateSmartNurseAssignment(task, nurses);
  
  if (!assignment) return null;

  return {
    nurse: assignment.nurse,
    match: {
      score: assignment.totalScore,
      reason: assignment.recommendation,
      estimatedTime: 15 + Math.floor(Math.random() * 45),
      confidence: 0.85
    }
  };
};

// ============ 5. AI HANDOFF SUMMARY GENERATOR ============
/**
 * Generate comprehensive handoff summary using dynamic patient data
 * Creates a paragraph summary for shift transitions
 */
export const generateAIHandoffSummary = (
  patients: Patient[],
  pendingTasks: Task[],
  completedTasks: Task[] = [],
  emergencies: number = 0
): { summary: string; stats: Record<string, number>; recommendations: string[] } => {
  const stats: Record<string, number> = {
    totalPatients: patients.length,
    criticalPatients: 0,
    moderatePatients: 0,
    stablePatients: 0,
    pendingTasks: pendingTasks.length,
    completedTasks: completedTasks.length,
    emergencies: emergencies
  };

  // Analyze patient statuses
  const criticalPatients: Patient[] = [];
  const moderatePatients: Patient[] = [];
  
  patients.forEach(patient => {
    const risk = calculateDynamicRiskScore(patient);
    if (risk.level === 'Critical') {
      stats.criticalPatients += 1;
      criticalPatients.push(patient);
    } else if (risk.level === 'Moderate') {
      stats.moderatePatients += 1;
      moderatePatients.push(patient);
    } else {
      stats.stablePatients += 1;
    }
  });

  // Generate handoff narrative
  const criticalNames = criticalPatients.map(p => p.name).join(', ');
  const moderateNames = moderatePatients.map(p => p.name).join(', ');
  
  let summary = `SHIFT HANDOFF SUMMARY: `;
  summary += `Currently managing ${stats.totalPatients} patients. `;
  
  if (stats.criticalPatients > 0) {
    summary += `${stats.criticalPatients} CRITICAL patients requiring close monitoring: ${criticalNames}. `;
  }
  
  if (stats.moderatePatients > 0) {
    summary += `${stats.moderatePatients} patients with moderate acuity: ${moderateNames}. `;
  }
  
  if (stats.stablePatients > 0) {
    summary += `${stats.stablePatients} stable patients on routine care. `;
  }
  
  summary += `${stats.pendingTasks} pending tasks requiring completion. `;
  summary += `${stats.completedTasks} tasks completed this shift. `;
  
  if (emergencies > 0) {
    summary += `${emergencies} emergency events recorded. `;
  }

  // Generate key recommendations
  const recommendations: string[] = [];
  
  if (stats.criticalPatients > 0) {
    recommendations.push('Prioritize continuous monitoring of critical patients');
    recommendations.push('Ensure physician accessibility for critical cases');
  }
  
  if (stats.pendingTasks > 5) {
    recommendations.push('High task load - prioritize urgent procedures');
  }
  
  if (emergencies > 2) {
    recommendations.push('Multiple emergencies reported - stay alert for further deterioration');
  }

  if (recommendations.length === 0) {
    recommendations.push('Maintain current care protocols');
    recommendations.push('Continue routine monitoring and documentation');
  }

  return {
    summary,
    stats,
    recommendations
  };
};

// ============ DIAGNOSTIC SUGGESTIONS ============
export const generateDiagnosticSuggestions = (patient: any): Array<{ test: string; priority: string; reason: string }> => {
  const suggestions: Array<{ test: string; priority: string; reason: string }> = [];
  const v = patient.vitals || patient.vital;

  if (!v) return [];

  // Parse blood pressure
  let bpSystolic = 120;
  if (typeof v.bloodPressure === 'string') {
    const [sys] = v.bloodPressure.split('/').map(Number);
    bpSystolic = sys || 120;
  } else if (v.bloodPressure?.systolic !== undefined) {
    bpSystolic = v.bloodPressure.systolic;
  }

  const oxygen = v.oxygenSaturation ?? v.oxygen ?? 0;
  const temperature = v.temperature || 0;

  // Vital sign based suggestions
  if (bpSystolic > 140) {
    suggestions.push({
      test: 'ECG',
      priority: 'high',
      reason: 'Elevated blood pressure requires cardiac assessment'
    });
  }

  if (oxygen < 94) {
    suggestions.push({
      test: 'Chest X-ray',
      priority: 'high',
      reason: 'Low oxygen saturation suggests respiratory involvement'
    });
    suggestions.push({
      test: 'Arterial Blood Gas',
      priority: 'high',
      reason: 'Assessment of oxygen and CO2 levels'
    });
  }

  if (temperature > 38) {
    suggestions.push({
      test: 'Complete Blood Count',
      priority: 'high',
      reason: 'Elevated temperature indicates possible infection'
    });
    suggestions.push({
      test: 'Blood Culture',
      priority: 'high',
      reason: 'Identify causative organism if infection suspected'
    });
  }

  // Default tests
  if (suggestions.length < 2) {
    suggestions.push(
      {
        test: 'Comprehensive Metabolic Panel',
        priority: 'medium',
        reason: 'Routine assessment of organ function'
      },
      {
        test: 'Urinalysis',
        priority: 'medium',
        reason: 'Screen for urinary abnormalities'
      }
    );
  }

  return suggestions;
};

// ============ PREDICTIVE ANALYTICS ============
export const predictPatientOutcome = (patient: Patient): { outlook: string; timeline: string; interventions: string[] } => {
  const riskScore = getPatientRiskScore(patient);

  let outlook = 'Positive recovery expected';
  let timeline = '7-10 days';
  const interventions: string[] = [];

  if (riskScore >= 80) {
    outlook = 'Critical condition. Intensive intervention required.';
    timeline = '24-48 hours critical phase';
    interventions.push('Continuous ICU monitoring', 'Multiple specialist consultations', 'Consider advanced life support');
  } else if (riskScore >= 60) {
    outlook = 'Recovery possible with aggressive treatment';
    timeline = '3-5 days stabilization phase';
    interventions.push('Daily specialist reviews', 'Intensive medication management', 'Frequent vital sign monitoring');
  } else if (riskScore >= 40) {
    outlook = 'Good recovery expected with standard care';
    timeline = '5-7 days';
    interventions.push('Regular monitoring', 'Medication compliance', 'Physical therapy as tolerated');
  }

  if (patient.age > 75) {
    interventions.push('Enhanced fall prevention', 'Nutritional support');
  }

  return { outlook, timeline, interventions };
};

// ============ ALERT GENERATION ============
export const generateAlerts = (patient: any): Array<{ severity: 'critical' | 'warning' | 'info'; message: string }> => {
  const alerts: Array<{ severity: 'critical' | 'warning' | 'info'; message: string }> = [];
  const v = patient.vitals || patient.vital;

  if (!v) return alerts;

  // Parse blood pressure
  let bpSystolic = 120;
  let bpDiastolic = 80;
  if (typeof v.bloodPressure === 'string') {
    const [sys, dia] = v.bloodPressure.split('/').map(Number);
    bpSystolic = sys || 120;
    bpDiastolic = dia || 80;
  } else if (v.bloodPressure?.systolic !== undefined) {
    bpSystolic = v.bloodPressure.systolic;
    bpDiastolic = v.bloodPressure.diastolic;
  }

  const oxygen = v.oxygenSaturation ?? v.oxygen ?? 0;
  const temperature = v.temperature || 0;
  const heartRate = v.heartRate || 0;

  // Critical alerts
  if (bpSystolic > 180 || bpDiastolic > 120) {
    alerts.push({
      severity: 'critical',
      message: `CRITICAL: Hypertensive crisis detected (${bpSystolic}/${bpDiastolic})`
    });
  }

  if (heartRate > 130 || heartRate < 40) {
    alerts.push({
      severity: 'critical',
      message: `CRITICAL: Abnormal heart rate detected (${heartRate} bpm)`
    });
  }

  if (oxygen < 85) {
    alerts.push({
      severity: 'critical',
      message: `CRITICAL: Severe hypoxemia (O2: ${oxygen.toFixed(1)}%)`
    });
  }

  // Warning alerts
  if (bpSystolic > 160) {
    alerts.push({
      severity: 'warning',
      message: `WARNING: Elevated blood pressure (${bpSystolic}/${bpDiastolic})`
    });
  }

  if (oxygen < 92) {
    alerts.push({
      severity: 'warning',
      message: `WARNING: Low oxygen saturation (${oxygen.toFixed(1)}%)`
    });
  }

  if (temperature > 39 || temperature < 35) {
    alerts.push({
      severity: 'warning',
      message: `WARNING: Abnormal temperature (${temperature.toFixed(1)}°C)`
    });
  }

  // Info alerts
  const medicationsLength = patient.medications?.length || 0;
  if (medicationsLength === 0) {
    alerts.push({
      severity: 'info',
      message: 'Patient has no active medications on record'
    });
  }

  return alerts;
};

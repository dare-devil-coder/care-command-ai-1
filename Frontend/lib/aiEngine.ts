// Advanced AI Engine for CareCommand AI
// Provides risk scoring, cognitive load analysis, handoff summaries, and nurse recommendations

import { Patient, Task, User, VitalSigns } from './schemas';

// ============ RISK SCORING ============

export interface RiskScore {
  score: number;
  level: 'low' | 'medium' | 'high' | 'critical';
  factors: string[];
  recommendation: string;
}

/**
 * Calculate patient risk score based on vital signs
 * Critical if: O2 < 90 OR Temp > 39 OR HR > 110
 */
export function calculateRiskScore(vitals: VitalSigns): RiskScore {
  let score = 0;
  const factors: string[] = [];

  // Oxygen Saturation - Critical Factor
  if (vitals.oxygenSaturation < 90) {
    score += 40;
    factors.push('CRITICAL: Severe hypoxemia (O₂ < 90%)');
  } else if (vitals.oxygenSaturation < 92) {
    score += 25;
    factors.push('Low oxygen saturation');
  } else if (vitals.oxygenSaturation < 95) {
    score += 10;
    factors.push('Borderline oxygen levels');
  }

  // Temperature - Critical Factor
  if (vitals.temperature > 39) {
    score += 35;
    factors.push('CRITICAL: High fever (> 39°C)');
  } else if (vitals.temperature > 38.5) {
    score += 20;
    factors.push('Elevated temperature');
  } else if (vitals.temperature < 36) {
    score += 15;
    factors.push('Hypothermia risk');
  }

  // Heart Rate - Critical Factor
  if (vitals.heartRate > 110) {
    score += 35;
    factors.push('CRITICAL: Tachycardia (HR > 110)');
  } else if (vitals.heartRate > 100) {
    score += 20;
    factors.push('Elevated heart rate');
  } else if (vitals.heartRate < 50) {
    score += 25;
    factors.push('Bradycardia detected');
  }

  // Blood Pressure
  if (vitals.bloodPressure.systolic > 180 || vitals.bloodPressure.diastolic > 120) {
    score += 30;
    factors.push('Hypertensive crisis');
  } else if (vitals.bloodPressure.systolic > 160 || vitals.bloodPressure.diastolic > 100) {
    score += 20;
    factors.push('Stage 2 hypertension');
  } else if (vitals.bloodPressure.systolic < 90 || vitals.bloodPressure.diastolic < 60) {
    score += 25;
    factors.push('Hypotension detected');
  }

  // Respiratory Rate
  if (vitals.respiratoryRate > 24) {
    score += 15;
    factors.push('Tachypnea (rapid breathing)');
  } else if (vitals.respiratoryRate < 12) {
    score += 15;
    factors.push('Bradypnea (slow breathing)');
  }

  // Blood Glucose (if available)
  if (vitals.bloodGlucose) {
    if (vitals.bloodGlucose > 250) {
      score += 20;
      factors.push('Severe hyperglycemia');
    } else if (vitals.bloodGlucose < 70) {
      score += 25;
      factors.push('Hypoglycemia risk');
    }
  }

  // Determine risk level
  let level: 'low' | 'medium' | 'high' | 'critical';
  let recommendation: string;

  if (score >= 80 || vitals.oxygenSaturation < 90 || vitals.temperature > 39 || vitals.heartRate > 110) {
    level = 'critical';
    recommendation = 'IMMEDIATE intervention required. Notify physician and prepare for emergency response.';
  } else if (score >= 60) {
    level = 'high';
    recommendation = 'Urgent attention needed. Increase monitoring frequency and notify attending physician.';
  } else if (score >= 40) {
    level = 'medium';
    recommendation = 'Enhanced monitoring recommended. Review treatment plan and vital trends.';
  } else {
    level = 'low';
    recommendation = 'Continue routine monitoring. Patient stable under current care plan.';
  }

  return {
    score: Math.min(100, Math.max(0, score)),
    level,
    factors: factors.length > 0 ? factors : ['All vitals within normal range'],
    recommendation
  };
}

// ============ COGNITIVE LOAD ANALYSIS ============

export interface CognitiveLoad {
  score: number;
  level: 'low' | 'moderate' | 'high' | 'overload';
  factors: {
    criticalPatients: number;
    pendingMissions: number;
    emergencyFrequency: number;
  };
  recommendation: string;
  needsHelp: boolean;
}

/**
 * Calculate nurse cognitive load based on workload factors
 * Score based on: Critical patients count, Pending missions, Emergency frequency
 */
export function calculateCognitiveLoad(nurseData: {
  assignedPatients: Patient[];
  assignedTasks: Task[];
  recentEmergencies?: number;
}): CognitiveLoad {
  let score = 0;
  
  // Count critical patients
  const criticalPatients = nurseData.assignedPatients.filter(p => {
    const risk = calculateRiskScore(p.vitals);
    return risk.level === 'critical' || risk.level === 'high';
  }).length;

  // Count pending missions
  const pendingMissions = nurseData.assignedTasks.filter(
    t => t.status === 'pending' || t.status === 'in-progress'
  ).length;

  // Emergency frequency (default to 0 if not provided)
  const emergencyFrequency = nurseData.recentEmergencies || 0;

  // Calculate score components
  const criticalScore = criticalPatients * 25; // Each critical patient adds 25 points
  const missionScore = Math.min(pendingMissions * 5, 40); // Cap at 40 points
  const emergencyScore = Math.min(emergencyFrequency * 10, 35); // Cap at 35 points

  score = criticalScore + missionScore + emergencyScore;

  // Determine cognitive load level
  let level: 'low' | 'moderate' | 'high' | 'overload';
  let recommendation: string;
  let needsHelp: boolean;

  if (score >= 80) {
    level = 'overload';
    recommendation = 'CRITICAL: Nurse is overloaded. Immediate assistance required. Redistribute tasks.';
    needsHelp = true;
  } else if (score >= 60) {
    level = 'high';
    recommendation = 'High workload detected. Consider providing support or redistributing non-urgent tasks.';
    needsHelp = true;
  } else if (score >= 40) {
    level = 'moderate';
    recommendation = 'Moderate workload. Monitor situation and be ready to provide support if needed.';
    needsHelp = false;
  } else {
    level = 'low';
    recommendation = 'Workload is manageable. Nurse available to assist others if needed.';
    needsHelp = false;
  }

  return {
    score: Math.min(100, score),
    level,
    factors: {
      criticalPatients,
      pendingMissions,
      emergencyFrequency
    },
    recommendation,
    needsHelp
  };
}

// ============ HANDOFF SUMMARY GENERATION ============

export interface HandoffSummary {
  timestamp: string;
  totalPatients: number;
  criticalCount: number;
  highRiskCount: number;
  pendingTasks: number;
  keyAlerts: string[];
  patientSummaries: Array<{
    name: string;
    id: string;
    riskLevel: string;
    keyIssues: string[];
    pendingActions: string[];
  }>;
  recommendations: string[];
}

/**
 * Generate comprehensive handoff summary for shift change
 */
export function generateHandoffSummary(patients: Patient[], tasks?: Task[]): HandoffSummary {
  const timestamp = new Date().toLocaleString();
  const keyAlerts: string[] = [];
  const patientSummaries = [];
  
  let criticalCount = 0;
  let highRiskCount = 0;

  // Analyze each patient
  for (const patient of patients) {
    const risk = calculateRiskScore(patient.vitals);
    const earlyWarnings = detectEarlyWarning(patient.vitals);
    
    if (risk.level === 'critical') criticalCount++;
    if (risk.level === 'high') highRiskCount++;

    const keyIssues: string[] = [];
    const pendingActions: string[] = [];

    // Identify key issues
    if (risk.level === 'critical' || risk.level === 'high') {
      keyIssues.push(`${risk.level.toUpperCase()} risk: ${risk.score}%`);
      keyIssues.push(...risk.factors.slice(0, 2));
    }

    if (earlyWarnings.hasWarnings) {
      keyIssues.push(...earlyWarnings.warnings.slice(0, 2));
    }

    if (patient.allergies.length > 0) {
      keyIssues.push(`Allergies: ${patient.allergies.join(', ')}`);
    }

    // Find pending tasks for this patient
    if (tasks) {
      const patientTasks = tasks.filter(
        t => t.patientId === patient.id && (t.status === 'pending' || t.status === 'in-progress')
      );
      patientTasks.forEach(task => {
        pendingActions.push(`${task.priority.toUpperCase()}: ${task.title}`);
      });
    }

    // Add to key alerts if critical
    if (risk.level === 'critical') {
      keyAlerts.push(`${patient.name}: CRITICAL - ${risk.factors[0]}`);
    }

    patientSummaries.push({
      name: patient.name,
      id: patient.medicalRecordNumber,
      riskLevel: risk.level,
      keyIssues: keyIssues.length > 0 ? keyIssues : ['Stable'],
      pendingActions: pendingActions.length > 0 ? pendingActions : ['No pending actions']
    });
  }

  // Sort by risk level (critical first)
  patientSummaries.sort((a, b) => {
    const order = { critical: 0, high: 1, medium: 2, low: 3 };
    return order[a.riskLevel as keyof typeof order] - order[b.riskLevel as keyof typeof order];
  });

  // Generate recommendations
  const recommendations: string[] = [];
  if (criticalCount > 0) {
    recommendations.push(`${criticalCount} patient(s) require immediate attention`);
  }
  if (highRiskCount > 0) {
    recommendations.push(`${highRiskCount} patient(s) need close monitoring`);
  }
  
  const pendingTaskCount = tasks?.filter(t => t.status === 'pending').length || 0;
  if (pendingTaskCount > 5) {
    recommendations.push(`${pendingTaskCount} pending tasks - consider prioritization`);
  }

  if (recommendations.length === 0) {
    recommendations.push('All patients stable. Continue routine monitoring.');
  }

  return {
    timestamp,
    totalPatients: patients.length,
    criticalCount,
    highRiskCount,
    pendingTasks: pendingTaskCount,
    keyAlerts: keyAlerts.length > 0 ? keyAlerts : ['No critical alerts'],
    patientSummaries,
    recommendations
  };
}

// ============ NURSE HELP RECOMMENDATION ============

export interface NurseRecommendation {
  nurse: User;
  score: number;
  breakdown: {
    skillMatch: number;
    availability: number;
    inverseWorkload: number;
  };
  reason: string;
  confidence: number;
}

/**
 * Recommend best nurse to help with a task
 * Score = (SkillMatch * 40) + (Availability * 30) + (InverseWorkload * 30)
 */
export function recommendNurseForHelp(
  nurses: User[],
  taskType: string,
  nurseWorkloads?: Map<string, CognitiveLoad>
): NurseRecommendation | null {
  if (nurses.length === 0) return null;

  const recommendations: NurseRecommendation[] = [];

  for (const nurse of nurses) {
    // Calculate skill match (0-100)
    let skillMatch = 50; // Base score
    
    // Boost for relevant specialization
    if (nurse.specialization) {
      const spec = nurse.specialization.toLowerCase();
      const task = taskType.toLowerCase();
      
      if (task.includes('cardiac') && spec.includes('cardio')) skillMatch = 95;
      else if (task.includes('respiratory') && spec.includes('pulmonary')) skillMatch = 95;
      else if (task.includes('medication') || task.includes('vitals')) skillMatch = 80;
      else if (task.includes('emergency') || task.includes('critical')) skillMatch = 85;
      else skillMatch = 70;
    }

    // Calculate availability (0-100)
    // Simulated based on time of day and random factor
    const hour = new Date().getHours();
    let availability = 70;
    if (hour >= 8 && hour <= 16) availability = 85; // Day shift
    else if (hour >= 16 && hour <= 24) availability = 75; // Evening shift
    else availability = 60; // Night shift
    
    // Add some randomness for realism
    availability += Math.random() * 20 - 10;
    availability = Math.max(0, Math.min(100, availability));

    // Calculate inverse workload (0-100)
    let inverseWorkload = 70; // Default
    
    if (nurseWorkloads && nurseWorkloads.has(nurse.id)) {
      const workload = nurseWorkloads.get(nurse.id)!;
      // Inverse: high workload = low score
      inverseWorkload = 100 - workload.score;
    } else {
      // Simulate workload if not provided
      inverseWorkload = 50 + Math.random() * 40;
    }

    // Calculate final score: (SkillMatch * 40) + (Availability * 30) + (InverseWorkload * 30)
    const score = (skillMatch * 0.4) + (availability * 0.3) + (inverseWorkload * 0.3);

    // Generate reason
    let reason = '';
    if (score >= 80) {
      reason = 'Excellent match: High skill level, available, and low workload';
    } else if (score >= 70) {
      reason = 'Good match: Suitable skills and reasonable availability';
    } else if (score >= 60) {
      reason = 'Acceptable match: Can assist but may have competing priorities';
    } else {
      reason = 'Limited availability: Consider as backup option';
    }

    // Calculate confidence (based on data quality)
    const confidence = nurseWorkloads ? 0.85 : 0.65;

    recommendations.push({
      nurse,
      score: Math.round(score),
      breakdown: {
        skillMatch: Math.round(skillMatch),
        availability: Math.round(availability),
        inverseWorkload: Math.round(inverseWorkload)
      },
      reason,
      confidence
    });
  }

  // Sort by score (highest first)
  recommendations.sort((a, b) => b.score - a.score);

  return recommendations[0];
}

// ============ EARLY WARNING DETECTION ============

export interface EarlyWarning {
  hasWarnings: boolean;
  warnings: string[];
  severity: 'none' | 'mild' | 'moderate' | 'severe';
  recommendedActions: string[];
}

/**
 * Detect early warning signs from vital trends
 */
export function detectEarlyWarning(vitals: VitalSigns): EarlyWarning {
  const warnings: string[] = [];
  const actions: string[] = [];

  // Check for concerning trends
  
  // Oxygen trending down
  if (vitals.oxygenSaturation < 94 && vitals.oxygenSaturation >= 90) {
    warnings.push('Oxygen saturation trending toward critical threshold');
    actions.push('Prepare supplemental oxygen and monitor closely');
  }

  // Temperature rising
  if (vitals.temperature > 38 && vitals.temperature <= 39) {
    warnings.push('Temperature elevation detected - monitor for infection');
    actions.push('Consider antipyretics and blood cultures if fever persists');
  }

  // Heart rate elevation
  if (vitals.heartRate > 100 && vitals.heartRate <= 110) {
    warnings.push('Heart rate elevated - assess for pain, anxiety, or cardiac issues');
    actions.push('Check patient comfort and consider ECG if sustained');
  }

  // Blood pressure concerns
  if (vitals.bloodPressure.systolic > 140 && vitals.bloodPressure.systolic <= 160) {
    warnings.push('Blood pressure trending upward');
    actions.push('Review antihypertensive medications and notify physician');
  }

  if (vitals.bloodPressure.systolic < 100 && vitals.bloodPressure.systolic >= 90) {
    warnings.push('Blood pressure on lower end - monitor for hypotension');
    actions.push('Assess for dizziness, ensure adequate hydration');
  }

  // Respiratory rate
  if (vitals.respiratoryRate > 20 && vitals.respiratoryRate <= 24) {
    warnings.push('Respiratory rate slightly elevated');
    actions.push('Assess breathing pattern and oxygen needs');
  }

  // Determine severity
  let severity: 'none' | 'mild' | 'moderate' | 'severe';
  if (warnings.length === 0) {
    severity = 'none';
  } else if (warnings.length <= 1) {
    severity = 'mild';
  } else if (warnings.length <= 2) {
    severity = 'moderate';
  } else {
    severity = 'severe';
  }

  return {
    hasWarnings: warnings.length > 0,
    warnings: warnings.length > 0 ? warnings : ['No early warning signs detected'],
    severity,
    recommendedActions: actions.length > 0 ? actions : ['Continue routine monitoring']
  };
}

// ============ UTILITY FUNCTIONS ============

/**
 * Get color class for risk level
 */
export function getRiskColorClass(level: string): string {
  const colors: Record<string, string> = {
    critical: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300',
    high: 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300',
    medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300',
    low: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
  };
  return colors[level] || colors.low;
}

/**
 * Get color class for cognitive load level
 */
export function getCognitiveLoadColorClass(level: string): string {
  const colors: Record<string, string> = {
    overload: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300',
    high: 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300',
    moderate: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300',
    low: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
  };
  return colors[level] || colors.low;
}

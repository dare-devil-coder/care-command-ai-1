// Simulated AI functions for risk prediction, recommendations, and smart matching
import { Patient, Task, User } from './schemas';
import { getPatientRiskScore, getRiskLevel } from './data';
import { calculateRiskScore as calculateRiskScoreNew } from './aiEngine';

// ============ RISK PREDICTION ============
export const calculatePatientRisk = (patient: Patient) => {
  // Use new AI engine for risk calculation
  const riskData = calculateRiskScoreNew(patient.vitals);
  
  return {
    score: riskData.score,
    level: riskData.level,
    reasons: riskData.factors,
    recommendation: riskData.recommendation,
    lastUpdate: new Date().toLocaleTimeString()
  };
};

const getRecommendationForRisk = (level: string): string => {
  const recommendations: Record<string, string> = {
    critical: 'Immediate intervention required. Consider ICU admission and continuous monitoring.',
    high: 'Close monitoring recommended. Schedule urgent consultation with attending physician.',
    medium: 'Standard monitoring protocols. Schedule follow-up within 24 hours.',
    low: 'Routine care appropriate. Continue regular monitoring schedule.'
  };
  return recommendations[level] || '';
};

// ============ CLINICAL RECOMMENDATIONS ============
export const generateClinicalRecommendations = (patient: Patient): string[] => {
  const recommendations: string[] = [];
  const v = patient.vitals;

  // Vital signs based recommendations
  if (v.bloodPressure.systolic > 160) {
    recommendations.push('Administer antihypertensive medication per protocol');
  }
  if (v.heartRate > 110) {
    recommendations.push('Monitor cardiac rhythm continuously; consider cardiology consult');
  }
  if (v.oxygenSaturation < 90) {
    recommendations.push('Initiate supplemental oxygen therapy immediately');
  }
  if (v.temperature > 38.5) {
    recommendations.push('Administer antipyretics and consider broad-spectrum antibiotics');
  }
  if (v.respiratoryRate > 24) {
    recommendations.push('Assess breathing difficulty; prepare for respiratory support if needed');
  }

  // Medication related
  if (patient.medications.length === 0) {
    recommendations.push('Review and order appropriate medications for patient conditions');
  }

  // Age-based
  if (patient.age > 80) {
    recommendations.push('Increased fall risk; implement fall prevention protocols');
  }

  // Condition-based
  if (patient.conditions.includes('Diabetes')) {
    recommendations.push('Monitor blood glucose levels; adjust insulin/medication as needed');
  }

  return recommendations.length > 0 ? recommendations : ['Continue current treatment plan. Patient stable.'];
};

// ============ SMART TASK MATCHING ============
export interface TaskMatchResult {
  score: number;
  reason: string;
  estimatedTime: number;
  confidence: number;
}

export const matchTaskToNurse = (task: Task, nurses: User[]): { nurse: User; match: TaskMatchResult } | null => {
  if (nurses.length === 0) return null;

  const matches = nurses.map(nurse => {
    let score = 50; // Base score
    const reasons: string[] = [];

    // Simple rules-based matching
    if (task.priority === 'critical') score += 30;
    if (task.priority === 'high') score += 20;

    // Simulate workload consideration
    const simulatedWorkload = Math.floor(Math.random() * 100);
    score += Math.max(0, 40 - simulatedWorkload / 2);
    if (simulatedWorkload < 50) reasons.push('Low workload');

    // Add some randomness for realistic results
    score += Math.floor(Math.random() * 20) - 10;

    return {
      nurse,
      score: Math.min(100, Math.max(0, score)),
      reasons,
      estimatedTime: 15 + Math.floor(Math.random() * 45),
      confidence: 0.7 + Math.random() * 0.3
    };
  });

  // Sort by score and return best match
  matches.sort((a, b) => b.score - a.score);
  const best = matches[0];

  return {
    nurse: best.nurse,
    match: {
      score: Math.round(best.score),
      reason: best.reasons.join('; ') || 'Optimal availability and skill match',
      estimatedTime: best.estimatedTime,
      confidence: parseFloat(best.confidence.toFixed(2))
    }
  };
};

// ============ DIAGNOSTIC SUGGESTIONS ============
export const generateDiagnosticSuggestions = (patient: Patient): Array<{ test: string; priority: string; reason: string }> => {
  const suggestions: Array<{ test: string; priority: string; reason: string }> = [];
  const v = patient.vitals;

  // Vital sign based suggestions
  if (v.bloodPressure.systolic > 140) {
    suggestions.push({
      test: 'ECG',
      priority: 'high',
      reason: 'Elevated blood pressure requires cardiac assessment'
    });
  }

  if (v.oxygenSaturation < 94) {
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

  if (v.temperature > 38) {
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
export const generateAlerts = (patient: Patient): Array<{ severity: 'critical' | 'warning' | 'info'; message: string }> => {
  const alerts: Array<{ severity: 'critical' | 'warning' | 'info'; message: string }> = [];
  const v = patient.vitals;

  // Critical alerts
  if (v.bloodPressure.systolic > 180 || v.bloodPressure.diastolic > 120) {
    alerts.push({
      severity: 'critical',
      message: `CRITICAL: Hypertensive crisis detected (${v.bloodPressure.systolic}/${v.bloodPressure.diastolic})`
    });
  }

  if (v.heartRate > 130 || v.heartRate < 40) {
    alerts.push({
      severity: 'critical',
      message: `CRITICAL: Abnormal heart rate detected (${v.heartRate} bpm)`
    });
  }

  if (v.oxygenSaturation < 85) {
    alerts.push({
      severity: 'critical',
      message: `CRITICAL: Severe hypoxemia (O2: ${v.oxygenSaturation.toFixed(1)}%)`
    });
  }

  // Warning alerts
  if (v.bloodPressure.systolic > 160) {
    alerts.push({
      severity: 'warning',
      message: `WARNING: Elevated blood pressure (${v.bloodPressure.systolic}/${v.bloodPressure.diastolic})`
    });
  }

  if (v.oxygenSaturation < 92) {
    alerts.push({
      severity: 'warning',
      message: `WARNING: Low oxygen saturation (${v.oxygenSaturation.toFixed(1)}%)`
    });
  }

  if (v.temperature > 39 || v.temperature < 35) {
    alerts.push({
      severity: 'warning',
      message: `WARNING: Abnormal temperature (${v.temperature.toFixed(1)}°C)`
    });
  }

  // Info alerts
  if (patient.medications.length === 0) {
    alerts.push({
      severity: 'info',
      message: 'Patient has no active medications on record'
    });
  }

  return alerts;
};

import { Patient, Task } from './mock-data';

export interface AIInsight {
  id: string;
  type: 'risk' | 'recommendation' | 'alert' | 'trend';
  title: string;
  message: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  actionable: boolean;
  suggestedAction?: string;
}

/**
 * Simulated AI service that generates health insights
 * In production, this would call a real AI/ML model
 */
export class AIInsightsService {
  /**
   * Analyze patient health and generate risk assessment
   */
  static analyzePatientRisk(patient: Patient): AIInsight[] {
    const insights: AIInsight[] = [];

    // Blood pressure analysis
    const bpParts = patient.vitalSigns.bloodPressure.split('/');
    const systolic = parseInt(bpParts[0]);
    const diastolic = parseInt(bpParts[1]);

    if (systolic > 140 || diastolic > 90) {
      insights.push({
        id: `bp-${patient.id}`,
        type: 'alert',
        title: 'Elevated Blood Pressure',
        message: `Patient ${patient.name} has elevated blood pressure (${patient.vitalSigns.bloodPressure}). Recommend immediate review and potential medication adjustment.`,
        severity: systolic > 160 ? 'critical' : 'high',
        actionable: true,
        suggestedAction: 'Schedule urgent consultation with cardiologist',
      });
    }

    // Heart rate analysis
    if (patient.vitalSigns.heartRate > 100) {
      insights.push({
        id: `hr-${patient.id}`,
        type: 'alert',
        title: 'Tachycardia Detected',
        message: `Heart rate is elevated at ${patient.vitalSigns.heartRate} bpm. Monitor for potential cardiac issues or anxiety.`,
        severity: 'medium',
        actionable: true,
        suggestedAction: 'Order ECG and cardiac enzyme tests',
      });
    } else if (patient.vitalSigns.heartRate < 60) {
      insights.push({
        id: `hr-${patient.id}`,
        type: 'alert',
        title: 'Bradycardia Detected',
        message: `Heart rate is low at ${patient.vitalSigns.heartRate} bpm. Check medication side effects.`,
        severity: 'low',
        actionable: true,
        suggestedAction: 'Review current medication list',
      });
    }

    // Oxygen level analysis
    if (patient.vitalSigns.oxygenLevel < 95) {
      insights.push({
        id: `o2-${patient.id}`,
        type: 'alert',
        title: 'Low Oxygen Saturation',
        message: `SpO2 is below normal range at ${patient.vitalSigns.oxygenLevel}%. May indicate respiratory issues.`,
        severity: patient.vitalSigns.oxygenLevel < 90 ? 'critical' : 'high',
        actionable: true,
        suggestedAction: 'Consider oxygen therapy and respiratory assessment',
      });
    }

    // Allergy warnings
    if (patient.allergies.length > 0) {
      insights.push({
        id: `allergy-${patient.id}`,
        type: 'alert',
        title: 'Critical Allergies on File',
        message: `Patient has documented allergies to: ${patient.allergies.join(', ')}. Ensure all staff are aware before prescribing.`,
        severity: 'critical',
        actionable: true,
        suggestedAction: 'Display prominently in patient record',
      });
    }

    // Condition-based recommendations
    if (patient.conditions.includes('Diabetes') && patient.vitalSigns.heartRate > 90) {
      insights.push({
        id: `diabetes-${patient.id}`,
        type: 'recommendation',
        title: 'Diabetes Management Alert',
        message: 'Patient with diabetes showing elevated heart rate. Recommend blood glucose and HbA1c testing.',
        severity: 'medium',
        actionable: true,
        suggestedAction: 'Order fasting glucose and HbA1c tests',
      });
    }

    // Risk score based recommendations
    if (patient.riskScore >= 8) {
      insights.push({
        id: `high-risk-${patient.id}`,
        type: 'risk',
        title: 'High-Risk Patient',
        message: `Risk score of ${patient.riskScore.toFixed(1)}/10 indicates significant health concern. Recommend intensive monitoring.`,
        severity: 'critical',
        actionable: true,
        suggestedAction: 'Initiate high-risk care protocol',
      });
    }

    return insights;
  }

  /**
   * Generate task recommendations based on patient status
   */
  static generateTaskRecommendations(patient: Patient, existingTasks: Task[]): AIInsight[] {
    const insights: AIInsight[] = [];

    // Check if routine tasks are needed
    const hasVitalCheckToday = existingTasks.some(
      (t) => t.patientId === patient.id && t.type === 'check-vitals'
    );

    if (!hasVitalCheckToday && patient.riskScore >= 5) {
      insights.push({
        id: `task-vitals-${patient.id}`,
        type: 'recommendation',
        title: 'Vital Signs Check Recommended',
        message: `Schedule vital signs check for patient ${patient.name}. High-risk patients benefit from frequent monitoring.`,
        severity: 'high',
        actionable: true,
        suggestedAction: 'Create check-vitals task for nursing staff',
      });
    }

    // Medication follow-up
    const lastCheckup = new Date(patient.lastCheckup);
    const daysSinceCheckup = Math.floor(
      (new Date().getTime() - lastCheckup.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysSinceCheckup > 7) {
      insights.push({
        id: `task-checkup-${patient.id}`,
        type: 'recommendation',
        title: 'Overdue for Follow-up',
        message: `Patient ${patient.name} last checked ${daysSinceCheckup} days ago. Schedule follow-up appointment.`,
        severity: 'medium',
        actionable: true,
        suggestedAction: 'Schedule physician consultation',
      });
    }

    return insights;
  }

  /**
   * Generate staffing recommendations
   */
  static generateStaffingInsights(): AIInsight[] {
    return [
      {
        id: 'staff-optimal',
        type: 'trend',
        title: 'Optimal Staffing Levels',
        message: 'Current staffing distribution meets patient care requirements.',
        severity: 'low',
        actionable: false,
      },
      {
        id: 'shift-balance',
        type: 'recommendation',
        title: 'Shift Coverage Suggestion',
        message: 'Evening shift may benefit from one additional nurse given current patient acuity.',
        severity: 'medium',
        actionable: true,
        suggestedAction: 'Review evening shift assignments',
      },
    ];
  }

  /**
   * Predict patient deterioration risk
   */
  static predictDeterioration(patient: Patient): number {
    let riskFactors = 0;
    const maxRisks = 5;

    // Vital signs assessment
    if (patient.vitalSigns.heartRate > 100 || patient.vitalSigns.heartRate < 50) riskFactors++;
    if (parseInt(patient.vitalSigns.bloodPressure.split('/')[0]) > 140) riskFactors++;
    if (patient.vitalSigns.oxygenLevel < 92) riskFactors++;
    if (patient.vitalSigns.temperature > 100 || patient.vitalSigns.temperature < 95) riskFactors++;

    // Medical history
    if (patient.conditions.includes('Heart Disease') || patient.conditions.includes('Chronic Kidney Disease')) {
      riskFactors++;
    }

    return Math.round((riskFactors / maxRisks) * 100);
  }

  /**
   * Generate medication interaction warnings
   */
  static checkMedicationInteractions(medications: string[]): AIInsight[] {
    const insights: AIInsight[] = [];

    // Simulate checking common interactions
    if (
      medications.includes('Warfarin') &&
      (medications.includes('Aspirin') || medications.includes('NSAIDs'))
    ) {
      insights.push({
        id: 'drug-interaction-1',
        type: 'alert',
        title: 'Drug Interaction Warning',
        message: 'Potential interaction between Warfarin and Aspirin. Increased bleeding risk.',
        severity: 'high',
        actionable: true,
        suggestedAction: 'Review medication with pharmacist',
      });
    }

    return insights;
  }
}

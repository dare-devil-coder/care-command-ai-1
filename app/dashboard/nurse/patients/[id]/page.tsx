'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getPatient, updatePatient } from '@/lib/storage';
import { Patient, VitalSigns } from '@/lib/schemas';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RiskIndicator, RiskAlert } from '@/components/risk-indicator';
import { calculatePatientRisk, generateClinicalRecommendations, generateAlerts } from '@/lib/ai';
import Link from 'next/link';

export default function PatientDetailPage() {
  const params = useParams();
  const patientId = params.id as string;

  const [patient, setPatient] = useState<Patient | null>(null);
  const [editingVitals, setEditingVitals] = useState(false);
  const [vitals, setVitals] = useState<VitalSigns | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const found = getPatient(patientId);
    if (found) {
      setPatient(found);
      setVitals(found.vitals);
    }
    setLoading(false);
  }, [patientId]);

  const handleVitalsUpdate = () => {
    if (patient && vitals) {
      const updated = {
        ...patient,
        vitals: { ...vitals, timestamp: Date.now() }
      };
      updatePatient(updated);
      setPatient(updated);
      setEditingVitals(false);
    }
  };

  if (loading || !patient || !vitals) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const risk = calculatePatientRisk(patient);
  const recommendations = generateClinicalRecommendations(patient);
  const alerts = generateAlerts(patient);
  const criticalAlerts = alerts.filter(a => a.severity === 'critical');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">{patient.name}</h1>
          <p className="text-muted-foreground">MRN: {patient.medicalRecordNumber}</p>
        </div>
        <Link href="/dashboard/nurse/patients">
          <Button variant="outline">Back</Button>
        </Link>
      </div>

      {/* Critical Alerts */}
      {criticalAlerts.length > 0 && (
        <div className="space-y-2">
          {criticalAlerts.map((alert, i) => (
            <div key={i} className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30">
              <p className="font-semibold text-red-900 dark:text-red-300">{alert.message}</p>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-4">
          {/* Demographics */}
          <Card className="glass">
            <CardHeader>
              <CardTitle>Patient Information</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Age</p>
                <p className="font-semibold">{patient.age} years</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Gender</p>
                <p className="font-semibold">{patient.gender}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Blood Type</p>
                <p className="font-semibold">{patient.bloodType}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Admission</p>
                <p className="font-semibold text-xs">
                  {patient.admissionDate ? new Date(patient.admissionDate).toLocaleDateString() : 'N/A'}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Vital Signs */}
          <Card className="glass">
            <CardHeader className="flex justify-between items-center">
              <CardTitle>Vital Signs</CardTitle>
              <Button
                size="sm"
                variant={editingVitals ? 'default' : 'outline'}
                onClick={() => setEditingVitals(!editingVitals)}
              >
                {editingVitals ? 'Done' : 'Edit'}
              </Button>
            </CardHeader>
            <CardContent>
              {!editingVitals ? (
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-white/50 dark:bg-white/5 rounded-lg">
                    <p className="text-xs text-muted-foreground">Blood Pressure</p>
                    <p className="font-bold text-lg">
                      {vitals.bloodPressure.systolic}/{vitals.bloodPressure.diastolic}
                    </p>
                    <p className="text-xs text-muted-foreground">mmHg</p>
                  </div>
                  <div className="p-3 bg-white/50 dark:bg-white/5 rounded-lg">
                    <p className="text-xs text-muted-foreground">Heart Rate</p>
                    <p className="font-bold text-lg">{vitals.heartRate}</p>
                    <p className="text-xs text-muted-foreground">bpm</p>
                  </div>
                  <div className="p-3 bg-white/50 dark:bg-white/5 rounded-lg">
                    <p className="text-xs text-muted-foreground">Temperature</p>
                    <p className="font-bold text-lg">{vitals.temperature.toFixed(1)}°C</p>
                  </div>
                  <div className="p-3 bg-white/50 dark:bg-white/5 rounded-lg">
                    <p className="text-xs text-muted-foreground">O₂ Saturation</p>
                    <p className="font-bold text-lg">{vitals.oxygenSaturation.toFixed(1)}%</p>
                  </div>
                  <div className="p-3 bg-white/50 dark:bg-white/5 rounded-lg">
                    <p className="text-xs text-muted-foreground">Respiratory Rate</p>
                    <p className="font-bold text-lg">{vitals.respiratoryRate}</p>
                  </div>
                  {vitals.bloodGlucose && (
                    <div className="p-3 bg-white/50 dark:bg-white/5 rounded-lg">
                      <p className="text-xs text-muted-foreground">Blood Glucose</p>
                      <p className="font-bold text-lg">{vitals.bloodGlucose} mg/dL</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div>
                    <Label className="text-xs">Systolic BP</Label>
                    <Input
                      type="number"
                      value={vitals.bloodPressure.systolic}
                      onChange={(e) =>
                        setVitals({
                          ...vitals,
                          bloodPressure: {
                            ...vitals.bloodPressure,
                            systolic: parseInt(e.target.value)
                          }
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Diastolic BP</Label>
                    <Input
                      type="number"
                      value={vitals.bloodPressure.diastolic}
                      onChange={(e) =>
                        setVitals({
                          ...vitals,
                          bloodPressure: {
                            ...vitals.bloodPressure,
                            diastolic: parseInt(e.target.value)
                          }
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Heart Rate</Label>
                    <Input
                      type="number"
                      value={vitals.heartRate}
                      onChange={(e) => setVitals({ ...vitals, heartRate: parseInt(e.target.value) })}
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Temperature (°C)</Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={vitals.temperature}
                      onChange={(e) => setVitals({ ...vitals, temperature: parseFloat(e.target.value) })}
                    />
                  </div>
                  <div>
                    <Label className="text-xs">O₂ Saturation (%)</Label>
                    <Input
                      type="number"
                      value={vitals.oxygenSaturation}
                      onChange={(e) => setVitals({ ...vitals, oxygenSaturation: parseFloat(e.target.value) })}
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Respiratory Rate</Label>
                    <Input
                      type="number"
                      value={vitals.respiratoryRate}
                      onChange={(e) => setVitals({ ...vitals, respiratoryRate: parseInt(e.target.value) })}
                    />
                  </div>
                </div>
              )}
              {editingVitals && (
                <Button onClick={handleVitalsUpdate} className="w-full">
                  Update Vitals
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Medical History */}
          <Card className="glass">
            <CardHeader>
              <CardTitle>Medical History</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {patient.conditions.length > 0 && (
                <div>
                  <p className="font-semibold mb-2">Active Conditions</p>
                  <div className="flex flex-wrap gap-2">
                    {patient.conditions.map(c => (
                      <Badge key={c}>{c}</Badge>
                    ))}
                  </div>
                </div>
              )}

              {patient.medications.length > 0 && (
                <div>
                  <p className="font-semibold mb-2">Current Medications</p>
                  <div className="space-y-2">
                    {patient.medications.map(med => (
                      <div key={med.id} className="p-2 bg-white/30 dark:bg-white/5 rounded-lg text-sm">
                        <p className="font-semibold">{med.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {med.dosage} • {med.frequency} • {med.reason}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {patient.allergies.length > 0 && (
                <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30 rounded-lg">
                  <p className="text-sm font-semibold text-red-900 dark:text-red-300 mb-1">Allergies</p>
                  <p className="text-sm text-red-800 dark:text-red-400">{patient.allergies.join(', ')}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Clinical Recommendations */}
          <Card className="glass">
            <CardHeader>
              <CardTitle>Clinical Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {recommendations.map((rec, i) => (
                  <li key={i} className="flex gap-2 text-sm">
                    <span className="text-primary font-bold">•</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Risk Assessment */}
          <Card className="glass">
            <CardHeader>
              <CardTitle className="text-center">Risk Level</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-4">
              <RiskIndicator patient={patient} size="lg" />
              <div className="text-center">
                <p className="font-bold text-lg capitalize">{risk.level}</p>
                <p className="text-sm text-muted-foreground mt-1">{risk.recommendation}</p>
              </div>
            </CardContent>
          </Card>

          {/* Risk Alerts */}
          <RiskAlert patient={patient} />

          {/* Quick Info */}
          <Card className="glass">
            <CardHeader>
              <CardTitle className="text-sm">Quick Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div>
                <p className="text-xs text-muted-foreground">Last Updated</p>
                <p className="font-semibold text-xs">
                  {new Date(patient.lastUpdated).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Primary Doctor</p>
                <p className="font-semibold text-xs">{patient.primaryDoctor}</p>
              </div>
              {patient.notes && (
                <div>
                  <p className="text-xs text-muted-foreground">Notes</p>
                  <p className="font-semibold text-xs">{patient.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

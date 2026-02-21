'use client';

import { useEffect, useState } from 'react';
import { getPatients } from '@/lib/storage';
import { Patient } from '@/lib/schemas';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { calculatePatientRisk, generateClinicalRecommendations } from '@/lib/ai';

export default function DoctorDashboard() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [recommendations, setRecommendations] = useState<string[]>([]);

  useEffect(() => {
    const allPatients = getPatients().filter(p => p.primaryDoctor === 'doctor_001');
    setPatients(allPatients.sort((a, b) => {
      const riskA = calculatePatientRisk(a).score;
      const riskB = calculatePatientRisk(b).score;
      return riskB - riskA; // High risk first
    }));
    
    if (allPatients.length > 0) {
      setSelectedPatient(allPatients[0]);
      setRecommendations(generateClinicalRecommendations(allPatients[0]));
    }
  }, []);

  const handlePatientSelect = (patient: Patient) => {
    setSelectedPatient(patient);
    setRecommendations(generateClinicalRecommendations(patient));
  };

  const getRiskColor = (level: string) => {
    const colors: Record<string, string> = {
      critical: 'bg-red-100 text-red-800',
      high: 'bg-orange-100 text-orange-800',
      medium: 'bg-yellow-100 text-yellow-800',
      low: 'bg-green-100 text-green-800'
    };
    return colors[level] || colors.low;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Doctor Dashboard</h1>
        <p className="text-muted-foreground">Patient management and clinical oversight</p>
      </div>

      {/* Patient Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Patient List */}
        <Card className="glass lg:col-span-1">
          <CardHeader>
            <CardTitle>Patient Queue</CardTitle>
            <CardDescription>Sorted by risk level</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {patients.map((patient) => {
                const risk = calculatePatientRisk(patient);
                return (
                  <button
                    key={patient.id}
                    onClick={() => handlePatientSelect(patient)}
                    className={`w-full p-3 text-left rounded-lg border transition-all ${
                      selectedPatient?.id === patient.id
                        ? 'border-primary bg-primary/10'
                        : 'border-white/20 dark:border-white/10 hover:bg-white/5'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <p className="font-semibold text-sm">{patient.name}</p>
                      <Badge className={getRiskColor(risk.level)} variant="secondary">
                        {risk.score}%
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">Age: {patient.age}</p>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Patient Details */}
        <div className="lg:col-span-2 space-y-4">
          {selectedPatient && (
            <>
              {/* Patient Info */}
              <Card className="glass">
                <CardHeader>
                  <CardTitle>{selectedPatient.name}</CardTitle>
                  <CardDescription>Patient ID: {selectedPatient.medicalRecordNumber}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Age</p>
                      <p className="font-semibold">{selectedPatient.age} years</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Gender</p>
                      <p className="font-semibold">{selectedPatient.gender}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Blood Type</p>
                      <p className="font-semibold">{selectedPatient.bloodType}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Admission</p>
                      <p className="font-semibold text-xs">
                        {selectedPatient.admissionDate ? new Date(selectedPatient.admissionDate).toLocaleDateString() : 'N/A'}
                      </p>
                    </div>
                  </div>

                  {/* Conditions and Allergies */}
                  <div>
                    <p className="text-sm font-semibold mb-2">Conditions</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedPatient.conditions.map((c) => (
                        <Badge key={c} variant="secondary">{c}</Badge>
                      ))}
                    </div>
                  </div>

                  {selectedPatient.allergies.length > 0 && (
                    <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800/30">
                      <p className="text-sm font-semibold text-red-900 dark:text-red-300">Allergies</p>
                      <p className="text-sm text-red-800 dark:text-red-400">{selectedPatient.allergies.join(', ')}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Vital Signs */}
              <Card className="glass">
                <CardHeader>
                  <CardTitle>Current Vital Signs</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-white/50 dark:bg-white/5 rounded-lg">
                      <p className="text-xs text-muted-foreground">Blood Pressure</p>
                      <p className="font-bold text-lg">
                        {selectedPatient.vitals.bloodPressure.systolic}/{selectedPatient.vitals.bloodPressure.diastolic}
                      </p>
                      <p className="text-xs text-muted-foreground">mmHg</p>
                    </div>
                    <div className="p-3 bg-white/50 dark:bg-white/5 rounded-lg">
                      <p className="text-xs text-muted-foreground">Heart Rate</p>
                      <p className="font-bold text-lg">{selectedPatient.vitals.heartRate}</p>
                      <p className="text-xs text-muted-foreground">bpm</p>
                    </div>
                    <div className="p-3 bg-white/50 dark:bg-white/5 rounded-lg">
                      <p className="text-xs text-muted-foreground">Temperature</p>
                      <p className="font-bold text-lg">{selectedPatient.vitals.temperature.toFixed(1)}</p>
                      <p className="text-xs text-muted-foreground">°C</p>
                    </div>
                    <div className="p-3 bg-white/50 dark:bg-white/5 rounded-lg">
                      <p className="text-xs text-muted-foreground">O₂ Saturation</p>
                      <p className="font-bold text-lg">{selectedPatient.vitals.oxygenSaturation.toFixed(1)}%</p>
                      <p className="text-xs text-muted-foreground">SpO₂</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Risk Assessment */}
              <Card className="glass">
                <CardHeader>
                  <CardTitle>Risk Assessment</CardTitle>
                </CardHeader>
                <CardContent>
                  {(() => {
                    const risk = calculatePatientRisk(selectedPatient);
                    const riskBg: Record<string, string> = {
                      critical: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800/30',
                      high: 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800/30',
                      medium: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800/30',
                      low: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800/30'
                    };
                    const riskText: Record<string, string> = {
                      critical: 'text-red-900 dark:text-red-300',
                      high: 'text-orange-900 dark:text-orange-300',
                      medium: 'text-yellow-900 dark:text-yellow-300',
                      low: 'text-green-900 dark:text-green-300'
                    };
                    return (
                      <div className={`p-4 rounded-lg border ${riskBg[risk.level]}`}>
                        <div className="flex justify-between items-center mb-2">
                          <span className={`font-bold text-lg ${riskText[risk.level]}`}>
                            {risk.level.toUpperCase()}
                          </span>
                          <span className={`text-2xl font-bold ${riskText[risk.level]}`}>
                            {risk.score}%
                          </span>
                        </div>
                        <p className={`text-sm mb-3 ${riskText[risk.level]}`}>
                          {risk.recommendation}
                        </p>
                        <p className={`text-xs font-semibold mb-2 ${riskText[risk.level]}`}>Risk Factors:</p>
                        <ul className={`text-xs space-y-1 ${riskText[risk.level]}`}>
                          {risk.reasons.map((reason, i) => (
                            <li key={i}>• {reason}</li>
                          ))}
                        </ul>
                      </div>
                    );
                  })()}
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
            </>
          )}
        </div>
      </div>
    </div>
  );
}

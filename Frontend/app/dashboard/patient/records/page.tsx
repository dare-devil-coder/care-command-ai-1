'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { getPatients } from '@/lib/storage';
import { Patient } from '@/lib/schemas';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, Activity, Pill, AlertCircle } from 'lucide-react';

export default function PatientRecordsPage() {
  const { user } = useAuth();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPatient = () => {
      if (user) {
        const patients = getPatients();
        const currentPatient = patients.find(p => p.id === user.id);
        if (currentPatient) {
          setPatient(currentPatient);
        }
      }
      // Stop loading after 1 second regardless
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    };

    loadPatient();
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-xl text-slate-400">No medical records found</p>
          <p className="text-sm text-slate-500 mt-2">Please contact your healthcare provider</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Medical Records</h1>
        <p className="text-slate-400 mt-2">Your complete medical history and health information</p>
      </div>

      {/* Patient Info Card */}
      <Card className="rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900 to-slate-800 backdrop-blur-xl shadow-lg shadow-black/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Personal Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-slate-400">Full Name</p>
              <p className="text-lg font-semibold">{patient.name}</p>
            </div>
            <div>
              <p className="text-sm text-slate-400">Medical Record Number</p>
              <p className="text-lg font-semibold font-mono">{patient.medicalRecordNumber}</p>
            </div>
            <div>
              <p className="text-sm text-slate-400">Age</p>
              <p className="text-lg font-semibold">{patient.age} years</p>
            </div>
            <div>
              <p className="text-sm text-slate-400">Gender</p>
              <p className="text-lg font-semibold">{patient.gender}</p>
            </div>
            <div>
              <p className="text-sm text-slate-400">Blood Type</p>
              <p className="text-lg font-semibold">{patient.bloodType}</p>
            </div>
            <div>
              <p className="text-sm text-slate-400">Admission Date</p>
              <p className="text-lg font-semibold">
                {patient.admissionDate ? new Date(patient.admissionDate).toLocaleDateString() : 'N/A'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Allergies */}
      {patient.allergies.length > 0 && (
        <Card className="rounded-2xl border border-red-500/30 bg-gradient-to-br from-red-900/20 to-red-800/10 backdrop-blur-xl shadow-lg shadow-black/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-400">
              <AlertCircle className="w-5 h-5" />
              Allergies
            </CardTitle>
            <CardDescription className="text-red-300">Important: Inform all healthcare providers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {patient.allergies.map((allergy, i) => (
                <Badge key={i} className="bg-red-500/20 text-red-300 border-red-500/30 px-4 py-2 text-sm">
                  {allergy}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Medical Conditions */}
      <Card className="rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900 to-slate-800 backdrop-blur-xl shadow-lg shadow-black/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Medical Conditions
          </CardTitle>
          <CardDescription>Current diagnoses and health conditions</CardDescription>
        </CardHeader>
        <CardContent>
          {patient.conditions.length > 0 ? (
            <div className="space-y-3">
              {patient.conditions.map((condition, i) => (
                <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <p className="font-semibold">{condition}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-400 text-center py-4">No conditions recorded</p>
          )}
        </CardContent>
      </Card>

      {/* Medications */}
      <Card className="rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900 to-slate-800 backdrop-blur-xl shadow-lg shadow-black/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Pill className="w-5 h-5" />
            Current Medications
          </CardTitle>
          <CardDescription>Active prescriptions and dosages</CardDescription>
        </CardHeader>
        <CardContent>
          {patient.medications.length > 0 ? (
            <div className="space-y-4">
              {patient.medications.map((med) => (
                <div key={med.id} className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-semibold text-lg">{med.name}</p>
                      <p className="text-sm text-slate-400">{med.dosage}</p>
                    </div>
                    <Badge variant="secondary" className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                      {med.frequency}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-3 text-sm">
                    <div>
                      <p className="text-slate-400">Reason</p>
                      <p className="font-medium">{med.reason}</p>
                    </div>
                    <div>
                      <p className="text-slate-400">Start Date</p>
                      <p className="font-medium">{new Date(med.startDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-400 text-center py-4">No medications prescribed</p>
          )}
        </CardContent>
      </Card>

      {/* Vital Signs History */}
      <Card className="rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900 to-slate-800 backdrop-blur-xl shadow-lg shadow-black/30">
        <CardHeader>
          <CardTitle>Latest Vital Signs</CardTitle>
          <CardDescription>
            Recorded on {new Date(patient.vitals.timestamp).toLocaleString()}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
              <p className="text-sm text-slate-400 mb-1">Blood Pressure</p>
              <p className="text-2xl font-bold">{patient.vitals.bloodPressure.systolic}/{patient.vitals.bloodPressure.diastolic}</p>
              <p className="text-xs text-slate-400">mmHg</p>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
              <p className="text-sm text-slate-400 mb-1">Heart Rate</p>
              <p className="text-2xl font-bold">{patient.vitals.heartRate}</p>
              <p className="text-xs text-slate-400">bpm</p>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
              <p className="text-sm text-slate-400 mb-1">Temperature</p>
              <p className="text-2xl font-bold">{patient.vitals.temperature.toFixed(1)}</p>
              <p className="text-xs text-slate-400">°C</p>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
              <p className="text-sm text-slate-400 mb-1">Respiratory Rate</p>
              <p className="text-2xl font-bold">{patient.vitals.respiratoryRate}</p>
              <p className="text-xs text-slate-400">breaths/min</p>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
              <p className="text-sm text-slate-400 mb-1">O₂ Saturation</p>
              <p className="text-2xl font-bold">{patient.vitals.oxygenSaturation.toFixed(1)}</p>
              <p className="text-xs text-slate-400">%</p>
            </div>
            {patient.vitals.bloodGlucose && (
              <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
                <p className="text-sm text-slate-400 mb-1">Blood Glucose</p>
                <p className="text-2xl font-bold">{patient.vitals.bloodGlucose}</p>
                <p className="text-xs text-slate-400">mg/dL</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

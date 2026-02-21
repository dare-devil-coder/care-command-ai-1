'use client';

import { useParams } from 'next/navigation';
import DashboardLayout from '@/components/shared/dashboard-layout';
import AIInsightsPanel from '@/components/shared/ai-insights-panel';
import TaskCard from '@/components/shared/task-card';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { mockPatients, mockTasks } from '@/lib/mock-data';

export default function PatientDetailPage() {
  const params = useParams();
  const patientId = params.id as string;
  const patient = mockPatients.find((p) => p.id === patientId);
  const patientTasks = mockTasks.filter((t) => t.patientId === patientId);

  if (!patient) {
    return (
      <DashboardLayout title="Patient Not Found">
        <Card className="glass p-6">
          <p className="text-center text-slate-600 dark:text-slate-400">Patient not found</p>
        </Card>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title={patient.name} subtitle="Patient Profile & Care Plan">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Patient Header Card */}
          <Card className="glass p-6">
            <div className="flex items-start gap-6 mb-6 pb-6 border-b border-white/20 dark:border-white/10">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-violet-400 to-purple-400 flex items-center justify-center text-white text-4xl flex-shrink-0">
                {patient.name.charAt(0)}
              </div>
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white">{patient.name}</h2>
                <p className="text-slate-600 dark:text-slate-400 mb-4">Patient ID: {patient.qrCode}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-3 py-1 rounded-full text-sm bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300">
                    {patient.age} years old
                  </span>
                  <span className="px-3 py-1 rounded-full text-sm bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                    {patient.gender === 'M' ? 'Male' : 'Female'}
                  </span>
                  <span className="px-3 py-1 rounded-full text-sm bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
                    Blood Type: {patient.bloodType}
                  </span>
                </div>
              </div>
            </div>

            {/* Vital Signs Grid */}
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Current Vital Signs</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white/40 dark:bg-slate-800/40 rounded-lg p-4 text-center">
                <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">Heart Rate</p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white">{patient.vitalSigns.heartRate}</p>
                <p className="text-xs text-slate-600 dark:text-slate-400">bpm</p>
              </div>
              <div className="bg-white/40 dark:bg-slate-800/40 rounded-lg p-4 text-center">
                <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">Blood Pressure</p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white">{patient.vitalSigns.bloodPressure}</p>
                <p className="text-xs text-slate-600 dark:text-slate-400">mmHg</p>
              </div>
              <div className="bg-white/40 dark:bg-slate-800/40 rounded-lg p-4 text-center">
                <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">Temperature</p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white">{patient.vitalSigns.temperature}</p>
                <p className="text-xs text-slate-600 dark:text-slate-400">°F</p>
              </div>
              <div className="bg-white/40 dark:bg-slate-800/40 rounded-lg p-4 text-center">
                <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">Oxygen Level</p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white">{patient.vitalSigns.oxygenLevel}%</p>
                <p className="text-xs text-slate-600 dark:text-slate-400">SpO2</p>
              </div>
            </div>
          </Card>

          {/* Medical Information */}
          <Card className="glass p-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Medical Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-slate-900 dark:text-white mb-3">Conditions</h4>
                <div className="space-y-2">
                  {patient.conditions.map((condition) => (
                    <div key={condition} className="flex items-center gap-2 p-2 rounded bg-orange-50 dark:bg-orange-950/20">
                      <span>⚠️</span>
                      <span className="text-sm text-orange-700 dark:text-orange-300">{condition}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-slate-900 dark:text-white mb-3">Allergies</h4>
                <div className="space-y-2">
                  {patient.allergies.length > 0 ? (
                    patient.allergies.map((allergy) => (
                      <div key={allergy} className="flex items-center gap-2 p-2 rounded bg-red-50 dark:bg-red-950/20">
                        <span>🚨</span>
                        <span className="text-sm text-red-700 dark:text-red-300">{allergy}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-slate-600 dark:text-slate-400">No known allergies</p>
                  )}
                </div>
              </div>
            </div>
          </Card>

          {/* Current Medications */}
          <Card className="glass p-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Current Medications</h3>
            <div className="space-y-2">
              {patient.medications.map((med) => (
                <div key={med} className="flex items-center gap-3 p-3 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800">
                  <span className="text-green-600 dark:text-green-400">💊</span>
                  <span className="font-medium text-green-700 dark:text-green-300">{med}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Patient Tasks */}
          <Card className="glass p-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Care Plan Tasks</h3>
            {patientTasks.length > 0 ? (
              <div className="space-y-3">
                {patientTasks.map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </div>
            ) : (
              <p className="text-center text-slate-600 dark:text-slate-400 py-8">No active tasks</p>
            )}
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Risk Score Card */}
          <Card className="glass p-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Risk Assessment</h3>
            <div className="text-center mb-6">
              <div className={`text-5xl font-bold mb-2 ${
                patient.riskScore >= 8
                  ? 'text-red-600 dark:text-red-400'
                  : patient.riskScore >= 5
                  ? 'text-orange-600 dark:text-orange-400'
                  : 'text-green-600 dark:text-green-400'
              }`}>
                {patient.riskScore.toFixed(1)}
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400">/10 Risk Score</p>
            </div>
            <p className="text-sm text-slate-700 dark:text-slate-300 text-center">
              {patient.riskScore >= 8
                ? 'High risk - Requires immediate attention'
                : patient.riskScore >= 5
                ? 'Medium risk - Regular monitoring'
                : 'Low risk - Stable condition'}
            </p>
          </Card>

          {/* AI Insights */}
          <AIInsightsPanel patient={patient} />

          {/* Quick Actions */}
          <Card className="glass p-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <Button className="w-full bg-violet-600 hover:bg-violet-700 text-white justify-center">
                Update Vitals
              </Button>
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white justify-center">
                Add Note
              </Button>
              <Button className="w-full bg-green-600 hover:bg-green-700 text-white justify-center">
                Create Task
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}

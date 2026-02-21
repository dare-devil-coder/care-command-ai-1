'use client';

import { useState } from 'react';
import DashboardLayout from '../shared/dashboard-layout';
import PatientCard from '../shared/patient-card';
import TaskCard from '../shared/task-card';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { mockPatients, mockTasks } from '@/lib/mock-data';

export default function DoctorDashboard() {
  const [selectedPatient, setSelectedPatient] = useState<string | null>(null);
  
  // Get assigned patients
  const assignedPatients = mockPatients.filter(p => p.assignedDoctor === 'doctor1');
  const assignedTasks = mockTasks.filter(t => t.assignedTo === 'doctor1');
  const highRiskPatients = assignedPatients.filter(p => p.riskScore >= 8);

  return (
    <DashboardLayout
      title="Doctor Dashboard"
      subtitle="Patient Care & Diagnosis Management"
    >
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="glass p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">My Patients</p>
              <p className="text-3xl font-bold text-slate-900 dark:text-white">{assignedPatients.length}</p>
            </div>
            <div className="text-4xl">👨‍⚕️</div>
          </div>
        </Card>

        <Card className="glass p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">High Risk</p>
              <p className="text-3xl font-bold text-red-600 dark:text-red-400">{highRiskPatients.length}</p>
            </div>
            <div className="text-4xl">⚠️</div>
          </div>
        </Card>

        <Card className="glass p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">My Tasks</p>
              <p className="text-3xl font-bold text-slate-900 dark:text-white">{assignedTasks.length}</p>
            </div>
            <div className="text-4xl">📋</div>
          </div>
        </Card>

        <Card className="glass p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Completion Rate</p>
              <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                {Math.round((assignedTasks.filter(t => t.status === 'completed').length / assignedTasks.length) * 100) || 0}%
              </p>
            </div>
            <div className="text-4xl">✅</div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pending Tasks */}
        <Card className="glass p-6 lg:col-span-1">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <span>📋</span> Pending Tasks
          </h2>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {assignedTasks.filter(t => t.status === 'pending' || t.status === 'in-progress').map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
            {assignedTasks.filter(t => t.status === 'pending' || t.status === 'in-progress').length === 0 && (
              <p className="text-center text-slate-600 dark:text-slate-400 py-8">No pending tasks</p>
            )}
          </div>
        </Card>

        {/* My Patients */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="glass p-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <span>👥</span> My Patients ({assignedPatients.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {assignedPatients.map((patient) => (
                <PatientCard
                  key={patient.id}
                  patient={patient}
                  onClick={() => setSelectedPatient(patient.id)}
                />
              ))}
            </div>
          </Card>

          {/* AI Insights */}
          <Card className="glass p-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <span>🤖</span> AI Health Insights
            </h2>
            <div className="space-y-4">
              {highRiskPatients.length > 0 && (
                <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                  <p className="font-semibold text-red-700 dark:text-red-400 mb-2">High Risk Alert</p>
                  <p className="text-sm text-red-600 dark:text-red-300">
                    {highRiskPatients.map(p => p.name).join(', ')} require immediate attention based on current vital signs and medical history.
                  </p>
                </div>
              )}
              <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <p className="font-semibold text-blue-700 dark:text-blue-400 mb-2">Recommended Follow-ups</p>
                <p className="text-sm text-blue-600 dark:text-blue-300">
                  3 patients are due for routine follow-up appointments. Check scheduling availability.
                </p>
              </div>
              <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                <p className="font-semibold text-green-700 dark:text-green-400 mb-2">Stable Conditions</p>
                <p className="text-sm text-green-600 dark:text-green-300">
                  {assignedPatients.filter(p => p.riskScore < 5).length} patients show stable vital signs and medication compliance.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Quick Actions */}
      <Card className="glass p-6">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <span>⚡</span> Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Button className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white w-full">
            Start Diagnosis
          </Button>
          <Button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white w-full">
            Write Prescription
          </Button>
          <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white w-full">
            Review Lab Results
          </Button>
          <Button className="bg-gradient-to-r from-orange-600 to-yellow-600 hover:from-orange-700 hover:to-yellow-700 text-white w-full">
            Schedule Follow-up
          </Button>
        </div>
      </Card>
    </DashboardLayout>
  );
}

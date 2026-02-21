'use client';

import { useState } from 'react';
import DashboardLayout from '../shared/dashboard-layout';
import TaskCard from '../shared/task-card';
import PatientCard from '../shared/patient-card';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { mockPatients, mockTasks } from '@/lib/mock-data';

export default function NurseDashboard() {
  const [taskFilter, setTaskFilter] = useState<'all' | 'pending' | 'in-progress' | 'completed'>('all');
  
  // Get assigned tasks
  const assignedTasks = mockTasks.filter(t => t.assignedTo === 'nurse1');
  const assignedPatients = mockPatients.filter(p => p.assignedNurse === 'nurse1');
  
  const filteredTasks = taskFilter === 'all' 
    ? assignedTasks 
    : assignedTasks.filter(t => t.status === taskFilter);

  const criticalTasks = assignedTasks.filter(t => t.priority === 'critical' && t.status !== 'completed');
  const completedToday = assignedTasks.filter(t => t.status === 'completed').length;

  return (
    <DashboardLayout
      title="Nurse Dashboard"
      subtitle="Patient Care & Task Management"
    >
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">My Patients</p>
              <p className="text-3xl font-bold text-slate-900 dark:text-white">{assignedPatients.length}</p>
            </div>
            <div className="text-4xl">👥</div>
          </div>
        </Card>

        <Card className={`glass p-6 ${criticalTasks.length > 0 ? 'border-red-200 dark:border-red-800' : ''}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Critical Tasks</p>
              <p className={`text-3xl font-bold ${criticalTasks.length > 0 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
                {criticalTasks.length}
              </p>
            </div>
            <div className="text-4xl">{criticalTasks.length > 0 ? '🚨' : '✅'}</div>
          </div>
        </Card>

        <Card className="glass p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Completed Today</p>
              <p className="text-3xl font-bold text-green-600 dark:text-green-400">{completedToday}</p>
            </div>
            <div className="text-4xl">✅</div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tasks */}
        <div className="lg:col-span-2">
          <Card className="glass p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>📋</span> Active Tasks
              </h2>
              <div className="flex gap-2">
                {(['all', 'pending', 'in-progress'] as const).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setTaskFilter(filter)}
                    className={`px-3 py-1 rounded text-xs font-medium transition-all ${
                      taskFilter === filter
                        ? 'bg-violet-600 text-white'
                        : 'bg-white/40 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300 hover:bg-white/60 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    {filter.charAt(0).toUpperCase() + filter.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-3">
              {filteredTasks.length > 0 ? (
                filteredTasks.map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))
              ) : (
                <p className="text-center text-slate-600 dark:text-slate-400 py-8">No {taskFilter === 'all' ? 'tasks' : taskFilter} tasks</p>
              )}
            </div>
          </Card>
        </div>

        {/* Patient Alerts & Vitals */}
        <div className="space-y-6">
          <Card className="glass p-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <span>⚠️</span> Patient Alerts
            </h2>
            <div className="space-y-3">
              {assignedPatients
                .filter(p => p.riskScore >= 7)
                .slice(0, 5)
                .map((patient) => (
                  <div key={patient.id} className="bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800 rounded-lg p-3">
                    <p className="font-semibold text-orange-700 dark:text-orange-400 text-sm">{patient.name}</p>
                    <p className="text-xs text-orange-600 dark:text-orange-300 mt-1">
                      Risk Score: {patient.riskScore.toFixed(1)}
                    </p>
                  </div>
                ))}
              {assignedPatients.filter(p => p.riskScore >= 7).length === 0 && (
                <p className="text-center text-slate-600 dark:text-slate-400 text-sm py-4">All patients stable</p>
              )}
            </div>
          </Card>

          <Card className="glass p-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <span>📊</span> Vital Signs Summary
            </h2>
            <div className="space-y-3">
              {assignedPatients.slice(0, 3).map((patient) => (
                <div key={patient.id} className="text-sm">
                  <p className="font-medium text-slate-900 dark:text-white mb-2">{patient.name}</p>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-white/40 dark:bg-slate-800/40 rounded p-2">
                      <p className="text-slate-600 dark:text-slate-400">HR</p>
                      <p className="font-semibold text-slate-900 dark:text-white">{patient.vitalSigns.heartRate}</p>
                    </div>
                    <div className="bg-white/40 dark:bg-slate-800/40 rounded p-2">
                      <p className="text-slate-600 dark:text-slate-400">BP</p>
                      <p className="font-semibold text-slate-900 dark:text-white">{patient.vitalSigns.bloodPressure}</p>
                    </div>
                  </div>
                </div>
              ))}
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
          <Button className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white w-full">
            Check Vitals
          </Button>
          <Button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white w-full">
            Administer Meds
          </Button>
          <Button className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white w-full">
            Patient Notes
          </Button>
          <Button className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white w-full">
            Scan QR Code
          </Button>
        </div>
      </Card>
    </DashboardLayout>
  );
}

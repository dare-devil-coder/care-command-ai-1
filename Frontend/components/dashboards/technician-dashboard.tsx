'use client';

import { useState } from 'react';
import DashboardLayout from '../shared/dashboard-layout';
import TaskCard from '../shared/task-card';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { mockTasks } from '@/lib/mock-data';

export default function TechnicianDashboard() {
  const [selectedTab, setSelectedTab] = useState<'all' | 'tests' | 'imaging' | 'results'>('all');
  
  // Get assigned tasks
  const assignedTasks = mockTasks.filter(t => t.assignedTo === 'technician1');
  const testTasks = assignedTasks.filter(t => ['test', 'check-vitals'].includes(t.type));
  const pendingTasks = assignedTasks.filter(t => t.status === 'pending');
  const inProgressTasks = assignedTasks.filter(t => t.status === 'in-progress');
  const completedTasks = assignedTasks.filter(t => t.status === 'completed');

  const filteredTasks = selectedTab === 'all' 
    ? assignedTasks
    : selectedTab === 'tests'
    ? testTasks
    : [];

  return (
    <DashboardLayout
      title="Technician Dashboard"
      subtitle="Laboratory & Diagnostic Tests"
    >
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="glass p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Assigned Tests</p>
              <p className="text-3xl font-bold text-slate-900 dark:text-white">{assignedTasks.length}</p>
            </div>
            <div className="text-4xl">🔬</div>
          </div>
        </Card>

        <Card className="glass p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Pending</p>
              <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">{pendingTasks.length}</p>
            </div>
            <div className="text-4xl">⏳</div>
          </div>
        </Card>

        <Card className="glass p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">In Progress</p>
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{inProgressTasks.length}</p>
            </div>
            <div className="text-4xl">⚙️</div>
          </div>
        </Card>

        <Card className="glass p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Completed</p>
              <p className="text-3xl font-bold text-green-600 dark:text-green-400">{completedTasks.length}</p>
            </div>
            <div className="text-4xl">✅</div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tasks List */}
        <div className="lg:col-span-2">
          <Card className="glass p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>📋</span> Test Queue
              </h2>
              <div className="flex gap-2">
                {(['all', 'tests'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setSelectedTab(tab)}
                    className={`px-3 py-1 rounded text-xs font-medium transition-all ${
                      selectedTab === tab
                        ? 'bg-violet-600 text-white'
                        : 'bg-white/40 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300 hover:bg-white/60 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {filteredTasks.length > 0 ? (
                filteredTasks.map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))
              ) : (
                <p className="text-center text-slate-600 dark:text-slate-400 py-8">No tests assigned</p>
              )}
            </div>
          </Card>
        </div>

        {/* Test Summary & Equipment */}
        <div className="space-y-6">
          <Card className="glass p-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <span>📊</span> Test Summary
            </h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Pending</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{pendingTasks.length}</span>
                </div>
                <div className="w-full bg-white/40 dark:bg-slate-800/40 rounded-full h-2">
                  <div style={{ width: `${(pendingTasks.length / assignedTasks.length) * 100 || 0}%` }} className="h-2 bg-orange-500 rounded-full"></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-slate-600 dark:text-slate-400">In Progress</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{inProgressTasks.length}</span>
                </div>
                <div className="w-full bg-white/40 dark:bg-slate-800/40 rounded-full h-2">
                  <div style={{ width: `${(inProgressTasks.length / assignedTasks.length) * 100 || 0}%` }} className="h-2 bg-blue-500 rounded-full"></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Completed</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{completedTasks.length}</span>
                </div>
                <div className="w-full bg-white/40 dark:bg-slate-800/40 rounded-full h-2">
                  <div style={{ width: `${(completedTasks.length / assignedTasks.length) * 100 || 0}%` }} className="h-2 bg-green-500 rounded-full"></div>
                </div>
              </div>
            </div>
          </Card>

          <Card className="glass p-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <span>🔧</span> Equipment Status
            </h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800">
                <span className="text-sm font-medium text-green-700 dark:text-green-400">ECG Machine</span>
                <span className="text-xs font-semibold text-green-600 dark:text-green-500">Online</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800">
                <span className="text-sm font-medium text-green-700 dark:text-green-400">Ultrasound</span>
                <span className="text-xs font-semibold text-green-600 dark:text-green-500">Ready</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800">
                <span className="text-sm font-medium text-yellow-700 dark:text-yellow-400">CT Scanner</span>
                <span className="text-xs font-semibold text-yellow-600 dark:text-yellow-500">Calibrating</span>
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
          <Button className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white w-full">
            Start ECG Test
          </Button>
          <Button className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white w-full">
            Ultrasound Scan
          </Button>
          <Button className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white w-full">
            Enter Results
          </Button>
          <Button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white w-full">
            Log Equipment Use
          </Button>
        </div>
      </Card>
    </DashboardLayout>
  );
}

'use client';

import { useState } from 'react';
import DashboardLayout from '../shared/dashboard-layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { mockUsers, mockPatients, mockTasks } from '@/lib/mock-data';

export default function AdminDashboard() {
  const [stats] = useState({
    totalStaff: Object.keys(mockUsers).length,
    totalPatients: mockPatients.length,
    activeTasks: mockTasks.filter(t => t.status !== 'completed').length,
    systemStatus: 'Online',
  });

  const staffByRole = {
    doctor: Object.values(mockUsers).filter(u => u.role === 'doctor').length,
    nurse: Object.values(mockUsers).filter(u => u.role === 'nurse').length,
    technician: Object.values(mockUsers).filter(u => u.role === 'technician').length,
  };

  return (
    <DashboardLayout
      title="Administration Dashboard"
      subtitle="System Overview & Staff Management"
    >
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="glass p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Total Staff</p>
              <p className="text-3xl font-bold text-slate-900 dark:text-white">{stats.totalStaff}</p>
            </div>
            <div className="text-4xl">👥</div>
          </div>
        </Card>

        <Card className="glass p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Total Patients</p>
              <p className="text-3xl font-bold text-slate-900 dark:text-white">{stats.totalPatients}</p>
            </div>
            <div className="text-4xl">🏥</div>
          </div>
        </Card>

        <Card className="glass p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Active Tasks</p>
              <p className="text-3xl font-bold text-slate-900 dark:text-white">{stats.activeTasks}</p>
            </div>
            <div className="text-4xl">📋</div>
          </div>
        </Card>

        <Card className={`glass p-6 ${stats.systemStatus === 'Online' ? 'border-green-200 dark:border-green-800' : 'border-red-200 dark:border-red-800'}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">System Status</p>
              <p className={`text-3xl font-bold ${stats.systemStatus === 'Online' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {stats.systemStatus}
              </p>
            </div>
            <div className="text-4xl">🟢</div>
          </div>
        </Card>
      </div>

      {/* Staff Management */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="glass p-6 lg:col-span-2">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
            <span>👥</span> Staff Directory
          </h2>
          <div className="space-y-4">
            {Object.values(mockUsers).map((user) => (
              <div key={user.id} className="flex items-center justify-between p-4 rounded-lg hover:bg-white/50 dark:hover:bg-slate-800/50 transition-colors">
                <div className="flex items-center gap-3">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">{user.name}</p>
                    <p className="text-xs text-slate-600 dark:text-slate-400">{user.department}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-violet-600 dark:text-violet-400 capitalize">{user.role}</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">{user.phone}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Staff Statistics */}
        <Card className="glass p-6">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
            <span>📊</span> Staff by Role
          </h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-slate-600 dark:text-slate-400">Doctors</span>
                <span className="font-semibold text-slate-900 dark:text-white">{staffByRole.doctor}</span>
              </div>
              <div className="w-full bg-white/40 dark:bg-slate-800/40 rounded-full h-2">
                <div style={{ width: `${(staffByRole.doctor / stats.totalStaff) * 100}%` }} className="h-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-slate-600 dark:text-slate-400">Nurses</span>
                <span className="font-semibold text-slate-900 dark:text-white">{staffByRole.nurse}</span>
              </div>
              <div className="w-full bg-white/40 dark:bg-slate-800/40 rounded-full h-2">
                <div style={{ width: `${(staffByRole.nurse / stats.totalStaff) * 100}%` }} className="h-2 bg-gradient-to-r from-green-500 to-green-600 rounded-full"></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-slate-600 dark:text-slate-400">Technicians</span>
                <span className="font-semibold text-slate-900 dark:text-white">{staffByRole.technician}</span>
              </div>
              <div className="w-full bg-white/40 dark:bg-slate-800/40 rounded-full h-2">
                <div style={{ width: `${(staffByRole.technician / stats.totalStaff) * 100}%` }} className="h-2 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full"></div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="glass p-6">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <span>⚡</span> Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Button className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white w-full">
            + Add Staff
          </Button>
          <Button className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white w-full">
            Schedule Shift
          </Button>
          <Button className="bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white w-full">
            Generate Report
          </Button>
          <Button className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white w-full">
            System Settings
          </Button>
        </div>
      </Card>
    </DashboardLayout>
  );
}

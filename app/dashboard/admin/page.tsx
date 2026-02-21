'use client';

import { useEffect, useState } from 'react';
import { getPatients, getTasks, getEquipment } from '@/lib/storage';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DEMO_USERS } from '@/lib/data';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalPatients: 0,
    totalStaff: 0,
    activeTasks: 0,
    equipment: 0
  });

  useEffect(() => {
    setStats({
      totalPatients: getPatients().length,
      totalStaff: DEMO_USERS.filter(u => u.role !== 'patient').length,
      activeTasks: getTasks().filter(t => t.status !== 'completed').length,
      equipment: getEquipment().length
    });
  }, []);

  const roleBreakdown = DEMO_USERS.reduce((acc, user) => {
    if (user.role !== 'patient') {
      acc[user.role] = (acc[user.role] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Administrator Dashboard</h1>
        <p className="text-muted-foreground">System overview and management</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="glass">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Patients</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalPatients}</div>
            <p className="text-xs text-muted-foreground">In hospital</p>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Staff Members</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalStaff}</div>
            <p className="text-xs text-muted-foreground">Active personnel</p>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{stats.activeTasks}</div>
            <p className="text-xs text-muted-foreground">In progress</p>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Equipment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.equipment}</div>
            <p className="text-xs text-muted-foreground">Managed devices</p>
          </CardContent>
        </Card>
      </div>

      {/* Staff Breakdown */}
      <Card className="glass">
        <CardHeader>
          <CardTitle>Staff Distribution</CardTitle>
          <CardDescription>Personnel by role</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(roleBreakdown).map(([role, count]) => (
              <div key={role} className="p-4 bg-white/50 dark:bg-white/5 rounded-lg text-center">
                <p className="text-sm font-semibold capitalize mb-1">{role}</p>
                <p className="text-2xl font-bold text-primary">{count}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Staff Directory */}
      <Card className="glass">
        <CardHeader>
          <CardTitle>Staff Directory</CardTitle>
          <CardDescription>All personnel and contact information</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {DEMO_USERS.filter(u => u.role !== 'patient').map((user) => (
              <div key={user.id} className="p-3 border border-white/20 dark:border-white/10 rounded-lg flex justify-between items-center">
                <div>
                  <p className="font-semibold">{user.name}</p>
                  <div className="text-xs text-muted-foreground space-x-2">
                    <span className="capitalize inline-block px-2 py-0.5 bg-primary/10 rounded">
                      {user.role}
                    </span>
                    {user.department && <span>• {user.department}</span>}
                  </div>
                  {user.email && <p className="text-xs text-muted-foreground mt-1">{user.email}</p>}
                </div>
                <div className="text-right">
                  <p className="text-2xl">{user.avatar}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* System Health */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="glass">
          <CardHeader>
            <CardTitle>System Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm">Database</span>
              <span className="px-2 py-1 bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300 rounded text-xs font-semibold">
                Operational
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Authentication</span>
              <span className="px-2 py-1 bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300 rounded text-xs font-semibold">
                Operational
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">API Gateway</span>
              <span className="px-2 py-1 bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300 rounded text-xs font-semibold">
                Operational
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">QR Scanner</span>
              <span className="px-2 py-1 bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300 rounded text-xs font-semibold">
                Ready
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <button className="w-full px-4 py-2 text-left text-sm font-medium hover:bg-white/10 dark:hover:bg-white/5 rounded-lg transition-colors">
              Generate Backup
            </button>
            <button className="w-full px-4 py-2 text-left text-sm font-medium hover:bg-white/10 dark:hover:bg-white/5 rounded-lg transition-colors">
              View Audit Logs
            </button>
            <button className="w-full px-4 py-2 text-left text-sm font-medium hover:bg-white/10 dark:hover:bg-white/5 rounded-lg transition-colors">
              System Settings
            </button>
            <button className="w-full px-4 py-2 text-left text-sm font-medium hover:bg-white/10 dark:hover:bg-white/5 rounded-lg transition-colors">
              Clear Mock Data
            </button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

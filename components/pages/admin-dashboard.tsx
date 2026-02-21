'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { AlertTriangle, LogOut } from 'lucide-react';

interface AdminDashboardProps {
  onNavigate: (page: 'nurse' | 'mission' | 'timeline' | 'admin' | 'break') => void;
  onLogout: () => void;
}

export default function AdminDashboard({ onNavigate, onLogout }: AdminDashboardProps) {
  const floorData = [
    { floor: 'Floor 1', load: 80, color: 'from-red-500 to-red-600' },
    { floor: 'Floor 2', load: 45, color: 'from-green-500 to-emerald-600' },
    { floor: 'Floor 3', load: 62, color: 'from-yellow-500 to-orange-600' },
    { floor: 'Floor 4', load: 35, color: 'from-blue-500 to-cyan-600' },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-12">
        <h1 className="text-4xl font-bold text-white">Hospital Mission Control</h1>
        <Button onClick={onLogout} variant="outline" className="border-slate-700 text-slate-300">
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </div>

      <div className="max-w-6xl mx-auto space-y-8">
        {/* Floor Load Grid */}
        <div>
          <h2 className="text-2xl font-semibold text-white mb-6">Floor Load Distribution</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {floorData.map((floor) => (
              <Card key={floor.floor} className="bg-slate-800/50 border-slate-700/50 p-6 hover:border-slate-600/50 transition-all">
                <h3 className="text-lg font-semibold text-white mb-4">{floor.floor}</h3>
                <div className="mb-4">
                  <div className="text-4xl font-bold text-white mb-2">{floor.load}%</div>
                  <div className="w-full h-3 bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${floor.color} transition-all`}
                      style={{ width: `${floor.load}%` }}
                    ></div>
                  </div>
                </div>
                <p className={`text-sm font-medium ${
                  floor.load > 75 ? 'text-red-400' : floor.load > 50 ? 'text-yellow-400' : 'text-green-400'
                }`}>
                  {floor.load > 75 ? '⚠️ High Load' : floor.load > 50 ? '⚡ Moderate' : '✓ Optimal'}
                </p>
              </Card>
            ))}
          </div>
        </div>

        {/* Alerts and Warnings */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Nurse Overload */}
          <Card className="bg-red-500/10 border-red-500/50 p-6">
            <div className="flex items-start gap-4">
              <AlertTriangle className="w-8 h-8 text-red-400 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Nurse Overload Alert</h3>
                <p className="text-slate-300 mb-3">3 nurses on Floor 1 are above cognitive load threshold ({'(>'})80)</p>
                <Button className="bg-red-600 hover:bg-red-700 text-white text-sm">View Details</Button>
              </div>
            </div>
          </Card>

          {/* Bottleneck Warning */}
          <Card className="bg-yellow-500/10 border-yellow-500/50 p-6">
            <div className="flex items-start gap-4">
              <AlertTriangle className="w-8 h-8 text-yellow-400 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Equipment Bottleneck</h3>
                <p className="text-slate-300 mb-3">2 vital sign monitors in queue waiting for calibration</p>
                <Button className="bg-yellow-600 hover:bg-yellow-700 text-white text-sm">View Queue</Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Statistics Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="bg-blue-500/10 border-blue-500/50 p-6">
            <p className="text-sm text-slate-400 mb-2">Total Patients</p>
            <p className="text-4xl font-bold text-blue-300">87</p>
            <p className="text-xs text-slate-500 mt-3">+5 from yesterday</p>
          </Card>

          <Card className="bg-green-500/10 border-green-500/50 p-6">
            <p className="text-sm text-slate-400 mb-2">Mission Completion Rate</p>
            <p className="text-4xl font-bold text-green-300">94%</p>
            <p className="text-xs text-slate-500 mt-3">2% increase this week</p>
          </Card>

          <Card className="bg-purple-500/10 border-purple-500/50 p-6">
            <p className="text-sm text-slate-400 mb-2">Average Wait Time</p>
            <p className="text-4xl font-bold text-purple-300">3.2m</p>
            <p className="text-xs text-slate-500 mt-3">Patient to nurse</p>
          </Card>
        </div>

        {/* Staff Allocation */}
        <Card className="bg-slate-800/50 border-slate-700/50 p-6">
          <h3 className="text-xl font-semibold text-white mb-6">Current Staff Allocation</h3>
          <div className="space-y-4">
            {[
              { role: 'Nurses', count: 12, total: 14, status: 'active' },
              { role: 'Doctors', count: 6, total: 8, status: 'active' },
              { role: 'Technicians', count: 8, total: 10, status: 'active' },
              { role: 'Administrators', count: 2, total: 3, status: 'break' },
            ].map((staff) => (
              <div key={staff.role} className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <span className="font-medium text-white">{staff.role}</span>
                  <span className={`text-xs px-2 py-1 rounded ${
                    staff.status === 'active' ? 'bg-green-500/20 text-green-300' : 'bg-yellow-500/20 text-yellow-300'
                  }`}>
                    {staff.status}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-32 h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-cyan-500"
                      style={{ width: `${(staff.count / staff.total) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-mono text-slate-400 w-12 text-right">{staff.count}/{staff.total}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

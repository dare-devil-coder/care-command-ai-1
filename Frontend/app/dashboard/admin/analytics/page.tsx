'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getPatients, getTasks } from '@/lib/storage';
import { TrendingUp, Activity, Users, CheckCircle, AlertTriangle, Clock } from 'lucide-react';
import { calculateRiskScore } from '@/lib/aiEngine';

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState({
    totalPatients: 0,
    criticalPatients: 0,
    completedTasks: 0,
    pendingTasks: 0,
    averageRiskScore: 0,
    taskCompletionRate: 0
  });

  useEffect(() => {
    const patients = getPatients();
    const tasks = getTasks();

    const criticalCount = patients.filter(p => {
      const risk = calculateRiskScore(p.vitals);
      return risk.level === 'critical' || risk.level === 'high';
    }).length;

    const avgRisk = patients.reduce((sum, p) => {
      const risk = calculateRiskScore(p.vitals);
      return sum + risk.score;
    }, 0) / (patients.length || 1);

    const completed = tasks.filter(t => t.status === 'completed').length;
    const pending = tasks.filter(t => t.status === 'pending' || t.status === 'in-progress').length;
    const completionRate = (completed / (tasks.length || 1)) * 100;

    setAnalytics({
      totalPatients: patients.length,
      criticalPatients: criticalCount,
      completedTasks: completed,
      pendingTasks: pending,
      averageRiskScore: Math.round(avgRisk),
      taskCompletionRate: Math.round(completionRate)
    });
  }, []);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-white mb-2">Analytics Dashboard</h1>
        <p className="text-sm text-slate-400">Hospital performance metrics and insights</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <Card className="rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900 to-slate-800 backdrop-blur-xl shadow-lg shadow-black/30 p-6">
          <CardHeader className="p-0 mb-4">
            <CardTitle className="text-sm uppercase tracking-wide text-slate-400 flex items-center gap-2">
              <Users className="w-4 h-4" />
              Total Patients
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="text-4xl font-bold text-white">{analytics.totalPatients}</div>
            <p className="text-sm text-slate-400 mt-1">Currently admitted</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900 to-slate-800 backdrop-blur-xl shadow-lg shadow-black/30 p-6">
          <CardHeader className="p-0 mb-4">
            <CardTitle className="text-sm uppercase tracking-wide text-slate-400 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Critical Patients
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="text-4xl font-bold text-red-400">{analytics.criticalPatients}</div>
            <p className="text-sm text-slate-400 mt-1">High risk level</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900 to-slate-800 backdrop-blur-xl shadow-lg shadow-black/30 p-6">
          <CardHeader className="p-0 mb-4">
            <CardTitle className="text-sm uppercase tracking-wide text-slate-400 flex items-center gap-2">
              <Activity className="w-4 h-4" />
              Avg Risk Score
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="text-4xl font-bold text-white">{analytics.averageRiskScore}%</div>
            <p className="text-sm text-slate-400 mt-1">Across all patients</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900 to-slate-800 backdrop-blur-xl shadow-lg shadow-black/30 p-6">
          <CardHeader className="p-0 mb-4">
            <CardTitle className="text-sm uppercase tracking-wide text-slate-400 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Completion Rate
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="text-4xl font-bold text-green-400">{analytics.taskCompletionRate}%</div>
            <p className="text-sm text-slate-400 mt-1">Task efficiency</p>
          </CardContent>
        </Card>
      </div>

      {/* Task Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900 to-slate-800 backdrop-blur-xl shadow-lg shadow-black/30 p-6">
          <CardHeader className="p-0 mb-6">
            <CardTitle className="text-xl font-semibold text-white">Task Overview</CardTitle>
            <CardDescription className="text-sm text-slate-400">Mission completion status</CardDescription>
          </CardHeader>
          <CardContent className="p-0 space-y-4">
            <div className="flex items-center justify-between p-4 rounded-xl bg-green-500/10 border border-green-500/20">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-8 h-8 text-green-400" />
                <div>
                  <p className="text-sm text-slate-400">Completed Tasks</p>
                  <p className="text-2xl font-bold text-white">{analytics.completedTasks}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
              <div className="flex items-center gap-3">
                <Clock className="w-8 h-8 text-yellow-400" />
                <div>
                  <p className="text-sm text-slate-400">Pending Tasks</p>
                  <p className="text-2xl font-bold text-white">{analytics.pendingTasks}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900 to-slate-800 backdrop-blur-xl shadow-lg shadow-black/30 p-6">
          <CardHeader className="p-0 mb-6">
            <CardTitle className="text-xl font-semibold text-white">Performance Insights</CardTitle>
            <CardDescription className="text-sm text-slate-400">System efficiency metrics</CardDescription>
          </CardHeader>
          <CardContent className="p-0 space-y-4">
            <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
              <p className="text-sm text-slate-400 mb-2">Task Completion Rate</p>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-blue-400 transition-all duration-500"
                    style={{ width: `${analytics.taskCompletionRate}%` }}
                  />
                </div>
                <span className="text-sm font-semibold text-white">{analytics.taskCompletionRate}%</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20">
              <p className="text-sm text-slate-400 mb-2">Average Patient Risk</p>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-purple-500 to-purple-400 transition-all duration-500"
                    style={{ width: `${analytics.averageRiskScore}%` }}
                  />
                </div>
                <span className="text-sm font-semibold text-white">{analytics.averageRiskScore}%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Health */}
      <Card className="rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900 to-slate-800 backdrop-blur-xl shadow-lg shadow-black/30 p-6">
        <CardHeader className="p-0 mb-6">
          <CardTitle className="text-xl font-semibold text-white">System Health</CardTitle>
          <CardDescription className="text-sm text-slate-400">Real-time system status</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Database', status: 'Operational', color: 'green' },
              { label: 'API Gateway', status: 'Operational', color: 'green' },
              { label: 'Authentication', status: 'Operational', color: 'green' },
              { label: 'AI Engine', status: 'Operational', color: 'green' }
            ].map((system) => (
              <div key={system.label} className="p-4 rounded-xl bg-slate-800/50 border border-white/10">
                <p className="text-sm text-slate-400 mb-2">{system.label}</p>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full bg-${system.color}-400 animate-pulse`} />
                  <span className="text-sm font-semibold text-white">{system.status}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

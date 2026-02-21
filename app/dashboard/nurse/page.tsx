'use client';

import { useEffect, useState } from 'react';
import { getTasks, getPatients } from '@/lib/storage';
import { Task, Patient } from '@/lib/schemas';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { calculatePatientRisk } from '@/lib/ai';

export default function NurseDashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [stats, setStats] = useState({ pending: 0, inProgress: 0, completed: 0 });

  useEffect(() => {
    const allTasks = getTasks();
    const allPatients = getPatients();
    
    setTasks(allTasks.filter(t => t.assignedTo === 'nurse_001'));
    setPatients(allPatients);

    // Calculate stats
    const pending = allTasks.filter(t => t.status === 'pending' && t.assignedTo === 'nurse_001').length;
    const inProgress = allTasks.filter(t => t.status === 'in-progress' && t.assignedTo === 'nurse_001').length;
    const completed = allTasks.filter(t => t.status === 'completed' && t.assignedTo === 'nurse_001').length;
    
    setStats({ pending, inProgress, completed });
  }, []);

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      critical: 'bg-red-100 text-red-800',
      high: 'bg-orange-100 text-orange-800',
      medium: 'bg-yellow-100 text-yellow-800',
      low: 'bg-blue-100 text-blue-800'
    };
    return colors[priority] || colors.low;
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-slate-100 text-slate-800',
      'in-progress': 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status] || colors.pending;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Nurse Dashboard</h1>
          <p className="text-muted-foreground">Manage patient care tasks and assignments</p>
        </div>
        <Link href="/dashboard/nurse/qr-scan">
          <Button className="bg-primary hover:bg-primary/90">
            📱 QR Scanner
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="glass">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.pending}</div>
            <p className="text-xs text-muted-foreground">Waiting to start</p>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">In Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{stats.inProgress}</div>
            <p className="text-xs text-muted-foreground">Currently working</p>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{stats.completed}</div>
            <p className="text-xs text-muted-foreground">Finished today</p>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Patients Assigned</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{patients.length}</div>
            <p className="text-xs text-muted-foreground">Under your care</p>
          </CardContent>
        </Card>
      </div>

      {/* Task Queue */}
      <Card className="glass">
        <CardHeader>
          <CardTitle>Task Queue</CardTitle>
          <CardDescription>Your assigned patient care tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {tasks.length > 0 ? (
              tasks.map((task) => {
                const patient = patients.find(p => p.id === task.patientId);
                return (
                  <Link key={task.id} href={`/dashboard/nurse/assignments/${task.id}`}>
                    <div className="p-4 border border-white/20 dark:border-white/10 rounded-lg hover:bg-white/10 dark:hover:bg-white/5 transition-colors cursor-pointer">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <h3 className="font-semibold">{task.title}</h3>
                          <p className="text-sm text-muted-foreground">{patient?.name}</p>
                        </div>
                        <div className="flex gap-2">
                          <Badge className={getPriorityColor(task.priority)}>
                            {task.priority}
                          </Badge>
                          <Badge className={getStatusColor(task.status)}>
                            {task.status}
                          </Badge>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">{task.description}</p>
                    </div>
                  </Link>
                );
              })
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No tasks assigned</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Patient Overview */}
      <Card className="glass">
        <CardHeader>
          <CardTitle>Patient Status Overview</CardTitle>
          <CardDescription>Quick view of patient risk levels</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {patients.slice(0, 5).map((patient) => {
              const risk = calculatePatientRisk(patient);
              const riskColors: Record<string, string> = {
                critical: 'text-red-600',
                high: 'text-orange-600',
                medium: 'text-yellow-600',
                low: 'text-green-600'
              };
              return (
                <div key={patient.id} className="flex items-center justify-between p-3 border border-white/20 dark:border-white/10 rounded-lg">
                  <div>
                    <p className="font-medium">{patient.name}</p>
                    <p className="text-xs text-muted-foreground">MRN: {patient.medicalRecordNumber}</p>
                  </div>
                  <div className={`font-bold ${riskColors[risk.level]}`}>
                    Risk: {risk.score}%
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

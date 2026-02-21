'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getTask, updateTask, getPatient } from '@/lib/storage';
import { Task, Patient } from '@/lib/schemas';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

export default function TaskDetailPage() {
  const params = useParams();
  const router = useRouter();
  const taskId = params.id as string;

  const [task, setTask] = useState<Task | null>(null);
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const foundTask = getTask(taskId);
    if (foundTask) {
      setTask(foundTask);
      const foundPatient = getPatient(foundTask.patientId);
      if (foundPatient) {
        setPatient(foundPatient);
      }
    }
    setLoading(false);
  }, [taskId]);

  const handleStatusChange = (newStatus: string) => {
    if (task) {
      const updated = {
        ...task,
        status: newStatus as any,
        completedAt: newStatus === 'completed' ? Date.now() : task.completedAt
      };
      updateTask(updated);
      setTask(updated);
    }
  };

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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!task) {
    return (
      <Card className="glass">
        <CardContent className="text-center py-8">
          <p className="text-muted-foreground">Task not found</p>
          <Link href="/dashboard/nurse">
            <Button className="mt-4">Back to Dashboard</Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">{task.title}</h1>
          <p className="text-muted-foreground">{patient?.name}</p>
        </div>
        <Link href="/dashboard/nurse">
          <Button variant="outline">Back</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Task Details */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="glass">
            <CardHeader>
              <CardTitle>Task Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Description</p>
                <p className="text-lg">{task.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Priority</p>
                  <Badge className={getPriorityColor(task.priority)} variant="secondary">
                    {task.priority.toUpperCase()}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <Badge className={getStatusColor(task.status)} variant="secondary">
                    {task.status}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Due Date</p>
                  <p className="font-semibold">
                    {new Date(task.dueDate).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Created</p>
                  <p className="font-semibold">
                    {new Date(task.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>

              {task.completedAt && (
                <div>
                  <p className="text-sm text-muted-foreground">Completed</p>
                  <p className="font-semibold text-green-600">
                    {new Date(task.completedAt).toLocaleString()}
                  </p>
                </div>
              )}

              {task.notes && (
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p className="text-sm text-blue-900 dark:text-blue-300 font-semibold mb-1">Notes</p>
                  <p className="text-sm text-blue-800 dark:text-blue-400">{task.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Patient Info */}
          {patient && (
            <Card className="glass">
              <CardHeader>
                <CardTitle>Patient Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Age</p>
                    <p className="font-semibold">{patient.age} years</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Gender</p>
                    <p className="font-semibold">{patient.gender}</p>
                  </div>
                </div>

                <div className="p-3 bg-white/30 dark:bg-white/5 rounded-lg">
                  <p className="text-sm font-semibold mb-2">Current Vitals</p>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>BP:</span>
                      <span className="font-semibold">
                        {patient.vitals.bloodPressure.systolic}/{patient.vitals.bloodPressure.diastolic}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>HR:</span>
                      <span className="font-semibold">{patient.vitals.heartRate} bpm</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Temp:</span>
                      <span className="font-semibold">{patient.vitals.temperature.toFixed(1)}°C</span>
                    </div>
                    <div className="flex justify-between">
                      <span>O2:</span>
                      <span className="font-semibold">{patient.vitals.oxygenSaturation.toFixed(1)}%</span>
                    </div>
                  </div>
                </div>

                {patient.conditions.length > 0 && (
                  <div>
                    <p className="text-sm font-semibold mb-2">Conditions</p>
                    <div className="flex flex-wrap gap-2">
                      {patient.conditions.map(c => (
                        <Badge key={c} variant="secondary">{c}</Badge>
                      ))}
                    </div>
                  </div>
                )}

                {patient.allergies.length > 0 && (
                  <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800/30">
                    <p className="text-sm font-semibold text-red-900 dark:text-red-300 mb-1">Allergies</p>
                    <p className="text-sm text-red-800 dark:text-red-400">{patient.allergies.join(', ')}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Actions */}
        <div className="space-y-4">
          <Card className="glass">
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                onClick={() => handleStatusChange('pending')}
                variant={task.status === 'pending' ? 'default' : 'outline'}
                className="w-full"
              >
                Mark Pending
              </Button>
              <Button
                onClick={() => handleStatusChange('in-progress')}
                variant={task.status === 'in-progress' ? 'default' : 'outline'}
                className="w-full"
              >
                Mark In Progress
              </Button>
              <Button
                onClick={() => handleStatusChange('completed')}
                variant={task.status === 'completed' ? 'default' : 'outline'}
                className="w-full"
              >
                Mark Complete
              </Button>
              <Button
                onClick={() => handleStatusChange('cancelled')}
                variant="outline"
                className="w-full"
              >
                Cancel Task
              </Button>
            </CardContent>
          </Card>

          <Card className="glass">
            <CardHeader>
              <CardTitle className="text-sm">Task Timeline</CardTitle>
            </CardHeader>
            <CardContent className="text-xs space-y-2 text-muted-foreground">
              <div>
                <p className="font-semibold">Created</p>
                <p>{new Date(task.createdAt).toLocaleString()}</p>
              </div>
              {task.completedAt && (
                <div>
                  <p className="font-semibold text-green-600">Completed</p>
                  <p className="text-green-600">{new Date(task.completedAt).toLocaleString()}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

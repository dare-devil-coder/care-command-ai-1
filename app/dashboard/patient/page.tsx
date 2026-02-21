'use client';

import { useEffect, useState } from 'react';
import { getAppointments } from '@/lib/storage';
import { Appointment } from '@/lib/schemas';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function PatientDashboard() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    const allAppointments = getAppointments().filter(a => a.patientId === 'patient_001');
    setAppointments(allAppointments);
  }, []);

  const upcomingAppointments = appointments.filter(a => a.status === 'scheduled');
  const pastAppointments = appointments.filter(a => a.status === 'completed');

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      scheduled: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
      'no-show': 'bg-yellow-100 text-yellow-800'
    };
    return colors[status] || colors.scheduled;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">My Health Portal</h1>
        <p className="text-muted-foreground">Your medical information and appointments</p>
      </div>

      {/* Welcome Card */}
      <Card className="glass bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/30">
        <CardContent className="pt-6">
          <h2 className="text-xl font-semibold mb-2">Welcome back!</h2>
          <p className="text-muted-foreground">
            Keep track of your health records, appointments, and medications all in one place.
          </p>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="glass">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Upcoming Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{upcomingAppointments.length}</div>
            <p className="text-xs text-muted-foreground">Scheduled visits</p>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Past Visits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{pastAppointments.length}</div>
            <p className="text-xs text-muted-foreground">Completed appointments</p>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Messages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">From your doctor</p>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Appointments */}
      <Card className="glass">
        <CardHeader>
          <CardTitle>Upcoming Appointments</CardTitle>
          <CardDescription>Your scheduled medical visits</CardDescription>
        </CardHeader>
        <CardContent>
          {upcomingAppointments.length > 0 ? (
            <div className="space-y-3">
              {upcomingAppointments.map((appt) => (
                <div key={appt.id} className="p-4 border border-white/20 dark:border-white/10 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold">{appt.type} with {appt.doctorName}</h3>
                      <p className="text-sm text-muted-foreground">
                        {new Date(appt.dateTime).toLocaleString()}
                      </p>
                    </div>
                    <Badge className={getStatusColor(appt.status)} variant="secondary">
                      {appt.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">Duration: {appt.duration} minutes</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No upcoming appointments</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Medical History */}
      <Card className="glass">
        <CardHeader>
          <CardTitle>Medical Information</CardTitle>
          <CardDescription>Your health profile</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-white/50 dark:bg-white/5 rounded-lg">
              <p className="text-xs text-muted-foreground">Blood Type</p>
              <p className="font-semibold">O+</p>
            </div>
            <div className="p-3 bg-white/50 dark:bg-white/5 rounded-lg">
              <p className="text-xs text-muted-foreground">Primary Physician</p>
              <p className="font-semibold">Dr. Michael Chen</p>
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold mb-2">Active Medications</p>
            <div className="space-y-2">
              <div className="p-2 bg-white/50 dark:bg-white/5 rounded-lg text-sm">
                <p className="font-medium">Lisinopril</p>
                <p className="text-xs text-muted-foreground">10mg daily - Hypertension</p>
              </div>
              <div className="p-2 bg-white/50 dark:bg-white/5 rounded-lg text-sm">
                <p className="font-medium">Metformin</p>
                <p className="text-xs text-muted-foreground">500mg twice daily - Diabetes</p>
              </div>
            </div>
          </div>

          <div className="p-3 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800/30 rounded-lg">
            <p className="text-sm font-semibold text-orange-900 dark:text-orange-300 mb-1">Allergies</p>
            <p className="text-sm text-orange-800 dark:text-orange-400">Penicillin, Sulfa drugs</p>
          </div>
        </CardContent>
      </Card>

      {/* Recent Messages */}
      <Card className="glass">
        <CardHeader>
          <CardTitle>Messages from Healthcare Team</CardTitle>
          <CardDescription>Recent communications</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="p-3 border border-white/20 dark:border-white/10 rounded-lg">
              <div className="flex justify-between items-start mb-1">
                <p className="font-semibold">Dr. Michael Chen</p>
                <p className="text-xs text-muted-foreground">2 days ago</p>
              </div>
              <p className="text-sm text-muted-foreground">Your blood pressure reading was good last visit. Keep up the medication routine.</p>
            </div>
            <div className="p-3 border border-white/20 dark:border-white/10 rounded-lg">
              <div className="flex justify-between items-start mb-1">
                <p className="font-semibold">Nurse Sarah Johnson</p>
                <p className="text-xs text-muted-foreground">1 week ago</p>
              </div>
              <p className="text-sm text-muted-foreground">Please schedule your annual check-up for next month.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

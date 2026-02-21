'use client';

import { useState, useEffect } from 'react';
import { getAppointments } from '@/lib/storage';
import { Appointment } from '@/lib/schemas';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

interface PatientPortalProps {
  onNavigate: (page: string, patientId?: string) => void;
  onLogout: () => void;
  currentPage: string;
}

export default function PatientPortal({
  onNavigate,
  onLogout,
  currentPage,
}: PatientPortalProps) {
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
    <div className="min-h-screen bg-slate-900 text-slate-50">
      {/* Header */}
      <div className="bg-slate-800 border-b border-slate-700 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Patient Portal</h1>
            <p className="text-sm text-slate-400 mt-1">Your health information and appointments</p>
          </div>
          <Button
            onClick={onLogout}
            className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-white"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>
      </div>
      
      <main className="max-w-6xl mx-auto p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">My Health Portal</h1>
          <p className="text-muted-foreground">Your medical information and appointments</p>
        </div>

        {/* Welcome Card */}
        <Card className="glass bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/30 mb-8">
          <CardContent className="pt-6">
            <h2 className="text-xl font-semibold mb-2">Welcome back!</h2>
            <p className="text-muted-foreground">
              Keep track of your health records, appointments, and medications all in one place.
            </p>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
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
        <Card className="glass mb-8">
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
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">No upcoming appointments</p>
            )}
          </CardContent>
        </Card>

        {/* Past Appointments */}
        <Card className="glass">
          <CardHeader>
            <CardTitle>Past Appointments</CardTitle>
            <CardDescription>Your completed medical visits</CardDescription>
          </CardHeader>
          <CardContent>
            {pastAppointments.length > 0 ? (
              <div className="space-y-3">
                {pastAppointments.map((appt) => (
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
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">No past appointments</p>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

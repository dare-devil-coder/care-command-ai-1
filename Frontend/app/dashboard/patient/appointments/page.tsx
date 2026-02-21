'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { getAppointments } from '@/lib/storage';
import { Appointment } from '@/lib/schemas';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, User, MapPin, Plus } from 'lucide-react';
import { addNotification } from '@/lib/notificationStore';

export default function PatientAppointmentsPage() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [appointmentDate, setAppointmentDate] = useState('');
  const [appointmentTime, setAppointmentTime] = useState('');
  const [appointmentType, setAppointmentType] = useState('General Consultation');

  useEffect(() => {
    if (user) {
      const allAppointments = getAppointments().filter(a => a.patientId === user.id);
      setAppointments(allAppointments.sort((a, b) => a.dateTime - b.dateTime));
    }
  }, [user]);

  const handleCreateAppointment = () => {
    if (!selectedDoctor || !appointmentDate || !appointmentTime) return;

    const dateTime = new Date(`${appointmentDate}T${appointmentTime}`).getTime();
    
    const newAppointment: Appointment = {
      id: `appt-${Date.now()}`,
      patientId: user?.id || '',
      patientName: user?.name || '',
      doctorId: selectedDoctor,
      doctorName: selectedDoctor,
      dateTime,
      duration: 30,
      type: appointmentType,
      status: 'scheduled',
      notes: ''
    };

    setAppointments([...appointments, newAppointment].sort((a, b) => a.dateTime - b.dateTime));
    
    // Notify doctor
    addNotification('doctor', `New appointment scheduled with ${user?.name} on ${new Date(dateTime).toLocaleDateString()}`);
    
    setShowCreateModal(false);
    setSelectedDoctor('');
    setAppointmentDate('');
    setAppointmentTime('');
    setAppointmentType('General Consultation');
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      scheduled: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300',
      completed: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300',
      cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300',
      'no-show': 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300'
    };
    return colors[status] || colors.scheduled;
  };

  const upcomingAppointments = appointments.filter(a => a.dateTime > Date.now() && a.status === 'scheduled');
  const pastAppointments = appointments.filter(a => a.dateTime <= Date.now() || a.status !== 'scheduled');

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Appointments</h1>
          <p className="text-slate-400 mt-2">View and manage your medical appointments</p>
        </div>
        <Button 
          onClick={() => setShowCreateModal(true)}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Book Appointment
        </Button>
      </div>

      {/* Create Appointment Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900 to-slate-800 backdrop-blur-xl shadow-lg shadow-black/30 p-6">
            <CardHeader className="p-0 mb-6">
              <div className="flex justify-between items-center">
                <CardTitle className="text-xl font-semibold text-white">Book New Appointment</CardTitle>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  ✕
                </button>
              </div>
            </CardHeader>
            <CardContent className="p-0 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Select Doctor</label>
                <select
                  value={selectedDoctor}
                  onChange={(e) => setSelectedDoctor(e.target.value)}
                  className="w-full p-3 rounded-lg bg-slate-800 border border-slate-700 text-white focus:border-blue-500 focus:outline-none"
                >
                  <option value="">Choose a doctor</option>
                  <option value="Dr. Michael Chen">Dr. Michael Chen - Cardiology</option>
                  <option value="Dr. Sarah Lee">Dr. Sarah Lee - Internal Medicine</option>
                  <option value="Dr. James Wilson">Dr. James Wilson - Orthopedics</option>
                  <option value="Dr. Emily Brown">Dr. Emily Brown - Pediatrics</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Appointment Type</label>
                <select
                  value={appointmentType}
                  onChange={(e) => setAppointmentType(e.target.value)}
                  className="w-full p-3 rounded-lg bg-slate-800 border border-slate-700 text-white focus:border-blue-500 focus:outline-none"
                >
                  <option value="General Consultation">General Consultation</option>
                  <option value="Follow-up">Follow-up</option>
                  <option value="Specialist Consultation">Specialist Consultation</option>
                  <option value="Lab Results Review">Lab Results Review</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Date</label>
                <input
                  type="date"
                  value={appointmentDate}
                  onChange={(e) => setAppointmentDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full p-3 rounded-lg bg-slate-800 border border-slate-700 text-white focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Time</label>
                <input
                  type="time"
                  value={appointmentTime}
                  onChange={(e) => setAppointmentTime(e.target.value)}
                  className="w-full p-3 rounded-lg bg-slate-800 border border-slate-700 text-white focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="flex gap-3 mt-6">
                <Button
                  onClick={handleCreateAppointment}
                  disabled={!selectedDoctor || !appointmentDate || !appointmentTime}
                  className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed"
                >
                  Book Appointment
                </Button>
                <Button
                  onClick={() => setShowCreateModal(false)}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <Card className="rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900 to-slate-800 backdrop-blur-xl shadow-lg shadow-black/30">
          <CardHeader className="pb-3">
            <p className="text-sm uppercase tracking-wide text-slate-400">Total</p>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold">{appointments.length}</span>
              <span className="text-sm text-slate-400">appointments</span>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border border-white/10 bg-gradient-to-br from-blue-900/30 to-blue-800/20 backdrop-blur-xl shadow-lg shadow-black/30">
          <CardHeader className="pb-3">
            <p className="text-sm uppercase tracking-wide text-slate-400">Upcoming</p>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-blue-400">{upcomingAppointments.length}</span>
              <span className="text-sm text-slate-400">scheduled</span>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border border-white/10 bg-gradient-to-br from-green-900/30 to-green-800/20 backdrop-blur-xl shadow-lg shadow-black/30">
          <CardHeader className="pb-3">
            <p className="text-sm uppercase tracking-wide text-slate-400">Completed</p>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-green-400">
                {appointments.filter(a => a.status === 'completed').length}
              </span>
              <span className="text-sm text-slate-400">visits</span>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900 to-slate-800 backdrop-blur-xl shadow-lg shadow-black/30">
          <CardHeader className="pb-3">
            <p className="text-sm uppercase tracking-wide text-slate-400">Next Visit</p>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold">
                {upcomingAppointments.length > 0 
                  ? new Date(upcomingAppointments[0].dateTime).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                  : 'None'}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Appointments */}
      {upcomingAppointments.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Upcoming Appointments</h2>
          <div className="space-y-4">
            {upcomingAppointments.map(appointment => (
              <Card key={appointment.id} className="rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900 to-slate-800 backdrop-blur-xl shadow-lg shadow-black/30">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-semibold mb-1">{appointment.type}</h3>
                      <Badge className={getStatusColor(appointment.status)}>
                        {appointment.status}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
                      <Calendar className="w-5 h-5 text-blue-400" />
                      <div>
                        <p className="text-xs text-slate-400">Date</p>
                        <p className="font-semibold">{new Date(appointment.dateTime).toLocaleDateString()}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
                      <Clock className="w-5 h-5 text-blue-400" />
                      <div>
                        <p className="text-xs text-slate-400">Time</p>
                        <p className="font-semibold">{new Date(appointment.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
                      <User className="w-5 h-5 text-blue-400" />
                      <div>
                        <p className="text-xs text-slate-400">Doctor</p>
                        <p className="font-semibold">{appointment.doctorName}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
                      <Clock className="w-5 h-5 text-blue-400" />
                      <div>
                        <p className="text-xs text-slate-400">Duration</p>
                        <p className="font-semibold">{appointment.duration} minutes</p>
                      </div>
                    </div>
                  </div>

                  {appointment.notes && (
                    <div className="mt-4 p-3 rounded-xl bg-blue-500/10 border border-blue-500/30">
                      <p className="text-sm text-blue-300">{appointment.notes}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Past Appointments */}
      {pastAppointments.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Past Appointments</h2>
          <div className="space-y-4">
            {pastAppointments.map(appointment => (
              <Card key={appointment.id} className="rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900 to-slate-800 backdrop-blur-xl shadow-lg shadow-black/30 opacity-75">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold mb-1">{appointment.type}</h3>
                      <Badge className={getStatusColor(appointment.status)}>
                        {appointment.status}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-slate-400">Date</p>
                      <p className="font-semibold">{new Date(appointment.dateTime).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-slate-400">Doctor</p>
                      <p className="font-semibold">{appointment.doctorName}</p>
                    </div>
                    <div>
                      <p className="text-slate-400">Duration</p>
                      <p className="font-semibold">{appointment.duration} minutes</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {appointments.length === 0 && (
        <Card className="rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900 to-slate-800 backdrop-blur-xl shadow-lg shadow-black/30">
          <CardContent className="text-center py-12">
            <Calendar className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400 text-lg">No appointments scheduled</p>
            <p className="text-slate-500 text-sm mt-2">Contact your healthcare provider to schedule an appointment</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

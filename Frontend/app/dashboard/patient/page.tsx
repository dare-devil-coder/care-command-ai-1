'use client';

import { useEffect, useState } from 'react';
import { getAppointments, getPatients, getTasks } from '@/lib/storage';
import { Appointment, Patient, Task } from '@/lib/schemas';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { calculatePatientRisk } from '@/lib/ai';
import { Clock, FileText, Activity, AlertCircle, Calendar, Pill, Shield, Stethoscope } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

export default function PatientDashboard() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [patientData, setPatientData] = useState<Patient | null>(null);
  const [todayTasks, setTodayTasks] = useState<Task[]>([]);
  const [riskData, setRiskData] = useState<{ score: number; level: string; recommendation: string } | null>(null);

  useEffect(() => {
    loadPatientData();
  }, []);

  const loadPatientData = () => {
    // Get patient data - in real app, would use user.id
    const patients = getPatients();
    const patient = patients.find(p => p.id === 'patient_001') || patients[0];
    
    if (patient) {
      setPatientData(patient);
      
      // Calculate risk
      const risk = calculatePatientRisk(patient);
      setRiskData(risk);
      
      // Get appointments
      const allAppointments = getAppointments().filter(a => a.patientId === patient.id);
      setAppointments(allAppointments);
      
      // Get today's tasks assigned to this patient
      const allTasks = getTasks().filter(t => t.patientId === patient.id);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      const tasksToday = allTasks.filter(t => {
        const taskDate = new Date(t.dueDate);
        return taskDate >= today && taskDate < tomorrow;
      });
      setTodayTasks(tasksToday);
    }
  };

  const upcomingAppointments = appointments.filter(a => a.status === 'scheduled');
  const pastAppointments = appointments.filter(a => a.status === 'completed');

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      scheduled: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300',
      completed: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300',
      cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300',
      'no-show': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300'
    };
    return colors[status] || colors.scheduled;
  };

  const getRiskColor = (level: string) => {
    const colors: Record<string, string> = {
      critical: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300 border-red-300 dark:border-red-800/30',
      high: 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300 border-orange-300 dark:border-orange-800/30',
      medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300 border-yellow-300 dark:border-yellow-800/30',
      low: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300 border-green-300 dark:border-green-800/30'
    };
    return colors[level] || colors.low;
  };

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      critical: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300',
      high: 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300',
      medium: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300',
      low: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300'
    };
    return colors[priority] || colors.low;
  };

  const getTaskStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300',
      'in-progress': 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300',
      completed: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300',
      cancelled: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300'
    };
    return colors[status] || colors.pending;
  };

  // Generate medication schedule for today
  const getMedicationSchedule = () => {
    if (!patientData?.medications || !Array.isArray(patientData.medications)) {
      return [];
    }
    
    const schedule = patientData.medications.map(med => {
      const times: string[] = [];
      const freq = (med.frequency ?? '').toLowerCase();
      
      if (freq.includes('daily') || freq.includes('once')) {
        times.push('08:00 AM');
      } else if (freq.includes('twice')) {
        times.push('08:00 AM', '08:00 PM');
      } else if (freq.includes('three') || freq.includes('3')) {
        times.push('08:00 AM', '02:00 PM', '08:00 PM');
      } else if (freq.includes('four') || freq.includes('4')) {
        times.push('08:00 AM', '12:00 PM', '04:00 PM', '08:00 PM');
      }
      
      return times.map(time => ({
        medication: med.name,
        dosage: med.dosage,
        time,
        reason: med.reason,
        taken: Math.random() > 0.5 // Simulate some taken
      }));
    }).flat();
    
    return schedule.sort((a, b) => a.time.localeCompare(b.time));
  };

  const medicationSchedule = getMedicationSchedule();

  return (
    <div className="space-y-6">
      {/* Header with Risk Indicator */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">My Health Portal</h1>
          <p className="text-muted-foreground">Your medical information and care plan</p>
        </div>
        
        {/* Risk Level Indicator */}
        {riskData && (
          <div className={`px-4 py-2 rounded-lg border ${getRiskColor(riskData.level)}`}>
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              <div>
                <p className="text-xs font-semibold">Health Risk Level</p>
                <p className="text-lg font-bold">{riskData.level.toUpperCase()}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Welcome Card */}
      <Card className="glass bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/30">
        <CardContent className="pt-6">
          <h2 className="text-xl font-semibold mb-2">Welcome back, {patientData?.name || 'Patient'}!</h2>
          <p className="text-muted-foreground">
            Keep track of your health records, care plan, and daily missions all in one place.
          </p>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="glass">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Today's Missions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{todayTasks.length}</div>
            <p className="text-xs text-muted-foreground">Assigned tasks</p>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Medications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{patientData?.medications.length || 0}</div>
            <p className="text-xs text-muted-foreground">Active prescriptions</p>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{upcomingAppointments.length}</div>
            <p className="text-xs text-muted-foreground">Scheduled visits</p>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Risk Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{riskData?.score || 0}%</div>
            <p className="text-xs text-muted-foreground">{riskData?.level || 'Normal'}</p>
          </CardContent>
        </Card>
      </div>

      {/* My Care Plan (Read Only) */}
      <Card className="glass">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            My Care Plan
          </CardTitle>
          <CardDescription>Your personalized treatment plan (read-only)</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {patientData?.notes ? (
            <div className="p-4 bg-white/50 dark:bg-white/5 rounded-lg border border-white/20 dark:border-white/10">
              <p className="text-sm whitespace-pre-wrap">{patientData.notes}</p>
            </div>
          ) : (
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800/30">
              <p className="text-sm text-blue-900 dark:text-blue-300">
                Your doctor will create a personalized care plan for you. Check back soon!
              </p>
            </div>
          )}
          
          {riskData && (
            <div className={`p-4 rounded-lg border ${getRiskColor(riskData.level)}`}>
              <p className="text-sm font-semibold mb-2">Care Recommendation:</p>
              <p className="text-sm">{riskData.recommendation}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Today's Assigned Missions */}
      <Card className="glass">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Today's Assigned Missions
          </CardTitle>
          <CardDescription>Care tasks scheduled for today</CardDescription>
        </CardHeader>
        <CardContent>
          {todayTasks.length > 0 ? (
            <div className="space-y-3">
              {todayTasks.map((task) => (
                <div key={task.id} className="p-4 border border-white/20 dark:border-white/10 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <h3 className="font-semibold">{task.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
                    </div>
                    <div className="flex gap-2">
                      <Badge className={getPriorityColor(task.priority)} variant="secondary">
                        {task.priority}
                      </Badge>
                      <Badge className={getTaskStatusColor(task.status)} variant="secondary">
                        {task.status}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    <span>Due: {new Date(task.dueDate).toLocaleTimeString()}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No missions scheduled for today</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Medicine Schedule Timeline */}
      <Card className="glass">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Pill className="w-5 h-5" />
            Today's Medicine Schedule
          </CardTitle>
          <CardDescription>Your medication timeline for today</CardDescription>
        </CardHeader>
        <CardContent>
          {medicationSchedule.length > 0 ? (
            <div className="space-y-3">
              {medicationSchedule.map((med, idx) => (
                <div key={idx} className={`p-4 rounded-lg border ${med.taken ? 'bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800/30' : 'bg-white/50 dark:bg-white/5 border-white/20 dark:border-white/10'}`}>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold">{med.medication}</span>
                        {med.taken && (
                          <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300">
                            Taken
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{med.dosage} - {med.reason}</p>
                    </div>
                    <div className="flex items-center gap-2 text-sm font-semibold">
                      <Clock className="w-4 h-4" />
                      {med.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No medications scheduled</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Care Timeline (Read Only) */}
      <Card className="glass">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Care Timeline
          </CardTitle>
          <CardDescription>Your recent medical history and care events</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Timeline items */}
            <div className="relative pl-8 pb-4 border-l-2 border-primary/30">
              <div className="absolute -left-2 top-0 w-4 h-4 rounded-full bg-primary"></div>
              <div className="mb-1">
                <p className="font-semibold text-sm">Vital Signs Recorded</p>
                <p className="text-xs text-muted-foreground">
                  {patientData?.vitals.timestamp ? new Date(patientData.vitals.timestamp).toLocaleString() : 'Today'}
                </p>
              </div>
              {patientData && (
                <div className="text-xs text-muted-foreground space-y-1">
                  <p>BP: {patientData.vitals.bloodPressure.systolic}/{patientData.vitals.bloodPressure.diastolic} mmHg</p>
                  <p>Heart Rate: {patientData.vitals.heartRate} bpm</p>
                  <p>O₂ Saturation: {patientData.vitals.oxygenSaturation.toFixed(1)}%</p>
                  <p>Temperature: {patientData.vitals.temperature.toFixed(1)}°C</p>
                </div>
              )}
            </div>

            {patientData?.admissionDate && (
              <div className="relative pl-8 pb-4 border-l-2 border-primary/30">
                <div className="absolute -left-2 top-0 w-4 h-4 rounded-full bg-blue-500"></div>
                <div className="mb-1">
                  <p className="font-semibold text-sm">Hospital Admission</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(patientData.admissionDate).toLocaleDateString()}
                  </p>
                </div>
                <p className="text-xs text-muted-foreground">Admitted for treatment and monitoring</p>
              </div>
            )}

            {patientData?.medications.map((med, idx) => (
              <div key={idx} className="relative pl-8 pb-4 border-l-2 border-primary/30">
                <div className="absolute -left-2 top-0 w-4 h-4 rounded-full bg-green-500"></div>
                <div className="mb-1">
                  <p className="font-semibold text-sm">Medication Prescribed: {med.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(med.startDate).toLocaleDateString()}
                  </p>
                </div>
                <p className="text-xs text-muted-foreground">{med.dosage} - {med.frequency}</p>
              </div>
            ))}

            <div className="relative pl-8">
              <div className="absolute -left-2 top-0 w-4 h-4 rounded-full bg-gray-300"></div>
              <div className="mb-1">
                <p className="font-semibold text-sm">Initial Assessment</p>
                <p className="text-xs text-muted-foreground">
                  {patientData?.admissionDate ? new Date(patientData.admissionDate - 86400000).toLocaleDateString() : 'Earlier'}
                </p>
              </div>
              <p className="text-xs text-muted-foreground">Patient evaluation and diagnosis</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Doctor Notes (Read Only) */}
      <Card className="glass">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Stethoscope className="w-5 h-5" />
            Doctor Notes
          </CardTitle>
          <CardDescription>Clinical notes from your healthcare provider</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {patientData?.notes ? (
              <div className="p-4 bg-white/50 dark:bg-white/5 rounded-lg border border-white/20 dark:border-white/10">
                <div className="flex items-start gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                    👨‍⚕️
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold">Dr. Michael Chen</p>
                    <p className="text-xs text-muted-foreground">Cardiology</p>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {patientData.lastUpdated ? new Date(patientData.lastUpdated).toLocaleDateString() : 'Recent'}
                  </p>
                </div>
                <p className="text-sm whitespace-pre-wrap">{patientData.notes}</p>
              </div>
            ) : (
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800/30">
                <p className="text-sm text-blue-900 dark:text-blue-300">
                  No clinical notes available yet. Your doctor will add notes after your next consultation.
                </p>
              </div>
            )}

            {/* Additional simulated notes */}
            <div className="p-4 bg-white/50 dark:bg-white/5 rounded-lg border border-white/20 dark:border-white/10">
              <div className="flex items-start gap-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  👨‍⚕️
                </div>
                <div className="flex-1">
                  <p className="font-semibold">Dr. Michael Chen</p>
                  <p className="text-xs text-muted-foreground">Cardiology</p>
                </div>
                <p className="text-xs text-muted-foreground">2 days ago</p>
              </div>
              <p className="text-sm">Patient responding well to current medication regimen. Blood pressure readings show improvement. Continue current treatment plan and monitor vitals daily.</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Medical Information */}
      <Card className="glass">
        <CardHeader>
          <CardTitle>Medical Information</CardTitle>
          <CardDescription>Your health profile (read-only)</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-white/50 dark:bg-white/5 rounded-lg">
              <p className="text-xs text-muted-foreground">Blood Type</p>
              <p className="font-semibold">{patientData?.bloodType || 'O+'}</p>
            </div>
            <div className="p-3 bg-white/50 dark:bg-white/5 rounded-lg">
              <p className="text-xs text-muted-foreground">Age</p>
              <p className="font-semibold">{patientData?.age || 'N/A'} years</p>
            </div>
            <div className="p-3 bg-white/50 dark:bg-white/5 rounded-lg">
              <p className="text-xs text-muted-foreground">Gender</p>
              <p className="font-semibold">{patientData?.gender || 'N/A'}</p>
            </div>
            <div className="p-3 bg-white/50 dark:bg-white/5 rounded-lg">
              <p className="text-xs text-muted-foreground">Primary Physician</p>
              <p className="font-semibold">Dr. Michael Chen</p>
            </div>
          </div>

          {/* Conditions */}
          {patientData && patientData.conditions.length > 0 && (
            <div>
              <p className="text-sm font-semibold mb-2">Medical Conditions</p>
              <div className="flex flex-wrap gap-2">
                {patientData.conditions.map((condition) => (
                  <Badge key={condition} variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300">
                    {condition}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Active Medications */}
          {patientData && patientData.medications.length > 0 && (
            <div>
              <p className="text-sm font-semibold mb-2">Active Medications</p>
              <div className="space-y-2">
                {patientData.medications.map((med) => (
                  <div key={med.id} className="p-2 bg-white/50 dark:bg-white/5 rounded-lg text-sm">
                    <p className="font-medium">{med.name}</p>
                    <p className="text-xs text-muted-foreground">{med.dosage} - {med.frequency} - {med.reason}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Allergies */}
          {patientData && patientData.allergies.length > 0 && (
            <div className="p-3 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800/30 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <AlertCircle className="w-4 h-4 text-orange-600" />
                <p className="text-sm font-semibold text-orange-900 dark:text-orange-300">Allergies</p>
              </div>
              <p className="text-sm text-orange-800 dark:text-orange-400">{patientData.allergies.join(', ')}</p>
            </div>
          )}
        </CardContent>
      </Card>

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

      {/* Messages from Healthcare Team */}
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

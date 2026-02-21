'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Clock, CheckCircle2, Activity, Users, TrendingUp, Brain } from 'lucide-react';
import { useStore } from '@/lib/store';
import { toast } from 'sonner';
import { PredictiveRiskEngine } from '@/components/ai/predictive-risk-engine';
import { BlockchainTrustBadge } from '@/components/ai/blockchain-trust-badge';
import { CareTwin3D } from '@/components/ai/care-twin-3d';
import { CognitiveLoadMeter } from '@/components/ai/cognitive-load-meter';

export function UnifiedNurseDashboard() {
  const {
    user,
    patients,
    tasks,
    timelineRecords,
    notifications,
    cognitiveMetrics,
    completeTask,
    triggerEmergency,
    createHelpRequest,
    updatePatientRisk,
    markNotificationRead,
    takeBreak,
  } = useStore();

  const [selectedPatient, setSelectedPatient] = useState(patients[0]);
  const [mounted, setMounted] = useState(false);

  // Handle hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  // Initialize mock data if needed
  useEffect(() => {
    if (patients.length === 0) {
      const store = useStore.getState();
      store.initializeMockData();
    }
  }, [patients]);

  // Set selected patient when patients load
  useEffect(() => {
    if (patients.length > 0 && !selectedPatient) {
      setSelectedPatient(patients[0]);
    }
  }, [patients, selectedPatient]);

  // AI Risk Prediction Simulation - Updates every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      patients.forEach((patient) => {
        if (patient.assignedNurse === user?.id) {
          // Simulate risk calculation
          const baseRisk = patient.riskScore;
          const variation = Math.random() * 20 - 10; // -10 to +10
          const newRisk = Math.max(20, Math.min(95, baseRisk + variation));
          
          if (Math.abs(newRisk - baseRisk) > 5) {
            updatePatientRisk(patient.id, Math.round(newRisk));
          }
        }
      });
    }, 10000); // Every 10 seconds

    return () => clearInterval(interval);
  }, [patients, user?.id, updatePatientRisk]);

  if (!mounted || !user) {
    return null;
  }

  // Filter data for current nurse
  const myPatients = patients.filter(p => p.assignedNurse === user.id);
  const myTasks = tasks.filter(t => t.assignedTo === user.id);
  const myNotifications = notifications.filter(n => 
    n.roleTarget.includes(user.role) && !n.read
  );
  const myCognitiveMetrics = cognitiveMetrics[user.id] || {
    nurseId: user.id,
    stressLevel: 0,
    burnoutRisk: 0,
    tasksCompleted: 0,
    hoursWorked: 0,
    breaksTaken: 0,
  };

  // Sort patients by risk score
  const priorityPatients = [...myPatients].sort((a, b) => b.riskScore - a.riskScore);

  // KPI Data
  const criticalTasks = myTasks.filter(t => t.priority === 'critical' && t.status !== 'completed').length;
  const completedToday = myTasks.filter(t => t.status === 'completed').length;

  const kpiData = [
    { label: 'Assigned Patients', value: myPatients.length.toString(), icon: Users, color: 'from-blue-500 to-cyan-500' },
    { label: 'Critical Alerts', value: criticalTasks.toString(), icon: AlertCircle, color: 'from-red-500 to-orange-500' },
    { label: 'Pending Tasks', value: myTasks.filter(t => t.status === 'pending').length.toString(), icon: Activity, color: 'from-purple-500 to-pink-500' },
    { label: 'Completed Today', value: completedToday.toString(), icon: CheckCircle2, color: 'from-green-500 to-emerald-500' }
  ];

  // Handle task completion
  const handleCompleteTask = (taskId: string) => {
    completeTask(taskId, user.name);
    toast.success('Task completed and recorded on blockchain!', {
      description: 'Care timeline updated',
    });
  };

  // Handle emergency
  const handleEmergency = (patientId: string) => {
    if (confirm('Are you sure you want to trigger an emergency alert?')) {
      triggerEmergency(patientId, user.name);
      toast.error('Emergency Alert Triggered!', {
        description: 'All relevant staff have been notified',
      });
    }
  };

  // Handle help request
  const handleHelpRequest = (patientId: string, patientName: string) => {
    createHelpRequest({
      patientId,
      patientName,
      requestedBy: user.name,
      urgency: 'high',
      type: 'Patient Care Assistance',
    });
    toast.info('Help request sent!', {
      description: 'Nearby nurses will be notified',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Nurse Dashboard</h1>
        <p className="text-muted-foreground">Patient care management and AI-powered monitoring</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {kpiData.map((kpi, index) => (
          <motion.div
            key={kpi.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.05, y: -5 }}
          >
            <Card className={`glass p-6 border-2 border-white/10 bg-gradient-to-br ${kpi.color} bg-opacity-10`}>
              <CardContent className="p-0">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">{kpi.label}</p>
                    <p className="text-3xl font-bold">{kpi.value}</p>
                  </div>
                  <div className="p-3 rounded-full bg-white/10">
                    <kpi.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Priority Patients List */}
        <div className="xl:col-span-1">
          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-orange-400" />
                AI Priority Patients
              </CardTitle>
              <CardDescription>Sorted by risk level</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {priorityPatients.map((patient, index) => (
                  <motion.div
                    key={patient.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => setSelectedPatient(patient)}
                    className={`p-4 rounded-lg cursor-pointer transition-all ${
                      patient.riskScore >= 70
                        ? 'bg-red-500/20 border-2 border-red-500/50'
                        : patient.riskScore >= 50
                        ? 'bg-orange-500/20 border-2 border-orange-500/50'
                        : 'bg-green-500/20 border-2 border-green-500/50'
                    } hover:scale-105 ${selectedPatient?.id === patient.id ? 'ring-2 ring-cyan-500' : ''}`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="font-semibold">{patient.name}</p>
                        <p className="text-xs text-muted-foreground">Room {patient.room}</p>
                      </div>
                      <Badge variant="outline" className={
                        patient.riskScore >= 70 ? 'bg-red-500/20 text-red-300 border-red-500/50' :
                        patient.riskScore >= 50 ? 'bg-orange-500/20 text-orange-300 border-orange-500/50' :
                        'bg-green-500/20 text-green-300 border-green-500/50'
                      }>
                        {patient.riskScore}%
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-3">{patient.condition}</p>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        className="flex-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedPatient(patient);
                        }}
                      >
                        View Details
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-orange-500/50 text-orange-400 hover:bg-orange-500/10"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleHelpRequest(patient.id, patient.name);
                        }}
                      >
                        Help
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Predictive Risk Engine */}
        <div className="xl:col-span-2">
          {selectedPatient && (
            <PredictiveRiskEngine
              patientId={selectedPatient.id}
              currentVitals={selectedPatient.vitalSigns}
            />
          )}
        </div>
      </div>

      {/* Tasks Section */}
      <div className="space-y-4">
        <Card className="glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-purple-400" />
              Active Tasks
            </CardTitle>
            <CardDescription>Pending and in-progress missions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {myTasks.filter(t => t.status !== 'completed').map((task, index) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className={`p-4 rounded-lg border-2 ${
                    task.priority === 'critical' ? 'border-red-500/50 bg-red-500/10' :
                    task.priority === 'high' ? 'border-orange-500/50 bg-orange-500/10' :
                    task.priority === 'medium' ? 'border-yellow-500/50 bg-yellow-500/10' :
                    'border-blue-500/50 bg-blue-500/10'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm">{task.title}</h4>
                      <p className="text-xs text-muted-foreground mt-1">{task.patientName}</p>
                    </div>
                    <Badge variant="outline" className={
                      task.priority === 'critical' ? 'bg-red-500/20 text-red-300 border-red-500/50' :
                      task.priority === 'high' ? 'bg-orange-500/20 text-orange-300 border-orange-500/50' :
                      'bg-yellow-500/20 text-yellow-300 border-yellow-500/50'
                    }>
                      {task.priority}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mb-3">{task.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Due: {task.dueTime}</span>
                    <Button
                      size="sm"
                      onClick={() => handleCompleteTask(task.id)}
                      className="bg-green-500 hover:bg-green-600 text-white"
                    >
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      Complete
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 3D Care Twin */}
      {selectedPatient && (
        <div className="space-y-4">
          <CareTwin3D
            patientId={selectedPatient.id}
            patientName={selectedPatient.name}
            affectedAreas={selectedPatient.affectedAreas}
            vitalSigns={selectedPatient.vitalSigns}
          />
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Blockchain Timeline */}
        {selectedPatient && (
          <BlockchainTrustBadge
            patientId={selectedPatient.id}
            records={timelineRecords.filter(r => r.patientId === selectedPatient.id)}
          />
        )}

        {/* Cognitive Load Meter */}
        <CognitiveLoadMeter
          nurseId={user.id}
          nurseName={user.name}
          onBreakRequest={() => takeBreak(user.id)}
        />
      </div>

      {/* Emergency Button */}
      {selectedPatient && (
        <motion.div
          className="fixed bottom-8 right-8 z-50"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.button
            onClick={() => handleEmergency(selectedPatient.id)}
            className="w-20 h-20 rounded-full bg-gradient-to-r from-red-500 to-red-600 shadow-2xl shadow-red-500/50 flex items-center justify-center text-white font-bold text-2xl"
            animate={{
              boxShadow: [
                '0 0 0 0 rgba(239, 68, 68, 0.7)',
                '0 0 0 20px rgba(239, 68, 68, 0)',
                '0 0 0 0 rgba(239, 68, 68, 0)'
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            🚨
          </motion.button>
        </motion.div>
      )}
    </div>
  );
}

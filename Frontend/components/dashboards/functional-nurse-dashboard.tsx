'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, Menu, User, Moon, Sun, AlertCircle, Clock, CheckCircle2, Activity } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useRouter } from 'next/navigation';
import { useStore } from '@/lib/store';
import { toast } from 'sonner';
import { PredictiveRiskEngine } from '@/components/ai/predictive-risk-engine';
import { BlockchainTrustBadge } from '@/components/ai/blockchain-trust-badge';
import { CareTwin3D } from '@/components/ai/care-twin-3d';
import { CognitiveLoadMeter } from '@/components/ai/cognitive-load-meter';
import { RelaxMode } from '@/components/ai/relax-mode';

export function FunctionalNurseDashboard() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const {
    user,
    isLoggedIn,
    logout,
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

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedPatient, setSelectedPatient] = useState(patients[0]);
  const [showRelaxMode, setShowRelaxMode] = useState(false);
  const [shiftTime, setShiftTime] = useState('0:00:00');
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

  // Update shift timer
  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const hours = Math.floor(elapsed / 3600000);
      const minutes = Math.floor((elapsed % 3600000) / 60000);
      const seconds = Math.floor((elapsed % 60000) / 1000);
      setShiftTime(`${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

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
  }, [patients, user, updatePatientRisk]);

  if (!mounted) {
    return null;
  }

  // Show loading if no user yet
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full mx-auto mb-4"
          />
          <p className="text-white text-lg">Loading dashboard...</p>
        </div>
      </div>
    );
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
    { label: 'Assigned Patients', value: myPatients.length.toString(), icon: '👥', color: 'from-blue-500 to-cyan-500' },
    { label: 'Critical Alerts', value: criticalTasks.toString(), icon: '🚨', color: 'from-red-500 to-orange-500' },
    { label: 'Pending Tasks', value: myTasks.filter(t => t.status === 'pending').length.toString(), icon: '📋', color: 'from-purple-500 to-pink-500' },
    { label: 'Completed Today', value: completedToday.toString(), icon: '✅', color: 'from-green-500 to-emerald-500' }
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

  // Handle break
  const handleTakeBreak = () => {
    takeBreak(user.id);
    setShowRelaxMode(true);
    toast.success('Break started', {
      description: 'Take your time to relax',
    });
  };

  // Handle logout
  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      logout();
      toast.success('Logged out successfully');
      router.push('/login');
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        {/* Top Header */}
        <motion.header
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          className="fixed top-0 left-0 right-0 z-40 glass border-b border-white/10"
        >
          <div className="flex items-center justify-between px-6 py-4">
            {/* Left */}
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="text-white hover:bg-white/10"
              >
                <Menu className="w-5 h-5" />
              </Button>
              <div className="flex items-center gap-3">
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 flex items-center justify-center">
                    <span className="text-white font-bold text-sm">CC</span>
                  </div>
                </motion.div>
                <div>
                  <h1 className="text-lg font-bold text-white">CARECOMMAND AI</h1>
                  <Badge variant="outline" className="bg-cyan-500/20 text-cyan-300 border-cyan-500/50 text-xs">
                    Nurse Station
                  </Badge>
                </div>
              </div>
            </div>

            {/* Center - Shift Timer */}
            <motion.div
              className="flex items-center gap-2 px-4 py-2 glass-sm rounded-full"
              animate={{
                boxShadow: ['0 0 0 0 rgba(6, 182, 212, 0.4)', '0 0 0 8px rgba(6, 182, 212, 0)', '0 0 0 0 rgba(6, 182, 212, 0)']
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Clock className="w-4 h-4 text-cyan-400" />
              <span className="text-white font-mono font-semibold">{shiftTime}</span>
              <span className="text-xs text-slate-400">Shift Time</span>
            </motion.div>

            {/* Right */}
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                className="relative text-white hover:bg-white/10"
                onClick={() => {
                  myNotifications.forEach(n => markNotificationRead(n.id));
                }}
              >
                <Bell className="w-5 h-5" />
                {myNotifications.length > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs flex items-center justify-center text-white font-bold"
                  >
                    {myNotifications.length}
                  </motion.span>
                )}
              </Button>

              {mounted && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                  className="text-white hover:bg-white/10"
                >
                  {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </Button>
              )}

              <div className="flex items-center gap-2 px-3 py-2 glass-sm rounded-full">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <span className="text-white text-sm font-medium">{user.name}</span>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-red-400 hover:bg-red-500/10"
              >
                Logout
              </Button>
            </div>
          </div>
        </motion.header>

        {/* Sidebar */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.aside
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              className="fixed left-0 top-20 bottom-0 w-64 glass border-r border-white/10 z-30 overflow-y-auto"
            >
              <nav className="p-4 space-y-2">
                {[
                  { icon: '📊', label: 'Dashboard', active: true, onClick: () => {} },
                  { icon: '🎯', label: 'My Missions', active: false, onClick: () => {} },
                  { icon: '🧍', label: 'Care Twin Timeline', active: false, onClick: () => {} },
                  { icon: '🧠', label: 'AI Risk Monitor', active: false, onClick: () => {} },
                  { icon: '🤝', label: 'Help Request', active: false, onClick: () => {} },
                  { icon: '🔄', label: 'Shift Handoff', active: false, onClick: () => {} },
                  { icon: '🧘', label: 'Mental Relief', active: false, onClick: handleTakeBreak },
                  { icon: '⚙️', label: 'Settings', active: false, onClick: () => {} }
                ].map((item, index) => (
                  <motion.button
                    key={item.label}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={item.onClick}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                      item.active
                        ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/50'
                        : 'text-slate-400 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <span className="text-xl">{item.icon}</span>
                    <span className="font-medium">{item.label}</span>
                  </motion.button>
                ))}
              </nav>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <main className={`pt-24 pb-8 transition-all duration-300 ${sidebarOpen ? 'pl-72' : 'pl-8'} pr-8`}>
          {/* Hero Tagline */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 text-center"
          >
            <p className="text-cyan-400 text-lg font-medium">
              "AI-Driven Care. Blockchain-Secured Trust."
            </p>
          </motion.div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {kpiData.map((kpi, index) => (
              <motion.div
                key={kpi.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <Card className={`glass p-6 border-2 border-white/10 bg-gradient-to-br ${kpi.color} bg-opacity-10 float-animation`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-300 mb-1">{kpi.label}</p>
                      <p className="text-4xl font-bold text-white">{kpi.value}</p>
                    </div>
                    <div className="text-5xl">{kpi.icon}</div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
            {/* Priority Patients List */}
            <div className="xl:col-span-1">
              <Card className="glass p-6">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-orange-400" />
                  🧠 AI Priority Patients
                </h3>
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
                          ? 'bg-red-500/20 border-2 border-red-500/50 risk-pulse'
                          : patient.riskScore >= 50
                          ? 'bg-orange-500/20 border-2 border-orange-500/50'
                          : 'bg-green-500/20 border-2 border-green-500/50'
                      } hover:scale-105 ${selectedPatient?.id === patient.id ? 'ring-2 ring-cyan-500' : ''}`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <p className="font-semibold text-white">{patient.name}</p>
                          <p className="text-xs text-slate-400">Room {patient.room}</p>
                        </div>
                        <Badge variant="outline" className={
                          patient.riskScore >= 70 ? 'bg-red-500/20 text-red-300 border-red-500/50' :
                          patient.riskScore >= 50 ? 'bg-orange-500/20 text-orange-300 border-orange-500/50' :
                          'bg-green-500/20 text-green-300 border-green-500/50'
                        }>
                          {patient.riskScore}%
                        </Badge>
                      </div>
                      <p className="text-xs text-slate-400 mb-3">{patient.condition}</p>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          className="flex-1 bg-cyan-500 hover:bg-cyan-600 text-white"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedPatient(patient);
                          }}
                        >
                          View Mission
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
          <div className="mb-8">
            <Card className="glass p-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5 text-purple-400" />
                📋 Active Tasks
              </h3>
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
                        <h4 className="font-semibold text-white text-sm">{task.title}</h4>
                        <p className="text-xs text-slate-400 mt-1">{task.patientName}</p>
                      </div>
                      <Badge variant="outline" className={
                        task.priority === 'critical' ? 'bg-red-500/20 text-red-300 border-red-500/50' :
                        task.priority === 'high' ? 'bg-orange-500/20 text-orange-300 border-orange-500/50' :
                        'bg-yellow-500/20 text-yellow-300 border-yellow-500/50'
                      }>
                        {task.priority}
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-400 mb-3">{task.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-500">Due: {task.dueTime}</span>
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
            </Card>
          </div>

          {/* 3D Care Twin */}
          {selectedPatient && (
            <div className="mb-8">
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
              onBreakRequest={handleTakeBreak}
            />
          </div>
        </main>

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

      {/* Relax Mode Modal */}
      <RelaxMode isOpen={showRelaxMode} onClose={() => setShowRelaxMode(false)} />
    </>
  );
}

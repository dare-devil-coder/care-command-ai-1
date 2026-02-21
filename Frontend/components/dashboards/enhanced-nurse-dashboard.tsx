'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, Menu, User, Moon, Sun, AlertCircle, Clock, CheckCircle2 } from 'lucide-react';
import { useTheme } from 'next-themes';
import { PredictiveRiskEngine } from '@/components/ai/predictive-risk-engine';
import { BlockchainTrustBadge } from '@/components/ai/blockchain-trust-badge';
import { CareTwin3D } from '@/components/ai/care-twin-3d';
import { CognitiveLoadMeter } from '@/components/ai/cognitive-load-meter';
import { RelaxMode } from '@/components/ai/relax-mode';

// Mock data
const mockPatient = {
  id: 'P001',
  name: 'Sarah Johnson',
  age: 45,
  room: '302-A',
  condition: 'Post-Surgery Recovery',
  vitalSigns: {
    heartRate: 88,
    bloodPressure: '125/80',
    temperature: 37.2,
    oxygenSaturation: 96,
    respiratoryRate: 16
  },
  affectedAreas: [
    {
      name: 'Cardiovascular',
      severity: 'medium' as const,
      description: 'Slightly elevated heart rate, monitoring required',
      icon: '❤️'
    },
    {
      name: 'Respiratory',
      severity: 'low' as const,
      description: 'Normal breathing pattern, oxygen levels stable',
      icon: '🫁'
    }
  ]
};

const mockCareRecords = [
  {
    id: '1',
    timestamp: new Date().toISOString(),
    action: 'Vital signs checked',
    performedBy: 'Nurse Emily',
    verified: true,
    blockchainHash: '0x7f9fade1c0d57a7af66ab4ead79fade1c0d57a7af66ab4ead7c2c2eb7b11a91385'
  },
  {
    id: '2',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    action: 'Medication administered',
    performedBy: 'Nurse Emily',
    verified: true,
    blockchainHash: '0x3c2c2eb7b11a91385f9fade1c0d57a7af66ab4ead79fade1c0d57a7af66ab4ead7'
  },
  {
    id: '3',
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    action: 'Patient assessment completed',
    performedBy: 'Dr. Smith',
    verified: true,
    blockchainHash: '0x91385f9fade1c0d57a7af66ab4ead79fade1c0d57a7af66ab4ead73c2c2eb7b11a'
  }
];

export function EnhancedNurseDashboard() {
  const { theme, setTheme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedPatient, setSelectedPatient] = useState(mockPatient);
  const [showRelaxMode, setShowRelaxMode] = useState(false);
  const [notifications, setNotifications] = useState(3);
  const [shiftTime, setShiftTime] = useState('4:32:15');
  const [mounted, setMounted] = useState(false);

  // Handle hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  const kpiData = [
    { label: 'Assigned Patients', value: '8', icon: '👥', color: 'from-blue-500 to-cyan-500' },
    { label: 'Critical Alerts', value: '2', icon: '🚨', color: 'from-red-500 to-orange-500' },
    { label: 'Pending Missions', value: '5', icon: '📋', color: 'from-purple-500 to-pink-500' },
    { label: 'Completed Today', value: '12', icon: '✅', color: 'from-green-500 to-emerald-500' }
  ];

  const priorityPatients = [
    { id: 'P001', name: 'Sarah Johnson', room: '302-A', risk: 65, condition: 'Post-Surgery' },
    { id: 'P002', name: 'Michael Chen', room: '305-B', risk: 82, condition: 'Cardiac Monitor' },
    { id: 'P003', name: 'Emma Davis', room: '301-C', risk: 45, condition: 'Recovery' }
  ];

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
              >
                <Bell className="w-5 h-5" />
                {notifications > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs flex items-center justify-center text-white font-bold"
                  >
                    {notifications}
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
                <span className="text-white text-sm font-medium">Nurse Emily</span>
              </div>
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
                  { icon: '📊', label: 'Dashboard', active: true },
                  { icon: '🎯', label: 'My Missions', active: false },
                  { icon: '🧍', label: 'Care Twin Timeline', active: false },
                  { icon: '🧠', label: 'AI Risk Monitor', active: false },
                  { icon: '🤝', label: 'Help Request', active: false },
                  { icon: '🔄', label: 'Shift Handoff', active: false },
                  { icon: '🧘', label: 'Mental Relief', active: false },
                  { icon: '⚙️', label: 'Settings', active: false }
                ].map((item, index) => (
                  <motion.button
                    key={item.label}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
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
                      onClick={() => setSelectedPatient(mockPatient)}
                      className={`p-4 rounded-lg cursor-pointer transition-all ${
                        patient.risk >= 70
                          ? 'bg-red-500/20 border-2 border-red-500/50 risk-pulse'
                          : patient.risk >= 50
                          ? 'bg-orange-500/20 border-2 border-orange-500/50'
                          : 'bg-green-500/20 border-2 border-green-500/50'
                      } hover:scale-105`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <p className="font-semibold text-white">{patient.name}</p>
                          <p className="text-xs text-slate-400">Room {patient.room}</p>
                        </div>
                        <Badge variant="outline" className={
                          patient.risk >= 70 ? 'bg-red-500/20 text-red-300 border-red-500/50' :
                          patient.risk >= 50 ? 'bg-orange-500/20 text-orange-300 border-orange-500/50' :
                          'bg-green-500/20 text-green-300 border-green-500/50'
                        }>
                          {patient.risk}%
                        </Badge>
                      </div>
                      <p className="text-xs text-slate-400">{patient.condition}</p>
                      <Button size="sm" className="w-full mt-3 bg-cyan-500 hover:bg-cyan-600 text-white">
                        View Mission
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Predictive Risk Engine */}
            <div className="xl:col-span-2">
              <PredictiveRiskEngine
                patientId={selectedPatient.id}
                currentVitals={selectedPatient.vitalSigns}
              />
            </div>
          </div>

          {/* 3D Care Twin */}
          <div className="mb-8">
            <CareTwin3D
              patientId={selectedPatient.id}
              patientName={selectedPatient.name}
              affectedAreas={selectedPatient.affectedAreas}
              vitalSigns={selectedPatient.vitalSigns}
            />
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {/* Blockchain Timeline */}
            <BlockchainTrustBadge
              patientId={selectedPatient.id}
              records={mockCareRecords}
            />

            {/* Cognitive Load Meter */}
            <CognitiveLoadMeter
              nurseId="N001"
              nurseName="Nurse Emily"
              onBreakRequest={() => setShowRelaxMode(true)}
            />
          </div>
        </main>

        {/* Emergency Button */}
        <motion.div
          className="fixed bottom-8 right-8 z-50"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.button
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
      </div>

      {/* Relax Mode Modal */}
      <RelaxMode isOpen={showRelaxMode} onClose={() => setShowRelaxMode(false)} />
    </>
  );
}

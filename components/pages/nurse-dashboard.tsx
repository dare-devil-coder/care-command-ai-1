'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { mockPatients } from '@/lib/mock-patients';
import { AlertCircle, Bell, LogOut, Menu, Camera } from 'lucide-react';
import QRScanner from '@/components/shared/qr-scanner';
import { calculateDynamicRiskScore, calculateCognitiveLoad, generatePredictiveAlerts, generateSmartNurseAssignment, generateAIHandoffSummary } from '@/lib/ai';

interface NurseDashboardProps {
  onNavigate: (page: 'nurse' | 'mission' | 'timeline' | 'admin' | 'break', patientId?: string) => void;
  onLogout: () => void;
  onStartMission: (patientId: string) => void;
}

export default function NurseDashboard({ onNavigate, onLogout, onStartMission }: NurseDashboardProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showEmergencyOverlay, setShowEmergencyOverlay] = useState(false);
  const [showHandoffModal, setShowHandoffModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showScanModal, setShowScanModal] = useState(false);
  const [scannedPatientId, setScannedPatientId] = useState<string | null>(null);
  const [scannedPatient, setScannedPatient] = useState<any>(null);
  const [emergencyCount] = useState(1);

  // Calculate dynamic cognitive load - safely handle patients
  const cognitiveLoad = mockPatients ? calculateCognitiveLoad(mockPatients, [], emergencyCount) : { score: 50, level: 'Moderate', breakdown: {}, recommendation: 'Loading workload...' };
  const workloadScore = cognitiveLoad.score;

  const handleEmergencyClick = () => {
    setShowEmergencyOverlay(true);
    setTimeout(() => setShowEmergencyOverlay(false), 2000);
  };

  const generateHandoffSummary = () => {
    return generateAIHandoffSummary(mockPatients, [], [], emergencyCount);
  };

  const calculateHelpMatch = () => {
    const mockNurses = [
      { id: 'n1', name: 'Sarah Chen', specialization: 'Critical Care', username: 'schen', password: '', email: 'schen@care.com', role: 'nurse' as const },
      { id: 'n2', name: 'James Wilson', specialization: 'Pediatrics', username: 'jwilson', password: '', email: 'jwilson@care.com', role: 'nurse' as const },
      { id: 'n3', name: 'Maria Garcia', specialization: 'Critical Care', username: 'mgarcia', password: '', email: 'mgarcia@care.com', role: 'nurse' as const },
    ];
    
    const nurseWorkloads = { 'n1': 45, 'n2': 60, 'n3': 55 };
    
    // Create a mock task
    const mockTask = {
      id: 'help-request',
      title: 'Assist with patient care',
      description: 'Additional nursing support needed',
      patientId: '1',
      assignedTo: '',
      priority: 'high' as const,
      status: 'pending' as const,
      dueDate: Date.now(),
      createdBy: 'nurse',
      createdAt: Date.now()
    };
    
    const assignment = generateSmartNurseAssignment(mockTask, mockNurses, nurseWorkloads);
    
    if (assignment) {
      return {
        name: assignment.nurse.name,
        workload: nurseWorkloads[assignment.nurse.id] || 50,
        skills: [assignment.nurse.specialization || 'General Care'],
        match: assignment.totalScore
      };
    }
    
    return {
      name: 'Sarah Chen',
      workload: 45,
      skills: ['Critical Care', 'IV Therapy'],
      match: 87
    };
  };

  const handleQRScan = (qrCode: string) => {
    // Simulate QR code mapping to patient ID
    const patientIndex = parseInt(qrCode.replace(/\D/g, '')) % mockPatients.length;
    const patient = mockPatients[patientIndex];
    setScannedPatient(patient);
    setScannedPatientId(patient.id);
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? 'w-64' : 'w-0'
        } bg-slate-900/80 backdrop-blur-md border-r border-slate-700/50 transition-all duration-300 overflow-hidden flex flex-col`}
      >
        <div className="p-6">
          <h1 className="text-2xl font-bold text-blue-300">CareCommand</h1>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          {[
            { icon: '📊', label: 'Dashboard', id: 'nurse' },
            { icon: '👥', label: 'My Patients', id: 'patients' },
            { icon: '🎯', label: 'Missions', id: 'missions' },
            { icon: '📈', label: 'Care Timeline', id: 'timeline' },
            { icon: '🧠', label: 'Cognitive Load', id: 'cognitive' },
            { icon: '❓', label: 'Help Request', id: 'help' },
            { icon: '🤝', label: 'Shift Handoff', id: 'handoff' },
            { icon: '🧘', label: 'Break Mode', id: 'break' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => {
                if (item.id === 'break') onNavigate('break');
                if (item.id === 'timeline') onNavigate('timeline', mockPatients[0].id);
                if (item.id === 'handoff') setShowHandoffModal(true);
                if (item.id === 'help') setShowHelpModal(true);
              }}
              className="w-full flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-slate-800/50 text-slate-300 hover:text-white transition-colors"
            >
              <span className="text-xl">{item.icon}</span>
              <span className="text-sm font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-700/50">
          <Button
            onClick={onLogout}
            variant="outline"
            className="w-full flex items-center gap-2 border-slate-700 text-slate-300 hover:bg-red-500/10 hover:text-red-400"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="h-16 bg-slate-900/50 backdrop-blur-md border-b border-slate-700/50 flex items-center justify-between px-6">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-2 hover:bg-slate-800/50 rounded-lg text-slate-300"
          >
            <Menu className="w-6 h-6" />
          </button>

          <div className="flex items-center gap-4">
            {/* Scan Patient Button */}
            <button
              onClick={() => setShowScanModal(true)}
              className="p-2 hover:bg-slate-800/50 rounded-lg text-slate-300 hover:text-blue-300 transition-colors"
              title="Scan patient QR code"
            >
              <Camera className="w-6 h-6" />
            </button>

            {/* Notifications */}
            <button className="relative p-2 hover:bg-slate-800/50 rounded-lg text-slate-300 transition-colors">
              <Bell className="w-6 h-6" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-yellow-400 rounded-full"></span>
            </button>

            {/* Emergency Button */}
            <button
              onClick={handleEmergencyClick}
              className="relative w-12 h-12 rounded-full bg-gradient-to-r from-red-600 to-red-700 text-white font-bold hover:shadow-lg hover:shadow-red-500/50 transition-all animate-pulse"
            >
              SOS
            </button>

            {/* Profile Avatar */}
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold">
              N
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-auto p-6 space-y-6">
          {/* Welcome Section */}
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">Good Morning, Nurse</h2>
            <p className="text-slate-400">5 patients assigned | 3 critical cases</p>
          </div>

          {/* Cognitive Load Panel */}
          <Card className="bg-slate-800/50 border-slate-700/50 p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-semibold text-white mb-2">AI Cognitive Load Analysis</h3>
                <p className="text-3xl font-bold text-blue-300">{workloadScore}/100</p>
                <p className={`text-sm font-semibold mt-2 ${
                  cognitiveLoad.level === 'Critical' ? 'text-red-400' :
                  cognitiveLoad.level === 'High' ? 'text-yellow-400' :
                  'text-green-400'
                }`}>
                  Level: {cognitiveLoad.level}
                </p>
              </div>
              <div className="text-right">
                <div className="text-sm text-slate-400 mb-2">Workload Stress</div>
                <div className="w-32 h-3 bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all ${
                      workloadScore >= 80 ? 'bg-gradient-to-r from-red-600 to-red-500' :
                      workloadScore >= 60 ? 'bg-gradient-to-r from-yellow-500 to-yellow-400' :
                      'bg-gradient-to-r from-green-500 to-green-400'
                    }`}
                    style={{ width: `${workloadScore}%` }}
                  ></div>
                </div>
              </div>
            </div>
            
            {/* Breakdown Details */}
            <div className="grid grid-cols-2 gap-2 mb-4 text-sm">
              <div className="bg-slate-900/50 p-2 rounded border border-slate-700/50">
                <p className="text-slate-400 text-xs">Patients</p>
                <p className="font-bold text-slate-200">{cognitiveLoad.breakdown['Patient Count Load'] || 0} pts</p>
              </div>
              <div className="bg-slate-900/50 p-2 rounded border border-slate-700/50">
                <p className="text-slate-400 text-xs">Critical Patients</p>
                <p className="font-bold text-red-400">{cognitiveLoad.breakdown['Critical Patients'] || 0} pts</p>
              </div>
              <div className="bg-slate-900/50 p-2 rounded border border-slate-700/50">
                <p className="text-slate-400 text-xs">Pending Tasks</p>
                <p className="font-bold text-slate-200">{cognitiveLoad.breakdown['Pending Tasks'] || 0} pts</p>
              </div>
              <div className="bg-slate-900/50 p-2 rounded border border-slate-700/50">
                <p className="text-slate-400 text-xs">Emergency Freq</p>
                <p className="font-bold text-yellow-400">{cognitiveLoad.breakdown['Emergency Frequency'] || 0} pts</p>
              </div>
            </div>

            <div className={`mt-4 p-3 rounded-lg border ${
              cognitiveLoad.level === 'Critical' ? 'bg-red-500/20 border-red-500/50' :
              cognitiveLoad.level === 'High' ? 'bg-yellow-500/20 border-yellow-500/50' :
              'bg-blue-500/20 border-blue-500/50'
            }`}>
              <p className={`text-sm ${
                cognitiveLoad.level === 'Critical' ? 'text-red-300' :
                cognitiveLoad.level === 'High' ? 'text-yellow-300' :
                'text-blue-300'
              }`}>
                <span className="font-semibold">AI Recommendation: </span>{cognitiveLoad.recommendation}
              </p>
            </div>
          </Card>

          {/* Priority Patient List */}
          <div>
            <h3 className="text-xl font-semibold text-white mb-4">AI Priority Patient List</h3>
            <div className="grid gap-4">
              {mockPatients.map((patient) => {
                const risk = calculateDynamicRiskScore(patient);
                const alerts = generatePredictiveAlerts(patient);
                
                return (
                <Card
                  key={patient.id}
                  className={`bg-slate-800/50 border p-6 transition-all hover:shadow-lg cursor-pointer ${
                    risk.level === 'Critical'
                      ? 'border-red-500/70 shadow-lg shadow-red-500/20 animate-pulse'
                      : risk.level === 'Moderate'
                      ? 'border-yellow-500/70 shadow-lg shadow-yellow-500/20'
                      : 'border-slate-700/50'
                  }`}
                  onClick={() => onStartMission(patient.id)}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="text-lg font-semibold text-white">{patient.name}</h4>
                      <p className="text-slate-400">Room {patient.room} • {patient.age} years old</p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      risk.level === 'Critical'
                        ? 'bg-red-500/20 text-red-300 border border-red-500/50'
                        : risk.level === 'Moderate'
                        ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/50'
                        : 'bg-green-500/20 text-green-300 border border-green-500/50'
                    }`}>
                      {risk.level} (Score: {risk.score})
                    </div>
                  </div>

                  <p className="text-slate-300 mb-4">{patient.diagnosis}</p>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
                    <div className="bg-slate-900/50 p-2 rounded">
                      <p className="text-xs text-slate-500">BP</p>
                      <p className="text-sm font-semibold text-slate-300">{patient.vital.bloodPressure}</p>
                    </div>
                    <div className="bg-slate-900/50 p-2 rounded">
                      <p className="text-xs text-slate-500">HR</p>
                      <p className="text-sm font-semibold text-slate-300">{patient.vital.heartRate}</p>
                    </div>
                    <div className="bg-slate-900/50 p-2 rounded">
                      <p className="text-xs text-slate-500">O2</p>
                      <p className="text-sm font-semibold text-slate-300">{patient.vital.oxygen}%</p>
                    </div>
                    <div className="bg-slate-900/50 p-2 rounded">
                      <p className="text-xs text-slate-500">Temp</p>
                      <p className="text-sm font-semibold text-slate-300">{patient.vital.temperature}°C</p>
                    </div>
                  </div>

                  {/* AI Predictive Alerts */}
                  {alerts.length > 0 && (
                    <div className="mb-4 space-y-2">
                      {alerts.slice(0, 2).map((alert, idx) => (
                        <div key={idx} className={`p-2 rounded text-xs ${alert.severity === 'critical' ? 'bg-red-500/20 text-red-300' : 'bg-yellow-500/20 text-yellow-300'}`}>
                          <p className="font-semibold">{alert.timeframe}: {alert.alert}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        onStartMission(patient.id);
                      }}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      Start Mission
                    </Button>
                    {risk.level === 'Critical' && (
                      <Button
                        variant="outline"
                        className="border-red-500/50 text-red-400 hover:bg-red-500/10"
                      >
                        <AlertCircle className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </Card>
              );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Emergency Overlay */}
      {showEmergencyOverlay && (
        <div className="fixed inset-0 bg-red-600/40 backdrop-blur-sm flex items-center justify-center z-50 animate-pulse">
          <div className="bg-red-900 border-4 border-red-500 rounded-2xl p-12 text-center">
            <div className="text-6xl mb-4">🚨</div>
            <h2 className="text-4xl font-bold text-white mb-2">Emergency Alert Sent</h2>
            <p className="text-red-200 text-lg">All available staff notified</p>
          </div>
        </div>
      )}

      {/* Shift Handoff Modal */}
      {showHandoffModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <Card className="bg-slate-900 border-slate-700 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-white mb-2">Shift Handoff Summary</h2>
              <p className="text-slate-400 mb-6">AI-generated summary for incoming shift</p>
              
              {(() => {
                const handoff = generateHandoffSummary();
                return (
                  <>
                    <div className="space-y-4 mb-6">
                      <div className="grid grid-cols-2 gap-3 mb-4">
                        <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
                          <p className="text-sm text-slate-400">Total Patients</p>
                          <p className="text-2xl font-bold text-blue-400">{handoff.stats.totalPatients}</p>
                        </div>
                        <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
                          <p className="text-sm text-slate-400">Critical</p>
                          <p className="text-2xl font-bold text-red-400">{handoff.stats.criticalPatients}</p>
                        </div>
                        <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
                          <p className="text-sm text-slate-400">Moderate</p>
                          <p className="text-2xl font-bold text-yellow-400">{handoff.stats.moderatePatients}</p>
                        </div>
                        <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
                          <p className="text-sm text-slate-400">Pending Tasks</p>
                          <p className="text-2xl font-bold text-cyan-400">{handoff.stats.pendingTasks}</p>
                        </div>
                      </div>
                      
                      <div className="bg-blue-500/20 border border-blue-500/50 p-4 rounded-lg">
                        <p className="text-sm text-slate-400 mb-2 font-semibold">Handoff Summary</p>
                        <p className="text-slate-300">{handoff.summary}</p>
                      </div>

                      <div className="bg-green-500/20 border border-green-500/50 p-4 rounded-lg">
                        <p className="text-sm text-slate-400 mb-3 font-semibold">Key Recommendations</p>
                        <ul className="text-slate-300 text-sm space-y-2">
                          {handoff.recommendations.map((rec, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <span className="text-green-400 font-bold">✓</span>
                              <span>{rec}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    <Button
                      onClick={() => setShowHandoffModal(false)}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      Close
                    </Button>
                  </>
                );
              })()}
            </div>
          </Card>
        </div>
      )}

      {/* Help Request Modal */}
      {showHelpModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <Card className="bg-slate-900 border-slate-700 max-w-md w-full mx-4">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-white mb-2">Help Request - Smart Match</h2>
              <p className="text-slate-400 mb-6">Best available nurse for support</p>
              
              {(() => {
                const match = calculateHelpMatch();
                return (
                  <>
                    <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 p-6 rounded-lg border border-blue-500/50 mb-6">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold">
                          {match.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-white">{match.name}</p>
                          <p className="text-sm text-slate-300">Match Score: {match.match}%</p>
                        </div>
                      </div>
                      <p className="text-sm text-slate-300 mb-3">Current Workload: {match.workload}%</p>
                      <p className="text-xs text-slate-400">Specialized in: {match.skills.join(', ')}</p>
                    </div>
                    <p className="text-sm text-slate-400 mb-6">
                      Matched based on workload (70%) and skill alignment (30%)
                    </p>
                    <Button
                      onClick={() => setShowHelpModal(false)}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      Close
                    </Button>
                  </>
                );
              })()}
            </div>
          </Card>
        </div>
      )}

      {/* QR Scanner Modal */}
      {showScanModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <Card className="bg-slate-900 border-slate-700 max-w-2xl w-full mx-4">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-white mb-2">Scan Patient QR Code</h2>
              <p className="text-slate-400 mb-6">Point camera at patient wristband</p>
              
              {scannedPatient ? (
                <div className="space-y-4">
                  <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-4 mb-4">
                    <p className="text-green-400 font-semibold">Patient Scanned Successfully!</p>
                  </div>
                  <Card className="bg-slate-800/50 border-slate-700 p-4">
                    <h3 className="text-lg font-semibold text-white mb-3">{scannedPatient.name}</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-slate-400">Room</p>
                        <p className="text-white font-semibold">{scannedPatient.room}</p>
                      </div>
                      <div>
                        <p className="text-slate-400">Age</p>
                        <p className="text-white font-semibold">{scannedPatient.age}</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-slate-400">Diagnosis</p>
                        <p className="text-white font-semibold">{scannedPatient.diagnosis}</p>
                      </div>
                    </div>
                  </Card>
                  <div className="flex gap-3">
                    <Button
                      onClick={() => {
                        onStartMission(scannedPatient.id);
                        setShowScanModal(false);
                        setScannedPatient(null);
                      }}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      Start Mission
                    </Button>
                    <Button
                      onClick={() => {
                        setShowScanModal(false);
                        setScannedPatient(null);
                        setScannedPatientId(null);
                      }}
                      variant="outline"
                      className="flex-1 border-slate-700 text-slate-300"
                    >
                      Close
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-slate-800/50 rounded-lg overflow-hidden">
                    <QRScanner
                      onScanSuccess={handleQRScan}
                      onScanError={(error) => console.error('Scan error:', error)}
                    />
                  </div>
                  <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
                    <p className="text-sm text-slate-400 mb-3">Or simulate scan:</p>
                    <Button
                      onClick={() => {
                        const randomPatient = mockPatients[Math.floor(Math.random() * mockPatients.length)];
                        setScannedPatient(randomPatient);
                        setScannedPatientId(randomPatient.id);
                      }}
                      className="w-full bg-slate-700 hover:bg-slate-600 text-white"
                    >
                      Simulate QR Scan
                    </Button>
                  </div>
                  <Button
                    onClick={() => setShowScanModal(false)}
                    variant="outline"
                    className="w-full border-slate-700 text-slate-300"
                  >
                    Close
                  </Button>
                </div>
              )}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

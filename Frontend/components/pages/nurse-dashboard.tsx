'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { mockPatients } from '@/lib/mock-patients';
import { AlertCircle, Bell, LogOut, Menu } from 'lucide-react';

interface NurseDashboardProps {
  onNavigate: (page: 'nurse' | 'mission' | 'timeline' | 'admin' | 'break', patientId?: string) => void;
  onLogout: () => void;
  onStartMission: (patientId: string) => void;
}

export default function NurseDashboard({ onNavigate, onLogout, onStartMission }: NurseDashboardProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [workloadScore] = useState(70);
  const [showEmergencyOverlay, setShowEmergencyOverlay] = useState(false);

  const handleEmergencyClick = () => {
    setShowEmergencyOverlay(true);
    setTimeout(() => setShowEmergencyOverlay(false), 2000);
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
                <h3 className="font-semibold text-white mb-2">Cognitive Load</h3>
                <p className="text-3xl font-bold text-blue-300">{workloadScore}/100</p>
              </div>
              <div className="text-right">
                <div className="text-sm text-slate-400 mb-2">Stress Level</div>
                <div className="w-32 h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-green-500 to-yellow-500 transition-all"
                    style={{ width: `${workloadScore}%` }}
                  ></div>
                </div>
              </div>
            </div>
            <div className="mt-4 p-3 bg-blue-500/20 border border-blue-500/50 rounded-lg">
              <p className="text-sm text-blue-300">
                AI Suggestion: Consider short break. Your stress level is optimal.
              </p>
            </div>
          </Card>

          {/* Priority Patient List */}
          <div>
            <h3 className="text-xl font-semibold text-white mb-4">AI Priority Patient List</h3>
            <div className="grid gap-4">
              {mockPatients.map((patient) => (
                <Card
                  key={patient.id}
                  className={`bg-slate-800/50 border p-6 transition-all hover:shadow-lg cursor-pointer ${
                    patient.riskLevel === 'Critical'
                      ? 'border-red-500/70 shadow-lg shadow-red-500/20 animate-pulse'
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
                      patient.riskLevel === 'Critical'
                        ? 'bg-red-500/20 text-red-300 border border-red-500/50'
                        : patient.riskLevel === 'Moderate'
                        ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/50'
                        : 'bg-green-500/20 text-green-300 border border-green-500/50'
                    }`}>
                      {patient.riskLevel}
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
                    {patient.riskLevel === 'Critical' && (
                      <Button
                        variant="outline"
                        className="border-red-500/50 text-red-400 hover:bg-red-500/10"
                      >
                        <AlertCircle className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </Card>
              ))}
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
    </div>
  );
}

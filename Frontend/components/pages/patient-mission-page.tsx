'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { mockPatients, mockMissions, Mission } from '@/lib/mock-patients';
import { ChevronUp, ChevronDown, ArrowLeft } from 'lucide-react';

interface PatientMissionPageProps {
  patientId: string;
  onNavigate: (page: 'nurse' | 'mission' | 'timeline' | 'admin' | 'break', patientId?: string) => void;
  onLogout: () => void;
}

export default function PatientMissionPage({ patientId, onNavigate, onLogout }: PatientMissionPageProps) {
  const patient = mockPatients.find(p => p.id === patientId) || mockPatients[0];
  const [missions, setMissions] = useState<Mission[]>(mockMissions);
  const [expandedMission, setExpandedMission] = useState<string | null>(null);

  const handleMissionStart = (missionId: string) => {
    setMissions(missions.map(m => 
      m.id === missionId ? { ...m, status: 'in-progress' } : m
    ));
  };

  const handleMissionComplete = (missionId: string) => {
    setMissions(missions.map(m =>
      m.id === missionId ? { ...m, status: 'completed' } : m
    ));
  };

  const completedCount = missions.filter(m => m.status === 'completed').length;

  return (
    <div className="min-h-screen bg-background text-foreground p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={() => onNavigate('nurse')}
          className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Dashboard
        </button>
        <Button onClick={onLogout} variant="outline" className="border-slate-700 text-slate-300">
          Logout
        </Button>
      </div>

      <div className="max-w-4xl mx-auto space-y-6">
        {/* Patient Info Card */}
        <Card className="bg-gradient-to-r from-blue-900/40 to-cyan-900/40 border-blue-500/50 backdrop-blur-sm p-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h1 className="text-4xl font-bold text-white mb-4">{patient.name}</h1>
              <div className="space-y-3 text-slate-300">
                <p className="flex justify-between">
                  <span>Age:</span>
                  <span className="font-semibold text-white">{patient.age} years</span>
                </p>
                <p className="flex justify-between">
                  <span>Room:</span>
                  <span className="font-semibold text-white">{patient.room}</span>
                </p>
                <p className="flex justify-between">
                  <span>Diagnosis:</span>
                  <span className="font-semibold text-white">{patient.diagnosis}</span>
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-slate-400 mb-4">CURRENT VITALS</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-800/50 p-3 rounded-lg">
                  <p className="text-xs text-slate-500">Blood Pressure</p>
                  <p className="text-lg font-bold text-white">{patient.vital.bloodPressure}</p>
                </div>
                <div className="bg-slate-800/50 p-3 rounded-lg">
                  <p className="text-xs text-slate-500">Heart Rate</p>
                  <p className="text-lg font-bold text-white">{patient.vital.heartRate} bpm</p>
                </div>
                <div className="bg-slate-800/50 p-3 rounded-lg">
                  <p className="text-xs text-slate-500">O2 Saturation</p>
                  <p className="text-lg font-bold text-white">{patient.vital.oxygen}%</p>
                </div>
                <div className="bg-slate-800/50 p-3 rounded-lg">
                  <p className="text-xs text-slate-500">Temperature</p>
                  <p className="text-lg font-bold text-white">{patient.vital.temperature}°C</p>
                </div>
              </div>

              {/* Risk Score */}
              <div className="mt-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-slate-400">Risk Score</span>
                  <span className={`text-2xl font-bold ${
                    patient.riskScore > 70 ? 'text-red-400' : patient.riskScore > 40 ? 'text-yellow-400' : 'text-green-400'
                  }`}>
                    {patient.riskScore}
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all ${
                      patient.riskScore > 70
                        ? 'bg-red-500'
                        : patient.riskScore > 40
                        ? 'bg-yellow-500'
                        : 'bg-green-500'
                    }`}
                    style={{ width: `${patient.riskScore}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Mission Progress */}
        <div className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Mission Progress</h3>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="w-full h-3 bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all"
                  style={{ width: `${(completedCount / missions.length) * 100}%` }}
                ></div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-white">{completedCount}/{missions.length}</p>
              <p className="text-xs text-slate-400">Missions Complete</p>
            </div>
          </div>
        </div>

        {/* Mission Cards */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-white">Patient Missions</h3>
          {missions.map((mission) => (
            <Card
              key={mission.id}
              className={`border transition-all cursor-pointer ${
                mission.status === 'completed'
                  ? 'bg-green-500/10 border-green-500/50'
                  : 'bg-slate-800/50 border-slate-700/50 hover:border-slate-600/50'
              }`}
            >
              <div
                onClick={() => setExpandedMission(expandedMission === mission.id ? null : mission.id)}
                className="p-6"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="text-lg font-semibold text-white">{mission.title}</h4>
                      {mission.status === 'completed' && (
                        <span className="px-2 py-1 bg-green-500/20 text-green-300 text-xs font-semibold rounded">
                          ✓ Completed
                        </span>
                      )}
                    </div>
                    <p className="text-slate-400">{mission.description}</p>
                  </div>
                  <button className="text-slate-400 hover:text-white transition-colors">
                    {expandedMission === mission.id ? (
                      <ChevronUp className="w-5 h-5" />
                    ) : (
                      <ChevronDown className="w-5 h-5" />
                    )}
                  </button>
                </div>

                {/* Mission Meta */}
                <div className="flex gap-4 flex-wrap">
                  <div>
                    <span className="text-xs text-slate-500">Priority</span>
                    <p className={`text-sm font-semibold ${
                      mission.priority === 'high' ? 'text-red-400' : 'text-yellow-400'
                    }`}>
                      {mission.priority.toUpperCase()}
                    </p>
                  </div>
                  <div>
                    <span className="text-xs text-slate-500">Est. Time</span>
                    <p className="text-sm font-semibold text-white">{mission.estimatedTime}</p>
                  </div>
                </div>

                {/* Status Indicator */}
                <div className="mt-4">
                  <div className="w-full h-1 bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${
                        mission.status === 'completed'
                          ? 'w-full bg-green-500'
                          : mission.status === 'in-progress'
                          ? 'w-2/3 bg-blue-500'
                          : 'w-0 bg-slate-600'
                      }`}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Expanded Content */}
              {expandedMission === mission.id && (
                <div className="border-t border-slate-700/50 p-6 space-y-4">
                  <div>
                    <h5 className="text-sm font-semibold text-slate-300 mb-3">STEP-BY-STEP INSTRUCTIONS</h5>
                    <ol className="space-y-2">
                      {mission.instructions.map((instruction, i) => (
                        <li key={i} className="flex gap-3 text-sm text-slate-300">
                          <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center text-xs font-semibold text-blue-300">
                            {i + 1}
                          </span>
                          {instruction}
                        </li>
                      ))}
                    </ol>
                  </div>

                  {/* Mission Actions */}
                  <div className="flex gap-3 pt-4">
                    {mission.status === 'pending' && (
                      <Button
                        onClick={() => handleMissionStart(mission.id)}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        Start Mission
                      </Button>
                    )}
                    {mission.status === 'in-progress' && (
                      <Button
                        onClick={() => handleMissionComplete(mission.id)}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                      >
                        Complete Mission
                      </Button>
                    )}
                    {mission.status !== 'pending' && (
                      <Button
                        variant="outline"
                        className="flex-1 border-slate-700 text-slate-400"
                        disabled
                      >
                        {mission.status === 'completed' ? 'Mission Completed' : 'In Progress'}
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

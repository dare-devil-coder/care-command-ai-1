'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { mockPatients, mockTimelineEntries } from '@/lib/mock-patients';
import { ArrowLeft, Lock } from 'lucide-react';

interface CareTimelinePageProps {
  patientId: string;
  onNavigate: (page: 'nurse' | 'mission' | 'timeline' | 'admin' | 'break', patientId?: string) => void;
  onLogout: () => void;
}

export default function CareTimelinePage({ patientId, onNavigate, onLogout }: CareTimelinePageProps) {
  const patient = mockPatients.find(p => p.id === patientId) || mockPatients[0];

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

      <div className="max-w-2xl mx-auto">
        {/* Patient Header */}
        <Card className="bg-slate-800/50 border-slate-700/50 p-6 mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">{patient.name}</h1>
          <p className="text-slate-400">Room {patient.room} • Care Timeline</p>
        </Card>

        {/* Timeline */}
        <div className="space-y-0">
          {mockTimelineEntries.map((entry, index) => (
            <div key={entry.id} className="relative flex gap-6">
              {/* Timeline Line */}
              <div className="absolute left-[23px] top-12 w-0.5 h-[calc(100%+20px)] bg-gradient-to-b from-blue-500/50 to-transparent"></div>

              {/* Timeline Node */}
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold z-10 ring-4 ring-slate-900">
                  {index + 1}
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 pb-8">
                <Card className="bg-slate-800/50 border-slate-700/50 p-6 hover:border-slate-600/50 transition-all">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-sm font-semibold text-blue-400">{entry.timestamp}</p>
                      <h3 className="text-lg font-semibold text-white mt-1">{entry.action}</h3>
                    </div>
                    {entry.secured && (
                      <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/20 border border-green-500/50">
                        <Lock className="w-3 h-3 text-green-400" />
                        <span className="text-xs font-semibold text-green-300">Blockchain Secured</span>
                      </div>
                    )}
                  </div>

                  {entry.doctor && (
                    <p className="text-sm text-slate-400">
                      <span className="font-semibold text-white">{entry.doctor}</span>
                    </p>
                  )}
                </Card>
              </div>
            </div>
          ))}
        </div>

        {/* Empty Future Timeline */}
        <div className="text-center py-12 text-slate-500">
          <p className="text-sm">No upcoming scheduled events</p>
        </div>
      </div>
    </div>
  );
}

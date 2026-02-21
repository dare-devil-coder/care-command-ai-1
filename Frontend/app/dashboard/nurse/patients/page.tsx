'use client';

import { useEffect, useState } from 'react';
import { getPatients } from '@/lib/storage';
import { Patient } from '@/lib/schemas';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { calculatePatientRisk } from '@/lib/ai';
import Link from 'next/link';

export default function NursePatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [filter, setFilter] = useState<'all' | 'critical' | 'high' | 'medium' | 'low'>('all');

  useEffect(() => {
    const allPatients = getPatients();
    setPatients(allPatients);
  }, []);

  const filteredPatients = patients.filter(p => {
    if (filter === 'all') return true;
    const risk = calculatePatientRisk(p);
    return risk.level === filter;
  });

  const getRiskColor = (level: string) => {
    const colors: Record<string, string> = {
      critical: 'bg-red-100 text-red-800',
      high: 'bg-orange-100 text-orange-800',
      medium: 'bg-yellow-100 text-yellow-800',
      low: 'bg-green-100 text-green-800'
    };
    return colors[level] || colors.low;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Patient Overview</h1>
        <p className="text-muted-foreground">All patients under care</p>
      </div>

      {/* Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {(['all', 'critical', 'high', 'medium', 'low'] as const).map(level => (
          <button
            key={level}
            onClick={() => setFilter(level)}
            className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
              filter === level
                ? 'bg-primary text-white'
                : 'bg-white/50 dark:bg-white/5 hover:bg-white/20 dark:hover:bg-white/10'
            }`}
          >
            {level.charAt(0).toUpperCase() + level.slice(1)}
          </button>
        ))}
      </div>

      {/* Patients Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPatients.map(patient => {
          const risk = calculatePatientRisk(patient);
          return (
            <Link key={patient.id} href={`/dashboard/nurse/patients/${patient.id}`}>
              <Card className="glass hover:bg-white/20 dark:hover:bg-white/10 transition-all cursor-pointer h-full">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{patient.name}</CardTitle>
                      <CardDescription>Age {patient.age} • {patient.gender}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">MRN:</span>
                    <span className="font-mono font-semibold">{patient.medicalRecordNumber}</span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Blood Type:</span>
                    <span className="font-semibold">{patient.bloodType}</span>
                  </div>

                  {/* Vitals */}
                  <div className="p-2 bg-white/30 dark:bg-white/5 rounded">
                    <p className="text-xs text-muted-foreground mb-2 font-semibold">VITALS</p>
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span>BP:</span>
                        <span className="font-semibold">
                          {patient.vitals.bloodPressure.systolic}/{patient.vitals.bloodPressure.diastolic}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>HR:</span>
                        <span className="font-semibold">{patient.vitals.heartRate} bpm</span>
                      </div>
                      <div className="flex justify-between">
                        <span>O2:</span>
                        <span className="font-semibold">{patient.vitals.oxygenSaturation.toFixed(1)}%</span>
                      </div>
                    </div>
                  </div>

                  {/* Risk Level */}
                  <div className={`p-2 rounded font-semibold text-sm text-center ${getRiskColor(risk.level)}`}>
                    Risk: {risk.score}% ({risk.level.toUpperCase()})
                  </div>

                  {/* Conditions */}
                  {patient.conditions.length > 0 && (
                    <div className="text-xs">
                      <p className="text-muted-foreground font-semibold mb-1">CONDITIONS</p>
                      <div className="flex flex-wrap gap-1">
                        {patient.conditions.map(c => (
                          <span key={c} className="bg-primary/10 text-primary px-2 py-0.5 rounded text-xs">
                            {c}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Allergies */}
                  {patient.allergies.length > 0 && (
                    <div className="text-xs p-2 bg-red-50 dark:bg-red-900/10 rounded">
                      <p className="text-red-800 dark:text-red-300 font-semibold mb-1">ALLERGIES</p>
                      <p className="text-red-700 dark:text-red-400">{patient.allergies.join(', ')}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {filteredPatients.length === 0 && (
        <Card className="glass">
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">No patients found in this category</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

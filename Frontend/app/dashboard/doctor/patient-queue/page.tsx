'use client';

import { useEffect, useState } from 'react';
import { getPatients } from '@/lib/storage';
import { Patient } from '@/lib/schemas';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { calculateRiskScore } from '@/lib/aiEngine';
import { Users, AlertTriangle, Clock } from 'lucide-react';
import Link from 'next/link';

export default function PatientQueuePage() {
  const [patients, setPatients] = useState<Patient[]>([]);

  useEffect(() => {
    const allPatients = getPatients().filter(p => p.primaryDoctor === 'doctor_001');
    setPatients(allPatients.sort((a, b) => {
      const riskA = calculateRiskScore(a.vitals).score;
      const riskB = calculateRiskScore(b.vitals).score;
      return riskB - riskA;
    }));
  }, []);

  const getRiskColor = (level: string) => {
    const colors: Record<string, string> = {
      critical: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300',
      high: 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300',
      medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300',
      low: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
    };
    return colors[level] || colors.low;
  };

  const criticalCount = patients.filter(p => {
    const risk = calculateRiskScore(p.vitals);
    return risk.level === 'critical';
  }).length;

  const highRiskCount = patients.filter(p => {
    const risk = calculateRiskScore(p.vitals);
    return risk.level === 'high';
  }).length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-white mb-2">Patient Queue</h1>
        <p className="text-sm text-slate-400">Prioritized by risk level</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900 to-slate-800 backdrop-blur-xl shadow-lg shadow-black/30 p-6">
          <CardHeader className="p-0 mb-4">
            <CardTitle className="text-sm uppercase tracking-wide text-slate-400 flex items-center gap-2">
              <Users className="w-4 h-4" />
              Total Patients
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="text-4xl font-bold text-white">{patients.length}</div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900 to-slate-800 backdrop-blur-xl shadow-lg shadow-black/30 p-6">
          <CardHeader className="p-0 mb-4">
            <CardTitle className="text-sm uppercase tracking-wide text-slate-400 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Critical
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="text-4xl font-bold text-red-400">{criticalCount}</div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900 to-slate-800 backdrop-blur-xl shadow-lg shadow-black/30 p-6">
          <CardHeader className="p-0 mb-4">
            <CardTitle className="text-sm uppercase tracking-wide text-slate-400 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              High Risk
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="text-4xl font-bold text-orange-400">{highRiskCount}</div>
          </CardContent>
        </Card>
      </div>

      {/* Patient List */}
      <Card className="rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900 to-slate-800 backdrop-blur-xl shadow-lg shadow-black/30 p-6">
        <CardHeader className="p-0 mb-6">
          <CardTitle className="text-xl font-semibold text-white">Patient Queue</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="space-y-3">
            {patients.map((patient) => {
              const risk = calculateRiskScore(patient.vitals);
              return (
                <Link key={patient.id} href={`/dashboard/doctor`}>
                  <div className="p-4 rounded-xl border border-white/10 bg-slate-900/50 hover:bg-slate-800/50 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-white mb-1">{patient.name}</h3>
                        <p className="text-sm text-slate-400">MRN: {patient.medicalRecordNumber} • Age: {patient.age}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <p className="text-2xl font-bold text-white">{risk.score}%</p>
                          <Badge className={getRiskColor(risk.level)}>
                            {risk.level}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

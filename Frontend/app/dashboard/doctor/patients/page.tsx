'use client';

import { useEffect, useState } from 'react';
import { getPatients } from '@/lib/storage';
import { Patient } from '@/lib/schemas';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { calculateRiskScore } from '@/lib/aiEngine';
import { Search, User, Calendar, Droplet } from 'lucide-react';
import Link from 'next/link';

export default function DoctorPatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const allPatients = getPatients().filter(p => p.primaryDoctor === 'doctor_001');
    setPatients(allPatients);
  }, []);

  const filteredPatients = patients.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.medicalRecordNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getRiskColor = (level: string) => {
    const colors: Record<string, string> = {
      critical: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300',
      high: 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300',
      medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300',
      low: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
    };
    return colors[level] || colors.low;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">My Patients</h1>
        <p className="text-slate-400 mt-2">Manage and monitor your assigned patients</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <Card className="rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900 to-slate-800 backdrop-blur-xl shadow-lg shadow-black/30">
          <CardHeader className="pb-3">
            <p className="text-sm uppercase tracking-wide text-slate-400">Total Patients</p>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold">{patients.length}</span>
              <span className="text-sm text-slate-400">assigned</span>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900 to-slate-800 backdrop-blur-xl shadow-lg shadow-black/30">
          <CardHeader className="pb-3">
            <p className="text-sm uppercase tracking-wide text-slate-400">Critical</p>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-red-400">
                {patients.filter(p => calculateRiskScore(p.vitals).level === 'critical').length}
              </span>
              <span className="text-sm text-slate-400">patients</span>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900 to-slate-800 backdrop-blur-xl shadow-lg shadow-black/30">
          <CardHeader className="pb-3">
            <p className="text-sm uppercase tracking-wide text-slate-400">High Risk</p>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-orange-400">
                {patients.filter(p => calculateRiskScore(p.vitals).level === 'high').length}
              </span>
              <span className="text-sm text-slate-400">patients</span>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900 to-slate-800 backdrop-blur-xl shadow-lg shadow-black/30">
          <CardHeader className="pb-3">
            <p className="text-sm uppercase tracking-wide text-slate-400">Stable</p>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-green-400">
                {patients.filter(p => {
                  const level = calculateRiskScore(p.vitals).level;
                  return level === 'low' || level === 'medium';
                }).length}
              </span>
              <span className="text-sm text-slate-400">patients</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <Input
          type="text"
          placeholder="Search by name or MRN..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-12 h-12 bg-white/5 border-white/10 rounded-xl"
        />
      </div>

      {/* Patient List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredPatients.map(patient => {
          const risk = calculateRiskScore(patient.vitals);
          
          return (
            <Link key={patient.id} href={`/dashboard/doctor`}>
              <Card className="rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900 to-slate-800 backdrop-blur-xl shadow-lg shadow-black/30 hover:border-blue-500/50 transition-all cursor-pointer">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-blue-600/20 flex items-center justify-center border border-blue-500/30">
                        <User className="w-6 h-6 text-blue-400" />
                      </div>
                      <div>
                        <CardTitle className="text-xl">{patient.name}</CardTitle>
                        <CardDescription>MRN: {patient.medicalRecordNumber}</CardDescription>
                      </div>
                    </div>
                    <Badge className={getRiskColor(risk.level)}>
                      {risk.level}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Patient Info */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                      <div className="flex items-center gap-2 mb-1">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        <span className="text-xs text-slate-400">Age</span>
                      </div>
                      <p className="text-lg font-semibold">{patient.age}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                      <div className="flex items-center gap-2 mb-1">
                        <User className="w-4 h-4 text-slate-400" />
                        <span className="text-xs text-slate-400">Gender</span>
                      </div>
                      <p className="text-lg font-semibold">{patient.gender}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                      <div className="flex items-center gap-2 mb-1">
                        <Droplet className="w-4 h-4 text-slate-400" />
                        <span className="text-xs text-slate-400">Blood</span>
                      </div>
                      <p className="text-lg font-semibold">{patient.bloodType}</p>
                    </div>
                  </div>

                  {/* Vitals */}
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                    <p className="text-sm font-semibold text-slate-300 mb-3">Current Vitals</p>
                    <div className="grid grid-cols-4 gap-3">
                      <div className="text-center">
                        <p className="text-xs text-slate-400">BP</p>
                        <p className="text-sm font-semibold">{patient.vitals.bloodPressure.systolic}/{patient.vitals.bloodPressure.diastolic}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-slate-400">HR</p>
                        <p className="text-sm font-semibold">{patient.vitals.heartRate}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-slate-400">Temp</p>
                        <p className="text-sm font-semibold">{patient.vitals.temperature.toFixed(1)}°C</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-slate-400">O₂</p>
                        <p className="text-sm font-semibold">{patient.vitals.oxygenSaturation.toFixed(1)}%</p>
                      </div>
                    </div>
                  </div>

                  {/* Conditions */}
                  {patient.conditions.length > 0 && (
                    <div>
                      <p className="text-sm font-semibold text-slate-300 mb-2">Conditions</p>
                      <div className="flex flex-wrap gap-2">
                        {patient.conditions.map((condition, i) => (
                          <Badge key={i} variant="secondary" className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                            {condition}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Allergies */}
                  {patient.allergies.length > 0 && (
                    <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30">
                      <p className="text-sm font-semibold text-red-400 mb-1">Allergies</p>
                      <p className="text-sm text-red-300">{patient.allergies.join(', ')}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {filteredPatients.length === 0 && (
        <Card className="rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900 to-slate-800 backdrop-blur-xl shadow-lg shadow-black/30">
          <CardContent className="text-center py-12">
            <p className="text-slate-400">No patients found matching your search</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

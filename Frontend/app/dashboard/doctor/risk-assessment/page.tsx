'use client';

import { useEffect, useState } from 'react';
import { getPatients } from '@/lib/storage';
import { Patient } from '@/lib/schemas';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { calculateRiskScore, detectEarlyWarning } from '@/lib/aiEngine';
import { AlertTriangle, TrendingUp, Activity } from 'lucide-react';

export default function RiskAssessmentPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [filter, setFilter] = useState<'all' | 'critical' | 'high' | 'medium' | 'low'>('all');

  useEffect(() => {
    const allPatients = getPatients();
    setPatients(allPatients.sort((a, b) => {
      const riskA = calculateRiskScore(a.vitals).score;
      const riskB = calculateRiskScore(b.vitals).score;
      return riskB - riskA;
    }));
  }, []);

  const filteredPatients = patients.filter(p => {
    if (filter === 'all') return true;
    const risk = calculateRiskScore(p.vitals);
    return risk.level === filter;
  });

  const getRiskColor = (level: string) => {
    const colors: Record<string, string> = {
      critical: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300',
      high: 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300',
      medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300',
      low: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
    };
    return colors[level] || colors.low;
  };

  const stats = {
    critical: patients.filter(p => calculateRiskScore(p.vitals).level === 'critical').length,
    high: patients.filter(p => calculateRiskScore(p.vitals).level === 'high').length,
    medium: patients.filter(p => calculateRiskScore(p.vitals).level === 'medium').length,
    low: patients.filter(p => calculateRiskScore(p.vitals).level === 'low').length
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Risk Assessment</h1>
        <p className="text-slate-400 mt-2">AI-powered patient risk analysis and early warning detection</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <Card className="rounded-2xl border border-white/10 bg-gradient-to-br from-red-900/30 to-red-800/20 backdrop-blur-xl shadow-lg shadow-black/30">
          <CardHeader className="pb-3">
            <p className="text-sm uppercase tracking-wide text-slate-400">Critical Risk</p>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-red-400">{stats.critical}</span>
              <span className="text-sm text-slate-400">patients</span>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border border-white/10 bg-gradient-to-br from-orange-900/30 to-orange-800/20 backdrop-blur-xl shadow-lg shadow-black/30">
          <CardHeader className="pb-3">
            <p className="text-sm uppercase tracking-wide text-slate-400">High Risk</p>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-orange-400">{stats.high}</span>
              <span className="text-sm text-slate-400">patients</span>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border border-white/10 bg-gradient-to-br from-yellow-900/30 to-yellow-800/20 backdrop-blur-xl shadow-lg shadow-black/30">
          <CardHeader className="pb-3">
            <p className="text-sm uppercase tracking-wide text-slate-400">Medium Risk</p>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-yellow-400">{stats.medium}</span>
              <span className="text-sm text-slate-400">patients</span>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border border-white/10 bg-gradient-to-br from-green-900/30 to-green-800/20 backdrop-blur-xl shadow-lg shadow-black/30">
          <CardHeader className="pb-3">
            <p className="text-sm uppercase tracking-wide text-slate-400">Low Risk</p>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-green-400">{stats.low}</span>
              <span className="text-sm text-slate-400">patients</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter */}
      <div className="flex gap-3 flex-wrap">
        {(['all', 'critical', 'high', 'medium', 'low'] as const).map(level => (
          <button
            key={level}
            onClick={() => setFilter(level)}
            className={`px-6 py-2.5 rounded-xl font-medium transition-all ${
              filter === level
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                : 'bg-white/10 text-slate-300 hover:bg-white/20'
            }`}
          >
            {level.charAt(0).toUpperCase() + level.slice(1)}
          </button>
        ))}
      </div>

      {/* Patient Risk Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredPatients.map(patient => {
          const risk = calculateRiskScore(patient.vitals);
          const earlyWarning = detectEarlyWarning(patient.vitals);
          
          return (
            <Card key={patient.id} className="rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900 to-slate-800 backdrop-blur-xl shadow-lg shadow-black/30">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">{patient.name}</CardTitle>
                    <CardDescription>MRN: {patient.medicalRecordNumber}</CardDescription>
                  </div>
                  <Badge className={getRiskColor(risk.level)}>
                    {risk.level.toUpperCase()}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Risk Score */}
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-slate-400">Risk Score</span>
                    <span className="text-2xl font-bold">{risk.score}%</span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        risk.level === 'critical' ? 'bg-red-500' :
                        risk.level === 'high' ? 'bg-orange-500' :
                        risk.level === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${risk.score}%` }}
                    />
                  </div>
                </div>

                {/* Risk Factors */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-4 h-4 text-slate-400" />
                    <span className="text-sm font-semibold text-slate-300">Risk Factors</span>
                  </div>
                  <ul className="space-y-1">
                    {risk.factors.map((factor, i) => (
                      <li key={i} className="text-sm text-slate-400 pl-4">• {factor}</li>
                    ))}
                  </ul>
                </div>

                {/* Early Warnings */}
                {earlyWarning.hasWarnings && (
                  <div className="p-3 rounded-xl bg-orange-500/10 border border-orange-500/30">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="w-4 h-4 text-orange-400" />
                      <span className="text-sm font-semibold text-orange-400">Early Warning Signs</span>
                    </div>
                    <ul className="space-y-1">
                      {earlyWarning.warnings.map((warning, i) => (
                        <li key={i} className="text-sm text-orange-300 pl-4">• {warning}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Vitals */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Activity className="w-4 h-4 text-slate-400" />
                    <span className="text-sm font-semibold text-slate-300">Current Vitals</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-2 rounded-lg bg-white/5 text-center">
                      <p className="text-xs text-slate-400">BP</p>
                      <p className="text-sm font-semibold">{patient.vitals.bloodPressure.systolic}/{patient.vitals.bloodPressure.diastolic}</p>
                    </div>
                    <div className="p-2 rounded-lg bg-white/5 text-center">
                      <p className="text-xs text-slate-400">HR</p>
                      <p className="text-sm font-semibold">{patient.vitals.heartRate} bpm</p>
                    </div>
                    <div className="p-2 rounded-lg bg-white/5 text-center">
                      <p className="text-xs text-slate-400">Temp</p>
                      <p className="text-sm font-semibold">{patient.vitals.temperature.toFixed(1)}°C</p>
                    </div>
                    <div className="p-2 rounded-lg bg-white/5 text-center">
                      <p className="text-xs text-slate-400">O₂</p>
                      <p className="text-sm font-semibold">{patient.vitals.oxygenSaturation.toFixed(1)}%</p>
                    </div>
                  </div>
                </div>

                {/* Recommendation */}
                <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/30">
                  <p className="text-sm text-blue-300">{risk.recommendation}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredPatients.length === 0 && (
        <Card className="rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900 to-slate-800 backdrop-blur-xl shadow-lg shadow-black/30">
          <CardContent className="text-center py-12">
            <p className="text-slate-400">No patients found in this risk category</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

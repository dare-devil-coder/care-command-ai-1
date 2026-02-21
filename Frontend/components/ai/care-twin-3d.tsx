'use client';

import { useState, useRef, Suspense } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Activity, Heart, Brain, Droplet, Wind } from 'lucide-react';

interface AffectedArea {
  name: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  description: string;
  icon?: React.ReactNode;
}

interface CareTwin3DProps {
  patientId: string;
  patientName: string;
  affectedAreas: AffectedArea[];
  vitalSigns: {
    heartRate: number;
    bloodPressure: string;
    temperature: number;
    oxygenSaturation: number;
    respiratoryRate: number;
  };
}

export function CareTwin3D({ patientId, patientName, affectedAreas, vitalSigns }: CareTwin3DProps) {

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-500 bg-red-500/20 border-red-500/50';
      case 'high': return 'text-orange-500 bg-orange-500/20 border-orange-500/50';
      case 'medium': return 'text-yellow-500 bg-yellow-500/20 border-yellow-500/50';
      case 'low': return 'text-green-500 bg-green-500/20 border-green-500/50';
      default: return 'text-blue-500 bg-blue-500/20 border-blue-500/50';
    }
  };

  return (
    <Card className="glass p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Activity className="w-6 h-6 text-cyan-400" />
            🧍 Live Care Twin - {patientName}
          </h3>
          <p className="text-sm text-slate-400">Digital Health Visualization</p>
        </div>
        <Badge variant="outline" className="bg-cyan-500/20 text-cyan-300 border-cyan-500/50">
          Real-Time
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Health Status Summary */}
        <div className="lg:col-span-1">
          <Card className="glass-sm p-4 bg-gradient-to-b from-slate-800/50 to-slate-900/50">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-semibold text-white">Health Status</h4>
              <Badge variant="outline" className="bg-cyan-500/20 text-cyan-300 border-cyan-500/50">
                {affectedAreas.length} Areas
              </Badge>
            </div>

            {/* Critical Alert Summary */}
            <div className="space-y-3">
              {affectedAreas.filter(area => area.severity === 'critical').length > 0 && (
                <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                    <span className="text-sm font-semibold text-red-300">Critical Alerts</span>
                  </div>
                  <div className="space-y-1">
                    {affectedAreas.filter(area => area.severity === 'critical').map((area, index) => (
                      <div key={index} className="flex items-center gap-2 text-xs text-red-200">
                        {area.icon}
                        <span>{area.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* High Priority Areas */}
              {affectedAreas.filter(area => area.severity === 'high').length > 0 && (
                <div className="p-3 bg-orange-500/20 border border-orange-500/50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                    <span className="text-sm font-semibold text-orange-300">High Priority</span>
                  </div>
                  <div className="space-y-1">
                    {affectedAreas.filter(area => area.severity === 'high').map((area, index) => (
                      <div key={index} className="flex items-center gap-2 text-xs text-orange-200">
                        {area.icon}
                        <span>{area.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Medium/Low Priority Areas */}
              {(affectedAreas.filter(area => area.severity === 'medium' || area.severity === 'low').length > 0) && (
                <div className="p-3 bg-yellow-500/20 border border-yellow-500/50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                    <span className="text-sm font-semibold text-yellow-300">Monitoring</span>
                  </div>
                  <div className="space-y-1">
                    {affectedAreas.filter(area => area.severity === 'medium' || area.severity === 'low').map((area, index) => (
                      <div key={index} className="flex items-center gap-2 text-xs text-yellow-200">
                        {area.icon}
                        <span>{area.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Status Summary */}
              <div className="mt-4 pt-3 border-t border-white/10">
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="p-2 bg-red-500/10 rounded">
                    <div className="text-lg font-bold text-red-400">
                      {affectedAreas.filter(a => a.severity === 'critical').length}
                    </div>
                    <div className="text-xs text-red-300">Critical</div>
                  </div>
                  <div className="p-2 bg-orange-500/10 rounded">
                    <div className="text-lg font-bold text-orange-400">
                      {affectedAreas.filter(a => a.severity === 'high').length}
                    </div>
                    <div className="text-xs text-orange-300">High</div>
                  </div>
                  <div className="p-2 bg-yellow-500/10 rounded">
                    <div className="text-lg font-bold text-yellow-400">
                      {affectedAreas.filter(a => a.severity === 'medium' || a.severity === 'low').length}
                    </div>
                    <div className="text-xs text-yellow-300">Monitor</div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Vital Signs Panel */}
        <div className="lg:col-span-2 space-y-4">
          {/* Real-time Vitals */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <motion.div
              className="glass-sm p-4 border-2 border-red-500/30"
              animate={{ borderColor: ['rgba(239, 68, 68, 0.3)', 'rgba(239, 68, 68, 0.6)', 'rgba(239, 68, 68, 0.3)'] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <div className="flex items-center gap-2 mb-2">
                <Heart className="w-4 h-4 text-red-400" />
                <span className="text-xs text-slate-400">Heart Rate</span>
              </div>
              <p className="text-2xl font-bold text-white">{vitalSigns.heartRate}</p>
              <p className="text-xs text-slate-500">bpm</p>
            </motion.div>

            <div className="glass-sm p-4">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="w-4 h-4 text-blue-400" />
                <span className="text-xs text-slate-400">Blood Pressure</span>
              </div>
              <p className="text-2xl font-bold text-white">{vitalSigns.bloodPressure}</p>
              <p className="text-xs text-slate-500">mmHg</p>
            </div>

            <div className="glass-sm p-4">
              <div className="flex items-center gap-2 mb-2">
                <Droplet className="w-4 h-4 text-orange-400" />
                <span className="text-xs text-slate-400">Temperature</span>
              </div>
              <p className="text-2xl font-bold text-white">{vitalSigns.temperature}°</p>
              <p className="text-xs text-slate-500">Celsius</p>
            </div>

            <div className="glass-sm p-4">
              <div className="flex items-center gap-2 mb-2">
                <Wind className="w-4 h-4 text-cyan-400" />
                <span className="text-xs text-slate-400">O₂ Saturation</span>
              </div>
              <p className="text-2xl font-bold text-white">{vitalSigns.oxygenSaturation}%</p>
              <p className="text-xs text-slate-500">SpO₂</p>
            </div>

            <div className="glass-sm p-4">
              <div className="flex items-center gap-2 mb-2">
                <Wind className="w-4 h-4 text-green-400" />
                <span className="text-xs text-slate-400">Respiratory</span>
              </div>
              <p className="text-2xl font-bold text-white">{vitalSigns.respiratoryRate}</p>
              <p className="text-xs text-slate-500">breaths/min</p>
            </div>
          </div>

          {/* Affected Areas Details */}
          <Card className="glass-sm p-4">
            <h4 className="text-sm font-semibold text-white mb-3">Affected Areas Details</h4>
            <div className="space-y-2">
              {affectedAreas.map((area, index) => (
                <motion.div
                  key={index}
                  className={`p-3 rounded-lg border-2 ${getSeverityColor(area.severity)}`}
                  whileHover={{ scale: 1.02 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {area.icon}
                      <span className="font-semibold text-white">{area.name}</span>
                    </div>
                    <Badge variant="outline" className={getSeverityColor(area.severity)}>
                      {area.severity}
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-400 mt-2">{area.description}</p>
                </motion.div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </Card>
  );
}

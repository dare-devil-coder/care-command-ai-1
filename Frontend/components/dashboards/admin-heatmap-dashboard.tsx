'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity, TrendingUp, AlertTriangle, Users } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface FloorCell {
  id: string;
  floor: number;
  room: string;
  nurseLoad: number;
  patientCount: number;
  status: 'balanced' | 'moderate' | 'overloaded';
}

export function AdminHeatmapDashboard() {
  const [heatmapData, setHeatmapData] = useState<FloorCell[]>([]);
  const [selectedCell, setSelectedCell] = useState<FloorCell | null>(null);

  useEffect(() => {
    // Generate mock heatmap data
    const floors = [1, 2, 3, 4];
    const rooms = ['A', 'B', 'C', 'D', 'E', 'F'];
    const data: FloorCell[] = [];

    floors.forEach(floor => {
      rooms.forEach(room => {
        const nurseLoad = Math.floor(Math.random() * 100);
        const patientCount = Math.floor(Math.random() * 8) + 1;
        const status = nurseLoad >= 75 ? 'overloaded' : nurseLoad >= 50 ? 'moderate' : 'balanced';
        
        data.push({
          id: `${floor}${room}`,
          floor,
          room: `${floor}0${room}`,
          nurseLoad,
          patientCount,
          status
        });
      });
    });

    setHeatmapData(data);
  }, []);

  const getLoadColor = (load: number) => {
    if (load >= 75) return 'bg-red-500';
    if (load >= 50) return 'bg-orange-500';
    if (load >= 25) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'overloaded': return 'border-red-500 bg-red-500/20';
      case 'moderate': return 'border-orange-500 bg-orange-500/20';
      case 'balanced': return 'border-green-500 bg-green-500/20';
      default: return 'border-blue-500 bg-blue-500/20';
    }
  };

  // Mock data for charts
  const nurseWorkloadData = [
    { name: 'Emily R.', workload: 85, patients: 8 },
    { name: 'Sarah J.', workload: 72, patients: 6 },
    { name: 'Michael C.', workload: 65, patients: 5 },
    { name: 'Lisa M.', workload: 58, patients: 5 },
    { name: 'David K.', workload: 45, patients: 4 },
    { name: 'Anna P.', workload: 38, patients: 3 }
  ];

  const delayAnalysisData = [
    { time: '08:00', delays: 2 },
    { time: '10:00', delays: 5 },
    { time: '12:00', delays: 8 },
    { time: '14:00', delays: 6 },
    { time: '16:00', delays: 9 },
    { time: '18:00', delays: 4 },
    { time: '20:00', delays: 3 }
  ];

  const overloadedCount = heatmapData.filter(c => c.status === 'overloaded').length;
  const moderateCount = heatmapData.filter(c => c.status === 'moderate').length;
  const balancedCount = heatmapData.filter(c => c.status === 'balanced').length;
  const avgBurnoutRisk = 42;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Activity className="w-8 h-8 text-cyan-400" />
            Hospital Analytics Heatmap
          </h1>
          <p className="text-slate-400 mt-1">Real-time workload distribution and performance metrics</p>
        </div>
        <Badge variant="outline" className="bg-cyan-500/20 text-cyan-300 border-cyan-500/50 text-lg px-4 py-2">
          Live Dashboard
        </Badge>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="glass p-6 border-2 border-red-500/30 bg-gradient-to-br from-red-500/10 to-red-600/10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-300">Overloaded Zones</span>
              <AlertTriangle className="w-5 h-5 text-red-400" />
            </div>
            <motion.p
              className="text-4xl font-bold text-red-400"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
            >
              {overloadedCount}
            </motion.p>
            <p className="text-xs text-slate-400 mt-1">Requires immediate attention</p>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="glass p-6 border-2 border-orange-500/30 bg-gradient-to-br from-orange-500/10 to-orange-600/10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-300">Moderate Load</span>
              <TrendingUp className="w-5 h-5 text-orange-400" />
            </div>
            <motion.p
              className="text-4xl font-bold text-orange-400"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
            >
              {moderateCount}
            </motion.p>
            <p className="text-xs text-slate-400 mt-1">Monitor closely</p>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="glass p-6 border-2 border-green-500/30 bg-gradient-to-br from-green-500/10 to-green-600/10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-300">Balanced Zones</span>
              <Users className="w-5 h-5 text-green-400" />
            </div>
            <motion.p
              className="text-4xl font-bold text-green-400"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
            >
              {balancedCount}
            </motion.p>
            <p className="text-xs text-slate-400 mt-1">Optimal staffing</p>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="glass p-6 border-2 border-purple-500/30 bg-gradient-to-br from-purple-500/10 to-purple-600/10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-300">Avg Burnout Risk</span>
              <Activity className="w-5 h-5 text-purple-400" />
            </div>
            <motion.p
              className="text-4xl font-bold text-purple-400"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
            >
              {avgBurnoutRisk}%
            </motion.p>
            <p className="text-xs text-slate-400 mt-1">Across all staff</p>
          </Card>
        </motion.div>
      </div>

      {/* Hospital Floor Heatmap */}
      <Card className="glass p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            🏥 Hospital Floor Map - Workload Heatmap
          </h2>
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-green-500"></div>
              <span className="text-slate-400">Balanced</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-yellow-500"></div>
              <span className="text-slate-400">Light</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-orange-500"></div>
              <span className="text-slate-400">Moderate</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-red-500"></div>
              <span className="text-slate-400">Overloaded</span>
            </div>
          </div>
        </div>

        {/* Heatmap Grid */}
        <div className="space-y-4">
          {[4, 3, 2, 1].map(floor => (
            <div key={floor} className="flex items-center gap-3">
              <div className="w-20 text-right">
                <span className="text-sm font-semibold text-slate-400">Floor {floor}</span>
              </div>
              <div className="flex-1 grid grid-cols-6 gap-3">
                {heatmapData
                  .filter(cell => cell.floor === floor)
                  .map((cell, index) => (
                    <motion.div
                      key={cell.id}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ scale: 1.1, zIndex: 10 }}
                      onClick={() => setSelectedCell(cell)}
                      className={`relative aspect-square rounded-lg border-2 cursor-pointer transition-all ${getStatusColor(cell.status)} ${
                        selectedCell?.id === cell.id ? 'ring-4 ring-cyan-500' : ''
                      }`}
                    >
                      <div className={`absolute inset-1 rounded ${getLoadColor(cell.nurseLoad)} opacity-60`}></div>
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-white z-10">
                        <span className="text-xs font-bold">{cell.room}</span>
                        <span className="text-xs">{cell.nurseLoad}%</span>
                      </div>
                      {cell.status === 'overloaded' && (
                        <motion.div
                          className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"
                          animate={{
                            scale: [1, 1.3, 1],
                            opacity: [1, 0.5, 1]
                          }}
                          transition={{
                            duration: 1.5,
                            repeat: Infinity
                          }}
                        />
                      )}
                    </motion.div>
                  ))}
              </div>
            </div>
          ))}
        </div>

        {/* Selected Cell Info */}
        {selectedCell && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 p-4 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 rounded-lg"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Selected Room</p>
                <p className="text-2xl font-bold text-white">Room {selectedCell.room}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-slate-400">Nurse Load</p>
                <p className="text-2xl font-bold text-cyan-400">{selectedCell.nurseLoad}%</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-slate-400">Patients</p>
                <p className="text-2xl font-bold text-white">{selectedCell.patientCount}</p>
              </div>
              <Badge variant="outline" className={getStatusColor(selectedCell.status)}>
                {selectedCell.status.toUpperCase()}
              </Badge>
            </div>
          </motion.div>
        )}
      </Card>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Nurse Workload Bar Chart */}
        <Card className="glass p-6">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-400" />
            Nurse Workload Distribution
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={nurseWorkloadData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
              <YAxis stroke="#94a3b8" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(15, 23, 42, 0.9)',
                  border: '1px solid rgba(6, 182, 212, 0.3)',
                  borderRadius: '8px',
                  color: '#fff'
                }}
              />
              <Bar dataKey="workload" radius={[8, 8, 0, 0]}>
                {nurseWorkloadData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      entry.workload >= 75
                        ? '#ef4444'
                        : entry.workload >= 60
                        ? '#f97316'
                        : entry.workload >= 40
                        ? '#eab308'
                        : '#22c55e'
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Delay Analysis Line Chart */}
        <Card className="glass p-6">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-orange-400" />
            Task Delay Analysis
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={delayAnalysisData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="time" stroke="#94a3b8" fontSize={12} />
              <YAxis stroke="#94a3b8" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(15, 23, 42, 0.9)',
                  border: '1px solid rgba(6, 182, 212, 0.3)',
                  borderRadius: '8px',
                  color: '#fff'
                }}
              />
              <Line
                type="monotone"
                dataKey="delays"
                stroke="#f97316"
                strokeWidth={3}
                dot={{ fill: '#f97316', r: 6 }}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
}

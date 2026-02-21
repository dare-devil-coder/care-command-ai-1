'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Brain, AlertTriangle, TrendingUp, Coffee, Heart } from 'lucide-react';

interface CognitiveMetrics {
  stressIndex: number;
  burnoutProbability: number;
  loadBalance: number;
  tasksCompleted: number;
  hoursWorked: number;
  breaksTaken: number;
}

interface CognitiveLoadMeterProps {
  nurseId: string;
  nurseName: string;
  onBreakRequest: () => void;
}

export function CognitiveLoadMeter({ nurseId, nurseName, onBreakRequest }: CognitiveLoadMeterProps) {
  const [metrics, setMetrics] = useState<CognitiveMetrics>({
    stressIndex: 0,
    burnoutProbability: 0,
    loadBalance: 0,
    tasksCompleted: 0,
    hoursWorked: 0,
    breaksTaken: 0
  });

  const [showBreakSuggestion, setShowBreakSuggestion] = useState(false);

  useEffect(() => {
    // Simulate real-time cognitive load calculation
    const calculateMetrics = () => {
      const hoursWorked = 4 + Math.random() * 4; // 4-8 hours
      const tasksCompleted = Math.floor(10 + Math.random() * 20);
      const breaksTaken = Math.floor(Math.random() * 3);
      
      // Calculate stress based on workload
      const stressIndex = Math.min(
        (hoursWorked / 8) * 40 + 
        (tasksCompleted / 30) * 30 + 
        (3 - breaksTaken) * 10,
        100
      );
      
      // Burnout probability increases with stress and hours
      const burnoutProbability = Math.min(
        (stressIndex * 0.6) + (hoursWorked / 8) * 40,
        95
      );
      
      // Load balance (inverse of stress)
      const loadBalance = 100 - stressIndex;
      
      setMetrics({
        stressIndex,
        burnoutProbability,
        loadBalance,
        tasksCompleted,
        hoursWorked,
        breaksTaken
      });

      // Show break suggestion if stress is high
      if (stressIndex > 70 && breaksTaken < 2) {
        setShowBreakSuggestion(true);
      }
    };

    calculateMetrics();
    const interval = setInterval(calculateMetrics, 60000); // Update every minute
    
    return () => clearInterval(interval);
  }, []);

  const getStressColor = (value: number) => {
    if (value >= 70) return 'text-red-500';
    if (value >= 40) return 'text-orange-500';
    return 'text-green-500';
  };

  const getStressBgColor = (value: number) => {
    if (value >= 70) return 'from-red-500/20 to-red-600/20 border-red-500/50';
    if (value >= 40) return 'from-orange-500/20 to-orange-600/20 border-orange-500/50';
    return 'from-green-500/20 to-green-600/20 border-green-500/50';
  };

  return (
    <Card className={`glass p-6 border-2 bg-gradient-to-br ${getStressBgColor(metrics.stressIndex)}`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Brain className="w-6 h-6 text-purple-400" />
          <div>
            <h3 className="text-lg font-bold text-white">🧠 Cognitive AI Monitor</h3>
            <p className="text-xs text-slate-400">{nurseName}</p>
          </div>
        </div>
        <Badge variant="outline" className="bg-purple-500/20 text-purple-300 border-purple-500/50">
          Live Analysis
        </Badge>
      </div>

      {/* Circular Stress Meter */}
      <div className="flex justify-center mb-6">
        <div className="relative w-48 h-48">
          {/* Background Circle */}
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="96"
              cy="96"
              r="80"
              fill="none"
              stroke="rgba(100, 116, 139, 0.2)"
              strokeWidth="12"
            />
            {/* Progress Circle */}
            <motion.circle
              cx="96"
              cy="96"
              r="80"
              fill="none"
              stroke={metrics.stressIndex >= 70 ? '#ef4444' : metrics.stressIndex >= 40 ? '#f97316' : '#22c55e'}
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 80}`}
              initial={{ strokeDashoffset: 2 * Math.PI * 80 }}
              animate={{ 
                strokeDashoffset: 2 * Math.PI * 80 * (1 - metrics.stressIndex / 100)
              }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </svg>
          
          {/* Center Content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.p 
              className={`text-4xl font-bold ${getStressColor(metrics.stressIndex)}`}
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              {metrics.stressIndex.toFixed(0)}%
            </motion.p>
            <p className="text-sm text-slate-400">Stress Index</p>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {/* Burnout Probability */}
        <div className="glass-sm p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-4 h-4 text-orange-400" />
            <span className="text-xs text-slate-400">Burnout Risk</span>
          </div>
          <p className={`text-2xl font-bold ${getStressColor(metrics.burnoutProbability)}`}>
            {metrics.burnoutProbability.toFixed(0)}%
          </p>
          <Progress 
            value={metrics.burnoutProbability} 
            className="h-2 mt-2"
          />
        </div>

        {/* Load Balance */}
        <div className="glass-sm p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-blue-400" />
            <span className="text-xs text-slate-400">Load Balance</span>
          </div>
          <p className="text-2xl font-bold text-blue-400">
            {metrics.loadBalance.toFixed(0)}%
          </p>
          <Progress 
            value={metrics.loadBalance} 
            className="h-2 mt-2 bg-slate-700"
          />
        </div>

        {/* Tasks Completed */}
        <div className="glass-sm p-4 rounded-lg">
          <span className="text-xs text-slate-400">Tasks Completed</span>
          <p className="text-2xl font-bold text-white">{metrics.tasksCompleted}</p>
        </div>

        {/* Hours Worked */}
        <div className="glass-sm p-4 rounded-lg">
          <span className="text-xs text-slate-400">Hours Worked</span>
          <p className="text-2xl font-bold text-white">{metrics.hoursWorked.toFixed(1)}h</p>
        </div>
      </div>

      {/* Break Suggestion */}
      {showBreakSuggestion && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border-2 border-cyan-500/50 rounded-lg mb-4"
        >
          <div className="flex items-start gap-3">
            <Coffee className="w-5 h-5 text-cyan-400 mt-1" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-white mb-1">
                💡 AI Suggests: Take a Break
              </p>
              <p className="text-xs text-slate-300 mb-3">
                Your stress levels are elevated. A 5-minute breathing exercise can help reduce cognitive load by 30%.
              </p>
              <Button
                size="sm"
                onClick={onBreakRequest}
                className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white"
              >
                <Heart className="w-4 h-4 mr-2" />
                Start Relax Mode
              </Button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Wellness Tips */}
      <div className="space-y-2">
        <h4 className="text-sm font-semibold text-white flex items-center gap-2">
          <Heart className="w-4 h-4 text-pink-400" />
          Wellness Recommendations
        </h4>
        <div className="space-y-1">
          {metrics.breaksTaken < 2 && (
            <p className="text-xs text-slate-400 pl-4 border-l-2 border-cyan-500/30">
              • Take regular breaks every 2 hours
            </p>
          )}
          {metrics.stressIndex > 60 && (
            <p className="text-xs text-slate-400 pl-4 border-l-2 border-orange-500/30">
              • Practice deep breathing exercises
            </p>
          )}
          {metrics.hoursWorked > 6 && (
            <p className="text-xs text-slate-400 pl-4 border-l-2 border-yellow-500/30">
              • Stay hydrated and stretch regularly
            </p>
          )}
        </div>
      </div>
    </Card>
  );
}

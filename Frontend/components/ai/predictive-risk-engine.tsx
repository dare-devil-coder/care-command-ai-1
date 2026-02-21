'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, AlertTriangle, Activity } from 'lucide-react';

interface RiskPrediction {
  next30MinRisk: number;
  aiConfidence: number;
  trendDirection: 'up' | 'down' | 'stable';
  factors: string[];
  recommendation: string;
}

interface PredictiveRiskEngineProps {
  patientId: string;
  currentVitals: {
    heartRate: number;
    bloodPressure: string;
    temperature: number;
    oxygenSaturation: number;
  };
}

export function PredictiveRiskEngine({ patientId, currentVitals }: PredictiveRiskEngineProps) {
  const [prediction, setPrediction] = useState<RiskPrediction>({
    next30MinRisk: 0,
    aiConfidence: 0,
    trendDirection: 'stable',
    factors: [],
    recommendation: 'Calculating...'
  });

  useEffect(() => {
    // Simulate AI prediction calculation
    const calculateRisk = () => {
      const hrRisk = currentVitals.heartRate > 100 || currentVitals.heartRate < 60 ? 30 : 10;
      const o2Risk = currentVitals.oxygenSaturation < 95 ? 40 : 5;
      const tempRisk = currentVitals.temperature > 38 ? 25 : 5;
      
      const totalRisk = Math.min(hrRisk + o2Risk + tempRisk, 95);
      const confidence = 75 + Math.random() * 20;
      
      const factors = [];
      if (currentVitals.heartRate > 100) factors.push('Elevated heart rate');
      if (currentVitals.oxygenSaturation < 95) factors.push('Low oxygen saturation');
      if (currentVitals.temperature > 38) factors.push('Fever detected');
      
      const trend = totalRisk > 50 ? 'up' : totalRisk < 30 ? 'down' : 'stable';
      
      setPrediction({
        next30MinRisk: totalRisk,
        aiConfidence: confidence,
        trendDirection: trend,
        factors: factors.length > 0 ? factors : ['All vitals within normal range'],
        recommendation: totalRisk > 60 
          ? 'Immediate intervention recommended' 
          : totalRisk > 40 
          ? 'Monitor closely, prepare for intervention'
          : 'Continue routine monitoring'
      });
    };

    calculateRisk();
    const interval = setInterval(calculateRisk, 30000); // Update every 30s
    
    return () => clearInterval(interval);
  }, [currentVitals]);

  const getRiskColor = (risk: number) => {
    if (risk >= 70) return 'text-red-500';
    if (risk >= 40) return 'text-orange-500';
    return 'text-green-500';
  };

  const getRiskBgColor = (risk: number) => {
    if (risk >= 70) return 'bg-red-500/20 border-red-500/50';
    if (risk >= 40) return 'bg-orange-500/20 border-orange-500/50';
    return 'bg-green-500/20 border-green-500/50';
  };

  return (
    <Card className={`glass p-6 border-2 ${getRiskBgColor(prediction.next30MinRisk)} ${prediction.next30MinRisk >= 70 ? 'risk-pulse' : ''}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-cyan-400" />
          <h3 className="text-lg font-bold text-white">🧠 AI Predictive Risk Engine</h3>
        </div>
        <Badge variant="outline" className="bg-cyan-500/20 text-cyan-300 border-cyan-500/50">
          Live Analysis
        </Badge>
      </div>

      {/* Risk Probability */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-slate-300">Next 30 Min Risk Probability</span>
          <motion.span 
            className={`text-3xl font-bold ${getRiskColor(prediction.next30MinRisk)}`}
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            {prediction.next30MinRisk.toFixed(1)}%
          </motion.span>
        </div>
        <Progress 
          value={prediction.next30MinRisk} 
          className="h-3"
        />
      </div>

      {/* AI Confidence */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-slate-300">AI Confidence Level</span>
          <span className="text-lg font-semibold text-cyan-400">
            {prediction.aiConfidence.toFixed(1)}%
          </span>
        </div>
        <Progress 
          value={prediction.aiConfidence} 
          className="h-2 bg-slate-700"
        />
      </div>

      {/* Trend Direction */}
      <div className="flex items-center gap-2 mb-4 p-3 bg-slate-800/50 rounded-lg">
        {prediction.trendDirection === 'up' && (
          <>
            <TrendingUp className="w-5 h-5 text-red-400" />
            <span className="text-sm text-red-400 font-medium">Risk Increasing</span>
          </>
        )}
        {prediction.trendDirection === 'down' && (
          <>
            <TrendingDown className="w-5 h-5 text-green-400" />
            <span className="text-sm text-green-400 font-medium">Risk Decreasing</span>
          </>
        )}
        {prediction.trendDirection === 'stable' && (
          <>
            <Activity className="w-5 h-5 text-blue-400" />
            <span className="text-sm text-blue-400 font-medium">Risk Stable</span>
          </>
        )}
      </div>

      {/* Risk Factors */}
      <div className="mb-4">
        <h4 className="text-sm font-semibold text-slate-300 mb-2 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4" />
          Contributing Factors
        </h4>
        <div className="space-y-1">
          {prediction.factors.map((factor, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="text-xs text-slate-400 pl-4 border-l-2 border-cyan-500/30"
            >
              • {factor}
            </motion.div>
          ))}
        </div>
      </div>

      {/* AI Recommendation */}
      <motion.div 
        className="p-3 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 rounded-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <p className="text-sm font-medium text-cyan-300">
          💡 AI Recommendation: {prediction.recommendation}
        </p>
      </motion.div>

      {/* Risk Graph Animation */}
      <div className="mt-4 h-20 bg-slate-800/30 rounded-lg p-2 relative overflow-hidden">
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-full bg-gradient-to-t from-cyan-500/20 to-transparent"
          animate={{
            height: [`${prediction.next30MinRisk}%`, `${prediction.next30MinRisk + 5}%`, `${prediction.next30MinRisk}%`]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <div className="absolute bottom-2 left-2 text-xs text-slate-500">Risk Timeline</div>
      </div>
    </Card>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

interface BreakModePageProps {
  onResumeShift: () => void;
  onLogout: () => void;
}

export default function BreakModePage({ onResumeShift, onLogout }: BreakModePageProps) {
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [scale, setScale] = useState(1);
  const [timeLeft, setTimeLeft] = useState(4);

  useEffect(() => {
    const phaseSteps = [
      { phase: 'inhale' as const, duration: 4 },
      { phase: 'hold' as const, duration: 4 },
      { phase: 'exhale' as const, duration: 4 },
    ];

    let currentPhaseIndex = 0;
    let timeInPhase = 0;

    const interval = setInterval(() => {
      const currentStep = phaseSteps[currentPhaseIndex];
      setPhase(currentStep.phase);
      setTimeLeft(currentStep.duration - timeInPhase);

      // Breathing animation
      if (currentStep.phase === 'inhale') {
        setScale(1 + (timeInPhase / currentStep.duration) * 0.4);
      } else if (currentStep.phase === 'hold') {
        setScale(1.4);
      } else {
        setScale(1.4 - (timeInPhase / currentStep.duration) * 0.4);
      }

      timeInPhase++;

      if (timeInPhase >= currentStep.duration) {
        timeInPhase = 0;
        currentPhaseIndex = (currentPhaseIndex + 1) % phaseSteps.length;
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const phaseText = {
    inhale: 'Inhale',
    hold: 'Hold',
    exhale: 'Exhale',
  };

  const phaseColor = {
    inhale: 'from-blue-500 to-cyan-500',
    hold: 'from-cyan-500 to-teal-500',
    exhale: 'from-teal-500 to-emerald-500',
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-950 via-slate-900 to-emerald-950 flex flex-col items-center justify-center p-6">
      {/* Background glow effect */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full blur-3xl opacity-20 bg-emerald-500"></div>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center">
        {/* Breathing Circle */}
        <div
          className={`w-48 h-48 rounded-full bg-gradient-to-br ${phaseColor[phase]} shadow-2xl transition-transform duration-1000 ease-in-out flex items-center justify-center`}
          style={{ transform: `scale(${scale})` }}
        >
          <div className="text-center">
            <p className="text-white/80 text-sm font-semibold">{phaseText[phase]}</p>
            <p className="text-white text-4xl font-bold">{timeLeft}s</p>
          </div>
        </div>

        {/* Instructions */}
        <div className="text-center mt-16 space-y-4">
          <h1 className="text-4xl font-bold text-white">Take a Break</h1>
          <p className="text-2xl text-emerald-300 font-semibold">
            Inhale 4s – Hold 4s – Exhale 4s
          </p>
          <p className="text-slate-400 max-w-md mt-6">
            Your mind deserves a moment of calm. Focus on your breathing and let stress fade away.
          </p>
        </div>

        {/* Metrics while breathing */}
        <div className="mt-16 grid grid-cols-3 gap-8 w-full max-w-md">
          <div className="text-center">
            <p className="text-slate-500 text-xs font-semibold mb-2">Heart Rate</p>
            <p className="text-2xl font-bold text-emerald-300">72</p>
            <p className="text-xs text-slate-500">bpm</p>
          </div>
          <div className="text-center">
            <p className="text-slate-500 text-xs font-semibold mb-2">Stress Level</p>
            <p className="text-2xl font-bold text-blue-300">↓ 24%</p>
          </div>
          <div className="text-center">
            <p className="text-slate-500 text-xs font-semibold mb-2">O2 Saturation</p>
            <p className="text-2xl font-bold text-cyan-300">98%</p>
          </div>
        </div>

        {/* Resume Button */}
        <div className="mt-16 space-y-3 w-full max-w-md">
          <Button
            onClick={onResumeShift}
            className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold py-4 rounded-lg text-lg"
          >
            Resume Shift
          </Button>
          <Button
            onClick={onLogout}
            variant="outline"
            className="w-full border-slate-700 text-slate-400 hover:bg-slate-800 py-4"
          >
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
}

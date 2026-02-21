'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function StressReliefPage() {
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [breathPhase, setBreathPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');

  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsActive(false);
          return 60;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive]);

  useEffect(() => {
    if (!isActive) return;

    const breathCycle = setInterval(() => {
      setBreathPhase((prev) => {
        if (prev === 'inhale') return 'hold';
        if (prev === 'hold') return 'exhale';
        return 'inhale';
      });
    }, 4000);

    return () => clearInterval(breathCycle);
  }, [isActive]);

  const handleStart = () => {
    setIsActive(true);
    setTimeLeft(60);
  };

  const handleStop = () => {
    setIsActive(false);
    setTimeLeft(60);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Stress Relief</h1>
          <p className="text-muted-foreground">Take a moment to breathe and relax</p>
        </div>
        <Link href="/dashboard/nurse">
          <Button variant="outline">Resume Shift</Button>
        </Link>
      </div>

      <Card className="glass">
        <CardHeader>
          <CardTitle>Breathing Exercise</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col items-center justify-center py-12">
            <div className={`w-32 h-32 rounded-full flex items-center justify-center text-2xl font-bold transition-all duration-1000 ${
              breathPhase === 'inhale' ? 'bg-blue-500 scale-125' :
              breathPhase === 'hold' ? 'bg-purple-500 scale-125' :
              'bg-green-500 scale-75'
            }`}>
              {breathPhase === 'inhale' && 'Inhale'}
              {breathPhase === 'hold' && 'Hold'}
              {breathPhase === 'exhale' && 'Exhale'}
            </div>
            
            <div className="mt-8 text-4xl font-bold">
              {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
            </div>
            
            <p className="mt-4 text-slate-400">
              {isActive ? 'Follow the breathing pattern' : 'Click Start to begin'}
            </p>
          </div>

          <div className="flex gap-3">
            {!isActive ? (
              <Button onClick={handleStart} className="flex-1 bg-blue-600 hover:bg-blue-700">
                Start Exercise
              </Button>
            ) : (
              <Button onClick={handleStop} className="flex-1 bg-red-600 hover:bg-red-700">
                Stop
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

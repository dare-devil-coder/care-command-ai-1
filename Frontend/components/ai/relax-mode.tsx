'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { X, Volume2, VolumeX } from 'lucide-react';

interface RelaxModeProps {
  isOpen: boolean;
  onClose: () => void;
}

export function RelaxMode({ isOpen, onClose }: RelaxModeProps) {
  const [breathPhase, setBreathPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [countdown, setCountdown] = useState(4);
  const [totalTime, setTotalTime] = useState(0);
  const [isSoundOn, setIsSoundOn] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const timer = setInterval(() => {
      setTotalTime(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const breathingCycle = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          // Move to next phase
          if (breathPhase === 'inhale') {
            setBreathPhase('hold');
            return 4;
          } else if (breathPhase === 'hold') {
            setBreathPhase('exhale');
            return 6;
          } else {
            setBreathPhase('inhale');
            return 4;
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(breathingCycle);
  }, [isOpen, breathPhase]);

  const getPhaseColor = () => {
    switch (breathPhase) {
      case 'inhale': return 'from-cyan-500 to-blue-500';
      case 'hold': return 'from-purple-500 to-pink-500';
      case 'exhale': return 'from-green-500 to-emerald-500';
    }
  };

  const getPhaseScale = () => {
    switch (breathPhase) {
      case 'inhale': return 1.5;
      case 'hold': return 1.5;
      case 'exhale': return 0.8;
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900/50 to-purple-900/50 backdrop-blur-xl"
        >
          {/* Close Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="absolute top-6 right-6 text-white hover:bg-white/10"
          >
            <X className="w-6 h-6" />
          </Button>

          {/* Sound Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSoundOn(!isSoundOn)}
            className="absolute top-6 left-6 text-white hover:bg-white/10"
          >
            {isSoundOn ? <Volume2 className="w-6 h-6" /> : <VolumeX className="w-6 h-6" />}
          </Button>

          {/* Timer */}
          <div className="absolute top-6 left-1/2 transform -translate-x-1/2 text-white text-lg font-semibold">
            {formatTime(totalTime)}
          </div>

          <div className="flex flex-col items-center justify-center">
            {/* Breathing Circle */}
            <motion.div
              className={`relative w-64 h-64 rounded-full bg-gradient-to-br ${getPhaseColor()} shadow-2xl`}
              animate={{
                scale: getPhaseScale(),
              }}
              transition={{
                duration: breathPhase === 'inhale' ? 4 : breathPhase === 'hold' ? 4 : 6,
                ease: "easeInOut"
              }}
            >
              {/* Inner glow */}
              <motion.div
                className="absolute inset-4 rounded-full bg-white/20 backdrop-blur-sm"
                animate={{
                  opacity: [0.3, 0.6, 0.3]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />

              {/* Center text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                <motion.p
                  key={breathPhase}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-3xl font-bold capitalize mb-2"
                >
                  {breathPhase}
                </motion.p>
                <motion.p
                  key={countdown}
                  initial={{ scale: 1.2 }}
                  animate={{ scale: 1 }}
                  className="text-6xl font-bold"
                >
                  {countdown}
                </motion.p>
              </div>
            </motion.div>

            {/* Instructions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-12 text-center"
            >
              <h2 className="text-2xl font-bold text-white mb-2">
                🧘 Mindful Breathing Exercise
              </h2>
              <p className="text-slate-300 text-sm max-w-md">
                Follow the circle's rhythm. Breathe in through your nose, hold, then exhale slowly through your mouth.
              </p>
            </motion.div>

            {/* Ambient Particles */}
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 rounded-full bg-white/20"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [0, -30, 0],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                  ease: "easeInOut"
                }}
              />
            ))}

            {/* Benefits */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="absolute bottom-12 text-center"
            >
              <div className="flex gap-8 text-white/60 text-sm">
                <div>
                  <p className="font-semibold text-cyan-400">-30%</p>
                  <p>Stress</p>
                </div>
                <div>
                  <p className="font-semibold text-green-400">+40%</p>
                  <p>Focus</p>
                </div>
                <div>
                  <p className="font-semibold text-purple-400">+25%</p>
                  <p>Energy</p>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

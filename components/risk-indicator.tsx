'use client';

import { Patient } from '@/lib/schemas';
import { calculatePatientRisk } from '@/lib/ai';

interface RiskIndicatorProps {
  patient: Patient;
  size?: 'sm' | 'md' | 'lg';
}

export function RiskIndicator({ patient, size = 'md' }: RiskIndicatorProps) {
  const risk = calculatePatientRisk(patient);

  const sizeClasses = {
    sm: 'w-12 h-12 text-xs',
    md: 'w-16 h-16 text-sm',
    lg: 'w-24 h-24 text-lg'
  };

  const bgColors = {
    critical: 'bg-red-100 dark:bg-red-900/30 border-2 border-red-500',
    high: 'bg-orange-100 dark:bg-orange-900/30 border-2 border-orange-500',
    medium: 'bg-yellow-100 dark:bg-yellow-900/30 border-2 border-yellow-500',
    low: 'bg-green-100 dark:bg-green-900/30 border-2 border-green-500'
  };

  const textColors = {
    critical: 'text-red-900 dark:text-red-300',
    high: 'text-orange-900 dark:text-orange-300',
    medium: 'text-yellow-900 dark:text-yellow-300',
    low: 'text-green-900 dark:text-green-300'
  };

  const icons = {
    critical: '🚨',
    high: '⚠️',
    medium: '⚡',
    low: '✅'
  };

  return (
    <div
      className={`flex flex-col items-center justify-center rounded-lg font-bold ${sizeClasses[size]} ${bgColors[risk.level]}`}
    >
      <span className="text-lg">{icons[risk.level]}</span>
      <span className={`${textColors[risk.level]}`}>{risk.score}%</span>
    </div>
  );
}

export function RiskAlert({ patient }: { patient: Patient }) {
  const risk = calculatePatientRisk(patient);

  if (risk.level === 'low' || risk.level === 'medium') {
    return null;
  }

  const bgColors = {
    critical: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800/30',
    high: 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800/30'
  };

  const textColors = {
    critical: 'text-red-900 dark:text-red-300',
    high: 'text-orange-900 dark:text-orange-300'
  };

  return (
    <div className={`p-3 rounded-lg border ${bgColors[risk.level]}`}>
      <p className={`text-sm font-semibold ${textColors[risk.level]} mb-2`}>
        {risk.level.toUpperCase()} ALERT
      </p>
      <ul className={`text-xs ${textColors[risk.level]} space-y-1`}>
        {risk.reasons.map((reason, i) => (
          <li key={i}>• {reason}</li>
        ))}
      </ul>
    </div>
  );
}

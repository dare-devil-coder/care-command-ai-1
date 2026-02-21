'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface LoginPageProps {
  onLogin: (role: 'nurse' | 'doctor' | 'admin' | 'patient') => void;
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<'nurse' | 'doctor' | 'admin' | 'patient'>('nurse');

  const roles = [
    { id: 'nurse', label: 'Nurse', icon: '👩‍⚕️' },
    { id: 'doctor', label: 'Doctor', icon: '👨‍⚕️' },
    { id: 'admin', label: 'Admin', icon: '👔' },
    { id: 'patient', label: 'Patient', icon: '🤕' },
  ] as const;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (id && password) {
      onLogin(selectedRole);
    }
  };

  return (
    <div className="min-h-screen flex items-stretch">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-blue-900 via-slate-900 to-slate-950 p-12 flex-col justify-between">
        <div>
          <div className="text-5xl font-bold text-blue-300 mb-4">CareCommand AI</div>
          <div className="text-2xl text-slate-200">Smart Digital Nurse Mission Control</div>
        </div>

        <div className="space-y-6">
          <div className="flex gap-4 items-start">
            <div className="text-4xl">🎯</div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Real-time Patient Monitoring</h3>
              <p className="text-slate-300">AI-powered priority triage and health alerts</p>
            </div>
          </div>
          <div className="flex gap-4 items-start">
            <div className="text-4xl">⚡</div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Mission-Based Workflow</h3>
              <p className="text-slate-300">Structured care tasks with smart recommendations</p>
            </div>
          </div>
          <div className="flex gap-4 items-start">
            <div className="text-4xl">🔒</div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Secure & Compliant</h3>
              <p className="text-slate-300">Blockchain-secured patient records</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 bg-gradient-to-b from-slate-950 to-slate-900 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile Title */}
          <div className="lg:hidden mb-8">
            <h1 className="text-4xl font-bold text-blue-300 mb-2">CareCommand AI</h1>
            <p className="text-slate-300">Smart Digital Nurse Mission Control</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {/* Role Selection */}
            <div>
              <Label className="text-sm font-semibold text-slate-300 mb-3 block">Select Role</Label>
              <div className="grid grid-cols-2 gap-3">
                {roles.map((role) => (
                  <button
                    key={role.id}
                    type="button"
                    onClick={() => setSelectedRole(role.id as any)}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      selectedRole === role.id
                        ? 'border-blue-400 bg-blue-500/20 text-blue-300'
                        : 'border-slate-700 bg-slate-800/50 text-slate-400 hover:border-slate-600'
                    }`}
                  >
                    <div className="text-2xl mb-1">{role.icon}</div>
                    <div className="text-sm font-medium">{role.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* ID Input */}
            <div>
              <Label htmlFor="id" className="text-sm font-semibold text-slate-300">
                Staff ID
              </Label>
              <Input
                id="id"
                type="text"
                placeholder="Enter ID"
                value={id}
                onChange={(e) => setId(e.target.value)}
                className="mt-2 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500"
              />
            </div>

            {/* Password Input */}
            <div>
              <Label htmlFor="password" className="text-sm font-semibold text-slate-300">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-2 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500"
              />
            </div>

            {/* Login Button */}
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold py-3 rounded-lg transition-all"
              disabled={!id || !password}
            >
              Sign In
            </Button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-8 p-4 rounded-lg bg-slate-800/50 border border-slate-700">
            <p className="text-xs font-semibold text-slate-400 mb-2">Demo Credentials:</p>
            <p className="text-xs text-slate-300">ID: demo | Password: demo123</p>
          </div>
        </div>
      </div>
    </div>
  );
}

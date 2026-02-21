'use client';

import { Button } from '@/components/ui/button';
import { LogOut, Bell } from 'lucide-react';

interface NavBarProps {
  title: string;
  onLogout: () => void;
  currentRole: string;
}

export default function NavBar({ title, onLogout, currentRole }: NavBarProps) {
  const roleEmoji: Record<string, string> = {
    nurse: '👩‍⚕️',
    doctor: '👨‍⚕️',
    admin: '👤',
    patient: '🏥',
  };

  return (
    <nav className="bg-gradient-to-r from-slate-900 to-slate-800 border-b border-slate-700 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{roleEmoji[currentRole] || '⚕️'}</span>
          <h1 className="text-xl font-bold text-white">{title}</h1>
        </div>

        <div className="flex items-center gap-4">
          <button className="relative p-2 hover:bg-slate-800/50 rounded-lg text-slate-300 transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-yellow-400 rounded-full"></span>
          </button>
          <Button
            onClick={onLogout}
            variant="outline"
            className="flex items-center gap-2 border-slate-600 text-slate-300 hover:text-white"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>
      </div>
    </nav>
  );
}

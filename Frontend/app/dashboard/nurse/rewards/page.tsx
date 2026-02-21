'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { getTasks } from '@/lib/storage';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Star, Flame, TrendingUp, Target, Zap, Heart, AlertTriangle } from 'lucide-react';

export default function NurseRewardsPage() {
  const { user } = useAuth();
  const [points, setPoints] = useState(0);
  const [streak] = useState(5);
  const [badgeLevel, setBadgeLevel] = useState('Bronze');

  useEffect(() => {
    if (user) {
      const completedTasks = getTasks().filter(t => t.assignedTo === user.id && t.status === 'completed');
      let totalPoints = 0;
      completedTasks.forEach(task => {
        totalPoints += task.priority === 'critical' ? 20 : 10;
      });
      setPoints(totalPoints);
      if (totalPoints >= 500) setBadgeLevel('Platinum');
      else if (totalPoints >= 300) setBadgeLevel('Gold');
      else if (totalPoints >= 150) setBadgeLevel('Silver');
      else setBadgeLevel('Bronze');
    }
  }, [user]);

  const leaderboard = [
    { rank: 1, name: 'Sarah Johnson', points: 850, badge: 'Platinum', avatar: '👩‍⚕️' },
    { rank: 2, name: 'Emily Davis', points: 720, badge: 'Gold', avatar: '👩‍⚕️' },
    { rank: 3, name: 'Michael Brown', points: 680, badge: 'Gold', avatar: '👨‍⚕️' },
    { rank: 4, name: user?.name || 'You', points: points, badge: badgeLevel, avatar: '👤' }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Rewards & Achievements</h1>
        <p className="text-slate-400 mt-2">Track your progress and earn recognition</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="rounded-2xl border border-white/10 bg-gradient-to-br from-blue-900/30 to-blue-800/20">
          <CardHeader className="pb-3"><p className="text-sm uppercase tracking-wide text-slate-400">Total Points</p></CardHeader>
          <CardContent><div className="flex items-baseline gap-2"><Star className="w-8 h-8 text-yellow-400" /><span className="text-4xl font-bold text-yellow-400">{points}</span></div></CardContent>
        </Card>
        <Card className="rounded-2xl border border-white/10 bg-gradient-to-br from-orange-900/30 to-orange-800/20">
          <CardHeader className="pb-3"><p className="text-sm uppercase tracking-wide text-slate-400">Login Streak</p></CardHeader>
          <CardContent><div className="flex items-baseline gap-2"><Flame className="w-8 h-8 text-orange-400" /><span className="text-4xl font-bold text-orange-400">{streak}</span><span className="text-sm text-slate-400">days</span></div></CardContent>
        </Card>
        <Card className="rounded-2xl border border-white/10 bg-gradient-to-br from-purple-900/30 to-purple-800/20">
          <CardHeader className="pb-3"><p className="text-sm uppercase tracking-wide text-slate-400">Badge Level</p></CardHeader>
          <CardContent><span className="text-3xl font-bold">{badgeLevel}</span></CardContent>
        </Card>
        <Card className="rounded-2xl border border-white/10 bg-gradient-to-br from-green-900/30 to-green-800/20">
          <CardHeader className="pb-3"><p className="text-sm uppercase tracking-wide text-slate-400">Achievements</p></CardHeader>
          <CardContent><div className="flex items-baseline gap-2"><Trophy className="w-8 h-8 text-purple-400" /><span className="text-4xl font-bold text-purple-400">3</span><span className="text-sm text-slate-400">/ 8</span></div></CardContent>
        </Card>
      </div>

      <Card className="rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900 to-slate-800">
        <CardHeader><CardTitle className="flex items-center gap-2"><TrendingUp className="w-5 h-5" />Leaderboard</CardTitle><CardDescription>Top performing nurses this month</CardDescription></CardHeader>
        <CardContent>
          <div className="space-y-3">
            {leaderboard.map((entry) => (
              <div key={entry.rank} className="p-4 rounded-xl border border-white/10 bg-white/5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg bg-white/10 text-slate-400">{entry.rank}</div>
                    <span className="text-2xl">{entry.avatar}</span>
                    <div><p className="font-semibold">{entry.name}</p><p className="text-sm text-slate-400">{entry.badge} Badge</p></div>
                  </div>
                  <div className="text-right"><p className="text-2xl font-bold text-yellow-400">{entry.points}</p><p className="text-xs text-slate-400">points</p></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl border border-blue-500/30 bg-gradient-to-br from-blue-900/20 to-blue-800/10">
        <CardHeader><CardTitle className="flex items-center gap-2"><Zap className="w-5 h-5 text-blue-400" />How to Earn Points</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-white/5 border border-white/10"><div className="flex items-center gap-3 mb-2"><Target className="w-5 h-5 text-blue-400" /><p className="font-semibold">Complete Normal Tasks</p></div><p className="text-sm text-slate-400">+10 points per task</p></div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/10"><div className="flex items-center gap-3 mb-2"><AlertTriangle className="w-5 h-5 text-red-400" /><p className="font-semibold">Complete Critical Tasks</p></div><p className="text-sm text-slate-400">+20 points per task</p></div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/10"><div className="flex items-center gap-3 mb-2"><Flame className="w-5 h-5 text-orange-400" /><p className="font-semibold">Daily Login Streak</p></div><p className="text-sm text-slate-400">Bonus multiplier</p></div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/10"><div className="flex items-center gap-3 mb-2"><Heart className="w-5 h-5 text-pink-400" /><p className="font-semibold">Patient Feedback</p></div><p className="text-sm text-slate-400">+5 points per review</p></div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

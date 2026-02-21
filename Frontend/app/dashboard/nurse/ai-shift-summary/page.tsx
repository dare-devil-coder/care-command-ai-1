'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function AIShiftSummaryPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">AI Shift Summary</h1>
          <p className="text-muted-foreground">Your performance analytics for today</p>
        </div>
        <Link href="/dashboard/nurse">
          <Button variant="outline">Back to Dashboard</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <Card className="glass p-6">
          <CardHeader className="p-0 mb-4">
            <CardTitle className="text-sm uppercase tracking-wide text-slate-400">Total Patients</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="text-4xl font-bold text-white">5</div>
            <p className="text-sm text-slate-400 mt-1">Handled today</p>
          </CardContent>
        </Card>

        <Card className="glass p-6">
          <CardHeader className="p-0 mb-4">
            <CardTitle className="text-sm uppercase tracking-wide text-slate-400">Critical Cases</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="text-4xl font-bold text-red-400">2</div>
            <p className="text-sm text-slate-400 mt-1">High priority</p>
          </CardContent>
        </Card>

        <Card className="glass p-6">
          <CardHeader className="p-0 mb-4">
            <CardTitle className="text-sm uppercase tracking-wide text-slate-400">Efficiency Score</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="text-4xl font-bold text-green-400">92%</div>
            <p className="text-sm text-slate-400 mt-1">Above average</p>
          </CardContent>
        </Card>

        <Card className="glass p-6">
          <CardHeader className="p-0 mb-4">
            <CardTitle className="text-sm uppercase tracking-wide text-slate-400">Tasks Completed</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="text-4xl font-bold text-blue-400">12</div>
            <p className="text-sm text-slate-400 mt-1">Out of 14</p>
          </CardContent>
        </Card>
      </div>

      <Card className="glass">
        <CardHeader>
          <CardTitle>AI Insights</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg">
            <h3 className="font-semibold text-blue-400 mb-2">Performance Highlight</h3>
            <p className="text-sm text-slate-300">
              You responded to critical cases 15% faster than average today. Excellent work!
            </p>
          </div>

          <div className="p-4 bg-green-900/20 border border-green-500/30 rounded-lg">
            <h3 className="font-semibold text-green-400 mb-2">Strength</h3>
            <p className="text-sm text-slate-300">
              Your patient communication scores are consistently high. Patients appreciate your care.
            </p>
          </div>

          <div className="p-4 bg-yellow-900/20 border border-yellow-500/30 rounded-lg">
            <h3 className="font-semibold text-yellow-400 mb-2">Suggestion</h3>
            <p className="text-sm text-slate-300">
              Consider taking a short break. Your cognitive load has been high for the past 3 hours.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

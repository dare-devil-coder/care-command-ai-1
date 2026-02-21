'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { addNotification } from '@/lib/notificationStore';
import Link from 'next/link';

export default function RequestHelpPage() {
  const [issue, setIssue] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSendRequest = () => {
    if (!issue.trim()) return;

    // Add notification to admin
    addNotification('admin', `Nurse requested help: ${issue}`);
    
    setSubmitted(true);
    setTimeout(() => {
      setIssue('');
      setSubmitted(false);
    }, 3000);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Request Assistance</h1>
          <p className="text-muted-foreground">Get help from admin or other staff</p>
        </div>
        <Link href="/dashboard/nurse">
          <Button variant="outline">Back to Dashboard</Button>
        </Link>
      </div>

      <Card className="glass">
        <CardHeader>
          <CardTitle>Describe Your Issue</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <textarea
            value={issue}
            onChange={(e) => setIssue(e.target.value)}
            placeholder="Describe the issue or assistance needed..."
            className="w-full p-4 rounded-lg bg-slate-800 border border-slate-700 text-white focus:border-blue-500 focus:outline-none min-h-[150px]"
          />
          
          <Button
            onClick={handleSendRequest}
            disabled={!issue.trim() || submitted}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600"
          >
            {submitted ? 'Request Sent!' : 'Send Request'}
          </Button>

          {submitted && (
            <div className="p-3 bg-green-900/20 border border-green-500/30 rounded-lg text-green-400 text-sm">
              Your request has been sent to the admin team.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

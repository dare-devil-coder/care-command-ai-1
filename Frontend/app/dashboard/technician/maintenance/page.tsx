'use client';

import { useEffect, useState } from 'react';
import { getMaintenanceRequests, updateMaintenanceRequest, createMaintenanceRequest, getEquipment } from '@/lib/storage';
import { MaintenanceRequest } from '@/lib/schemas';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Wrench, Plus, Clock, CheckCircle, AlertCircle } from 'lucide-react';

export default function MaintenancePage() {
  const [requests, setRequests] = useState<MaintenanceRequest[]>([]);
  const [filter, setFilter] = useState<'all' | 'open' | 'in-progress' | 'completed'>('all');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newRequest, setNewRequest] = useState({
    equipmentId: '',
    equipmentName: '',
    issueDescription: '',
    priority: 'medium' as const
  });

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = () => {
    const allRequests = getMaintenanceRequests();
    setRequests(allRequests.sort((a, b) => b.createdAt - a.createdAt));
  };

  const handleCreateRequest = () => {
    if (!newRequest.equipmentName || !newRequest.issueDescription) return;
    
    createMaintenanceRequest({
      equipmentId: newRequest.equipmentId || `eq_${Date.now()}`,
      equipmentName: newRequest.equipmentName,
      issueDescription: newRequest.issueDescription,
      priority: newRequest.priority,
      status: 'open',
      requestedBy: 'tech_001'
    });

    setNewRequest({ equipmentId: '', equipmentName: '', issueDescription: '', priority: 'medium' });
    setShowCreateDialog(false);
    loadRequests();
  };

  const handleUpdateStatus = (request: MaintenanceRequest, newStatus: 'open' | 'in-progress' | 'completed') => {
    updateMaintenanceRequest({
      ...request,
      status: newStatus,
      completedAt: newStatus === 'completed' ? Date.now() : request.completedAt
    });
    loadRequests();
  };

  const filteredRequests = requests.filter(r => filter === 'all' || r.status === filter);

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      open: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300',
      'in-progress': 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300',
      completed: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
    };
    return colors[status] || colors.open;
  };

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      low: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300',
      medium: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300',
      high: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
    };
    return colors[priority] || colors.medium;
  };

  const stats = {
    total: requests.length,
    open: requests.filter(r => r.status === 'open').length,
    inProgress: requests.filter(r => r.status === 'in-progress').length,
    completed: requests.filter(r => r.status === 'completed').length
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Maintenance Requests</h1>
          <p className="text-slate-400 mt-2">Track and manage equipment maintenance tasks</p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button className="gap-2 bg-blue-600 hover:bg-blue-700 rounded-xl">
              <Plus className="w-4 h-4" />
              New Request
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Maintenance Request</DialogTitle>
              <DialogDescription>Submit a new equipment maintenance request</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Equipment Name</label>
                <Input
                  value={newRequest.equipmentName}
                  onChange={(e) => setNewRequest({ ...newRequest, equipmentName: e.target.value })}
                  placeholder="e.g., MRI Scanner"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Issue Description</label>
                <Textarea
                  value={newRequest.issueDescription}
                  onChange={(e) => setNewRequest({ ...newRequest, issueDescription: e.target.value })}
                  placeholder="Describe the issue..."
                  rows={4}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Priority</label>
                <Select value={newRequest.priority} onValueChange={(v: any) => setNewRequest({ ...newRequest, priority: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleCreateRequest} className="w-full">Create Request</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <Card className="rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900 to-slate-800 backdrop-blur-xl shadow-lg shadow-black/30">
          <CardHeader className="pb-3">
            <p className="text-sm uppercase tracking-wide text-slate-400">Total Requests</p>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold">{stats.total}</span>
              <span className="text-sm text-slate-400">requests</span>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border border-white/10 bg-gradient-to-br from-yellow-900/30 to-yellow-800/20 backdrop-blur-xl shadow-lg shadow-black/30">
          <CardHeader className="pb-3">
            <p className="text-sm uppercase tracking-wide text-slate-400">Open</p>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-yellow-400">{stats.open}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border border-white/10 bg-gradient-to-br from-blue-900/30 to-blue-800/20 backdrop-blur-xl shadow-lg shadow-black/30">
          <CardHeader className="pb-3">
            <p className="text-sm uppercase tracking-wide text-slate-400">In Progress</p>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-blue-400">{stats.inProgress}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border border-white/10 bg-gradient-to-br from-green-900/30 to-green-800/20 backdrop-blur-xl shadow-lg shadow-black/30">
          <CardHeader className="pb-3">
            <p className="text-sm uppercase tracking-wide text-slate-400">Completed</p>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-green-400">{stats.completed}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter */}
      <div className="flex gap-3 flex-wrap">
        {(['all', 'open', 'in-progress', 'completed'] as const).map(status => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-6 py-2.5 rounded-xl font-medium transition-all ${
              filter === status
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                : 'bg-white/10 text-slate-300 hover:bg-white/20'
            }`}
          >
            {status === 'all' ? 'All' : status.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
          </button>
        ))}
      </div>

      {/* Requests List */}
      <div className="space-y-4">
        {filteredRequests.map(request => (
          <Card key={request.id} className="rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900 to-slate-800 backdrop-blur-xl shadow-lg shadow-black/30">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Wrench className="w-5 h-5 text-blue-400" />
                    <h3 className="text-xl font-semibold">{request.equipmentName}</h3>
                  </div>
                  <p className="text-slate-400 text-sm mb-3">{request.issueDescription}</p>
                  <div className="flex gap-2">
                    <Badge className={getStatusColor(request.status)}>
                      {request.status}
                    </Badge>
                    <Badge className={getPriorityColor(request.priority)}>
                      {request.priority} priority
                    </Badge>
                  </div>
                </div>
                <div className="flex gap-2">
                  {request.status === 'open' && (
                    <Button
                      size="sm"
                      onClick={() => handleUpdateStatus(request, 'in-progress')}
                      className="bg-blue-600 hover:bg-blue-700 rounded-xl"
                    >
                      Start Work
                    </Button>
                  )}
                  {request.status === 'in-progress' && (
                    <Button
                      size="sm"
                      onClick={() => handleUpdateStatus(request, 'completed')}
                      className="bg-green-600 hover:bg-green-700 rounded-xl gap-1"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Complete
                    </Button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-white/10">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-slate-400" />
                  <div>
                    <p className="text-xs text-slate-400">Created</p>
                    <p className="text-sm font-semibold">{new Date(request.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-slate-400" />
                  <div>
                    <p className="text-xs text-slate-400">Requested By</p>
                    <p className="text-sm font-semibold">{request.requestedBy}</p>
                  </div>
                </div>
                {request.completedAt && (
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <div>
                      <p className="text-xs text-slate-400">Completed</p>
                      <p className="text-sm font-semibold">{new Date(request.completedAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                )}
              </div>

              {request.notes && (
                <div className="mt-4 p-3 rounded-xl bg-blue-500/10 border border-blue-500/30">
                  <p className="text-sm text-blue-300">{request.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredRequests.length === 0 && (
        <Card className="rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900 to-slate-800 backdrop-blur-xl shadow-lg shadow-black/30">
          <CardContent className="text-center py-12">
            <Wrench className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400 text-lg">No maintenance requests found</p>
            <p className="text-slate-500 text-sm mt-2">Create a new request to get started</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { getEquipment, updateEquipment } from '@/lib/storage';
import { Equipment } from '@/lib/schemas';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, Wrench, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';

export default function EquipmentPage() {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'available' | 'in-use' | 'maintenance' | 'out-of-service'>('all');

  useEffect(() => {
    loadEquipment();
  }, []);

  const loadEquipment = () => {
    setEquipment(getEquipment());
  };

  const filteredEquipment = equipment.filter(e => {
    const matchesSearch = e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         e.serialNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         e.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filter === 'all' || e.status === filter;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      available: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300',
      'in-use': 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300',
      maintenance: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300',
      'out-of-service': 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
    };
    return colors[status] || colors.available;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'available': return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'in-use': return <Wrench className="w-5 h-5 text-blue-400" />;
      case 'maintenance': return <AlertTriangle className="w-5 h-5 text-yellow-400" />;
      case 'out-of-service': return <XCircle className="w-5 h-5 text-red-400" />;
      default: return null;
    }
  };

  const stats = {
    total: equipment.length,
    available: equipment.filter(e => e.status === 'available').length,
    inUse: equipment.filter(e => e.status === 'in-use').length,
    maintenance: equipment.filter(e => e.status === 'maintenance').length,
    outOfService: equipment.filter(e => e.status === 'out-of-service').length
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Equipment Management</h1>
        <p className="text-slate-400 mt-2">Monitor and manage hospital equipment inventory</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-6">
        <Card className="rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900 to-slate-800 backdrop-blur-xl shadow-lg shadow-black/30">
          <CardHeader className="pb-3">
            <p className="text-sm uppercase tracking-wide text-slate-400">Total Equipment</p>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold">{stats.total}</span>
              <span className="text-sm text-slate-400">items</span>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border border-white/10 bg-gradient-to-br from-green-900/30 to-green-800/20 backdrop-blur-xl shadow-lg shadow-black/30">
          <CardHeader className="pb-3">
            <p className="text-sm uppercase tracking-wide text-slate-400">Available</p>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-green-400">{stats.available}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border border-white/10 bg-gradient-to-br from-blue-900/30 to-blue-800/20 backdrop-blur-xl shadow-lg shadow-black/30">
          <CardHeader className="pb-3">
            <p className="text-sm uppercase tracking-wide text-slate-400">In Use</p>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-blue-400">{stats.inUse}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border border-white/10 bg-gradient-to-br from-yellow-900/30 to-yellow-800/20 backdrop-blur-xl shadow-lg shadow-black/30">
          <CardHeader className="pb-3">
            <p className="text-sm uppercase tracking-wide text-slate-400">Maintenance</p>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-yellow-400">{stats.maintenance}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border border-white/10 bg-gradient-to-br from-red-900/30 to-red-800/20 backdrop-blur-xl shadow-lg shadow-black/30">
          <CardHeader className="pb-3">
            <p className="text-sm uppercase tracking-wide text-slate-400">Out of Service</p>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-red-400">{stats.outOfService}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <Input
            type="text"
            placeholder="Search by name, serial number, or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 h-12 bg-white/5 border-white/10 rounded-xl"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {(['all', 'available', 'in-use', 'maintenance', 'out-of-service'] as const).map(status => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2.5 rounded-xl font-medium transition-all whitespace-nowrap ${
                filter === status
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                  : 'bg-white/10 text-slate-300 hover:bg-white/20'
              }`}
            >
              {status === 'all' ? 'All' : status.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Equipment Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredEquipment.map(item => (
          <Card key={item.id} className="rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900 to-slate-800 backdrop-blur-xl shadow-lg shadow-black/30">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  {getStatusIcon(item.status)}
                  <div>
                    <CardTitle className="text-xl">{item.name}</CardTitle>
                    <CardDescription>{item.type}</CardDescription>
                  </div>
                </div>
                <Badge className={getStatusColor(item.status)}>
                  {item.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                  <p className="text-xs text-slate-400 mb-1">Serial Number</p>
                  <p className="font-mono font-semibold text-sm">{item.serialNumber}</p>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                  <p className="text-xs text-slate-400 mb-1">Location</p>
                  <p className="font-semibold text-sm">{item.location}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                  <p className="text-xs text-slate-400 mb-1">Last Maintenance</p>
                  <p className="font-semibold text-sm">{new Date(item.lastMaintenance).toLocaleDateString()}</p>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                  <p className="text-xs text-slate-400 mb-1">Next Maintenance</p>
                  <p className="font-semibold text-sm">{new Date(item.nextMaintenance).toLocaleDateString()}</p>
                </div>
              </div>

              {item.assignedTo && (
                <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/30">
                  <p className="text-xs text-blue-400 mb-1">Assigned To</p>
                  <p className="font-semibold text-sm text-blue-300">{item.assignedTo}</p>
                </div>
              )}

              {item.notes && (
                <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                  <p className="text-xs text-slate-400 mb-1">Notes</p>
                  <p className="text-sm">{item.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredEquipment.length === 0 && (
        <Card className="rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900 to-slate-800 backdrop-blur-xl shadow-lg shadow-black/30">
          <CardContent className="text-center py-12">
            <Wrench className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400 text-lg">No equipment found</p>
            <p className="text-slate-500 text-sm mt-2">Try adjusting your search or filter criteria</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

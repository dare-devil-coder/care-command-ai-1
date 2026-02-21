'use client';

import { useEffect, useState } from 'react';
import { getEquipment, getMaintenanceRequests } from '@/lib/storage';
import { Equipment, MaintenanceRequest } from '@/lib/schemas';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function TechnicianDashboard() {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [maintenanceRequests, setMaintenanceRequests] = useState<MaintenanceRequest[]>([]);
  const [stats, setStats] = useState({
    available: 0,
    inUse: 0,
    maintenance: 0,
    outOfService: 0
  });

  useEffect(() => {
    const allEquipment = getEquipment();
    const allRequests = getMaintenanceRequests();

    setEquipment(allEquipment);
    setMaintenanceRequests(allRequests);

    setStats({
      available: allEquipment.filter(e => e.status === 'available').length,
      inUse: allEquipment.filter(e => e.status === 'in-use').length,
      maintenance: allEquipment.filter(e => e.status === 'maintenance').length,
      outOfService: allEquipment.filter(e => e.status === 'out-of-service').length
    });
  }, []);

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      available: 'bg-green-100 text-green-800',
      'in-use': 'bg-blue-100 text-blue-800',
      maintenance: 'bg-yellow-100 text-yellow-800',
      'out-of-service': 'bg-red-100 text-red-800'
    };
    return colors[status] || colors.available;
  };

  const getRequestStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      open: 'bg-red-100 text-red-800',
      'in-progress': 'bg-yellow-100 text-yellow-800',
      completed: 'bg-green-100 text-green-800'
    };
    return colors[status] || colors.open;
  };

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      high: 'bg-red-100 text-red-800',
      medium: 'bg-yellow-100 text-yellow-800',
      low: 'bg-blue-100 text-blue-800'
    };
    return colors[priority] || colors.low;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Equipment & Maintenance</h1>
        <p className="text-muted-foreground">Medical equipment management and maintenance tracking</p>
      </div>

      {/* Equipment Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="glass">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Available</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{stats.available}</div>
            <p className="text-xs text-muted-foreground">Ready to use</p>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">In Use</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{stats.inUse}</div>
            <p className="text-xs text-muted-foreground">Currently deployed</p>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Maintenance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-600">{stats.maintenance}</div>
            <p className="text-xs text-muted-foreground">Being serviced</p>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Out of Service</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">{stats.outOfService}</div>
            <p className="text-xs text-muted-foreground">Not available</p>
          </CardContent>
        </Card>
      </div>

      {/* Maintenance Requests */}
      <Card className="glass">
        <CardHeader>
          <CardTitle>Maintenance Requests</CardTitle>
          <CardDescription>Active and pending maintenance tasks</CardDescription>
        </CardHeader>
        <CardContent>
          {maintenanceRequests.length > 0 ? (
            <div className="space-y-3">
              {maintenanceRequests.map((request) => (
                <div key={request.id} className="p-4 border border-white/20 dark:border-white/10 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <h3 className="font-semibold">{request.equipmentName}</h3>
                      <p className="text-sm text-muted-foreground">{request.issueDescription}</p>
                    </div>
                    <div className="flex gap-2">
                      <Badge className={getPriorityColor(request.priority)}>
                        {request.priority}
                      </Badge>
                      <Badge className={getRequestStatusColor(request.status)}>
                        {request.status}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Requested by: {request.requestedBy}</span>
                    <span>
                      {request.status === 'completed' && request.completedAt
                        ? `Completed: ${new Date(request.completedAt).toLocaleDateString()}`
                        : `Created: ${new Date(request.createdAt).toLocaleDateString()}`}
                    </span>
                  </div>
                  {request.notes && (
                    <p className="text-xs mt-2 p-2 bg-white/30 dark:bg-white/5 rounded">
                      Notes: {request.notes}
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No maintenance requests</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Equipment Inventory */}
      <Card className="glass">
        <CardHeader>
          <CardTitle>Equipment Inventory</CardTitle>
          <CardDescription>All medical devices and status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {equipment.map((item) => (
              <div key={item.id} className="p-4 border border-white/20 dark:border-white/10 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="text-sm text-muted-foreground">{item.type}</p>
                  </div>
                  <Badge className={getStatusColor(item.status)}>
                    {item.status}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs text-muted-foreground mb-2">
                  <div>
                    <p className="font-semibold">Location</p>
                    <p>{item.location}</p>
                  </div>
                  <div>
                    <p className="font-semibold">Serial Number</p>
                    <p className="font-mono">{item.serialNumber}</p>
                  </div>
                  <div>
                    <p className="font-semibold">Last Maintenance</p>
                    <p>{new Date(item.lastMaintenance).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="font-semibold">Next Maintenance</p>
                    <p>{new Date(item.nextMaintenance).toLocaleDateString()}</p>
                  </div>
                </div>

                {item.assignedTo && (
                  <p className="text-xs bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded">
                    Currently assigned to: {item.assignedTo}
                  </p>
                )}

                {item.notes && (
                  <p className="text-xs mt-2 p-2 bg-white/30 dark:bg-white/5 rounded">
                    Notes: {item.notes}
                  </p>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Maintenance Schedule */}
      <Card className="glass">
        <CardHeader>
          <CardTitle>Upcoming Maintenance Schedule</CardTitle>
          <CardDescription>Equipment requiring maintenance in the next 30 days</CardDescription>
        </CardHeader>
        <CardContent>
          {(() => {
            const now = Date.now();
            const thirtyDaysFromNow = now + 30 * 24 * 60 * 60 * 1000;
            const upcoming = equipment.filter(
              e => e.nextMaintenance > now && e.nextMaintenance < thirtyDaysFromNow
            );

            return upcoming.length > 0 ? (
              <div className="space-y-2">
                {upcoming.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 border border-yellow-200 dark:border-yellow-800/30 bg-yellow-50 dark:bg-yellow-900/10 rounded-lg flex justify-between items-center"
                  >
                    <div>
                      <p className="font-semibold text-sm">{item.name}</p>
                      <p className="text-xs text-muted-foreground">Due: {new Date(item.nextMaintenance).toLocaleDateString()}</p>
                    </div>
                    <span className="text-xs font-semibold text-yellow-800 dark:text-yellow-300 bg-yellow-100 dark:bg-yellow-900/20 px-2 py-1 rounded">
                      Schedule
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center py-4 text-muted-foreground">No maintenance due in the next 30 days</p>
            );
          })()}
        </CardContent>
      </Card>
    </div>
  );
}

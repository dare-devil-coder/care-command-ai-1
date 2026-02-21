'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertTriangle, Users, TrendingUp, Activity } from 'lucide-react';

interface Ward {
  name: string;
  workload: 'Critical' | 'High' | 'Moderate' | 'Low' | 'Normal';
  patients: number;
  nurses: number;
  requiredNurses: number;
}

interface WardDetailsProps {
  ward: Ward;
  onClose: () => void;
}

function WardDetails({ ward, onClose }: WardDetailsProps) {
  const nurseShortage = ward.requiredNurses - ward.nurses;
  const hasShortage = nurseShortage > 0;

  return (
    <DialogContent className="glass">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <Activity className="w-5 h-5" />
          {ward.name} - Ward Details
        </DialogTitle>
        <DialogDescription>
          Real-time workload and staffing information
        </DialogDescription>
      </DialogHeader>
      
      <div className="space-y-4">
        {/* Workload Status */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Workload Status</span>
          <Badge className={
            ward.workload === 'Critical' ? 'bg-red-500/20 text-red-300 border-red-500/50' :
            ward.workload === 'High' ? 'bg-orange-500/20 text-orange-300 border-orange-500/50' :
            ward.workload === 'Moderate' ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/50' :
            'bg-green-500/20 text-green-300 border-green-500/50'
          }>
            {ward.workload}
          </Badge>
        </div>

        {/* Patient Count */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-blue-400" />
            <span className="text-sm">Total Patients</span>
          </div>
          <span className="font-semibold">{ward.patients}</span>
        </div>

        {/* Nurse Staffing */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-green-400" />
            <span className="text-sm">Nurses Assigned</span>
          </div>
          <span className="font-semibold">{ward.nurses}</span>
        </div>

        {/* Required Nurses */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-purple-400" />
            <span className="text-sm">Required Nurses</span>
          </div>
          <span className="font-semibold">{ward.requiredNurses}</span>
        </div>

        {/* Nurse Shortage Warning */}
        {hasShortage && (
          <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-red-400" />
              <span className="text-sm font-semibold text-red-300">Nurse Shortage</span>
            </div>
            <p className="text-xs text-red-200">
              {ward.name} needs {nurseShortage} more nurse{nurseShortage > 1 ? 's' : ''} to meet optimal staffing levels.
            </p>
          </div>
        )}

        {/* AI Recommendation */}
        <div className="p-3 bg-blue-500/20 border border-blue-500/50 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-blue-400" />
            <span className="text-sm font-semibold text-blue-300">AI Recommendation</span>
          </div>
          <p className="text-xs text-blue-200">
            {hasShortage 
              ? `Assign ${nurseShortage} nurse${nurseShortage > 1 ? 's' : ''} from low workload wards to ${ward.name}.`
              : `${ward.name} is adequately staffed. Monitor patient flow for potential adjustments.`
            }
          </p>
        </div>

        <Button onClick={onClose} className="w-full">
          Close
        </Button>
      </div>
    </DialogContent>
  );
}

export function HospitalWorkloadHeatmap() {
  const [wards, setWards] = useState<Ward[]>([
    { name: "ICU", workload: "Critical", patients: 18, nurses: 4, requiredNurses: 6 },
    { name: "ER", workload: "High", patients: 22, nurses: 6, requiredNurses: 8 },
    { name: "Ward 2", workload: "Moderate", patients: 15, nurses: 5, requiredNurses: 5 },
    { name: "Ward 3", workload: "Low", patients: 10, nurses: 6, requiredNurses: 4 },
    { name: "Ward 4", workload: "Normal", patients: 12, nurses: 5, requiredNurses: 4 },
    { name: "Pediatrics", workload: "Moderate", patients: 14, nurses: 4, requiredNurses: 5 },
    { name: "Cardiology", workload: "High", patients: 20, nurses: 5, requiredNurses: 7 },
    { name: "Post-Op", workload: "Low", patients: 8, nurses: 4, requiredNurses: 3 }
  ]);

  const [selectedWard, setSelectedWard] = useState<Ward | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Color mapping for workload levels
  const getWorkloadColor = (workload: string) => {
    switch (workload) {
      case 'Critical': return 'bg-red-500/20 border-red-500/50 hover:bg-red-500/30';
      case 'High': return 'bg-orange-500/20 border-orange-500/50 hover:bg-orange-500/30';
      case 'Moderate': return 'bg-yellow-500/20 border-yellow-500/50 hover:bg-yellow-500/30';
      case 'Low':
      case 'Normal': return 'bg-green-500/20 border-green-500/50 hover:bg-green-500/30';
      default: return 'bg-gray-500/20 border-gray-500/50 hover:bg-gray-500/30';
    }
  };

  const getWorkloadBadgeColor = (workload: string) => {
    switch (workload) {
      case 'Critical': return 'bg-red-500/20 text-red-300 border-red-500/50';
      case 'High': return 'bg-orange-500/20 text-orange-300 border-orange-500/50';
      case 'Moderate': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/50';
      case 'Low':
      case 'Normal': return 'bg-green-500/20 text-green-300 border-green-500/50';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/50';
    }
  };

  // Auto-reassign nurse function
  const handleAutoReassign = () => {
    // Find critical wards
    const criticalWards = wards.filter(w => w.workload === 'Critical');
    if (criticalWards.length === 0) {
      alert('No critical wards require nurse reassignment.');
      return;
    }

    // Find low workload wards
    const lowWorkloadWards = wards.filter(w => w.workload === 'Low' || w.workload === 'Normal');
    if (lowWorkloadWards.length === 0) {
      alert('No nurses available from low workload wards.');
      return;
    }

    // Select first critical ward and first low workload ward
    const targetWard = criticalWards[0];
    const sourceWard = lowWorkloadWards[0];

    // Update wards data
    setWards(prevWards => 
      prevWards.map(ward => {
        if (ward.name === targetWard.name) {
          return { ...ward, nurses: ward.nurses + 1 };
        }
        if (ward.name === sourceWard.name) {
          return { ...ward, nurses: ward.nurses - 1 };
        }
        return ward;
      })
    );

    // Show confirmation
    alert(`AI reassigned Nurse Priya from ${sourceWard.name} to ${targetWard.name}.`);
  };

  // Live update simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setWards(prevWards => {
        const newWards = [...prevWards];
        const randomIndex = Math.floor(Math.random() * newWards.length);
        const workloadLevels: Array<'Critical' | 'High' | 'Moderate' | 'Low' | 'Normal'> = ['Critical', 'High', 'Moderate', 'Low', 'Normal'];
        const currentLevel = newWards[randomIndex].workload;
        
        // Randomly change workload (avoid same level)
        let newWorkload = workloadLevels[Math.floor(Math.random() * workloadLevels.length)];
        while (newWorkload === currentLevel) {
          newWorkload = workloadLevels[Math.floor(Math.random() * workloadLevels.length)];
        }
        
        newWards[randomIndex] = { ...newWards[randomIndex], workload: newWorkload };
        return newWards;
      });
    }, 10000); // Every 10 seconds

    return () => clearInterval(interval);
  }, []);

  const handleWardClick = (ward: Ward) => {
    setSelectedWard(ward);
    setIsDialogOpen(true);
  };

  return (
    <Card className="glass">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-orange-400" />
              🏥 Hospital Workload Heatmap
            </CardTitle>
            <CardDescription>
              Real-time ward workload monitoring and AI-powered nurse allocation
            </CardDescription>
          </div>
          <Button onClick={handleAutoReassign} className="bg-blue-500 hover:bg-blue-600">
            Auto-Reassign Nurse
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {wards.map((ward, index) => (
            <div
              key={ward.name}
              onClick={() => handleWardClick(ward)}
              className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-300 ${getWorkloadColor(ward.workload)}`}
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-sm">{ward.name}</h4>
                <Badge variant="outline" className={getWorkloadBadgeColor(ward.workload)}>
                  {ward.workload}
                </Badge>
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Patients:</span>
                  <span className="font-medium">{ward.patients}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Nurses:</span>
                  <span className="font-medium">{ward.nurses}/{ward.requiredNurses}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="mt-6 flex items-center justify-center gap-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span>Critical</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-orange-500"></div>
            <span>High</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <span>Moderate</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span>Low/Normal</span>
          </div>
        </div>
      </CardContent>

      {/* Ward Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        {selectedWard && (
          <WardDetails 
            ward={selectedWard} 
            onClose={() => setIsDialogOpen(false)} 
          />
        )}
      </Dialog>
    </Card>
  );
}

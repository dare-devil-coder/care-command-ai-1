'use client';

import { useEffect, useState } from 'react';
import { getPatients, updatePatient, getTasks, createTask, updateTask } from '@/lib/storage';
import { Patient, Task } from '@/lib/schemas';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { calculatePatientRisk, generateClinicalRecommendations, generateAlerts, predictPatientOutcome, generateDiagnosticSuggestions } from '@/lib/ai';
import { Sparkles, AlertTriangle, Plus, CheckCircle, TrendingUp, Activity, QrCode } from 'lucide-react';
import Link from 'next/link';

export default function DoctorDashboard() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [patientTasks, setPatientTasks] = useState<Task[]>([]);
  const [showDiagnosisDialog, setShowDiagnosisDialog] = useState(false);
  const [showMissionDialog, setShowMissionDialog] = useState(false);
  const [showCarePlanDialog, setShowCarePlanDialog] = useState(false);
  const [diagnosisText, setDiagnosisText] = useState('');
  const [newMission, setNewMission] = useState({ title: '', description: '', priority: 'medium' as const, assignedTo: 'nurse_001' });
  const [carePlanNotes, setCarePlanNotes] = useState('');
  const [aiRecommendations, setAiRecommendations] = useState<string[]>([]);
  const [showAiPanel, setShowAiPanel] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const allPatients = getPatients().filter(p => p.primaryDoctor === 'doctor_001');
    setPatients(allPatients.sort((a, b) => {
      const riskA = calculatePatientRisk(a).score;
      const riskB = calculatePatientRisk(b).score;
      return riskB - riskA;
    }));
    
    if (allPatients.length > 0 && !selectedPatient) {
      handlePatientSelect(allPatients[0]);
    }
  };

  const handlePatientSelect = (patient: Patient) => {
    setSelectedPatient(patient);
    setRecommendations(generateClinicalRecommendations(patient));
    setDiagnosisText(patient.conditions.join(', '));
    setCarePlanNotes(patient.notes || '');
    
    const tasks = getTasks().filter(t => t.patientId === patient.id);
    setPatientTasks(tasks);
  };

  const handleUpdateDiagnosis = () => {
    if (!selectedPatient) return;
    
    const updatedPatient = {
      ...selectedPatient,
      conditions: diagnosisText.split(',').map(c => c.trim()).filter(c => c)
    };
    
    updatePatient(updatedPatient);
    setSelectedPatient(updatedPatient);
    setShowDiagnosisDialog(false);
    loadData();
  };

  const handleCreateMission = () => {
    if (!selectedPatient || !newMission.title) return;
    
    createTask({
      title: newMission.title,
      description: newMission.description,
      patientId: selectedPatient.id,
      assignedTo: newMission.assignedTo,
      priority: newMission.priority,
      status: 'pending',
      dueDate: Date.now() + 24 * 60 * 60 * 1000,
      createdBy: 'doctor_001'
    });
    
    setNewMission({ title: '', description: '', priority: 'medium', assignedTo: 'nurse_001' });
    setShowMissionDialog(false);
    
    const tasks = getTasks().filter(t => t.patientId === selectedPatient.id);
    setPatientTasks(tasks);
  };

  const handleApproveMission = (taskId: string) => {
    const task = getTasks().find(t => t.id === taskId);
    if (task) {
      updateTask({ ...task, status: 'completed', completedAt: Date.now() });
      const tasks = getTasks().filter(t => t.patientId === selectedPatient?.id);
      setPatientTasks(tasks);
    }
  };

  const handleUpdateCarePlan = () => {
    if (!selectedPatient) return;
    
    const updatedPatient = {
      ...selectedPatient,
      notes: carePlanNotes
    };
    
    updatePatient(updatedPatient);
    setSelectedPatient(updatedPatient);
    setShowCarePlanDialog(false);
  };

  const handleChangePriority = (newPriority: 'low' | 'medium' | 'high' | 'critical') => {
    if (!selectedPatient) return;
    
    const updatedPatient = {
      ...selectedPatient,
      riskLevel: newPriority
    };
    
    updatePatient(updatedPatient);
    setSelectedPatient(updatedPatient);
    loadData();
  };

  const handleGenerateAiRecommendations = () => {
    if (!selectedPatient) return;
    
    const outcome = predictPatientOutcome(selectedPatient);
    const diagnostics = generateDiagnosticSuggestions(selectedPatient);
    const clinical = generateClinicalRecommendations(selectedPatient);
    
    const combined = [
      `Outlook: ${outcome.outlook}`,
      `Timeline: ${outcome.timeline}`,
      ...outcome.interventions.map(i => `Intervention: ${i}`),
      ...diagnostics.map(d => `${d.test} (${d.priority}): ${d.reason}`),
      ...clinical
    ];
    
    setAiRecommendations(combined);
    setShowAiPanel(true);
  };

  const getRiskColor = (level: string) => {
    const colors: Record<string, string> = {
      critical: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300',
      high: 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300',
      medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300',
      low: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
    };
    return colors[level] || colors.low;
  };

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      critical: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300',
      high: 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300',
      medium: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300',
      low: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300'
    };
    return colors[priority] || colors.low;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">Doctor Dashboard</h1>
          <p className="text-muted-foreground">Patient management and clinical oversight</p>
        </div>
        <div className="flex gap-2">
          <Link href="/dashboard/doctor/qr-scan">
            <Button className="gap-2">
              <QrCode className="w-4 h-4" />
              Scan Patient QR
            </Button>
          </Link>
          {selectedPatient && (
            <Button onClick={handleGenerateAiRecommendations} className="gap-2">
              <Sparkles className="w-4 h-4" />
              Generate AI Treatment Plan
            </Button>
          )}
        </div>
      </div>

      {/* Emergency Alerts Feed */}
      {selectedPatient && (() => {
        const alerts = generateAlerts(selectedPatient);
        const criticalAlerts = alerts.filter(a => a.severity === 'critical');
        
        return criticalAlerts.length > 0 && (
          <Card className="glass border-red-500/50 bg-red-50/50 dark:bg-red-900/10">
            <CardHeader className="pb-3">
              <CardTitle className="text-red-900 dark:text-red-300 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Emergency Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {criticalAlerts.map((alert, i) => (
                  <div key={i} className="p-3 bg-red-100 dark:bg-red-900/20 rounded-lg border border-red-300 dark:border-red-800/30">
                    <p className="text-sm font-semibold text-red-900 dark:text-red-300">{alert.message}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        );
      })()}

      {/* AI Risk Analytics Panel */}
      {showAiPanel && (
        <Card className="glass border-purple-500/50 bg-purple-50/50 dark:bg-purple-900/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-purple-600" />
              AI Treatment Recommendations
            </CardTitle>
            <CardDescription>Generated analysis and treatment plan</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {aiRecommendations.map((rec, i) => (
                <div key={i} className="p-2 bg-white/50 dark:bg-white/5 rounded text-sm">
                  <span className="text-purple-600 dark:text-purple-400 font-bold">•</span> {rec}
                </div>
              ))}
            </div>
            <Button onClick={() => setShowAiPanel(false)} variant="outline" className="mt-4 w-full">
              Close
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Patient Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Assigned Patient List */}
        <Card className="glass lg:col-span-1">
          <CardHeader>
            <CardTitle>Assigned Patients</CardTitle>
            <CardDescription>Sorted by risk level</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-[600px] overflow-y-auto">
              {patients.map((patient) => {
                const risk = calculatePatientRisk(patient);
                const alerts = generateAlerts(patient);
                const hasCritical = alerts.some(a => a.severity === 'critical');
                
                return (
                  <button
                    key={patient.id}
                    onClick={() => handlePatientSelect(patient)}
                    className={`w-full p-3 text-left rounded-lg border transition-all ${
                      selectedPatient?.id === patient.id
                        ? 'border-primary bg-primary/10'
                        : 'border-white/20 dark:border-white/10 hover:bg-white/5'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-sm">{patient.name}</p>
                        {hasCritical && <AlertTriangle className="w-4 h-4 text-red-500" />}
                      </div>
                      <Badge className={getRiskColor(risk.level)} variant="secondary">
                        {risk.score}%
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">Age: {patient.age} • {patient.medicalRecordNumber}</p>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Patient Details */}
        <div className="lg:col-span-2 space-y-4">
          {selectedPatient && (
            <>
              {/* Patient Info & Actions */}
              <Card className="glass">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{selectedPatient.name}</CardTitle>
                      <CardDescription>Patient ID: {selectedPatient.medicalRecordNumber}</CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Dialog open={showDiagnosisDialog} onOpenChange={setShowDiagnosisDialog}>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">Update Diagnosis</Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Update Diagnosis</DialogTitle>
                            <DialogDescription>Modify patient conditions and diagnosis</DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <label className="text-sm font-medium">Conditions (comma-separated)</label>
                              <Textarea
                                value={diagnosisText}
                                onChange={(e) => setDiagnosisText(e.target.value)}
                                placeholder="Hypertension, Diabetes, etc."
                                rows={3}
                              />
                            </div>
                            <Button onClick={handleUpdateDiagnosis} className="w-full">Save Diagnosis</Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                      
                      <Dialog open={showCarePlanDialog} onOpenChange={setShowCarePlanDialog}>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">Update Care Plan</Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Update Care Plan</DialogTitle>
                            <DialogDescription>Modify treatment notes and care instructions</DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <label className="text-sm font-medium">Care Plan Notes</label>
                              <Textarea
                                value={carePlanNotes}
                                onChange={(e) => setCarePlanNotes(e.target.value)}
                                placeholder="Enter care plan details..."
                                rows={5}
                              />
                            </div>
                            <Button onClick={handleUpdateCarePlan} className="w-full">Save Care Plan</Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Age</p>
                      <p className="font-semibold">{selectedPatient.age} years</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Gender</p>
                      <p className="font-semibold">{selectedPatient.gender}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Blood Type</p>
                      <p className="font-semibold">{selectedPatient.bloodType}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Priority</p>
                      <Select value={selectedPatient.riskLevel || 'medium'} onValueChange={(v: any) => handleChangePriority(v)}>
                        <SelectTrigger className="h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="critical">Critical</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Conditions */}
                  <div>
                    <p className="text-sm font-semibold mb-2">Conditions</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedPatient.conditions.map((c) => (
                        <Badge key={c} variant="secondary">{c}</Badge>
                      ))}
                    </div>
                  </div>

                  {selectedPatient.allergies.length > 0 && (
                    <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800/30">
                      <p className="text-sm font-semibold text-red-900 dark:text-red-300">Allergies</p>
                      <p className="text-sm text-red-800 dark:text-red-400">{selectedPatient.allergies.join(', ')}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Nurse Missions Management */}
              <Card className="glass">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>Nurse Missions</CardTitle>
                      <CardDescription>Manage and approve patient care tasks</CardDescription>
                    </div>
                    <Dialog open={showMissionDialog} onOpenChange={setShowMissionDialog}>
                      <DialogTrigger asChild>
                        <Button size="sm" className="gap-2">
                          <Plus className="w-4 h-4" />
                          Add Mission
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Create New Mission</DialogTitle>
                          <DialogDescription>Assign a new task to nursing staff</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <label className="text-sm font-medium">Mission Title</label>
                            <Input
                              value={newMission.title}
                              onChange={(e) => setNewMission({ ...newMission, title: e.target.value })}
                              placeholder="e.g., Check vital signs"
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium">Description</label>
                            <Textarea
                              value={newMission.description}
                              onChange={(e) => setNewMission({ ...newMission, description: e.target.value })}
                              placeholder="Detailed instructions..."
                              rows={3}
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium">Priority</label>
                            <Select value={newMission.priority} onValueChange={(v: any) => setNewMission({ ...newMission, priority: v })}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="low">Low</SelectItem>
                                <SelectItem value="medium">Medium</SelectItem>
                                <SelectItem value="high">High</SelectItem>
                                <SelectItem value="critical">Critical</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <label className="text-sm font-medium">Assign To</label>
                            <Select value={newMission.assignedTo} onValueChange={(v) => setNewMission({ ...newMission, assignedTo: v })}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="nurse_001">Sarah Johnson (Nurse)</SelectItem>
                                <SelectItem value="nurse_002">Emily Davis (Nurse)</SelectItem>
                                <SelectItem value="nurse_003">Michael Brown (Nurse)</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <Button onClick={handleCreateMission} className="w-full">Create Mission</Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardHeader>
                <CardContent>
                  {patientTasks.length > 0 ? (
                    <div className="space-y-2">
                      {patientTasks.map((task) => (
                        <div key={task.id} className="p-3 border border-white/20 dark:border-white/10 rounded-lg">
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex-1">
                              <p className="font-semibold text-sm">{task.title}</p>
                              <p className="text-xs text-muted-foreground">{task.description}</p>
                            </div>
                            <div className="flex gap-2 items-center">
                              <Badge className={getPriorityColor(task.priority)} variant="secondary">
                                {task.priority}
                              </Badge>
                              {task.status === 'in-progress' && (
                                <Button size="sm" variant="outline" onClick={() => handleApproveMission(task.id)} className="gap-1">
                                  <CheckCircle className="w-3 h-3" />
                                  Approve
                                </Button>
                              )}
                            </div>
                          </div>
                          <div className="flex justify-between items-center text-xs text-muted-foreground">
                            <span>Status: {task.status}</span>
                            <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-muted-foreground py-4">No missions assigned yet</p>
                  )}
                </CardContent>
              </Card>

              {/* Vital Signs */}
              <Card className="glass">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    Current Vital Signs
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-white/50 dark:bg-white/5 rounded-lg">
                      <p className="text-xs text-muted-foreground">Blood Pressure</p>
                      <p className="font-bold text-lg">
                        {selectedPatient.vitals.bloodPressure.systolic}/{selectedPatient.vitals.bloodPressure.diastolic}
                      </p>
                      <p className="text-xs text-muted-foreground">mmHg</p>
                    </div>
                    <div className="p-3 bg-white/50 dark:bg-white/5 rounded-lg">
                      <p className="text-xs text-muted-foreground">Heart Rate</p>
                      <p className="font-bold text-lg">{selectedPatient.vitals.heartRate}</p>
                      <p className="text-xs text-muted-foreground">bpm</p>
                    </div>
                    <div className="p-3 bg-white/50 dark:bg-white/5 rounded-lg">
                      <p className="text-xs text-muted-foreground">Temperature</p>
                      <p className="font-bold text-lg">{selectedPatient.vitals.temperature.toFixed(1)}</p>
                      <p className="text-xs text-muted-foreground">°C</p>
                    </div>
                    <div className="p-3 bg-white/50 dark:bg-white/5 rounded-lg">
                      <p className="text-xs text-muted-foreground">O₂ Saturation</p>
                      <p className="font-bold text-lg">{selectedPatient.vitals.oxygenSaturation.toFixed(1)}%</p>
                      <p className="text-xs text-muted-foreground">SpO₂</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Risk Assessment */}
              <Card className="glass">
                <CardHeader>
                  <CardTitle>AI Risk Assessment</CardTitle>
                </CardHeader>
                <CardContent>
                  {(() => {
                    const risk = calculatePatientRisk(selectedPatient);
                    const riskBg: Record<string, string> = {
                      critical: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800/30',
                      high: 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800/30',
                      medium: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800/30',
                      low: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800/30'
                    };
                    const riskText: Record<string, string> = {
                      critical: 'text-red-900 dark:text-red-300',
                      high: 'text-orange-900 dark:text-orange-300',
                      medium: 'text-yellow-900 dark:text-yellow-300',
                      low: 'text-green-900 dark:text-green-300'
                    };
                    return (
                      <div className={`p-4 rounded-lg border ${riskBg[risk.level]}`}>
                        <div className="flex justify-between items-center mb-2">
                          <span className={`font-bold text-lg ${riskText[risk.level]}`}>
                            {risk.level.toUpperCase()}
                          </span>
                          <span className={`text-2xl font-bold ${riskText[risk.level]}`}>
                            {risk.score}%
                          </span>
                        </div>
                        <p className={`text-sm mb-3 ${riskText[risk.level]}`}>
                          {risk.recommendation}
                        </p>
                        <p className={`text-xs font-semibold mb-2 ${riskText[risk.level]}`}>Risk Factors:</p>
                        <ul className={`text-xs space-y-1 ${riskText[risk.level]}`}>
                          {risk.reasons.map((reason, i) => (
                            <li key={i}>• {reason}</li>
                          ))}
                        </ul>
                      </div>
                    );
                  })()}
                </CardContent>
              </Card>

              {/* Clinical Recommendations */}
              <Card className="glass">
                <CardHeader>
                  <CardTitle>Clinical Recommendations</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {recommendations.map((rec, i) => (
                      <li key={i} className="flex gap-2 text-sm">
                        <span className="text-primary font-bold">•</span>
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

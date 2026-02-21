'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/shared/dashboard-layout';
import QRScanner from '@/components/shared/qr-scanner';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { mockPatients } from '@/lib/mock-data';

export default function QRScannerPage() {
  const router = useRouter();
  const [scannedCode, setScannedCode] = useState<string | null>(null);
  const [showScanner, setShowScanner] = useState(true);

  const handleScanSuccess = (qrCode: string) => {
    setScannedCode(qrCode);
    setShowScanner(false);
  };

  const foundPatient = scannedCode
    ? mockPatients.find((p) => p.qrCode === scannedCode)
    : null;

  const handleManualSearch = (qrCode: string) => {
    const patient = mockPatients.find((p) => p.qrCode === qrCode);
    if (patient) {
      setScannedCode(qrCode);
      setShowScanner(false);
    }
  };

  return (
    <DashboardLayout title="QR Code Scanner" subtitle="Patient Identification & Record Access">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Scanner */}
        <div className="lg:col-span-2">
          {showScanner ? (
            <Card className="glass p-6">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <span>📱</span> QR Code Scanner
              </h2>
              <QRScanner
                onScanSuccess={handleScanSuccess}
                onScanError={(error) => console.error('Scan error:', error)}
              />
              <div className="mt-4">
                <p className="text-sm text-slate-600 dark:text-slate-400 text-center mb-4">
                  Position the patient's QR code in the frame above
                </p>
              </div>
            </Card>
          ) : (
            <Card className="glass p-6">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Scan Result</h2>
              {foundPatient ? (
                <div className="space-y-6">
                  {/* Patient Header */}
                  <div className="flex items-start gap-4 pb-4 border-b border-white/20 dark:border-white/10">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-violet-400 to-purple-400 flex items-center justify-center text-white text-2xl">
                      {foundPatient.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{foundPatient.name}</h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400">ID: {foundPatient.qrCode}</p>
                      <div className="flex gap-2 mt-2">
                        <span className="text-xs px-2 py-1 rounded bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300">
                          {foundPatient.age} years
                        </span>
                        <span className="text-xs px-2 py-1 rounded bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                          {foundPatient.bloodType}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Vital Signs */}
                  <div>
                    <h4 className="font-semibold text-slate-900 dark:text-white mb-4">Current Vital Signs</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-white/40 dark:bg-slate-800/40 rounded-lg p-4 text-center">
                        <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Heart Rate</p>
                        <p className="text-2xl font-bold text-slate-900 dark:text-white">{foundPatient.vitalSigns.heartRate}</p>
                        <p className="text-xs text-slate-600 dark:text-slate-400">bpm</p>
                      </div>
                      <div className="bg-white/40 dark:bg-slate-800/40 rounded-lg p-4 text-center">
                        <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Blood Pressure</p>
                        <p className="text-2xl font-bold text-slate-900 dark:text-white">{foundPatient.vitalSigns.bloodPressure}</p>
                        <p className="text-xs text-slate-600 dark:text-slate-400">mmHg</p>
                      </div>
                      <div className="bg-white/40 dark:bg-slate-800/40 rounded-lg p-4 text-center">
                        <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Temperature</p>
                        <p className="text-2xl font-bold text-slate-900 dark:text-white">{foundPatient.vitalSigns.temperature}</p>
                        <p className="text-xs text-slate-600 dark:text-slate-400">°F</p>
                      </div>
                      <div className="bg-white/40 dark:bg-slate-800/40 rounded-lg p-4 text-center">
                        <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Oxygen Level</p>
                        <p className="text-2xl font-bold text-slate-900 dark:text-white">{foundPatient.vitalSigns.oxygenLevel}%</p>
                        <p className="text-xs text-slate-600 dark:text-slate-400">SpO2</p>
                      </div>
                    </div>
                  </div>

                  {/* Medical Info */}
                  <div>
                    <h4 className="font-semibold text-slate-900 dark:text-white mb-4">Medical Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">Conditions</p>
                        <div className="space-y-2">
                          {foundPatient.conditions.map((condition) => (
                            <div
                              key={condition}
                              className="text-sm px-3 py-2 rounded bg-orange-50 dark:bg-orange-950/20 text-orange-700 dark:text-orange-300 border border-orange-200 dark:border-orange-800"
                            >
                              {condition}
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">Allergies</p>
                        {foundPatient.allergies.length > 0 ? (
                          <div className="space-y-2">
                            {foundPatient.allergies.map((allergy) => (
                              <div
                                key={allergy}
                                className="text-sm px-3 py-2 rounded bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800"
                              >
                                ⚠️ {allergy}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-slate-600 dark:text-slate-400">No known allergies</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Current Medications */}
                  <div>
                    <h4 className="font-semibold text-slate-900 dark:text-white mb-4">Current Medications</h4>
                    <div className="space-y-2">
                      {foundPatient.medications.map((med) => (
                        <div
                          key={med}
                          className="flex items-center gap-2 p-3 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800"
                        >
                          <span className="text-green-600 dark:text-green-400">💊</span>
                          <span className="text-sm text-green-700 dark:text-green-300">{med}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Risk Assessment */}
                  <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                    <p className="text-sm text-blue-700 dark:text-blue-400">
                      <span className="font-semibold">Risk Score: {foundPatient.riskScore.toFixed(1)}/10</span>
                      <br />
                      {foundPatient.riskScore >= 8
                        ? 'High risk - Requires immediate attention and continuous monitoring'
                        : foundPatient.riskScore >= 5
                        ? 'Medium risk - Regular monitoring recommended'
                        : 'Low risk - Standard care protocols'}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-4">
                    <Button
                      onClick={() => router.push(`/nurse/patients/${foundPatient.id}`)}
                      className="flex-1 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white"
                    >
                      View Full Profile
                    </Button>
                    <Button
                      onClick={() => {
                        setScannedCode(null);
                        setShowScanner(true);
                      }}
                      className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white"
                    >
                      Scan Another
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-red-600 dark:text-red-400 mb-4">Patient not found: {scannedCode}</p>
                  <Button
                    onClick={() => {
                      setScannedCode(null);
                      setShowScanner(true);
                    }}
                    className="bg-violet-600 hover:bg-violet-700 text-white"
                  >
                    Try Again
                  </Button>
                </div>
              )}
            </Card>
          )}
        </div>

        {/* Quick Demo */}
        <Card className="glass p-6 h-fit">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <span>📋</span> Patients
          </h2>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {mockPatients.map((patient) => (
              <button
                key={patient.id}
                onClick={() => handleManualSearch(patient.qrCode)}
                className="w-full text-left p-3 rounded-lg hover:bg-white/50 dark:hover:bg-slate-800/50 transition-colors border border-white/20 dark:border-white/10"
              >
                <p className="font-medium text-slate-900 dark:text-white text-sm">{patient.name}</p>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">{patient.qrCode}</p>
              </button>
            ))}
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-4 text-center">
            Click a patient to simulate scan
          </p>
        </Card>
      </div>
    </DashboardLayout>
  );
}

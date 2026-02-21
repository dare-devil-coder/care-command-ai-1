'use client';

import { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const patients = [
  { id: "301", name: "Margaret Johnson", room: "301" },
  { id: "302", name: "Robert Chen", room: "302" },
  { id: "303", name: "Sarah Williams", room: "303" },
];

export default function GenerateQRPage() {
  const canvasRefs = useRef<(HTMLCanvasElement | null)[]>([]);
  
  // Quick Generator State
  const [showGenerator, setShowGenerator] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState("");
  const [generatedQR, setGeneratedQR] = useState(false);
  const quickCanvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    patients.forEach((patient, index) => {
      const canvas = canvasRefs.current[index];
      if (canvas) {
        // Generate plain QR code with PATIENT-ID format
        QRCode.toCanvas(canvas, `PATIENT-${patient.id}`, {
          width: 200,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#FFFFFF'
          }
        });
      }
    });
  }, []);

  const downloadQR = (patientId: string) => {
    const canvas = document.createElement('canvas');
    // Generate plain QR code with PATIENT-ID format
    QRCode.toCanvas(canvas, `PATIENT-${patientId}`, {
      width: 400,
      margin: 2,
    }, (error) => {
      if (error) {
        console.error(error);
        return;
      }
      const link = document.createElement('a');
      link.download = `patient-${patientId}-qr.png`;
      link.href = canvas.toDataURL();
      link.click();
    });
  };

  // Quick Generator Functions
  const handleGenerate = async () => {
    if (!selectedPatient) return;
    if (!quickCanvasRef.current) return;

    try {
      await QRCode.toCanvas(
        quickCanvasRef.current,
        `PATIENT-${selectedPatient}`,
        {
          width: 220,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#FFFFFF'
          }
        }
      );

      setGeneratedQR(true);
    } catch (error) {
      console.error("QR generation failed:", error);
    }
  };

  const handleDownload = () => {
    if (!quickCanvasRef.current) return;

    const link = document.createElement("a");
    link.download = `patient-${selectedPatient}-qr.png`;
    link.href = quickCanvasRef.current.toDataURL("image/png");
    link.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Generate Patient QR Codes</h1>
          <p className="text-muted-foreground">Create QR codes for patient identification</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowGenerator(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
          >
            Generate QR Code
          </button>
          <Link href="/dashboard/admin">
            <Button variant="outline">Back to Dashboard</Button>
          </Link>
        </div>
      </div>

      {/* Quick QR Generator Panel */}
      {showGenerator && (
        <div className="mt-6 p-6 bg-slate-900 rounded-lg border border-slate-700">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Select Patient</h3>
            <button
              onClick={() => {
                setShowGenerator(false);
                setSelectedPatient("");
                setGeneratedQR(false);
              }}
              className="text-gray-400 hover:text-white transition-colors"
            >
              ✕
            </button>
          </div>

          <select
            value={selectedPatient}
            onChange={(e) => {
              setSelectedPatient(e.target.value);
              setGeneratedQR(false);
            }}
            className="w-full p-3 rounded-md bg-slate-800 border border-slate-700 text-white focus:border-blue-500 focus:outline-none"
          >
            <option value="">Select Patient</option>
            <option value="301">Margaret Johnson - Room 301</option>
            <option value="302">Robert Chen - Room 302</option>
            <option value="303">Sarah Williams - Room 303</option>
          </select>

          <button
            onClick={handleGenerate}
            disabled={!selectedPatient}
            className="mt-4 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-4 py-2 rounded-md transition-colors"
          >
            Generate
          </button>

          {generatedQR && (
            <div className="mt-6">
              <div className="flex justify-center bg-white p-4 rounded-lg mb-4">
                <canvas ref={quickCanvasRef} />
              </div>
              <button
                onClick={handleDownload}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
              >
                Download QR Code
              </button>
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {patients.map((patient, index) => (
          <Card key={patient.id} className="glass">
            <CardHeader>
              <CardTitle>{patient.name}</CardTitle>
              <CardDescription>Room {patient.room} • ID: {patient.id}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-center bg-white p-4 rounded-lg">
                <canvas
                  ref={(el) => {
                    canvasRefs.current[index] = el;
                  }}
                />
              </div>
              <Button
                onClick={() => downloadQR(patient.id)}
                className="w-full"
              >
                Download QR Code
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="glass bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800/30">
        <CardHeader>
          <CardTitle className="text-blue-900 dark:text-blue-300">How to Use</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-blue-800 dark:text-blue-400">
          <p>1. Download the QR codes for each patient</p>
          <p>2. Print the QR codes and attach them to patient wristbands or room doors</p>
          <p>3. Nurses and doctors can scan these codes to quickly access patient information</p>
          <p>4. Each QR code contains the patient ID in format: PATIENT-301, PATIENT-302, etc.</p>
          <p>5. QR codes are compatible with the dual-mode scanner system</p>
        </CardContent>
      </Card>
    </div>
  );
}

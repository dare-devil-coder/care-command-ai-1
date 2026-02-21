'use client';

import { useEffect, useRef, useState } from 'react';
import jsQR from 'jsqr';
import { decryptSecureQR } from '@/lib/qrToken';
import { addNurseNotification } from '@/lib/notificationStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface PatientData {
  id: string;
  name: string;
  age: number;
  room: string;
  condition: string;
}

const patientQRMap: Record<string, PatientData> = {
  "301": {
    id: "301",
    name: "Margaret Johnson",
    age: 78,
    room: "301",
    condition: "Pneumonia with sepsis risk",
  },
  "302": {
    id: "302",
    name: "Robert Chen",
    age: 65,
    room: "302",
    condition: "Post-op cardiac surgery",
  },
  "303": {
    id: "303",
    name: "Sarah Williams",
    age: 52,
    room: "303",
    condition: "Diabetes management",
  },
  "PATIENT-301": {
    id: "301",
    name: "Margaret Johnson",
    age: 78,
    room: "301",
    condition: "Pneumonia with sepsis risk",
  },
  "PATIENT-302": {
    id: "302",
    name: "Robert Chen",
    age: 65,
    room: "302",
    condition: "Post-op cardiac surgery",
  },
  "PATIENT-303": {
    id: "303",
    name: "Sarah Williams",
    age: 52,
    room: "303",
    condition: "Diabetes management",
  },
};

export default function QRScannerPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [scanning, setScanning] = useState(false);
  const [scannedData, setScannedData] = useState<PatientData | null>(null);
  const [scanHistory, setScanHistory] = useState<PatientData[]>([]);
  const [error, setError] = useState('');
  const [cameraActive, setCameraActive] = useState(false);
  const [usedTokens, setUsedTokens] = useState<string[]>([]);

  const startCamera = async () => {
    try {
      setError('');
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        
        // Wait for video metadata to load before starting scan
        videoRef.current.onloadedmetadata = () => {
          if (videoRef.current) {
            videoRef.current.play();
            setCameraActive(true);
            setScanning(true);
          }
        };
      }
    } catch (err) {
      setError('Unable to access camera. Please check permissions and try again.');
      console.error('Camera error:', err);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
      setCameraActive(false);
      setScanning(false);
    }
  };

  const handleQRResult = (qrValue: string) => {
    // First try secure decryption
    const decrypted = decryptSecureQR(qrValue);

    // If decrypted and valid
    if (decrypted && !decrypted.expired) {
      // Check if token was already used
      if (usedTokens.includes(qrValue)) {
        setError('QR code already used. Please generate a new one.');
        setTimeout(() => setError(''), 3000);
        return;
      }

      const patient = patientQRMap[decrypted.id];

      if (patient) {
        setScannedData(patient);
        setScanHistory(prev => [patient, ...prev.slice(0, 9)]);
        setUsedTokens(prev => [...prev, qrValue]);
        setScanning(false);
        stopCamera();
        // Add notification for successful scan
        addNurseNotification(`Successfully scanned patient: ${patient.name} (Room ${patient.room})`);
        return;
      }
    }

    // If expired encrypted token
    if (decrypted?.expired) {
      setError('QR code expired. Please generate a new one (valid for 5 minutes).');
      setTimeout(() => setError(''), 3000);
      return;
    }

    // Fallback: Plain QR format like "PATIENT-301" or "301"
    if (patientQRMap[qrValue]) {
      setScannedData(patientQRMap[qrValue]);
      setScanHistory(prev => [patientQRMap[qrValue], ...prev.slice(0, 9)]);
      setScanning(false);
      stopCamera();
      // Add notification for successful scan
      addNurseNotification(`Successfully scanned patient: ${patientQRMap[qrValue].name} (Room ${patientQRMap[qrValue].room})`);
      return;
    }

    // Invalid QR
    setError('Invalid patient QR code. Please scan a valid QR code.');
    setTimeout(() => setError(''), 3000);
  };

  const decodeQRCode = () => {
    if (!videoRef.current || !canvasRef.current || !cameraActive) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Safety check: ensure video has valid dimensions
    if (video.videoWidth === 0 || video.videoHeight === 0) {
      return;
    }

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Additional safety check for canvas dimensions
    if (canvas.width === 0 || canvas.height === 0) {
      return;
    }

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Get image data safely
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    
    // Use jsQR to detect QR code
    const qrCode = jsQR(imageData.data, imageData.width, imageData.height);
    
    if (qrCode) {
      handleQRResult(qrCode.data);
    }
  };

  // Scanner loop - runs every 500ms
  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (scanning && cameraActive) {
      intervalId = setInterval(() => {
        decodeQRCode();
      }, 500);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [scanning, cameraActive]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);



  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">QR Code Scanner</h1>
          <p className="text-muted-foreground">Scan patient IDs or equipment labels</p>
        </div>
        <Link href="/dashboard/nurse">
          <Button variant="outline">Back to Dashboard</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Scanner */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="glass">
            <CardHeader>
              <CardTitle>Camera Scanner</CardTitle>
              <CardDescription>
                {cameraActive ? 'Camera is active, scanning...' : 'Ready to scan QR codes'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Video Stream */}
                <div className="relative w-full bg-black rounded-lg overflow-hidden aspect-video">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="w-full h-full object-cover"
                  />
                  <canvas ref={canvasRef} className="hidden" />
                  
                  {cameraActive && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="w-64 h-64 border-2 border-primary/50 rounded-lg animate-pulse"></div>
                    </div>
                  )}
                </div>

                {error && (
                  <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm">
                    {error}
                  </div>
                )}

                {/* Controls */}
                <div className="flex gap-2">
                  {!cameraActive ? (
                    <Button onClick={startCamera} className="flex-1 bg-primary hover:bg-primary/90">
                      Start Camera
                    </Button>
                  ) : (
                    <Button onClick={stopCamera} variant="destructive" className="flex-1">
                      Stop Camera
                    </Button>
                  )}
                </div>

                {/* Status */}
                {cameraActive && (
                  <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-sm text-blue-800 dark:text-blue-300">
                    Camera active. Point at a patient QR code to scan automatically.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Results */}
        <div className="space-y-4">
          {/* Current Scan */}
          {scannedData && (
            <Card className="glass bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800/30">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-green-900 dark:text-green-300">
                  Scanned Successfully!
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-xs text-green-800 dark:text-green-400 font-semibold uppercase">Patient Name</p>
                  <p className="font-semibold">{scannedData.name}</p>
                </div>
                <div>
                  <p className="text-xs text-green-800 dark:text-green-400 font-semibold uppercase">Patient ID</p>
                  <p className="font-mono text-sm">{scannedData.id}</p>
                </div>
                <div>
                  <p className="text-xs text-green-800 dark:text-green-400 font-semibold uppercase">Age</p>
                  <p>{scannedData.age} years</p>
                </div>
                <div>
                  <p className="text-xs text-green-800 dark:text-green-400 font-semibold uppercase">Room</p>
                  <p>{scannedData.room}</p>
                </div>
                <div>
                  <p className="text-xs text-green-800 dark:text-green-400 font-semibold uppercase">Condition</p>
                  <p className="text-sm">{scannedData.condition}</p>
                </div>

                <Link href={`/dashboard/nurse/patients/${scannedData.id}`}>
                  <Button className="w-full mt-2">View Full Details</Button>
                </Link>

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    setScannedData(null);
                    startCamera();
                  }}
                >
                  Scan Another
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Scan History */}
          {scanHistory.length > 0 && (
            <Card className="glass">
              <CardHeader>
                <CardTitle className="text-sm">Recent Scans</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {scanHistory.map((item, idx) => (
                    <button
                      key={idx}
                      className="w-full text-left p-2 bg-white/50 dark:bg-white/5 rounded hover:bg-white/20 dark:hover:bg-white/10 transition-colors text-sm"
                      onClick={() => setScannedData(item)}
                    >
                      <p className="font-semibold">{item.name}</p>
                      <p className="text-xs text-muted-foreground">
                        Room {item.room} • ID: {item.id}
                      </p>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

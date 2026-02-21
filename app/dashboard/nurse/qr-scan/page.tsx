'use client';

import { useEffect, useRef, useState } from 'react';
import { getPatients, getEquipment } from '@/lib/storage';
import { Patient, Equipment, QRCodeData } from '@/lib/schemas';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function QRScannerPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [scanning, setScanning] = useState(false);
  const [scannedData, setScannedData] = useState<QRCodeData | null>(null);
  const [scanHistory, setScanHistory] = useState<QRCodeData[]>([]);
  const [error, setError] = useState('');
  const [cameraActive, setCameraActive] = useState(false);

  const startCamera = async () => {
    try {
      setError('');
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraActive(true);
        setScanning(true);
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

  const decodeQRCode = async () => {
    if (!videoRef.current || !canvasRef.current || !cameraActive) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    ctx.drawImage(videoRef.current, 0, 0);

    // Simulate QR code detection with mock data
    // In a real app, you'd use a QR code detection library like jsQR or ZXing
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    
    // Mock detection: randomly find a code every few frames
    if (Math.random() > 0.97) {
      const patients = getPatients();
      const equipment = getEquipment();
      const allItems = [
        ...patients.map(p => ({ type: 'patient' as const, id: p.id, name: p.name })),
        ...equipment.map(e => ({ type: 'equipment' as const, id: e.id, name: e.name, location: e.location }))
      ];

      if (allItems.length > 0) {
        const scanned = allItems[Math.floor(Math.random() * allItems.length)];
        const qrData: QRCodeData = {
          type: scanned.type,
          id: scanned.id,
          name: scanned.name,
          location: scanned.location,
          timestamp: Date.now()
        };
        
        setScannedData(qrData);
        setScanHistory(prev => [qrData, ...prev.slice(0, 9)]);
        setScanning(false);
        stopCamera();
      }
    }
  };

  // Scanner loop
  useEffect(() => {
    let animationId: number;

    const scan = async () => {
      if (scanning && cameraActive) {
        await decodeQRCode();
        animationId = requestAnimationFrame(scan);
      }
    };

    if (scanning && cameraActive) {
      animationId = requestAnimationFrame(scan);
    }

    return () => {
      if (animationId) cancelAnimationFrame(animationId);
    };
  }, [scanning, cameraActive]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const getItemDetails = () => {
    if (!scannedData) return null;

    if (scannedData.type === 'patient') {
      const patient = getPatients().find(p => p.id === scannedData.id);
      return patient;
    } else {
      const item = getEquipment().find(e => e.id === scannedData.id);
      return item;
    }
  };

  const itemDetails = getItemDetails();

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
                    Camera active. Point at a QR code to scan. Will auto-detect when a code is found.
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
                  <p className="text-xs text-green-800 dark:text-green-400 font-semibold uppercase">Type</p>
                  <p className="font-semibold capitalize">{scannedData.type}</p>
                </div>
                <div>
                  <p className="text-xs text-green-800 dark:text-green-400 font-semibold uppercase">Name</p>
                  <p className="font-semibold">{scannedData.name}</p>
                </div>
                <div>
                  <p className="text-xs text-green-800 dark:text-green-400 font-semibold uppercase">ID</p>
                  <p className="font-mono text-sm">{scannedData.id}</p>
                </div>
                {scannedData.location && (
                  <div>
                    <p className="text-xs text-green-800 dark:text-green-400 font-semibold uppercase">Location</p>
                    <p>{scannedData.location}</p>
                  </div>
                )}

                {itemDetails && (
                  <Link href={scannedData.type === 'patient' ? `/dashboard/nurse/patients/${scannedData.id}` : '#'}>
                    <Button className="w-full mt-2">View Details</Button>
                  </Link>
                )}

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
                    >
                      <p className="font-semibold">{item.name}</p>
                      <p className="text-xs text-muted-foreground capitalize">
                        {item.type} • {new Date(item.timestamp).toLocaleTimeString()}
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

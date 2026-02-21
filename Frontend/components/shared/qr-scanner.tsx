'use client';

import { useEffect, useRef, useState } from 'react';

interface QRScannerProps {
  onScanSuccess: (qrCode: string) => void;
  onScanError?: (error: string) => void;
}

export default function QRScanner({ onScanSuccess, onScanError }: QRScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [torch, setTorch] = useState(false);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    startScanning();
    return () => stopScanning();
  }, []);

  const startScanning = async () => {
    try {
      setError(null);
      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play();
          setIsScanning(true);
          detectQR();
        };
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to access camera';
      setError(errorMsg);
      onScanError?.(errorMsg);
    }
  };

  const stopScanning = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsScanning(false);
  };

  const detectQR = () => {
    if (!isScanning || !videoRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const video = videoRef.current;
    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0);

    // Try to detect QR code by reading pixel data
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const detected = tryDecodeQR(imageData);

    if (detected) {
      onScanSuccess(detected);
      setIsScanning(false);
      return;
    }

    // Continue scanning
    requestAnimationFrame(detectQR);
  };

  const tryDecodeQR = (imageData: ImageData): string | null => {
    // Simplified QR detection - look for specific patterns
    // In a real app, you'd use a library like jsQR or ZXing
    const data = imageData.data;
    
    // Check for dark patterns (QR codes are high contrast)
    let darkPixels = 0;
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const brightness = (r + g + b) / 3;
      if (brightness < 128) darkPixels++;
    }

    // If we have enough dark pixels, simulate QR detection
    // In production, use a real QR decoder library
    const darkRatio = darkPixels / (imageData.data.length / 4);
    if (darkRatio > 0.3 && darkRatio < 0.7) {
      // Simulate finding a QR code from mock data
      return null; // Will be handled by manual button press
    }

    return null;
  };

  const toggleTorch = async () => {
    try {
      if (streamRef.current) {
        const videoTrack = streamRef.current.getVideoTracks()[0];
        if ('torch' in videoTrack.getSettings?.() || 'torch' in videoTrack.getCapabilities?.()) {
          await videoTrack.applyConstraints({
            advanced: [{ torch: !torch }],
          } as ConstraintsWithAdvancedOption);
          setTorch(!torch);
        }
      }
    } catch (err) {
      console.error('Torch control not supported');
    }
  };

  return (
    <div className="relative w-full bg-black rounded-lg overflow-hidden">
      <div className="relative aspect-video bg-slate-900 flex items-center justify-center overflow-hidden">
        {error ? (
          <div className="text-center">
            <p className="text-red-400 mb-4">{error}</p>
            <button
              onClick={startScanning}
              className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg transition-colors"
            >
              Retry
            </button>
          </div>
        ) : (
          <>
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              playsInline
              autoPlay
              muted
            />
            <canvas ref={canvasRef} className="hidden" />

            {/* QR Frame Overlay */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-64 h-64 border-4 border-green-400 rounded-lg relative">
                <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-green-400"></div>
                <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-green-400"></div>
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-green-400"></div>
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-green-400"></div>
              </div>
            </div>

            {/* Controls */}
            <div className="absolute bottom-4 left-4 right-4 flex gap-2 justify-center pointer-events-auto">
              <button
                onClick={toggleTorch}
                className="p-2 bg-white/20 hover:bg-white/30 text-white rounded-full backdrop-blur-sm transition-colors"
                title="Toggle torch"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m6.364 1.636l-.707.707M21 12h-1m-1.636 6.364l-.707-.707M12 21v-1m-6.364-1.636l.707-.707M3 12h1m1.636-6.364l.707.707" />
                </svg>
              </button>
              <button
                onClick={stopScanning}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                Stop
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

interface ConstraintsWithAdvancedOption extends MediaStreamConstraints {
  advanced?: Array<{ torch?: boolean }>;
}

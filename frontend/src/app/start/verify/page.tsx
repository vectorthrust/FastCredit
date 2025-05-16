'use client';

import React, { useRef, useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { useRouter } from 'next/navigation';

// Hardcoded Gemini API key for testing (do NOT use in production)
const GEMINI_API_KEY = 'AIzaSyBLrEIqqZ-rhZwwj-M7kryIpTDzJ9_DcC4';

// Hardcoded current stake and rank for demo
const CURRENT_STAKE = 0.1; // FTN
const RANKS = [
  { name: 'BRONZE', threshold: 10 },
  { name: 'SILVER', threshold: 50 },
  { name: 'GOLD', threshold: 100 },
  { name: 'PLATINUM', threshold: 250 },
  { name: 'DIAMOND', threshold: 500 },
];

function getRank(stake: number) {
  let rank = 'NONE';
  for (const r of RANKS) {
    if (stake >= r.threshold) rank = r.name;
  }
  return rank;
}

function getPotentialRank(verifiedIncome: number) {
  const maxStake = Math.min(verifiedIncome * 3, 1000);
  let potentialRank = 'NONE';
  for (const r of RANKS) {
    if (maxStake >= r.threshold) potentialRank = r.name;
  }
  return { potentialRank, maxStake };
}

async function verifyWithGemini(base64: string) {
  if (!GEMINI_API_KEY) throw new Error('Gemini API key not set');
  const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const prompt = `Analyze this financial document and extract the following information in JSON format:
  {
    "income": number,
    "period": string,
    "employer": string (if available),
    "documentType": string,
    "confidence": number (0-1)
  }
  Focus on:
  1. Monthly/Annual income
  2. Payment period
  3. Employer name
  4. Document type (payslip, bank statement, etc.)
  Return ONLY the JSON object, no additional text or markdown formatting.`;

  const result = await model.generateContent([
    {
      inlineData: {
        data: base64,
        mimeType: 'image/jpeg',
      },
    },
    { text: prompt },
  ]);

  const response = await result.response;
  let text = response.text();
  // Remove markdown if present
  text = text.replace(/```json\n?|\n?```/g, '').trim();
  console.log('Gemini raw response:', text);
  const parsed = JSON.parse(text);
  return parsed;
}

export default function VerifyCard() {
  const router = useRouter();
  const [image, setImage] = useState<string | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Start camera
  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
      setStream(mediaStream);
      setShowCamera(true);
    } catch (err) {
      setError('Failed to access camera');
    }
  };

  // Stop camera
  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setShowCamera(false);
  };

  // Attach stream to video element
  useEffect(() => {
    if (showCamera && videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [showCamera, stream]);

  // Capture image from camera
  const captureImage = async () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(videoRef.current, 0, 0);
    const dataUrl = canvas.toDataURL('image/jpeg');
    setImage(dataUrl);
    stopCamera();
    await processImage(dataUrl);
  };

  // Handle file upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (ev) => {
      const base64 = ev.target?.result as string;
      setImage(base64);
      await processImage(base64);
    };
    reader.readAsDataURL(file);
  };

  // Process image with Gemini
  const processImage = async (base64: string) => {
    setIsProcessing(true);
    setResult(null);
    setError(null);
    try {
      // Remove the data URL prefix if present
      const cleanBase64 = base64.split(',')[1] || base64;
      const res = await verifyWithGemini(cleanBase64);
      setResult(res);
    } catch (err: any) {
      setError(err.message || 'Failed to verify document');
    } finally {
      setIsProcessing(false);
    }
  };

  // Calculate current and potential rank
  const currentRank = getRank(CURRENT_STAKE);
  let potentialRank = currentRank;
  let maxStake = CURRENT_STAKE;
  if (result && typeof result.income === 'number') {
    const calc = getPotentialRank(result.income);
    potentialRank = calc.potentialRank;
    maxStake = calc.maxStake;
  }
  const canUpgrade = RANKS.findIndex(r => r.name === potentialRank) > RANKS.findIndex(r => r.name === currentRank);
  const requiredStake = RANKS.find(r => r.name === potentialRank)?.threshold || 0;
  const stakeDiff = requiredStake - CURRENT_STAKE;

  // After successful verification, auto-redirect to stake2 page
  useEffect(() => {
    if (result && !isProcessing && !error) {
      const timeout = setTimeout(() => router.push('/start/stake2'), 7000);
      return () => clearTimeout(timeout);
    }
  }, [result, isProcessing, error, router]);

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-white">
      <div className="flex flex-col items-center">
      <h1 className="text-5xl font-bold tracking-tight mb-6 text-center">
          <b>Fast</b>Credit
          <img
            src="https://s1.coincarp.com/logo/2/fastex.png?style=200&v=1696814957"
            alt="icon"
            className="inline-block w-6 h-6 align-super ml-1 mb-1"
          />
        </h1>
        <Card className="w-[400px] max-w-full overflow-hidden gap-2 relative">
          <CardHeader className="z-10">
            <CardTitle className="text-2xl">Verify Income</CardTitle>
            <CardDescription>
              Stake to get started and earn your first rank.<br />
              Upload paystubs, receipts, or invoices to prove your income and unlock higher ranks.<br />
              The more income you verify, the higher you can climb!
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 items-center">
            {/* Upload and Camera Controls */}
            <div className="flex flex-col w-full gap-3 items-center">
              {/* File Upload Button Only */}
              <label className="w-full flex flex-col items-center cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                  disabled={isProcessing}
                />
                <span className="px-4 py-2 rounded bg-neutral-900 text-white font-medium text-sm w-full text-center hover:bg-neutral-800 transition-colors">
                  {isProcessing ? 'Processing...' : 'Choose File'}
                </span>
              </label>
              <button
                onClick={showCamera ? stopCamera : startCamera}
                className={`px-4 py-2 rounded font-medium w-full text-sm transition-colors ${showCamera ? 'bg-pink-600 text-white' : 'bg-pink-500 text-white'} hover:bg-pink-400`}
                disabled={isProcessing}
              >
                {showCamera ? 'Stop Camera' : 'Start Camera'}
              </button>
            </div>
            {/* Camera Feed */}
            {showCamera && (
              <div className="flex flex-col items-center gap-2 w-full">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  style={{ width: 320, height: 240, background: '#222' }}
                />
                <button
                  onClick={captureImage}
                  className="px-4 py-2 rounded bg-neutral-900 text-white font-medium w-full text-sm hover:bg-neutral-800"
                  disabled={isProcessing}
                >
                  Capture
                </button>
              </div>
            )}
            {/* Loader */}
            {isProcessing && (
              <div className="text-center text-neutral-700 py-2">Processing document...</div>
            )}
            {/* Error */}
            {error && (
              <div className="text-red-500 text-center">{error}</div>
            )}
            {/* Image Preview */}
            {image && !isProcessing && (
              <img
                src={image}
                alt="Uploaded or captured document"
                className="rounded border max-w-full max-h-60"
              />
            )}
            {/* Verification Result */}
            {result && !isProcessing && (
              <div className="w-full mt-2 text-sm text-neutral-900">
                <div className="font-semibold mb-1">Document Verified</div>
                <div>Current Rank: <b>{currentRank}</b></div>
                <div>AI-Verified Income: <b>${result.income ?? ''}</b></div>
                <div>Confidence: <b>{Math.round(result.confidence * 100)}%</b></div>
                <div>Document Type: <b>{result.documentType}</b></div>
                <div>Period: <b>{result.period || result.extractedData?.period}</b></div>
                {result.employer || result.extractedData?.employer ? (
                  <div>Employer: <b>{result.employer || result.extractedData?.employer}</b></div>
                ) : null}
                <div className="mt-2">
                  <span className="text-green-600 font-medium">For demo: Stake 0.4 FTN on the next page to get DIAMOND rank!</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 
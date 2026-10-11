'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Camera,
  Upload,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Bookmark,
  Shield,
  Palette,
  Watch,
  Footprints,
} from 'lucide-react';
import { VestraButton } from '@/components/ui/vestra-button';
import { VestraCard } from '@/components/ui/vestra-card';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { BadgeStatus } from '@/components/ui/badge-status';

type ScanState =
  | 'idle'
  | 'camera_requesting'
  | 'camera_denied'
  | 'camera_unavailable'
  | 'camera_active'
  | 'preview'
  | 'analyzing'
  | 'success'
  | 'error';

interface AnalysisData {
  id: string;
  overallScore: number;
  confidence: number;
  colourHarmonyScore: number;
  fitProportionScore: number;
  coordinationScore: number;
  occasionScore: number;
  accessoriesScore: number;
  styleCoherenceScore: number;
  styleLabel: string;
  whatWorks: string[];
  areasToImprove: string[];
  recommendedColours: string[];
  recommendedFootwear: string[];
  recommendedAccessories: string[];
  styleTags: string[];
  occasionObservations: string;
  providerUsed: string;
  createdAt: string;
}

interface ScanResponse {
  success: boolean;
  requestId: string;
  analysis: AnalysisData;
  isProductionAnalysis: boolean;
}

const ROTATING_MESSAGES = [
  'Scanning outfit silhouettes & contours...',
  'Evaluating colour harmony & tonal contrasts...',
  'Composing bespoke editorial assessment...',
];

export default function OutfitScannerPage() {
  const [state, setState] = React.useState<ScanState>('idle');
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [capturedBlob, setCapturedBlob] = React.useState<Blob | null>(null);
  const [uploadedFile, setUploadedFile] = React.useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = React.useState<ScanResponse | null>(null);
  const [messageIndex, setMessageIndex] = React.useState<number>(0);

  const videoRef = React.useRef<HTMLVideoElement>(null);
  const streamRef = React.useRef<MediaStream | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Rotate loading message during analyzing
  React.useEffect(() => {
    if (state !== 'analyzing') return;
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % ROTATING_MESSAGES.length);
    }, 2800);
    return () => clearInterval(interval);
  }, [state]);

  const stopCamera = React.useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  }, []);

  React.useEffect(() => {
    return () => {
      stopCamera();
      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [stopCamera, previewUrl]);

  const startCamera = async () => {
    setState('camera_requesting');
    setErrorMessage(null);

    if (!navigator.mediaDevices?.getUserMedia) {
      setState('camera_unavailable');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
      });
      streamRef.current = stream;
      setState('camera_active');
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(() => {});
        }
      }, 100);
    } catch (err) {
      const error = err as Error;
      if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
        setErrorMessage(
          'Camera permission denied. Please enable camera access in your browser settings, or upload a photo instead.'
        );
      } else if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
        setErrorMessage('No camera detected on this device. Please upload a photo instead.');
      } else if (error.name === 'NotReadableError') {
        setErrorMessage('Camera is in use by another application. Please close other apps and try again.');
      } else {
        setErrorMessage('Unable to access camera. Please upload a photo instead.');
      }
      setState('camera_denied');
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

    canvas.toBlob((blob) => {
      if (blob) {
        setCapturedBlob(blob);
        setUploadedFile(null);
        const url = URL.createObjectURL(blob);
        setPreviewUrl(url);
        setState('preview');
        stopCamera();
      }
    }, 'image/jpeg', 0.9);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadedFile(file);
    setCapturedBlob(null);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setState('preview');
    stopCamera();
  };

  const handleRetake = () => {
    if (previewUrl && previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    setCapturedBlob(null);
    setUploadedFile(null);
    setAnalysisResult(null);
    setErrorMessage(null);
    setState('idle');
  };

  const analyzeOutfit = async () => {
    setState('analyzing');
    setMessageIndex(0);
    setErrorMessage(null);

    const formData = new FormData();
    if (capturedBlob) {
      formData.append('photo', capturedBlob, 'outfit.jpg');
    } else if (uploadedFile) {
      formData.append('photo', uploadedFile, uploadedFile.name);
    } else {
      setErrorMessage('No image available for analysis. Please capture or upload a photo.');
      setState('error');
      return;
    }

    try {
      const res = await fetch('/api/analyze-outfit', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMessage(data.error ?? 'Analysis failed. Please try again.');
        setState('error');
        return;
      }

      setAnalysisResult(data);
      setState('success');
    } catch {
      setErrorMessage('Network connection error while contacting analysis engine. Please retry.');
      setState('error');
    }
  };

  const analysis = analysisResult?.analysis;

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 space-y-8">
      {/* Editorial Header */}
      <div className="border-b border-[#DED5C8]/10 pb-6">
        <span className="text-[10px] font-semibold tracking-[0.25em] text-[#A95239] uppercase block mb-1 font-mono">
          VAYN Vision Intelligence
        </span>
        <h1 className="font-serif text-3xl md:text-4xl font-normal text-[#F4EFE6] tracking-tight">
          VAYN Outfit Scanner
        </h1>
        <p className="text-xs md:text-sm text-[#6D6961] mt-1 max-w-2xl">
          Real-time aesthetic evaluation decomposing color harmony, fit geometry, occasion appropriateness, and tailoring precision.
        </p>
      </div>

      {/* IDLE STATE */}
      {state === 'idle' && (
        <div className="space-y-6">
          <div className="p-4 bg-[#24231F] border border-[#DED5C8]/15 rounded flex items-start gap-3">
            <Shield className="h-5 w-5 text-[#A95239] shrink-0 mt-0.5" />
            <p className="text-xs text-[#E9E1D6]/80 leading-relaxed">
              For optimal calibration, please frame your full body from head to footwear in good lighting against an uncluttered backdrop.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div
              onClick={startCamera}
              className="p-8 border-2 border-dashed border-[#DED5C8]/20 hover:border-[#A95239] bg-[#24231F] rounded cursor-pointer transition-all flex flex-col items-center justify-center text-center group"
            >
              <div className="h-14 w-14 rounded-full bg-[#1C1B18] border border-[#DED5C8]/15 group-hover:border-[#A95239] flex items-center justify-center mb-4 transition-colors">
                <Camera className="h-6 w-6 text-[#6D6961] group-hover:text-[#A95239] transition-colors" />
              </div>
              <h3 className="font-serif text-lg text-[#F4EFE6]">Use Live Camera</h3>
              <p className="text-xs text-[#6D6961] mt-1 max-w-xs">
                Scan your outfit directly with on-screen silhouette framing guides
              </p>
            </div>

            <div
              onClick={() => fileInputRef.current?.click()}
              className="p-8 border-2 border-dashed border-[#DED5C8]/20 hover:border-[#A95239] bg-[#24231F] rounded cursor-pointer transition-all flex flex-col items-center justify-center text-center group"
            >
              <div className="h-14 w-14 rounded-full bg-[#1C1B18] border border-[#DED5C8]/15 group-hover:border-[#A95239] flex items-center justify-center mb-4 transition-colors">
                <Upload className="h-6 w-6 text-[#6D6961] group-hover:text-[#A95239] transition-colors" />
              </div>
              <h3 className="font-serif text-lg text-[#F4EFE6]">Upload Photo</h3>
              <p className="text-xs text-[#6D6961] mt-1 max-w-xs">
                Select an existing photo (JPEG, PNG, WebP up to 10MB)
              </p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={handleFileUpload}
            />
          </div>
        </div>
      )}

      {/* CAMERA REQUESTING */}
      {state === 'camera_requesting' && (
        <VestraCard variant="bordered" padding="lg" className="text-center py-12 space-y-4">
          <LoadingSpinner size="lg" />
          <div>
            <h3 className="font-serif text-lg text-[#f5f0e8]">Requesting Optical Sensor...</h3>
            <p className="text-xs text-[#9ca3af] mt-1">Please approve camera access in your browser.</p>
          </div>
        </VestraCard>
      )}

      {/* CAMERA DENIED OR UNAVAILABLE */}
      {(state === 'camera_denied' || state === 'camera_unavailable') && (
        <VestraCard variant="bordered" padding="lg" className="space-y-4">
          <div className="flex items-start gap-3 text-amber-300">
            <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-semibold text-[#f5f0e8]">
                {state === 'camera_unavailable' ? 'Camera Not Available' : 'Camera Permission Required'}
              </h3>
              <p className="text-xs text-[#9ca3af] mt-1">
                {errorMessage || 'Camera access could not be established on this device.'}
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-[#9ca3af]/15 flex items-center justify-between">
            <VestraButton variant="secondary" size="sm" onClick={handleRetake}>
              Back
            </VestraButton>
            <VestraButton
              variant="primary"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              leftIcon={<Upload className="h-4 w-4" />}
            >
              Upload Photo Instead
            </VestraButton>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={handleFileUpload}
            />
          </div>
        </VestraCard>
      )}

      {/* CAMERA ACTIVE */}
      {state === 'camera_active' && (
        <div className="relative bg-black rounded-sm overflow-hidden border border-[#e8c547]/50 max-w-xl mx-auto flex flex-col items-center">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full max-h-[480px] object-cover"
          />

          {/* Framing Guide Overlay SVG */}
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            <svg
              viewBox="0 0 100 200"
              className="h-[88%] stroke-[#e8c547]/50 fill-none stroke-[1.5] stroke-dasharray-[4_4]"
            >
              {/* Head */}
              <circle cx="50" cy="28" r="13" />
              {/* Shoulders & Torso */}
              <path d="M 33 46 C 28 72 28 115 30 185 M 67 46 C 72 72 72 115 70 185 M 40 185 L 40 120 L 60 120 L 60 185" />
              {/* Arms */}
              <path d="M 33 50 L 18 115 M 67 50 L 82 115" />
            </svg>
            <span className="absolute bottom-16 text-[10px] font-mono tracking-widest text-[#e8c547] bg-black/70 px-3 py-1 rounded-sm border border-[#e8c547]/30">
              FRAME FULL OUTFIT
            </span>
          </div>

          {/* Controls Bar */}
          <div className="w-full p-4 bg-gradient-to-t from-black via-black/80 to-transparent flex items-center justify-between z-10">
            <VestraButton variant="secondary" size="sm" onClick={handleRetake}>
              Cancel
            </VestraButton>
            <VestraButton
              variant="primary"
              size="md"
              onClick={capturePhoto}
              leftIcon={<Camera className="h-4 w-4" />}
            >
              Capture Frame
            </VestraButton>
          </div>
        </div>
      )}

      {/* PREVIEW STATE */}
      {state === 'preview' && previewUrl && (
        <div className="space-y-6 max-w-xl mx-auto">
          <div className="relative rounded-sm overflow-hidden border border-[#9ca3af]/25 bg-black flex justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={previewUrl}
              alt="Outfit Preview"
              className="max-h-[450px] object-contain rounded-sm"
            />
          </div>

          <div className="flex items-center justify-between">
            <VestraButton variant="secondary" size="sm" onClick={handleRetake} leftIcon={<RefreshCw className="h-3.5 w-3.5" />}>
              Retake / Replace
            </VestraButton>
            <VestraButton
              variant="primary"
              size="md"
              onClick={analyzeOutfit}
              rightIcon={<ArrowRight className="h-4 w-4" />}
            >
              Analyze Outfit
            </VestraButton>
          </div>
        </div>
      )}

      {/* ANALYZING STATE */}
      {state === 'analyzing' && (
        <VestraCard variant="bordered" padding="lg" className="text-center py-16 space-y-6 max-w-lg mx-auto">
          <div className="flex justify-center">
            <LoadingSpinner size="lg" />
          </div>
          <div className="space-y-2">
            <span className="text-[10px] font-semibold tracking-[0.25em] text-[#e8c547] uppercase block">
              Processing Synthesis
            </span>
            <AnimatePresence mode="wait">
              <motion.h3
                key={messageIndex}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
                className="font-serif text-xl text-[#f5f0e8]"
              >
                {ROTATING_MESSAGES[messageIndex]}
              </motion.h3>
            </AnimatePresence>
            <p className="text-xs text-[#9ca3af]">
              Cross-referencing proportion metrics with sartorial harmonies...
            </p>
          </div>
        </VestraCard>
      )}

      {/* ERROR STATE */}
      {state === 'error' && (
        <VestraCard variant="bordered" padding="lg" className="space-y-4 max-w-lg mx-auto">
          <div className="flex items-start gap-3 text-red-400">
            <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-semibold text-[#f5f0e8]">Analysis Failed</h3>
              <p className="text-xs text-[#9ca3af] mt-1">
                {errorMessage || 'Unable to complete outfit scan. Please ensure good lighting and try again.'}
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-[#9ca3af]/15 flex items-center justify-between">
            <VestraButton variant="secondary" size="sm" onClick={handleRetake}>
              Start Over
            </VestraButton>
            <VestraButton variant="primary" size="sm" onClick={analyzeOutfit}>
              Retry Analysis
            </VestraButton>
          </div>
        </VestraCard>
      )}

      {/* SUCCESS STATE — FULL RESULTS DISPLAY */}
      {state === 'success' && analysis && (
        <div className="space-y-8">
          {/* Provider Warning Banner if Mock */}
          {!analysisResult?.isProductionAnalysis && (
            <div className="p-3.5 bg-amber-950/40 border border-amber-600/40 text-amber-200 text-xs rounded-sm flex items-center gap-2.5">
              <Sparkles className="h-4 w-4 shrink-0 text-amber-400" />
              <span>
                Development Mode: Using mock AI analysis. Configure OPENAI_API_KEY or GEMINI_API_KEY for production results.
              </span>
            </div>
          )}

          {/* Large Editorial Header with styleLabel */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#DED5C8]/10 pb-6">
            <div>
              <span className="text-[10px] font-semibold tracking-[0.25em] text-[#A95239] uppercase block mb-1 font-mono">
                Aesthetic Label
              </span>
              <h2 className="font-serif text-3xl md:text-4xl font-normal text-[#F4EFE6] tracking-tight">
                {analysis.styleLabel}
              </h2>
              <div className="flex flex-wrap gap-2 mt-3">
                {analysis.styleTags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] font-mono px-2 py-0.5 bg-[#24231F] border border-[#DED5C8]/15 text-[#E9E1D6] rounded"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <VestraButton variant="secondary" size="sm" onClick={handleRetake} leftIcon={<RefreshCw className="h-3.5 w-3.5" />}>
                Scan Another Outfit
              </VestraButton>
              <div className="relative inline-flex items-center">
                <VestraButton variant="primary" size="sm" disabled leftIcon={<Bookmark className="h-3.5 w-3.5" />}>
                  Save to Lookbook
                </VestraButton>
                <BadgeStatus status="coming-soon" className="absolute -top-2.5 -right-2 text-[8px] py-0 px-1">
                  TODO
                </BadgeStatus>
              </div>
            </div>
          </div>

          {/* Top Score Matrix: Overall Circular Progress + Breakdown Bars */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Circular Progress Ring */}
            <VestraCard variant="bordered" padding="lg" className="flex flex-col items-center justify-center text-center border-[#DED5C8]/15 bg-[#24231F]">
              <span className="text-[10px] font-mono uppercase text-[#A95239] mb-4 tracking-wider font-semibold">
                Overall Sartorial Score
              </span>
              <div className="relative w-36 h-36 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="#1C1B18"
                    strokeWidth="8"
                    fill="transparent"
                  />
                  <motion.circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="#A95239"
                    strokeWidth="8"
                    strokeDasharray={251.2}
                    initial={{ strokeDashoffset: 251.2 }}
                    animate={{
                      strokeDashoffset: 251.2 - (251.2 * analysis.overallScore) / 100,
                    }}
                    transition={{ duration: 1.2, ease: 'easeOut' }}
                    strokeLinecap="round"
                    fill="transparent"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="font-serif text-3xl text-[#F4EFE6] font-normal">
                    {analysis.overallScore}
                  </span>
                  <span className="text-[10px] text-[#6D6961] font-mono">/ 100</span>
                </div>
              </div>
              <span className="text-[11px] text-[#6D6961] mt-4 font-mono">
                Confidence: {Math.round(analysis.confidence * 100)}%
              </span>
            </VestraCard>

            {/* 6 Dimension Horizontal Bars */}
            <VestraCard variant="bordered" padding="md" className="md:col-span-2 space-y-3.5 justify-center flex flex-col border-[#DED5C8]/15 bg-[#24231F]">
              <span className="text-[10px] font-mono uppercase text-[#A95239] tracking-wider block font-semibold">
                Evaluative Dimension Breakdown
              </span>

              {[
                { label: 'Colour Harmony', weight: '20%', score: analysis.colourHarmonyScore },
                { label: 'Fit & Proportions', weight: '25%', score: analysis.fitProportionScore },
                { label: 'Coordination', weight: '20%', score: analysis.coordinationScore },
                { label: 'Occasion Alignment', weight: '15%', score: analysis.occasionScore },
                { label: 'Accessories & Details', weight: '10%', score: analysis.accessoriesScore },
                { label: 'Style Coherence', weight: '10%', score: analysis.styleCoherenceScore },
              ].map((dim) => (
                <div key={dim.label} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#F4EFE6] font-medium">
                      {dim.label}{' '}
                      <span className="text-[10px] text-[#6D6961] font-mono">({dim.weight})</span>
                    </span>
                    <span className="text-[#A95239] font-mono font-semibold">{dim.score}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-[#1C1B18] rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-[#A95239]"
                      initial={{ width: 0 }}
                      animate={{ width: `${dim.score}%` }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                    />
                  </div>
                </div>
              ))}
            </VestraCard>
          </div>

          {/* Observations Paragraph */}
          <VestraCard variant="bordered" padding="md" className="border-[#DED5C8]/15 bg-[#24231F]">
            <span className="text-[10px] font-semibold tracking-[0.25em] text-[#A95239] uppercase block mb-1 font-mono">
              Occasion & Silhouette Assessment
            </span>
            <p className="text-xs md:text-sm text-[#F4EFE6] leading-relaxed">
              {analysis.occasionObservations}
            </p>
          </VestraCard>

          {/* What Works vs Areas To Improve */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <VestraCard variant="bordered" padding="md">
              <span className="text-[10px] font-mono uppercase text-emerald-400 block mb-3">
                ✓ What Works
              </span>
              <ul className="space-y-2">
                {analysis.whatWorks.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs text-[#d4cfc7]">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </VestraCard>

            <VestraCard variant="bordered" padding="md">
              <span className="text-[10px] font-mono uppercase text-amber-400 block mb-3">
                ↗ Areas to Refine
              </span>
              <ul className="space-y-2">
                {analysis.areasToImprove.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs text-[#d4cfc7]">
                    <span className="text-amber-400 font-bold text-xs shrink-0">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </VestraCard>
          </div>

          {/* Recommendations Grid: Colours | Footwear | Accessories */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <VestraCard variant="bordered" padding="md" className="border-[#DED5C8]/15 bg-[#24231F]">
              <div className="flex items-center gap-2 mb-3">
                <Palette className="h-4 w-4 text-[#A95239]" />
                <span className="text-[11px] font-semibold text-[#F4EFE6] uppercase tracking-wider font-mono">
                  Harmonizing Hues
                </span>
              </div>
              <ul className="space-y-1.5">
                {analysis.recommendedColours.map((col, idx) => (
                  <li key={idx} className="text-xs text-[#E9E1D6]/80 flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#A95239]" />
                    <span>{col}</span>
                  </li>
                ))}
              </ul>
            </VestraCard>

            <VestraCard variant="bordered" padding="md" className="border-[#DED5C8]/15 bg-[#24231F]">
              <div className="flex items-center gap-2 mb-3">
                <Footprints className="h-4 w-4 text-[#A95239]" />
                <span className="text-[11px] font-semibold text-[#F4EFE6] uppercase tracking-wider font-mono">
                  Recommended Footwear
                </span>
              </div>
              <ul className="space-y-1.5">
                {analysis.recommendedFootwear.map((foot, idx) => (
                  <li key={idx} className="text-xs text-[#E9E1D6]/80 flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#A95239]" />
                    <span>{foot}</span>
                  </li>
                ))}
              </ul>
            </VestraCard>

            <VestraCard variant="bordered" padding="md" className="border-[#DED5C8]/15 bg-[#24231F]">
              <div className="flex items-center gap-2 mb-3">
                <Watch className="h-4 w-4 text-[#A95239]" />
                <span className="text-[11px] font-semibold text-[#F4EFE6] uppercase tracking-wider font-mono">
                  Accents & Accessories
                </span>
              </div>
              <ul className="space-y-1.5">
                {analysis.recommendedAccessories.map((acc, idx) => (
                  <li key={idx} className="text-xs text-[#E9E1D6]/80 flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#A95239]" />
                    <span>{acc}</span>
                  </li>
                ))}
              </ul>
            </VestraCard>
          </div>
        </div>
      )}
    </div>
  );
}

'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Camera,
  ArrowRight,
  ArrowLeft,
  Upload,
  AlertCircle,
  Info,
  Check,
  Shield,
  Trash2,
} from 'lucide-react';
import { VestraButton } from '@/components/ui/vestra-button';
import { VestraCard } from '@/components/ui/vestra-card';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import type { StyleProfileUpdateInput } from '@/lib/validations/profile.schema';

interface ArchetypeOption {
  key: string;
  label: string;
  description: string;
  keywords: string[];
}

const ARCHETYPES: ArchetypeOption[] = [
  {
    key: 'QUIET_LUXURY',
    label: 'Quiet Luxury',
    description: 'Understated opulence, neutral tones',
    keywords: ['Cashmere', 'Neutral Tones', 'Unbranded Elegance'],
  },
  {
    key: 'AVANT_GARDE',
    label: 'Avant-Garde',
    description: 'Boundary-pushing silhouettes',
    keywords: ['Asymmetric', 'Architectural', 'Subversive'],
  },
  {
    key: 'MINIMAL_TAILORED',
    label: 'Minimal Tailored',
    description: 'Clean lines, precision fit',
    keywords: ['Sharp Creases', 'Monochrome', 'Structured'],
  },
  {
    key: 'OLD_MONEY',
    label: 'Old Money',
    description: 'Timeless heritage dressing',
    keywords: ['Tweed', 'Heritage Loafers', 'Classic Crests'],
  },
  {
    key: 'STREETWEAR_EDGE',
    label: 'Streetwear Edge',
    description: 'Urban energy, bold graphics',
    keywords: ['Oversized Silhouettes', 'Sneaker Culture', 'Technical'],
  },
  {
    key: 'ROMANTIC_FEMININE',
    label: 'Romantic Feminine',
    description: 'Soft textures, flowing silhouettes',
    keywords: ['Silk Chiffon', 'Lace Accents', 'Soft Drapes'],
  },
  {
    key: 'CLASSIC_PREPPY',
    label: 'Classic Preppy',
    description: 'Collegiate, structured casuals',
    keywords: ['Cable Knit', 'Oxford Cotton', 'Tailored Chinos'],
  },
  {
    key: 'BOHEMIAN',
    label: 'Bohemian',
    description: 'Layered, free-spirited, natural',
    keywords: ['Raw Linens', 'Earthy Tones', 'Artisanal Fringe'],
  },
  {
    key: 'POWER_DRESSING',
    label: 'Power Dressing',
    description: 'Sharp suiting, executive confidence',
    keywords: ['Strong Shoulders', 'Pinstripes', 'Commanding Cut'],
  },
  {
    key: 'ECLECTIC_ARTISAN',
    label: 'Eclectic Artisan',
    description: 'Mixed patterns, artisanal craft',
    keywords: ['Handloom Textures', 'Contrasting Prints', 'Curated Craft'],
  },
];

interface ColorOption {
  name: string;
  hex: string;
  border?: string;
}

const PALETTE_COLORS: ColorOption[] = [
  { name: 'Onyx Black', hex: '#111111' },
  { name: 'Warm Ivory', hex: '#f5f0e8' },
  { name: 'Charcoal Slate', hex: '#2c302e' },
  { name: 'Ecru Cream', hex: '#e8dcce' },
  { name: 'Camel Tan', hex: '#c19a6b' },
  { name: 'Deep Espresso', hex: '#362217' },
  { name: 'Midnight Navy', hex: '#1b263b' },
  { name: 'Forest Green', hex: '#1e3f20' },
  { name: 'Burgundy Wine', hex: '#581825' },
  { name: 'Burnished Gold', hex: '#d4af37' },
  { name: 'Terracotta', hex: '#c46243' },
  { name: 'Dove Grey', hex: '#9ca3af' },
  { name: 'Cobalt Azure', hex: '#0047ab' },
  { name: 'Sage Olive', hex: '#8a9a86' },
  { name: 'Dusty Rose', hex: '#c08081' },
  { name: 'Cognac Rust', hex: '#9a4726' },
];

interface BodyTypeOption {
  key: string;
  label: string;
  description: string;
}

const BODY_TYPES: BodyTypeOption[] = [
  { key: 'PETITE', label: 'Petite', description: 'Shorter stature, proportional styling' },
  { key: 'STRAIGHT', label: 'Straight', description: 'Similar shoulder and hip width' },
  { key: 'ATHLETIC', label: 'Athletic', description: 'Defined shoulders, lean silhouette' },
  { key: 'PEAR', label: 'Pear', description: 'Wider hips than shoulders' },
  { key: 'APPLE', label: 'Apple', description: 'Fuller through the midsection' },
  { key: 'HOURGLASS', label: 'Hourglass', description: 'Defined waist, balanced shoulders and hips' },
  { key: 'RECTANGULAR', label: 'Rectangular', description: 'Minimal waist definition' },
  { key: 'PREFER_NOT_TO_SAY', label: 'Prefer not to say', description: 'Skip this step' },
];

export default function OnboardingPage() {
  const router = useRouter();

  // Wizard state machine
  const [step, setStep] = React.useState<number>(1);
  const [direction, setDirection] = React.useState<number>(1);
  const [isSaving, setIsSaving] = React.useState<boolean>(false);
  const [saveError, setSaveError] = React.useState<string | null>(null);

  // Profile Form States
  const [selectedArchetypes, setSelectedArchetypes] = React.useState<string[]>([]);
  const [preferredColours, setPreferredColours] = React.useState<string[]>([]);
  const [avoidedColours, setAvoidedColours] = React.useState<string[]>([]);
  const [skinToneCategory, setSkinToneCategory] = React.useState<string>('unset');
  const [bodyProportionType, setBodyProportionType] = React.useState<string>('PREFER_NOT_TO_SAY');

  // Photo state
  const [photoUrl, setPhotoUrl] = React.useState<string | null>(null);
  const [photoUploading, setPhotoUploading] = React.useState<boolean>(false);
  const [photoError, setPhotoError] = React.useState<string | null>(null);
  const [cameraActive, setCameraActive] = React.useState<boolean>(false);
  const [cameraError, setCameraError] = React.useState<string | null>(null);
  const [capturedPreview, setCapturedPreview] = React.useState<string | null>(null);
  const [capturedBlob, setCapturedBlob] = React.useState<Blob | null>(null);

  const videoRef = React.useRef<HTMLVideoElement>(null);
  const streamRef = React.useRef<MediaStream | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Fetch initial profile if already started
  React.useEffect(() => {
    async function loadExisting() {
      try {
        const res = await fetch('/api/profile');
        if (!res.ok) return;
        const data = await res.json();
        if (data.profile) {
          const p = data.profile;
          const archs: string[] = [];
          if (p.primaryArchetype) archs.push(p.primaryArchetype);
          if (p.secondaryArchetype) archs.push(p.secondaryArchetype);
          setSelectedArchetypes(archs);
          if (p.preferredColours?.length) setPreferredColours(p.preferredColours);
          if (p.avoidedColours?.length) setAvoidedColours(p.avoidedColours);
          if (p.skinToneCategory) setSkinToneCategory(p.skinToneCategory);
          if (p.bodyProportionType) setBodyProportionType(p.bodyProportionType);
          if (p.referencePhotoUrl) setPhotoUrl(p.referencePhotoUrl);
          if (p.onboardingStep && p.onboardingStep >= 1 && p.onboardingStep <= 6) {
            setStep(p.onboardingStep);
          }
        }
      } catch {
        // silent initial load
      }
    }
    loadExisting();
  }, []);

  // Cleanup camera stream
  const stopCamera = React.useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  }, []);

  React.useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  // Persist step changes
  const saveStepProgress = async (nextStep: number, completed: boolean = false) => {
    setIsSaving(true);
    setSaveError(null);
    try {
      const payload: StyleProfileUpdateInput = {
        onboardingStep: nextStep,
        onboardingCompleted: completed,
        primaryArchetype: (selectedArchetypes[0] as StyleProfileUpdateInput['primaryArchetype']) || null,
        secondaryArchetype: (selectedArchetypes[1] as StyleProfileUpdateInput['secondaryArchetype']) || null,
        preferredColours,
        avoidedColours,
        skinToneCategory: skinToneCategory as StyleProfileUpdateInput['skinToneCategory'],
        bodyProportionType: bodyProportionType as StyleProfileUpdateInput['bodyProportionType'],
        proportionSource: 'manual',
      };

      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to save progress');
      }
    } catch (err) {
      setSaveError((err as Error).message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleNext = async () => {
    stopCamera();
    const nextStep = Math.min(step + 1, 6);
    await saveStepProgress(nextStep, false);
    setDirection(1);
    setStep(nextStep);
  };

  const handleBack = () => {
    stopCamera();
    if (step > 1) {
      setDirection(-1);
      setStep((prev) => prev - 1);
    }
  };

  const handleFinish = async () => {
    stopCamera();
    await saveStepProgress(6, true);
    router.push('/dashboard');
  };

  // Step 2: Toggle Archetype
  const toggleArchetype = (arch: string) => {
    setSelectedArchetypes((prev) => {
      if (prev.includes(arch)) {
        return prev.filter((item) => item !== arch);
      }
      if (prev.length >= 2) {
        return [prev[1], arch];
      }
      return [...prev, arch];
    });
  };

  // Step 3: Color helpers
  const togglePreferredColor = (colorName: string) => {
    setPreferredColours((prev) =>
      prev.includes(colorName) ? prev.filter((c) => c !== colorName) : [...prev, colorName]
    );
    // remove from avoided if present
    setAvoidedColours((prev) => prev.filter((c) => c !== colorName));
  };

  const toggleAvoidedColor = (colorName: string) => {
    setAvoidedColours((prev) =>
      prev.includes(colorName) ? prev.filter((c) => c !== colorName) : [...prev, colorName]
    );
    // remove from preferred if present
    setPreferredColours((prev) => prev.filter((c) => c !== colorName));
  };

  // Step 5: Camera implementation
  const startCamera = async () => {
    setCameraError(null);
    setCapturedPreview(null);
    setCapturedBlob(null);

    if (!navigator.mediaDevices?.getUserMedia) {
      setCameraError('Camera is not supported or not available on this device. Please upload a photo instead.');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } },
      });
      streamRef.current = stream;
      setCameraActive(true);
      // Wait for ref update
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(() => {});
        }
      }, 100);
    } catch (err) {
      const error = err as Error;
      if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
        setCameraError('Camera permission was denied. Please allow camera permissions in your browser or upload a file.');
      } else if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
        setCameraError('No camera detected on this system. Please upload a file instead.');
      } else {
        setCameraError('Unable to access camera. Please upload a photo instead.');
      }
      setCameraActive(false);
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
        const url = URL.createObjectURL(blob);
        setCapturedPreview(url);
        stopCamera();
      }
    }, 'image/jpeg', 0.9);
  };

  const uploadBlob = async (blob: Blob, filename = 'photo.jpg') => {
    setPhotoUploading(true);
    setPhotoError(null);
    try {
      const formData = new FormData();
      formData.append('photo', blob, filename);
      const res = await fetch('/api/profile/photo', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Photo upload failed');
      }
      setPhotoUrl(data.photoUrl);
      setCapturedPreview(null);
      setCapturedBlob(null);
    } catch (err) {
      setPhotoError((err as Error).message);
    } finally {
      setPhotoUploading(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    uploadBlob(file, file.name);
  };

  const deletePhoto = async () => {
    try {
      setPhotoUploading(true);
      const res = await fetch('/api/profile/photo', { method: 'DELETE' });
      if (res.ok) {
        setPhotoUrl(null);
      }
    } finally {
      setPhotoUploading(false);
    }
  };

  const stepVariants = {
    enter: (dir: number) => ({ x: dir > 0 ? 30 : -30, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -30 : 30, opacity: 0 }),
  };

  return (
    <div className="max-w-3xl mx-auto py-6 md:py-10 px-4">
      {/* Step Indicator Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono tracking-widest text-[#A95239] uppercase font-semibold">
              VAYN Atelier Onboarding • Step 0{step} of 06
            </span>
            {isSaving && (
              <span className="text-[10px] text-[#6D6961] flex items-center gap-1 font-mono">
                <LoadingSpinner size="sm" /> Syncing...
              </span>
            )}
          </div>
          {step < 6 && (
            <button
              onClick={handleFinish}
              className="text-xs text-[#6D6961] hover:text-[#F4EFE6] tracking-wider uppercase transition-colors font-mono"
            >
              Skip to Atelier →
            </button>
          )}
        </div>

        {/* Numbered Dots / Progress */}
        <div className="flex items-center justify-between gap-2 border-b border-[#DED5C8]/10 pb-4">
          {[1, 2, 3, 4, 5, 6].map((num) => {
            const isCompleted = num < step;
            const isCurrent = num === step;
            return (
              <div key={num} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className={`h-2 w-full rounded-full transition-all duration-300 ${
                    isCurrent
                      ? 'bg-[#A95239]'
                      : isCompleted
                      ? 'bg-[#A95239]/60'
                      : 'bg-[#24231F]'
                  }`}
                />
                <span
                  className={`text-[9px] font-mono ${
                    isCurrent ? 'text-[#A95239] font-bold' : isCompleted ? 'text-[#E9E1D6]' : 'text-[#6D6961]/40'
                  }`}
                >
                  0{num}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {saveError && (
        <div className="mb-4 p-3 bg-red-950/40 border border-red-800 text-red-200 text-xs flex items-center gap-2 rounded">
          <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
          <span>{saveError}</span>
        </div>
      )}

      {/* Main Step Transition Card */}
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={step}
          custom={direction}
          variants={stepVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        >
          <VestraCard variant="bordered" padding="lg" className="relative overflow-hidden bg-[#24231F] border-[#DED5C8]/15">
            {/* STEP 1: WELCOME */}
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <span className="text-[10px] font-semibold tracking-[0.25em] text-[#A95239] uppercase block mb-1 font-mono">
                    Phase I • Welcome
                  </span>
                  <h1 className="font-serif text-3xl md:text-4xl font-normal text-[#F4EFE6] tracking-tight leading-tight">
                    Calibrate Your Signature Style
                  </h1>
                  <p className="mt-3 text-sm text-[#E9E1D6]/80 leading-relaxed">
                    VAYN synthesizes tailoring principles, color theory, and proportion architecture to refine your personal wardrobe. In the next few moments, configure your aesthetic compass.
                  </p>
                </div>

                <div className="p-4 bg-[#1C1B18] border border-[#DED5C8]/15 rounded flex items-start gap-3">
                  <Shield className="h-5 w-5 text-[#A95239] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-semibold text-[#F4EFE6] uppercase tracking-wider font-mono">
                      Privacy & Data Integrity
                    </h4>
                    <p className="text-xs text-[#6D6961] mt-1 leading-relaxed">
                      All styling data is used only to personalise your experience. No data is sold or shared.
                    </p>
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <VestraButton
                    variant="primary"
                    size="md"
                    onClick={handleNext}
                    rightIcon={<ArrowRight className="h-4 w-4" />}
                  >
                    Begin Calibration
                  </VestraButton>
                </div>
              </div>
            )}

            {/* STEP 2: STYLE ARCHETYPES */}
            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <span className="text-[10px] font-semibold tracking-[0.25em] text-[#e8c547] uppercase block mb-1">
                    Step 02 • Aesthetics
                  </span>
                  <h2 className="font-serif text-2xl md:text-3xl font-normal text-[#f5f0e8] tracking-tight">
                    Select Your Style Archetypes
                  </h2>
                  <p className="mt-1 text-xs text-[#9ca3af]">
                    Choose 1 to 2 archetypes that best define your silhouette and sartorial intent.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[380px] overflow-y-auto pr-1">
                  {ARCHETYPES.map((arch) => {
                    const isSelected = selectedArchetypes.includes(arch.key);
                    const rank = selectedArchetypes.indexOf(arch.key);
                    return (
                      <div
                        key={arch.key}
                        onClick={() => toggleArchetype(arch.key)}
                        className={`p-3.5 border transition-all cursor-pointer rounded-sm relative text-left ${
                          isSelected
                            ? 'border-[#e8c547] bg-[#e8c547]/10 text-[#f5f0e8]'
                            : 'border-[#9ca3af]/20 bg-[#262626]/50 text-[#9ca3af] hover:border-white/20'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className={`text-xs font-semibold ${isSelected ? 'text-[#f5f0e8]' : 'text-[#d4cfc7]'}`}>
                            {arch.label}
                          </span>
                          {isSelected && (
                            <span className="text-[9px] font-mono px-1.5 py-0.5 bg-[#e8c547] text-[#1a1a1a] font-bold rounded-sm uppercase">
                              {rank === 0 ? 'Primary' : 'Secondary'}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-[#9ca3af] mt-1 leading-snug">
                          {arch.description}
                        </p>
                        <div className="flex flex-wrap gap-1 mt-2.5">
                          {arch.keywords.map((kw) => (
                            <span
                              key={kw}
                              className="text-[9px] font-mono px-1.5 py-0.5 bg-black/30 border border-white/5 text-[#9ca3af] rounded-sm"
                            >
                              {kw}
                            </span>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="pt-4 border-t border-[#9ca3af]/15 flex items-center justify-between">
                  <VestraButton variant="secondary" size="sm" onClick={handleBack} leftIcon={<ArrowLeft className="h-3.5 w-3.5" />}>
                    Back
                  </VestraButton>
                  <VestraButton variant="primary" size="md" onClick={handleNext} rightIcon={<ArrowRight className="h-4 w-4" />}>
                    Save & Continue
                  </VestraButton>
                </div>
              </div>
            )}

            {/* STEP 3: COLOUR PROFILE */}
            {step === 3 && (
              <div className="space-y-6">
                <div>
                  <span className="text-[10px] font-semibold tracking-[0.25em] text-[#e8c547] uppercase block mb-1">
                    Step 03 • Chromatics
                  </span>
                  <h2 className="font-serif text-2xl md:text-3xl font-normal text-[#f5f0e8] tracking-tight">
                    Harmonic Colour Compass
                  </h2>
                  <p className="mt-1 text-xs text-[#9ca3af]">
                    Select tones you love to wear, and tones you prefer to avoid.
                  </p>
                </div>

                {/* Preferred colours */}
                <div>
                  <label className="text-xs font-semibold text-[#f5f0e8] uppercase tracking-wider block mb-2">
                    Preferred Hues ({preferredColours.length} selected)
                  </label>
                  <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                    {PALETTE_COLORS.map((col) => {
                      const isSel = preferredColours.includes(col.name);
                      return (
                        <button
                          key={col.name}
                          type="button"
                          onClick={() => togglePreferredColor(col.name)}
                          className={`p-1.5 rounded-sm flex flex-col items-center gap-1 border transition-all ${
                            isSel
                              ? 'border-[#e8c547] bg-[#e8c547]/15 ring-1 ring-[#e8c547]'
                              : 'border-white/5 hover:border-white/20 bg-[#262626]/40'
                          }`}
                        >
                          <span
                            className="h-6 w-6 rounded-full border border-black/30 shadow-inner block"
                            style={{ backgroundColor: col.hex }}
                          />
                          <span className="text-[9px] text-[#9ca3af] truncate max-w-full text-center">
                            {col.name.split(' ')[0]}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Avoided colours */}
                <div>
                  <label className="text-xs font-semibold text-[#f5f0e8] uppercase tracking-wider block mb-2">
                    Avoided Hues ({avoidedColours.length} selected)
                  </label>
                  <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                    {PALETTE_COLORS.map((col) => {
                      const isSel = avoidedColours.includes(col.name);
                      return (
                        <button
                          key={col.name}
                          type="button"
                          onClick={() => toggleAvoidedColor(col.name)}
                          className={`p-1.5 rounded-sm flex flex-col items-center gap-1 border transition-all ${
                            isSel
                              ? 'border-red-500 bg-red-950/30 ring-1 ring-red-500'
                              : 'border-white/5 hover:border-white/20 bg-[#262626]/40'
                          }`}
                        >
                          <span
                            className="h-6 w-6 rounded-full border border-black/30 shadow-inner block relative"
                            style={{ backgroundColor: col.hex }}
                          >
                            {isSel && (
                              <span className="absolute inset-0 flex items-center justify-center text-red-300 font-bold text-[10px]">
                                ✕
                              </span>
                            )}
                          </span>
                          <span className="text-[9px] text-[#9ca3af] truncate max-w-full text-center">
                            {col.name.split(' ')[0]}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Skin tone undertone */}
                <div className="pt-2">
                  <label className="text-xs font-semibold text-[#f5f0e8] uppercase tracking-wider block mb-2">
                    Skin Tone Undertone Category
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { key: 'warm', label: 'Warm', desc: 'Golden / Peachy undertones' },
                      { key: 'cool', label: 'Cool', desc: 'Rose / Bluish undertones' },
                      { key: 'neutral', label: 'Neutral', desc: 'Balanced undertones' },
                      { key: 'unset', label: 'Prefer not to say', desc: 'Skip undertone analysis' },
                    ].map((tone) => (
                      <button
                        key={tone.key}
                        type="button"
                        onClick={() => setSkinToneCategory(tone.key)}
                        className={`p-2.5 border text-left rounded-sm transition-all ${
                          skinToneCategory === tone.key
                            ? 'border-[#e8c547] bg-[#e8c547]/10 text-[#f5f0e8]'
                            : 'border-[#9ca3af]/20 bg-[#262626]/50 text-[#9ca3af] hover:border-white/20'
                        }`}
                      >
                        <span className="text-xs font-medium block">{tone.label}</span>
                        <span className="text-[10px] text-[#9ca3af] block mt-0.5">{tone.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-3 bg-[#262626]/50 border border-[#9ca3af]/15 rounded-sm flex items-start gap-2.5">
                  <Info className="h-4 w-4 text-[#e8c547] shrink-0 mt-0.5" />
                  <p className="text-[11px] text-[#9ca3af] leading-relaxed">
                    Skin tone category is used only to suggest flattering colour palettes. No racial or ethnic data is collected or inferred.
                  </p>
                </div>

                <div className="pt-4 border-t border-[#9ca3af]/15 flex items-center justify-between">
                  <VestraButton variant="secondary" size="sm" onClick={handleBack} leftIcon={<ArrowLeft className="h-3.5 w-3.5" />}>
                    Back
                  </VestraButton>
                  <VestraButton variant="primary" size="md" onClick={handleNext} rightIcon={<ArrowRight className="h-4 w-4" />}>
                    Save & Continue
                  </VestraButton>
                </div>
              </div>
            )}

            {/* STEP 4: PROPORTION PROFILE */}
            {step === 4 && (
              <div className="space-y-6">
                <div>
                  <span className="text-[10px] font-semibold tracking-[0.25em] text-[#e8c547] uppercase block mb-1">
                    Step 04 • Silhouettes
                  </span>
                  <h2 className="font-serif text-2xl md:text-3xl font-normal text-[#f5f0e8] tracking-tight">
                    Proportion Architecture
                  </h2>
                  <p className="mt-1 text-xs text-[#9ca3af]">
                    Confidence indicator: <span className="text-[#e8c547] font-mono">Manual selection</span>
                  </p>
                </div>

                <div className="p-3 bg-[#262626]/60 border border-[#e8c547]/30 rounded-sm flex items-start gap-2.5">
                  <Info className="h-4 w-4 text-[#e8c547] shrink-0 mt-0.5" />
                  <p className="text-[11px] text-[#9ca3af] leading-relaxed">
                    These represent common fashion proportion archetypes used for styling guidance — not medical measurements or body assessments. All selections are optional and can be changed anytime.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[350px] overflow-y-auto pr-1">
                  {BODY_TYPES.map((bt) => {
                    const isSelected = bodyProportionType === bt.key;
                    return (
                      <div
                        key={bt.key}
                        onClick={() => setBodyProportionType(bt.key)}
                        className={`p-3.5 border transition-all cursor-pointer rounded-sm ${
                          isSelected
                            ? 'border-[#e8c547] bg-[#e8c547]/10 text-[#f5f0e8]'
                            : 'border-[#9ca3af]/20 bg-[#262626]/50 text-[#9ca3af] hover:border-white/20'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className={`text-xs font-semibold ${isSelected ? 'text-[#f5f0e8]' : 'text-[#d4cfc7]'}`}>
                            {bt.label}
                          </span>
                          {isSelected && <Check className="h-4 w-4 text-[#e8c547]" />}
                        </div>
                        <p className="text-[11px] text-[#9ca3af] mt-1">{bt.description}</p>
                      </div>
                    );
                  })}
                </div>

                <div className="pt-4 border-t border-[#9ca3af]/15 flex items-center justify-between">
                  <VestraButton variant="secondary" size="sm" onClick={handleBack} leftIcon={<ArrowLeft className="h-3.5 w-3.5" />}>
                    Back
                  </VestraButton>
                  <VestraButton variant="primary" size="md" onClick={handleNext} rightIcon={<ArrowRight className="h-4 w-4" />}>
                    Save & Continue
                  </VestraButton>
                </div>
              </div>
            )}

            {/* STEP 5: REFERENCE PHOTO (OPTIONAL) */}
            {step === 5 && (
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-semibold tracking-[0.25em] text-[#e8c547] uppercase block">
                      Step 05 • Reference Capture
                    </span>
                    <span className="text-[9px] font-mono uppercase px-2 py-0.5 bg-[#e8c547]/20 text-[#e8c547] border border-[#e8c547]/40 rounded-sm">
                      OPTIONAL
                    </span>
                  </div>
                  <h2 className="font-serif text-2xl md:text-3xl font-normal text-[#f5f0e8] tracking-tight mt-1">
                    Visual Fit Reference
                  </h2>
                  <p className="mt-1 text-xs text-[#9ca3af]">
                    Provide a full-length portrait so VESTRA can calibrate draping and shoulder geometry.
                  </p>
                </div>

                {photoError && (
                  <div className="p-3 bg-red-950/40 border border-red-800 text-red-200 text-xs flex items-center gap-2 rounded-sm">
                    <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
                    <span>{photoError}</span>
                  </div>
                )}

                {cameraError && (
                  <div className="p-3 bg-amber-950/40 border border-amber-800 text-amber-200 text-xs flex items-center gap-2 rounded-sm">
                    <AlertCircle className="h-4 w-4 shrink-0 text-amber-400" />
                    <span>{cameraError}</span>
                  </div>
                )}

                {/* Display existing uploaded photo or preview */}
                {photoUrl && !cameraActive && !capturedPreview && (
                  <div className="p-4 bg-[#262626]/50 border border-[#9ca3af]/20 rounded-sm flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={photoUrl}
                        alt="Reference Portrait"
                        className="h-16 w-16 object-cover rounded-sm border border-[#e8c547]/40"
                      />
                      <div>
                        <span className="text-xs font-semibold text-[#f5f0e8] block">
                          Reference Photo Active
                        </span>
                        <span className="text-[10px] text-[#9ca3af] block mt-0.5">
                          Securely stored in your private vault
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={deletePhoto}
                      disabled={photoUploading}
                      className="p-2 text-red-400 hover:text-red-300 hover:bg-white/5 rounded-sm transition-colors"
                      title="Remove Photo"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                )}

                {/* Camera Active View */}
                {cameraActive && (
                  <div className="relative bg-black rounded-sm overflow-hidden border border-[#e8c547]/40 flex flex-col items-center">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full max-h-[320px] object-cover"
                    />
                    {/* Framing guide overlay (SVG outline of standing person) */}
                    <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                      <svg
                        viewBox="0 0 100 200"
                        className="h-[85%] stroke-[#e8c547]/40 fill-none stroke-[1.5] stroke-dasharray-[4_4]"
                      >
                        {/* Head */}
                        <circle cx="50" cy="30" r="14" />
                        {/* Torso & Legs */}
                        <path d="M 35 48 C 30 75 30 110 32 180 M 65 48 C 70 75 70 110 68 180 M 42 180 L 42 120 L 58 120 L 58 180" />
                        {/* Arms */}
                        <path d="M 35 52 L 20 110 M 65 52 L 80 110" />
                      </svg>
                      <span className="absolute bottom-3 text-[10px] font-mono tracking-widest text-[#e8c547] bg-black/60 px-2 py-0.5 rounded-sm">
                        ALIGN FULL SILHOUETTE
                      </span>
                    </div>

                    <div className="absolute bottom-3 flex items-center gap-3">
                      <VestraButton variant="secondary" size="sm" onClick={stopCamera}>
                        Cancel
                      </VestraButton>
                      <VestraButton
                        variant="primary"
                        size="sm"
                        onClick={capturePhoto}
                        leftIcon={<Camera className="h-3.5 w-3.5" />}
                      >
                        Capture Frame
                      </VestraButton>
                    </div>
                  </div>
                )}

                {/* Captured Photo Preview before upload */}
                {capturedPreview && (
                  <div className="p-4 bg-[#262626]/60 border border-[#e8c547]/40 rounded-sm flex flex-col items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={capturedPreview}
                      alt="Captured Preview"
                      className="max-h-[220px] object-contain rounded-sm border border-white/10"
                    />
                    <div className="flex items-center gap-3">
                      <VestraButton
                        variant="secondary"
                        size="sm"
                        onClick={() => {
                          setCapturedPreview(null);
                          setCapturedBlob(null);
                          startCamera();
                        }}
                      >
                        Retake
                      </VestraButton>
                      <VestraButton
                        variant="primary"
                        size="sm"
                        disabled={photoUploading}
                        onClick={() => capturedBlob && uploadBlob(capturedBlob)}
                        leftIcon={photoUploading ? <LoadingSpinner size="sm" /> : <Check className="h-3.5 w-3.5" />}
                      >
                        {photoUploading ? 'Uploading...' : 'Use This Photo'}
                      </VestraButton>
                    </div>
                  </div>
                )}

                {/* Action Choice UI (if no active camera or preview) */}
                {!cameraActive && !capturedPreview && !photoUrl && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={startCamera}
                      className="p-6 border border-dashed border-[#9ca3af]/30 rounded-sm text-center bg-[#262626]/30 hover:border-[#e8c547] transition-all flex flex-col items-center gap-2 group"
                    >
                      <Camera className="h-6 w-6 text-[#9ca3af] group-hover:text-[#e8c547] transition-colors" />
                      <span className="text-xs font-semibold text-[#f5f0e8]">Use Camera</span>
                      <span className="text-[10px] text-[#9ca3af]">Capture with live framing guide</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={photoUploading}
                      className="p-6 border border-dashed border-[#9ca3af]/30 rounded-sm text-center bg-[#262626]/30 hover:border-[#e8c547] transition-all flex flex-col items-center gap-2 group"
                    >
                      <Upload className="h-6 w-6 text-[#9ca3af] group-hover:text-[#e8c547] transition-colors" />
                      <span className="text-xs font-semibold text-[#f5f0e8]">Upload Photo</span>
                      <span className="text-[10px] text-[#9ca3af]">JPEG, PNG, WebP up to 8MB</span>
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      className="hidden"
                      onChange={handleFileUpload}
                    />
                  </div>
                )}

                <div className="p-3 bg-[#262626]/50 border border-[#9ca3af]/15 rounded-sm flex items-start gap-2.5">
                  <Shield className="h-4 w-4 text-[#e8c547] shrink-0 mt-0.5" />
                  <p className="text-[11px] text-[#9ca3af] leading-relaxed">
                    Your reference photo is encrypted and stored securely. Only you can access it. Used only for outfit styling suggestions.
                  </p>
                </div>

                <div className="pt-4 border-t border-[#9ca3af]/15 flex items-center justify-between">
                  <VestraButton variant="secondary" size="sm" onClick={handleBack} leftIcon={<ArrowLeft className="h-3.5 w-3.5" />}>
                    Back
                  </VestraButton>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleNext}
                      className="text-xs text-[#9ca3af] hover:text-[#f5f0e8] uppercase tracking-wider px-3 py-2 transition-colors"
                    >
                      Skip Photo
                    </button>
                    <VestraButton variant="primary" size="md" onClick={handleNext} rightIcon={<ArrowRight className="h-4 w-4" />}>
                      Continue
                    </VestraButton>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 6: COMPLETE */}
            {step === 6 && (
              <div className="space-y-6">
                <div>
                  <span className="text-[10px] font-semibold tracking-[0.25em] text-[#e8c547] uppercase block mb-1">
                    Step 06 • Synthesis
                  </span>
                  <h2 className="font-serif text-2xl md:text-3xl font-normal text-[#f5f0e8] tracking-tight">
                    Your Sartorial Blueprint
                  </h2>
                  <p className="mt-1 text-xs text-[#6D6961]">
                    Profile calibrated. Here is the configuration powering your VAYN AI engine.
                  </p>
                </div>

                {/* Summary Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3.5 bg-[#1C1B18] border border-[#DED5C8]/15 rounded">
                    <span className="text-[10px] font-mono uppercase text-[#A95239] block mb-1 font-semibold">
                      Aesthetic Archetypes
                    </span>
                    <span className="text-sm font-semibold text-[#F4EFE6] block">
                      {selectedArchetypes.length > 0
                        ? selectedArchetypes.map((a) => a.replace(/_/g, ' ')).join(' • ')
                        : 'Default Modernist'}
                    </span>
                  </div>

                  <div className="p-3.5 bg-[#1C1B18] border border-[#DED5C8]/15 rounded">
                    <span className="text-[10px] font-mono uppercase text-[#A95239] block mb-1 font-semibold">
                      Proportion Architecture
                    </span>
                    <span className="text-sm font-semibold text-[#F4EFE6] block">
                      {bodyProportionType.replace(/_/g, ' ')}
                    </span>
                  </div>

                  <div className="p-3.5 bg-[#1C1B18] border border-[#DED5C8]/15 rounded">
                    <span className="text-[10px] font-mono uppercase text-[#A95239] block mb-1 font-semibold">
                      Undertone & Palette
                    </span>
                    <span className="text-xs text-[#F4EFE6] block capitalize">
                      Undertone: {skinToneCategory}
                    </span>
                    <span className="text-[11px] text-[#6D6961] block mt-0.5">
                      {preferredColours.length} preferred hues • {avoidedColours.length} avoided hues
                    </span>
                  </div>

                  <div className="p-3.5 bg-[#1C1B18] border border-[#DED5C8]/15 rounded">
                    <span className="text-[10px] font-mono uppercase text-[#A95239] block mb-1 font-semibold">
                      Reference Photo
                    </span>
                    <span className="text-sm font-semibold text-[#F4EFE6] block">
                      {photoUrl ? 'Attached & Secured' : 'None Provided (Manual Model)'}
                    </span>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#9ca3af]/15 flex items-center justify-between">
                  <VestraButton variant="secondary" size="sm" onClick={handleBack} leftIcon={<ArrowLeft className="h-3.5 w-3.5" />}>
                    Back
                  </VestraButton>
                  <VestraButton
                    variant="primary"
                    size="lg"
                    onClick={handleFinish}
                    rightIcon={<ArrowRight className="h-4 w-4" />}
                  >
                    Enter Your Atelier
                  </VestraButton>
                </div>
              </div>
            )}
          </VestraCard>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

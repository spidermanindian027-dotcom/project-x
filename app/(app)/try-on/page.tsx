'use client';

import * as React from 'react';
import {
  Sparkles,
  Camera,
  Check,
  AlertCircle,
  Bookmark,
  Info,
  History,
} from 'lucide-react';
import { VaynButton } from '@/components/ui/vestra-button';
import { VaynCard } from '@/components/ui/vestra-card';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

interface WardrobeItem {
  id: string;
  name: string;
  category: string;
  dominantColor: string;
  imageUrl: string;
}

interface TryOnJob {
  id: string;
  referenceImageUrl: string;
  selectedItemIds: string[];
  status: string;
  resultImageUrl?: string | null;
  errorMessage?: string | null;
  createdAt: string;
}

export default function TryOnPage() {
  const [wardrobeItems, setWardrobeItems] = React.useState<WardrobeItem[]>([]);
  const [selectedItemIds, setSelectedItemIds] = React.useState<string[]>([]);
  const [referencePhoto, setReferencePhoto] = React.useState<string | null>(null);
  const [historyJobs, setHistoryJobs] = React.useState<TryOnJob[]>([]);

  const [activeCategory, setActiveCategory] = React.useState<string>('TOPS');
  const [isProcessing, setIsProcessing] = React.useState<boolean>(false);
  const [activeJob, setActiveJob] = React.useState<TryOnJob | null>(null);
  const [feedback, setFeedback] = React.useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isSavedAsLook, setIsSavedAsLook] = React.useState<boolean>(false);
  const [savingLook, setSavingLook] = React.useState<boolean>(false);

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    let active = true;
    async function init() {
      try {
        const [profileRes, itemsRes, jobsRes] = await Promise.all([
          fetch('/api/profile'),
          fetch('/api/wardrobe'),
          fetch('/api/try-on'),
        ]);

        if (!active) return;

        if (profileRes.ok) {
          const p = await profileRes.json();
          if (p.profile?.referencePhotoUrl) {
            setReferencePhoto(p.profile.referencePhotoUrl);
          }
        }

        if (itemsRes.ok) {
          const i = await itemsRes.json();
          setWardrobeItems(i.items || []);
        }

        if (jobsRes.ok) {
          const j = await jobsRes.json();
          setHistoryJobs(j.jobs || []);
        }
      } catch {
        // silent
      }
    }
    init();
    return () => {
      active = false;
    };
  }, []);

  const handleUploadNewReference = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append('photo', file);
      const res = await fetch('/api/profile/photo', { method: 'POST', body: formData });
      const data = await res.json();
      if (res.ok && data.success) {
        setReferencePhoto(data.photoUrl);
        setFeedback({ type: 'success', message: 'Reference portrait updated.' });
      }
    } catch {
      setFeedback({ type: 'error', message: 'Failed to upload photo.' });
    }
  };

  const toggleSelectItem = (id: string) => {
    setSelectedItemIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      }
      if (prev.length >= 4) {
        return prev;
      }
      return [...prev, id];
    });
  };

  const handleGenerateTryOn = async () => {
    if (!referencePhoto) {
      setFeedback({ type: 'error', message: 'Please provide or upload a reference portrait.' });
      return;
    }
    if (selectedItemIds.length === 0) {
      setFeedback({ type: 'error', message: 'Select at least 1 wardrobe piece to try on.' });
      return;
    }

    setIsProcessing(true);
    setFeedback(null);
    setIsSavedAsLook(false);

    try {
      const res = await fetch('/api/try-on', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          referenceImageUrl: referencePhoto,
          selectedItemIds,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Try-on processing failed');
      }

      setActiveJob(data.job);
      setHistoryJobs((prev) => [data.job, ...prev]);
    } catch (err) {
      setFeedback({ type: 'error', message: (err as Error).message });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSaveToLooks = async () => {
    if (!activeJob) return;
    setSavingLook(true);
    try {
      const res = await fetch('/api/looks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: `Virtual Try-On Look • ${new Date().toLocaleDateString()}`,
          notes: 'Neural try-on synthesized ensemble.',
          wardrobeItemIds: selectedItemIds,
          source: 'MANUAL_CURATION',
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to save look');
      }

      setIsSavedAsLook(true);
      setFeedback({ type: 'success', message: 'Try-on look saved to My Looks.' });
    } catch (err) {
      setFeedback({ type: 'error', message: (err as Error).message });
    } finally {
      setSavingLook(false);
    }
  };

  // Filter items by category tab
  const categoryItems = wardrobeItems.filter((i) => {
    if (activeCategory === 'TOPS') {
      return ['TOPS', 'SHIRTS', 'SWEATERS', 'HOODIES', 'DRESSES'].includes(i.category);
    }
    if (activeCategory === 'BOTTOMS') {
      return ['TROUSERS', 'JEANS', 'SKIRTS', 'SHORTS'].includes(i.category);
    }
    if (activeCategory === 'OUTERWEAR') {
      return i.category === 'JACKETS';
    }
    if (activeCategory === 'FOOTWEAR') {
      return ['SHOES', 'BOOTS'].includes(i.category);
    }
    return true;
  });

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 space-y-8">
      {/* Editorial Header */}
      <div className="border-b border-[#DED5C8]/10 pb-6">
        <span className="text-[10px] font-semibold tracking-[0.25em] text-[#A95239] uppercase block mb-1 font-mono">
          VAYN Neural Fitting Studio
        </span>
        <h1 className="font-serif text-3xl md:text-4xl font-normal text-[#F4EFE6] tracking-tight">
          Virtual Try-On Studio
        </h1>
        <p className="text-xs md:text-sm text-[#6D6961] mt-1 max-w-2xl">
          Photorealistic neural drape simulation mapping your archived wardrobe pieces onto your reference silhouette.
        </p>
      </div>

      {feedback && (
        <div
          className={`p-3 text-xs flex items-center gap-2 rounded border ${
            feedback.type === 'success'
              ? 'bg-emerald-950/40 border-emerald-800 text-emerald-200'
              : 'bg-red-950/40 border-red-800 text-red-200'
          }`}
        >
          {feedback.type === 'success' ? (
            <Check className="h-4 w-4 shrink-0 text-emerald-400" />
          ) : (
            <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Main Studio Workspace Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Col: Reference Photo Card */}
        <VaynCard variant="bordered" padding="md" className="space-y-4">
          <div className="border-b border-[#DED5C8]/10 pb-2.5 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono uppercase text-[#A95239] block font-semibold">Base Silhouette</span>
              <h3 className="font-serif text-base text-[#F4EFE6]">Reference Portrait</h3>
            </div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="text-[10px] font-mono text-[#A95239] hover:underline"
            >
              Replace Photo
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={handleUploadNewReference}
            />
          </div>

          {referencePhoto ? (
            <div className="relative aspect-[3/4] bg-black rounded overflow-hidden border border-[#DED5C8]/15 flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={referencePhoto} alt="Reference Silhouette" className="w-full h-full object-cover" />
            </div>
          ) : (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="aspect-[3/4] border-2 border-dashed border-[#DED5C8]/20 rounded flex flex-col items-center justify-center p-6 text-center cursor-pointer hover:border-[#A95239] bg-[#24231F]/30 transition-colors"
            >
              <Camera className="h-8 w-8 text-[#6D6961] mb-2" />
              <span className="text-xs font-semibold text-[#F4EFE6]">Upload Reference Photo</span>
              <span className="text-[10px] text-[#6D6961] mt-1">Full-body portrait in standing pose</span>
            </div>
          )}

          <p className="text-[10px] text-[#6D6961] leading-relaxed">
            Your encrypted portrait anchors shoulder width, torso verticality, and silhouette stance parameters.
          </p>
        </VaynCard>

        {/* Right 2 Cols: Garment Selector & Studio Action */}
        <VaynCard variant="bordered" padding="md" className="md:col-span-2 space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="border-b border-[#DED5C8]/10 pb-2.5 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase text-[#A95239] block font-semibold">Select Garments</span>
                <h3 className="font-serif text-base text-[#F4EFE6]">
                  Garment Palette ({selectedItemIds.length}/4 Selected)
                </h3>
              </div>

              {/* Category Filter Tabs */}
              <div className="flex items-center gap-1 text-[10px] font-mono">
                {['TOPS', 'BOTTOMS', 'OUTERWEAR', 'FOOTWEAR'].map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setActiveCategory(cat)}
                    className={`px-2 py-1 rounded border transition-colors ${
                      activeCategory === cat
                        ? 'border-[#A95239] bg-[#A95239] text-[#F4EFE6] font-bold'
                        : 'border-[#DED5C8]/10 bg-[#24231F]/40 text-[#6D6961] hover:border-[#DED5C8]/30'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Garments Grid */}
            {categoryItems.length === 0 ? (
              <div className="py-12 text-center text-xs text-[#6D6961]">
                No pieces found under {activeCategory.toLowerCase()}. Catalog garments in your vault to try them on.
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 max-h-[300px] overflow-y-auto pr-1">
                {categoryItems.map((item) => {
                  const isSelected = selectedItemIds.includes(item.id);
                  return (
                    <div
                      key={item.id}
                      onClick={() => toggleSelectItem(item.id)}
                      className={`cursor-pointer rounded border transition-all overflow-hidden relative ${
                        isSelected
                          ? 'border-[#A95239] ring-1 ring-[#A95239] bg-[#A95239]/10'
                          : 'border-[#DED5C8]/15 bg-[#24231F]/30 hover:border-[#DED5C8]/40'
                      }`}
                    >
                      <div className="aspect-[3/4] bg-black relative">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                        {isSelected && (
                          <div className="absolute top-1.5 right-1.5 h-4 w-4 rounded-full bg-[#A95239] text-[#F4EFE6] flex items-center justify-center font-bold text-[10px]">
                            ✓
                          </div>
                        )}
                      </div>
                      <div className="p-1.5 truncate">
                        <span className="text-[11px] font-medium text-[#F4EFE6] block truncate">{item.name}</span>
                        <span className="text-[9px] text-[#6D6961] font-mono block">{item.dominantColor}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-[#DED5C8]/10 flex items-center justify-between">
            <span className="text-[10px] text-[#6D6961] font-mono">
              Maximum 4 garments per neural pass
            </span>

            <VaynButton
              variant="primary"
              size="md"
              onClick={handleGenerateTryOn}
              disabled={isProcessing || selectedItemIds.length === 0 || !referencePhoto}
              leftIcon={isProcessing ? <LoadingSpinner size="sm" /> : <Sparkles className="h-4 w-4" />}
            >
              {isProcessing ? 'Simulating Neural Fit...' : 'Generate Virtual Try-On'}
            </VaynButton>
          </div>
        </VaynCard>
      </div>

      {/* RESULTS SHOWCASE (ACTIVE JOB) */}
      {activeJob && (
        <div className="space-y-6 pt-4">
          <div className="p-3.5 bg-[#A95239]/10 border border-[#A95239]/30 text-[#E9E1D6] text-xs rounded flex items-start gap-2.5">
            <Info className="h-4 w-4 shrink-0 text-[#A95239] mt-0.5" />
            <p className="leading-relaxed">
              VAYN Diffusion Preview: Neural Try-On simulation active. Previews are artistic conceptual estimations and do not guarantee exact fabric drape, physical fit, or precise identity preservation.
            </p>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#DED5C8]/10 pb-4">
            <div>
              <span className="text-[10px] font-semibold tracking-[0.25em] text-[#A95239] uppercase block mb-1 font-mono">
                Synthesized Look
              </span>
              <h2 className="font-serif text-2xl md:text-3xl text-[#F4EFE6]">
                Neural Try-On Composite
              </h2>
            </div>

            <VaynButton
              variant="secondary"
              size="sm"
              onClick={handleSaveToLooks}
              disabled={savingLook || isSavedAsLook}
              leftIcon={<Bookmark className={`h-4 w-4 ${isSavedAsLook ? 'fill-[#A95239] text-[#A95239]' : ''}`} />}
            >
              {isSavedAsLook ? 'Archived to My Looks' : savingLook ? 'Archiving...' : 'Save as Signature Look'}
            </VaynButton>
          </div>

          {/* Before & After Comparison */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <VaynCard variant="bordered" padding="md" className="space-y-2 text-center">
              <span className="text-[10px] font-mono uppercase text-[#6D6961] block">1. Reference Silhouette</span>
              <div className="aspect-[3/4] bg-black rounded overflow-hidden border border-[#DED5C8]/15">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={activeJob.referenceImageUrl}
                  alt="Original Silhouette"
                  className="w-full h-full object-cover"
                />
              </div>
            </VaynCard>

            <VaynCard variant="bordered" padding="md" className="space-y-2 text-center">
              <span className="text-[10px] font-mono uppercase text-[#A95239] block font-semibold">2. Synthesized Look</span>
              <div className="aspect-[3/4] bg-black rounded overflow-hidden border border-[#A95239]/40 relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={activeJob.resultImageUrl || activeJob.referenceImageUrl}
                  alt="Synthesized Fit"
                  className="w-full h-full object-cover"
                />
                <span className="absolute bottom-2 right-2 text-[9px] font-mono bg-black/85 px-2 py-0.5 rounded text-[#A95239]">
                  VAYN VTON DIFFUSION
                </span>
              </div>
            </VaynCard>
          </div>
        </div>
      )}

      {/* HISTORICAL TRY-ON GALLERY SHELF */}
      <div className="pt-6 border-t border-[#DED5C8]/10 space-y-4">
        <div className="flex items-center gap-2">
          <History className="h-4 w-4 text-[#A95239]" />
          <h3 className="font-serif text-lg text-[#F4EFE6]">Try-On Session Archive ({historyJobs.length})</h3>
        </div>

        {historyJobs.length === 0 ? (
          <div className="text-xs text-[#6D6961] py-6 text-center">
            No previous virtual try-on sessions recorded.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
            {historyJobs.map((job) => (
              <div
                key={job.id}
                onClick={() => setActiveJob(job)}
                className="cursor-pointer bg-[#24231F]/40 border border-[#DED5C8]/15 hover:border-[#A95239] rounded overflow-hidden transition-all"
              >
                <div className="aspect-[3/4] bg-black">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={job.resultImageUrl || job.referenceImageUrl}
                    alt="Historical Try-On"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-2 text-[9px] font-mono text-[#6D6961] truncate">
                  {new Date(job.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

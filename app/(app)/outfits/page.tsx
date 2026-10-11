'use client';

import * as React from 'react';
import {
  Sparkles,
  CloudSun,
  Bookmark,
  Trash2,
  Check,
  AlertCircle,
} from 'lucide-react';
import { VestraButton } from '@/components/ui/vestra-button';
import { VestraCard } from '@/components/ui/vestra-card';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

interface WardrobeItem {
  id: string;
  name: string;
  category: string;
  dominantColor: string;
  colorHex: string | null;
  material: string | null;
  season: string;
  imageUrl: string;
}

interface MatchedLook {
  outfitId: string;
  title: string;
  selectedItemIds: string[];
  colorRationale: string;
  proportionRationale: string;
  occasionSuitability: string;
  explanation: string;
  alternatives: string[];
  selectedItems: WardrobeItem[];
  savedOutfitId?: string | null;
}

interface SavedOutfit {
  id: string;
  title: string;
  occasion: string;
  colorRationale: string;
  proportionRationale: string;
  explanation: string;
  createdAt: string;
  items: {
    wardrobeItem: WardrobeItem;
  }[];
}

const OCCASIONS = [
  { id: 'Daily Casual', label: 'Daily Casual', desc: 'Effortless street & café elegance' },
  { id: 'Executive Boardroom', label: 'Executive Boardroom', desc: 'Sharp tailoring & authoritative presence' },
  { id: 'Evening Gala', label: 'Evening Gala', desc: 'Formal opulence & black-tie silhouette' },
  { id: 'Summer Cocktail', label: 'Summer Cocktail', desc: 'Lightweight drapes & breathable luxury' },
  { id: 'Weekend Escape', label: 'Weekend Escape', desc: 'Relaxed layers & transitional versatility' },
];

export default function OutfitsPage() {
  const [selectedOccasion, setSelectedOccasion] = React.useState<string>('Daily Casual');
  const [seasonNote, setSeasonNote] = React.useState<string>('All Season');
  const [isMatching, setIsMatching] = React.useState<boolean>(false);
  const [currentMatch, setCurrentMatch] = React.useState<MatchedLook | null>(null);
  const [savedOutfits, setSavedOutfits] = React.useState<SavedOutfit[]>([]);
  const [loadingSaved, setLoadingSaved] = React.useState<boolean>(true);
  const [feedback, setFeedback] = React.useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isSavingLook, setIsSavingLook] = React.useState<boolean>(false);
  const [isSavedSuccessfully, setIsSavedSuccessfully] = React.useState<boolean>(false);

  // Fetch saved outfits on load
  React.useEffect(() => {
    let active = true;
    async function loadData() {
      try {
        const res = await fetch('/api/stylist/outfits');
        if (!active) return;
        if (res.ok) {
          const data = await res.json();
          setSavedOutfits(data.outfits || []);
        }
      } catch {
        // silent initial load
      } finally {
        if (active) {
          setLoadingSaved(false);
        }
      }
    }
    loadData();
    return () => {
      active = false;
    };
  }, []);

  const handleGenerateMatch = async () => {
    setIsMatching(true);
    setFeedback(null);
    setIsSavedSuccessfully(false);

    try {
      const res = await fetch('/api/stylist/match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          occasion: selectedOccasion,
          season: seasonNote,
          autoSave: false,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to synthesize outfit match');
      }

      setCurrentMatch(data.match);
    } catch (err) {
      setFeedback({ type: 'error', message: (err as Error).message });
    } finally {
      setIsMatching(false);
    }
  };

  const handleSaveCurrentMatch = async () => {
    if (!currentMatch) return;
    setIsSavingLook(true);
    setFeedback(null);

    try {
      const res = await fetch('/api/stylist/outfits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: currentMatch.title,
          occasion: selectedOccasion,
          colorRationale: currentMatch.colorRationale,
          proportionRationale: currentMatch.proportionRationale,
          occasionSuitability: currentMatch.occasionSuitability,
          explanation: currentMatch.explanation,
          alternatives: currentMatch.alternatives,
          itemIds: currentMatch.selectedItemIds,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to save look to lookbook');
      }

      setSavedOutfits((prev) => [data.outfit, ...prev]);
      setIsSavedSuccessfully(true);
      setFeedback({ type: 'success', message: 'Lookbook entry saved to your permanent archive.' });
    } catch (err) {
      setFeedback({ type: 'error', message: (err as Error).message });
    } finally {
      setIsSavingLook(false);
    }
  };

  const handleDeleteSavedOutfit = async (id: string) => {
    try {
      const res = await fetch(`/api/stylist/outfits/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setSavedOutfits((prev) => prev.filter((o) => o.id !== id));
        setFeedback({ type: 'success', message: 'Look deleted from lookbook.' });
      }
    } catch {
      setFeedback({ type: 'error', message: 'Failed to delete look.' });
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 space-y-10">
      {/* Editorial Header */}
      <div className="border-b border-[#DED5C8]/10 pb-6">
        <span className="text-[10px] font-semibold tracking-[0.25em] text-[#A95239] uppercase block mb-1 font-mono">
          VAYN Algorithmic Curation
        </span>
        <h1 className="font-serif text-3xl md:text-4xl font-normal text-[#F4EFE6] tracking-tight">
          AI Wardrobe Matching Atelier
        </h1>
        <p className="text-xs md:text-sm text-[#6D6961] mt-1 max-w-2xl">
          Pairing your digitized archive pieces using color theory, silhouette proportion rules, and occasion context.
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

      {/* Synthesis Configuration Grid */}
      <VestraCard variant="bordered" padding="lg" className="space-y-6 border-[#DED5C8]/15 bg-[#24231F]">
        <div>
          <span className="text-[10px] font-mono uppercase text-[#A95239] tracking-wider block mb-2 font-semibold">
            1. Select Occasion Calibration
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2.5">
            {OCCASIONS.map((occ) => (
              <button
                key={occ.id}
                type="button"
                onClick={() => setSelectedOccasion(occ.id)}
                className={`p-3 text-left border rounded transition-all ${
                  selectedOccasion === occ.id
                    ? 'border-[#A95239] bg-[#A95239]/12 text-[#F4EFE6] ring-1 ring-[#A95239]'
                    : 'border-[#DED5C8]/15 bg-[#1C1B18] text-[#6D6961] hover:border-[#A95239]/40'
                }`}
              >
                <span className="text-xs font-semibold block">{occ.label}</span>
                <span className="text-[10px] text-[#6D6961] block mt-0.5 leading-tight">{occ.desc}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#DED5C8]/10">
          <div className="flex items-center gap-2 text-xs text-[#6D6961]">
            <CloudSun className="h-4 w-4 text-[#A95239]" />
            <span className="font-mono">Season Filter:</span>
            <select
              value={seasonNote}
              onChange={(e) => setSeasonNote(e.target.value)}
              className="bg-[#1C1B18] border border-[#DED5C8]/20 text-xs text-[#F4EFE6] rounded p-1.5 focus:border-[#A95239] focus:outline-none"
            >
              <option value="All Season">All Seasons</option>
              <option value="Spring / Summer">Spring / Summer</option>
              <option value="Autumn / Winter">Autumn / Winter</option>
            </select>
          </div>

          <VestraButton
            variant="primary"
            size="md"
            onClick={handleGenerateMatch}
            disabled={isMatching}
            leftIcon={isMatching ? <LoadingSpinner size="sm" /> : <Sparkles className="h-4 w-4" />}
          >
            {isMatching ? 'Synthesizing Matches...' : 'Generate Match from Wardrobe'}
          </VestraButton>
        </div>
      </VestraCard>

      {/* MATCHED LOOK SHOWCASE */}
      {currentMatch && (
        <div className="space-y-6 pt-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#9ca3af]/15 pb-4">
            <div>
              <span className="text-[10px] font-semibold tracking-[0.25em] text-[#e8c547] uppercase block mb-1">
                Curated Ensemble
              </span>
              <h2 className="font-serif text-2xl md:text-3xl text-[#f5f0e8]">{currentMatch.title}</h2>
              <span className="text-xs text-[#9ca3af] mt-1 block">
                Occasion: <span className="text-[#f5f0e8]">{selectedOccasion}</span>
              </span>
            </div>

            <VestraButton
              variant="secondary"
              size="sm"
              onClick={handleSaveCurrentMatch}
              disabled={isSavingLook || isSavedSuccessfully}
              leftIcon={<Bookmark className={`h-4 w-4 ${isSavedSuccessfully ? 'fill-[#e8c547] text-[#e8c547]' : ''}`} />}
            >
              {isSavedSuccessfully ? 'Saved to Lookbook' : isSavingLook ? 'Saving...' : 'Save Look to Archive'}
            </VestraButton>
          </div>

          {/* Selected Wardrobe Garment Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {currentMatch.selectedItems.map((item) => (
              <div
                key={item.id}
                className="bg-[#262626]/40 border border-[#9ca3af]/20 rounded-sm overflow-hidden flex flex-col justify-between"
              >
                <div className="relative aspect-[3/4] bg-black">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                  <span className="absolute top-1.5 left-1.5 text-[8px] font-mono tracking-widest uppercase px-1.5 py-0.5 bg-black/80 text-[#e8c547] rounded-sm">
                    {item.category.replace(/_/g, ' ')}
                  </span>
                </div>
                <div className="p-2.5 space-y-1">
                  <h4 className="text-xs font-medium text-[#f5f0e8] truncate">{item.name}</h4>
                  <div className="flex items-center gap-1.5 text-[10px] text-[#9ca3af] font-mono">
                    <span
                      className="h-1.5 w-1.5 rounded-full"
                      style={{ backgroundColor: item.colorHex || '#9ca3af' }}
                    />
                    <span>{item.dominantColor}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Rationale Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <VestraCard variant="bordered" padding="md">
              <span className="text-[10px] font-mono uppercase text-[#e8c547] block mb-1">
                Chromatic Rationale
              </span>
              <p className="text-xs text-[#d4cfc7] leading-relaxed">{currentMatch.colorRationale}</p>
            </VestraCard>

            <VestraCard variant="bordered" padding="md">
              <span className="text-[10px] font-mono uppercase text-[#e8c547] block mb-1">
                Silhouette Architecture
              </span>
              <p className="text-xs text-[#d4cfc7] leading-relaxed">{currentMatch.proportionRationale}</p>
            </VestraCard>

            <VestraCard variant="bordered" padding="md">
              <span className="text-[10px] font-mono uppercase text-[#e8c547] block mb-1">
                Occasion Context
              </span>
              <p className="text-xs text-[#d4cfc7] leading-relaxed">{currentMatch.occasionSuitability}</p>
            </VestraCard>
          </div>
        </div>
      )}

      {/* SAVED OUTFITS LOOKBOOK SHELF */}
      <div className="pt-6 border-t border-[#9ca3af]/15 space-y-6">
        <div>
          <span className="text-[10px] font-semibold tracking-[0.25em] text-[#e8c547] uppercase block mb-1">
            Archived Looks
          </span>
          <h3 className="font-serif text-2xl text-[#f5f0e8]">Saved Outfits Lookbook ({savedOutfits.length})</h3>
        </div>

        {loadingSaved ? (
          <div className="py-8 flex justify-center">
            <LoadingSpinner size="md" />
          </div>
        ) : savedOutfits.length === 0 ? (
          <VestraCard variant="bordered" padding="md" className="text-center py-10 space-y-2">
            <Bookmark className="h-6 w-6 text-[#9ca3af]/40 mx-auto mb-2" />
            <h4 className="text-sm font-medium text-[#f5f0e8]">No Saved Looks Yet</h4>
            <p className="text-xs text-[#9ca3af]">
              Synthesize an outfit above and bookmark it to build your signature seasonal lookbook.
            </p>
          </VestraCard>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {savedOutfits.map((outfit) => (
              <VestraCard key={outfit.id} variant="bordered" padding="md" className="space-y-3">
                <div className="flex items-start justify-between gap-3 border-b border-[#9ca3af]/10 pb-2.5">
                  <div>
                    <h4 className="font-serif text-base text-[#f5f0e8]">{outfit.title}</h4>
                    <span className="text-[10px] text-[#e8c547] font-mono uppercase tracking-wider block mt-0.5">
                      {outfit.occasion} • {new Date(outfit.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDeleteSavedOutfit(outfit.id)}
                    className="text-[#9ca3af] hover:text-red-400 p-1"
                    title="Delete saved look"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                {/* Thumbnails Row */}
                <div className="flex items-center gap-2 overflow-x-auto py-1">
                  {outfit.items.map(({ wardrobeItem }) => (
                    <div
                      key={wardrobeItem.id}
                      className="h-16 w-14 shrink-0 rounded-sm overflow-hidden bg-black border border-[#9ca3af]/20 relative"
                      title={wardrobeItem.name}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={wardrobeItem.imageUrl}
                        alt={wardrobeItem.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>

                <p className="text-xs text-[#9ca3af] line-clamp-2 leading-relaxed">
                  {outfit.explanation || outfit.colorRationale}
                </p>
              </VestraCard>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

'use client';

import * as React from 'react';
import {
  Compass,
  MapPin,
  Sparkles,
  Bookmark,
  Check,
  AlertCircle,
  Building,
  GraduationCap,
  Briefcase,
  Heart,
  Coffee,
  Music,
  Palmtree,
  Plane,
  PartyPopper,
  Mountain,
  Sliders,
} from 'lucide-react';
import { VaynButton } from '@/components/ui/vestra-button';
import { VaynCard } from '@/components/ui/vestra-card';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

interface WardrobeItem {
  id: string;
  name: string;
  category: string;
  dominantColor: string;
  colorHex: string | null;
  material: string | null;
  imageUrl: string;
}

interface WeatherInfo {
  city: string;
  temperatureC: number;
  condition: string;
  description: string;
  season: string;
  isDevelopmentAdapter: boolean;
}

interface Recommendation {
  occasion: string;
  weather: WeatherInfo;
  title: string;
  selectedItems: WardrobeItem[];
  footwearSuggestion: string;
  accessoriesSuggestion: string;
  colorPalette: string[];
  stylingReason: string;
  alternatives: string[];
}

const OCCASIONS = [
  { id: 'OFFICE', label: 'Office', icon: Building, desc: 'Professional corporate tailoring' },
  { id: 'INTERVIEW', label: 'Interview', icon: Briefcase, desc: 'High-stakes executive first impression' },
  { id: 'WEDDING', label: 'Wedding', icon: Sparkles, desc: 'Formal and black-tie elegance' },
  { id: 'DATE', label: 'Date', icon: Heart, desc: 'Intimate evening and refined romance' },
  { id: 'CAFE', label: 'Cafe', icon: Coffee, desc: 'Effortless relaxed casual' },
  { id: 'COLLEGE', label: 'College', icon: GraduationCap, desc: 'Campus layering & versatile smarts' },
  { id: 'CONCERT', label: 'Concert', icon: Music, desc: 'Dynamic edge with evening flair' },
  { id: 'BEACH', label: 'Beach', icon: Palmtree, desc: 'Breathable linen & lightweight coastal' },
  { id: 'AIRPORT', label: 'Airport', icon: Plane, desc: 'Jet-set luxury & travel comfort' },
  { id: 'PARTY', label: 'Party', icon: PartyPopper, desc: 'Cocktail & nocturnal focal accents' },
  { id: 'TREKKING', label: 'Trekking', icon: Mountain, desc: 'Technical functional layering' },
  { id: 'CUSTOM', label: 'Custom', icon: Sliders, desc: 'Bespoke event parameters' },
];

const TIMES_OF_DAY = ['Morning', 'Afternoon', 'Evening', 'Gala Night'];

export default function StylingPage() {
  const [selectedOccasion, setSelectedOccasion] = React.useState<string>('OFFICE');
  const [customOccasionText, setCustomOccasionText] = React.useState<string>('');
  const [cityInput, setCityInput] = React.useState<string>('Paris');
  const [timeOfDay, setTimeOfDay] = React.useState<string>('Afternoon');
  const [coords, setCoords] = React.useState<{ lat: number; lon: number } | null>(null);

  const [loading, setLoading] = React.useState<boolean>(false);
  const [recommendation, setRecommendation] = React.useState<Recommendation | null>(null);
  const [feedback, setFeedback] = React.useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isSaved, setIsSaved] = React.useState<boolean>(false);
  const [savingLook, setSavingLook] = React.useState<boolean>(false);

  const handleUseDeviceLocation = () => {
    if (!navigator.geolocation) {
      setFeedback({ type: 'error', message: 'Geolocation is not supported by your browser.' });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lon: pos.coords.longitude });
        setCityInput('Localized Device GPS');
        setFeedback({ type: 'success', message: 'Coordinates captured for meteorological calibration.' });
      },
      () => {
        setFeedback({ type: 'error', message: 'Location access was declined. Defaulting to manual city input.' });
      }
    );
  };

  const handleFetchRecommendation = async () => {
    setLoading(true);
    setFeedback(null);
    setIsSaved(false);

    try {
      const res = await fetch('/api/stylist/location-occasion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          occasion: selectedOccasion,
          customOccasion: selectedOccasion === 'CUSTOM' ? customOccasionText : undefined,
          city: cityInput,
          coords: coords || undefined,
          timeOfDay,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to synthesize styling recommendation');
      }

      setRecommendation(data.recommendation);
    } catch (err) {
      setFeedback({ type: 'error', message: (err as Error).message });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAsLook = async () => {
    if (!recommendation) return;
    setSavingLook(true);
    try {
      const res = await fetch('/api/looks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: recommendation.title,
          notes: `${recommendation.stylingReason} (${recommendation.weather.city} • ${recommendation.weather.temperatureC}°C)`,
          wardrobeItemIds: recommendation.selectedItems.map((i) => i.id),
          source: 'OUTFIT_MATCH',
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to archive look');
      }

      setIsSaved(true);
      setFeedback({ type: 'success', message: 'Look successfully archived to your Personal Looks.' });
    } catch (err) {
      setFeedback({ type: 'error', message: (err as Error).message });
    } finally {
      setSavingLook(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 space-y-8">
      {/* Editorial Header */}
      <div className="border-b border-[#DED5C8]/10 pb-6">
        <span className="text-[10px] font-semibold tracking-[0.25em] text-[#A95239] uppercase block mb-1 font-mono">
          VAYN Atmospheric Synthesis
        </span>
        <h1 className="font-serif text-3xl md:text-4xl font-normal text-[#F4EFE6] tracking-tight">
          Location & Occasion Styling
        </h1>
        <p className="text-xs md:text-sm text-[#6D6961] mt-1 max-w-2xl">
          Meteorological and contextual alignment calibrating live temperature, event formality, and wardrobe architecture.
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

      {/* Occasions Selector Grid */}
      <VaynCard variant="bordered" padding="lg" className="space-y-6">
        <div>
          <span className="text-[10px] font-mono uppercase text-[#A95239] tracking-wider block mb-3 font-semibold">
            1. Select Event Context (12 Calibrated Occasions)
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
            {OCCASIONS.map((occ) => {
              const Icon = occ.icon;
              const isSelected = selectedOccasion === occ.id;
              return (
                <button
                  key={occ.id}
                  type="button"
                  onClick={() => setSelectedOccasion(occ.id)}
                  className={`p-3 text-left border rounded transition-all flex flex-col justify-between h-24 ${
                    isSelected
                      ? 'border-[#A95239] bg-[#A95239]/15 text-[#F4EFE6] ring-1 ring-[#A95239]'
                      : 'border-[#DED5C8]/10 bg-[#24231F]/40 text-[#6D6961] hover:border-[#DED5C8]/30 hover:text-[#F4EFE6]'
                  }`}
                >
                  <Icon className={`h-4 w-4 ${isSelected ? 'text-[#A95239]' : 'text-[#6D6961]'}`} />
                  <div>
                    <span className="text-xs font-semibold block">{occ.label}</span>
                    <span className="text-[9px] text-[#6D6961] block leading-tight line-clamp-1">{occ.desc}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {selectedOccasion === 'CUSTOM' && (
            <div className="mt-3">
              <input
                type="text"
                placeholder="Describe your custom event (e.g. Gallery vernissage in Zurich)..."
                value={customOccasionText}
                onChange={(e) => setCustomOccasionText(e.target.value)}
                className="w-full bg-[#1C1B18] border border-[#DED5C8]/20 rounded p-2.5 text-xs text-[#F4EFE6] focus:border-[#A95239] focus:outline-none"
              />
            </div>
          )}
        </div>

        {/* Location & Time Settings Bar */}
        <div className="pt-4 border-t border-[#DED5C8]/10 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          {/* City / Location Input */}
          <div className="space-y-1">
            <label className="text-[#6D6961] block text-[10px] font-mono uppercase">Metropolitan Center</label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="e.g. Paris, Milan, London, Tokyo, New York"
                value={cityInput}
                onChange={(e) => setCityInput(e.target.value)}
                className="flex-1 bg-[#1C1B18] border border-[#DED5C8]/20 rounded p-2 text-[#F4EFE6] focus:border-[#A95239] focus:outline-none"
              />
              <button
                type="button"
                onClick={handleUseDeviceLocation}
                className="p-2 bg-[#1C1B18] border border-[#DED5C8]/20 hover:border-[#A95239] rounded text-[#A95239] transition-colors"
                title="Use Device Geolocation"
              >
                <MapPin className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Time of Day */}
          <div className="space-y-1">
            <label className="text-[#6D6961] block text-[10px] font-mono uppercase">Time of Day</label>
            <div className="grid grid-cols-4 gap-1">
              {TIMES_OF_DAY.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTimeOfDay(t)}
                  className={`p-2 text-center rounded border text-[10px] font-mono transition-colors ${
                    timeOfDay === t
                      ? 'border-[#A95239] bg-[#A95239] text-[#F4EFE6] font-bold'
                      : 'border-[#DED5C8]/10 bg-[#24231F]/40 text-[#6D6961] hover:border-[#DED5C8]/30'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Action Button */}
          <div className="flex items-end">
            <VaynButton
              variant="primary"
              size="md"
              className="w-full"
              onClick={handleFetchRecommendation}
              disabled={loading}
              leftIcon={loading ? <LoadingSpinner size="sm" /> : <Compass className="h-4 w-4" />}
            >
              {loading ? 'Synthesizing Climate...' : 'Curate Recommendation'}
            </VaynButton>
          </div>
        </div>
      </VaynCard>

      {/* CURATED RECOMMENDATION SHOWCASE */}
      {recommendation && (
        <div className="space-y-6 pt-2">
          {/* Weather Badge & Title Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#DED5C8]/10 pb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#A95239]">
                  {recommendation.weather.city} • {recommendation.weather.temperatureC}°C {recommendation.weather.condition}
                </span>
                {recommendation.weather.isDevelopmentAdapter && (
                  <span className="text-[9px] font-mono px-2 py-0.5 bg-[#A95239]/15 text-[#E9E1D6] border border-[#A95239]/30 rounded">
                    Development Weather Mode
                  </span>
                )}
              </div>
              <h2 className="font-serif text-2xl md:text-3xl text-[#F4EFE6]">{recommendation.title}</h2>
              <p className="text-xs text-[#6D6961] mt-1">{recommendation.weather.description}</p>
            </div>

            <VaynButton
              variant="secondary"
              size="sm"
              onClick={handleSaveAsLook}
              disabled={savingLook || isSaved}
              leftIcon={<Bookmark className={`h-4 w-4 ${isSaved ? 'fill-[#A95239] text-[#A95239]' : ''}`} />}
            >
              {isSaved ? 'Archived to My Looks' : savingLook ? 'Archiving...' : 'Save as Signature Look'}
            </VaynButton>
          </div>

          {/* Garment Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {recommendation.selectedItems.map((item) => (
              <div
                key={item.id}
                className="bg-[#24231F]/60 border border-[#DED5C8]/15 rounded overflow-hidden flex flex-col justify-between hover:border-[#A95239]/40 transition-colors"
              >
                <div className="relative aspect-[3/4] bg-black">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                  <span className="absolute top-1.5 left-1.5 text-[8px] font-mono tracking-widest uppercase px-1.5 py-0.5 bg-black/80 text-[#A95239] rounded">
                    {item.category.replace(/_/g, ' ')}
                  </span>
                </div>
                <div className="p-2.5 space-y-1">
                  <h4 className="text-xs font-medium text-[#F4EFE6] truncate">{item.name}</h4>
                  <div className="flex items-center gap-1.5 text-[10px] text-[#6D6961] font-mono">
                    <span
                      className="h-1.5 w-1.5 rounded-full"
                      style={{ backgroundColor: item.colorHex || '#6D6961' }}
                    />
                    <span>{item.dominantColor}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Details & Rationale Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <VaynCard variant="bordered" padding="md">
              <span className="text-[10px] font-mono uppercase text-[#A95239] block mb-1 font-semibold">
                Meteorological Rationale
              </span>
              <p className="text-xs text-[#E9E1D6] leading-relaxed">{recommendation.stylingReason}</p>
            </VaynCard>

            <VaynCard variant="bordered" padding="md">
              <span className="text-[10px] font-mono uppercase text-[#A95239] block mb-1 font-semibold">
                Footwear Calibration
              </span>
              <p className="text-xs text-[#E9E1D6] leading-relaxed">{recommendation.footwearSuggestion}</p>
            </VaynCard>

            <VaynCard variant="bordered" padding="md">
              <span className="text-[10px] font-mono uppercase text-[#A95239] block mb-1 font-semibold">
                Accessories & Accents
              </span>
              <p className="text-xs text-[#E9E1D6] leading-relaxed">{recommendation.accessoriesSuggestion}</p>
            </VaynCard>
          </div>
        </div>
      )}
    </div>
  );
}

'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Compass,
  MessageSquare,
  ArrowRight,
  MapPin,
  Sparkles,
} from 'lucide-react';
import { VestraButton } from '@/components/ui/vestra-button';

interface CityWeatherSimulation {
  city: string;
  country: string;
  temp: number;
  condition: string;
  time: string;
  recommendationTitle: string;
  rationale: string;
  layers: string[];
  footwear: string;
}

const cityPresets: CityWeatherSimulation[] = [
  {
    city: 'Paris',
    country: 'France',
    temp: 17,
    condition: 'Overcast & Mild Breeze',
    time: '14:30 CET',
    recommendationTitle: 'Double-Breasted Wool Trench & Silk Scarf',
    rationale:
      'Moderate 17°C with brisk Parisian cross-winds requires a wind-resistant wool outer layer over breathable cotton knitwear.',
    layers: ['Camel Wool Belted Trench', 'Merino Mock-Neck Sweater', 'Tailored Pleated Trousers'],
    footwear: 'Polished Calfskin Chelsea Boots',
  },
  {
    city: 'Tokyo',
    country: 'Japan',
    temp: 21,
    condition: 'Clear Autumn Light',
    time: '21:15 JST',
    recommendationTitle: 'Structured Oversized Blazer & Wide Denim',
    rationale:
      'Evening drop to 21°C calls for structured silhouette balance — combining raw denim weight with a relaxed unstructured tailored jacket.',
    layers: ['Oversized Charcoal Flannel Blazer', 'Heavyweight White Tee (280gsm)', 'Selvedge Wide Denim'],
    footwear: 'Minimalist Leather Derbies',
  },
  {
    city: 'New York',
    country: 'USA',
    temp: 13,
    condition: 'Crisp Fall Air & Light Rain',
    time: '09:00 EST',
    recommendationTitle: 'Cashmere Overcoat & Technical Water-Repellent Layer',
    rationale:
      'Chilly 13°C morning with light precipitation demands dual-function insulation: water-repellent shell with soft cashmere interior.',
    layers: ['Heavy Cashmere Chesterfield Coat', 'Zipped Wool Cardigan', 'Flannel Wool Slacks'],
    footwear: 'Water-Resistant Commando-Sole Boots',
  },
  {
    city: 'Milan',
    country: 'Italy',
    temp: 24,
    condition: 'Golden Afternoon Sun',
    time: '16:00 CET',
    recommendationTitle: 'Lightweight Unstructured Linen-Silk Suit',
    rationale:
      'Warm 24°C Mediterranean sun calls for maximum breathability without compromising sartorial decorum.',
    layers: ['Unlined Linen-Silk Jacket', 'Open-Collar Camp Shirt', 'Matching Linen Trousers'],
    footwear: 'Woven Suede Loafers',
  },
];

export function AIStylistSection() {
  const [selectedCity, setSelectedCity] = React.useState<string>('Paris');

  const activeSimulation =
    cityPresets.find((c) => c.city === selectedCity) || cityPresets[0];

  return (
    <section
      id="stylist"
      className="py-24 sm:py-32 px-6 md:px-12 lg:px-16 bg-[var(--vestra-bg)] text-[var(--vestra-text)] border-b border-[var(--vestra-border-soft)] relative overflow-hidden transition-colors duration-200"
    >
      {/* Subtle Background Glow */}
      <div className="absolute top-0 right-1/4 w-[450px] h-[450px] rounded-full bg-[var(--vestra-accent)]/10 blur-[130px] pointer-events-none" />

      <div className="max-w-7xl mx-auto w-full relative z-10">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 md:mb-20 gap-6">
          <div className="max-w-2xl">
            <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[var(--vestra-action)] font-bold block mb-2">
              CONTEXTUAL REASONING ENGINE
            </span>
            <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl font-normal text-[var(--vestra-text)] tracking-tight leading-[1.05]">
              Meet Your 24/7
              <br />
              <span className="italic font-serif text-[var(--vestra-action)]">AI Personal Stylist.</span>
            </h2>
          </div>

          <p className="text-sm md:text-base text-[var(--vestra-text-body)] max-w-md font-sans leading-relaxed">
            VESTRA does not give generic advice. It calibrates your outfit to real-time meteorological conditions, your calendar dress code, and pieces already verified in your wardrobe.
          </p>
        </div>

        {/* Live Simulation Card (Two Columns) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Column (Cols 1-7): Meteorological City Studio */}
          <div className="lg:col-span-7 bg-[var(--vestra-surface)] border border-[var(--vestra-border-soft)] rounded-sm p-8 sm:p-10 flex flex-col justify-between shadow-2xl">
            <div>
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-[var(--vestra-border-soft)]">
                <div className="flex items-center gap-2">
                  <Compass className="h-4 w-4 text-[var(--vestra-action)]" />
                  <span className="font-mono text-xs uppercase tracking-widest text-[var(--vestra-text)]">
                    LIVE CLIMATE STYLING PREVIEW
                  </span>
                </div>
                <span className="text-[10px] font-mono text-[var(--vestra-accent)] px-2 py-0.5 bg-[var(--vestra-accent)]/10 border border-[var(--vestra-accent)]/20 rounded-sm font-semibold">
                  MAISON v2.6
                </span>
              </div>

              {/* City Selector Pills */}
              <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2 no-scrollbar">
                {cityPresets.map((sim) => {
                  const isSelected = selectedCity === sim.city;
                  return (
                    <button
                      key={sim.city}
                      onClick={() => setSelectedCity(sim.city)}
                      className={`px-3.5 py-2 rounded-sm border font-mono text-xs transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer ${
                        isSelected
                          ? 'bg-[var(--vestra-action)] text-[var(--vestra-action-text)] border-[var(--vestra-action)] font-bold shadow-sm'
                          : 'bg-[var(--vestra-surface-alt)] text-[var(--vestra-text-muted)] border-[var(--vestra-border-soft)] hover:border-[var(--vestra-action)] hover:text-[var(--vestra-text)]'
                      }`}
                    >
                      <MapPin className="h-3 w-3" />
                      <span>{sim.city}</span>
                      <span className="text-[10px] opacity-80">{sim.temp}°C</span>
                    </button>
                  );
                })}
              </div>

              {/* Animated City Weather Details */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeSimulation.city}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.35 }}
                  className="space-y-6"
                >
                  <div className="flex items-baseline justify-between">
                    <div>
                      <h3 className="font-serif text-3xl sm:text-4xl text-[var(--vestra-text)] font-normal">
                        {activeSimulation.city}, {activeSimulation.country}
                      </h3>
                      <p className="text-xs font-mono text-[var(--vestra-text-muted)] mt-1">
                        {activeSimulation.time} • {activeSimulation.condition}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="font-serif text-4xl text-[var(--vestra-action)]">
                        {activeSimulation.temp}°C
                      </span>
                    </div>
                  </div>

                  <div className="p-4 bg-[var(--vestra-surface-alt)] border border-[var(--vestra-border-soft)] rounded-sm">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--vestra-action)] font-bold block mb-1">
                      CURATED OUTFIT PROPOSAL
                    </span>
                    <h4 className="font-serif text-lg text-[var(--vestra-text)] font-medium mb-2">
                      {activeSimulation.recommendationTitle}
                    </h4>
                    <p className="text-xs text-[var(--vestra-text-body)] leading-relaxed font-sans">
                      {activeSimulation.rationale}
                    </p>
                  </div>

                  {/* Layers List */}
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--vestra-text-muted)] block mb-2">
                      CALIBRATED GARMENT ARCHITECTURE
                    </span>
                    <div className="space-y-2">
                      {activeSimulation.layers.map((layer, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-3 text-xs text-[var(--vestra-text)] bg-[var(--vestra-surface-alt)] p-2.5 rounded-sm border border-[var(--vestra-border-soft)]"
                        >
                          <span className="h-5 w-5 rounded-full bg-[var(--vestra-action)]/15 text-[var(--vestra-action)] flex items-center justify-center font-mono text-[10px] font-bold">
                            {i + 1}
                          </span>
                          <span className="flex-1 truncate">{layer}</span>
                          <span className="text-[10px] font-mono text-[var(--vestra-accent)] font-semibold">IN VAULT</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="pt-8 mt-8 border-t border-[var(--vestra-border-soft)] flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-[11px] font-mono text-[var(--vestra-text-muted)]">
                METEOROLOGICAL MODEL: OPEN-METEO SYNC
              </span>
              <Link href="/styling">
                <VestraButton
                  variant="primary"
                  size="md"
                  rightIcon={<ArrowRight className="h-4 w-4" />}
                >
                  Try Location Styling
                </VestraButton>
              </Link>
            </div>
          </div>

          {/* Right Column (Cols 8-12): Conversational AI Stylist Chat Mockup */}
          <div className="lg:col-span-5 bg-[var(--vestra-surface)] border border-[var(--vestra-border-soft)] rounded-sm p-8 flex flex-col justify-between shadow-2xl">
            <div>
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-[var(--vestra-border-soft)]">
                <div className="flex items-center gap-2 text-[var(--vestra-action)]">
                  <MessageSquare className="h-4 w-4" />
                  <span className="font-mono text-xs uppercase tracking-widest font-semibold">
                    CONSULT VESTRA STYLIST
                  </span>
                </div>
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>

              {/* Chat Thread Demonstration */}
              <div className="space-y-4">
                {/* User Message */}
                <div className="flex justify-end">
                  <div className="max-w-[85%] bg-[var(--vestra-action)] text-[var(--vestra-action-text)] p-3.5 rounded-sm rounded-tr-none text-xs leading-relaxed font-sans shadow-md">
                    What should I wear with my dark pleated wool trousers for an evening dinner in Paris tonight?
                  </div>
                </div>

                {/* AI Stylist Response */}
                <div className="flex justify-start">
                  <div className="max-w-[90%] bg-[var(--vestra-surface-alt)] border border-[var(--vestra-border-soft)] text-[var(--vestra-text-body)] p-4 rounded-sm rounded-tl-none text-xs leading-relaxed font-sans shadow-md space-y-3">
                    <div className="flex items-center gap-2 text-[10px] font-mono text-[var(--vestra-action)] font-bold">
                      <Sparkles className="h-3 w-3" />
                      <span>VESTRA STYLIST ADVICE</span>
                    </div>

                    <p>
                      Pair them with your <strong className="text-[var(--vestra-text)]">Fine Merino Mock-Neck</strong> in oatmeal sand. It softens the formal line of the pleats while keeping the silhouette elevated and structured.
                    </p>

                    <div className="p-2.5 bg-[var(--vestra-surface)] border border-[var(--vestra-border-soft)] rounded-sm text-[11px] space-y-1">
                      <p className="text-[var(--vestra-text)] font-medium">Styling Rule Applied:</p>
                      <p className="text-[var(--vestra-text-muted)]">
                        High-contrast texture pairing: Crisp wool pleats + brushed soft knit.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-[var(--vestra-border-soft)]">
              <Link href="/chat">
                <VestraButton
                  variant="secondary"
                  size="md"
                  className="w-full"
                  rightIcon={<ArrowRight className="h-4 w-4" />}
                >
                  Start Private Consultation
                </VestraButton>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

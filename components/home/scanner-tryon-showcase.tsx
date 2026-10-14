'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Camera, Sparkles, ArrowRight } from 'lucide-react';
import { VestraButton } from '@/components/ui/vestra-button';

interface ScoreFactor {
  label: string;
  weight: string;
  score: number;
}

const scoringFactors: ScoreFactor[] = [
  { label: 'Fit & Proportion', weight: '25%', score: 96 },
  { label: 'Colour Harmony', weight: '20%', score: 98 },
  { label: 'Coordination', weight: '20%', score: 95 },
  { label: 'Occasion Suitability', weight: '15%', score: 94 },
  { label: 'Accessories Balance', weight: '10%', score: 92 },
  { label: 'Style Coherence', weight: '10%', score: 97 },
];

export function ScannerTryOnShowcase() {
  const [tryOnView, setTryOnView] = React.useState<'reference' | 'composite'>('composite');

  return (
    <section
      id="tryon"
      className="py-24 sm:py-32 px-6 md:px-12 lg:px-16 bg-[var(--vestra-bg-alt)] text-[var(--vestra-text)] border-b border-[var(--vestra-border-soft)] transition-colors duration-200"
    >
      <div className="max-w-7xl mx-auto w-full">
        {/* Section Header */}
        <div className="max-w-3xl mb-16 md:mb-20">
          <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[var(--vestra-action)] font-bold block mb-2">
            MULTIMODAL VISION & NEURAL DIFFUSION
          </span>
          <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl font-normal text-[var(--vestra-text)] tracking-tight leading-[1.05]">
            Scan Your Look.
            <br />
            <span className="italic font-serif text-[var(--vestra-action)]">Simulate the Fit.</span>
          </h2>
          <p className="mt-4 text-sm md:text-base text-[var(--vestra-text-body)] max-w-xl font-sans leading-relaxed">
            Eliminate guesswork before stepping out. Use computer vision for objective outfit critique, or visualize new garments draped onto your reference silhouette.
          </p>
        </div>

        {/* Dual Wing Showcase Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-stretch">
          {/* Wing A (Cols 1-6): The VESTRA Outfit Scanner */}
          <div className="lg:col-span-6 bg-[var(--vestra-surface)] border border-[var(--vestra-border-soft)] rounded-sm p-8 sm:p-10 flex flex-col justify-between shadow-2xl">
            <div>
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-[var(--vestra-border-soft)]">
                <div className="flex items-center gap-2 text-[var(--vestra-action)]">
                  <Camera className="h-4 w-4" />
                  <span className="font-mono text-xs uppercase tracking-widest font-semibold">
                    THE VESTRA OUTFIT SCANNER
                  </span>
                </div>
                <span className="text-[10px] font-mono text-[var(--vestra-text-muted)] px-2 py-0.5 bg-[var(--vestra-surface-alt)] rounded-sm border border-[var(--vestra-border-soft)] font-semibold">
                  WEIGHTED 6-FACTOR AI
                </span>
              </div>

              {/* Overall Score Badge Ring */}
              <div className="flex items-center gap-6 mb-8 p-5 bg-[var(--vestra-surface-alt)] border border-[var(--vestra-border-soft)] rounded-sm">
                <div className="relative h-20 w-20 flex items-center justify-center shrink-0">
                  <svg className="h-full w-full -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-[var(--vestra-border-soft)]"
                      strokeWidth="3"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="text-[var(--vestra-action)]"
                      strokeDasharray="96, 100"
                      strokeWidth="3.2"
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <div className="absolute text-center">
                    <span className="font-serif text-xl font-bold text-[var(--vestra-text)]">96</span>
                    <span className="text-[9px] font-mono text-[var(--vestra-text-muted)] block -mt-1">/100</span>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--vestra-accent)] font-semibold block">
                    HARMONY RATING: EXCEPTIONAL
                  </span>
                  <h4 className="font-serif text-base text-[var(--vestra-text)] font-medium mt-0.5">
                    Tailored Quiet Luxury Ensemble
                  </h4>
                  <p className="text-xs text-[var(--vestra-text-muted)] mt-1 leading-relaxed">
                    Balanced proportions with clean break trousers and tonal color coherence.
                  </p>
                </div>
              </div>

              {/* 6-Factor Horizontal Bars */}
              <div className="space-y-3 mb-8">
                {scoringFactors.map((factor) => (
                  <div key={factor.label} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[var(--vestra-text-body)]">
                        {factor.label}{' '}
                        <span className="text-[10px] text-[var(--vestra-text-muted)] font-mono">({factor.weight})</span>
                      </span>
                      <span className="font-mono text-xs text-[var(--vestra-action)] font-medium">
                        {factor.score}%
                      </span>
                    </div>
                    <div className="h-1.5 w-full bg-[var(--vestra-surface-alt)] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[var(--vestra-action)] rounded-full"
                        style={{ width: `${factor.score}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-[var(--vestra-border-soft)] flex items-center justify-between">
              <span className="text-[11px] font-mono text-[var(--vestra-text-muted)]">
                LIVE CAMERA & FILE UPLOAD
              </span>
              <Link href="/scan">
                <VestraButton
                  variant="primary"
                  size="md"
                  leftIcon={<Camera className="h-4 w-4" />}
                >
                  Scan An Outfit
                </VestraButton>
              </Link>
            </div>
          </div>

          {/* Wing B (Cols 7-12): Virtual Try-On Studio */}
          <div className="lg:col-span-6 bg-[var(--vestra-surface)] border border-[var(--vestra-border-soft)] rounded-sm p-8 sm:p-10 flex flex-col justify-between shadow-2xl">
            <div>
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-[var(--vestra-border-soft)]">
                <div className="flex items-center gap-2 text-[var(--vestra-action)]">
                  <Sparkles className="h-4 w-4" />
                  <span className="font-mono text-xs uppercase tracking-widest font-semibold">
                    NEURAL VIRTUAL TRY-ON STUDIO
                  </span>
                </div>

                {/* View Toggle */}
                <div className="flex items-center p-0.5 bg-[var(--vestra-surface-alt)] border border-[var(--vestra-border-soft)] rounded-sm text-[10px] font-mono">
                  <button
                    onClick={() => setTryOnView('reference')}
                    className={`px-2.5 py-1 rounded-sm transition-colors cursor-pointer ${
                      tryOnView === 'reference'
                        ? 'bg-[var(--vestra-action)] text-[var(--vestra-action-text)] font-bold'
                        : 'text-[var(--vestra-text-muted)] hover:text-[var(--vestra-text)]'
                    }`}
                  >
                    SILHOUETTE
                  </button>
                  <button
                    onClick={() => setTryOnView('composite')}
                    className={`px-2.5 py-1 rounded-sm transition-colors cursor-pointer ${
                      tryOnView === 'composite'
                        ? 'bg-[var(--vestra-action)] text-[var(--vestra-action-text)] font-bold'
                        : 'text-[var(--vestra-text-muted)] hover:text-[var(--vestra-text)]'
                    }`}
                  >
                    SYNTHESIS
                  </button>
                </div>
              </div>

              {/* Try-On Interactive Image Preview */}
              <div className="relative aspect-[4/5] max-w-sm mx-auto rounded-sm overflow-hidden border border-[var(--vestra-border-soft)] bg-[var(--vestra-surface-alt)] shadow-xl mb-6">
                <Image
                  src={
                    tryOnView === 'reference'
                      ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=700&auto=format&fit=crop&q=80'
                      : 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=700&auto=format&fit=crop&q=80'
                  }
                  alt="Virtual Try-On Simulation"
                  fill
                  sizes="400px"
                  className="object-cover object-center transition-all duration-500"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-white">
                  <div>
                    <span className="text-[9px] font-mono uppercase tracking-widest text-[#EDEAE3] font-bold block">
                      {tryOnView === 'reference' ? 'BASE PORTRAIT' : 'SYNTHESIZED LOOK'}
                    </span>
                    <p className="font-serif text-sm font-medium">
                      {tryOnView === 'reference'
                        ? 'Anchor Silhouette Calibration'
                        : 'Double-Breasted Coat & Tonal Layers'}
                    </p>
                  </div>
                  <span className="text-[9px] font-mono px-2 py-0.5 bg-black/60 border border-white/20 text-[#EDEAE3] rounded-sm">
                    VTON DIFFUSION
                  </span>
                </div>
              </div>

              <p className="text-xs text-[var(--vestra-text-muted)] text-center max-w-sm mx-auto leading-relaxed">
                Photorealistic neural drape simulation maps your cataloged pieces directly onto shoulder width, torso verticality, and stance parameters.
              </p>
            </div>

            <div className="pt-6 mt-6 border-t border-[var(--vestra-border-soft)] flex items-center justify-between">
              <span className="text-[11px] font-mono text-[var(--vestra-text-muted)]">
                MAX 4 PIECES PER PASS
              </span>
              <Link href="/try-on">
                <VestraButton
                  variant="secondary"
                  size="md"
                  rightIcon={<ArrowRight className="h-4 w-4" />}
                >
                  Launch Try-On Studio
                </VestraButton>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

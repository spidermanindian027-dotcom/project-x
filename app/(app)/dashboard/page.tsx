'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  CloudSun,
  Layers,
  Sparkles,
  ShoppingBag,
  ArrowRight,
  Plus,
} from 'lucide-react';
import { SectionHeader } from '@/components/ui/section-header';
import { VestraCard } from '@/components/ui/vestra-card';
import { VestraButton } from '@/components/ui/vestra-button';
import { BadgeStatus } from '@/components/ui/badge-status';
import { EmptyState } from '@/components/ui/empty-state';

export default function DashboardPage() {
  const [userName, setUserName] = React.useState('Elena');

  React.useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.user?.fullName) {
          setUserName(data.user.fullName);
        }
      })
      .catch(() => {});
  }, []);

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className="space-y-10 pb-12">
      {/* 1. Welcome Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-[#9ca3af]/15 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#e8c547]">
              Daily Briefing
            </span>
            <span className="text-[#9ca3af]/40">•</span>
            <span className="text-xs text-[#9ca3af] font-mono">{currentDate}</span>
          </div>
          <h1 className="font-serif text-3xl md:text-4xl text-[#f5f0e8] font-normal tracking-tight">
            Good morning, {userName}.
          </h1>
        </div>

        {/* Weather Indicator (TODO) */}
        <div className="flex items-center gap-3 px-3.5 py-2 bg-[#262626] border border-[#9ca3af]/20 rounded-sm self-start md:self-auto">
          <CloudSun className="h-4 w-4 text-[#e8c547]" />
          <div className="flex flex-col text-left">
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#f5f0e8] font-medium">Paris • 18°C</span>
              <BadgeStatus status="coming-soon" className="text-[8px] py-0 px-1">TODO</BadgeStatus>
            </div>
            <span className="text-[10px] text-[#9ca3af]">Overcast, mild breeze</span>
          </div>
        </div>
      </div>

      {/* 2. Today's Outfit Suggestion - Large Card */}
      <div className="space-y-4">
        <SectionHeader
          title="Today's Curated Look"
          subtitle="Generated dynamically based on your Parisian weather index and scheduled creative meetings."
          tag="Editorial Select"
        />

        <VestraCard variant="bordered" padding="none" className="overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
            {/* Visual Image Placeholder Area */}
            <div className="lg:col-span-5 bg-[#171717] min-h-[300px] lg:min-h-[360px] relative flex flex-col items-center justify-center border-b lg:border-b-0 lg:border-r border-[#9ca3af]/15 p-8 text-center">
              <div className="w-full max-w-xs h-64 bg-[#262626] border border-[#9ca3af]/20 flex flex-col items-center justify-center p-6 relative">
                <div className="absolute top-3 left-3">
                  <BadgeStatus status="beta" className="text-[9px]">AI GENERATED</BadgeStatus>
                </div>
                <div className="h-16 w-16 rounded-full bg-[#1a1a1a] border border-[#e8c547]/30 flex items-center justify-center text-[#e8c547] mb-3">
                  <Sparkles className="h-7 w-7" />
                </div>
                <p className="font-serif text-sm text-[#f5f0e8] text-center">
                  Monochrome Drape Silhouette
                </p>
                <p className="text-[10px] text-[#9ca3af] mt-1 text-center">
                  Silk Crepe Blouse + Wool Pleated Trousers
                </p>
              </div>
            </div>

            {/* AI Rationale & Action Details */}
            <div className="lg:col-span-7 p-6 md:p-8 flex flex-col justify-between space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs uppercase font-mono tracking-widest text-[#e8c547]">
                    Look 041 // Minimal Architect
                  </span>
                  <span className="text-xs font-mono text-[#9ca3af]">Score: 98.4%</span>
                </div>
                <h3 className="font-serif text-2xl font-normal text-[#f5f0e8] mb-3">
                  The Structured Charcoal & Cashmere Ensemble
                </h3>
                <p className="text-xs md:text-sm text-[#d4cfc7] leading-relaxed mb-4">
                  “This composition balances soft architectural draping with sharp lapels. 
                  Given the 18°C temperature and morning drizzle, high-twist virgin wool keeps moisture out while the brushed charcoal silk scarf adds quiet chromatic refinement.”
                </p>

                <div className="flex flex-wrap gap-2 pt-2">
                  <span className="text-[10px] uppercase font-mono px-2.5 py-1 bg-[#1a1a1a] border border-[#9ca3af]/20 text-[#9ca3af]">
                    Virgin Wool Blazer
                  </span>
                  <span className="text-[10px] uppercase font-mono px-2.5 py-1 bg-[#1a1a1a] border border-[#9ca3af]/20 text-[#9ca3af]">
                    Ivory Silk Shell
                  </span>
                  <span className="text-[10px] uppercase font-mono px-2.5 py-1 bg-[#1a1a1a] border border-[#9ca3af]/20 text-[#9ca3af]">
                    Derby Leather Oxfords
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-[#9ca3af]/15">
                <VestraButton
                  variant="primary"
                  size="sm"
                  rightIcon={<ArrowRight className="h-4 w-4" />}
                  onClick={() => alert('Full outfit view coming in Phase 2!')}
                >
                  View Full Outfit
                </VestraButton>
                {/* TODO Notice */}
                <span className="text-[11px] text-[#9ca3af] italic">
                  * Live garment swap & virtual try-on coming in Phase 2.
                </span>
              </div>
            </div>
          </div>
        </VestraCard>
      </div>

      {/* 3. Quick Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Stat 1 */}
        <VestraCard variant="default" padding="sm" className="relative group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-[#9ca3af]">
              Wardrobe Items
            </span>
            <ShoppingBag className="h-4 w-4 text-[#e8c547]" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-serif text-3xl text-[#f5f0e8]">0</span>
            <span className="text-[10px] text-[#9ca3af]">Cataloged pieces</span>
          </div>
          <div className="mt-2 flex items-center justify-between pt-2 border-t border-[#9ca3af]/10">
            <span className="text-[10px] text-[#9ca3af]">Vault sync ready</span>
            <BadgeStatus status="coming-soon" className="text-[8px] py-0 px-1">TODO</BadgeStatus>
          </div>
        </VestraCard>

        {/* Stat 2 */}
        <VestraCard variant="default" padding="sm" className="relative group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-[#9ca3af]">
              Outfits Created
            </span>
            <Layers className="h-4 w-4 text-[#e8c547]" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-serif text-3xl text-[#f5f0e8]">0</span>
            <span className="text-[10px] text-[#9ca3af]">Curated lookbooks</span>
          </div>
          <div className="mt-2 flex items-center justify-between pt-2 border-t border-[#9ca3af]/10">
            <span className="text-[10px] text-[#9ca3af]">Algorithm primed</span>
            <BadgeStatus status="coming-soon" className="text-[8px] py-0 px-1">TODO</BadgeStatus>
          </div>
        </VestraCard>

        {/* Stat 3 */}
        <VestraCard variant="default" padding="sm" className="relative group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-[#9ca3af]">
              Style Score
            </span>
            <Sparkles className="h-4 w-4 text-[#e8c547]" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-serif text-3xl text-[#f5f0e8]">--</span>
            <span className="text-[10px] text-[#9ca3af]">Harmony Index</span>
          </div>
          <div className="mt-2 flex items-center justify-between pt-2 border-t border-[#9ca3af]/10">
            <span className="text-[10px] text-[#9ca3af]">Awaiting onboarding data</span>
            <BadgeStatus status="coming-soon" className="text-[8px] py-0 px-1">TODO</BadgeStatus>
          </div>
        </VestraCard>
      </div>

      {/* 4. Recent Outfits - Horizontal Scroll / Empty State */}
      <div className="space-y-4">
        <SectionHeader
          title="Recent Outfits"
          subtitle="Your previously accepted combinations and tailored look archives."
          action={
            <Link href="/onboarding">
              <VestraButton variant="secondary" size="sm" leftIcon={<Plus className="h-3 w-3" />}>
                Curate New Look
              </VestraButton>
            </Link>
          }
        />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <EmptyState
            icon={<Layers className="h-6 w-6" />}
            title="No Outfits Logged Yet"
            description="Complete your wardrobe ingestion or run the AI stylist to generate your first seasonal capsules."
            action={
              <Link href="/onboarding">
                <VestraButton variant="secondary" size="sm">
                  Run Style AI (TODO)
                </VestraButton>
              </Link>
            }
            className="sm:col-span-3 py-12"
          />
        </div>
      </div>

      {/* 5. Trending Now - 2-Column Grid */}
      <div className="space-y-4">
        <SectionHeader
          title="Trending Now"
          subtitle="Current directional movements extracted from Milan & Paris SS26 collections."
          tag="Runway Intelligence"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Trend 1 */}
          <VestraCard variant="bordered" padding="md" className="space-y-4">
            <div className="flex items-center justify-between border-b border-[#9ca3af]/15 pb-3">
              <span className="text-[11px] font-mono text-[#e8c547]">TREND SIGNAL // 01</span>
              <BadgeStatus status="coming-soon">Phase 2 Feed</BadgeStatus>
            </div>
            <div>
              <h4 className="font-serif text-lg text-[#f5f0e8] mb-1.5">
                The Oversized Deconstructed Trench
              </h4>
              <p className="text-xs text-[#9ca3af] leading-relaxed">
                Raw-edge bonded cotton twill with dramatic storm flaps and dropped epaulettes. Trending +42% in editorial streetwear.
              </p>
            </div>
            <div className="h-28 bg-[#171717] border border-[#9ca3af]/15 flex items-center justify-center text-xs text-[#9ca3af]">
              <span>[ Runway Moodboard Visualization Placeholder ]</span>
            </div>
          </VestraCard>

          {/* Trend 2 */}
          <VestraCard variant="bordered" padding="md" className="space-y-4">
            <div className="flex items-center justify-between border-b border-[#9ca3af]/15 pb-3">
              <span className="text-[11px] font-mono text-[#e8c547]">TREND SIGNAL // 02</span>
              <BadgeStatus status="coming-soon">Phase 2 Feed</BadgeStatus>
            </div>
            <div>
              <h4 className="font-serif text-lg text-[#f5f0e8] mb-1.5">
                Muted Sage & Raw Silk Textures
              </h4>
              <p className="text-xs text-[#9ca3af] leading-relaxed">
                A shift towards natural slub textiles paired with sharp tailored pleating. Complements autumn capsule palettes.
              </p>
            </div>
            <div className="h-28 bg-[#171717] border border-[#9ca3af]/15 flex items-center justify-center text-xs text-[#9ca3af]">
              <span>[ Fabric Texture Analysis Placeholder ]</span>
            </div>
          </VestraCard>
        </div>
      </div>
    </div>
  );
}

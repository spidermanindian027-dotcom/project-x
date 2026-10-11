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
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-[#DED5C8]/10 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#A95239] font-mono">
              VAYN Daily Briefing
            </span>
            <span className="text-[#6D6961]">•</span>
            <span className="text-xs text-[#6D6961] font-mono">{currentDate}</span>
          </div>
          <h1 className="font-serif text-3xl md:text-4xl text-[#F4EFE6] font-normal tracking-tight">
            Good morning, {userName}.
          </h1>
        </div>

        {/* Weather Indicator */}
        <div className="flex items-center gap-3 px-3.5 py-2 bg-[#24231F] border border-[#DED5C8]/15 rounded self-start md:self-auto">
          <CloudSun className="h-4 w-4 text-[#A95239]" />
          <div className="flex flex-col text-left">
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#F4EFE6] font-medium">Paris • 18°C</span>
              <span className="text-[9px] uppercase font-mono px-1.5 py-0.2 bg-[#737A60]/20 text-[#737A60] rounded">Active</span>
            </div>
            <span className="text-[10px] text-[#6D6961]">Overcast, mild autumn breeze</span>
          </div>
        </div>
      </div>

      {/* 2. Today's Outfit Suggestion - Large Card */}
      <div className="space-y-4">
        <SectionHeader
          title="Today's Curated Look"
          subtitle="Generated dynamically based on your Parisian weather index and scheduled creative meetings."
          tag="VAYN Atelier Select"
        />

        <VestraCard variant="bordered" padding="none" className="overflow-hidden border-[#DED5C8]/15 bg-[#24231F]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
            {/* Visual Image Area */}
            <div className="lg:col-span-5 bg-[#1C1B18] min-h-[300px] lg:min-h-[360px] relative flex flex-col items-center justify-center border-b lg:border-b-0 lg:border-r border-[#DED5C8]/10 p-8 text-center">
              <div className="w-full max-w-xs h-64 bg-[#24231F] border border-[#DED5C8]/15 rounded flex flex-col items-center justify-center p-6 relative">
                <div className="absolute top-3 left-3">
                  <BadgeStatus status="beta" className="text-[9px]">AI GENERATED</BadgeStatus>
                </div>
                <div className="h-16 w-16 rounded-full bg-[#1C1B18] border border-[#A95239]/40 flex items-center justify-center text-[#A95239] mb-3">
                  <Sparkles className="h-7 w-7" />
                </div>
                <p className="font-serif text-sm text-[#F4EFE6] text-center font-medium">
                  Monochrome Drape Silhouette
                </p>
                <p className="text-[10px] text-[#6D6961] mt-1 text-center font-mono">
                  Silk Crepe Blouse + Wool Pleated Trousers
                </p>
              </div>
            </div>

            {/* AI Rationale & Action Details */}
            <div className="lg:col-span-7 p-6 md:p-8 flex flex-col justify-between space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs uppercase font-mono tracking-widest text-[#A95239]">
                    Look 041 // Minimal Architect
                  </span>
                  <span className="text-xs font-mono text-[#737A60] font-semibold">Harmony: 98.4%</span>
                </div>
                <h3 className="font-serif text-2xl font-normal text-[#F4EFE6] mb-3">
                  The Structured Terracotta & Cashmere Ensemble
                </h3>
                <p className="text-xs md:text-sm text-[#E9E1D6]/80 leading-relaxed mb-4">
                  “This composition balances soft architectural draping with sharp lapels. 
                  Given the 18°C temperature and morning drizzle, high-twist virgin wool keeps moisture out while the brushed terracotta silk scarf adds quiet chromatic refinement.”
                </p>

                <div className="flex flex-wrap gap-2 pt-2">
                  <span className="text-[10px] uppercase font-mono px-2.5 py-1 bg-[#1C1B18] border border-[#DED5C8]/15 text-[#E9E1D6] rounded">
                    Virgin Wool Blazer
                  </span>
                  <span className="text-[10px] uppercase font-mono px-2.5 py-1 bg-[#1C1B18] border border-[#DED5C8]/15 text-[#E9E1D6] rounded">
                    Ivory Silk Shell
                  </span>
                  <span className="text-[10px] uppercase font-mono px-2.5 py-1 bg-[#1C1B18] border border-[#DED5C8]/15 text-[#E9E1D6] rounded">
                    Derby Leather Oxfords
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-[#DED5C8]/10">
                <Link href="/styling">
                  <VestraButton
                    variant="primary"
                    size="sm"
                    rightIcon={<ArrowRight className="h-4 w-4" />}
                  >
                    View Weather Styling
                  </VestraButton>
                </Link>
                <Link href="/try-on">
                  <VestraButton
                    variant="secondary"
                    size="sm"
                    leftIcon={<Sparkles className="h-3.5 w-3.5 text-[#A95239]" />}
                  >
                    Try On Garment
                  </VestraButton>
                </Link>
              </div>
            </div>
          </div>
        </VestraCard>
      </div>

      {/* 3. Quick Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Stat 1 */}
        <Link href="/wardrobe" className="block group">
          <VestraCard variant="default" padding="sm" className="relative group border-[#DED5C8]/15 bg-[#24231F] hover:border-[#A95239]/50 transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wider text-[#6D6961] font-mono">
                Wardrobe Items
              </span>
              <ShoppingBag className="h-4 w-4 text-[#A95239]" />
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="font-serif text-3xl text-[#F4EFE6]">View</span>
              <span className="text-[10px] text-[#6D6961]">Digital Wardrobe</span>
            </div>
            <div className="mt-2 flex items-center justify-between pt-2 border-t border-[#DED5C8]/10">
              <span className="text-[10px] text-[#737A60]">Vault active</span>
              <span className="text-[9px] font-mono text-[#A95239] group-hover:underline">Open →</span>
            </div>
          </VestraCard>
        </Link>

        {/* Stat 2 */}
        <Link href="/outfits" className="block group">
          <VestraCard variant="default" padding="sm" className="relative group border-[#DED5C8]/15 bg-[#24231F] hover:border-[#A95239]/50 transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wider text-[#6D6961] font-mono">
                Outfits Created
              </span>
              <Layers className="h-4 w-4 text-[#A95239]" />
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="font-serif text-3xl text-[#F4EFE6]">Capsules</span>
              <span className="text-[10px] text-[#6D6961]">Lookbook Collections</span>
            </div>
            <div className="mt-2 flex items-center justify-between pt-2 border-t border-[#DED5C8]/10">
              <span className="text-[10px] text-[#737A60]">Generator ready</span>
              <span className="text-[9px] font-mono text-[#A95239] group-hover:underline">Explore →</span>
            </div>
          </VestraCard>
        </Link>

        {/* Stat 3 */}
        <Link href="/scan" className="block group">
          <VestraCard variant="default" padding="sm" className="relative group border-[#DED5C8]/15 bg-[#24231F] hover:border-[#A95239]/50 transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wider text-[#6D6961] font-mono">
                Style Score
              </span>
              <Sparkles className="h-4 w-4 text-[#A95239]" />
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="font-serif text-3xl text-[#A95239]">Scan</span>
              <span className="text-[10px] text-[#6D6961]">Multimodal Vision AI</span>
            </div>
            <div className="mt-2 flex items-center justify-between pt-2 border-t border-[#DED5C8]/10">
              <span className="text-[10px] text-[#737A60]">Camera & Upload ready</span>
              <span className="text-[9px] font-mono text-[#A95239] group-hover:underline">Start →</span>
            </div>
          </VestraCard>
        </Link>
      </div>

      {/* 4. Recent Outfits - Horizontal Scroll / Empty State */}
      <div className="space-y-4">
        <SectionHeader
          title="Recent Outfits"
          subtitle="Your saved combinations and algorithmic look archives."
          action={
            <Link href="/outfits">
              <VestraButton variant="secondary" size="sm" leftIcon={<Plus className="h-3 w-3" />}>
                Curate New Look
              </VestraButton>
            </Link>
          }
        />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <EmptyState
            icon={<Layers className="h-6 w-6 text-[#A95239]" />}
            title="Curate Your Signature Capsule"
            description="Use the VAYN Stylist chat or Outfit Scanner to assemble your personalized wardrobe combinations."
            action={
              <Link href="/chat">
                <VestraButton variant="primary" size="sm">
                  Ask VAYN Stylist
                </VestraButton>
              </Link>
            }
            className="sm:col-span-3 py-12 border-[#DED5C8]/15 bg-[#24231F]"
          />
        </div>
      </div>

      {/* 5. Trending Now - 2-Column Grid */}
      <div className="space-y-4">
        <SectionHeader
          title="Trending Now"
          subtitle="Current directional movements extracted from Milan & Paris seasonal archives."
          tag="VAYN Trend Feed"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Trend 1 */}
          <VestraCard variant="bordered" padding="md" className="space-y-4 border-[#DED5C8]/15 bg-[#24231F]">
            <div className="flex items-center justify-between border-b border-[#DED5C8]/10 pb-3">
              <span className="text-[11px] font-mono text-[#A95239]">TREND SIGNAL // 01</span>
              <span className="text-[9px] uppercase font-mono px-2 py-0.5 bg-[#737A60]/10 border border-[#737A60]/30 text-[#737A60] rounded">
                Editorial High
              </span>
            </div>
            <div>
              <h4 className="font-serif text-lg text-[#F4EFE6] mb-1.5">
                The Oversized Deconstructed Trench
              </h4>
              <p className="text-xs text-[#6D6961] leading-relaxed">
                Raw-edge bonded cotton twill with dramatic storm flaps and dropped epaulettes. Trending +42% in editorial streetwear.
              </p>
            </div>
            <div className="h-28 bg-[#1C1B18] border border-[#DED5C8]/10 rounded flex items-center justify-center text-xs text-[#6D6961] font-mono">
              <span>[ Runway Moodboard Visualization ]</span>
            </div>
          </VestraCard>

          {/* Trend 2 */}
          <VestraCard variant="bordered" padding="md" className="space-y-4 border-[#DED5C8]/15 bg-[#24231F]">
            <div className="flex items-center justify-between border-b border-[#DED5C8]/10 pb-3">
              <span className="text-[11px] font-mono text-[#A95239]">TREND SIGNAL // 02</span>
              <span className="text-[9px] uppercase font-mono px-2 py-0.5 bg-[#737A60]/10 border border-[#737A60]/30 text-[#737A60] rounded">
                Capsule Core
              </span>
            </div>
            <div>
              <h4 className="font-serif text-lg text-[#F4EFE6] mb-1.5">
                Muted Sage & Raw Terracotta Silks
              </h4>
              <p className="text-xs text-[#6D6961] leading-relaxed">
                A shift towards natural slub textiles paired with sharp tailored pleating. Complements autumn capsule palettes.
              </p>
            </div>
            <div className="h-28 bg-[#1C1B18] border border-[#DED5C8]/10 rounded flex items-center justify-center text-xs text-[#6D6961] font-mono">
              <span>[ Fabric Texture Analysis ]</span>
            </div>
          </VestraCard>
        </div>
      </div>
    </div>
  );
}

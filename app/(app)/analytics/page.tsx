'use client';

import * as React from 'react';
import {
  TrendingUp,
  BarChart3,
  Shirt,
  Camera,
} from 'lucide-react';
import { VaynButton } from '@/components/ui/vestra-button';
import { VaynCard } from '@/components/ui/vestra-card';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import Link from 'next/link';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';

interface AnalyticsData {
  hasData: boolean;
  scoreHistory: { date: string; score: number; label: string }[];
  averageScore: number | null;
  totalLooks: number;
  favoriteLooksCount: number;
  wardrobeCount: number;
  mostUsedColors: { color: string; count: number }[];
  categoryDistribution: { category: string; count: number }[];
  mostUsedItems: { id: string; name: string; imageUrl: string; useCount: number }[];
}

const VAYN_PALETTE = ['#A95239', '#737A60', '#E9E1D6', '#DED5C8', '#6D6961', '#24231F'];

export default function AnalyticsPage() {
  const [data, setData] = React.useState<AnalyticsData | null>(null);
  const [loading, setLoading] = React.useState<boolean>(true);

  React.useEffect(() => {
    let active = true;
    async function loadAnalytics() {
      try {
        const res = await fetch('/api/analytics');
        if (!active) return;
        if (res.ok) {
          const json = await res.json();
          setData(json.analytics);
        }
      } catch {
        // silent
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }
    loadAnalytics();
    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center space-y-4">
        <LoadingSpinner size="lg" />
        <span className="text-xs text-[#6D6961] font-mono">Synthesizing VAYN Personal Analytics...</span>
      </div>
    );
  }

  const hasData = data?.hasData ?? false;

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 space-y-8">
      {/* Editorial Header */}
      <div className="border-b border-[#DED5C8]/10 pb-6">
        <span className="text-[10px] font-semibold tracking-[0.25em] text-[#A95239] uppercase block mb-1 font-mono">
          VAYN Sartorial Analytics
        </span>
        <h1 className="font-serif text-3xl md:text-4xl font-normal text-[#F4EFE6] tracking-tight">
          Style & Wardrobe Intelligence
        </h1>
        <p className="text-xs md:text-sm text-[#6D6961] mt-1 max-w-2xl">
          Empirical breakdown of your rotation cadence, aesthetic harmony trajectories, and chromatic balance indices.
        </p>
      </div>

      {!hasData ? (
        /* Empty State */
        <VaynCard variant="bordered" padding="lg" className="text-center py-16 space-y-6">
          <div className="h-14 w-14 rounded-full bg-[#24231F] border border-[#A95239]/30 flex items-center justify-center mx-auto text-[#A95239]">
            <BarChart3 className="h-7 w-7" />
          </div>
          <div className="space-y-1.5 max-w-md mx-auto">
            <h2 className="font-serif text-2xl text-[#F4EFE6]">No Style Data Recorded Yet</h2>
            <p className="text-xs text-[#6D6961] leading-relaxed">
              Your analytics dashboard populates as you scan outfits with the VAYN Scanner, catalog garments in your Wardrobe Vault, and curate looks.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link href="/scan">
              <VaynButton variant="primary" size="md" leftIcon={<Camera className="h-4 w-4" />}>
                Scan First Outfit
              </VaynButton>
            </Link>
            <Link href="/wardrobe">
              <VaynButton variant="secondary" size="md" leftIcon={<Shirt className="h-4 w-4" />}>
                Catalog Wardrobe
              </VaynButton>
            </Link>
          </div>
        </VaynCard>
      ) : (
        /* Active Data Dashboard */
        <div className="space-y-8">
          {/* 4 Summary Stat Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <VaynCard variant="bordered" padding="md" className="space-y-1">
              <span className="text-[10px] font-mono uppercase text-[#A95239] font-semibold">Average Sartorial Score</span>
              <div className="font-serif text-3xl text-[#F4EFE6]">
                {data?.averageScore !== null ? `${data?.averageScore}` : 'N/A'}
                {data?.averageScore !== null && <span className="text-xs text-[#6D6961] font-mono"> / 100</span>}
              </div>
              <span className="text-[10px] text-[#6D6961] block">Aggregated from analyses & looks</span>
            </VaynCard>

            <VaynCard variant="bordered" padding="md" className="space-y-1">
              <span className="text-[10px] font-mono uppercase text-[#A95239] font-semibold">Curated Looks</span>
              <div className="font-serif text-3xl text-[#F4EFE6]">{data?.totalLooks ?? 0}</div>
              <span className="text-[10px] text-[#6D6961] block">Archived signature ensembles</span>
            </VaynCard>

            <VaynCard variant="bordered" padding="md" className="space-y-1">
              <span className="text-[10px] font-mono uppercase text-[#A95239] font-semibold">Cataloged Garments</span>
              <div className="font-serif text-3xl text-[#F4EFE6]">{data?.wardrobeCount ?? 0}</div>
              <span className="text-[10px] text-[#6D6961] block">Active wardrobe archive pieces</span>
            </VaynCard>

            <VaynCard variant="bordered" padding="md" className="space-y-1">
              <span className="text-[10px] font-mono uppercase text-[#A95239] font-semibold">Vault Favourites</span>
              <div className="font-serif text-3xl text-[#F4EFE6]">{data?.favoriteLooksCount ?? 0}</div>
              <span className="text-[10px] text-[#6D6961] block">Bookmarked priority looks</span>
            </VaynCard>
          </div>

          {/* Charts Row: Score Trend + Category Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Score Trend LineChart */}
            <VaynCard variant="bordered" padding="md" className="space-y-4">
              <div className="flex items-center justify-between border-b border-[#DED5C8]/10 pb-2.5">
                <div>
                  <span className="text-[10px] font-mono uppercase text-[#A95239] block font-semibold">Trajectory</span>
                  <h3 className="font-serif text-base text-[#F4EFE6]">Sartorial Harmony Progression</h3>
                </div>
                <TrendingUp className="h-4 w-4 text-[#A95239]" />
              </div>

              {data?.scoreHistory && data.scoreHistory.length > 0 ? (
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data.scoreHistory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#24231F" />
                      <XAxis dataKey="date" stroke="#6D6961" fontSize={10} tickLine={false} />
                      <YAxis stroke="#6D6961" fontSize={10} domain={[50, 100]} tickLine={false} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#1C1B18',
                          border: '1px solid #A95239',
                          borderRadius: 4,
                          fontSize: 11,
                          color: '#F4EFE6',
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="score"
                        stroke="#A95239"
                        strokeWidth={2}
                        dot={{ fill: '#A95239', r: 3 }}
                        activeDot={{ r: 5, fill: '#F4EFE6' }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-64 flex items-center justify-center text-xs text-[#6D6961]">
                  Scan more looks to graph your score evolution.
                </div>
              )}
            </VaynCard>

            {/* Category Breakdown BarChart */}
            <VaynCard variant="bordered" padding="md" className="space-y-4">
              <div className="flex items-center justify-between border-b border-[#DED5C8]/10 pb-2.5">
                <div>
                  <span className="text-[10px] font-mono uppercase text-[#A95239] block font-semibold">Volume</span>
                  <h3 className="font-serif text-base text-[#F4EFE6]">Wardrobe Category Distribution</h3>
                </div>
                <BarChart3 className="h-4 w-4 text-[#A95239]" />
              </div>

              {data?.categoryDistribution && data.categoryDistribution.length > 0 ? (
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={data.categoryDistribution.slice(0, 7)}
                      margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#24231F" />
                      <XAxis
                        dataKey="category"
                        stroke="#6D6961"
                        fontSize={9}
                        tickLine={false}
                        tickFormatter={(v) => v.slice(0, 5)}
                      />
                      <YAxis stroke="#6D6961" fontSize={10} tickLine={false} allowDecimals={false} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#1C1B18',
                          border: '1px solid #DED5C8',
                          borderRadius: 4,
                          fontSize: 11,
                          color: '#F4EFE6',
                        }}
                      />
                      <Bar dataKey="count" fill="#A95239" radius={[2, 2, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-64 flex items-center justify-center text-xs text-[#6D6961]">
                  No categorized pieces recorded.
                </div>
              )}
            </VaynCard>
          </div>

          {/* Color Breakdown and Most-Used Items */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Color Distribution Horizontal Bars */}
            <VaynCard variant="bordered" padding="md" className="lg:col-span-1 space-y-4">
              <div className="border-b border-[#DED5C8]/10 pb-2.5">
                <span className="text-[10px] font-mono uppercase text-[#A95239] block font-semibold">Chromatics</span>
                <h3 className="font-serif text-base text-[#F4EFE6]">Dominant Color Rotation</h3>
              </div>

              {data?.mostUsedColors && data.mostUsedColors.length > 0 ? (
                <div className="space-y-2.5">
                  {data.mostUsedColors.map((c, idx) => (
                    <div key={c.color} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-[#F4EFE6]">{c.color}</span>
                        <span className="text-[10px] text-[#6D6961] font-mono">{c.count} items</span>
                      </div>
                      <div className="h-1.5 w-full bg-[#24231F] rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${Math.min(100, c.count * 20)}%`,
                            backgroundColor: VAYN_PALETTE[idx % VAYN_PALETTE.length],
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center text-xs text-[#6D6961]">No dominant color data.</div>
              )}
            </VaynCard>

            {/* Most Used Items in Looks */}
            <VaynCard variant="bordered" padding="md" className="lg:col-span-2 space-y-4">
              <div className="border-b border-[#DED5C8]/10 pb-2.5">
                <span className="text-[10px] font-mono uppercase text-[#A95239] block font-semibold">Anchor Pieces</span>
                <h3 className="font-serif text-base text-[#F4EFE6]">Most-Rotated Garments</h3>
              </div>

              {data?.mostUsedItems && data.mostUsedItems.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {data.mostUsedItems.map((item) => (
                    <div
                      key={item.id}
                      className="p-2.5 bg-[#24231F]/50 border border-[#DED5C8]/15 rounded flex items-center gap-3"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="h-12 w-10 object-cover rounded border border-white/10 shrink-0"
                      />
                      <div className="truncate">
                        <h4 className="text-xs text-[#F4EFE6] font-medium truncate">{item.name}</h4>
                        <span className="text-[10px] text-[#A95239] font-mono block mt-0.5 font-medium">
                          {item.useCount} {item.useCount === 1 ? 'look' : 'looks'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center text-xs text-[#6D6961]">
                  Curate more looks to discover your wardrobe anchor pieces.
                </div>
              )}
            </VaynCard>
          </div>
        </div>
      )}
    </div>
  );
}

'use client';

import * as React from 'react';
import {
  TrendingUp,
  BarChart3,
  Shirt,
  Camera,
} from 'lucide-react';
import { VestraButton } from '@/components/ui/vestra-button';
import { VestraCard } from '@/components/ui/vestra-card';
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

const GOLD_PALETTE = ['#e8c547', '#d4af37', '#c19a6b', '#f5f0e8', '#9ca3af', '#6b7280'];

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
        <span className="text-xs text-[#9ca3af] font-mono">Synthesizing Personal Analytics...</span>
      </div>
    );
  }

  const hasData = data?.hasData ?? false;

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 space-y-8">
      {/* Editorial Header */}
      <div className="border-b border-[#9ca3af]/15 pb-6">
        <span className="text-[10px] font-semibold tracking-[0.25em] text-[#e8c547] uppercase block mb-1">
          Performance Metrics
        </span>
        <h1 className="font-serif text-3xl md:text-4xl font-normal text-[#f5f0e8] tracking-tight">
          Personal Style Analytics
        </h1>
        <p className="text-xs md:text-sm text-[#9ca3af] mt-1 max-w-2xl">
          Empirical breakdown of your wardrobe rotation, aesthetic scoring trajectories, and color balance indices.
        </p>
      </div>

      {!hasData ? (
        /* Empty State */
        <VestraCard variant="bordered" padding="lg" className="text-center py-16 space-y-6">
          <div className="h-14 w-14 rounded-full bg-[#262626] border border-[#e8c547]/30 flex items-center justify-center mx-auto text-[#e8c547]">
            <BarChart3 className="h-7 w-7" />
          </div>
          <div className="space-y-1.5 max-w-md mx-auto">
            <h2 className="font-serif text-2xl text-[#f5f0e8]">No Style Data Recorded Yet</h2>
            <p className="text-xs text-[#9ca3af] leading-relaxed">
              Your analytics dashboard populates as you scan outfits with the AI Scanner, catalog garments in your Wardrobe Vault, and curate looks.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link href="/scan">
              <VestraButton variant="primary" size="md" leftIcon={<Camera className="h-4 w-4" />}>
                Scan First Outfit
              </VestraButton>
            </Link>
            <Link href="/wardrobe">
              <VestraButton variant="secondary" size="md" leftIcon={<Shirt className="h-4 w-4" />}>
                Catalog Wardrobe
              </VestraButton>
            </Link>
          </div>
        </VestraCard>
      ) : (
        /* Active Data Dashboard */
        <div className="space-y-8">
          {/* 4 Summary Stat Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <VestraCard variant="bordered" padding="md" className="space-y-1">
              <span className="text-[10px] font-mono uppercase text-[#e8c547]">Average Sartorial Score</span>
              <div className="font-serif text-3xl text-[#f5f0e8]">
                {data?.averageScore !== null ? `${data?.averageScore}` : 'N/A'}
                {data?.averageScore !== null && <span className="text-xs text-[#9ca3af] font-mono"> / 100</span>}
              </div>
              <span className="text-[10px] text-[#9ca3af] block">Aggregated from analyses & looks</span>
            </VestraCard>

            <VestraCard variant="bordered" padding="md" className="space-y-1">
              <span className="text-[10px] font-mono uppercase text-[#e8c547]">Curated Looks</span>
              <div className="font-serif text-3xl text-[#f5f0e8]">{data?.totalLooks ?? 0}</div>
              <span className="text-[10px] text-[#9ca3af] block">Archived signature ensembles</span>
            </VestraCard>

            <VestraCard variant="bordered" padding="md" className="space-y-1">
              <span className="text-[10px] font-mono uppercase text-[#e8c547]">Cataloged Garments</span>
              <div className="font-serif text-3xl text-[#f5f0e8]">{data?.wardrobeCount ?? 0}</div>
              <span className="text-[10px] text-[#9ca3af] block">Active wardrobe archive pieces</span>
            </VestraCard>

            <VestraCard variant="bordered" padding="md" className="space-y-1">
              <span className="text-[10px] font-mono uppercase text-[#e8c547]">Vault Favourites</span>
              <div className="font-serif text-3xl text-[#f5f0e8]">{data?.favoriteLooksCount ?? 0}</div>
              <span className="text-[10px] text-[#9ca3af] block">Bookmarked priority looks</span>
            </VestraCard>
          </div>

          {/* Charts Row: Score Trend + Category Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Score Trend LineChart */}
            <VestraCard variant="bordered" padding="md" className="space-y-4">
              <div className="flex items-center justify-between border-b border-[#9ca3af]/15 pb-2.5">
                <div>
                  <span className="text-[10px] font-mono uppercase text-[#e8c547] block">Trajectory</span>
                  <h3 className="font-serif text-base text-[#f5f0e8]">Sartorial Score Progression</h3>
                </div>
                <TrendingUp className="h-4 w-4 text-[#e8c547]" />
              </div>

              {data?.scoreHistory && data.scoreHistory.length > 0 ? (
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data.scoreHistory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
                      <XAxis dataKey="date" stroke="#9ca3af" fontSize={10} tickLine={false} />
                      <YAxis stroke="#9ca3af" fontSize={10} domain={[50, 100]} tickLine={false} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#1a1a1a',
                          border: '1px solid #e8c547',
                          borderRadius: 2,
                          fontSize: 11,
                          color: '#f5f0e8',
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="score"
                        stroke="#e8c547"
                        strokeWidth={2}
                        dot={{ fill: '#e8c547', r: 3 }}
                        activeDot={{ r: 5, fill: '#f5f0e8' }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-64 flex items-center justify-center text-xs text-[#9ca3af]">
                  Scan more looks to graph your score evolution.
                </div>
              )}
            </VestraCard>

            {/* Category Breakdown BarChart */}
            <VestraCard variant="bordered" padding="md" className="space-y-4">
              <div className="flex items-center justify-between border-b border-[#9ca3af]/15 pb-2.5">
                <div>
                  <span className="text-[10px] font-mono uppercase text-[#e8c547] block">Volume</span>
                  <h3 className="font-serif text-base text-[#f5f0e8]">Wardrobe Category Distribution</h3>
                </div>
                <BarChart3 className="h-4 w-4 text-[#e8c547]" />
              </div>

              {data?.categoryDistribution && data.categoryDistribution.length > 0 ? (
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={data.categoryDistribution.slice(0, 7)}
                      margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
                      <XAxis
                        dataKey="category"
                        stroke="#9ca3af"
                        fontSize={9}
                        tickLine={false}
                        tickFormatter={(v) => v.slice(0, 5)}
                      />
                      <YAxis stroke="#9ca3af" fontSize={10} tickLine={false} allowDecimals={false} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#1a1a1a',
                          border: '1px solid #9ca3af',
                          borderRadius: 2,
                          fontSize: 11,
                          color: '#f5f0e8',
                        }}
                      />
                      <Bar dataKey="count" fill="#e8c547" radius={[2, 2, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-64 flex items-center justify-center text-xs text-[#9ca3af]">
                  No categorized pieces recorded.
                </div>
              )}
            </VestraCard>
          </div>

          {/* Color Breakdown and Most-Used Items */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Color Distribution Horizontal Bars */}
            <VestraCard variant="bordered" padding="md" className="lg:col-span-1 space-y-4">
              <div className="border-b border-[#9ca3af]/15 pb-2.5">
                <span className="text-[10px] font-mono uppercase text-[#e8c547] block">Chromatics</span>
                <h3 className="font-serif text-base text-[#f5f0e8]">Dominant Color Rotation</h3>
              </div>

              {data?.mostUsedColors && data.mostUsedColors.length > 0 ? (
                <div className="space-y-2.5">
                  {data.mostUsedColors.map((c, idx) => (
                    <div key={c.color} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-[#f5f0e8]">{c.color}</span>
                        <span className="text-[10px] text-[#9ca3af] font-mono">{c.count} items</span>
                      </div>
                      <div className="h-1.5 w-full bg-[#262626] rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${Math.min(100, c.count * 20)}%`,
                            backgroundColor: GOLD_PALETTE[idx % GOLD_PALETTE.length],
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center text-xs text-[#9ca3af]">No dominant color data.</div>
              )}
            </VestraCard>

            {/* Most Used Items in Looks */}
            <VestraCard variant="bordered" padding="md" className="lg:col-span-2 space-y-4">
              <div className="border-b border-[#9ca3af]/15 pb-2.5">
                <span className="text-[10px] font-mono uppercase text-[#e8c547] block">Anchor Pieces</span>
                <h3 className="font-serif text-base text-[#f5f0e8]">Most-Rotated Garments</h3>
              </div>

              {data?.mostUsedItems && data.mostUsedItems.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {data.mostUsedItems.map((item) => (
                    <div
                      key={item.id}
                      className="p-2.5 bg-[#262626]/50 border border-[#9ca3af]/20 rounded-sm flex items-center gap-3"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="h-12 w-10 object-cover rounded-sm border border-white/10 shrink-0"
                      />
                      <div className="truncate">
                        <h4 className="text-xs text-[#f5f0e8] font-medium truncate">{item.name}</h4>
                        <span className="text-[10px] text-[#e8c547] font-mono block mt-0.5">
                          {item.useCount} {item.useCount === 1 ? 'look' : 'looks'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center text-xs text-[#9ca3af]">
                  Curate more looks to discover your wardrobe anchor pieces.
                </div>
              )}
            </VestraCard>
          </div>
        </div>
      )}
    </div>
  );
}

'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Plus } from 'lucide-react';
import { VestraButton } from '@/components/ui/vestra-button';

interface WardrobeShowcaseItem {
  id: string;
  name: string;
  category: 'TOPS' | 'BOTTOMS' | 'OUTERWEAR' | 'FOOTWEAR';
  categoryLabel: string;
  colorName: string;
  colorHex: string;
  material: string;
  formality: string;
  imageUrl: string;
  versatilityScore: number;
}

const sampleVaultItems: WardrobeShowcaseItem[] = [
  {
    id: 'vault-1',
    name: 'Double-Breasted Wool Overcoat',
    category: 'OUTERWEAR',
    categoryLabel: 'Outerwear',
    colorName: 'Camel Sand',
    colorHex: '#C19A6B',
    material: 'Virgin Wool 100%',
    formality: 'Smart Casual / Formal',
    imageUrl:
      'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=600&auto=format&fit=crop&q=80',
    versatilityScore: 9.6,
  },
  {
    id: 'vault-2',
    name: 'High-Twist Pleated Wide Trousers',
    category: 'BOTTOMS',
    categoryLabel: 'Bottoms',
    colorName: 'Deep Mineral',
    colorHex: '#171411',
    material: 'Wool Crepe',
    formality: 'Executive / Evening',
    imageUrl:
      'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=600&auto=format&fit=crop&q=80',
    versatilityScore: 9.4,
  },
  {
    id: 'vault-3',
    name: 'Brushed Cashmere Mock-Neck',
    category: 'TOPS',
    categoryLabel: 'Tops',
    colorName: 'Warm Porcelain',
    colorHex: '#F7F4EE',
    material: 'Grade-A Cashmere',
    formality: 'Versatile',
    imageUrl:
      'https://images.unsplash.com/photo-1516826957135-700dedea698c?w=600&auto=format&fit=crop&q=80',
    versatilityScore: 9.8,
  },
  {
    id: 'vault-4',
    name: 'Minimal Calfskin Chelsea Boots',
    category: 'FOOTWEAR',
    categoryLabel: 'Footwear',
    colorName: 'Espresso Black',
    colorHex: '#171411',
    material: 'Italian Calfskin',
    formality: 'All-Season',
    imageUrl:
      'https://images.unsplash.com/photo-1520639888713-7851133b1ed0?w=600&auto=format&fit=crop&q=80',
    versatilityScore: 9.1,
  },
  {
    id: 'vault-5',
    name: 'Unstructured Flannel Blazer',
    category: 'OUTERWEAR',
    categoryLabel: 'Outerwear',
    colorName: 'Charcoal Umber',
    colorHex: '#3A342A',
    material: 'Flannel Wool',
    formality: 'Smart Casual',
    imageUrl:
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&auto=format&fit=crop&q=80',
    versatilityScore: 8.9,
  },
  {
    id: 'vault-6',
    name: 'Selvedge Straight-Leg Denim',
    category: 'BOTTOMS',
    categoryLabel: 'Bottoms',
    colorName: 'Raw Indigo',
    colorHex: '#1B263B',
    material: '14oz Kurabo Denim',
    formality: 'Casual',
    imageUrl:
      'https://images.unsplash.com/photo-1542272604-780c96856592?w=600&auto=format&fit=crop&q=80',
    versatilityScore: 9.5,
  },
];

const categoryTabs = [
  { id: 'ALL', label: 'All Pieces' },
  { id: 'TOPS', label: 'Tops' },
  { id: 'BOTTOMS', label: 'Bottoms' },
  { id: 'OUTERWEAR', label: 'Outerwear' },
  { id: 'FOOTWEAR', label: 'Footwear' },
];

export function WardrobeSection() {
  const [activeTab, setActiveTab] = React.useState<string>('ALL');

  const filteredItems =
    activeTab === 'ALL'
      ? sampleVaultItems
      : sampleVaultItems.filter((item) => item.category === activeTab);

  return (
    <section
      id="wardrobe"
      className="py-24 sm:py-32 px-6 md:px-12 lg:px-16 bg-[var(--vestra-bg)] text-[var(--vestra-text)] border-b border-[var(--vestra-border-soft)] transition-colors duration-200"
    >
      <div className="max-w-7xl mx-auto w-full">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-14 md:mb-18 gap-6">
          <div className="max-w-2xl">
            <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[var(--vestra-action)] font-bold block mb-2">
              VAULT ARCHITECTURE // DIGITAL INVENTORY
            </span>
            <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl font-normal text-[var(--vestra-text)] tracking-tight leading-[1.05]">
              Your Entire Closet,
              <br />
              <span className="italic font-serif text-[var(--vestra-action)]">Digitized & Connected.</span>
            </h2>
          </div>

          <p className="text-sm md:text-base text-[var(--vestra-text-body)] max-w-md font-sans leading-relaxed">
            Stop buying pieces that don’t fit your rotation. VESTRA extracts cuts, textures, and formality to unlock dozens of combinations from clothes you already own.
          </p>
        </div>

        {/* Filter Tabs & Catalog CTA */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10 pb-4 border-b border-[var(--vestra-border-soft)]">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            {categoryTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-sm border font-mono text-xs uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-[var(--vestra-action)] text-[var(--vestra-action-text)] border-[var(--vestra-action)] font-bold'
                    : 'bg-[var(--vestra-surface-alt)] text-[var(--vestra-text-muted)] border-[var(--vestra-border-soft)] hover:border-[var(--vestra-action)] hover:text-[var(--vestra-text)]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <Link href="/wardrobe" className="shrink-0">
            <VestraButton
              variant="secondary"
              size="sm"
              leftIcon={<Plus className="h-3.5 w-3.5 text-[var(--vestra-action)]" />}
            >
              Catalog Garment
            </VestraButton>
          </Link>
        </div>

        {/* Vault Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          <AnimatePresence>
            {filteredItems.map((item, idx) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.35, delay: idx * 0.05 }}
                className="bg-[var(--vestra-surface)] border border-[var(--vestra-border-soft)] rounded-sm overflow-hidden group shadow-md hover:border-[var(--vestra-action)] transition-all"
              >
                {/* Garment Image */}
                <div className="relative aspect-[4/5] w-full overflow-hidden bg-[var(--vestra-surface-alt)]">
                  <Image
                    src={item.imageUrl}
                    alt={item.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-[var(--vestra-surface)]/90 backdrop-blur-sm px-2.5 py-1 rounded text-[9px] font-mono uppercase tracking-wider text-[var(--vestra-text)] border border-[var(--vestra-border-soft)]">
                    {item.categoryLabel}
                  </div>
                  <div className="absolute top-3 right-3 bg-[var(--vestra-action)] text-[var(--vestra-action-text)] px-2 py-0.5 rounded text-[10px] font-mono font-bold">
                    ★ {item.versatilityScore}
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-5 space-y-3">
                  <h4 className="font-serif text-lg text-[var(--vestra-text)] group-hover:text-[var(--vestra-action)] transition-colors line-clamp-1">
                    {item.name}
                  </h4>

                  <div className="flex items-center justify-between text-xs text-[var(--vestra-text-muted)] font-mono">
                    <span>{item.material}</span>
                    <span className="flex items-center gap-1.5">
                      <span
                        className="h-2.5 w-2.5 rounded-full border border-black/20"
                        style={{ backgroundColor: item.colorHex }}
                      />
                      <span>{item.colorName}</span>
                    </span>
                  </div>

                  <div className="pt-2 border-t border-[var(--vestra-border-soft)] flex items-center justify-between text-[11px] font-mono text-[var(--vestra-text-muted)]">
                    <span>{item.formality}</span>
                    <span className="text-[var(--vestra-action)] font-semibold">CALIBRATED</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Vault Footnote Banner */}
        <div className="mt-12 p-6 bg-[var(--vestra-surface-alt)] border border-[var(--vestra-border-soft)] rounded-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="h-2 w-2 rounded-full bg-[var(--vestra-action)]" />
            <p className="text-xs text-[var(--vestra-text-body)] font-sans">
              Instant auto-tagging across fabrics, sleeve cuts, color undertones, and versatility metrics.
            </p>
          </div>
          <Link href="/wardrobe">
            <VestraButton
              variant="secondary"
              size="sm"
              rightIcon={<ArrowRight className="h-3.5 w-3.5" />}
            >
              Open Digital Vault
            </VestraButton>
          </Link>
        </div>
      </div>
    </section>
  );
}

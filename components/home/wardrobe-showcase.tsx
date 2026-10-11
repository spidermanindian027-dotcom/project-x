'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Plus } from 'lucide-react';
import { VaynButton } from '@/components/ui/vestra-button';

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
    colorName: 'Deep Ink',
    colorHex: '#24231F',
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
    colorName: 'Warm Ivory',
    colorHex: '#F4EFE6',
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
    colorHex: '#1C1B18',
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
    colorName: 'Charcoal Grey',
    colorHex: '#4A463F',
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
      className="py-24 sm:py-32 px-6 md:px-12 lg:px-16 bg-[#F4EFE6] text-[#24231F] border-b border-[#DED5C8]"
    >
      <div className="max-w-7xl mx-auto w-full">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-14 md:mb-18 gap-6">
          <div className="max-w-2xl">
            <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#A95239] font-bold block mb-2">
              VAULT ARCHITECTURE // DIGITAL INVENTORY
            </span>
            <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl font-normal text-[#24231F] tracking-tight leading-[1.05]">
              Your Entire Closet,
              <br />
              <span className="italic font-serif text-[#A95239]">Digitized & Connected.</span>
            </h2>
          </div>

          <p className="text-sm md:text-base text-[#6D6961] max-w-md font-sans leading-relaxed">
            Stop buying pieces that don’t fit your rotation. VAYN extracts cuts, textures, and formality to unlock dozens of combinations from clothes you already own.
          </p>
        </div>

        {/* Filter Tabs & Catalog CTA */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10 pb-4 border-b border-[#DED5C8]">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            {categoryTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-sm border font-mono text-xs uppercase tracking-wider transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-[#24231F] text-[#F8F4ED] border-[#24231F] font-bold'
                    : 'bg-[#E9E1D6]/60 text-[#6D6961] border-[#DED5C8] hover:border-[#A95239] hover:text-[#24231F]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <Link href="/wardrobe" className="shrink-0">
            <VaynButton
              variant="secondary"
              size="sm"
              className="border-[#DED5C8] hover:border-[#A95239] text-[#24231F] bg-[#E9E1D6]/70"
              leftIcon={<Plus className="h-3.5 w-3.5 text-[#A95239]" />}
            >
              Catalog Garment
            </VaynButton>
          </Link>
        </div>

        {/* Garment Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          <AnimatePresence>
            {filteredItems.map((item, idx) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                className="bg-[#E9E1D6]/40 border border-[#DED5C8] rounded-sm overflow-hidden flex flex-col justify-between group hover:border-[#A95239] hover:shadow-lg transition-all"
              >
                {/* Image Section */}
                <div className="relative aspect-[3/4] bg-[#24231F] overflow-hidden">
                  <Image
                    src={item.imageUrl}
                    alt={item.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#24231F]/70 via-transparent to-transparent opacity-50" />

                  {/* Category Pill Top Left */}
                  <div className="absolute top-3 left-3 bg-[#24231F]/90 backdrop-blur-sm px-2.5 py-1 rounded-sm text-[9px] font-mono uppercase tracking-widest text-[#F8F4ED]">
                    {item.categoryLabel}
                  </div>

                  {/* Versatility Score Top Right */}
                  <div className="absolute top-3 right-3 bg-[#A95239] text-[#F8F4ED] px-2 py-0.5 rounded-sm font-mono text-[10px] font-bold">
                    ★ {item.versatilityScore}
                  </div>
                </div>

                {/* Garment Details Bottom */}
                <div className="p-5 flex flex-col justify-between flex-1">
                  <div>
                    <h3 className="font-serif text-lg font-normal text-[#24231F] group-hover:text-[#A95239] transition-colors leading-snug">
                      {item.name}
                    </h3>
                    <p className="text-xs text-[#6D6961] mt-1 font-mono">
                      {item.material} • {item.formality}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-[#DED5C8] flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span
                        className="h-2.5 w-2.5 rounded-full border border-black/30"
                        style={{ backgroundColor: item.colorHex }}
                      />
                      <span className="text-[11px] font-mono text-[#6D6961]">
                        {item.colorName}
                      </span>
                    </div>

                    <span className="text-[10px] font-mono text-[#737A60] font-semibold uppercase">
                      IN ACTIVE ROTATION
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Footer Banner */}
        <div className="mt-14 pt-8 border-t border-[#DED5C8] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs font-mono text-[#6D6961]">
            ZERO-HALLUCINATION GUARANTEE: CAPSULES ARE COMPOSED ONLY FROM REAL WARDROBE IDS
          </p>

          <Link href="/wardrobe">
            <VaynButton
              variant="primary"
              size="md"
              className="bg-[#A95239] hover:bg-[#8D442F] text-[#F8F4ED]"
              rightIcon={<ArrowRight className="h-4 w-4" />}
            >
              Open Your Digital Vault
            </VaynButton>
          </Link>
        </div>
      </div>
    </section>
  );
}

'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';
import { VaynButton } from '@/components/ui/vestra-button';

interface Archetype {
  id: string;
  name: string;
  code: string;
  tagline: string;
  description: string;
  silhouette: string;
  fabrics: string[];
  palette: { name: string; hex: string }[];
  keyPieces: string[];
}

const archetypes: Archetype[] = [
  {
    id: 'QUIET_LUXURY',
    name: 'Quiet Luxury',
    code: 'ARCH-01',
    tagline: 'Understated elegance, cashmere, tonal neutrals.',
    description:
      'Focuses on supreme fabric quality, subtle branding, and tailored silhouettes. Dominated by camel, ivory, slate, and charcoal.',
    silhouette: 'Relaxed Tailoring with Soft Shoulder Drape',
    fabrics: ['Virgin Wool', 'Brushed Cashmere', 'Heavyweight Silk', 'Loro Piana Linen'],
    palette: [
      { name: 'Warm Ivory', hex: '#F4EFE6' },
      { name: 'Oatmeal Sand', hex: '#E9E1D6' },
      { name: 'Deep Ink', hex: '#24231F' },
      { name: 'Soft Muted', hex: '#6D6961' },
    ],
    keyPieces: ['Oversized Double-Breasted Coat', 'Pleated Wool Trousers', 'Merino Crewneck'],
  },
  {
    id: 'STREETWEAR_EDGE',
    name: 'Streetwear Edge',
    code: 'ARCH-02',
    tagline: 'Boxy silhouettes, utility layers, bold statement pieces.',
    description:
      'Rooted in modern skate and urban culture. Characterized by oversized drops, modular utility vests, and expressive footwear.',
    silhouette: 'Boxy Drop-Shoulder & Wide-Leg Proportion',
    fabrics: ['Heavy Cotton Fleece (450gsm)', 'Ripstop Cordura', 'Raw Denim', 'Ballistic Nylon'],
    palette: [
      { name: 'Deep Ink', hex: '#24231F' },
      { name: 'Terracotta', hex: '#A95239' },
      { name: 'Muted Olive', hex: '#737A60' },
      { name: 'Light Sand', hex: '#E9E1D6' },
    ],
    keyPieces: ['Structured Boxy Hoodie', 'Cargo Utility Pants', 'Lug-Sole Sneakers'],
  },
  {
    id: 'MINIMAL_TAILORED',
    name: 'Minimal Tailored',
    code: 'ARCH-03',
    tagline: 'Precision suiting, clean drape, timeless monochrome.',
    description:
      'Eliminates superfluous ornamentation in favor of crisp geometric cuts, monochromatic harmonies, and architectural seamwork.',
    silhouette: 'Straight Columnar & Clean Seamlines',
    fabrics: ['High-Twist Wool Crepe', 'Crisp Poplin Cotton', 'Matte Viscose', 'Structured Gabardine'],
    palette: [
      { name: 'Pure Ink', hex: '#1C1B18' },
      { name: 'Charcoal', hex: '#2D2B26' },
      { name: 'Muted Silver', hex: '#6D6961' },
      { name: 'Porcelain Ivory', hex: '#F8F4ED' },
    ],
    keyPieces: ['Collarless Tailored Blazer', 'Straight-Cut Trousers', 'Poplin Button-Down'],
  },
  {
    id: 'OLD_MONEY',
    name: 'Old Money',
    code: 'ARCH-04',
    tagline: 'Cable knits, collegiate heritage, equestrian undertones.',
    description:
      'Timeless European and New England country elegance. Emphasizes generational heritage, traditional knitwear, and equestrian leathers.',
    silhouette: 'Classic Structured Silhouette with Heritage Proportions',
    fabrics: ['Cable-Knit Wool', 'Oxford Cotton', 'Tweed Herringbone', 'Fine Suede Leather'],
    palette: [
      { name: 'Heritage Navy', hex: '#2C3E50' },
      { name: 'Forest Olive', hex: '#737A60' },
      { name: 'Cream Sand', hex: '#E9E1D6' },
      { name: 'Cognac', hex: '#8E442F' },
    ],
    keyPieces: ['Chunky Cable Knit Sweater', 'Pleated Chinos', 'Penny Loafers'],
  },
  {
    id: 'AVANT_GARDE',
    name: 'Avant-Garde',
    code: 'ARCH-05',
    tagline: 'Deconstructed forms, asymmetrical hems, sculptural volume.',
    description:
      'Challenging traditional garments through asymmetrical cutting, raw edges, layering distortions, and dark romanticism.',
    silhouette: 'Deconstructed Sculptural Asymmetry',
    fabrics: ['Waxed Canvas', 'Distressed Linen', 'Crinkled Cupro', 'Bonded Neoprene'],
    palette: [
      { name: 'Obsidian Black', hex: '#181715' },
      { name: 'Dark Ink', hex: '#24231F' },
      { name: 'Smoky Slate', hex: '#4A463F' },
      { name: 'Terracotta Accent', hex: '#A95239' },
    ],
    keyPieces: ['Asymmetrical Drape Jacket', 'Layered Drop-Crotch Pants', 'Combat Boots'],
  },
];

export function StyleDiscoverySection() {
  const [selectedId, setSelectedId] = React.useState<string>('QUIET_LUXURY');

  const selectedArchetype =
    archetypes.find((a) => a.id === selectedId) || archetypes[0];

  return (
    <section
      id="discover"
      className="py-24 sm:py-32 px-6 md:px-12 lg:px-16 bg-[#E9E1D6]/40 text-[#24231F] border-b border-[#DED5C8]"
    >
      <div className="max-w-7xl mx-auto w-full">
        {/* Section Header */}
        <div className="max-w-3xl mb-16 md:mb-20">
          <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#A95239] font-bold block mb-2">
            AESTHETIC CALIBRATION ENGINE
          </span>
          <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl font-normal text-[#24231F] tracking-tight leading-[1.05]">
            Discover Your
            <br />
            <span className="italic font-serif text-[#A95239]">Signature Archetype.</span>
          </h2>
          <p className="mt-4 text-sm md:text-base text-[#6D6961] max-w-xl font-sans leading-relaxed">
            Personal style is not about following every trend — it is finding the silhouette architecture that feels instinctively true to you. Select an archetype to inspect its DNA.
          </p>
        </div>

        {/* Archetype Tab Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
          {archetypes.map((arch) => {
            const isSelected = selectedId === arch.id;
            return (
              <button
                key={arch.id}
                onClick={() => setSelectedId(arch.id)}
                className={`px-5 py-3 rounded-sm border font-mono text-xs uppercase tracking-wider transition-all whitespace-nowrap flex items-center gap-2.5 ${
                  isSelected
                    ? 'bg-[#24231F] text-[#F8F4ED] border-[#24231F] shadow-md'
                    : 'bg-[#F4EFE6] text-[#6D6961] border-[#DED5C8] hover:border-[#A95239] hover:text-[#24231F]'
                }`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    isSelected ? 'bg-[#A95239]' : 'bg-[#DED5C8]'
                  }`}
                />
                <span>{arch.name}</span>
                <span className="text-[10px] opacity-60">[{arch.code}]</span>
              </button>
            );
          })}
        </div>

        {/* Interactive Archetype Blueprint Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedArchetype.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="bg-[#F4EFE6] border border-[#DED5C8] rounded-sm p-8 sm:p-10 md:p-12 shadow-xl grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12"
          >
            {/* Left Blueprint Details (Cols 1-7) */}
            <div className="lg:col-span-7 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#A95239] font-bold">
                    {selectedArchetype.code} {'//'} ATELIER PROFILE
                  </span>
                  <span className="px-2.5 py-0.5 rounded-sm bg-[#737A60]/10 border border-[#737A60]/30 text-[#737A60] font-mono text-[10px] uppercase">
                    CALIBRATED MATRIX
                  </span>
                </div>

                <h3 className="font-serif text-3xl sm:text-4xl text-[#24231F] font-normal mb-2">
                  {selectedArchetype.name}
                </h3>
                <p className="text-sm font-sans text-[#A95239] font-medium mb-4">
                  {selectedArchetype.tagline}
                </p>

                <p className="text-xs sm:text-sm text-[#6D6961] leading-relaxed mb-6">
                  {selectedArchetype.description}
                </p>

                {/* Silhouette & Fabrics Breakdown */}
                <div className="space-y-4 pt-4 border-t border-[#DED5C8]">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[#6D6961] block mb-1">
                      Silhouette Geometry
                    </span>
                    <p className="text-xs sm:text-sm font-medium text-[#24231F]">
                      {selectedArchetype.silhouette}
                    </p>
                  </div>

                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[#6D6961] block mb-1.5">
                      Signature Textiles & Fabrics
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {selectedArchetype.fabrics.map((fabric) => (
                        <span
                          key={fabric}
                          className="px-2.5 py-1 bg-[#E9E1D6]/70 border border-[#DED5C8] rounded-sm text-[11px] font-mono text-[#24231F]"
                        >
                          {fabric}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Link to Onboarding Quiz */}
              <div className="pt-8 mt-8 border-t border-[#DED5C8] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-xs text-[#737A60] font-mono">
                  <CheckCircle2 className="h-4 w-4 text-[#737A60]" />
                  <span>Integrated in 6-Step Fitting Profile</span>
                </div>

                <Link href="/onboarding">
                  <VaynButton
                    variant="primary"
                    size="md"
                    className="bg-[#A95239] hover:bg-[#8D442F] text-[#F8F4ED]"
                    rightIcon={<ArrowRight className="h-3.5 w-3.5" />}
                  >
                    Calibrate This Style
                  </VaynButton>
                </Link>
              </div>
            </div>

            {/* Right Chromatic & Key Pieces Panel (Cols 8-12) */}
            <div className="lg:col-span-5 bg-[#E9E1D6]/50 border border-[#DED5C8] rounded-sm p-6 sm:p-8 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#A95239] font-bold block mb-4">
                  CHROMATIC HARMONY PALETTE
                </span>

                {/* Swatches List */}
                <div className="space-y-3 mb-8">
                  {selectedArchetype.palette.map((swatch) => (
                    <div key={swatch.hex} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span
                          className="h-6 w-6 rounded-full border border-black/20 shadow-sm"
                          style={{ backgroundColor: swatch.hex }}
                        />
                        <span className="text-xs font-medium text-[#24231F]">
                          {swatch.name}
                        </span>
                      </div>
                      <span className="font-mono text-[11px] text-[#6D6961]">
                        {swatch.hex}
                      </span>
                    </div>
                  ))}
                </div>

                <span className="text-[10px] font-mono uppercase tracking-widest text-[#A95239] font-bold block mb-3 pt-4 border-t border-[#DED5C8]">
                  CORE CAPSULE ANCHOR PIECES
                </span>

                <ul className="space-y-2 text-xs text-[#24231F]">
                  {selectedArchetype.keyPieces.map((piece, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <span className="text-[#A95239] font-mono text-[10px] font-bold">
                        0{i + 1}.
                      </span>
                      <span>{piece}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6 pt-4 border-t border-[#DED5C8] flex items-center justify-between text-[11px] font-mono text-[#6D6961]">
                <span>CONFIDENCE SCORE: 96%</span>
                <Sparkles className="h-4 w-4 text-[#A95239]" />
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}

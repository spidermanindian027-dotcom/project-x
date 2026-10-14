'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';
import { VestraButton } from '@/components/ui/vestra-button';

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
    tagline: 'Understated elegance, brushed cashmere, tonal neutrals.',
    description:
      'Focuses on supreme fabric quality, unbranded confidence, and tailored silhouettes. Dominated by camel, porcelain, slate, and umber.',
    silhouette: 'Relaxed Tailoring with Soft Shoulder Drape',
    fabrics: ['Virgin Wool', 'Brushed Cashmere', 'Heavyweight Silk', 'Italian Linen'],
    palette: [
      { name: 'Warm Porcelain', hex: '#F7F4EE' },
      { name: 'Camel Sand', hex: '#EDEAE3' },
      { name: 'Mineral Black', hex: '#171411' },
      { name: 'Warm Umber', hex: '#6E543A' },
    ],
    keyPieces: ['Oversized Double-Breasted Trench', 'Pleated Wool Trousers', 'Merino Ribbed Knit'],
  },
  {
    id: 'MINIMAL_TAILORED',
    name: 'Minimal Tailored',
    code: 'ARCH-02',
    tagline: 'Precision suiting, clean drape, architectural seamwork.',
    description:
      'Eliminates superfluous ornamentation in favor of crisp geometric cuts, monochromatic harmonies, and architectural precision.',
    silhouette: 'Straight Columnar & Clean Seamlines',
    fabrics: ['High-Twist Wool Crepe', 'Crisp Poplin Cotton', 'Matte Viscose', 'Structured Gabardine'],
    palette: [
      { name: 'Deep Mineral', hex: '#171411' },
      { name: 'Charcoal Shadow', hex: '#252018' },
      { name: 'Bronze Highlight', hex: '#8B6F4E' },
      { name: 'Porcelain White', hex: '#F7F4EE' },
    ],
    keyPieces: ['Collarless Tailored Blazer', 'Straight-Cut Trousers', 'Crisp Poplin Shirt'],
  },
  {
    id: 'OLD_MONEY',
    name: 'Old Money Modern',
    code: 'ARCH-03',
    tagline: 'Cable knits, collegiate heritage, equestrian undertones.',
    description:
      'Timeless continental elegance. Emphasizes generational heritage, traditional knitwear textures, and fine saddle leathers.',
    silhouette: 'Classic Structured Silhouette with Heritage Proportions',
    fabrics: ['Cable-Knit Wool', 'Oxford Cotton', 'Tweed Herringbone', 'Fine Suede'],
    palette: [
      { name: 'Heritage Midnight', hex: '#1E1A16' },
      { name: 'Antique Bronze', hex: '#8B6F4E' },
      { name: 'Alabaster Silk', hex: '#F0ECE5' },
      { name: 'Warm Gold', hex: '#C2A578' },
    ],
    keyPieces: ['Chunky Cable Knit Sweater', 'Pleated Wool Chinos', 'Italian Loafers'],
  },
  {
    id: 'STREETWEAR_EDGE',
    name: 'Contemporary Edge',
    code: 'ARCH-04',
    tagline: 'Boxy silhouettes, utility layers, bold statement volumes.',
    description:
      'Rooted in modern metropolitan culture. Characterized by oversized drops, modular utility vests, and expressive technical fabrics.',
    silhouette: 'Boxy Drop-Shoulder & Wide-Leg Proportion',
    fabrics: ['Heavy Cotton Fleece (480gsm)', 'Cordura Canvas', 'Raw Japanese Denim', 'Matte Nylon'],
    palette: [
      { name: 'Mineral Black', hex: '#171411' },
      { name: 'Warm Umber', hex: '#6E543A' },
      { name: 'Muted Gold', hex: '#C8B99A' },
      { name: 'Pale Porcelain', hex: '#EDEAE3' },
    ],
    keyPieces: ['Structured Boxy Hoodie', 'Double-Knee Utility Trousers', 'Chunky Leather Boots'],
  },
  {
    id: 'AVANT_GARDE',
    name: 'Avant-Garde Atelier',
    code: 'ARCH-05',
    tagline: 'Deconstructed forms, asymmetrical hems, sculptural volume.',
    description:
      'Challenging traditional garments through asymmetrical cutting, raw edges, layering distortions, and dark romanticism.',
    silhouette: 'Deconstructed Sculptural Asymmetry',
    fabrics: ['Waxed Canvas', 'Distressed Linen', 'Crinkled Cupro', 'Bonded Neoprene'],
    palette: [
      { name: 'Obsidian Black', hex: '#171411' },
      { name: 'Dark Umber', hex: '#2E2822' },
      { name: 'Muted Bronze', hex: '#8B6F4E' },
      { name: 'Warm Gold Accent', hex: '#C2A578' },
    ],
    keyPieces: ['Asymmetrical Drape Coat', 'Layered Drop-Crotch Pants', 'Square-Toe Boots'],
  },
];

export function StyleDiscoverySection() {
  const [selectedId, setSelectedId] = React.useState<string>('QUIET_LUXURY');

  const selectedArchetype =
    archetypes.find((a) => a.id === selectedId) || archetypes[0];

  return (
    <section
      id="discover"
      className="py-24 sm:py-32 px-6 md:px-12 lg:px-16 bg-[var(--vestra-bg-alt)] text-[var(--vestra-text)] border-b border-[var(--vestra-border-soft)] transition-colors duration-200"
    >
      <div className="max-w-7xl mx-auto w-full">
        {/* Section Header */}
        <div className="max-w-3xl mb-16 md:mb-20">
          <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[var(--vestra-action)] font-bold block mb-2">
            AESTHETIC CALIBRATION ENGINE
          </span>
          <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl font-normal text-[var(--vestra-text)] tracking-tight leading-[1.05]">
            Discover Your
            <br />
            <span className="italic font-serif text-[var(--vestra-action)]">Signature Archetype.</span>
          </h2>
          <p className="mt-4 text-sm md:text-base text-[var(--vestra-text-body)] max-w-xl font-sans leading-relaxed">
            Personal style is not about following fleeting micro-trends — it is finding the silhouette architecture and tonal balance that feels instinctively true to you. Select an archetype to inspect its DNA.
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
                className={`px-5 py-3 rounded-sm border font-mono text-xs uppercase tracking-wider transition-all whitespace-nowrap flex items-center gap-2.5 cursor-pointer ${
                  isSelected
                    ? 'bg-[var(--vestra-action)] text-[var(--vestra-action-text)] border-[var(--vestra-action)] shadow-md'
                    : 'bg-[var(--vestra-surface)] text-[var(--vestra-text-muted)] border-[var(--vestra-border-soft)] hover:border-[var(--vestra-action)] hover:text-[var(--vestra-text)]'
                }`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    isSelected ? 'bg-[var(--vestra-action-text)]' : 'bg-[var(--vestra-border)]'
                  }`}
                />
                <span>{arch.name}</span>
                <span className="text-[10px] opacity-70">[{arch.code}]</span>
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
            className="bg-[var(--vestra-surface)] border border-[var(--vestra-border-soft)] rounded-sm p-8 sm:p-10 md:p-12 shadow-xl grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12"
          >
            {/* Left Blueprint Details (Cols 1-7) */}
            <div className="lg:col-span-7 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-[var(--vestra-action)] font-bold">
                    {selectedArchetype.code} {'//'} MAISON PROFILE
                  </span>
                  <span className="px-2.5 py-0.5 rounded-sm bg-[var(--vestra-accent)]/15 border border-[var(--vestra-accent)]/30 text-[var(--vestra-accent)] font-mono text-[10px] uppercase font-semibold">
                    CALIBRATED MATRIX
                  </span>
                </div>

                <h3 className="font-serif text-3xl sm:text-4xl text-[var(--vestra-text)] font-normal mb-2">
                  {selectedArchetype.name}
                </h3>
                <p className="text-sm font-sans text-[var(--vestra-action)] font-medium mb-4">
                  {selectedArchetype.tagline}
                </p>

                <p className="text-xs sm:text-sm text-[var(--vestra-text-body)] leading-relaxed mb-6">
                  {selectedArchetype.description}
                </p>

                {/* Silhouette & Fabrics Breakdown */}
                <div className="space-y-4 pt-4 border-t border-[var(--vestra-border-soft)]">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--vestra-text-muted)] block mb-1">
                      Silhouette Geometry
                    </span>
                    <p className="text-xs sm:text-sm font-medium text-[var(--vestra-text)]">
                      {selectedArchetype.silhouette}
                    </p>
                  </div>

                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--vestra-text-muted)] block mb-1.5">
                      Signature Textiles & Fabrics
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {selectedArchetype.fabrics.map((fabric) => (
                        <span
                          key={fabric}
                          className="px-2.5 py-1 bg-[var(--vestra-surface-alt)] border border-[var(--vestra-border-soft)] rounded-sm text-[11px] font-mono text-[var(--vestra-text)]"
                        >
                          {fabric}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Link to Onboarding Quiz */}
              <div className="pt-8 mt-8 border-t border-[var(--vestra-border-soft)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-xs text-[var(--vestra-text-muted)] font-mono">
                  <CheckCircle2 className="h-4 w-4 text-[var(--vestra-action)]" />
                  <span>Integrated in 6-Step Fitting Profile</span>
                </div>

                <Link href="/onboarding">
                  <VestraButton
                    variant="primary"
                    size="md"
                    rightIcon={<ArrowRight className="h-3.5 w-3.5" />}
                  >
                    Calibrate This Style
                  </VestraButton>
                </Link>
              </div>
            </div>

            {/* Right Chromatic & Key Pieces Panel (Cols 8-12) */}
            <div className="lg:col-span-5 bg-[var(--vestra-surface-alt)] border border-[var(--vestra-border-soft)] rounded-sm p-6 sm:p-8 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--vestra-action)] font-bold block mb-4">
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
                        <span className="text-xs font-medium text-[var(--vestra-text)]">
                          {swatch.name}
                        </span>
                      </div>
                      <span className="font-mono text-[11px] text-[var(--vestra-text-muted)]">
                        {swatch.hex}
                      </span>
                    </div>
                  ))}
                </div>

                <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--vestra-action)] font-bold block mb-3 pt-4 border-t border-[var(--vestra-border-soft)]">
                  CORE CAPSULE ANCHOR PIECES
                </span>

                <ul className="space-y-2 text-xs text-[var(--vestra-text-body)]">
                  {selectedArchetype.keyPieces.map((piece, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <span className="text-[var(--vestra-action)] font-mono text-[10px] font-bold">
                        0{i + 1}.
                      </span>
                      <span>{piece}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6 pt-4 border-t border-[var(--vestra-border-soft)] flex items-center justify-between text-[11px] font-mono text-[var(--vestra-text-muted)]">
                <span>CONFIDENCE SCORE: 98%</span>
                <Sparkles className="h-4 w-4 text-[var(--vestra-action)]" />
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}

'use client';

import * as React from 'react';

const primaryPhrases = [
  'CURATE WITH INTENTION',
  'STYLE, RECONSIDERED.',
  'ARCHITECTURAL SILHOUETTE',
  'VESTRA MAISON',
  'PROPORTION OVER TRENDS',
  'SAME YOU. BETTER OUTFITS.',
];

const secondaryPhrases = [
  '#VESTRA-ATELIER-26',
  'NEURAL FIT PREVIEWS',
  'METEOROLOGICAL CALIBRATION',
  'PURE HARMONY INDEX',
  'CAPSULE WARDROBE VAULT',
  'MULTIMODAL VISION AI',
];

export function FashionMarquee() {
  return (
    <div
      id="marquee"
      className="relative w-full overflow-hidden bg-[var(--vestra-surface)] text-[var(--vestra-text)] py-6 border-y border-[var(--vestra-border-soft)] select-none transition-colors duration-200"
    >
      {/* Top Track (Moving Left) */}
      <div className="flex overflow-hidden py-1">
        <div className="animate-marquee flex items-center whitespace-nowrap">
          {[...primaryPhrases, ...primaryPhrases].map((phrase, idx) => (
            <div key={`track1-${idx}`} className="inline-flex items-center mx-6 sm:mx-8">
              <span className="font-serif text-2xl sm:text-3xl md:text-4xl uppercase tracking-[0.14em] font-normal text-[var(--vestra-text)] hover:text-[var(--vestra-action)] transition-colors">
                {phrase}
              </span>
              <span className="ml-6 sm:ml-8 text-[var(--vestra-action)] text-base sm:text-xl font-mono">
                ✦
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Subtle Hairline Divider */}
      <div className="w-full my-2 border-t border-[var(--vestra-border-soft)]/50" />

      {/* Bottom Track (Moving Right, Smaller Monospaced Telemetry) */}
      <div className="flex overflow-hidden py-0.5">
        <div className="animate-marquee-reverse flex items-center whitespace-nowrap">
          {[...secondaryPhrases, ...secondaryPhrases].map((phrase, idx) => (
            <div key={`track2-${idx}`} className="inline-flex items-center mx-5 sm:mx-6">
              <span className="font-mono text-xs sm:text-sm uppercase tracking-[0.24em] text-[var(--vestra-text-muted)] hover:text-[var(--vestra-text)] transition-colors">
                {phrase}
              </span>
              <span className="ml-5 sm:ml-6 text-[var(--vestra-accent)] text-[10px]">
                {'//'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

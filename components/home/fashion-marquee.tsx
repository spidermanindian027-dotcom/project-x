'use client';

import * as React from 'react';

const primaryPhrases = [
  'FIND YOUR STYLE',
  'WEAR WHAT YOU LOVE',
  'STYLE WITHOUT RULES',
  'SAME YOU. BETTER OUTFITS.',
  'VAYN ATELIER',
  'CURATE WITH INTENTION',
];

const secondaryPhrases = [
  '#VAYN-COUTURE-26',
  'NEURAL FIT PREVIEWS',
  'METEOROLOGICAL CALIBRATION',
  'ZERO HALLUCINATIONS',
  'CAPSULE WARDROBE VAULT',
  'MULTIMODAL VISION AI',
];

export function FashionMarquee() {
  return (
    <div
      id="marquee"
      className="relative w-full overflow-hidden bg-[#24231F] text-[#F8F4ED] py-6 border-y border-[#DED5C8]/20 select-none"
    >
      {/* Top Track (Moving Left) */}
      <div className="flex overflow-hidden py-1">
        <div className="animate-marquee flex items-center whitespace-nowrap">
          {[...primaryPhrases, ...primaryPhrases].map((phrase, idx) => (
            <div key={`track1-${idx}`} className="inline-flex items-center mx-6 sm:mx-8">
              <span className="font-serif text-2xl sm:text-3xl md:text-4xl uppercase tracking-[0.12em] font-normal text-[#F4EFE6] hover:text-[#A95239] transition-colors">
                {phrase}
              </span>
              <span className="ml-6 sm:ml-8 text-[#A95239] text-base sm:text-xl font-mono">
                ★
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Subtle Hairline Divider */}
      <div className="w-full my-2 border-t border-[#DED5C8]/10" />

      {/* Bottom Track (Moving Right, Smaller Monospaced Telemetry) */}
      <div className="flex overflow-hidden py-0.5">
        <div className="animate-marquee-reverse flex items-center whitespace-nowrap">
          {[...secondaryPhrases, ...secondaryPhrases].map((phrase, idx) => (
            <div key={`track2-${idx}`} className="inline-flex items-center mx-5 sm:mx-6">
              <span className="font-mono text-xs sm:text-sm uppercase tracking-[0.24em] text-[#E9E1D6]/70 hover:text-[#F8F4ED] transition-colors">
                {phrase}
              </span>
              <span className="ml-5 sm:ml-6 text-[#737A60] text-[10px]">
                {'//'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Sparkles, ChevronDown } from 'lucide-react';
import { VaynButton } from '@/components/ui/vestra-button';

export function VaynHero() {
  const heroRef = React.useRef<HTMLDivElement>(null);

  // Scroll-linked parallax for background and layered image panels
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  const yPrimaryImage = useTransform(scrollYProgress, [0, 1], [0, 70]);
  const ySecondaryImage = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const opacityHero = useTransform(scrollYProgress, [0, 0.85], [1, 0.2]);

  return (
    <section
      ref={heroRef}
      className="relative min-h-[96vh] flex items-center justify-center pt-28 pb-16 px-6 md:px-12 lg:px-16 overflow-hidden bg-[#F4EFE6] text-[#24231F] border-b border-[#DED5C8]"
    >
      {/* Background Architectural Grid Lines */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#24231F08_1px,transparent_1px),linear-gradient(to_bottom,#24231F08_1px,transparent_1px)] bg-[size:5rem_5rem] pointer-events-none" />

      {/* Floating Ambient Aura */}
      <div className="absolute -top-32 right-1/4 w-[500px] h-[500px] rounded-full bg-[#A95239]/8 blur-[120px] pointer-events-none" />

      <motion.div
        style={{ opacity: opacityHero }}
        className="relative z-10 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center"
      >
        {/* Left Column (Cols 1-7): Oversized Editorial Typography */}
        <div className="lg:col-span-7 flex flex-col items-start text-left">
          {/* Brand Label Reveal */}
          <div className="overflow-hidden mb-6">
            <motion.div
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: '0%', opacity: 1 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="inline-flex items-center gap-2.5 px-3 py-1 bg-[#E9E1D6] border border-[#DED5C8] rounded text-[11px] font-mono uppercase tracking-[0.22em] text-[#A95239]"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-[#A95239] animate-pulse" />
              <span>VAYN / YOUR PERSONAL STYLE COMPANION</span>
            </motion.div>
          </div>

          {/* Masked Line-by-Line Headline Reveal */}
          <div className="overflow-hidden">
            <motion.h1
              initial={{ y: '100%' }}
              animate={{ y: '0%' }}
              transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="font-serif text-6xl sm:text-7xl md:text-8xl lg:text-[5.75rem] font-normal tracking-tight text-[#24231F] leading-[0.98]"
            >
              Your Style.
            </motion.h1>
          </div>

          <div className="overflow-hidden mt-1 md:mt-2">
            <motion.h1
              initial={{ y: '100%' }}
              animate={{ y: '0%' }}
              transition={{ duration: 0.9, delay: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="font-serif text-6xl sm:text-7xl md:text-8xl lg:text-[5.75rem] font-normal tracking-tight leading-[0.98] text-[#A95239]"
            >
              <span className="italic font-serif">Your Rules</span>
              <span className="text-[#24231F] not-italic">.</span>
            </motion.h1>
          </div>

          {/* Supporting Text */}
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="mt-6 md:mt-8 max-w-xl text-base md:text-lg text-[#6D6961] font-sans leading-relaxed tracking-wide"
          >
            Discover outfits, explore your personal style, and find new ways to wear what you love with <strong className="text-[#24231F] font-semibold">VAYN</strong>. Powered by contextual fashion AI, wardrobe intelligence, and live weather styling.
          </motion.p>

          {/* Action CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="mt-8 md:mt-10 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
          >
            <Link href="/onboarding" className="w-full sm:w-auto">
              <VaynButton
                variant="primary"
                size="lg"
                className="w-full sm:w-auto bg-[#A95239] hover:bg-[#8D442F] text-[#F8F4ED] font-medium px-8 py-3.5 shadow-lg shadow-[#A95239]/20"
                rightIcon={<ArrowRight className="h-4 w-4" />}
              >
                Find My Style
              </VaynButton>
            </Link>

            <Link href="#gallery" className="w-full sm:w-auto">
              <VaynButton
                variant="secondary"
                size="lg"
                className="w-full sm:w-auto border-[#DED5C8] hover:border-[#A95239] text-[#24231F] bg-[#E9E1D6]/60 hover:bg-[#E9E1D6] px-7 py-3.5"
              >
                Explore the Experience
              </VaynButton>
            </Link>
          </motion.div>

          {/* Editorial Telemetry Metadata Footnote */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="mt-12 pt-6 border-t border-[#DED5C8] grid grid-cols-3 gap-6 w-full max-w-md text-xs font-mono"
          >
            <div>
              <p className="font-serif text-lg font-normal text-[#24231F]">94%</p>
              <p className="text-[#6D6961] text-[10px] uppercase tracking-wider mt-0.5">Harmony Index</p>
            </div>
            <div>
              <p className="font-serif text-lg font-normal text-[#24231F]">10+</p>
              <p className="text-[#6D6961] text-[10px] uppercase tracking-wider mt-0.5">Style Archetypes</p>
            </div>
            <div>
              <p className="font-serif text-lg font-normal text-[#A95239]">Zero</p>
              <p className="text-[#6D6961] text-[10px] uppercase tracking-wider mt-0.5">Hallucinations</p>
            </div>
          </motion.div>
        </div>

        {/* Right Column (Cols 8-12): Layered Asymmetrical Editorial Collage */}
        <div className="lg:col-span-5 relative flex items-center justify-center min-h-[460px] md:min-h-[520px]">
          {/* Main Primary Image Panel with Clip-Path Reveal */}
          <motion.div
            style={{ y: yPrimaryImage }}
            initial={{ clipPath: 'polygon(0 100%, 100% 100%, 100% 100%, 0 100%)', opacity: 0 }}
            animate={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)', opacity: 1 }}
            transition={{ duration: 1.1, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-[300px] sm:w-[340px] md:w-[380px] aspect-[3/4] rounded-sm overflow-hidden border border-[#DED5C8] bg-[#E9E1D6] shadow-2xl group cursor-pointer"
          >
            <Image
              src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=900&auto=format&fit=crop&q=85"
              alt="VAYN Haute Couture Runway Silhouette"
              fill
              priority
              sizes="(max-width: 768px) 100vw, 400px"
              className="object-cover object-center group-hover:scale-105 transition-transform duration-700 brightness-[0.96]"
            />

            {/* Gradient Scrim */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#24231F]/80 via-transparent to-transparent opacity-70" />

            {/* Editorial Stamp Bottom Left */}
            <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between text-[#F8F4ED]">
              <div>
                <span className="text-[9px] font-mono uppercase tracking-[0.25em] text-[#E9E1D6] block">
                  VOL. 26 // ATELIER ED.
                </span>
                <p className="font-serif text-sm font-medium mt-0.5">Quiet Luxury Silhouette</p>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 bg-[#A95239] text-[#F8F4ED] rounded-sm">
                94% FIT
              </span>
            </div>
          </motion.div>

          {/* Secondary Layered Inset Card (Offset Overlap) */}
          <motion.div
            style={{ y: ySecondaryImage }}
            initial={{ opacity: 0, scale: 0.9, x: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="hidden sm:block absolute -bottom-6 -left-6 md:-left-10 w-[180px] md:w-[210px] aspect-[4/5] rounded-sm overflow-hidden border-2 border-[#F4EFE6] shadow-2xl bg-[#24231F] group z-20"
          >
            <Image
              src="https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&auto=format&fit=crop&q=80"
              alt="Tailored Minimal Drape"
              fill
              sizes="210px"
              className="object-cover object-center group-hover:scale-110 transition-transform duration-700"
            />
            <div className="absolute top-2.5 right-2.5 bg-[#24231F]/90 backdrop-blur-sm px-2 py-0.5 rounded text-[8px] font-mono text-[#F8F4ED] tracking-widest uppercase">
              ARCHETYPE
            </div>
          </motion.div>

          {/* Floating Aesthetic Telemetry Badge Top Right */}
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.75 }}
            className="absolute top-2 -right-2 md:-right-6 bg-[#24231F] text-[#F8F4ED] border border-[#DED5C8]/30 p-3 rounded shadow-xl max-w-[170px] z-20"
          >
            <div className="flex items-center gap-1.5 mb-1 text-[#A95239]">
              <Sparkles className="h-3.5 w-3.5 shrink-0" />
              <span className="text-[9px] font-mono uppercase tracking-wider font-semibold">Capsule Rationale</span>
            </div>
            <p className="text-[11px] font-sans text-[#E9E1D6] leading-tight">
              Tonal earth palette with structured shoulder line.
            </p>
          </motion.div>
        </div>
      </motion.div>

      {/* Subtle Scroll Indicator */}
      <motion.a
        href="#marquee"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.8 }}
        className="absolute bottom-5 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-[#6D6961] hover:text-[#A95239] transition-colors cursor-pointer group"
        aria-label="Scroll to exploration"
      >
        <span className="text-[9px] font-mono tracking-[0.25em] uppercase">SCROLL</span>
        <ChevronDown className="h-4 w-4 animate-bounce text-[#A95239]" />
      </motion.a>
    </section>
  );
}

'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Camera } from 'lucide-react';
import { VaynLogo } from '@/components/ui/vayn-logo';
import { VaynButton } from '@/components/ui/vestra-button';

export function FinalCTA() {
  return (
    <section className="relative py-28 sm:py-36 px-6 md:px-12 lg:px-16 bg-[#181715] text-[#F4EFE6] border-t border-[#DED5C8]/15 overflow-hidden text-center">
      {/* Background Radial Aura */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,#A9523918,#181715_80%)] pointer-events-none" />

      {/* Subtle Architectural Grid Lines */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff04_1px,transparent_1px),linear-gradient(to_bottom,#ffffff04_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10 flex flex-col items-center">
        {/* Brand Icon Mark */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-6"
        >
          <VaynLogo variant="icon" size="lg" theme="terracotta" />
        </motion.div>

        {/* Editorial Subtitle */}
        <motion.span
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#A95239] font-bold mb-4"
        >
          VAYN ATELIER // ACCESS PASS
        </motion.span>

        {/* Monumental Headline */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-normal text-[#F4EFE6] tracking-tight leading-[1.02] mb-6"
        >
          Same You.
          <br />
          <span className="italic font-serif text-[#A95239]">Better Outfits</span>
          <span className="not-italic text-[#F4EFE6]">.</span>
        </motion.h2>

        {/* Supporting Line */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-base sm:text-lg text-[#E9E1D6]/80 font-sans max-w-xl mb-12 leading-relaxed"
        >
          Your style journey starts here. Discover outfits, explore your personal style, and find new ways to wear what you love with VAYN.
        </motion.p>

        {/* Primary & Secondary Action CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
        >
          <Link href="/onboarding" className="w-full sm:w-auto">
            <VaynButton
              variant="primary"
              size="lg"
              className="w-full sm:w-auto bg-[#A95239] hover:bg-[#8D442F] text-[#F8F4ED] font-medium px-9 py-4 shadow-xl shadow-[#A95239]/25"
              rightIcon={<ArrowRight className="h-4 w-4" />}
            >
              Find My Style
            </VaynButton>
          </Link>

          <Link href="/scan" className="w-full sm:w-auto">
            <VaynButton
              variant="secondary"
              size="lg"
              className="w-full sm:w-auto border-[#DED5C8]/30 hover:border-[#A95239] text-[#F4EFE6] bg-[#24231F] hover:bg-[#2D2B26] px-8 py-4"
              leftIcon={<Camera className="h-4 w-4 text-[#A95239]" />}
            >
              Scan An Outfit
            </VaynButton>
          </Link>
        </motion.div>

        {/* Micro Guarantee Note */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-8 text-[11px] font-mono text-[#6D6961] tracking-wider uppercase"
        >
          Zero friction • Private encrypted dossier • All features active
        </motion.p>
      </div>
    </section>
  );
}

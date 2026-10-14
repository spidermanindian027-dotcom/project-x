'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Camera } from 'lucide-react';
import { VestraLogo } from '@/components/ui/vayn-logo';
import { VestraButton } from '@/components/ui/vestra-button';

export function FinalCTA() {
  return (
    <section className="relative py-28 sm:py-36 px-6 md:px-12 lg:px-16 bg-[var(--vestra-surface)] text-[var(--vestra-text)] border-t border-[var(--vestra-border-soft)] overflow-hidden text-center transition-colors duration-200">
      {/* Background Radial Aura */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,var(--vestra-accent-soft),transparent_75%)] opacity-20 pointer-events-none" />

      {/* Subtle Architectural Grid Lines */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--vestra-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--vestra-border)_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-[0.15] pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10 flex flex-col items-center">
        {/* Brand Icon Mark */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-6"
        >
          <VestraLogo variant="icon" size="lg" />
        </motion.div>

        {/* Editorial Subtitle */}
        <motion.span
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-[10px] font-mono uppercase tracking-[0.3em] text-[var(--vestra-action)] font-bold mb-4"
        >
          VESTRA MAISON // ATELIER ACCESS
        </motion.span>

        {/* Monumental Headline */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-normal text-[var(--vestra-text)] tracking-tight leading-[1.02] mb-6"
        >
          Curate the Look.
          <br />
          <span className="italic font-serif text-[var(--vestra-action)]">Own Your Aesthetic</span>
          <span className="not-italic text-[var(--vestra-text)]">.</span>
        </motion.h2>

        {/* Supporting Line */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-base sm:text-lg text-[var(--vestra-text-body)] font-sans max-w-xl mb-12 leading-relaxed"
        >
          Your personal aesthetic refined by intelligence. Discover capsule rotations, calibrate proportions, and elevate how you wear what you already love.
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
            <VestraButton
              variant="primary"
              size="lg"
              className="w-full sm:w-auto px-9 py-4 shadow-xl shadow-[var(--vestra-action)]/20"
              rightIcon={<ArrowRight className="h-4 w-4" />}
            >
              Find My Style
            </VestraButton>
          </Link>

          <Link href="/scan" className="w-full sm:w-auto">
            <VestraButton
              variant="secondary"
              size="lg"
              className="w-full sm:w-auto px-8 py-4"
              leftIcon={<Camera className="h-4 w-4 text-[var(--vestra-action)]" />}
            >
              Scan An Outfit
            </VestraButton>
          </Link>
        </motion.div>

        {/* Status indicator */}
        <div className="mt-12 flex items-center gap-2 text-[10px] font-mono text-[var(--vestra-text-muted)]">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>INSTANT GUEST ACCESS • NO INITIAL SIGNUP REQUIRED</span>
        </div>
      </div>
    </section>
  );
}

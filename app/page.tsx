'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Sparkles,
  ShoppingBag,
  TrendingUp,
  ArrowRight,
  Play,
} from 'lucide-react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { VestraButton } from '@/components/ui/vestra-button';
import { VestraCard } from '@/components/ui/vestra-card';
import { BadgeStatus } from '@/components/ui/badge-status';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#1a1a1a] text-[#f5f0e8] flex flex-col selection:bg-[#e8c547] selection:text-[#1a1a1a]">
      <Header />

      {/* Hero Section */}
      <section className="relative min-h-[92vh] flex items-center justify-center pt-24 pb-16 px-6 md:px-12 overflow-hidden border-b border-[#9ca3af]/15">
        {/* Subtle Editorial Grid Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

        {/* Abstract Minimal Geometric Silhouettes */}
        <div className="absolute right-[-5%] top-[10%] w-[380px] h-[500px] border border-[#e8c547]/10 pointer-events-none rotate-6 hidden lg:block" />
        <div className="absolute left-[-5%] bottom-[5%] w-[420px] h-[350px] border border-white/5 pointer-events-none -rotate-3 hidden lg:block" />

        <div className="relative z-10 max-w-5xl mx-auto text-center flex flex-col items-center">
          {/* Tagline Badge */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-3.5 py-1 mb-8 border border-[#e8c547]/30 bg-[#e8c547]/5 text-xs uppercase tracking-[0.2em] text-[#e8c547]"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-[#e8c547]" />
            Editorial Intelligence For The Modern Wardrobe
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-serif text-5xl sm:text-6xl md:text-8xl lg:text-9xl font-normal tracking-tight text-[#f5f0e8] leading-[1.02]"
          >
            Dress with
            <br />
            <span className="italic font-serif">
              Intelligence
              <span className="text-[#e8c547] not-italic inline-block ml-0.5">.</span>
            </span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-8 max-w-2xl text-base md:text-lg text-[#d4cfc7] font-sans leading-relaxed tracking-wide"
          >
            A bespoke algorithmic atelier crafted for effortless curation. Transform your
            physical closet into high-fashion pairings guided by generative styling and runway trend analyses.
          </motion.p>

          {/* Action CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-10 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
          >
            <Link href="/onboarding" className="w-full sm:w-auto">
              <VestraButton
                variant="primary"
                size="lg"
                className="w-full sm:w-auto"
                rightIcon={<ArrowRight className="h-4 w-4" />}
              >
                Get Early Access
              </VestraButton>
            </Link>

            {/* Ghost CTA: Watch Demo (TODO) */}
            <div className="relative group w-full sm:w-auto">
              <VestraButton
                variant="ghost"
                size="lg"
                className="w-full sm:w-auto border border-white/10"
                leftIcon={<Play className="h-3.5 w-3.5 fill-current text-[#9ca3af]" />}
                onClick={() => alert('Demo showcase video is coming in Phase 2!')}
              >
                <span>Watch Demo</span>
                <BadgeStatus status="coming-soon" className="ml-2 text-[9px] py-0 px-1">
                  TODO
                </BadgeStatus>
              </VestraButton>
            </div>
          </motion.div>

          {/* Abstract SVG Fashion Draping Grid */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.5 }}
            className="mt-14 w-full max-w-xl mx-auto flex justify-center items-center opacity-60"
          >
            <svg
              className="w-full h-16 text-[#e8c547]/30"
              viewBox="0 0 600 60"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M0 30 C 150 0, 150 60, 300 30 C 450 0, 450 60, 600 30"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeDasharray="4 4"
              />
              <circle cx="300" cy="30" r="3" fill="#e8c547" />
            </svg>
          </motion.div>
        </div>
      </section>

      {/* Feature Grid */}
      <section id="features" className="py-24 px-6 md:px-12 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#e8c547] block mb-2">
            The Atelier Framework
          </span>
          <h2 className="font-serif text-3xl md:text-5xl font-normal text-[#f5f0e8] tracking-tight">
            Curated through Precision
          </h2>
          <div className="mt-4 h-[1px] w-12 bg-[#e8c547] mx-auto" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <motion.div
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 24 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <VestraCard
              variant="bordered"
              padding="lg"
              className="h-full flex flex-col justify-between group hover:border-[#e8c547]/60"
            >
              <div>
                <div className="p-3 w-fit bg-[#262626] border border-[#9ca3af]/20 mb-6 group-hover:border-[#e8c547]/40 transition-colors">
                  <Sparkles className="h-6 w-6 text-[#e8c547]" />
                </div>
                <h3 className="font-serif text-xl font-medium text-[#f5f0e8] mb-3">
                  AI Styling
                </h3>
                <p className="text-sm text-[#9ca3af] font-sans leading-relaxed">
                  Tailored silhouette curation driven by micro-climates, specific occasion dress codes, and your unique proportions.
                </p>
              </div>
              <div className="pt-6 mt-6 border-t border-[#9ca3af]/15 flex items-center justify-between text-xs text-[#d4cfc7]">
                <span className="font-mono text-[11px] text-[#e8c547]">01 / ENGINE</span>
                <span className="text-[11px] uppercase tracking-wider text-[#9ca3af]">Generative</span>
              </div>
            </VestraCard>
          </motion.div>

          {/* Feature 2 */}
          <motion.div
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 24 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <VestraCard
              variant="bordered"
              padding="lg"
              className="h-full flex flex-col justify-between group hover:border-[#e8c547]/60"
            >
              <div>
                <div className="p-3 w-fit bg-[#262626] border border-[#9ca3af]/20 mb-6 group-hover:border-[#e8c547]/40 transition-colors">
                  <ShoppingBag className="h-6 w-6 text-[#e8c547]" />
                </div>
                <h3 className="font-serif text-xl font-medium text-[#f5f0e8] mb-3">
                  Wardrobe Intelligence
                </h3>
                <p className="text-sm text-[#9ca3af] font-sans leading-relaxed">
                  Deep cataloging with automated color harmony scoring, capsule completion indexes, and item longevity tracking.
                </p>
              </div>
              <div className="pt-6 mt-6 border-t border-[#9ca3af]/15 flex items-center justify-between text-xs text-[#d4cfc7]">
                <span className="font-mono text-[11px] text-[#e8c547]">02 / VAULT</span>
                <span className="text-[11px] uppercase tracking-wider text-[#9ca3af]">Vision AI</span>
              </div>
            </VestraCard>
          </motion.div>

          {/* Feature 3 */}
          <motion.div
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 24 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <VestraCard
              variant="bordered"
              padding="lg"
              className="h-full flex flex-col justify-between group hover:border-[#e8c547]/60"
            >
              <div>
                <div className="p-3 w-fit bg-[#262626] border border-[#9ca3af]/20 mb-6 group-hover:border-[#e8c547]/40 transition-colors">
                  <TrendingUp className="h-6 w-6 text-[#e8c547]" />
                </div>
                <h3 className="font-serif text-xl font-medium text-[#f5f0e8] mb-3">
                  Trend Forecasting
                </h3>
                <p className="text-sm text-[#9ca3af] font-sans leading-relaxed">
                  Direct intelligence signals extracted from Paris, Milan, and New York runway archives, harmonized to your personal aesthetic.
                </p>
              </div>
              <div className="pt-6 mt-6 border-t border-[#9ca3af]/15 flex items-center justify-between text-xs text-[#d4cfc7]">
                <span className="font-mono text-[11px] text-[#e8c547]">03 / RUNWAY</span>
                <span className="text-[11px] uppercase tracking-wider text-[#9ca3af]">Global Feeds</span>
              </div>
            </VestraCard>
          </motion.div>
        </div>
      </section>

      {/* Social Proof / Editorial Quote */}
      <section className="py-24 bg-[#141414] border-y border-[#9ca3af]/15 px-6 md:px-12 relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="font-serif text-[#e8c547] text-4xl mb-4">“</div>
          <motion.blockquote
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 20 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="font-serif italic text-2xl sm:text-3xl md:text-4xl text-[#f5f0e8] leading-relaxed tracking-wide font-normal"
          >
            Fashion is the armor to survive the reality of everyday life.
          </motion.blockquote>
          <div className="mt-6 flex flex-col items-center">
            <span className="h-0.5 w-8 bg-[#e8c547] mb-3" />
            <cite className="not-italic text-xs uppercase tracking-[0.2em] text-[#9ca3af] font-sans">
              Bill Cunningham
            </cite>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="py-24 px-6 md:px-12 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-2xl mx-auto mb-20">
          <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#e8c547] block mb-2">
            The Methodology
          </span>
          <h2 className="font-serif text-3xl md:text-5xl font-normal text-[#f5f0e8] tracking-tight">
            How It Works
          </h2>
          <div className="mt-4 h-[1px] w-12 bg-[#e8c547] mx-auto" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 relative">
          {/* Step 1 */}
          <motion.div
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 25 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-start border-l border-[#9ca3af]/20 pl-6 relative"
          >
            <span className="font-serif text-4xl md:text-5xl font-bold text-[#e8c547] mb-3">
              01
            </span>
            <h3 className="font-serif text-xl font-medium text-[#f5f0e8] mb-2">
              Build your wardrobe
            </h3>
            <p className="text-xs md:text-sm text-[#9ca3af] font-sans leading-relaxed">
              Upload photos or receipts of your current clothing. Our multimodal vision model isolates fabric, cuts, textures, and color tones instantly.
            </p>
          </motion.div>

          {/* Step 2 */}
          <motion.div
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 25 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="flex flex-col items-start border-l border-[#9ca3af]/20 pl-6 relative"
          >
            <span className="font-serif text-4xl md:text-5xl font-bold text-[#e8c547] mb-3">
              02
            </span>
            <h3 className="font-serif text-xl font-medium text-[#f5f0e8] mb-2">
              Tell us your style
            </h3>
            <p className="text-xs md:text-sm text-[#9ca3af] font-sans leading-relaxed">
              Calibrate your preferred aesthetic: Quiet Luxury, Old Money, Avant-Garde, or Modern Minimalist. Set your comfort thresholds and body architecture.
            </p>
          </motion.div>

          {/* Step 3 */}
          <motion.div
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 25 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col items-start border-l border-[#9ca3af]/20 pl-6 relative"
          >
            <span className="font-serif text-4xl md:text-5xl font-bold text-[#e8c547] mb-3">
              03
            </span>
            <h3 className="font-serif text-xl font-medium text-[#f5f0e8] mb-2">
              Get dressed effortlessly
            </h3>
            <p className="text-xs md:text-sm text-[#9ca3af] font-sans leading-relaxed">
              Receive daily editorial lookbooks calibrated for your morning itinerary, meetings, evening galas, and local temperature.
            </p>
          </motion.div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-24 bg-[#141414] border-t border-[#9ca3af]/15 px-6 md:px-12 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-radial from-[#e8c547]/5 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-3xl mx-auto relative z-10 flex flex-col items-center">
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#e8c547] font-semibold mb-4">
            Private Atelier
          </span>
          <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl font-normal text-[#f5f0e8] tracking-tight mb-6">
            Your wardrobe. Reimagined.
          </h2>
          <p className="text-sm md:text-base text-[#d4cfc7] font-sans max-w-xl mb-10 leading-relaxed">
            Join discerning tastemakers and experience curated editorial styling on demand.
          </p>
          <Link href="/onboarding">
            <VestraButton variant="primary" size="lg">
              Begin Stylist Onboarding
            </VestraButton>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}

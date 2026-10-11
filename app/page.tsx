'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  Sparkles,
  Camera,
  ShoppingBag,
  ArrowRight,
  Compass,
  ChevronRight,
} from 'lucide-react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { VaynButton } from '@/components/ui/vestra-button';
import { VaynCard } from '@/components/ui/vestra-card';
import { VaynLogo } from '@/components/ui/vayn-logo';

const archetypes = [
  {
    name: 'Quiet Luxury',
    tagline: 'Understated elegance, cashmere, tonal neutrals',
    colors: ['#F4EFE6', '#E9E1D6', '#24231F'],
    tag: 'Trending',
  },
  {
    name: 'Streetwear Edge',
    tagline: 'Boxy silhouettes, utility layers, bold statement pieces',
    colors: ['#24231F', '#A95239', '#737A60'],
    tag: 'Gen Z Pick',
  },
  {
    name: 'Minimal Tailored',
    tagline: 'Precision suiting, clean drape, timeless monochrome',
    colors: ['#1C1B18', '#6D6961', '#F4EFE6'],
    tag: 'Editorial',
  },
  {
    name: 'Old Money',
    tagline: 'Cable knits, collegiate heritage, equestrian undertones',
    colors: ['#2C3E50', '#737A60', '#E9E1D6'],
    tag: 'Classic',
  },
];

const pillars = [
  {
    step: '01 / SCANNER',
    title: 'The VAYN Outfit Scanner',
    description:
      'Snap a mirror selfie or outfit photo. Our multimodal vision model analyzes colour harmony, silhouette proportions, coordination, and occasion fit with instant feedback.',
    icon: Camera,
    badge: 'Vision AI',
    actionHref: '/scan',
    actionText: 'Try Outfit Scanner',
  },
  {
    step: '02 / VAULT',
    title: 'Multimodal Wardrobe Intelligence',
    description:
      'Digitize your closet with automated color extraction, category tagging, and capsule longevity scoring. Rediscover pieces you already own.',
    icon: ShoppingBag,
    badge: 'Capsule Engine',
    actionHref: '/wardrobe',
    actionText: 'Explore Wardrobe',
  },
  {
    step: '03 / STYLIST',
    title: 'Contextual AI Styling & Weather',
    description:
      'Receive daily lookbooks calibrated to your city’s micro-climate, forecasted rain, and your calendar itinerary — from boardroom meetings to night events.',
    icon: Compass,
    badge: 'Daily Briefing',
    actionHref: '/styling',
    actionText: 'View Weather Styling',
  },
  {
    step: '04 / STUDIO',
    title: 'Virtual Try-On & Lookbook',
    description:
      'Test pairings before stepping out. Experiment with contrasting textures, layered outerwear, and footwear choices in an interactive digital atelier.',
    icon: Sparkles,
    badge: 'Diffusion Studio',
    actionHref: '/try-on',
    actionText: 'Launch Try-On',
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#1C1B18] text-[#F4EFE6] flex flex-col selection:bg-[#A95239] selection:text-[#F4EFE6]">
      <Header />

      {/* Hero Section */}
      <section className="relative min-h-[92vh] flex items-center justify-center pt-24 pb-16 px-6 md:px-12 overflow-hidden border-b border-[#DED5C8]/10 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,#A9523922,#1C1B18_80%)]">
        {/* Subtle Editorial Grid Lines */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Hero Copy (Left 7 Cols) */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            {/* Tagline Badge */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-3.5 py-1 mb-6 border border-[#A95239]/40 bg-[#A95239]/10 text-xs uppercase tracking-[0.22em] text-[#A95239] rounded"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-[#A95239] animate-pulse" />
              <span>Your Style. Smarter. With AI.</span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-normal tracking-tight text-[#F4EFE6] leading-[1.05]"
            >
              Discover Your
              <br />
              <span className="italic font-serif text-[#A95239]">
                Perfect Look
                <span className="text-[#F4EFE6] not-italic">.</span>
              </span>
            </motion.h1>

            {/* Subheadline with Secondary Brand Line */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mt-6 max-w-xl text-base md:text-lg text-[#E9E1D6]/80 font-sans leading-relaxed tracking-wide"
            >
              <strong className="text-[#F4EFE6] font-semibold">Same You. Better Outfits.</strong>{' '}
              VAYN is the bespoke fashion AI companion built for Gen Z and modern tastemakers.
              Digitize your wardrobe, get instant AI outfit feedback, and master your signature silhouette.
            </motion.p>

            {/* Action CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="mt-8 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
            >
              <Link href="/onboarding" className="w-full sm:w-auto">
                <VaynButton
                  variant="primary"
                  size="lg"
                  className="w-full sm:w-auto bg-[#A95239] hover:bg-[#8D442F] text-[#F4EFE6] font-medium shadow-lg shadow-[#A95239]/20"
                  rightIcon={<ArrowRight className="h-4 w-4" />}
                >
                  Find My Style
                </VaynButton>
              </Link>

              <Link href="/scan" className="w-full sm:w-auto">
                <VaynButton
                  variant="secondary"
                  size="lg"
                  className="w-full sm:w-auto border-[#DED5C8]/30 hover:border-[#A95239] text-[#F4EFE6] hover:bg-white/5"
                  leftIcon={<Camera className="h-4 w-4 text-[#A95239]" />}
                >
                  Scan An Outfit
                </VaynButton>
              </Link>
            </motion.div>

            {/* Quick Proof Metrics */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mt-10 pt-6 border-t border-[#DED5C8]/10 grid grid-cols-3 gap-6 w-full max-w-md text-xs"
            >
              <div>
                <p className="font-serif text-lg font-semibold text-[#F4EFE6]">94%</p>
                <p className="text-[#6D6961] mt-0.5">Harmony Accuracy</p>
              </div>
              <div>
                <p className="font-serif text-lg font-semibold text-[#F4EFE6]">10+</p>
                <p className="text-[#6D6961] mt-0.5">Style Archetypes</p>
              </div>
              <div>
                <p className="font-serif text-lg font-semibold text-[#A95239]">Instant</p>
                <p className="text-[#6D6961] mt-0.5">Vision Feedback</p>
              </div>
            </motion.div>
          </div>

          {/* Hero Visual Editorial Collage (Right 5 Cols) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.2 }}
            className="lg:col-span-5 relative flex items-center justify-center"
          >
            <div className="relative w-full max-w-[420px] aspect-[4/5] rounded-xl overflow-hidden border border-[#DED5C8]/20 bg-[#24231F] shadow-2xl group">
              {/* Main Fashion Editorial Imagery */}
              <Image
                src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=900&auto=format&fit=crop&q=80"
                alt="VAYN Editorial Fashion Styling"
                fill
                priority
                className="object-cover object-center group-hover:scale-105 transition-transform duration-700 brightness-[0.92]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1C1B18] via-transparent to-transparent opacity-80" />

              {/* Floating Badge Top Right: Harmony Indicator */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 0.5 }}
                className="absolute top-4 right-4 bg-[#1F1E1B]/90 backdrop-blur-md border border-[#A95239]/40 p-3 rounded-lg shadow-xl max-w-[190px]"
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="h-2 w-2 rounded-full bg-[#A95239] animate-ping" />
                  <span className="text-[10px] uppercase font-mono tracking-wider text-[#A95239] font-bold">
                    VAYN Score: 94
                  </span>
                </div>
                <p className="text-[11px] font-medium text-[#F4EFE6] leading-snug">
                  Colour Harmony & Fit Balance
                </p>
                <div className="mt-2 w-full bg-white/10 h-1 rounded-full overflow-hidden">
                  <div className="bg-[#A95239] h-full w-[94%]" />
                </div>
              </motion.div>

              {/* Floating Badge Bottom Left: Daily Capsule Suggestion */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.6 }}
                className="absolute bottom-4 left-4 right-4 bg-[#1F1E1B]/95 backdrop-blur-md border border-[#DED5C8]/20 p-3.5 rounded-lg shadow-2xl flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded bg-[#737A60]/20 border border-[#737A60]/40 flex items-center justify-center shrink-0">
                    <Sparkles className="h-5 w-5 text-[#737A60]" />
                  </div>
                  <div>
                    <span className="text-[9px] uppercase font-mono tracking-widest text-[#737A60] font-semibold block">
                      Daily Capsule AI
                    </span>
                    <p className="text-xs font-semibold text-[#F4EFE6]">
                      Quiet Luxury & Terracotta Accent
                    </p>
                  </div>
                </div>
                <Link
                  href="/dashboard"
                  className="text-[10px] text-[#A95239] hover:underline font-mono uppercase font-semibold"
                >
                  View Look →
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Style Archetypes Quick Row */}
      <section className="py-12 border-b border-[#DED5C8]/10 bg-[#24231F]/50 px-6 md:px-12">
        <div className="max-w-7xl mx-auto w-full">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div>
              <span className="text-[10px] uppercase font-mono tracking-[0.25em] text-[#A95239] font-bold block mb-1">
                Aesthetic Calibration
              </span>
              <h2 className="font-serif text-2xl md:text-3xl font-normal text-[#F4EFE6]">
                Find Your Signature Archetype
              </h2>
            </div>
            <Link
              href="/onboarding"
              className="inline-flex items-center gap-1.5 text-xs text-[#A95239] hover:text-[#F4EFE6] transition-colors font-medium font-mono uppercase"
            >
              <span>Take Style Quiz</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {archetypes.map((arch) => (
              <VaynCard
                key={arch.name}
                variant="bordered"
                padding="md"
                className="bg-[#1C1B18] border-[#DED5C8]/15 hover:border-[#A95239]/60 transition-all group"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[9px] uppercase font-mono tracking-wider text-[#737A60] px-2 py-0.5 bg-[#737A60]/10 border border-[#737A60]/20 rounded">
                    {arch.tag}
                  </span>
                  <div className="flex gap-1">
                    {arch.colors.map((c, i) => (
                      <span
                        key={i}
                        className="h-2.5 w-2.5 rounded-full border border-black/40"
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                </div>
                <h3 className="font-serif text-base font-semibold text-[#F4EFE6] group-hover:text-[#A95239] transition-colors">
                  {arch.name}
                </h3>
                <p className="text-xs text-[#6D6961] mt-1.5 line-clamp-2 leading-relaxed">
                  {arch.tagline}
                </p>
              </VaynCard>
            ))}
          </div>
        </div>
      </section>

      {/* Atelier Core Pillars Grid */}
      <section id="features" className="py-24 px-6 md:px-12 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#A95239] block mb-2 font-mono">
            The Atelier Platform
          </span>
          <h2 className="font-serif text-3xl md:text-5xl font-normal text-[#F4EFE6] tracking-tight">
            Curated Through AI Precision
          </h2>
          <div className="mt-4 h-[2px] w-12 bg-[#A95239] mx-auto" />
          <p className="mt-4 text-sm text-[#E9E1D6]/70 leading-relaxed font-sans">
            Every feature in VAYN is designed to refine how you discover, assemble, and feel in your clothes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {pillars.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                whileInView={{ opacity: 1, y: 0 }}
                initial={{ opacity: 0, y: 24 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
              >
                <VaynCard
                  variant="bordered"
                  padding="lg"
                  className="h-full flex flex-col justify-between group hover:border-[#A95239]/70 bg-[#24231F] border-[#DED5C8]/15"
                >
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <div className="p-3 w-fit bg-[#1C1B18] border border-[#DED5C8]/15 rounded group-hover:border-[#A95239]/50 transition-colors">
                        <Icon className="h-6 w-6 text-[#A95239]" />
                      </div>
                      <span className="font-mono text-[10px] uppercase tracking-widest text-[#737A60] px-2.5 py-1 bg-[#737A60]/10 border border-[#737A60]/20 rounded">
                        {feature.badge}
                      </span>
                    </div>
                    <span className="font-mono text-[11px] text-[#A95239] block mb-1">
                      {feature.step}
                    </span>
                    <h3 className="font-serif text-xl font-medium text-[#F4EFE6] mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-[#E9E1D6]/75 font-sans leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                  <div className="pt-6 mt-6 border-t border-[#DED5C8]/10 flex items-center justify-between text-xs">
                    <Link
                      href={feature.actionHref}
                      className="text-xs text-[#A95239] hover:text-[#F4EFE6] font-medium font-mono uppercase inline-flex items-center gap-1.5 transition-colors"
                    >
                      <span>{feature.actionText}</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </VaynCard>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Social Proof / Editorial Manifesto Quote */}
      <section className="py-24 bg-[#181715] border-y border-[#DED5C8]/10 px-6 md:px-12 relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="font-serif text-[#A95239] text-5xl mb-4 font-bold">“</div>
          <motion.blockquote
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 20 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="font-serif italic text-2xl sm:text-3xl md:text-4xl text-[#F4EFE6] leading-relaxed tracking-wide font-normal"
          >
            Fashion is the armor to survive the reality of everyday life.
          </motion.blockquote>
          <div className="mt-6 flex flex-col items-center">
            <span className="h-0.5 w-8 bg-[#A95239] mb-3" />
            <cite className="not-italic text-xs uppercase tracking-[0.2em] text-[#6D6961] font-mono">
              Bill Cunningham
            </cite>
          </div>
        </div>
      </section>

      {/* How it Works / 3-Step Methodology */}
      <section id="how-it-works" className="py-24 px-6 md:px-12 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-2xl mx-auto mb-20">
          <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#A95239] block mb-2 font-mono">
            The Methodology
          </span>
          <h2 className="font-serif text-3xl md:text-5xl font-normal text-[#F4EFE6] tracking-tight">
            How VAYN Works
          </h2>
          <div className="mt-4 h-[2px] w-12 bg-[#A95239] mx-auto" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 relative">
          {/* Step 1 */}
          <motion.div
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 25 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-start border-l border-[#A95239]/30 pl-6 relative"
          >
            <span className="font-serif text-4xl md:text-5xl font-bold text-[#A95239] mb-3">
              01
            </span>
            <h3 className="font-serif text-xl font-medium text-[#F4EFE6] mb-2">
              Digitize & Scan
            </h3>
            <p className="text-xs md:text-sm text-[#E9E1D6]/70 font-sans leading-relaxed">
              Upload photos of items in your closet or take a full-body mirror selfie. Our multimodal vision model isolates textures, colors, cuts, and silhouettes in seconds.
            </p>
          </motion.div>

          {/* Step 2 */}
          <motion.div
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 25 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="flex flex-col items-start border-l border-[#A95239]/30 pl-6 relative"
          >
            <span className="font-serif text-4xl md:text-5xl font-bold text-[#A95239] mb-3">
              02
            </span>
            <h3 className="font-serif text-xl font-medium text-[#F4EFE6] mb-2">
              Calibrate Your Archetype
            </h3>
            <p className="text-xs md:text-sm text-[#E9E1D6]/70 font-sans leading-relaxed">
              Define your aesthetic preferences — from Quiet Luxury to Streetwear Edge. Tailor your color swatches, skin-tone harmony, and proportion architecture.
            </p>
          </motion.div>

          {/* Step 3 */}
          <motion.div
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 25 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col items-start border-l border-[#A95239]/30 pl-6 relative"
          >
            <span className="font-serif text-4xl md:text-5xl font-bold text-[#A95239] mb-3">
              03
            </span>
            <h3 className="font-serif text-xl font-medium text-[#F4EFE6] mb-2">
              Dress with Distinction
            </h3>
            <p className="text-xs md:text-sm text-[#E9E1D6]/70 font-sans leading-relaxed">
              Get personalized daily lookbooks attuned to your morning weather and day itinerary. Receive real-time outfit scores with actionable style upgrades.
            </p>
          </motion.div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-24 bg-[#181715] border-t border-[#DED5C8]/10 px-6 md:px-12 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-radial from-[#A95239]/10 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-3xl mx-auto relative z-10 flex flex-col items-center">
          <div className="mb-4">
            <VaynLogo variant="icon" size="md" theme="terracotta" />
          </div>
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#A95239] font-semibold mb-3 font-mono">
            VAYN Atelier Access
          </span>
          <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl font-normal text-[#F4EFE6] tracking-tight mb-6">
            Same You. Better Outfits.
          </h2>
          <p className="text-sm md:text-base text-[#E9E1D6]/80 font-sans max-w-xl mb-10 leading-relaxed">
            Join the new generation of tastemakers building smarter, more expressive personal wardrobes with AI.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Link href="/onboarding">
              <VaynButton
                variant="primary"
                size="lg"
                className="bg-[#A95239] hover:bg-[#8D442F] text-[#F4EFE6] font-medium px-8"
              >
                Start Style Calibration
              </VaynButton>
            </Link>
            <Link href="/scan">
              <VaynButton
                variant="secondary"
                size="lg"
                className="border-[#DED5C8]/30 hover:border-[#A95239] text-[#F4EFE6] px-8"
              >
                Scan An Outfit Now
              </VaynButton>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

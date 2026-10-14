'use client';

import * as React from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { VestraHero } from '@/components/home/vayn-hero';
import { FashionMarquee } from '@/components/home/fashion-marquee';
import { FashionGallery } from '@/components/home/fashion-gallery';
import { StyleDiscoverySection } from '@/components/home/style-discovery';
import { AIStylistSection } from '@/components/home/ai-stylist-showcase';
import { WardrobeSection } from '@/components/home/wardrobe-showcase';
import { ScannerTryOnShowcase } from '@/components/home/scanner-tryon-showcase';
import { FinalCTA } from '@/components/home/final-cta';

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[var(--vestra-bg)] text-[var(--vestra-text)] selection:bg-[var(--vestra-selection-bg)] selection:text-[var(--vestra-selection-text)] transition-colors duration-200">
      {/* 01 — Architectural Sticky Navbar with Theme Switcher */}
      <Header />

      {/* 02 — Cinematic Hero Section with Masked Typography & Layered Panels */}
      <VestraHero />

      {/* 03 — Seamless Dual-Track Continuous Fashion Marquee */}
      <FashionMarquee />

      {/* 04 — Asymmetrical Editorial Fashion Gallery with Hover Zoom */}
      <FashionGallery />

      {/* 05 — Interactive Aesthetic Archetype Discovery & Chromatics */}
      <StyleDiscoverySection />

      {/* 06 — Real-time Meteorological & Contextual AI Stylist Engine */}
      <AIStylistSection />

      {/* 07 — Digital Wardrobe Vault & Capsule Composition Preview */}
      <WardrobeSection />

      {/* 08 — Multimodal Vision Scanner & Neural Virtual Try-On Studio */}
      <ScannerTryOnShowcase />

      {/* 09 — High-Contrast Dramatic Closing Brand Statement */}
      <FinalCTA />

      {/* 10 — Minimal Luxury Atelier Footer */}
      <Footer />
    </main>
  );
}

'use client';

import * as React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

interface GalleryItem {
  id: string;
  index: string;
  title: string;
  subtitle: string;
  category: string;
  imageUrl: string;
  aspectRatio: string;
  colSpan: string;
  palette: string[];
}

const galleryItems: GalleryItem[] = [
  {
    id: 'look-1',
    index: '01 / FORM',
    title: 'Architectural Suiting',
    subtitle: 'Understated volume, structured outerwear, and fluid drape in natural camel wool.',
    category: 'Quiet Luxury',
    imageUrl:
      'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200&auto=format&fit=crop&q=85',
    aspectRatio: 'aspect-[4/5]',
    colSpan: 'lg:col-span-7',
    palette: ['#F7F4EE', '#EDEAE3', '#6E543A'],
  },
  {
    id: 'look-2',
    index: '02 / CONTRAST',
    title: 'Minimal Precision',
    subtitle: 'Clean monochromatic seamlines engineered for contemporary movement.',
    category: 'Minimal Tailored',
    imageUrl:
      'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=1200&auto=format&fit=crop&q=85',
    aspectRatio: 'aspect-[3/4]',
    colSpan: 'lg:col-span-5',
    palette: ['#171411', '#8B6F4E', '#C2A578'],
  },
  {
    id: 'look-3',
    index: '03 / DRAPE',
    title: 'Modern Heritage Knitwear',
    subtitle: 'Textured ribbing with soft shoulder drop, tuned for timeless elegance.',
    category: 'Old Money Modern',
    imageUrl:
      'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=1200&auto=format&fit=crop&q=85',
    aspectRatio: 'aspect-[3/4]',
    colSpan: 'lg:col-span-5',
    palette: ['#EDEAE3', '#6E543A', '#8B6F4E'],
  },
  {
    id: 'look-4',
    index: '04 / CADENCE',
    title: 'Midnight Atelier Eveningwear',
    subtitle: 'Balanced dark luminescence calibrated for seamless evening occasions.',
    category: 'Atelier Signature',
    imageUrl:
      'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=1200&auto=format&fit=crop&q=85',
    aspectRatio: 'aspect-[16/10]',
    colSpan: 'lg:col-span-7',
    palette: ['#171411', '#252018', '#C2A578'],
  },
];

export function FashionGallery() {
  return (
    <section
      id="gallery"
      className="py-24 sm:py-32 px-6 md:px-12 lg:px-16 bg-[var(--vestra-bg)] text-[var(--vestra-text)] border-b border-[var(--vestra-border-soft)] transition-colors duration-200"
    >
      <div className="max-w-7xl mx-auto w-full">
        {/* Section Editorial Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 md:mb-20 gap-6">
          <div className="max-w-2xl">
            <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[var(--vestra-action)] font-bold block mb-2">
              LOOKBOOK ARCHIVE // EDITORIAL STUDY
            </span>
            <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl font-normal text-[var(--vestra-text)] tracking-tight leading-[1.05]">
              Form, Texture, and
              <br />
              <span className="italic font-serif text-[var(--vestra-action)]">Sartorial Contrast.</span>
            </h2>
          </div>

          <p className="text-sm md:text-base text-[var(--vestra-text-body)] max-w-md font-sans leading-relaxed">
            Every ensemble curated by VESTRA respects the tension between volume and silhouette. Explore how textures and tones interact before building your personal capsule.
          </p>
        </div>

        {/* Asymmetrical Editorial Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-10">
          {galleryItems.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.8, delay: idx * 0.12, ease: [0.16, 1, 0.3, 1] }}
              className={`${item.colSpan} flex flex-col group`}
            >
              {/* Image Frame with Clip-Path Reveal on Hover */}
              <div
                className={`relative w-full ${item.aspectRatio} overflow-hidden rounded-sm bg-[var(--vestra-surface-alt)] border border-[var(--vestra-border-soft)] shadow-md`}
              >
                <Image
                  src={item.imageUrl}
                  alt={item.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 600px"
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out brightness-[0.97]"
                />

                {/* Scrim Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent opacity-60 group-hover:opacity-75 transition-opacity duration-300" />

                {/* Top Corner Badge: Index */}
                <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
                  <span className="bg-[var(--vestra-surface)]/90 backdrop-blur-sm text-[var(--vestra-text)] font-mono text-[9px] uppercase tracking-widest px-2.5 py-1 rounded-sm border border-[var(--vestra-border-soft)]">
                    {item.index}
                  </span>
                  <span className="bg-[var(--vestra-bg)]/90 backdrop-blur-sm text-[var(--vestra-text-muted)] font-mono text-[9px] uppercase tracking-wider px-2 py-1 rounded-sm">
                    {item.category}
                  </span>
                </div>

                {/* Bottom Palette Swatches inside Image */}
                <div className="absolute bottom-4 left-4 z-10 flex items-center gap-1.5">
                  {item.palette.map((color, i) => (
                    <span
                      key={i}
                      className="h-3.5 w-3.5 rounded-full border border-black/30 shadow-sm"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>

                {/* Interactive Link Corner */}
                <Link
                  href="/onboarding"
                  className="absolute bottom-4 right-4 z-10 h-8 w-8 rounded-full bg-[var(--vestra-surface)] text-[var(--vestra-text)] hover:bg-[var(--vestra-action)] hover:text-[var(--vestra-action-text)] flex items-center justify-center shadow-lg transition-colors duration-300"
                  aria-label={`Calibrate ${item.title}`}
                >
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>

              {/* Editorial Caption Bar */}
              <div className="mt-4 flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 border-b border-[var(--vestra-border-soft)] pb-3">
                <div>
                  <h3 className="font-serif text-xl sm:text-2xl font-normal text-[var(--vestra-text)] group-hover:text-[var(--vestra-action)] transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-[var(--vestra-text-muted)] mt-0.5 max-w-lg leading-relaxed">
                    {item.subtitle}
                  </p>
                </div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--vestra-action)] shrink-0 font-medium">
                  CALIBRATED
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

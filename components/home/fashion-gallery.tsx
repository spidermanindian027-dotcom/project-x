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
    title: 'Architectural Layering',
    subtitle: 'Understated volume, structured outerwear, and tonal wool drape.',
    category: 'Quiet Luxury',
    imageUrl:
      'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=900&auto=format&fit=crop&q=85',
    aspectRatio: 'aspect-[4/5]',
    colSpan: 'lg:col-span-7',
    palette: ['#F4EFE6', '#E9E1D6', '#24231F'],
  },
  {
    id: 'look-2',
    index: '02 / CONTRAST',
    title: 'Streetwear Linearity',
    subtitle: 'Boxy proportion play anchored with utilitarian accents.',
    category: 'Streetwear Edge',
    imageUrl:
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=900&auto=format&fit=crop&q=85',
    aspectRatio: 'aspect-[3/4]',
    colSpan: 'lg:col-span-5',
    palette: ['#24231F', '#A95239', '#737A60'],
  },
  {
    id: 'look-3',
    index: '03 / DRAPE',
    title: 'Minimal Precision',
    subtitle: 'Clean monochromatic seamlines engineered for modern ease.',
    category: 'Minimal Tailored',
    imageUrl:
      'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=900&auto=format&fit=crop&q=85',
    aspectRatio: 'aspect-[3/4]',
    colSpan: 'lg:col-span-5',
    palette: ['#1C1B18', '#6D6961', '#F4EFE6'],
  },
  {
    id: 'look-4',
    index: '04 / CADENCE',
    title: 'Textural Harmony',
    subtitle: 'Balanced textures calibrated for seamless daytime-to-evening fluidity.',
    category: 'Atelier Signature',
    imageUrl:
      'https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?w=1200&auto=format&fit=crop&q=85',
    aspectRatio: 'aspect-[16/10]',
    colSpan: 'lg:col-span-7',
    palette: ['#A95239', '#E9E1D6', '#24231F'],
  },
];

export function FashionGallery() {
  return (
    <section
      id="gallery"
      className="py-24 sm:py-32 px-6 md:px-12 lg:px-16 bg-[#F4EFE6] text-[#24231F] border-b border-[#DED5C8]"
    >
      <div className="max-w-7xl mx-auto w-full">
        {/* Section Editorial Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 md:mb-20 gap-6">
          <div className="max-w-2xl">
            <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#A95239] font-bold block mb-2">
              LOOKBOOK ARCHIVE // EDITORIAL STUDY
            </span>
            <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl font-normal text-[#24231F] tracking-tight leading-[1.05]">
              Form, Texture, and
              <br />
              <span className="italic font-serif text-[#A95239]">Sartorial Contrast.</span>
            </h2>
          </div>

          <p className="text-sm md:text-base text-[#6D6961] max-w-md font-sans leading-relaxed">
            Every ensemble curated by VAYN respects the tension between volume and silhouette. Explore how textures and tones interact before building your own capsule.
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
                className={`relative w-full ${item.aspectRatio} overflow-hidden rounded-sm bg-[#E9E1D6] border border-[#DED5C8] shadow-md`}
              >
                <Image
                  src={item.imageUrl}
                  alt={item.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 600px"
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out brightness-[0.97]"
                />

                {/* Scrim Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#24231F]/80 via-transparent to-transparent opacity-60 group-hover:opacity-75 transition-opacity duration-300" />

                {/* Top Corner Badge: Index */}
                <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
                  <span className="bg-[#24231F]/90 backdrop-blur-sm text-[#F8F4ED] font-mono text-[9px] uppercase tracking-widest px-2.5 py-1 rounded-sm">
                    {item.index}
                  </span>
                  <span className="bg-[#E9E1D6]/90 backdrop-blur-sm text-[#24231F] font-mono text-[9px] uppercase tracking-wider px-2 py-1 rounded-sm">
                    {item.category}
                  </span>
                </div>

                {/* Bottom Palette Swatches inside Image */}
                <div className="absolute bottom-4 left-4 z-10 flex items-center gap-1.5">
                  {item.palette.map((color, i) => (
                    <span
                      key={i}
                      className="h-3 w-3 rounded-full border border-black/30 shadow-sm"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>

                {/* Interactive Link Corner */}
                <Link
                  href="/onboarding"
                  className="absolute bottom-4 right-4 z-10 h-8 w-8 rounded-full bg-[#F4EFE6] text-[#24231F] hover:bg-[#A95239] hover:text-[#F8F4ED] flex items-center justify-center shadow-lg transition-colors duration-300"
                  aria-label={`Calibrate ${item.title}`}
                >
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>

              {/* Editorial Caption Bar */}
              <div className="mt-4 flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 border-b border-[#DED5C8] pb-3">
                <div>
                  <h3 className="font-serif text-xl sm:text-2xl font-normal text-[#24231F] group-hover:text-[#A95239] transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-[#6D6961] mt-0.5 max-w-lg leading-relaxed">
                    {item.subtitle}
                  </p>
                </div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#737A60] shrink-0 font-medium">
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

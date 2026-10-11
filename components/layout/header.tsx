'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import { Menu, X, ArrowRight } from 'lucide-react';
import { VaynLogo } from '@/components/ui/vayn-logo';
import { VaynButton } from '@/components/ui/vestra-button';

export function Header() {
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setIsScrolled(latest > 20);
  });

  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#F4EFE6]/95 backdrop-blur-md border-b border-[#DED5C8] text-[#24231F] py-3 shadow-sm'
          : 'bg-[#F4EFE6]/80 backdrop-blur-sm py-4 border-b border-[#DED5C8]/60 text-[#24231F]'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
        {/* VAYN Brand Logo */}
        <VaynLogo
          asLink
          href="/"
          variant="full"
          theme="light"
          size="md"
        />

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-7">
          <Link
            href="#gallery"
            className="text-xs uppercase tracking-[0.16em] font-medium text-[#6D6961] hover:text-[#A95239] transition-colors"
          >
            Gallery
          </Link>
          <Link
            href="#discover"
            className="text-xs uppercase tracking-[0.16em] font-medium text-[#6D6961] hover:text-[#A95239] transition-colors"
          >
            Archetypes
          </Link>
          <Link
            href="#stylist"
            className="text-xs uppercase tracking-[0.16em] font-medium text-[#6D6961] hover:text-[#A95239] transition-colors"
          >
            AI Stylist
          </Link>
          <Link
            href="#wardrobe"
            className="text-xs uppercase tracking-[0.16em] font-medium text-[#6D6961] hover:text-[#A95239] transition-colors"
          >
            Wardrobe
          </Link>
          <Link
            href="#tryon"
            className="text-xs uppercase tracking-[0.16em] font-medium text-[#6D6961] hover:text-[#A95239] transition-colors"
          >
            Try-On & Scan
          </Link>
        </nav>

        {/* Desktop CTAs */}
        <div className="hidden md:flex items-center space-x-3">
          <Link href="/login">
            <VaynButton
              variant="secondary"
              size="sm"
              className="border-[#DED5C8] text-[#24231F] hover:bg-[#E9E1D6]"
            >
              Sign In
            </VaynButton>
          </Link>
          <Link href="/onboarding">
            <VaynButton
              variant="primary"
              size="sm"
              className="bg-[#A95239] hover:bg-[#8D442F] text-[#F8F4ED]"
              rightIcon={<ArrowRight className="h-3.5 w-3.5" />}
            >
              Find My Style
            </VaynButton>
          </Link>
        </div>

        {/* Mobile Hamburger */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 focus:outline-none transition-colors text-[#24231F] hover:text-[#A95239]"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="md:hidden bg-[#F4EFE6] text-[#24231F] border-b border-[#DED5C8] px-6 py-6 shadow-xl"
        >
          <div className="flex flex-col space-y-4">
            <Link
              href="#gallery"
              onClick={() => setMobileMenuOpen(false)}
              className="text-xs uppercase tracking-widest text-[#24231F] hover:text-[#A95239] py-2 border-b border-[#DED5C8]"
            >
              Gallery
            </Link>
            <Link
              href="#discover"
              onClick={() => setMobileMenuOpen(false)}
              className="text-xs uppercase tracking-widest text-[#24231F] hover:text-[#A95239] py-2 border-b border-[#DED5C8]"
            >
              Archetypes
            </Link>
            <Link
              href="#stylist"
              onClick={() => setMobileMenuOpen(false)}
              className="text-xs uppercase tracking-widest text-[#24231F] hover:text-[#A95239] py-2 border-b border-[#DED5C8]"
            >
              AI Stylist
            </Link>
            <Link
              href="#wardrobe"
              onClick={() => setMobileMenuOpen(false)}
              className="text-xs uppercase tracking-widest text-[#24231F] hover:text-[#A95239] py-2 border-b border-[#DED5C8]"
            >
              Digital Wardrobe
            </Link>
            <Link
              href="#tryon"
              onClick={() => setMobileMenuOpen(false)}
              className="text-xs uppercase tracking-widest text-[#24231F] hover:text-[#A95239] py-2 border-b border-[#DED5C8]"
            >
              Try-On & Scan
            </Link>
            <div className="pt-4 flex flex-col gap-3">
              <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                <VaynButton variant="secondary" className="w-full border-[#DED5C8] text-[#24231F]">
                  Sign In
                </VaynButton>
              </Link>
              <Link href="/onboarding" onClick={() => setMobileMenuOpen(false)}>
                <VaynButton variant="primary" className="w-full bg-[#A95239] hover:bg-[#8D442F] text-[#F8F4ED]">
                  Find My Style
                </VaynButton>
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </motion.header>
  );
}

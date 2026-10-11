'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import { Menu, X, ArrowRight } from 'lucide-react';
import { VaynLogo } from '@/components/ui/vayn-logo';
import { VestraButton } from '@/components/ui/vestra-button';

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
          ? 'bg-[#F4EFE6]/95 backdrop-blur-md border-b border-[#DED5C8] text-[#24231F] py-3.5 shadow-sm'
          : 'bg-transparent py-5 border-b border-transparent text-[#F4EFE6]'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
        {/* VAYN Brand Logo */}
        <VaynLogo
          asLink
          href="/"
          variant="full"
          theme={isScrolled ? 'light' : 'dark'}
          size="md"
        />

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link
            href="#features"
            className={`text-xs uppercase tracking-[0.16em] font-medium transition-colors ${
              isScrolled
                ? 'text-[#6D6961] hover:text-[#A95239]'
                : 'text-[#E9E1D6]/80 hover:text-[#A95239]'
            }`}
          >
            Features
          </Link>
          <Link
            href="#how-it-works"
            className={`text-xs uppercase tracking-[0.16em] font-medium transition-colors ${
              isScrolled
                ? 'text-[#6D6961] hover:text-[#A95239]'
                : 'text-[#E9E1D6]/80 hover:text-[#A95239]'
            }`}
          >
            How It Works
          </Link>
          <Link
            href="#philosophy"
            className={`text-xs uppercase tracking-[0.16em] font-medium transition-colors ${
              isScrolled
                ? 'text-[#6D6961] hover:text-[#A95239]'
                : 'text-[#E9E1D6]/80 hover:text-[#A95239]'
            }`}
          >
            Philosophy
          </Link>
          <Link
            href="/wardrobe"
            className={`text-xs uppercase tracking-[0.16em] font-medium transition-colors ${
              isScrolled
                ? 'text-[#6D6961] hover:text-[#A95239]'
                : 'text-[#E9E1D6]/80 hover:text-[#A95239]'
            }`}
          >
            Wardrobe
          </Link>
          <Link
            href="/chat"
            className={`text-xs uppercase tracking-[0.16em] font-medium transition-colors ${
              isScrolled
                ? 'text-[#6D6961] hover:text-[#A95239]'
                : 'text-[#E9E1D6]/80 hover:text-[#A95239]'
            }`}
          >
            Stylist
          </Link>
        </nav>

        {/* Desktop CTAs */}
        <div className="hidden md:flex items-center space-x-4">
          <Link href="/login">
            <VestraButton
              variant={isScrolled ? 'secondary' : 'ghost'}
              size="sm"
              className={isScrolled ? 'border-[#DED5C8] text-[#24231F] hover:bg-[#E9E1D6]' : ''}
            >
              Sign In
            </VestraButton>
          </Link>
          <Link href="/onboarding">
            <VestraButton
              variant="primary"
              size="sm"
              rightIcon={<ArrowRight className="h-3.5 w-3.5" />}
            >
              Find My Style
            </VestraButton>
          </Link>
        </div>

        {/* Mobile Hamburger */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`p-1.5 focus:outline-none transition-colors ${
              isScrolled ? 'text-[#24231F] hover:text-[#A95239]' : 'text-[#F4EFE6] hover:text-[#A95239]'
            }`}
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
              href="#features"
              onClick={() => setMobileMenuOpen(false)}
              className="text-xs uppercase tracking-widest text-[#24231F] hover:text-[#A95239] py-2 border-b border-[#DED5C8]"
            >
              Features
            </Link>
            <Link
              href="#how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="text-xs uppercase tracking-widest text-[#24231F] hover:text-[#A95239] py-2 border-b border-[#DED5C8]"
            >
              How It Works
            </Link>
            <Link
              href="#philosophy"
              onClick={() => setMobileMenuOpen(false)}
              className="text-xs uppercase tracking-widest text-[#24231F] hover:text-[#A95239] py-2 border-b border-[#DED5C8]"
            >
              Philosophy
            </Link>
            <Link
              href="/wardrobe"
              onClick={() => setMobileMenuOpen(false)}
              className="text-xs uppercase tracking-widest text-[#24231F] hover:text-[#A95239] py-2 border-b border-[#DED5C8]"
            >
              Digital Wardrobe
            </Link>
            <Link
              href="/chat"
              onClick={() => setMobileMenuOpen(false)}
              className="text-xs uppercase tracking-widest text-[#24231F] hover:text-[#A95239] py-2 border-b border-[#DED5C8]"
            >
              AI Stylist Chat
            </Link>
            <div className="pt-4 flex flex-col gap-3">
              <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                <VestraButton variant="secondary" className="w-full border-[#DED5C8] text-[#24231F]">
                  Sign In
                </VestraButton>
              </Link>
              <Link href="/onboarding" onClick={() => setMobileMenuOpen(false)}>
                <VestraButton variant="primary" className="w-full">
                  Find My Style
                </VestraButton>
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </motion.header>
  );
}

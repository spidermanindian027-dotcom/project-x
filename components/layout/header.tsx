'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { VestraButton } from '@/components/ui/vestra-button';

export function Header() {
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setIsScrolled(latest > 30);
  });

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#1a1a1a]/90 backdrop-blur-md border-b border-[#9ca3af]/15 py-3.5 shadow-lg shadow-black/20'
          : 'bg-transparent py-5 border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="group flex items-baseline gap-1">
          <span className="font-serif text-2xl md:text-3xl font-bold tracking-[0.18em] text-[#f5f0e8] transition-colors group-hover:text-[#e8c547]">
            VESTRA
          </span>
          <span className="h-1.5 w-1.5 rounded-full bg-[#e8c547] inline-block mb-1" />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link
            href="#features"
            className="text-xs uppercase tracking-[0.15em] text-[#d4cfc7] hover:text-[#e8c547] transition-colors font-medium"
          >
            Features
          </Link>
          <Link
            href="#how-it-works"
            className="text-xs uppercase tracking-[0.15em] text-[#d4cfc7] hover:text-[#e8c547] transition-colors font-medium"
          >
            How it works
          </Link>
          <Link
            href="#pricing"
            className="text-xs uppercase tracking-[0.15em] text-[#d4cfc7] hover:text-[#e8c547] transition-colors font-medium"
          >
            Pricing
          </Link>
          <Link
            href="#about"
            className="text-xs uppercase tracking-[0.15em] text-[#d4cfc7] hover:text-[#e8c547] transition-colors font-medium"
          >
            About
          </Link>
        </nav>

        {/* Desktop CTAs */}
        <div className="hidden md:flex items-center space-x-4">
          <Link href="/login">
            <VestraButton variant="ghost" size="sm">
              Sign In
            </VestraButton>
          </Link>
          <Link href="/onboarding">
            <VestraButton variant="primary" size="sm">
              Get Started
            </VestraButton>
          </Link>
        </div>

        {/* Mobile Hamburger */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1 text-[#f5f0e8] hover:text-[#e8c547] focus:outline-none"
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
          className="md:hidden bg-[#1a1a1a]/95 backdrop-blur-xl border-b border-[#9ca3af]/20 px-6 py-6"
        >
          <div className="flex flex-col space-y-4">
            <Link
              href="#features"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm uppercase tracking-widest text-[#f5f0e8] hover:text-[#e8c547] py-2 border-b border-white/5"
            >
              Features
            </Link>
            <Link
              href="#how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm uppercase tracking-widest text-[#f5f0e8] hover:text-[#e8c547] py-2 border-b border-white/5"
            >
              How it works
            </Link>
            <Link
              href="#pricing"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm uppercase tracking-widest text-[#f5f0e8] hover:text-[#e8c547] py-2 border-b border-white/5"
            >
              Pricing
            </Link>
            <div className="pt-4 flex flex-col gap-3">
              <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                <VestraButton variant="secondary" className="w-full">
                  Sign In
                </VestraButton>
              </Link>
              <Link href="/onboarding" onClick={() => setMobileMenuOpen(false)}>
                <VestraButton variant="primary" className="w-full">
                  Get Started
                </VestraButton>
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </motion.header>
  );
}

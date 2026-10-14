'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import { Menu, X, ArrowRight } from 'lucide-react';
import { VestraLogo } from '@/components/ui/vayn-logo';
import { VestraButton } from '@/components/ui/vestra-button';
import { ThemeToggle } from '@/components/ui/theme-toggle';

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
          ? 'bg-[var(--vestra-nav-bg)] backdrop-blur-md border-b border-[var(--vestra-border-soft)] py-3 shadow-sm'
          : 'bg-[var(--vestra-nav-bg)] backdrop-blur-sm py-4 border-b border-[var(--vestra-border-soft)]/50'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
        {/* VESTRA Brand Logo */}
        <VestraLogo
          asLink
          href="/"
          variant="full"
          size="md"
        />

        {/* Desktop Editorial Navigation */}
        <nav className="hidden md:flex items-center space-x-7">
          <Link
            href="#gallery"
            className="text-xs uppercase tracking-[0.18em] font-medium text-[var(--vestra-text-muted)] hover:text-[var(--vestra-action)] transition-colors"
          >
            Lookbook
          </Link>
          <Link
            href="#discover"
            className="text-xs uppercase tracking-[0.18em] font-medium text-[var(--vestra-text-muted)] hover:text-[var(--vestra-action)] transition-colors"
          >
            Archetypes
          </Link>
          <Link
            href="#stylist"
            className="text-xs uppercase tracking-[0.18em] font-medium text-[var(--vestra-text-muted)] hover:text-[var(--vestra-action)] transition-colors"
          >
            Stylist AI
          </Link>
          <Link
            href="#wardrobe"
            className="text-xs uppercase tracking-[0.18em] font-medium text-[var(--vestra-text-muted)] hover:text-[var(--vestra-action)] transition-colors"
          >
            Wardrobe Vault
          </Link>
          <Link
            href="#tryon"
            className="text-xs uppercase tracking-[0.18em] font-medium text-[var(--vestra-text-muted)] hover:text-[var(--vestra-action)] transition-colors"
          >
            Scan & Try-On
          </Link>
        </nav>

        {/* Desktop CTAs & Theme Switcher */}
        <div className="hidden md:flex items-center space-x-3.5">
          <ThemeToggle />

          <Link href="/dashboard">
            <VestraButton
              variant="secondary"
              size="sm"
              className="text-xs font-mono uppercase tracking-wider"
            >
              Atelier
            </VestraButton>
          </Link>
          <Link href="/onboarding">
            <VestraButton
              variant="primary"
              size="sm"
              className="text-xs font-mono uppercase tracking-wider"
              rightIcon={<ArrowRight className="h-3.5 w-3.5" />}
            >
              Find My Style
            </VestraButton>
          </Link>
        </div>

        {/* Mobile Controls (Theme Toggle + Hamburger) */}
        <div className="md:hidden flex items-center space-x-2">
          <ThemeToggle />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 focus:outline-none transition-colors text-[var(--vestra-text)] hover:text-[var(--vestra-action)]"
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
          className="md:hidden bg-[var(--vestra-bg)] text-[var(--vestra-text)] border-b border-[var(--vestra-border)] px-6 py-6 shadow-xl"
        >
          <div className="flex flex-col space-y-4">
            <Link
              href="#gallery"
              onClick={() => setMobileMenuOpen(false)}
              className="text-xs uppercase tracking-widest text-[var(--vestra-text)] hover:text-[var(--vestra-action)] py-2 border-b border-[var(--vestra-border-soft)]"
            >
              Lookbook
            </Link>
            <Link
              href="#discover"
              onClick={() => setMobileMenuOpen(false)}
              className="text-xs uppercase tracking-widest text-[var(--vestra-text)] hover:text-[var(--vestra-action)] py-2 border-b border-[var(--vestra-border-soft)]"
            >
              Archetypes
            </Link>
            <Link
              href="#stylist"
              onClick={() => setMobileMenuOpen(false)}
              className="text-xs uppercase tracking-widest text-[var(--vestra-text)] hover:text-[var(--vestra-action)] py-2 border-b border-[var(--vestra-border-soft)]"
            >
              Stylist AI
            </Link>
            <Link
              href="#wardrobe"
              onClick={() => setMobileMenuOpen(false)}
              className="text-xs uppercase tracking-widest text-[var(--vestra-text)] hover:text-[var(--vestra-action)] py-2 border-b border-[var(--vestra-border-soft)]"
            >
              Wardrobe Vault
            </Link>
            <Link
              href="#tryon"
              onClick={() => setMobileMenuOpen(false)}
              className="text-xs uppercase tracking-widest text-[var(--vestra-text)] hover:text-[var(--vestra-action)] py-2 border-b border-[var(--vestra-border-soft)]"
            >
              Scan & Try-On
            </Link>
            <div className="pt-4 flex flex-col gap-3">
              <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                <VestraButton variant="secondary" className="w-full">
                  Enter Atelier
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

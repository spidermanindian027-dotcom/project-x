import * as React from 'react';
import Link from 'next/link';
import { VestraLogo } from '@/components/ui/vayn-logo';

export function Footer() {
  return (
    <footer className="w-full bg-[var(--vestra-bg-alt)] border-t border-[var(--vestra-border)] pt-16 pb-12 px-6 md:px-12 text-xs transition-colors duration-200">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-[var(--vestra-border-soft)]">
          {/* Brand & Manifesto */}
          <div className="md:col-span-2 space-y-4">
            <VestraLogo variant="full" size="md" />
            <p className="text-[var(--vestra-text-body)] text-sm max-w-sm font-sans leading-relaxed">
              Curated luxury fashion intelligence. Elevating personal aesthetics, orchestrating harmonious proportions, and ensuring effortless personal expression.
            </p>
            <div className="pt-2 flex items-center gap-3 text-[11px] font-mono text-[var(--vestra-action)]">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--vestra-action)] animate-pulse" />
              <span>STYLE, RECONSIDERED.</span>
            </div>
          </div>

          {/* Product Features */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--vestra-text)]">
              Atelier Intelligence
            </h4>
            <ul className="space-y-2.5 text-[var(--vestra-text-muted)] text-xs">
              <li>
                <Link href="/wardrobe" className="hover:text-[var(--vestra-action)] transition-colors">
                  Digital Wardrobe Vault
                </Link>
              </li>
              <li>
                <Link href="/scan" className="hover:text-[var(--vestra-action)] transition-colors">
                  Proportion & Fit Scanner
                </Link>
              </li>
              <li>
                <Link href="/outfits" className="hover:text-[var(--vestra-action)] transition-colors">
                  Capsule Outfit Engine
                </Link>
              </li>
              <li>
                <Link href="/try-on" className="hover:text-[var(--vestra-action)] transition-colors">
                  Virtual Neural Try-On
                </Link>
              </li>
              <li>
                <Link href="/chat" className="hover:text-[var(--vestra-action)] transition-colors">
                  Consult VESTRA Stylist
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Platform */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--vestra-text)]">
              Platform & Maison
            </h4>
            <ul className="space-y-2.5 text-[var(--vestra-text-muted)] text-xs">
              <li>
                <Link href="/styling" className="hover:text-[var(--vestra-action)] transition-colors">
                  Climate & Location Calibration
                </Link>
              </li>
              <li>
                <Link href="/analytics" className="hover:text-[var(--vestra-action)] transition-colors">
                  Wardrobe Telemetry
                </Link>
              </li>
              <li>
                <Link href="/profile" className="hover:text-[var(--vestra-action)] transition-colors">
                  Fashion Fit Profile
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-[var(--vestra-action)] transition-colors">
                  Atelier Studio
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-[var(--vestra-action)] transition-colors">
                  Maison Console
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[var(--vestra-text-muted)]">
          <p>© {new Date().getFullYear()} VESTRA Maison. Style, Reconsidered. All rights reserved.</p>
          <div className="flex items-center space-x-6 uppercase tracking-wider">
            <Link href="#" className="hover:text-[var(--vestra-action)] transition-colors">
              Privacy Protocol
            </Link>
            <Link href="#" className="hover:text-[var(--vestra-action)] transition-colors">
              Atelier Terms
            </Link>
            <Link href="/admin" className="hover:text-[var(--vestra-action)] transition-colors">
              Maison Portal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

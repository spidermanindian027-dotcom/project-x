import * as React from 'react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="w-full bg-[#141414] border-t border-[#9ca3af]/15 py-12 px-6 md:px-12 text-xs">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Brand & Tagline */}
        <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 text-center md:text-left">
          <div className="flex items-baseline justify-center md:justify-start gap-1">
            <span className="font-serif text-lg font-bold tracking-[0.2em] text-[#f5f0e8]">
              VESTRA
            </span>
            <span className="h-1 w-1 rounded-full bg-[#e8c547] inline-block mb-1" />
          </div>
          <span className="hidden md:inline text-[#9ca3af]/40">—</span>
          <p className="text-[#9ca3af] tracking-wide text-[11px]">
            Editorial intelligence for the refined wardrobe.
          </p>
        </div>

        {/* Links */}
        <div className="flex items-center space-x-6 text-[#9ca3af] text-[11px] tracking-wider uppercase">
          <Link
            href="/privacy"
            className="hover:text-[#e8c547] transition-colors"
          >
            Privacy
          </Link>
          <Link
            href="/terms"
            className="hover:text-[#e8c547] transition-colors"
          >
            Terms
          </Link>
          <Link
            href="mailto:concierge@vestra.ai"
            className="hover:text-[#e8c547] transition-colors"
          >
            Contact
          </Link>
        </div>

        {/* Copyright */}
        <div className="text-[11px] text-[#9ca3af]/60 tracking-wider">
          © {new Date().getFullYear()} VESTRA AI. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

import * as React from 'react';
import Link from 'next/link';
import { VaynLogo } from '@/components/ui/vayn-logo';

export function Footer() {
  return (
    <footer className="w-full bg-[#181714] border-t border-[#DED5C8]/15 pt-16 pb-12 px-6 md:px-12 text-xs">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-[#DED5C8]/10">
          {/* Brand & Manifesto */}
          <div className="md:col-span-2 space-y-4">
            <VaynLogo variant="full" size="md" />
            <p className="text-[#E9E1D6]/70 text-sm max-w-sm font-sans leading-relaxed">
              Your personal AI fashion companion. Discover outfits, refine your personal aesthetic, and make every look feel effortlessly like you.
            </p>
            <div className="pt-2 flex items-center gap-3 text-[11px] font-mono text-[#A95239]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#A95239]" />
              <span>Same You. Better Outfits.</span>
            </div>
          </div>

          {/* Product Features */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#F4EFE6]">
              Atelier Tools
            </h4>
            <ul className="space-y-2 text-[#E9E1D6]/70 text-xs">
              <li>
                <Link href="/wardrobe" className="hover:text-[#A95239] transition-colors">
                  Digital Wardrobe Vault
                </Link>
              </li>
              <li>
                <Link href="/scan" className="hover:text-[#A95239] transition-colors">
                  Outfit Proportion Scanner
                </Link>
              </li>
              <li>
                <Link href="/outfits" className="hover:text-[#A95239] transition-colors">
                  AI Wardrobe Matcher
                </Link>
              </li>
              <li>
                <Link href="/try-on" className="hover:text-[#A95239] transition-colors">
                  Virtual Try-On Studio
                </Link>
              </li>
              <li>
                <Link href="/chat" className="hover:text-[#A95239] transition-colors">
                  Ask VAYN Stylist
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Company */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#F4EFE6]">
              Platform
            </h4>
            <ul className="space-y-2 text-[#E9E1D6]/70 text-xs">
              <li>
                <Link href="/styling" className="hover:text-[#A95239] transition-colors">
                  Location & Climate Styling
                </Link>
              </li>
              <li>
                <Link href="/analytics" className="hover:text-[#A95239] transition-colors">
                  Style Analytics
                </Link>
              </li>
              <li>
                <Link href="/profile" className="hover:text-[#A95239] transition-colors">
                  Fashion Fit Profile
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-[#A95239] transition-colors">
                  Client Portal
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#6D6961]">
          <p>© {new Date().getFullYear()} VAYN. Your Style. Smarter. With AI. All rights reserved.</p>
          <div className="flex items-center space-x-6 uppercase tracking-wider">
            <Link href="#" className="hover:text-[#A95239] transition-colors">
              Privacy Notice
            </Link>
            <Link href="#" className="hover:text-[#A95239] transition-colors">
              Terms of Atelier
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

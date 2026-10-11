import * as React from 'react';
import Link from 'next/link';
import { VaynButton } from '@/components/ui/vestra-button';
import { VaynLogo } from '@/components/ui/vayn-logo';
import { ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#1C1B18] text-[#F4EFE6] flex flex-col items-center justify-center p-6 text-center select-none">
      <div className="mb-6">
        <VaynLogo variant="icon" size="md" theme="terracotta" />
      </div>

      <div className="relative mb-6">
        <span className="font-serif text-8xl md:text-9xl text-[#24231F] font-normal tracking-wider block">
          404
        </span>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs uppercase tracking-[0.3em] text-[#A95239] font-mono font-semibold">
            Archived Silhouette
          </span>
        </div>
      </div>

      <h1 className="font-serif text-2xl md:text-3xl font-normal text-[#F4EFE6] mb-2 tracking-tight">
        Look Not Found
      </h1>
      <p className="max-w-md text-xs md:text-sm text-[#6D6961] mb-8 leading-relaxed font-sans">
        The curated lookbook or collection you are seeking is either restricted or no longer in active rotation.
      </p>

      <Link href="/">
        <VaynButton
          variant="primary"
          size="md"
          leftIcon={<ArrowLeft className="h-4 w-4" />}
        >
          Return to VAYN Studio
        </VaynButton>
      </Link>
    </div>
  );
}

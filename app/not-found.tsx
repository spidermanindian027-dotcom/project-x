import * as React from 'react';
import Link from 'next/link';
import { VestraButton } from '@/components/ui/vestra-button';
import { ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#1a1a1a] text-[#f5f0e8] flex flex-col items-center justify-center p-6 text-center select-none">
      <div className="relative mb-6">
        <span className="font-serif text-8xl md:text-9xl text-[#262626] font-normal tracking-wider block">
          404
        </span>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs uppercase tracking-[0.3em] text-[#e8c547] font-semibold">
            Archived Silhouette
          </span>
        </div>
      </div>

      <h1 className="font-serif text-2xl md:text-3xl font-normal text-[#f5f0e8] mb-2 tracking-tight">
        Page Not Found
      </h1>
      <p className="max-w-md text-xs md:text-sm text-[#9ca3af] mb-8 leading-relaxed">
        The curated lookbook or collection you are seeking is either restricted or no longer in active rotation.
      </p>

      <Link href="/">
        <VestraButton
          variant="primary"
          size="md"
          leftIcon={<ArrowLeft className="h-4 w-4" />}
        >
          Return to Studio
        </VestraButton>
      </Link>
    </div>
  );
}

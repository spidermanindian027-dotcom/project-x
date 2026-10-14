import * as React from 'react';
import Link from 'next/link';
import { VestraButton } from '@/components/ui/vestra-button';
import { VestraLogo } from '@/components/ui/vayn-logo';
import { ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[var(--vestra-bg)] text-[var(--vestra-text)] flex flex-col items-center justify-center p-6 text-center select-none transition-colors duration-200">
      <div className="mb-6">
        <VestraLogo variant="icon" size="md" />
      </div>

      <div className="relative mb-6">
        <span className="font-serif text-8xl md:text-9xl text-[var(--vestra-surface-alt)] font-normal tracking-wider block">
          404
        </span>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs uppercase tracking-[0.3em] text-[var(--vestra-action)] font-mono font-semibold">
            Archived Silhouette
          </span>
        </div>
      </div>

      <h1 className="font-serif text-2xl md:text-3xl font-normal text-[var(--vestra-text)] mb-2 tracking-tight">
        Look Not Found
      </h1>
      <p className="max-w-md text-xs md:text-sm text-[var(--vestra-text-muted)] mb-8 leading-relaxed font-sans">
        The curated lookbook or collection you are seeking is either restricted or no longer in active rotation.
      </p>

      <Link href="/">
        <VestraButton
          variant="primary"
          size="md"
          leftIcon={<ArrowLeft className="h-4 w-4" />}
        >
          Return to VESTRA Maison
        </VestraButton>
      </Link>
    </div>
  );
}

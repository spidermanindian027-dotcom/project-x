import * as React from 'react';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { VestraLogo } from '@/components/ui/vayn-logo';

export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[var(--vestra-bg)] text-[var(--vestra-text)] transition-colors duration-200">
      <div className="flex flex-col items-center space-y-6">
        <VestraLogo variant="full" size="md" />
        <LoadingSpinner size="md" />
        <p className="text-[10px] uppercase font-mono tracking-[0.2em] text-[var(--vestra-text-muted)]">
          Loading VESTRA Maison...
        </p>
      </div>
    </div>
  );
}

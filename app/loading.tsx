import * as React from 'react';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { VaynLogo } from '@/components/ui/vayn-logo';

export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#1C1B18] text-[#F4EFE6]">
      <div className="flex flex-col items-center space-y-6">
        <VaynLogo variant="full" size="md" />
        <LoadingSpinner size="md" />
        <p className="text-[10px] uppercase font-mono tracking-[0.2em] text-[#6D6961]">
          Loading VAYN Atelier...
        </p>
      </div>
    </div>
  );
}

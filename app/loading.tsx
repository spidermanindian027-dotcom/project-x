import * as React from 'react';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#1a1a1a] text-[#f5f0e8]">
      <div className="flex flex-col items-center space-y-6">
        <div className="flex items-baseline gap-1">
          <span className="font-serif text-3xl font-bold tracking-[0.25em] text-[#f5f0e8]">
            VESTRA
          </span>
          <span className="h-2 w-2 rounded-full bg-[#e8c547] inline-block mb-1" />
        </div>
        <LoadingSpinner size="md" />
        <p className="text-[10px] uppercase font-mono tracking-[0.2em] text-[#9ca3af]/70">
          Loading atelier assets...
        </p>
      </div>
    </div>
  );
}

'use client';

import * as React from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { VestraButton } from './vestra-button';

export interface ErrorStateProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
  retry?: () => void;
  retryLabel?: string;
}

export function ErrorState({
  title = 'Something went wrong',
  description = 'An unexpected error occurred while loading this section.',
  retry,
  retryLabel = 'Try Again',
  className,
  ...props
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center p-8 text-center border border-red-500/20 bg-red-950/10 rounded-sm',
        className
      )}
      {...props}
    >
      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-red-950/40 text-red-400 border border-red-500/30">
        <AlertCircle className="h-5 w-5" />
      </div>
      <h3 className="font-serif text-lg font-medium text-[#f5f0e8] tracking-wide mb-1.5">
        {title}
      </h3>
      <p className="max-w-md text-xs text-[#9ca3af] leading-relaxed mb-5">
        {description}
      </p>
      {retry && (
        <VestraButton
          variant="secondary"
          size="sm"
          onClick={retry}
          leftIcon={<RotateCcw className="h-3.5 w-3.5" />}
        >
          {retryLabel}
        </VestraButton>
      )}
    </div>
  );
}

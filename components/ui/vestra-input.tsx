'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface VestraInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  rightElement?: React.ReactNode;
}

export const VestraInput = React.forwardRef<HTMLInputElement, VestraInputProps>(
  ({ className, type, label, error, hint, rightElement, id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full space-y-1.5 text-left">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-medium uppercase tracking-wider text-[var(--vestra-text-muted)]"
          >
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          <input
            id={inputId}
            type={type}
            ref={ref}
            className={cn(
              'w-full bg-[var(--vestra-surface)] border border-[var(--vestra-border)] px-3.5 py-2.5 text-sm text-[var(--vestra-text)] placeholder:text-[var(--vestra-text-muted)]/70 focus:border-[var(--vestra-action)] focus:outline-none focus:ring-1 focus:ring-[var(--vestra-action)] transition-all rounded-sm disabled:cursor-not-allowed disabled:opacity-50',
              error && 'border-red-500/70 focus:border-red-500 focus:ring-red-500',
              rightElement && 'pr-10',
              className
            )}
            {...props}
          />
          {rightElement && (
            <div className="absolute right-3 flex items-center text-[var(--vestra-text-muted)]">
              {rightElement}
            </div>
          )}
        </div>
        {error ? (
          <p className="text-xs text-red-400 mt-1">{error}</p>
        ) : hint ? (
          <p className="text-xs text-[var(--vestra-text-muted)]/70 mt-1">{hint}</p>
        ) : null}
      </div>
    );
  }
);

VestraInput.displayName = 'VestraInput';

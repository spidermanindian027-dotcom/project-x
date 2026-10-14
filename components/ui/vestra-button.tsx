'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export const buttonVariants = cva(
  'inline-flex items-center justify-center font-sans font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--vestra-action)] focus-visible:ring-offset-1 focus-visible:ring-offset-[var(--vestra-bg)] disabled:pointer-events-none disabled:opacity-50 select-none cursor-pointer',
  {
    variants: {
      variant: {
        primary:
          'bg-[var(--vestra-action)] text-[var(--vestra-action-text)] font-semibold hover:bg-[var(--vestra-action-hover)] shadow-sm hover:shadow-md active:translate-y-[1px] rounded-sm',
        secondary:
          'border border-[var(--vestra-border)] bg-[var(--vestra-surface)] text-[var(--vestra-text)] hover:bg-[var(--vestra-surface-alt)] hover:border-[var(--vestra-action)] active:translate-y-[1px] rounded-sm',
        ghost:
          'bg-transparent text-[var(--vestra-text-muted)] hover:text-[var(--vestra-text)] hover:bg-[var(--vestra-surface-alt)] rounded-sm',
        outline:
          'border border-[var(--vestra-action)] text-[var(--vestra-action)] hover:bg-[var(--vestra-action)] hover:text-[var(--vestra-action-text)] active:translate-y-[1px] rounded-sm',
        olive:
          'bg-[var(--vestra-accent)] text-[var(--vestra-action-text)] hover:opacity-90 active:translate-y-[1px] rounded-sm',
        destructive:
          'bg-red-950/40 text-red-200 border border-red-800/50 hover:bg-red-900/60 active:translate-y-[1px] rounded-sm',
      },
      size: {
        sm: 'h-8 px-3 text-xs tracking-wider uppercase rounded-sm',
        md: 'h-10 px-5 text-sm tracking-wide rounded-sm',
        lg: 'h-12 px-7 text-sm font-semibold tracking-wider uppercase rounded-sm',
        icon: 'h-9 w-9 p-0 rounded-sm',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

export interface VestraButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const VestraButton = React.forwardRef<HTMLButtonElement, VestraButtonProps>(
  (
    {
      className,
      variant,
      size,
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(buttonVariants({ variant, size }), className)}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin text-current" />
        ) : (
          leftIcon && <span className="mr-2 inline-flex">{leftIcon}</span>
        )}
        <span>{children}</span>
        {!isLoading && rightIcon && (
          <span className="ml-2 inline-flex">{rightIcon}</span>
        )}
      </button>
    );
  }
);

VestraButton.displayName = 'VestraButton';

// Re-export VaynButton as alias
export const VaynButton = VestraButton;
export type VaynButtonProps = VestraButtonProps;

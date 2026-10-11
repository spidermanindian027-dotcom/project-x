'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export const buttonVariants = cva(
  'inline-flex items-center justify-center font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#e8c547] disabled:pointer-events-none disabled:opacity-50 select-none cursor-pointer',
  {
    variants: {
      variant: {
        primary:
          'bg-[#e8c547] text-[#1a1a1a] font-semibold hover:bg-[#c9a93a] shadow-sm active:translate-y-[1px]',
        secondary:
          'border border-[#9ca3af]/30 bg-transparent text-[#f5f0e8] hover:bg-white/5 hover:border-[#9ca3af]/60 active:translate-y-[1px]',
        ghost:
          'bg-transparent text-[#d4cfc7] hover:text-[#f5f0e8] hover:bg-white/5',
        destructive:
          'bg-red-900/40 text-red-200 border border-red-800/50 hover:bg-red-900/60 active:translate-y-[1px]',
      },
      size: {
        sm: 'h-8 px-3 text-xs tracking-wider uppercase rounded-none',
        md: 'h-10 px-5 text-sm tracking-wide rounded-none',
        lg: 'h-12 px-7 text-sm font-semibold tracking-wider uppercase rounded-none',
        icon: 'h-9 w-9 p-0 rounded-none',
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

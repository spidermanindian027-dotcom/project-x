'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export const buttonVariants = cva(
  'inline-flex items-center justify-center font-sans font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A95239] focus-visible:ring-offset-1 focus-visible:ring-offset-[#1C1B18] disabled:pointer-events-none disabled:opacity-50 select-none cursor-pointer',
  {
    variants: {
      variant: {
        primary:
          'bg-[#A95239] text-[#F4EFE6] font-semibold hover:bg-[#8E442F] shadow-sm hover:shadow-md active:translate-y-[1px] rounded-sm',
        secondary:
          'border border-[#DED5C8]/30 bg-[#24231F]/60 text-[#F4EFE6] hover:bg-[#2D2B26] hover:border-[#DED5C8]/60 active:translate-y-[1px] rounded-sm',
        ghost:
          'bg-transparent text-[#E9E1D6] hover:text-[#F4EFE6] hover:bg-[#2D2B26]/60 rounded-sm',
        outline:
          'border border-[#A95239]/60 text-[#A95239] hover:bg-[#A95239]/10 hover:border-[#A95239] active:translate-y-[1px] rounded-sm',
        olive:
          'bg-[#737A60] text-[#F4EFE6] hover:bg-[#5F654F] active:translate-y-[1px] rounded-sm',
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

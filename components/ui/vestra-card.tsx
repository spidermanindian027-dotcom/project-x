import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

export const cardVariants = cva(
  'rounded-sm transition-all duration-200 text-[#f5f0e8]',
  {
    variants: {
      variant: {
        default: 'bg-[#262626] border border-[#9ca3af]/15',
        bordered: 'bg-[#1a1a1a] border border-[#9ca3af]/30 hover:border-[#e8c547]/50',
        elevated: 'bg-[#262626] border border-[#9ca3af]/20 shadow-xl shadow-black/40',
      },
      padding: {
        none: 'p-0',
        sm: 'p-4',
        md: 'p-6',
        lg: 'p-8',
      },
    },
    defaultVariants: {
      variant: 'default',
      padding: 'md',
    },
  }
);

export interface VestraCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

export const VestraCard = React.forwardRef<HTMLDivElement, VestraCardProps>(
  ({ className, variant, padding, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(cardVariants({ variant, padding }), className)}
        {...props}
      />
    );
  }
);

VestraCard.displayName = 'VestraCard';

export const VestraCardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex flex-col space-y-1.5 pb-4 border-b border-[#9ca3af]/15', className)}
    {...props}
  />
));
VestraCardHeader.displayName = 'VestraCardHeader';

export const VestraCardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn('font-serif text-lg font-semibold tracking-wide text-[#f5f0e8]', className)}
    {...props}
  />
));
VestraCardTitle.displayName = 'VestraCardTitle';

export const VestraCardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-xs text-[#9ca3af] leading-relaxed', className)}
    {...props}
  />
));
VestraCardDescription.displayName = 'VestraCardDescription';

export const VestraCardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('pt-4', className)} {...props} />
));
VestraCardContent.displayName = 'VestraCardContent';

export const VestraCardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex items-center pt-4 border-t border-[#9ca3af]/15 mt-4', className)}
    {...props}
  />
));
VestraCardFooter.displayName = 'VestraCardFooter';

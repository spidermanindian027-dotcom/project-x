import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

export const cardVariants = cva(
  'rounded-sm transition-all duration-200 text-[var(--vestra-text)]',
  {
    variants: {
      variant: {
        default: 'bg-[var(--vestra-surface)] border border-[var(--vestra-border-soft)]',
        bordered: 'bg-[var(--vestra-surface-alt)] border border-[var(--vestra-border-soft)] hover:border-[var(--vestra-action)]',
        elevated: 'bg-[var(--vestra-surface)] border border-[var(--vestra-border-soft)] shadow-xl shadow-black/10',
        light: 'bg-[var(--vestra-surface-alt)] text-[var(--vestra-text)] border border-[var(--vestra-border-soft)] shadow-sm',
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
    className={cn('flex flex-col space-y-1.5 pb-4 border-b border-[var(--vestra-border-soft)]', className)}
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
    className={cn('font-serif text-lg font-semibold tracking-wide text-[var(--vestra-text)]', className)}
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
    className={cn('text-xs text-[var(--vestra-text-muted)] leading-relaxed font-sans', className)}
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
    className={cn('flex items-center pt-4 border-t border-[var(--vestra-border-soft)] mt-4', className)}
    {...props}
  />
));
VestraCardFooter.displayName = 'VestraCardFooter';

// Re-export VaynCard alias
export const VaynCard = VestraCard;
export const VaynCardHeader = VestraCardHeader;
export const VaynCardTitle = VestraCardTitle;
export const VaynCardDescription = VestraCardDescription;
export const VaynCardContent = VestraCardContent;
export const VaynCardFooter = VestraCardFooter;

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

export const badgeStatusVariants = cva(
  'inline-flex items-center px-2 py-0.5 text-[10px] uppercase font-semibold tracking-widest border transition-colors select-none rounded-none',
  {
    variants: {
      status: {
        live: 'bg-emerald-950/50 text-emerald-300 border-emerald-700/50',
        'coming-soon': 'bg-white/5 text-[#9ca3af] border-[#9ca3af]/30 italic font-normal',
        beta: 'bg-[#e8c547]/10 text-[#e8c547] border-[#e8c547]/40',
        deprecated: 'bg-red-950/40 text-red-400 border-red-800/40',
      },
      dot: {
        true: 'gap-1.5',
        false: '',
      },
    },
    defaultVariants: {
      status: 'coming-soon',
      dot: false,
    },
  }
);

export interface BadgeStatusProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeStatusVariants> {
  children?: React.ReactNode;
}

export function BadgeStatus({
  className,
  status = 'coming-soon',
  dot = false,
  children,
  ...props
}: BadgeStatusProps) {
  const defaultLabel =
    status === 'coming-soon'
      ? 'Coming Soon'
      : status === 'live'
      ? 'Live'
      : status === 'beta'
      ? 'Beta'
      : 'Deprecated';

  const dotColor =
    status === 'live'
      ? 'bg-emerald-400'
      : status === 'beta'
      ? 'bg-[#e8c547]'
      : status === 'deprecated'
      ? 'bg-red-400'
      : 'bg-[#9ca3af]';

  return (
    <span
      className={cn(badgeStatusVariants({ status, dot }), className)}
      {...props}
    >
      {dot && (
        <span
          className={cn('h-1.5 w-1.5 rounded-full inline-block', dotColor)}
        />
      )}
      {children || defaultLabel}
    </span>
  );
}

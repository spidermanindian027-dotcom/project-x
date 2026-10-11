import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

export const badgeStatusVariants = cva(
  'inline-flex items-center px-2 py-0.5 text-[10px] uppercase font-semibold tracking-widest border transition-colors select-none rounded-sm',
  {
    variants: {
      status: {
        live: 'bg-emerald-950/50 text-emerald-300 border-emerald-700/50',
        'coming-soon': 'bg-[#2D2B26] text-[#E9E1D6]/70 border-[#DED5C8]/25 font-normal',
        beta: 'bg-[#A95239]/15 text-[#A95239] border-[#A95239]/40',
        olive: 'bg-[#737A60]/15 text-[#737A60] border-[#737A60]/40',
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
      : status === 'olive'
      ? 'Curated'
      : 'Deprecated';

  const dotColor =
    status === 'live'
      ? 'bg-emerald-400'
      : status === 'beta'
      ? 'bg-[#A95239]'
      : status === 'olive'
      ? 'bg-[#737A60]'
      : status === 'deprecated'
      ? 'bg-red-400'
      : 'bg-[#6D6961]';

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

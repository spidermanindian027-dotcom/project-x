import * as React from 'react';
import { cn } from '@/lib/utils';

export interface SectionHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  subtitle?: string;
  tag?: string;
  showAccentLine?: boolean;
  align?: 'left' | 'center' | 'right';
  action?: React.ReactNode;
}

export function SectionHeader({
  title,
  subtitle,
  tag,
  showAccentLine = true,
  align = 'left',
  action,
  className,
  ...props
}: SectionHeaderProps) {
  const alignClasses = {
    left: 'text-left items-start',
    center: 'text-center items-center',
    right: 'text-right items-end',
  };

  return (
    <div
      className={cn('flex flex-col', alignClasses[align], className)}
      {...props}
    >
      <div className="flex w-full items-baseline justify-between gap-4">
        <div className={cn('flex flex-col', alignClasses[align])}>
          {tag && (
            <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#e8c547] mb-2">
              {tag}
            </span>
          )}
          <h2 className="font-serif text-2xl md:text-3xl font-normal text-[#f5f0e8] tracking-tight">
            {title}
          </h2>
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>

      {subtitle && (
        <p className="mt-2 text-xs md:text-sm text-[#9ca3af] max-w-xl font-sans leading-relaxed">
          {subtitle}
        </p>
      )}

      {showAccentLine && (
        <div
          className={cn(
            'mt-3.5 h-[1.5px] w-12 bg-[#e8c547]',
            align === 'center' && 'mx-auto',
            align === 'right' && 'ml-auto'
          )}
        />
      )}
    </div>
  );
}

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
  ...props
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center p-8 text-center border border-dashed border-[#9ca3af]/20 bg-[#262626]/40 rounded-sm',
        className
      )}
      {...props}
    >
      {icon && (
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#1a1a1a] text-[#e8c547] border border-[#9ca3af]/20">
          {icon}
        </div>
      )}
      <h3 className="font-serif text-lg font-medium text-[#f5f0e8] tracking-wide mb-1.5">
        {title}
      </h3>
      <p className="max-w-sm text-xs text-[#9ca3af] leading-relaxed mb-5">
        {description}
      </p>
      {action && <div className="mt-1">{action}</div>}
    </div>
  );
}

import * as React from 'react';
import Link from 'next/link';

export interface VestraLogoProps {
  variant?: 'full' | 'icon' | 'wordmark' | 'compact';
  theme?: 'dark' | 'light' | 'terracotta' | 'monochrome';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  asLink?: boolean;
  href?: string;
}

export function VestraLogo({
  variant = 'full',
  theme = 'light',
  size = 'md',
  className = '',
  asLink = false,
  href = '/',
}: VestraLogoProps) {
  // Dimensions map
  const dimensions = {
    sm: { icon: 20, text: 'text-lg', tracking: 'tracking-[0.22em]' },
    md: { icon: 26, text: 'text-2xl', tracking: 'tracking-[0.24em]' },
    lg: { icon: 34, text: 'text-3xl', tracking: 'tracking-[0.26em]' },
    xl: { icon: 44, text: 'text-5xl', tracking: 'tracking-[0.28em]' },
  }[size];

  // Theme colors using VESTRA semantic tokens
  const markColor =
    theme === 'monochrome'
      ? 'var(--vestra-text)'
      : 'var(--vestra-action)';

  const starColor =
    theme === 'monochrome'
      ? 'var(--vestra-text-muted)'
      : 'var(--vestra-accent)';

  const textColor =
    theme === 'monochrome'
      ? 'text-[var(--vestra-text)]'
      : theme === 'terracotta'
      ? 'text-[var(--vestra-action)]'
      : 'text-[var(--vestra-text)]';

  // Distinctive Geometric V Symbol combined with four-point editorial sparkle
  const IconMark = (
    <div
      className="relative flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 duration-300"
      style={{ width: dimensions.icon, height: dimensions.icon }}
    >
      <svg
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {/* Background container when icon-only */}
        {variant === 'icon' && (
          <rect
            width="40"
            height="40"
            rx="10"
            fill="var(--vestra-surface)"
            stroke="var(--vestra-border)"
            strokeOpacity="0.8"
            strokeWidth="1.2"
          />
        )}

        {/* Geometric High-Fashion V Monogram */}
        <path
          d="M7 9L18.5 32C19.2 33.5 21.2 33.5 21.9 32L33.5 9"
          stroke={markColor}
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Inner Facet / Fold Line */}
        <path
          d="M14 12L20.2 27"
          stroke={markColor}
          strokeWidth="1.5"
          strokeOpacity="0.6"
          strokeLinecap="round"
        />

        {/* Four-Point Editorial Sparkle (Discovery & Personal Style) */}
        <path
          d="M31 10C31 12.8 28.5 14 26 14C28.5 14 31 15.2 31 18C31 15.2 33.5 14 36 14C33.5 14 31 12.8 31 10Z"
          fill={starColor}
        />
      </svg>
    </div>
  );

  const Wordmark = (
    <span
      className={`font-sans font-bold uppercase ${dimensions.text} ${dimensions.tracking} ${textColor} transition-colors leading-none`}
    >
      VESTRA
    </span>
  );

  const content = (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {variant !== 'wordmark' && IconMark}
      {variant !== 'icon' && Wordmark}
    </div>
  );

  if (asLink) {
    return (
      <Link href={href} className="group inline-flex items-center focus:outline-none">
        {content}
      </Link>
    );
  }

  return content;
}

// Re-export VaynLogo as alias for backward compatibility
export const VaynLogo = VestraLogo;
export type VaynLogoProps = VestraLogoProps;

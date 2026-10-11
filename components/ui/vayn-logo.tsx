import * as React from 'react';
import Link from 'next/link';

export interface VaynLogoProps {
  variant?: 'full' | 'icon' | 'wordmark' | 'compact';
  theme?: 'dark' | 'light' | 'terracotta' | 'monochrome';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  asLink?: boolean;
  href?: string;
}

export function VaynLogo({
  variant = 'full',
  theme = 'dark',
  size = 'md',
  className = '',
  asLink = false,
  href = '/',
}: VaynLogoProps) {
  // Dimensions map
  const dimensions = {
    sm: { icon: 20, text: 'text-lg', tracking: 'tracking-[0.22em]' },
    md: { icon: 26, text: 'text-2xl', tracking: 'tracking-[0.24em]' },
    lg: { icon: 34, text: 'text-3xl', tracking: 'tracking-[0.26em]' },
    xl: { icon: 44, text: 'text-5xl', tracking: 'tracking-[0.28em]' },
  }[size];

  // Theme colors
  const markColor =
    theme === 'light'
      ? '#A95239' // Terracotta
      : theme === 'terracotta'
      ? '#A95239'
      : theme === 'monochrome'
      ? '#F4EFE6'
      : '#A95239'; // Terracotta default accent

  const starColor =
    theme === 'light'
      ? '#A95239'
      : theme === 'terracotta'
      ? '#A95239'
      : '#E9E1D6'; // Warm Sand sparkle

  const textColor =
    theme === 'light'
      ? 'text-[#24231F]'
      : theme === 'terracotta'
      ? 'text-[#A95239]'
      : 'text-[#F4EFE6]';

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
            fill="#24231F"
            stroke="#DED5C8"
            strokeOpacity="0.25"
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
          strokeOpacity="0.5"
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
      VAYN
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

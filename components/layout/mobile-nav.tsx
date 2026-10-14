'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, ShoppingBag, Layers, Sparkles, User } from 'lucide-react';
import { cn } from '@/lib/utils';

export function MobileNav() {
  const pathname = usePathname();

  const items = [
    { label: 'Home', href: '/dashboard', icon: Home },
    { label: 'Wardrobe', href: '/wardrobe', icon: ShoppingBag },
    { label: 'Outfits', href: '/outfits', icon: Layers },
    { label: 'Scan', href: '/scan', icon: Sparkles },
    { label: 'Profile', href: '/profile', icon: User },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[var(--vestra-surface)]/95 backdrop-blur-lg border-t border-[var(--vestra-border-soft)] px-3 py-2 flex items-center justify-around transition-colors duration-200">
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;

        return (
          <Link
            key={item.label}
            href={item.href}
            className={cn(
              'flex flex-col items-center justify-center py-1 px-2 text-[10px] tracking-wider transition-colors',
              isActive
                ? 'text-[var(--vestra-action)] font-semibold'
                : 'text-[var(--vestra-text-muted)] hover:text-[var(--vestra-text)]'
            )}
          >
            <Icon
              className={cn(
                'h-5 w-5 mb-1 transition-transform',
                isActive && 'scale-110 text-[var(--vestra-action)]'
              )}
            />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

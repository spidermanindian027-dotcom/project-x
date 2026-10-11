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
    { label: 'Wardrobe', href: '/dashboard#wardrobe', icon: ShoppingBag },
    { label: 'Outfits', href: '/dashboard#outfits', icon: Layers },
    { label: 'AI', href: '/onboarding', icon: Sparkles },
    { label: 'Profile', href: '/dashboard#profile', icon: User },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#1a1a1a]/95 backdrop-blur-lg border-t border-[#9ca3af]/20 px-3 py-2 flex items-center justify-around">
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
                ? 'text-[#e8c547]'
                : 'text-[#9ca3af] hover:text-[#f5f0e8]'
            )}
          >
            <Icon
              className={cn(
                'h-5 w-5 mb-1 transition-transform',
                isActive && 'scale-110'
              )}
            />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

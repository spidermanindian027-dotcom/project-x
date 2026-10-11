'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  ShoppingBag,
  Layers,
  TrendingUp,
  BarChart2,
  Settings2,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Camera,
  UserCircle2,
  MessageSquare,
  Compass,
  Sparkles,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { BadgeStatus } from '@/components/ui/badge-status';

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  isReady?: boolean;
}

const navItems: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: Home, isReady: true },
  { label: 'Wardrobe', href: '/wardrobe', icon: ShoppingBag, isReady: true },
  { label: 'Outfits', href: '/outfits', icon: Layers, isReady: true },
  { label: 'Scanner', href: '/scan', icon: Camera, isReady: true },
  { label: 'Stylist Chat', href: '/chat', icon: MessageSquare, isReady: true },
  { label: 'Styling & Weather', href: '/styling', icon: Compass, isReady: true },
  { label: 'Virtual Try-On', href: '/try-on', icon: Sparkles, isReady: true },
  { label: 'Personal Analytics', href: '/analytics', icon: BarChart2, isReady: true },
  { label: 'Profile', href: '/profile', icon: UserCircle2, isReady: true },
  { label: 'Trends', href: '/dashboard#trends', icon: TrendingUp, isReady: false },
  { label: 'Settings', href: '/dashboard#settings', icon: Settings2, isReady: false },
];

export function AppSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = React.useState(false);

  return (
    <aside
      className={cn(
        'hidden md:flex flex-col border-r border-[#DED5C8]/10 bg-[#1F1E1B] transition-all duration-300 min-h-[calc(100vh-57px)] sticky top-[57px] shrink-0',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Collapse Toggle */}
      <div className="flex items-center justify-end px-3 py-2 border-b border-[#DED5C8]/10">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 text-[#6D6961] hover:text-[#F4EFE6] hover:bg-white/5 rounded transition-colors"
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </button>
      </div>

      {/* Nav List */}
      <nav className="flex-1 py-4 space-y-1 px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                'group flex items-center gap-3 px-3 py-2.5 text-xs font-medium transition-all rounded relative',
                isActive
                  ? 'bg-[#A95239]/12 text-[#F4EFE6] border-l-2 border-[#A95239]'
                  : 'text-[#6D6961] hover:text-[#F4EFE6] hover:bg-white/5 border-l-2 border-transparent'
              )}
              title={collapsed ? item.label : undefined}
            >
              <Icon
                className={cn(
                  'h-4 w-4 shrink-0 transition-colors',
                  isActive ? 'text-[#A95239]' : 'text-[#6D6961] group-hover:text-[#F4EFE6]'
                )}
              />
              {!collapsed && (
                <div className="flex items-center justify-between flex-1">
                  <span className="tracking-wide">{item.label}</span>
                  {!item.isReady && (
                    <BadgeStatus
                      status="coming-soon"
                      className="text-[8px] py-0 px-1 opacity-70 group-hover:opacity-100"
                    >
                      TODO
                    </BadgeStatus>
                  )}
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User Info / Editorial Badge Bottom */}
      <div className="p-3 border-t border-[#DED5C8]/10 bg-[#24231F]/60">
        {collapsed ? (
          <div className="flex justify-center text-[#A95239]" title="VAYN Atelier Member">
            <ShieldCheck className="h-5 w-5" />
          </div>
        ) : (
          <div className="flex items-center justify-between text-[11px]">
            <div className="flex flex-col">
              <span className="text-[#F4EFE6] font-medium tracking-wide">
                VAYN Atelier
              </span>
              <span className="text-[#6D6961] text-[10px]">Active Member</span>
            </div>
            <span className="h-2 w-2 rounded-full bg-[#A95239] animate-pulse" />
          </div>
        )}
      </div>
    </aside>
  );
}

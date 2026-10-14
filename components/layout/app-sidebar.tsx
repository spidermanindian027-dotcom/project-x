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
        'hidden md:flex flex-col border-r border-[var(--vestra-border-soft)] bg-[var(--vestra-surface)] transition-all duration-300 min-h-[calc(100vh-57px)] sticky top-[57px] shrink-0',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Collapse Toggle */}
      <div className="flex items-center justify-end px-3 py-2 border-b border-[var(--vestra-border-soft)]">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 text-[var(--vestra-text-muted)] hover:text-[var(--vestra-text)] hover:bg-[var(--vestra-surface-alt)] rounded transition-colors cursor-pointer"
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
                  ? 'bg-[var(--vestra-action)]/15 text-[var(--vestra-text)] border-l-2 border-[var(--vestra-action)]'
                  : 'text-[var(--vestra-text-muted)] hover:text-[var(--vestra-text)] hover:bg-[var(--vestra-surface-alt)] border-l-2 border-transparent'
              )}
              title={collapsed ? item.label : undefined}
            >
              <Icon
                className={cn(
                  'h-4 w-4 shrink-0 transition-colors',
                  isActive ? 'text-[var(--vestra-action)]' : 'text-[var(--vestra-text-muted)] group-hover:text-[var(--vestra-text)]'
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
      <div className="p-3 border-t border-[var(--vestra-border-soft)] bg-[var(--vestra-surface-alt)]">
        {collapsed ? (
          <div className="flex justify-center text-[var(--vestra-action)]" title="VESTRA Maison Member">
            <ShieldCheck className="h-5 w-5" />
          </div>
        ) : (
          <div className="flex items-center justify-between text-[11px]">
            <div className="flex flex-col">
              <span className="text-[var(--vestra-text)] font-medium tracking-wide">
                VESTRA Maison
              </span>
              <span className="text-[var(--vestra-text-muted)] text-[10px]">Active Member</span>
            </div>
            <span className="h-2 w-2 rounded-full bg-[var(--vestra-action)] animate-pulse" />
          </div>
        )}
      </div>
    </aside>
  );
}

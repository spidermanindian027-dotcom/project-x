'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Bell, Search, User, Settings, LogOut, ChevronDown, Shield } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { BadgeStatus } from '@/components/ui/badge-status';
import { VestraLogo } from '@/components/ui/vayn-logo';
import { ThemeToggle } from '@/components/ui/theme-toggle';

interface AppHeaderProps {
  initialUser?: {
    id: string;
    fullName: string;
    email: string;
    role: string;
  } | null;
}

export function AppHeader({ initialUser }: AppHeaderProps) {
  const router = useRouter();
  const [profileDropdownOpen, setProfileDropdownOpen] = React.useState(false);
  const [user, setUser] = React.useState(initialUser || null);
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);

  React.useEffect(() => {
    if (!initialUser) {
      fetch('/api/auth/me')
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data?.user) {
            setUser(data.user);
          }
        })
        .catch(() => {});
    }
  }, [initialUser]);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await fetch('/api/auth/logout', { method: 'POST' });
      setProfileDropdownOpen(false);
      router.push('/login');
      router.refresh();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const getInitials = (name?: string) => {
    if (!name) return 'VA';
    return name
      .split(' ')
      .map((part) => part[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  const displayName = user?.fullName || 'Atelier Client';
  const displayEmail = user?.email || 'client@vestra.ai';
  const isAdmin = user?.role === 'ADMIN';

  return (
    <header className="sticky top-0 z-40 w-full bg-[var(--vestra-surface)] border-b border-[var(--vestra-border-soft)] px-4 md:px-8 py-3.5 flex items-center justify-between transition-colors duration-200">
      {/* Brand */}
      <div className="flex items-center gap-6">
        <VestraLogo variant="compact" size="sm" asLink href="/dashboard" />
        <span className="hidden md:inline-flex text-[10px] uppercase font-mono tracking-widest text-[var(--vestra-action)] border border-[var(--vestra-border-soft)] px-2 py-0.5 rounded-xs bg-[var(--vestra-surface-alt)] font-semibold">
          Atelier Studio
        </span>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3 md:gap-5">
        {/* Theme Toggle */}
        <ThemeToggle />

        {/* Search Bar / Icon (TODO) */}
        <button
          className="hidden md:flex items-center gap-2 px-3 py-1.5 text-xs text-[var(--vestra-text-muted)] bg-[var(--vestra-surface-alt)] border border-[var(--vestra-border-soft)] rounded hover:border-[var(--vestra-action)] transition-colors cursor-pointer"
          title="Search wardrobe & looks"
        >
          <Search className="h-3.5 w-3.5" />
          <span>Quick search...</span>
          <kbd className="text-[10px] font-mono bg-[var(--vestra-bg)] px-1.5 py-0.5 rounded text-[var(--vestra-text-muted)] border border-[var(--vestra-border-soft)]">⌘K</kbd>
          <BadgeStatus status="coming-soon" className="ml-1 text-[9px] py-0 px-1">TODO</BadgeStatus>
        </button>

        {/* Admin Atelier Command button */}
        {isAdmin && (
          <Link
            href="/admin"
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 text-xs border border-[var(--vestra-action)]/40 text-[var(--vestra-action)] bg-[var(--vestra-action)]/10 hover:bg-[var(--vestra-action)]/20 rounded transition-colors"
          >
            <Shield className="h-3 w-3 text-[var(--vestra-action)]" />
            <span className="font-mono text-[10px] tracking-wider uppercase font-semibold">Admin Command</span>
          </Link>
        )}

        {/* Notifications Icon (TODO) */}
        <div className="relative">
          <button
            className="p-2 text-[var(--vestra-text-muted)] hover:text-[var(--vestra-text)] transition-colors relative cursor-pointer"
            title="Notifications"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-[var(--vestra-action)]" />
          </button>
        </div>

        {/* User Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
            className="flex items-center gap-2.5 p-1 rounded hover:bg-[var(--vestra-surface-alt)] transition-colors focus:outline-none cursor-pointer"
          >
            <Avatar className="h-8 w-8 rounded-full border border-[var(--vestra-border)] bg-[var(--vestra-surface-alt)]">
              <AvatarImage src="" alt={displayName} />
              <AvatarFallback className="bg-[var(--vestra-surface-alt)] text-[var(--vestra-action)] text-xs font-semibold">
                {getInitials(displayName)}
              </AvatarFallback>
            </Avatar>
            <div className="hidden md:flex flex-col text-left">
              <span className="text-xs font-medium text-[var(--vestra-text)]">{displayName}</span>
              <span className="text-[10px] text-[var(--vestra-text-muted)] flex items-center gap-1">
                {isAdmin ? (
                  <>
                    <Shield className="h-2.5 w-2.5 text-[var(--vestra-action)]" />
                    <span>Director (Admin)</span>
                  </>
                ) : (
                  'Atelier Member'
                )}
              </span>
            </div>
            <ChevronDown className="hidden md:block h-3.5 w-3.5 text-[var(--vestra-text-muted)]" />
          </button>

          {/* Dropdown Menu */}
          {profileDropdownOpen && (
            <div className="absolute right-0 mt-2 w-60 bg-[var(--vestra-surface)] border border-[var(--vestra-border-soft)] rounded shadow-2xl py-2 z-50 text-xs">
              <div className="px-3 py-2 border-b border-[var(--vestra-border-soft)] mb-1">
                <p className="font-medium text-[var(--vestra-text)] truncate">{displayName}</p>
                <p className="text-[10px] text-[var(--vestra-text-muted)] truncate">{displayEmail}</p>
                {isAdmin && (
                  <span className="inline-block mt-1 text-[9px] uppercase font-mono tracking-wider text-[var(--vestra-action)] bg-[var(--vestra-action)]/10 px-1.5 py-0.5 border border-[var(--vestra-action)]/30 rounded">
                    Admin Privilege
                  </span>
                )}
              </div>

              {/* Admin Atelier (Only for Role.ADMIN) */}
              {isAdmin && (
                <Link
                  href="/admin"
                  onClick={() => setProfileDropdownOpen(false)}
                  className="w-full flex items-center justify-between px-3 py-2 text-[var(--vestra-action)] hover:bg-[var(--vestra-surface-alt)] text-left"
                >
                  <div className="flex items-center gap-2">
                    <Shield className="h-3.5 w-3.5 text-[var(--vestra-action)]" />
                    <span className="font-medium">Admin Atelier Command</span>
                  </div>
                  <span className="text-[9px] font-mono px-1 py-0.5 bg-[var(--vestra-action)]/15 border border-[var(--vestra-action)]/40 rounded text-[var(--vestra-action)] font-semibold">
                    ACTIVE
                  </span>
                </Link>
              )}

              {/* Profile */}
              <Link
                href="/profile"
                onClick={() => setProfileDropdownOpen(false)}
                className="w-full flex items-center justify-between px-3 py-2 text-[var(--vestra-text)] hover:bg-[var(--vestra-surface-alt)] text-left"
              >
                <div className="flex items-center gap-2">
                  <User className="h-3.5 w-3.5 text-[var(--vestra-text-muted)]" />
                  <span>Profile</span>
                </div>
              </Link>

              {/* Settings (TODO) */}
              <button
                onClick={() => setProfileDropdownOpen(false)}
                className="w-full flex items-center justify-between px-3 py-2 text-[var(--vestra-text)] hover:bg-[var(--vestra-surface-alt)] text-left cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Settings className="h-3.5 w-3.5 text-[var(--vestra-text-muted)]" />
                  <span>Settings</span>
                </div>
                <BadgeStatus status="coming-soon" className="text-[9px] py-0 px-1">TODO</BadgeStatus>
              </button>

              <div className="h-px bg-[var(--vestra-border-soft)] my-1" />

              {/* Logout button */}
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="w-full flex items-center justify-between px-3 py-2 text-red-500 hover:bg-red-500/10 text-left transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <LogOut className="h-3.5 w-3.5 text-red-500" />
                  <span>{isLoggingOut ? 'Signing out...' : 'Sign Out'}</span>
                </div>
                <span className="text-[10px] text-[var(--vestra-text-muted)] font-mono">session</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Bell, Search, User, Settings, LogOut, ChevronDown, Shield } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { BadgeStatus } from '@/components/ui/badge-status';

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
    <header className="sticky top-0 z-40 w-full bg-[#1a1a1a]/95 backdrop-blur-md border-b border-[#9ca3af]/15 px-4 md:px-8 py-3.5 flex items-center justify-between">
      {/* Brand */}
      <div className="flex items-center gap-6">
        <Link href="/dashboard" className="flex items-baseline gap-1">
          <span className="font-serif text-xl md:text-2xl font-bold tracking-[0.16em] text-[#f5f0e8]">
            VESTRA
          </span>
          <span className="h-1.5 w-1.5 rounded-full bg-[#e8c547] inline-block mb-1" />
        </Link>
        <span className="hidden md:inline-flex text-[10px] uppercase font-mono tracking-widest text-[#9ca3af]/60 border border-[#9ca3af]/20 px-2 py-0.5">
          Studio v1.0
        </span>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3 md:gap-5">
        {/* Search Bar / Icon (TODO) */}
        <button
          className="hidden md:flex items-center gap-2 px-3 py-1.5 text-xs text-[#9ca3af] bg-[#262626] border border-[#9ca3af]/20 rounded-sm hover:border-[#e8c547]/50 transition-colors"
          title="Search wardrobe & looks (Phase 3)"
        >
          <Search className="h-3.5 w-3.5" />
          <span>Quick search...</span>
          <kbd className="text-[10px] font-mono bg-black/40 px-1.5 py-0.5 rounded text-[#9ca3af]">⌘K</kbd>
          <BadgeStatus status="coming-soon" className="ml-1 text-[9px] py-0 px-1">TODO</BadgeStatus>
        </button>

        {/* Admin Atelier Command button */}
        {isAdmin && (
          <Link
            href="/admin"
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 text-xs border border-[#e8c547]/40 text-[#e8c547] bg-[#e8c547]/10 hover:bg-[#e8c547]/20 rounded-sm transition-colors"
          >
            <Shield className="h-3 w-3 text-[#e8c547]" />
            <span className="font-mono text-[10px] tracking-wider uppercase font-semibold">Admin Command</span>
          </Link>
        )}

        {/* Notifications Icon (TODO) */}
        <div className="relative">
          <button
            className="p-2 text-[#9ca3af] hover:text-[#f5f0e8] transition-colors relative"
            title="Notifications (Phase 3)"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-[#e8c547]" />
          </button>
        </div>

        {/* User Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
            className="flex items-center gap-2.5 p-1 rounded hover:bg-white/5 transition-colors focus:outline-none"
          >
            <Avatar className="h-8 w-8 rounded-full border border-[#e8c547]/40 bg-[#262626]">
              <AvatarImage src="" alt={displayName} />
              <AvatarFallback className="bg-[#262626] text-[#e8c547] text-xs font-semibold">
                {getInitials(displayName)}
              </AvatarFallback>
            </Avatar>
            <div className="hidden md:flex flex-col text-left">
              <span className="text-xs font-medium text-[#f5f0e8]">{displayName}</span>
              <span className="text-[10px] text-[#9ca3af] flex items-center gap-1">
                {isAdmin ? (
                  <>
                    <Shield className="h-2.5 w-2.5 text-[#e8c547]" />
                    <span>Director (Admin)</span>
                  </>
                ) : (
                  'Private Client'
                )}
              </span>
            </div>
            <ChevronDown className="hidden md:block h-3.5 w-3.5 text-[#9ca3af]" />
          </button>

          {/* Dropdown Menu */}
          {profileDropdownOpen && (
            <div className="absolute right-0 mt-2 w-60 bg-[#262626] border border-[#9ca3af]/20 rounded-sm shadow-2xl py-2 z-50 text-xs">
              <div className="px-3 py-2 border-b border-[#9ca3af]/15 mb-1">
                <p className="font-medium text-[#f5f0e8] truncate">{displayName}</p>
                <p className="text-[10px] text-[#9ca3af] truncate">{displayEmail}</p>
                {isAdmin && (
                  <span className="inline-block mt-1 text-[9px] uppercase font-mono tracking-wider text-[#e8c547] bg-[#e8c547]/10 px-1.5 py-0.5 border border-[#e8c547]/30 rounded-sm">
                    Admin Privilege
                  </span>
                )}
              </div>

              {/* Admin Atelier (Only for Role.ADMIN) */}
              {isAdmin && (
                <Link
                  href="/admin"
                  onClick={() => setProfileDropdownOpen(false)}
                  className="w-full flex items-center justify-between px-3 py-2 text-[#e8c547] hover:bg-white/5 text-left"
                >
                  <div className="flex items-center gap-2">
                    <Shield className="h-3.5 w-3.5 text-[#e8c547]" />
                    <span className="font-medium">Admin Atelier Command</span>
                  </div>
                  <span className="text-[9px] font-mono px-1 py-0.5 bg-[#e8c547]/15 border border-[#e8c547]/40 rounded text-[#e8c547]">
                    ACTIVE
                  </span>
                </Link>
              )}

              {/* Profile (TODO) */}
              <button
                onClick={() => setProfileDropdownOpen(false)}
                className="w-full flex items-center justify-between px-3 py-2 text-[#d4cfc7] hover:bg-white/5 text-left"
              >
                <div className="flex items-center gap-2">
                  <User className="h-3.5 w-3.5 text-[#9ca3af]" />
                  <span>Profile</span>
                </div>
                <BadgeStatus status="coming-soon" className="text-[9px] py-0 px-1">TODO</BadgeStatus>
              </button>

              {/* Settings (TODO) */}
              <button
                onClick={() => setProfileDropdownOpen(false)}
                className="w-full flex items-center justify-between px-3 py-2 text-[#d4cfc7] hover:bg-white/5 text-left"
              >
                <div className="flex items-center gap-2">
                  <Settings className="h-3.5 w-3.5 text-[#9ca3af]" />
                  <span>Settings</span>
                </div>
                <BadgeStatus status="coming-soon" className="text-[9px] py-0 px-1">TODO</BadgeStatus>
              </button>

              <div className="h-px bg-[#9ca3af]/15 my-1" />

              {/* Logout button */}
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="w-full flex items-center justify-between px-3 py-2 text-red-400 hover:bg-white/5 text-left transition-colors"
              >
                <div className="flex items-center gap-2">
                  <LogOut className="h-3.5 w-3.5 text-red-400" />
                  <span>{isLoggingOut ? 'Signing out...' : 'Sign Out'}</span>
                </div>
                <span className="text-[10px] text-[#9ca3af] font-mono">session</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

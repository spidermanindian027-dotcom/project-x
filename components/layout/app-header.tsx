'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Bell, Search, User, Settings, LogOut, ChevronDown, Shield } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { BadgeStatus } from '@/components/ui/badge-status';
import { VaynLogo } from '@/components/ui/vayn-logo';

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
  const displayEmail = user?.email || 'client@vayn.ai';
  const isAdmin = user?.role === 'ADMIN';

  return (
    <header className="sticky top-0 z-40 w-full bg-[#1F1E1B]/95 backdrop-blur-md border-b border-[#DED5C8]/10 px-4 md:px-8 py-3.5 flex items-center justify-between">
      {/* Brand */}
      <div className="flex items-center gap-6">
        <VaynLogo variant="compact" size="sm" asLink href="/dashboard" />
        <span className="hidden md:inline-flex text-[10px] uppercase font-mono tracking-widest text-[#737A60] border border-[#737A60]/30 px-2 py-0.5 rounded-xs bg-[#737A60]/10">
          Atelier Studio
        </span>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3 md:gap-5">
        {/* Search Bar / Icon (TODO) */}
        <button
          className="hidden md:flex items-center gap-2 px-3 py-1.5 text-xs text-[#6D6961] bg-[#292824] border border-[#DED5C8]/15 rounded hover:border-[#A95239]/50 transition-colors"
          title="Search wardrobe & looks"
        >
          <Search className="h-3.5 w-3.5" />
          <span>Quick search...</span>
          <kbd className="text-[10px] font-mono bg-black/40 px-1.5 py-0.5 rounded text-[#6D6961]">⌘K</kbd>
          <BadgeStatus status="coming-soon" className="ml-1 text-[9px] py-0 px-1">TODO</BadgeStatus>
        </button>

        {/* Admin Atelier Command button */}
        {isAdmin && (
          <Link
            href="/admin"
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 text-xs border border-[#A95239]/40 text-[#A95239] bg-[#A95239]/10 hover:bg-[#A95239]/20 rounded transition-colors"
          >
            <Shield className="h-3 w-3 text-[#A95239]" />
            <span className="font-mono text-[10px] tracking-wider uppercase font-semibold">Admin Command</span>
          </Link>
        )}

        {/* Notifications Icon (TODO) */}
        <div className="relative">
          <button
            className="p-2 text-[#6D6961] hover:text-[#F4EFE6] transition-colors relative"
            title="Notifications"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-[#A95239]" />
          </button>
        </div>

        {/* User Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
            className="flex items-center gap-2.5 p-1 rounded hover:bg-white/5 transition-colors focus:outline-none"
          >
            <Avatar className="h-8 w-8 rounded-full border border-[#A95239]/40 bg-[#292824]">
              <AvatarImage src="" alt={displayName} />
              <AvatarFallback className="bg-[#292824] text-[#A95239] text-xs font-semibold">
                {getInitials(displayName)}
              </AvatarFallback>
            </Avatar>
            <div className="hidden md:flex flex-col text-left">
              <span className="text-xs font-medium text-[#F4EFE6]">{displayName}</span>
              <span className="text-[10px] text-[#6D6961] flex items-center gap-1">
                {isAdmin ? (
                  <>
                    <Shield className="h-2.5 w-2.5 text-[#A95239]" />
                    <span>Director (Admin)</span>
                  </>
                ) : (
                  'Atelier Member'
                )}
              </span>
            </div>
            <ChevronDown className="hidden md:block h-3.5 w-3.5 text-[#6D6961]" />
          </button>

          {/* Dropdown Menu */}
          {profileDropdownOpen && (
            <div className="absolute right-0 mt-2 w-60 bg-[#24231F] border border-[#DED5C8]/20 rounded shadow-2xl py-2 z-50 text-xs">
              <div className="px-3 py-2 border-b border-[#DED5C8]/10 mb-1">
                <p className="font-medium text-[#F4EFE6] truncate">{displayName}</p>
                <p className="text-[10px] text-[#6D6961] truncate">{displayEmail}</p>
                {isAdmin && (
                  <span className="inline-block mt-1 text-[9px] uppercase font-mono tracking-wider text-[#A95239] bg-[#A95239]/10 px-1.5 py-0.5 border border-[#A95239]/30 rounded">
                    Admin Privilege
                  </span>
                )}
              </div>

              {/* Admin Atelier (Only for Role.ADMIN) */}
              {isAdmin && (
                <Link
                  href="/admin"
                  onClick={() => setProfileDropdownOpen(false)}
                  className="w-full flex items-center justify-between px-3 py-2 text-[#A95239] hover:bg-white/5 text-left"
                >
                  <div className="flex items-center gap-2">
                    <Shield className="h-3.5 w-3.5 text-[#A95239]" />
                    <span className="font-medium">Admin Atelier Command</span>
                  </div>
                  <span className="text-[9px] font-mono px-1 py-0.5 bg-[#A95239]/15 border border-[#A95239]/40 rounded text-[#A95239]">
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

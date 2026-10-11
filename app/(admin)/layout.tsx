import * as React from 'react';
import { getCurrentUser } from '@/lib/auth/session';
import { Role } from '@prisma/client';
import Link from 'next/link';
import { ArrowLeft, LogOut } from 'lucide-react';
import { AdminPasswordGate } from '@/components/admin/admin-password-gate';
import { VaynLogo } from '@/components/ui/vayn-logo';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  const isAdmin = user && user.role === Role.ADMIN;

  // If not authenticated as administrator, display the secure password gate directly on /admin
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#141414] text-[#F4EFE6] flex flex-col justify-center items-center px-4 py-12 selection:bg-[#A95239] selection:text-[#F8F4ED]">
        <AdminPasswordGate />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#141414] text-[#F4EFE6] flex flex-col font-sans selection:bg-[#A95239] selection:text-[#F8F4ED]">
      {/* Admin Top Command Header */}
      <header className="sticky top-0 z-50 w-full bg-[#181715]/95 backdrop-blur-md border-b border-[#DED5C8]/15 px-4 md:px-8 py-3.5 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-xs text-[#6D6961] hover:text-[#F4EFE6] transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span className="hidden sm:inline font-mono">Return to Studio</span>
          </Link>
          <div className="h-4 w-px bg-[#DED5C8]/15" />
          <div className="flex items-center gap-2.5">
            <VaynLogo variant="icon" size="sm" theme="terracotta" />
            <span className="font-serif text-lg font-bold tracking-wider text-[#F4EFE6]">
              VAYN <span className="text-[#A95239] font-mono text-xs font-normal tracking-widest ml-1 uppercase">Director Atelier</span>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 px-2.5 py-1 rounded bg-[#24231F] border border-[#DED5C8]/15 text-[11px] font-mono text-[#6D6961]">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>ROOT TELEMETRY ACTIVE</span>
          </div>

          <div className="text-right">
            <p className="text-xs font-medium text-[#F4EFE6] leading-tight">{user.fullName}</p>
            <p className="text-[10px] font-mono text-[#A95239] uppercase tracking-wider">Root Administrator</p>
          </div>

          <form action="/api/auth/logout" method="POST">
            <button
              type="submit"
              className="p-1.5 rounded hover:bg-white/5 text-[#6D6961] hover:text-[#A95239] transition-colors"
              title="Lock Admin Console"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </form>
        </div>
      </header>

      {/* Main Administrative Viewport */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-8">
        {children}
      </main>
    </div>
  );
}

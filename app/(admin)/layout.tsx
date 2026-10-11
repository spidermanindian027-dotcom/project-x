import * as React from 'react';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth/session';
import { Role } from '@prisma/client';
import Link from 'next/link';
import { Shield, ArrowLeft } from 'lucide-react';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login?from=/admin');
  }

  if (user.role !== Role.ADMIN) {
    redirect('/dashboard');
  }

  return (
    <div className="min-h-screen bg-[#141414] text-[#f5f0e8] flex flex-col font-sans selection:bg-[#e8c547] selection:text-black">
      {/* Admin Top Command Header */}
      <header className="sticky top-0 z-50 w-full bg-[#171717]/95 backdrop-blur-md border-b border-[#9ca3af]/20 px-4 md:px-8 py-3.5 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="flex items-center gap-2 text-xs text-[#9ca3af] hover:text-[#f5f0e8] transition-colors">
            <ArrowLeft className="h-3.5 w-3.5" />
            <span className="hidden sm:inline font-mono">Return to Studio</span>
          </Link>
          <div className="h-4 w-px bg-[#9ca3af]/20" />
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded bg-[#e8c547]/15 border border-[#e8c547]/40 flex items-center justify-center text-[#e8c547]">
              <Shield className="h-3.5 w-3.5" />
            </div>
            <span className="font-serif text-lg font-bold tracking-wider text-[#f5f0e8]">
              VESTRA <span className="text-[#e8c547] font-mono text-xs font-normal tracking-widest ml-1 uppercase">Director Atelier</span>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 px-2.5 py-1 rounded bg-[#262626] border border-[#9ca3af]/20 text-[11px] font-mono text-[#9ca3af]">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>OPERATIONAL TELEMETRY LIVE</span>
          </div>
          <div className="text-right">
            <p className="text-xs font-medium text-[#f5f0e8] leading-tight">{user.fullName}</p>
            <p className="text-[10px] font-mono text-[#e8c547] uppercase tracking-wider">Root Administrator</p>
          </div>
        </div>
      </header>

      {/* Main Administrative Viewport */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-8">
        {children}
      </main>
    </div>
  );
}

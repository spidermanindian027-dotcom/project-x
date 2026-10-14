import * as React from 'react';
import { getCurrentUser } from '@/lib/auth/session';
import { Role } from '@prisma/client';
import Link from 'next/link';
import { ArrowLeft, LogOut } from 'lucide-react';
import { AdminPasswordGate } from '@/components/admin/admin-password-gate';
import { VestraLogo } from '@/components/ui/vayn-logo';

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
      <div className="min-h-screen bg-[var(--vestra-bg)] text-[var(--vestra-text)] flex flex-col justify-center items-center px-4 py-12 selection:bg-[var(--vestra-selection-bg)] selection:text-[var(--vestra-selection-text)] transition-colors duration-200">
        <AdminPasswordGate />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--vestra-bg)] text-[var(--vestra-text)] flex flex-col font-sans selection:bg-[var(--vestra-selection-bg)] selection:text-[var(--vestra-selection-text)] transition-colors duration-200">
      {/* Admin Top Command Header */}
      <header className="sticky top-0 z-50 w-full bg-[var(--vestra-surface)] border-b border-[var(--vestra-border-soft)] px-4 md:px-8 py-3.5 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-xs text-[var(--vestra-text-muted)] hover:text-[var(--vestra-text)] transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span className="hidden sm:inline font-mono">Return to Studio</span>
          </Link>
          <div className="h-4 w-px bg-[var(--vestra-border-soft)]" />
          <div className="flex items-center gap-2.5">
            <VestraLogo variant="icon" size="sm" />
            <span className="font-serif text-lg font-bold tracking-wider text-[var(--vestra-text)]">
              VESTRA <span className="text-[var(--vestra-action)] font-mono text-xs font-normal tracking-widest ml-1 uppercase">Director Maison</span>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 px-2.5 py-1 rounded bg-[var(--vestra-surface-alt)] border border-[var(--vestra-border-soft)] text-[11px] font-mono text-[var(--vestra-text-muted)]">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>ROOT TELEMETRY ACTIVE</span>
          </div>

          <div className="text-right">
            <p className="text-xs font-medium text-[var(--vestra-text)] leading-tight">{user.fullName}</p>
            <p className="text-[10px] font-mono text-[var(--vestra-action)] uppercase tracking-wider font-semibold">Maison Director</p>
          </div>

          <form action="/api/auth/logout" method="POST">
            <button
              type="submit"
              className="p-1.5 rounded hover:bg-[var(--vestra-surface-alt)] text-[var(--vestra-text-muted)] hover:text-red-400 transition-colors cursor-pointer"
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

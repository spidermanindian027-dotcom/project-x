import * as React from 'react';
import { getCurrentUser } from '@/lib/auth/session';
import { AppHeader } from '@/components/layout/app-header';
import { AppSidebar } from '@/components/layout/app-sidebar';
import { MobileNav } from '@/components/layout/mobile-nav';

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  return (
    <div className="min-h-screen bg-[var(--vestra-bg)] text-[var(--vestra-text)] flex flex-col pb-16 md:pb-0 transition-colors duration-200">
      <AppHeader initialUser={user} />
      <div className="flex flex-1 w-full">
        <AppSidebar />
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-8 overflow-y-auto">
          {children}
        </main>
      </div>
      <MobileNav />
    </div>
  );
}

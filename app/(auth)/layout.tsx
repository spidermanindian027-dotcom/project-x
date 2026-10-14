import * as React from 'react';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[var(--vestra-bg)] text-[var(--vestra-text)] flex flex-col justify-center transition-colors duration-200">
      {children}
    </div>
  );
}

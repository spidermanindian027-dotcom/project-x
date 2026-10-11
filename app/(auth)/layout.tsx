import * as React from 'react';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#1a1a1a] text-[#f5f0e8] flex flex-col justify-center">
      {children}
    </div>
  );
}

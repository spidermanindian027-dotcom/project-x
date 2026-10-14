'use client';

import * as React from 'react';
import Link from 'next/link';
import { ErrorState } from '@/components/ui/error-state';
import { VestraButton } from '@/components/ui/vestra-button';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    console.error('App Error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[var(--vestra-bg)] text-[var(--vestra-text)] flex flex-col items-center justify-center p-6 transition-colors duration-200">
      <div className="w-full max-w-md">
        <ErrorState
          title="Atelier Execution Error"
          description={
            error.message ||
            'A styling engine exception occurred. Please retry or return to the atelier dashboard.'
          }
          retry={reset}
          retryLabel="Retry Current View"
        />
        <div className="mt-4 text-center">
          <Link href="/">
            <VestraButton variant="ghost" size="sm">
              Return to VESTRA Homepage
            </VestraButton>
          </Link>
        </div>
      </div>
    </div>
  );
}

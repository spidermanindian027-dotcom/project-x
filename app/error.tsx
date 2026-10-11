'use client';

import * as React from 'react';
import Link from 'next/link';
import { ErrorState } from '@/components/ui/error-state';
import { VaynButton } from '@/components/ui/vestra-button';

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
    <div className="min-h-screen bg-[#1C1B18] text-[#F4EFE6] flex flex-col items-center justify-center p-6">
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
            <VaynButton variant="ghost" size="sm">
              Return to VAYN Homepage
            </VaynButton>
          </Link>
        </div>
      </div>
    </div>
  );
}

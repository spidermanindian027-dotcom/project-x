'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { VestraButton } from '@/components/ui/vestra-button';
import { VestraInput } from '@/components/ui/vestra-input';
import { BadgeStatus } from '@/components/ui/badge-status';
import { VaynLogo } from '@/components/ui/vayn-logo';
import { AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTarget = searchParams.get('from') || '/dashboard';

  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMessage(data.error || 'Invalid email or password.');
        setIsLoading(false);
        return;
      }

      router.push(redirectTarget);
      router.refresh();
    } catch {
      setErrorMessage('Network error during authentication. Please retry.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#1C1B18]">
      {/* Left Panel (40%) - Editorial Showcase */}
      <div className="hidden md:flex md:w-2/5 bg-[#181715] border-r border-[#DED5C8]/10 p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,#A9523915,transparent_60%)] pointer-events-none" />

        {/* Brand */}
        <div className="z-10">
          <VaynLogo variant="full" size="md" asLink href="/" />
        </div>

        {/* Center Quote */}
        <div className="relative z-10 max-w-sm">
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#A95239] font-mono font-semibold block mb-4">
            Vol. I — The Collection
          </span>
          <blockquote className="font-serif italic text-2xl text-[#F4EFE6] leading-relaxed mb-4">
            “Elegance is not standing out, but being remembered.”
          </blockquote>
          <p className="text-xs text-[#6D6961] tracking-wider uppercase font-mono">— Giorgio Armani</p>
        </div>

        {/* Footer info */}
        <div className="text-[11px] text-[#6D6961] tracking-wider z-10 font-mono">
          © {new Date().getFullYear()} VAYN Atelier. Your Style. Smarter.
        </div>
      </div>

      {/* Right Panel (60%) - Form Area */}
      <div className="flex-1 bg-[#1C1B18] flex flex-col justify-center items-center px-6 py-12 md:px-16">
        <div className="w-full max-w-md">
          {/* Mobile Brand Link */}
          <div className="md:hidden mb-8 flex justify-center">
            <VaynLogo variant="full" size="md" asLink href="/" />
          </div>

          {/* Secure Environment Info Banner */}
          <div className="mb-6 p-3 bg-[#24231F] border border-[#A95239]/30 rounded flex flex-col gap-1 text-xs">
            <div className="flex items-center justify-between text-[#E9E1D6]">
              <span className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#A95239] animate-pulse" />
                <span className="font-medium text-[#F4EFE6]">VAYN Atelier Authentication</span>
              </span>
              <BadgeStatus status="live" className="text-[9px] py-0 px-1">
                ONLINE
              </BadgeStatus>
            </div>
            <p className="text-[10px] text-[#6D6961] mt-0.5 font-mono">
              Admin: <code className="text-[#A95239]">admin@vestra.ai</code> | Client: <code className="text-[#A95239]">client@vestra.ai</code>
            </p>
          </div>

          <div className="mb-8">
            <h1 className="font-serif text-3xl font-normal text-[#F4EFE6] tracking-tight">
              Sign In to VAYN
            </h1>
            <p className="text-xs text-[#6D6961] mt-1.5">
              Enter your credentials to access your curated digital wardrobe.
            </p>
          </div>

          {errorMessage && (
            <div className="mb-6 p-3 bg-red-950/40 border border-red-500/40 rounded-sm flex items-start gap-2.5 text-xs text-red-200">
              <AlertCircle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <VestraInput
              label="Email"
              type="email"
              placeholder="elena@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <div>
              <VestraInput
                label="Password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <div className="flex justify-end mt-1.5">
                <button
                  type="button"
                  onClick={() => alert('Password reset is coming soon.')}
                  className="text-[11px] text-[#6D6961] hover:text-[#A95239] transition-colors"
                >
                  Forgot password? <span className="text-[9px] text-[#A95239]">(TODO)</span>
                </button>
              </div>
            </div>

            <VestraButton
              type="submit"
              variant="primary"
              className="w-full mt-2"
              isLoading={isLoading}
            >
              Sign In
            </VestraButton>
          </form>

          {/* Divider */}
          <div className="relative my-6 flex items-center justify-center">
            <div className="border-t border-[#DED5C8]/15 w-full" />
            <span className="bg-[#1C1B18] px-3 text-[11px] uppercase tracking-widest text-[#6D6961] absolute font-mono">
              or
            </span>
          </div>

          {/* Google OAuth Button (TODO) */}
          <div className="w-full">
            <button
              type="button"
              disabled
              className="w-full py-2.5 px-4 bg-[#24231F] border border-[#DED5C8]/15 rounded text-xs font-medium text-[#6D6961] flex items-center justify-center gap-3 cursor-not-allowed opacity-75"
              title="Google Single Sign-On coming soon"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12.24 10.285V13.4h6.887C18.2 16.14 15.645 18 12.24 18c-3.315 0-6-2.685-6-6s2.685-6 6-6c1.47 0 2.812.527 3.86 1.405l2.368-2.367C17.065 3.655 14.815 3 12.24 3 7.27 3 3.24 7.03 3.24 12s4.03 9 9 9c5.2 0 8.7-3.655 8.7-8.86 0-.585-.06-1.155-.165-1.705h-8.535z" />
              </svg>
              <span>Continue with Google</span>
              <BadgeStatus status="coming-soon" className="text-[8px] py-0 px-1">
                TODO
              </BadgeStatus>
            </button>
          </div>

          <div className="mt-8 text-center text-xs text-[#6D6961]">
            Don&apos;t have an account?{' '}
            <Link
              href="/register"
              className="text-[#A95239] hover:underline font-medium"
            >
              Create one
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

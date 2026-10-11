'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { VestraButton } from '@/components/ui/vestra-button';
import { VestraInput } from '@/components/ui/vestra-input';
import { BadgeStatus } from '@/components/ui/badge-status';
import { VaynLogo } from '@/components/ui/vayn-logo';
import { AlertCircle } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [fullName, setFullName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    if (password.length < 8) {
      setErrorMessage('Password must be at least 8 characters long.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, email, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        if (data.details) {
          const firstErr = Object.values(data.details).flat()[0] as string;
          setErrorMessage(firstErr || data.error || 'Registration failed.');
        } else {
          setErrorMessage(data.error || 'Registration failed.');
        }
        setIsLoading(false);
        return;
      }

      router.push('/onboarding');
      router.refresh();
    } catch {
      setErrorMessage('Network error during registration. Please retry.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#1C1B18]">
      {/* Left Panel (40%) - Editorial Showcase */}
      <div className="hidden md:flex md:w-2/5 bg-[#181715] border-r border-[#DED5C8]/10 p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,#A9523915,transparent_60%)] pointer-events-none" />

        {/* Brand */}
        <div className="z-10">
          <VaynLogo variant="full" size="md" asLink href="/" />
        </div>

        {/* Center Quote */}
        <div className="relative z-10 max-w-sm">
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#A95239] font-mono font-semibold block mb-4">
            Vol. II — The Silhouette
          </span>
          <blockquote className="font-serif italic text-2xl text-[#F4EFE6] leading-relaxed mb-4">
            “Style is a way to say who you are without having to speak.”
          </blockquote>
          <p className="text-xs text-[#6D6961] tracking-wider uppercase font-mono">— Rachel Zoe</p>
        </div>

        {/* Footer info */}
        <div className="text-[11px] text-[#6D6961] tracking-wider z-10 font-mono">
          © {new Date().getFullYear()} VAYN Atelier. Same You. Better Outfits.
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
          <div className="mb-6 p-3 bg-[#24231F] border border-[#A95239]/30 rounded flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-[#E9E1D6]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#A95239] animate-pulse" />
              <span>VAYN Atelier Membership Registration Active</span>
            </div>
            <BadgeStatus status="live" className="text-[9px] py-0 px-1">
              LIVE
            </BadgeStatus>
          </div>

          <div className="mb-8">
            <h1 className="font-serif text-3xl font-normal text-[#F4EFE6] tracking-tight">
              Create Account
            </h1>
            <p className="text-xs text-[#6D6961] mt-1.5">
              Begin your personal style journey with VAYN AI.
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
              label="Full Name"
              type="text"
              placeholder="Elena Vance"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />

            <VestraInput
              label="Email"
              type="email"
              placeholder="elena@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <VestraInput
              label="Password (min 8 chars, letter & number)"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <VestraInput
              label="Confirm Password"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />

            <VestraButton
              type="submit"
              variant="primary"
              className="w-full mt-2"
              isLoading={isLoading}
            >
              Create Account
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
            Already have an account?{' '}
            <Link
              href="/login"
              className="text-[#A95239] hover:underline font-medium"
            >
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

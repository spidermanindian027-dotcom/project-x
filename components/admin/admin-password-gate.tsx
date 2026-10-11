'use client';

import * as React from 'react';
import Link from 'next/link';
import { Shield, Lock, Eye, EyeOff, ArrowRight, ArrowLeft, AlertCircle } from 'lucide-react';
import { VaynButton } from '@/components/ui/vestra-button';
import { VaynLogo } from '@/components/ui/vayn-logo';

export function AdminPasswordGate() {
  const [password, setPassword] = React.useState('');
  const [email, setEmail] = React.useState('admin@vestra.ai');
  const [showPassword, setShowPassword] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) {
      setError('Please enter the administrator password.');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password: password.trim() }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok || !data?.success) {
        setError(data?.error || 'Incorrect administrator password. Access denied.');
        return;
      }

      // Successful verification: reload to display the unlocked admin dashboard
      window.location.reload();
    } catch {
      setError('Connection failure while verifying administrator credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-[#1C1B18] border border-[#DED5C8]/20 rounded-sm p-8 sm:p-10 shadow-2xl relative overflow-hidden">
        {/* Subtle Top Accent Bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-[#A95239]" />

        {/* Brand Header */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="mb-4">
            <VaynLogo variant="icon" size="md" theme="terracotta" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-sm bg-[#A95239]/10 border border-[#A95239]/30 text-[#A95239] font-mono text-[10px] uppercase tracking-widest mb-3">
            <Shield className="h-3 w-3" />
            <span>ROOT GOVERNANCE</span>
          </div>

          <h1 className="font-serif text-3xl font-normal text-[#F4EFE6] tracking-tight">
            Admin Access Required
          </h1>
          <p className="text-xs text-[#E9E1D6]/70 mt-2 font-sans leading-relaxed max-w-xs">
            Enter the administrator password to unlock the Atelier Director console.
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-3 bg-red-950/40 border border-red-500/40 rounded-sm flex items-start gap-2.5 text-xs text-red-200">
            <AlertCircle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Password Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-[11px] font-mono uppercase tracking-widest text-[#E9E1D6]/80 mb-1.5">
              Admin Account
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#24231F] border border-[#DED5C8]/20 rounded-sm px-3.5 py-2.5 text-xs text-[#F4EFE6] focus:outline-none focus:border-[#A95239] transition-colors font-mono"
              placeholder="admin@vestra.ai"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-[11px] font-mono uppercase tracking-widest text-[#E9E1D6]/80">
                Administrator Password
              </label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-[10px] font-mono text-[#A95239] hover:underline flex items-center gap-1"
              >
                {showPassword ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                <span>{showPassword ? 'Hide' : 'Show'}</span>
              </button>
            </div>

            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                autoFocus
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#24231F] border border-[#DED5C8]/20 rounded-sm px-3.5 py-2.5 text-xs text-[#F4EFE6] focus:outline-none focus:border-[#A95239] transition-colors pr-10 font-mono tracking-wider"
                placeholder="Enter admin password"
              />
              <Lock className="absolute right-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#6D6961] pointer-events-none" />
            </div>
          </div>

          <VaynButton
            type="submit"
            variant="primary"
            size="md"
            isLoading={isLoading}
            className="w-full bg-[#A95239] hover:bg-[#8D442F] text-[#F8F4ED] font-medium py-3"
            rightIcon={<ArrowRight className="h-4 w-4" />}
          >
            Unlock Admin Panel
          </VaynButton>
        </form>

        {/* Footer Navigation */}
        <div className="mt-8 pt-6 border-t border-[#DED5C8]/10 flex items-center justify-between text-xs">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-[#6D6961] hover:text-[#E9E1D6] transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Return to Studio</span>
          </Link>

          <span className="text-[10px] font-mono text-[#737A60]">
            VAYN GOVERNANCE
          </span>
        </div>
      </div>
    </div>
  );
}

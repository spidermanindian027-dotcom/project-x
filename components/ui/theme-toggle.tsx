'use client';

import * as React from 'react';
import { useTheme } from 'next-themes';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';

export interface ThemeToggleProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const emptySubscribe = () => () => {};

export function ThemeToggle({ className = '', size = 'md' }: ThemeToggleProps) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  
  // Hydration-safe client check using useSyncExternalStore (React 19 / Next 16 compliant)
  const mounted = React.useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-9 h-9',
    lg: 'w-10 h-10',
  }[size];

  const iconSizes = {
    sm: 16,
    md: 18,
    lg: 20,
  }[size];

  // Hydration mismatch guard
  if (!mounted) {
    return (
      <div
        className={`inline-flex items-center justify-center rounded-sm border border-[var(--vestra-border)] bg-[var(--vestra-surface)] text-[var(--vestra-text)] opacity-0 pointer-events-none ${sizeClasses} ${className}`}
        aria-hidden="true"
      />
    );
  }

  const currentTheme = theme === 'system' ? resolvedTheme : theme;
  const isDark = currentTheme === 'dark';

  const toggleTheme = () => {
    setTheme(isDark ? 'light' : 'dark');
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className={`relative inline-flex items-center justify-center rounded-sm border border-[var(--vestra-border)] bg-[var(--vestra-surface)] text-[var(--vestra-text)] hover:text-[var(--vestra-action)] hover:border-[var(--vestra-action)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--vestra-focus-ring)] transition-colors duration-200 cursor-pointer overflow-hidden ${sizeClasses} ${className}`}
    >
      <AnimatePresence mode="wait" initial={false}>
        {isDark ? (
          <motion.div
            key="moon"
            initial={{ opacity: 0, rotate: -45, scale: 0.7 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: 45, scale: 0.7 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="flex items-center justify-center"
          >
            <Moon size={iconSizes} strokeWidth={1.75} />
          </motion.div>
        ) : (
          <motion.div
            key="sun"
            initial={{ opacity: 0, rotate: 45, scale: 0.7 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: -45, scale: 0.7 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="flex items-center justify-center"
          >
            <Sun size={iconSizes} strokeWidth={1.75} />
          </motion.div>
        )}
      </AnimatePresence>
    </button>
  );
}

import type { Metadata } from 'next';
import { Playfair_Display, Sora } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/providers/theme-provider';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
});

const sora = Sora({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'VESTRA — Curated Luxury Fashion & Style Intelligence',
  description:
    'Discover your personal aesthetic, elevate daily curation, explore high-fashion trends, and unlock your digital wardrobe with VESTRA.',
  keywords: [
    'luxury fashion',
    'curated style',
    'fashion intelligence',
    'outfit scanner',
    'capsule wardrobe',
    'AI stylist',
    'personal styling',
    'VESTRA',
    'editorial wardrobe',
  ],
  authors: [{ name: 'VESTRA' }],
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`scroll-smooth ${playfair.variable} ${sora.variable}`}
    >
      <body className="min-h-screen bg-[var(--vestra-bg)] text-[var(--vestra-text)] font-sans antialiased selection:bg-[var(--vestra-selection-bg)] selection:text-[var(--vestra-selection-text)] transition-colors duration-200">
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}

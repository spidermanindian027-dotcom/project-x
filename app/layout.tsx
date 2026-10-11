import type { Metadata } from 'next';
import { Playfair_Display, Inter } from 'next/font/google';
import './globals.css';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'VESTRA — Editorial Fashion AI Platform',
  description:
    'Curated wardrobe intelligence, high-fashion AI styling, and editorial lookbook curation.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`dark scroll-smooth ${playfair.variable} ${inter.variable}`}
    >
      <body className="min-h-screen bg-[#1a1a1a] text-[#f5f0e8] font-sans antialiased selection:bg-[#e8c547] selection:text-[#1a1a1a]">
        {children}
      </body>
    </html>
  );
}

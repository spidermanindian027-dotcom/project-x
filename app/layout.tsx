import type { Metadata } from 'next';
import { Playfair_Display, Sora } from 'next/font/google';
import './globals.css';

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
  title: 'VAYN — Your Style. Smarter. With AI.',
  description:
    'Discover your personal style, elevate daily outfits, explore curated fashion trends, and unlock your digital wardrobe with VAYN.',
  keywords: [
    'fashion AI',
    'outfit scanner',
    'capsule wardrobe',
    'AI stylist',
    'personal styling',
    'VAYN',
    'Gen Z style',
  ],
  authors: [{ name: 'VAYN' }],
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
      className={`scroll-smooth ${playfair.variable} ${sora.variable}`}
    >
      <body className="min-h-screen bg-[#1C1B18] text-[#F4EFE6] font-sans antialiased selection:bg-[#A95239] selection:text-[#F4EFE6]">
        {children}
      </body>
    </html>
  );
}

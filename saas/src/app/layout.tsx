import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Complia -- Conformite EU AI Act | Diagnostic en 5 minutes',
  description:
    'Votre entreprise utilise l\'IA ? Evaluez votre exposition a l\'EU AI Act en 5 minutes. Amendes jusqu\'a 35M EUR ou 7% du CA mondial.',
  openGraph: {
    title: 'Complia -- Etes-vous en conformite avec l\'EU AI Act ?',
    description:
      'Amendes jusqu\'a 35M EUR ou 7% du CA mondial. Decouvrez votre exposition en 5 minutes.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${inter.variable} h-full`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col font-sans antialiased bg-white dark:bg-gray-950 text-gray-900 dark:text-white">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

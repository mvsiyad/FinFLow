import type { Metadata } from 'next';
import { Fraunces, Geist_Mono, Inter } from 'next/font/google';
import './globals.css';

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  display: 'swap',
});

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'FinFlow — Bespoke Wealth OS & Finance Intelligence',
  description:
    'FinFlow is a high-end personal wealth operating system with real-time cash flow analytics, category budgets, savings vaults, and smart spending insights.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`dark ${fraunces.variable} ${geistMono.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-[#070e20] text-slate-100 font-sans selection:bg-amber-400/30 selection:text-amber-200">
        {children}
      </body>
    </html>
  );
}

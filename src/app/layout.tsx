import type { Metadata } from 'next';
import { Manrope, Inter } from 'next/font/google';
import './globals.css';
import { AppProvider } from '@/context/AppContext';
import { MuiProvider } from '@/components/providers/MuiProvider';
import Script from 'next/script';

const manrope = Manrope({
  weight: ['400', '500', '600', '700', '800'],
  subsets: ['latin'],
  variable: '--font-manrope',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'LaundryFresh — Luxury Fabric Care & Premium Dry Cleaning',
  description:
    'Your clothes deserve better care. Professional laundry, dry cleaning and ironing, picked up from your doorstep and returned fresh.',
  keywords: 'laundry service, dry cleaning, doorstep pickup, online laundry, fabric care, Hyderabad',
  openGraph: {
    title: 'LaundryFresh — Luxury Fabric Care & Premium Dry Cleaning',
    description: 'Professional laundry with free doorstep pickup, ozone sanitization, and 24-hr turnaround.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${manrope.variable} ${inter.variable} scroll-smooth`}>
      <body className="min-h-screen flex flex-col bg-[#FCF9F7] text-[#241A21] antialiased">
        <MuiProvider>
          <AppProvider>{children}</AppProvider>
        </MuiProvider>
        <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      </body>
    </html>
  );
}

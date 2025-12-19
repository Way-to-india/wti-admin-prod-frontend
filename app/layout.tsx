import type { Metadata } from 'next';
import { Montserrat } from 'next/font/google';
import './globals.css';
import Provider from '@/provider';

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-montserrat',
});

export const metadata: Metadata = {
  title: 'Way to India Admin',
  description: 'Admin Dashboard of WayToIndia',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${montserrat.className} antialiased`}>
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}

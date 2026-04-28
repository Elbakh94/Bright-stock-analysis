import type {Metadata} from 'next';
import { Cairo } from 'next/font/google';
import './globals.css'; // Global styles

const cairo = Cairo({ subsets: ['arabic'], variable: '--font-cairo' });

export const metadata: Metadata = {
  title: 'Brights Pro (EGX)',
  description: 'خبير مالي ومحلل استراتيجي متخصص في البورصة المصرية',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="ar" dir="rtl" className={cairo.variable} suppressHydrationWarning>
      <body className="font-sans bg-slate-50 text-slate-900" suppressHydrationWarning>{children}</body>
    </html>
  );
}

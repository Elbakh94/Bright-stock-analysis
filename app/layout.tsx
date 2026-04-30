import type { Metadata } from "next";
import { Inter, Space_Grotesk, Cairo } from "next/font/google";
import "./globals.css";

const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-inter',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space',
});

const cairo = Cairo({
  subsets: ['arabic'],
  variable: '--font-cairo',
});

export const metadata: Metadata = {
  title: "Brights Pro - EGX Analyst",
  description: "المحلل المالي الذكي للبورصة المصرية - توصيات ومتابعة لحظية",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className={`${inter.variable} ${spaceGrotesk.variable} ${cairo.variable}`} suppressHydrationWarning>
      <body className="antialiased overflow-hidden selection:bg-emerald-100 selection:text-emerald-900">
        {children}
      </body>
    </html>
  );
}

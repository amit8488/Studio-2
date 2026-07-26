
import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from '@/contexts/auth-context';
import { LanguageProvider } from '@/contexts/language-context';
import { BottomNav } from '@/components/bottom-nav';

export const metadata: Metadata = {
  title: {
    default: 'ViGha Calculate',
    template: '%s | ViGha Calculate',
  },
  description: 'A modern land area conversion calculator with regional standards, supporting Hectare, Are, and Square Meter to Vigha, Guntha, and Acre conversions.',
  keywords: ['land converter', 'vigha calculator', 'guntha calculator', 'hectare to vigha', 'gujarat land measurement'],
  authors: [{ name: 'ViGha Calculate Team' }],
  openGraph: {
    title: 'ViGha Calculate',
    description: 'A modern land area conversion calculator with regional standards.',
    type: 'website',
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased pb-28 md:pb-0">
        <AuthProvider>
          <LanguageProvider>
            <div className="min-h-screen flex flex-col">
              {children}
            </div>
            <BottomNav />
          </LanguageProvider>
        </AuthProvider>
        <Toaster />
      </body>
    </html>
  );
}

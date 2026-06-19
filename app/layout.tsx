import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from './components/Header';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { SettingsProvider } from './context/SettingsContext';
import { ThemeProvider } from './components/ThemeProvider';
import { ErrorBoundary } from './lib/error-boundary';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "ServerHub - Premium Used Server Equipment",
    template: "%s | ServerHub",
  },
  description: "Buy certified pre-owned server equipment at unbeatable prices. Dell, HP, Lenovo servers, storage, and networking gear tested and warranted. Free shipping on orders over ₱5,000.",
  keywords: ["used servers", "certified pre-owned", "Dell servers", "HP servers", "Lenovo servers", "networking equipment", "enterprise hardware", "refurbished servers"],
  authors: [{ name: "ServerHub" }],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "ServerHub",
    title: "ServerHub - Premium Used Server Equipment",
    description: "Buy certified pre-owned server equipment at unbeatable prices.",
  },
  twitter: {
    card: "summary_large_image",
    title: "ServerHub - Premium Used Server Equipment",
    description: "Buy certified pre-owned server equipment at unbeatable prices.",
  },
  verification: {
    google: "your-google-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      dir="ltr"
      suppressHydrationWarning
    >
      <head>
      </head>
      <body className="min-h-full flex flex-col bg-background transition-colors duration-200">
        <ErrorBoundary>
          <ThemeProvider>
            <SettingsProvider>
              <AuthProvider>
                <CartProvider>
                  <Header />
                  {children}
                </CartProvider>
              </AuthProvider>
            </SettingsProvider>
          </ThemeProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}

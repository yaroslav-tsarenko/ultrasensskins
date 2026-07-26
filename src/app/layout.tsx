import type { Metadata } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import "@/styles/globals.css";
import { brand } from "@/lib/brand";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { AuthProvider } from "@/providers/AuthProvider";
import { CartProvider } from "@/providers/CartProvider";
import { CurrencyProvider } from "@/providers/CurrencyProvider";
import { ToastProvider } from "@/providers/ToastProvider";
import { Header } from "@/components/layout/Header/Header";
import { Footer } from "@/components/layout/Footer/Footer";
import { CookieConsent } from "@/components/shared/CookieConsent/CookieConsent";

// Single source of truth for typography — swap a face here and the whole site
// follows via the --font-* design tokens in variables.css / globals.css.
// Space Grotesk = technical grotesk display (Armory Terminal character);
// Inter = neutral UI body; JetBrains Mono = instrument-readout specs.
const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: `${brand.displayName} — ${brand.tagline}`,
    template: `%s | ${brand.displayName}`,
  },
  description: brand.description,
  applicationName: brand.applicationName,
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || brand.url),
  openGraph: {
    type: "website",
    siteName: brand.displayName,
    url: brand.url,
    title: `${brand.displayName} — ${brand.tagline}`,
    description: brand.description,
  },
  twitter: {
    card: "summary_large_image",
    site: brand.social.twitter,
    title: brand.displayName,
  },
  icons: { icon: "/icon.svg", apple: "/icon.svg" },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const messages = await getMessages();

  return (
    <html
      lang="en"
      suppressHydrationWarning
      data-theme="dark"
      className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider>
            <AuthProvider>
              <CurrencyProvider>
                <CartProvider>
                  <div className="flex flex-col min-h-screen">
                    <Header />
                    <main className="flex-1">{children}</main>
                    <Footer />
                  </div>
                  <ToastProvider />
                  <CookieConsent />
                </CartProvider>
              </CurrencyProvider>
            </AuthProvider>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

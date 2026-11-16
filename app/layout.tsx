// app/layout.tsx
import type { Metadata } from "next";
import { Playfair_Display } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { SITE } from "@/lib/constants";
import { Navbar } from "@/components/navigation/navbar";
import { Footer } from "@/components/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";
import "./globals.css";
import { SessionProvider } from "@/components/auth/SessionProvider";


const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: `${SITE.name} — ${SITE.tagline}`,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
  metadataBase: new URL(SITE.url),
  openGraph: {
    title: `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description,
    url: SITE.url,
    siteName: SITE.name,
    locale: "en_GB",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-GB" className={playfair.variable}>

      <body className="min-h-screen flex flex-col">
                <SessionProvider>

        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <CartDrawer />
          </SessionProvider>

        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
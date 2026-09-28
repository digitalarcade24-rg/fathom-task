import type { Metadata, Viewport } from "next"
import { Fraunces, Inter_Tight, JetBrains_Mono } from "next/font/google"

import { CartDrawer } from "@/components/cart-drawer"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { CartProvider } from "@/lib/cart"

import "./globals.css"

/** Display. The WONK axis is the reason this face is here rather than a Didone. */
const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
  axes: ["SOFT", "WONK", "opsz"],
})

const interTight = Inter_Tight({
  subsets: ["latin"],
  variable: "--font-inter-tight",
  display: "swap",
})

/** Every measurement on the site is set in this. */
const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
  weight: ["500"],
})

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://fathomroasters.com"

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "FATHOM Coffee Roasters — roast depth, measured",
    template: "%s · FATHOM",
  },
  description:
    "Small-batch coffee from a railway arch in Bermondsey. Every lot is measured on a 0–100 depth scale, so you can compare roast level across origins instead of guessing at the word 'medium'.",
  keywords: [
    "specialty coffee",
    "single origin coffee",
    "coffee subscription",
    "roast level",
    "filter coffee",
  ],
  openGraph: {
    type: "website",
    siteName: "FATHOM Coffee Roasters",
    title: "FATHOM Coffee Roasters — roast depth, measured",
    description:
      "Nine coffees, one scale. Small-batch roasting with the numbers printed on the bag.",
    url: SITE_URL,
  },
  twitter: {
    card: "summary_large_image",
    title: "FATHOM Coffee Roasters",
    description: "Nine coffees, one scale. Roast depth as a measurement, not an adjective.",
  },
  robots: { index: true, follow: true },
}

export const viewport: Viewport = {
  themeColor: "#171A14",
  colorScheme: "light",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB" className={`${fraunces.variable} ${interTight.variable} ${jetbrains.variable}`}>
      <body>
        <CartProvider>
          <a
            href="#main"
            className="meta-sm sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:bg-ink focus:px-4 focus:py-3 focus:text-paper"
          >
            Skip to content
          </a>
          <SiteHeader />
          <main id="main">{children}</main>
          <SiteFooter />
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  )
}

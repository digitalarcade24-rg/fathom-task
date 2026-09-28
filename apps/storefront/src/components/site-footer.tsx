import Link from "next/link"

import { Mark } from "@/components/logo"
import { Newsletter } from "@/components/newsletter"

const COLUMNS = [
  {
    title: "Shop",
    links: [
      { href: "/coffee", label: "All coffee" },
      { href: "/coffee?c=single-origin", label: "Single origin" },
      { href: "/coffee?c=espresso", label: "For espresso" },
      { href: "/coffee?c=decaf", label: "Decaf" },
      { href: "/coffee/the-sounding", label: "Subscription" },
      { href: "/coffee?c=gear", label: "Gear" },
    ],
  },
  {
    title: "Read",
    links: [
      { href: "/journal", label: "The journal" },
      { href: "/journal/how-to-read-a-depth-number", label: "The depth scale" },
      { href: "/journal/the-v60-recipe-we-actually-use", label: "Our filter recipe" },
      { href: "/journal/water-is-most-of-your-coffee", label: "Water for brewing" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About FATHOM" },
      { href: "/about#sourcing", label: "How we buy" },
      { href: "/about#visit", label: "Visit the roastery" },
    ],
  },
]

export function SiteFooter() {
  return (
    <footer className="bg-ink text-paper">
      <div className="shell py-20 md:py-28">
        <div className="grid gap-16 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,2fr)]">
          <div>
            <Mark className="h-10 w-10 text-cherry" />
            <p className="display-m mt-8 max-w-sm text-paper">
              Measured, roasted, and posted from a railway arch in Bermondsey.
            </p>
            <div className="mt-10 max-w-sm">
              <Newsletter tone="ink" />
            </div>
          </div>

          <div className="grid gap-12 sm:grid-cols-3">
            {COLUMNS.map((column) => (
              <nav key={column.title} aria-label={column.title}>
                <h2 className="meta-sm text-paper/35">{column.title}</h2>
                <ul className="mt-6 space-y-3.5">
                  {column.links.map((link) => (
                    <li key={link.href + link.label}>
                      <Link
                        href={link.href}
                        className="link-underline text-[0.92rem] text-paper/70 transition-colors hover:text-paper"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        <div className="mt-20 border-t border-paper/15 pt-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <p className="meta-sm max-w-xl leading-relaxed text-paper/35">
              FATHOM Coffee Roasters is a fictional brand. This storefront is a portfolio demo —
              the products, lots, farms, scores and journal are invented, and no order placed here
              is real.
            </p>
            <p className="meta-sm shrink-0 text-paper/35">
              Arch 7, Bermondsey · Built with Next.js &amp; Medusa
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

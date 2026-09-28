"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"

import { Wordmark } from "@/components/logo"
import { useCart } from "@/lib/cart"

const NAV = [
  { href: "/coffee", label: "Coffee" },
  { href: "/journal", label: "Journal" },
  { href: "/about", label: "About" },
]

export function SiteHeader() {
  const pathname = usePathname()
  const { count, open } = useCart()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 24)
    }
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : ""
    return () => {
      document.body.style.overflow = ""
    }
  }, [menuOpen])

  return (
    <>
      {/* Roast day and the shipping threshold — the two things a coffee
          customer actually wants to know before they start browsing. */}
      <div className="bg-ink text-paper">
        <div className="shell flex h-9 items-center justify-center">
          <p className="meta-sm text-paper/70">
            Roasted Tuesdays &amp; Fridays · Free shipping over £45
          </p>
        </div>
      </div>

      <header
        className={`sticky top-0 z-50 transition-all duration-500 ${
          scrolled
            ? "border-b border-ink/12 bg-paper/85 backdrop-blur-md"
            : "border-b border-transparent bg-transparent"
        }`}
      >
        <div className="shell flex h-[4.5rem] items-center justify-between gap-6">
          <Link
            href="/"
            className="text-[1.05rem] text-ink transition-opacity hover:opacity-65"
            aria-label="FATHOM — home"
          >
            <Wordmark />
          </Link>

          <nav aria-label="Primary" className="hidden md:block">
            <ul className="flex items-center gap-10">
              {NAV.map((item) => {
                const active = pathname.startsWith(item.href)
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`meta transition-colors ${
                        active ? "text-cherry" : "text-ink/65 hover:text-ink"
                      }`}
                    >
                      {item.label}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={open}
              className="meta flex h-11 items-center gap-2 px-2 text-ink/65 transition-colors hover:text-ink"
              aria-label={`Open cart, ${count} item${count === 1 ? "" : "s"}`}
            >
              <span className="hidden sm:inline">Cart</span>
              <span
                className={`flex h-6 min-w-6 items-center justify-center rounded-full px-1.5 text-[0.6rem] transition-colors ${
                  count > 0 ? "bg-cherry text-paper" : "border border-ink/25 text-ink/45"
                }`}
              >
                {count}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              className="-mr-2 flex h-11 w-11 items-center justify-center md:hidden"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
            >
              <span className="relative block h-3 w-5">
                <span
                  className={`absolute left-0 block h-px w-5 bg-ink transition-all duration-300 ${
                    menuOpen ? "top-1.5 rotate-45" : "top-0"
                  }`}
                />
                <span
                  className={`absolute left-0 block h-px w-5 bg-ink transition-all duration-300 ${
                    menuOpen ? "top-1.5 -rotate-45" : "top-3"
                  }`}
                />
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* mobile menu */}
      <div
        id="mobile-menu"
        hidden={!menuOpen}
        className="fixed inset-0 z-40 flex flex-col bg-paper pt-[6.5rem] md:hidden"
      >
        <nav aria-label="Mobile" className="shell flex-1">
          <ul>
            {NAV.map((item, i) => (
              <li key={item.href} className="hairline-b">
                <Link
                  href={item.href}
                  className="display-m block py-7"
                  style={{
                    animation: menuOpen
                      ? `marker-drop 0.45s cubic-bezier(0.16,1,0.3,1) ${i * 0.06}s both`
                      : undefined,
                  }}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <p className="meta-sm mt-10 text-ink-45">
            FATHOM Coffee Roasters · Arch 7, Bermondsey
          </p>
        </nav>
      </div>
    </>
  )
}

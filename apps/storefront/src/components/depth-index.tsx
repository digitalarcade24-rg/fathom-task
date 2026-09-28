"use client"

import Link from "next/link"
import { useEffect, useRef, useState } from "react"

import { BagRender } from "@/components/bag-render"
import { DEPTH_BANDS, depthBand, type Product } from "@/lib/data/catalog"
import { masl, money } from "@/lib/format"

/**
 * The Depth Index — the signature of the site.
 *
 * Every coffee we sell, plotted on one 0–100 rule. It is the argument the brand
 * makes: that roast level is a measurement you can compare across lots rather
 * than an adjective. Pick a marker, read the lot.
 */
export function DepthIndex({ products }: { products: Product[] }) {
  const coffees = products
    .filter((p) => typeof p.depth === "number")
    .sort((a, b) => (a.depth ?? 0) - (b.depth ?? 0))

  const [active, setActive] = useState(0)
  const [drawn, setDrawn] = useState(false)
  const scaleRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const node = scaleRef.current
    if (!node) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDrawn(true)
      return
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setDrawn(true)
          observer.disconnect()
        }
      },
      { threshold: 0.35 },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  const current = coffees[active]
  if (!current) return null

  function step(direction: -1 | 1) {
    setActive((i) => (i + direction + coffees.length) % coffees.length)
  }

  return (
    <section className="bg-ink py-20 text-paper md:py-28" aria-labelledby="depth-index-heading">
      <div className="shell">
        <header className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="meta text-sage">The Depth Index</p>
            <h2 id="depth-index-heading" className="display-l mt-5 text-paper">
              Nine coffees, one scale
            </h2>
          </div>
          <p className="max-w-sm text-[0.95rem] leading-relaxed text-paper/55">
            Roast level here is a lab reading, not an adjective. Every lot is measured on a
            photometer after resting and plotted below — shallow on the left, deep on the right.
          </p>
        </header>

        {/* ── the rule ───────────────────────────────────────────────────── */}
        <div ref={scaleRef} className="mt-14 md:mt-20">
          {/* band labels */}
          <div className="relative mb-3 hidden h-4 md:block">
            {DEPTH_BANDS.map((band) => (
              <span
                key={band.label}
                className="meta-sm absolute text-paper/35"
                style={{ left: `${band.min}%` }}
              >
                {band.label}
              </span>
            ))}
          </div>

          {/* the roast gradient — actual reference colours from raw to charred */}
          <div
            className="h-14 w-full origin-left md:h-20"
            style={{
              background:
                "linear-gradient(to right, #C9D6B4 0%, #C9A874 26%, #A0703F 46%, #6E4327 64%, #45291B 80%, #201410 100%)",
              transform: drawn ? "scaleX(1)" : "scaleX(0)",
              transition: "transform 1.5s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          />

          {/* the axis */}
          <div className="relative h-px w-full bg-paper/25">
            {Array.from({ length: 11 }, (_, i) => (
              <span
                key={i}
                className="absolute top-0 block w-px bg-paper/25"
                style={{ left: `${i * 10}%`, height: i % 5 === 0 ? 11 : 6 }}
              />
            ))}
          </div>

          {/* the markers */}
          <div
            className="relative h-24 md:h-28"
            role="radiogroup"
            aria-label="Coffees by roast depth"
            onKeyDown={(e) => {
              if (e.key === "ArrowRight") {
                e.preventDefault()
                step(1)
              }
              if (e.key === "ArrowLeft") {
                e.preventDefault()
                step(-1)
              }
            }}
          >
            {coffees.map((coffee, i) => {
              const isActive = i === active
              return (
                <button
                  key={coffee.id}
                  type="button"
                  role="radio"
                  aria-checked={isActive}
                  tabIndex={isActive ? 0 : -1}
                  onClick={() => setActive(i)}
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  className="group absolute top-0 -translate-x-1/2 pt-0 pb-6"
                  style={{
                    left: `${coffee.depth}%`,
                    animation: drawn
                      ? `marker-drop 0.5s cubic-bezier(0.16,1,0.3,1) ${0.55 + i * 0.07}s both`
                      : undefined,
                    opacity: drawn ? undefined : 0,
                  }}
                >
                  <span className="sr-only">
                    {coffee.name}, depth {coffee.depth}
                  </span>
                  <span
                    aria-hidden
                    className={`mx-auto block w-px transition-all duration-300 ${
                      isActive ? "h-9 bg-cherry md:h-11" : "h-5 bg-paper/40 group-hover:bg-paper/70"
                    }`}
                  />
                  <span
                    aria-hidden
                    className={`mx-auto mt-1.5 block h-1.5 w-1.5 rotate-45 transition-colors duration-300 ${
                      isActive ? "bg-cherry" : "bg-paper/40 group-hover:bg-paper/70"
                    }`}
                  />
                  <span
                    aria-hidden
                    className={`meta-sm mt-2.5 hidden md:block ${
                      isActive ? "text-cherry" : "text-paper/40"
                    }`}
                  >
                    {coffee.depth}
                  </span>
                </button>
              )
            })}

            {/* Nothing we sell sits past 71, and the empty quarter of the rule
                says that more plainly than a sentence of copy would. */}
            <div
              className="absolute top-0 right-0 hidden md:block"
              style={{ left: `${(coffees[coffees.length - 1]?.depth ?? 71) + 6}%` }}
            >
              <div className="h-px w-full bg-paper/15" />
              <p className="meta-sm mt-3 text-paper/25">Nothing we roast lives here</p>
            </div>
          </div>
        </div>

        {/* ── the readout ────────────────────────────────────────────────── */}
        <div className="hairline-t border-paper/15 pt-10 md:pt-14">
          <div className="grid gap-10 md:grid-cols-[minmax(0,190px)_minmax(0,1fr)] md:gap-16">
            <div className="w-32 md:w-full">
              <BagRender product={current} shadow={false} className="w-full" />
            </div>

            <div className="flex flex-col justify-between gap-8">
              <div>
                <p className="meta text-sage">
                  Lot {current.lot} · Depth {current.depth} · {depthBand(current.depth ?? 0)}
                </p>
                <h3 className="display-m mt-4 text-paper">{current.name}</h3>
                <p className="lede mt-3 text-paper/60">{current.tagline}</p>

                <dl className="mt-8 grid grid-cols-2 gap-x-8 gap-y-5 sm:grid-cols-4">
                  {[
                    { k: "Origin", v: current.country },
                    { k: "Altitude", v: current.altitude ? masl(current.altitude) : undefined },
                    { k: "Process", v: current.process?.split(",")[0] },
                    { k: "Score", v: current.score ? `${current.score.toFixed(1)} SCA` : undefined },
                  ]
                    .filter((row) => row.v)
                    .map((row) => (
                      <div key={row.k}>
                        <dt className="meta-sm text-paper/35">{row.k}</dt>
                        <dd className="mt-2 text-[0.9rem] text-paper/85">{row.v}</dd>
                      </div>
                    ))}
                </dl>
              </div>

              <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
                <Link
                  href={`/coffee/${current.handle}`}
                  className="btn border-paper/40 text-paper hover:!text-ink"
                >
                  <span>Read the lot — {money(current.price)}</span>
                </Link>
                <div className="flex items-center gap-2 md:hidden">
                  <button
                    type="button"
                    onClick={() => step(-1)}
                    aria-label="Previous coffee"
                    className="flex h-11 w-11 items-center justify-center border border-paper/25 text-paper/70"
                  >
                    ←
                  </button>
                  <button
                    type="button"
                    onClick={() => step(1)}
                    aria-label="Next coffee"
                    className="flex h-11 w-11 items-center justify-center border border-paper/25 text-paper/70"
                  >
                    →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

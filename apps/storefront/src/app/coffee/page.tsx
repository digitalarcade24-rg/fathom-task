import type { Metadata } from "next"
import Link from "next/link"

import { ProductCard } from "@/components/product-card"
import { Reveal } from "@/components/reveal"
import { COLLECTIONS, getCollection } from "@/lib/data"

export const metadata: Metadata = {
  title: "The shelf",
  description:
    "Nine single-origin coffees and one blend, ordered shallow to deep on the FATHOM depth scale. Plus a subscription and three pieces of gear worth owning.",
}

export default async function CoffeePage({
  searchParams,
}: {
  searchParams: Promise<{ c?: string }>
}) {
  const { c } = await searchParams
  const active = COLLECTIONS.find((col) => col.handle === c)?.handle ?? "all"
  const collection = COLLECTIONS.find((col) => col.handle === active)!
  const products = await getCollection(active)

  const hasDepth = products.some((p) => typeof p.depth === "number")

  // Shallow to deep, then everything without a depth number (gear, subscription).
  const sorted = [...products].sort((a, b) => {
    const ad = a.depth ?? 999
    const bd = b.depth ?? 999
    return ad - bd
  })

  return (
    <>
      <section className="shell pt-14 pb-10 md:pt-20">
        <p className="meta text-ink-45">The shelf</p>
        <h1 className="display-xl mt-6 max-w-3xl">{collection.title}</h1>
        <p className="lede mt-7 max-w-xl text-ink-70">{collection.blurb}</p>
      </section>

      <nav aria-label="Filter by collection" className="shell">
        <ul className="no-scrollbar hairline-t hairline-b -mx-1 flex gap-1 overflow-x-auto py-3">
          {COLLECTIONS.map((col) => (
            <li key={col.handle}>
              <Link
                href={col.handle === "all" ? "/coffee" : `/coffee?c=${col.handle}`}
                aria-current={col.handle === active ? "page" : undefined}
                className={`meta-sm block whitespace-nowrap px-4 py-3 transition-colors ${
                  col.handle === active ? "bg-ink text-paper" : "text-ink-45 hover:text-ink"
                }`}
              >
                {col.title}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <section className="shell py-16 md:py-20">
        <p className="meta-sm mb-12 text-ink-45">
          {sorted.length} {hasDepth ? (sorted.length === 1 ? "lot" : "lots") : sorted.length === 1 ? "item" : "items"}
          {hasDepth ? " · ordered shallow to deep" : ""}
        </p>

        {sorted.length === 0 ? (
          <p className="display-s text-ink-70">
            Nothing in this collection right now.{" "}
            <Link href="/coffee" className="text-cherry link-underline">
              Show everything
            </Link>
            .
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {sorted.map((product, i) => (
              <Reveal key={product.id} delay={(i % 4) * 70}>
                <ProductCard product={product} index={i} />
              </Reveal>
            ))}
          </div>
        )}
      </section>
    </>
  )
}

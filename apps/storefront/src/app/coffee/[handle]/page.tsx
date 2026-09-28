import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"

import { AddToCart } from "@/components/add-to-cart"
import { BagRender } from "@/components/bag-render"
import { DepthMeter } from "@/components/depth-meter"
import { ProductCard } from "@/components/product-card"
import { Reveal } from "@/components/reveal"
import { PRODUCTS, depthBand, getProduct, getProducts } from "@/lib/data"
import { masl, money } from "@/lib/format"

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ handle: p.handle }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ handle: string }>
}): Promise<Metadata> {
  const { handle } = await params
  const product = await getProduct(handle)
  if (!product) return { title: "Not found" }

  return {
    title: product.name,
    description: `${product.tagline}. ${product.country ? `${product.country}, ` : ""}${
      product.altitude ? `${masl(product.altitude)}. ` : ""
    }Roasted to ${product.depth ?? "—"} on the FATHOM depth scale.`,
    openGraph: {
      title: `${product.name} · FATHOM`,
      description: product.tagline,
    },
  }
}

export default async function ProductPage({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params
  const product = await getProduct(handle)
  if (!product) notFound()

  const all = await getProducts()
  const nearby = all
    .filter(
      (p) =>
        p.handle !== product.handle && typeof p.depth === "number" && typeof product.depth === "number",
    )
    .sort(
      (a, b) =>
        Math.abs((a.depth ?? 0) - (product.depth ?? 0)) -
        Math.abs((b.depth ?? 0) - (product.depth ?? 0)),
    )
    .slice(0, 3)

  const record = [
    { k: "Lot", v: product.lot },
    { k: "Origin", v: product.country },
    { k: "Region", v: product.region },
    { k: "Producer", v: product.producer },
    { k: "Varietal", v: product.varietal },
    { k: "Process", v: product.process },
    { k: "Altitude", v: product.altitude ? masl(product.altitude) : undefined },
    { k: "Harvest", v: product.harvest },
    { k: "Cupping score", v: product.score ? `${product.score.toFixed(1)} SCA` : undefined },
    {
      k: "Roast depth",
      v: typeof product.depth === "number" ? `${product.depth} / 100 · ${depthBand(product.depth)}` : undefined,
    },
  ].filter((row) => row.v)

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.tagline,
    brand: { "@type": "Brand", name: "FATHOM Coffee Roasters" },
    sku: product.lot,
    offers: product.variants.map((v) => ({
      "@type": "Offer",
      name: v.label,
      price: (v.price / 100).toFixed(2),
      priceCurrency: "GBP",
      availability:
        v.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
    })),
    ...(product.score
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: product.score,
            bestRating: 100,
            ratingCount: 1,
            reviewAspect: "SCA cupping score",
          },
        }
      : {}),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <nav aria-label="Breadcrumb" className="shell pt-8">
        <ol className="meta-sm flex gap-2 text-ink-45">
          <li>
            <Link href="/coffee" className="hover:text-ink">
              The shelf
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li className="text-ink">{product.name}</li>
        </ol>
      </nav>

      <section className="shell grid gap-12 py-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-20 lg:py-16">
        {/* ── the bag ──────────────────────────────────────────────────── */}
        <div className="lg:sticky lg:top-28 lg:self-start">
          <div className="bg-paper-deep px-8 py-10 md:px-16 md:py-14">
            <BagRender product={product} className="mx-auto w-full max-w-[22rem]" />
          </div>
          {typeof product.depth === "number" ? (
            <div className="mt-8">
              <DepthMeter depth={product.depth} />
              <p className="mt-4 text-[0.85rem] leading-relaxed text-ink-45">
                Measured on a near-infrared photometer 24 hours after roasting.{" "}
                <Link
                  href="/journal/how-to-read-a-depth-number"
                  className="text-ink link-underline"
                >
                  What the number means
                </Link>
              </p>
            </div>
          ) : null}
        </div>

        {/* ── the copy ─────────────────────────────────────────────────── */}
        <div>
          <p className="meta text-sage-deep">
            {product.kind === "coffee"
              ? `${product.country} · Lot ${product.lot}`
              : product.kind === "subscription"
                ? "Subscription"
                : "Equipment"}
          </p>

          <h1 className="display-l mt-5">{product.name}</h1>
          <p className="lede mt-4 text-ink-70">{product.tagline}</p>

          <p className="meta mt-8 text-ink">
            {money(product.price)}
            {product.variants[0]?.grams ? (
              <span className="text-ink-45"> · {product.variants[0].label}</span>
            ) : null}
          </p>

          {product.notes ? (
            <ul className="mt-8 flex flex-wrap gap-2">
              {product.notes.map((note) => (
                <li key={note} className="meta-sm border border-ink/20 px-3.5 py-2.5 text-ink-70">
                  {note}
                </li>
              ))}
            </ul>
          ) : null}

          <div className="mt-12">
            <AddToCart product={product} />
          </div>

          <div className="hairline-t mt-14 pt-10">
            {product.description.map((paragraph, i) => (
              <p key={i} className={`prose-body ${i > 0 ? "mt-5" : ""}`}>
                {paragraph}
              </p>
            ))}
          </div>

          {product.brewNote ? (
            <aside className="mt-10 border-l-2 border-cherry pl-6">
              <p className="meta-sm text-sage-deep">From the lab</p>
              <p className="prose-body mt-3 text-ink">{product.brewNote}</p>
            </aside>
          ) : null}

          {/* ── the record ─────────────────────────────────────────────── */}
          <div className="hairline-t mt-14 pt-10">
            <h2 className="meta text-ink-45">The record</h2>
            <dl className="mt-6">
              {record.map((row) => (
                <div key={row.k} className="hairline-b flex justify-between gap-8 py-4">
                  <dt className="meta-sm shrink-0 text-ink-45">{row.k}</dt>
                  <dd className="text-right text-[0.92rem] text-ink">{row.v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* ── nearby on the scale ────────────────────────────────────────── */}
      {nearby.length > 0 ? (
        <section className="shell py-16 md:py-24" aria-labelledby="nearby-heading">
          <div className="hairline-t flex flex-wrap items-end justify-between gap-6 pt-8">
            <h2 id="nearby-heading" className="display-m max-w-md">
              Nearest on the scale
            </h2>
            <Link href="/coffee" className="meta link-underline text-ink-70 hover:text-ink">
              The whole shelf →
            </Link>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {nearby.map((p, i) => (
              <Reveal key={p.id} delay={i * 80}>
                <ProductCard product={p} />
              </Reveal>
            ))}
          </div>
        </section>
      ) : null}
    </>
  )
}

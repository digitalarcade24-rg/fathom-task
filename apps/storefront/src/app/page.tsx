import Link from "next/link"

import { BagRender } from "@/components/bag-render"
import { CoverArt } from "@/components/cover-art"
import { DepthIndex } from "@/components/depth-index"
import { ProductCard } from "@/components/product-card"
import { Reveal } from "@/components/reveal"
import { getDepthIndex, getFeatured, getProduct } from "@/lib/data"
import { formatPostDate, sortedPosts } from "@/lib/data/journal"
import { masl } from "@/lib/format"

export default async function HomePage() {
  const [featured, depthIndex, hero, subscription] = await Promise.all([
    getFeatured(),
    getDepthIndex(),
    getProduct("kochere-halo"),
    getProduct("the-sounding"),
  ])

  const shelf = featured.filter((p) => p.kind !== "subscription").slice(0, 4)
  const posts = sortedPosts().slice(0, 3)
  const [lead, ...rest] = posts

  return (
    <>
      {/* ═══ hero ═══════════════════════════════════════════════════════════ */}
      <section className="shell pt-14 pb-0 md:pt-24">
        <div className="grid items-end gap-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-20">
          <div>
            {hero ? (
              <p className="meta text-ink-45">
                Lot {hero.lot} · {hero.country} · {hero.altitude ? masl(hero.altitude) : ""} ·
                Depth {hero.depth}
              </p>
            ) : null}

            <h1 className="display-xl mt-7">
              Depth is a<br />
              measurement,
              <br />
              <span className="text-cherry">not a mood.</span>
            </h1>

            <p className="lede mt-9 max-w-lg text-ink-70">
              Every bag we send out has a number between 0 and 100 printed on the side. It comes off
              a photometer twenty-four hours after roasting — so for once you can compare two
              coffees without taking anyone&rsquo;s word for it.
            </p>

            <div className="mt-11 flex flex-wrap items-center gap-x-9 gap-y-4">
              <Link href="/coffee" className="btn btn-solid">
                <span>Shop the shelf</span>
              </Link>
              <Link
                href="/journal/how-to-read-a-depth-number"
                className="meta link-underline text-ink-70 hover:text-ink"
              >
                How the scale works →
              </Link>
            </div>
          </div>

          {hero ? (
            <div className="relative mx-auto w-full max-w-[19rem] lg:max-w-none">
              <BagRender product={hero} className="w-full" />
              <div className="meta-sm absolute right-0 bottom-3 hidden text-right text-ink-45 lg:block">
                <span className="block">This month&rsquo;s</span>
                <span className="block text-ink">shallowest lot</span>
              </div>
            </div>
          ) : null}
        </div>
      </section>

      {/* the sounding rule — the site's spine, introduced here */}
      <div className="shell mt-16 md:mt-24">
        <div className="sounding-rule rule-draw" />
        <div className="meta-sm mt-4 flex justify-between text-ink-45">
          <span>0 · Raw</span>
          <span className="hidden sm:block">50 · Caramel</span>
          <span>100 · Charred</span>
        </div>
      </div>

      {/* ═══ the three facts ════════════════════════════════════════════════ */}
      <section className="shell py-16 md:py-24" aria-label="How we work">
        <div className="grid gap-10 md:grid-cols-3 md:gap-16">
          {[
            {
              k: "Roasted to order",
              v: "Tuesdays and Fridays, in 12 kg batches. Your bag is packed the same morning it ships.",
            },
            {
              k: "Measured, then rested",
              v: "Every batch is read on a near-infrared photometer after 24 hours and logged against its profile.",
            },
            {
              k: "Priced in the open",
              v: "We publish what we paid FOB against the commodity reference for the same period. Every lot.",
            },
          ].map((fact, i) => (
            <Reveal key={fact.k} delay={i * 90}>
              <div className="hairline-t pt-6">
                <h2 className="meta text-ink">{fact.k}</h2>
                <p className="mt-4 text-[0.95rem] leading-relaxed text-ink-70">{fact.v}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ═══ the shelf ══════════════════════════════════════════════════════ */}
      <section className="shell pb-20 md:pb-28" aria-labelledby="shelf-heading">
        <div className="hairline-t flex flex-wrap items-end justify-between gap-6 pt-8">
          <h2 id="shelf-heading" className="display-l max-w-lg">
            On the shelf this week
          </h2>
          <Link href="/coffee" className="meta link-underline text-ink-70 hover:text-ink">
            All thirteen →
          </Link>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-4">
          {shelf.map((product, i) => (
            <Reveal key={product.id} delay={i * 80}>
              <ProductCard product={product} index={i} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* ═══ the signature ══════════════════════════════════════════════════ */}
      <DepthIndex products={depthIndex} />

      {/* ═══ sourcing ═══════════════════════════════════════════════════════ */}
      <section className="shell py-20 md:py-32" aria-labelledby="sourcing-heading">
        <div className="grid gap-14 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-24">
          <div>
            <p className="meta text-sage-deep">How we buy</p>
            <h2 id="sourcing-heading" className="display-l mt-6">
              We would rather pay twice and buy once
            </h2>
          </div>

          <div>
            <Reveal>
              <p className="prose-body">
                A washing station that can afford to send pickers back for a second pass is a
                station that produces coffee worth roasting. That is the entire logic of how we
                buy, and it is not complicated: we pay roughly double the commodity reference
                price, we buy the same lots from the same people year after year, and we publish
                both numbers on the product page.
              </p>
              <p className="prose-body mt-6">
                It means our shelf is small — nine coffees, not forty — and it means we sometimes
                run out in October and cannot get more until the next harvest. We have decided we
                are fine with both of those things.
              </p>
            </Reveal>

            <Reveal delay={120}>
              <blockquote className="hairline-t mt-12 pt-10">
                <p className="display-m max-w-xl">
                  &ldquo;You cannot fix it later. Everything after picking is damage
                  limitation.&rdquo;
                </p>
                <footer className="meta-sm mt-6 text-ink-45">
                  Tesfaye Wolde — Halo Beriti washing station, Kochere
                </footer>
              </blockquote>
            </Reveal>

            <Reveal delay={200}>
              <dl className="mt-14 grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-4">
                {[
                  { v: "9", k: "Coffees on the shelf" },
                  { v: "2.1×", k: "Average FOB vs reference" },
                  { v: "88.4", k: "Mean cupping score" },
                  { v: "48h", k: "Roast to dispatch" },
                ].map((stat) => (
                  <div key={stat.k}>
                    <dd className="display-m text-cherry">{stat.v}</dd>
                    <dt className="meta-sm mt-3 text-ink-45">{stat.k}</dt>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ═══ subscription ═══════════════════════════════════════════════════ */}
      {subscription ? (
        <section className="shell pb-20 md:pb-28">
          <div className="grid items-center gap-12 bg-paper-deep px-8 py-12 md:grid-cols-[minmax(0,1fr)_minmax(0,240px)] md:px-16 md:py-16">
            <div>
              <p className="meta text-sage-deep">The Sounding · Subscription</p>
              <h2 className="display-l mt-6 max-w-xl">A different depth every month</h2>
              <p className="prose-body mt-6 max-w-lg">
                We pick. If the last two bags were shallow, the next one goes deep. Every delivery
                arrives with the lot card — origin, altitude, process, the number, and the recipe we
                settled on in the lab.
              </p>
              <Link href="/coffee/the-sounding" className="btn btn-solid mt-9">
                <span>From £23 a month</span>
              </Link>
            </div>
            <div className="mx-auto w-40 md:w-full">
              <BagRender product={subscription} className="w-full" />
            </div>
          </div>
        </section>
      ) : null}

      {/* ═══ journal ════════════════════════════════════════════════════════ */}
      <section className="shell pb-24 md:pb-32" aria-labelledby="journal-heading">
        <div className="hairline-t flex flex-wrap items-end justify-between gap-6 pt-8">
          <h2 id="journal-heading" className="display-l">
            From the journal
          </h2>
          <Link href="/journal" className="meta link-underline text-ink-70 hover:text-ink">
            Everything we&rsquo;ve written →
          </Link>
        </div>

        <div className="mt-14 grid gap-14 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] lg:gap-20">
          {lead ? (
            <Reveal>
              <Link href={`/journal/${lead.slug}`} className="group block">
                <div className="overflow-hidden">
                  <CoverArt
                    post={lead}
                    className="aspect-[16/10] w-full transition-transform duration-[1100ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
                  />
                </div>
                <p className="meta mt-7 text-sage-deep">
                  {lead.category} · {formatPostDate(lead.date)}
                </p>
                <h3 className="display-m mt-4 max-w-xl transition-colors group-hover:text-cherry">
                  {lead.title}
                </h3>
                <p className="prose-body mt-4 max-w-xl">{lead.standfirst}</p>
              </Link>
            </Reveal>
          ) : null}

          <div>
            {rest.map((post, i) => (
              <Reveal key={post.slug} delay={i * 100}>
                <Link href={`/journal/${post.slug}`} className="hairline-b group block py-8">
                  <p className="meta text-sage-deep">
                    {post.category} · {post.readingMinutes} min
                  </p>
                  <h3 className="display-s mt-3 transition-colors group-hover:text-cherry">
                    {post.title}
                  </h3>
                  <p className="mt-3 text-[0.92rem] leading-relaxed text-ink-70">
                    {post.standfirst}
                  </p>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

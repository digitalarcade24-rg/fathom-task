import type { Metadata } from "next"
import Link from "next/link"

import { Reveal } from "@/components/reveal"
import { DEPTH_BANDS } from "@/lib/data/catalog"

export const metadata: Metadata = {
  title: "About",
  description:
    "FATHOM roasts small-batch coffee from a railway arch in Bermondsey and prints a measured roast-depth number on every bag. Here is how we buy, roast, and price.",
}

const TEAM = [
  {
    name: "Ines Varda",
    role: "Head roaster & co-founder",
    bio: "Ran production at a mid-size roastery in Lisbon for six years, then left because she was tired of blending toward a flavour target nobody could describe. Buys everything we sell.",
  },
  {
    name: "Marcus Oyelaran",
    role: "Quality lead & co-founder",
    bio: "Q grader, former water treatment engineer, and the reason there is a photometer in the corner of the arch instead of a person squinting at beans under a lamp.",
  },
  {
    name: "Dilan Ferreira",
    role: "Production",
    bio: "Packs, labels, and posts everything that leaves the building, and has caught more mislabelled bags than the rest of us combined.",
  },
]

export default function AboutPage() {
  return (
    <>
      <section className="shell pt-14 pb-16 md:pt-20">
        <p className="meta text-ink-45">About</p>
        <h1 className="display-xl mt-6 max-w-4xl">
          A roastery that
          <br />
          shows its working
        </h1>
        <p className="lede mt-8 max-w-2xl text-ink-70">
          We started FATHOM in 2019 because we were annoyed. Two people who had spent their careers
          in coffee could not walk into a shop and find out, from the bag, how dark a coffee had
          been roasted. So we built a company around fixing that one thing.
        </p>
      </section>

      <div className="shell">
        <div className="sounding-rule" />
      </div>

      {/* ── the scale ──────────────────────────────────────────────────── */}
      <section className="shell py-20 md:py-28" aria-labelledby="scale-heading">
        <div className="grid gap-14 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-24">
          <div>
            <p className="meta text-sage-deep">The scale</p>
            <h2 id="scale-heading" className="display-l mt-6">
              Zero to a hundred
            </h2>
          </div>

          <div>
            <p className="prose-body">
              Twenty-four hours after a batch comes off the drum we grind a sample and read it on a
              near-infrared photometer. Darker roasts absorb more light, so the reflectance value
              falls as the roast goes deeper. We invert that reading onto a 0–100 range where
              bigger means deeper, and print it on the bag.
            </p>
            <p className="prose-body mt-6">
              It is not a quality score and it is not a recommendation. It is a lab reading, and it
              is the same lab reading for every coffee we sell, which is the only thing that makes
              it useful.
            </p>

            <Reveal>
              <dl className="mt-12">
                {DEPTH_BANDS.map((band) => (
                  <div
                    key={band.label}
                    className="hairline-b grid grid-cols-[minmax(0,5.5rem)_minmax(0,1fr)] items-baseline gap-6 py-5"
                  >
                    <dt className="meta text-cherry">
                      {band.min}–{band.max}
                    </dt>
                    <dd>
                      <span className="display-s block text-ink">{band.label}</span>
                    </dd>
                  </div>
                ))}
              </dl>
            </Reveal>

            <Link
              href="/journal/how-to-read-a-depth-number"
              className="meta link-underline mt-10 inline-block text-ink-70 hover:text-ink"
            >
              The long version, in the journal →
            </Link>
          </div>
        </div>
      </section>

      {/* ── sourcing ───────────────────────────────────────────────────── */}
      <section id="sourcing" className="bg-ink py-20 text-paper md:py-28">
        <div className="shell grid gap-14 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-24">
          <div>
            <p className="meta text-sage">How we buy</p>
            <h2 className="display-l mt-6 text-paper">Nine coffees, on purpose</h2>
          </div>

          <div>
            <p className="prose-body text-paper/65">
              We buy small volumes of expensive coffee from a short list of producers, and we buy
              from the same people every year. That is the whole strategy. It means we run out —
              the Kochere is usually gone by October and there is no more until the next harvest —
              and we have decided that is a better problem than the alternative.
            </p>
            <p className="prose-body mt-6 text-paper/65">
              On every product page we publish what we paid FOB alongside the commodity reference
              price for the same period. &ldquo;We pay above market&rdquo; is a sentence anybody can
              write. The second number is the one that means something.
            </p>

            <div className="mt-14 grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-4">
              {[
                { v: "2019", k: "First batch" },
                { v: "6", k: "Producing partners" },
                { v: "2.1×", k: "FOB vs reference" },
                { v: "12 kg", k: "Batch size" },
              ].map((stat) => (
                <div key={stat.k}>
                  <p className="display-m text-cherry">{stat.v}</p>
                  <p className="meta-sm mt-3 text-paper/40">{stat.k}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── people ─────────────────────────────────────────────────────── */}
      <section className="shell py-20 md:py-28" aria-labelledby="people-heading">
        <h2 id="people-heading" className="display-l hairline-t max-w-lg pt-8">
          Three people and a Probat
        </h2>

        <div className="mt-14 grid gap-12 md:grid-cols-3">
          {TEAM.map((person, i) => (
            <Reveal key={person.name} delay={i * 90}>
              <div className="hairline-t pt-6">
                <h3 className="display-s">{person.name}</h3>
                <p className="meta-sm mt-3 text-sage-deep">{person.role}</p>
                <p className="mt-5 text-[0.93rem] leading-relaxed text-ink-70">{person.bio}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── visit ──────────────────────────────────────────────────────── */}
      <section id="visit" className="shell pb-24 md:pb-32">
        <div className="grid gap-12 bg-paper-deep px-8 py-12 md:grid-cols-2 md:px-16 md:py-16">
          <div>
            <p className="meta text-sage-deep">Visit</p>
            <h2 className="display-l mt-6">Arch 7, Bermondsey</h2>
            <p className="prose-body mt-6 max-w-md">
              The roastery is open to the public on Saturdays from nine until two. There is a
              two-group machine, a brew bar, and whatever came off the drum on Friday. We cup
              publicly at eleven — turn up, no booking.
            </p>
          </div>

          <dl className="grid content-center gap-6">
            {[
              { k: "Address", v: "Arch 7, Enid Street, London SE16 3RA" },
              { k: "Saturdays", v: "09:00 – 14:00" },
              { k: "Public cupping", v: "Saturdays at 11:00" },
              { k: "Email", v: "hello@fathomroasters.com" },
            ].map((row) => (
              <div key={row.k} className="hairline-b flex flex-wrap justify-between gap-4 pb-4">
                <dt className="meta-sm text-ink-45">{row.k}</dt>
                <dd className="text-[0.92rem] text-ink">{row.v}</dd>
              </div>
            ))}
          </dl>
        </div>

        <p className="meta-sm mt-10 max-w-2xl leading-relaxed text-ink-45">
          FATHOM Coffee Roasters is a fictional brand built as a portfolio demo. The producers,
          lots, scores and address on this site are invented.
        </p>
      </section>
    </>
  )
}

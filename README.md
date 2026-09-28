# FATHOM Coffee Roasters

A complete e-commerce build for a fictional specialty coffee roaster: a Next.js 15 storefront with a custom editorial design system, and a Medusa v2 commerce backend seeded with the same catalogue.

> **FATHOM is not a real company.** The brand, products, farms, producers, cupping scores, journal articles and address are all invented for this project. No order placed on this storefront is real and no payment provider is connected.

---

## The idea

Coffee bags say "medium roast" and it means nothing — there is no industry definition, no threshold, no committee. FATHOM prints a **measured number from 0 to 100** on every bag instead, derived from a photometer reading taken 24 hours after roasting.

That one idea drives the entire design:

- **The sounding rule** — a measured, ruler-like scale is the site's structural motif. It divides sections, sits on every product card, and opens out into the **Depth Index** on the homepage, where all nine coffees are plotted on a single interactive 0–100 axis.
- **The palette** comes from the raw material, not the drink: pale sage-grey (`#E6E8DE`, the colour of *unroasted* beans), ink with a green cast, and coffee-cherry red as the only accent. Deliberately not the brown-and-cream you'd expect.
- **The typography** pairs Fraunces (with its WONK axis dialled up) for display against Inter Tight for reading, with JetBrains Mono carrying every measurement on the site — altitude, lot number, cupping score, depth.
- **Product imagery is drawn, not photographed.** Every bag is a parametric SVG generated from that product's own record, so the label always agrees with the data on the page.

## Stack

| | |
|---|---|
| Storefront | Next.js 15 (App Router, RSC), React 19, Tailwind CSS 4 |
| Backend | Medusa v2 · Postgres · Redis |
| Content | Typed catalogue + structured journal blocks (no CMS required) |
| Hosting | Storefront → Vercel · Backend → Railway / Render / Fly |

## Repository layout

```
fathom-roasters/
├── apps/
│   ├── storefront/            Next.js 15 storefront
│   │   └── src/
│   │       ├── app/           routes: /, /coffee, /coffee/[handle],
│   │       │                  /journal, /journal/[slug], /about, /cart
│   │       ├── components/    bag renders, depth index, cart drawer, …
│   │       └── lib/
│   │           ├── data/
│   │           │   ├── catalog.ts   ← 13 products, source of truth
│   │           │   ├── journal.ts   ← 6 long-form articles
│   │           │   └── index.ts     ← read layer (local ⇄ Medusa)
│   │           └── cart.tsx   client cart + localStorage
│   └── backend/               Medusa v2
│       └── src/scripts/seed.ts      seeds the same catalogue
└── scripts/sync-catalog.mjs   copies catalog.ts into the backend
```

---

## Running the storefront

The storefront runs **entirely on its own**. With no Medusa URL configured it serves the bundled catalogue, which is what makes it deployable to Vercel with zero infrastructure.

```bash
npm install
npm run dev          # http://localhost:8000
```

## Deploying the storefront to Vercel

1. Import the repo in Vercel.
2. Set **Root Directory** to `apps/storefront`.
3. Framework preset: Next.js. Build and output settings can stay on the defaults.
4. Add one environment variable:

   ```
   NEXT_PUBLIC_SITE_URL = https://your-domain.vercel.app
   ```

5. Deploy. That's the whole process — no database, no backend, no image host.

`NEXT_PUBLIC_SITE_URL` only feeds canonical URLs, the sitemap and OpenGraph tags. Leave it unset and it falls back to `https://fathomroasters.com`.

---

## Running the Medusa backend

Medusa is a long-lived Node server and needs Postgres — **it will not run on Vercel.** Deploy it to Railway, Render or Fly and point the storefront at it.

```bash
cp apps/backend/.env.template apps/backend/.env    # fill in DATABASE_URL
npm run backend:dev                                # http://localhost:9000
npm run backend:seed                               # loads the catalogue
```

The seed creates the store, three shipping regions, a Bermondsey stock location, Royal Mail shipping options, a publishable API key, all eight collections, and all thirteen products with per-variant inventory. It is safe to re-run — it skips anything that already exists.

When it finishes it prints the two environment variables you need.

### Connecting the storefront to Medusa

```bash
# apps/storefront/.env.local
NEXT_PUBLIC_MEDUSA_BACKEND_URL=https://your-medusa.up.railway.app
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=pk_...
```

Set both and every product read switches from the bundled catalogue to the live Store API. Nothing else in the storefront changes — the swap happens in `lib/data/index.ts`, and if a configured backend is unreachable it falls back to the bundled data rather than serving a 500.

The origin data that makes FATHOM what it is (altitude, process, cupping score, roast depth, lot number) round-trips through Medusa's `metadata`, so a seeded backend and a standalone storefront render identically.

### Keeping the two in sync

`apps/storefront/src/lib/data/catalog.ts` is the single source of truth. `npm run backend:seed` regenerates the backend's copy from it automatically; run `npm run sync-catalog` if you want to do it by hand.

---

## What's deliberately not wired up

- **Checkout.** The cart is real — it persists, dedupes lines by variant *and* grind, and calculates shipping against the free-delivery threshold — but there is no payment provider. The checkout button says so plainly rather than pretending.
- **Newsletter.** The form validates and confirms, then tells you nothing was sent.
- **Search.** Not built.

Add a `STRIPE_API_KEY` to the backend `.env` and the Stripe payment provider registers itself automatically in `medusa-config.ts`.

## Accessibility & performance

Keyboard-navigable throughout with visible focus rings, a skip link, labelled radio groups on the Depth Index (arrow keys step between coffees), `aria-live` on cart quantities, and `prefers-reduced-motion` respected on every animation. All product and article pages are statically generated; first-load JS is ~103 kB shared.

## Licence

MIT.

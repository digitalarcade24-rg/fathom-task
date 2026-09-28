/**
 * The read layer.
 *
 * With no Medusa URL configured, every call below resolves against the bundled
 * catalogue — which is what makes this repo deployable to Vercel on its own.
 * Set NEXT_PUBLIC_MEDUSA_BACKEND_URL and the same calls hit the live Medusa
 * Store API instead, mapping Medusa's product shape back onto ours using the
 * metadata the seed script writes.
 *
 * If a configured backend is unreachable we fall back to the bundled catalogue
 * rather than failing the render. A storefront that 500s because the API is
 * down is worse than a storefront showing last-known-good data.
 */

import {
  PRODUCTS,
  type Product,
  type Variant,
  coffeesByDepth,
  findProduct,
  productsIn,
} from "./catalog"

export * from "./catalog"

const BACKEND = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL
const PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY

export const usingMedusa = Boolean(BACKEND && PUBLISHABLE_KEY)

type MedusaProduct = {
  id: string
  handle: string
  title: string
  subtitle?: string | null
  description?: string | null
  collection?: { handle?: string } | null
  tags?: { value: string }[] | null
  metadata?: Record<string, unknown> | null
  variants?: {
    id: string
    title: string
    calculated_price?: { calculated_amount?: number } | null
    inventory_quantity?: number | null
    metadata?: Record<string, unknown> | null
  }[]
}

function str(v: unknown): string | undefined {
  return typeof v === "string" && v.length > 0 ? v : undefined
}

function num(v: unknown): number | undefined {
  const n = typeof v === "string" ? Number(v) : typeof v === "number" ? v : NaN
  return Number.isFinite(n) ? n : undefined
}

/**
 * Maps a Medusa product onto our shape. The seed script stores the origin data
 * in `metadata`, so a seeded backend round-trips losslessly. For a product
 * added by hand in the Medusa admin, the fields simply come back undefined and
 * every component degrades to hiding that row.
 */
function fromMedusa(p: MedusaProduct): Product {
  const meta = p.metadata ?? {}
  const local = PRODUCTS.find((lp) => lp.handle === p.handle)

  const variants: Variant[] = (p.variants ?? []).map((v) => ({
    id: v.id,
    label: v.title,
    grams: num(v.metadata?.grams),
    price: v.calculated_price?.calculated_amount ?? 0,
    // A null quantity means Medusa isn't managing inventory for this variant,
    // which is "always available" — not "sold out".
    stock: typeof v.inventory_quantity === "number" ? v.inventory_quantity : 999,
  }))

  return {
    id: p.id,
    handle: p.handle,
    name: p.title,
    kind: (str(meta.kind) as Product["kind"]) ?? local?.kind ?? "coffee",
    tagline: p.subtitle ?? local?.tagline ?? "",
    country: str(meta.country) ?? local?.country,
    region: str(meta.region) ?? local?.region,
    producer: str(meta.producer) ?? local?.producer,
    varietal: str(meta.varietal) ?? local?.varietal,
    process: str(meta.process) ?? local?.process,
    altitude: num(meta.altitude) ?? local?.altitude,
    harvest: str(meta.harvest) ?? local?.harvest,
    score: num(meta.score) ?? local?.score,
    depth: num(meta.depth) ?? local?.depth,
    notes: str(meta.notes)?.split("|") ?? local?.notes,
    brewNote: str(meta.brewNote) ?? local?.brewNote,
    lot: str(meta.lot) ?? local?.lot ?? "—",
    price: variants[0]?.price ?? local?.price ?? 0,
    variants: variants.length > 0 ? variants : (local?.variants ?? []),
    grinds: local?.grinds,
    description: p.description ? p.description.split("\n\n") : (local?.description ?? []),
    palette: local?.palette ?? {
      bag: "#E6E8DE",
      band: "#8A9678",
      foil: "#171A14",
      ink: "#171A14",
    },
    collections: p.collection?.handle
      ? [p.collection.handle, ...(p.tags ?? []).map((t) => t.value)]
      : (local?.collections ?? []),
    featured: local?.featured,
  }
}

async function medusaFetch(path: string): Promise<MedusaProduct[] | null> {
  if (!usingMedusa) return null
  try {
    const res = await fetch(`${BACKEND}${path}`, {
      headers: { "x-publishable-api-key": PUBLISHABLE_KEY as string },
      // Rebuild the catalogue every 5 minutes rather than on every request.
      next: { revalidate: 300 },
    })
    if (!res.ok) return null
    const json = (await res.json()) as { products?: MedusaProduct[] }
    return json.products ?? null
  } catch {
    return null
  }
}

export async function getProducts(): Promise<Product[]> {
  const remote = await medusaFetch("/store/products?limit=100&fields=*variants.calculated_price")
  if (remote && remote.length > 0) return remote.map(fromMedusa)
  return PRODUCTS
}

export async function getProduct(handle: string): Promise<Product | undefined> {
  const remote = await medusaFetch(
    `/store/products?handle=${encodeURIComponent(handle)}&fields=*variants.calculated_price`,
  )
  if (remote && remote.length > 0) return fromMedusa(remote[0])
  return findProduct(handle)
}

export async function getCollection(collection: string): Promise<Product[]> {
  const all = await getProducts()
  if (collection === "all") return all
  const filtered = all.filter((p) => p.collections.includes(collection))
  return filtered.length > 0 ? filtered : productsIn(collection)
}

export async function getDepthIndex(): Promise<Product[]> {
  const all = await getProducts()
  const coffees = all.filter((p) => p.kind === "coffee" && typeof p.depth === "number")
  if (coffees.length === 0) return coffeesByDepth()
  return coffees.sort((a, b) => (a.depth ?? 0) - (b.depth ?? 0))
}

export async function getFeatured(): Promise<Product[]> {
  const all = await getProducts()
  const featured = all.filter((p) => p.featured)
  return featured.length > 0 ? featured : PRODUCTS.filter((p) => p.featured)
}

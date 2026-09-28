/**
 * GENERATED FILE — DO NOT EDIT.
 *
 * Copied from apps/storefront/src/lib/data/catalog.ts by scripts/sync-catalog.mjs.
 * Edit the storefront copy and re-run `npm run backend:seed` (or
 * `node scripts/sync-catalog.mjs`) to refresh this one.
 */

/**
 * The FATHOM catalogue.
 *
 * This is the single source of truth for the demo storefront AND for the
 * Medusa seed script (apps/backend/src/scripts/seed.ts imports this file).
 * Every coffee carries the data a real roaster prints on the bag — origin,
 * altitude, process, cupping score — because the whole brand is built on the
 * idea that those numbers are the product.
 *
 * Everything here is fictional.
 */

export type ProductKind = "coffee" | "gear" | "subscription"

export type Variant = {
  id: string
  label: string
  grams?: number
  /** price in GBP pence */
  price: number
  stock: number
}

export type Palette = {
  /** the bag body */
  bag: string
  /** the printed band that identifies the lot */
  band: string
  /** foil / accent detail */
  foil: string
  /** type colour printed on the bag */
  ink: string
}

export type Product = {
  id: string
  handle: string
  name: string
  kind: ProductKind
  /** one line, sits under the name everywhere */
  tagline: string

  // ── origin data (coffee only) ────────────────────────────────────────────
  country?: string
  region?: string
  producer?: string
  varietal?: string
  process?: string
  /** metres above sea level */
  altitude?: number
  harvest?: string
  /** SCA cupping score */
  score?: number
  /** the FATHOM number: 0 = raw, 100 = charred */
  depth?: number
  notes?: string[]
  brewNote?: string

  lot: string
  /** price in GBP pence — the default variant's price */
  price: number
  variants: Variant[]
  grinds?: string[]
  description: string[]
  palette: Palette
  collections: string[]
  featured?: boolean
}

/** The five bands of the FATHOM depth scale. */
export const DEPTH_BANDS = [
  { label: "Shallow", min: 0, max: 25 },
  { label: "Upper", min: 25, max: 45 },
  { label: "Mid", min: 45, max: 62 },
  { label: "Lower", min: 62, max: 80 },
  { label: "Deep", min: 80, max: 100 },
] as const

export function depthBand(depth: number): string {
  const band = DEPTH_BANDS.find((b) => depth >= b.min && depth < b.max)
  return band?.label ?? "Deep"
}

const GRINDS = [
  "Whole bean",
  "Filter / pour-over",
  "Aeropress",
  "Espresso",
  "French press",
  "Moka pot",
]

/** Standard two-size bag pricing: 1kg is 3.4× the 250g price, rounded to .00 */
function bagVariants(id: string, price250: number, stock = 40): Variant[] {
  const kilo = Math.round((price250 * 3.4) / 100) * 100
  return [
    { id: `${id}-250`, label: "250 g", grams: 250, price: price250, stock },
    { id: `${id}-1000`, label: "1 kg", grams: 1000, price: kilo, stock: Math.floor(stock / 3) },
  ]
}

export const PRODUCTS: Product[] = [
  {
    id: "kochere-halo",
    handle: "kochere-halo",
    name: "Kochere Halo",
    kind: "coffee",
    tagline: "Bergamot, white peach, jasmine",
    country: "Ethiopia",
    region: "Yirgacheffe · Kochere",
    producer: "Halo Beriti washing station",
    varietal: "Heirloom (Kurume, Dega)",
    process: "Fully washed, 48h fermentation",
    altitude: 2050,
    harvest: "Nov 2025 – Jan 2026",
    score: 89.5,
    depth: 18,
    notes: ["Bergamot", "White peach", "Jasmine", "Cane sugar"],
    brewNote:
      "Give it a coarser grind than feels right and a gentle pour. The florals collapse under agitation.",
    lot: "0417",
    price: 2400,
    variants: bagVariants("kochere-halo", 2400, 60),
    grinds: GRINDS,
    description: [
      "Halo Beriti sits at the top of the Kochere valley, high enough that the cherries take an extra six weeks to ripen. That slow maturation is the whole reason this cup tastes the way it does — the sugars have time to build while the acid stays put.",
      "We roast this one shallower than almost anything else we buy. There is a version of this coffee that tastes like a good breakfast blend, and we are not interested in it. Taken to 18 on the scale, it stays floral and citric and slightly tea-like, and the finish is clean enough that you notice the peach a second after you swallow.",
      "It is our most-ordered coffee and the one we send when someone asks what we are actually about.",
    ],
    palette: { bag: "#E6E8DE", band: "#C9D6B4", foil: "#243019", ink: "#171A14" },
    collections: ["single-origin", "filter", "africa"],
    featured: true,
  },
  {
    id: "sidama-bensa",
    handle: "sidama-bensa",
    name: "Sidama Bensa",
    kind: "coffee",
    tagline: "Blueberry, rose, dark chocolate",
    country: "Ethiopia",
    region: "Sidama · Bensa",
    producer: "Keramo mill, 340 smallholders",
    varietal: "Heirloom (74110, 74112)",
    process: "Natural, 21 days on raised beds",
    altitude: 1980,
    harvest: "Dec 2025 – Feb 2026",
    score: 90,
    depth: 22,
    notes: ["Blueberry", "Rose", "Dark chocolate", "Sugarcane"],
    brewNote:
      "Works as filter and as a single-origin espresso. As espresso, pull it long — 1:2.5 or beyond.",
    lot: "0421",
    price: 2700,
    variants: bagVariants("sidama-bensa", 2700, 35),
    grinds: GRINDS,
    description: [
      "Naturals get a bad reputation because most of them are made badly — cherries piled too deep, turned too rarely, and left to ferment into something that tastes more like the drying bed than the coffee. Keramo does it properly: thin layers, turned every ninety minutes for the first four days, twenty-one days total.",
      "The result is the cleanest natural we have cupped in three years. It is unmistakably fruit-forward — blueberry is not a marketing word here, it is just what it tastes like — but there is no fermenty edge and no boozy finish.",
      "This is the highest-scoring lot on the shelf at 90 points, and it is the one we stand behind when someone tells us they do not like fruity coffee.",
    ],
    palette: { bag: "#2A2231", band: "#6B4A7A", foil: "#F0E4F7", ink: "#F2EFE7" },
    collections: ["single-origin", "filter", "africa", "espresso"],
    featured: true,
  },
  {
    id: "nyeri-gichathaini",
    handle: "nyeri-gichathaini",
    name: "Nyeri Gichathaini",
    kind: "coffee",
    tagline: "Blackcurrant, grapefruit, brown sugar",
    country: "Kenya",
    region: "Nyeri · Mathira",
    producer: "Gichathaini Factory, Barichu FCS",
    varietal: "SL28, SL34, Ruiru 11",
    process: "Washed, 72h soak",
    altitude: 1760,
    harvest: "Oct – Dec 2025",
    score: 89,
    depth: 28,
    notes: ["Blackcurrant", "Grapefruit", "Brown sugar", "Tomato leaf"],
    brewNote:
      "Kenyans reward hotter water. 96 °C, and do not be shy with the dose — 62 g/L holds the structure together.",
    lot: "0402",
    price: 2600,
    variants: bagVariants("nyeri-gichathaini", 2600, 28),
    grinds: GRINDS,
    description: [
      "SL28 is a variety bred in the 1930s for drought tolerance and then discovered, more or less by accident, to produce one of the most structurally interesting cups in the world. Gichathaini has old trees and the long clean-water soak that the Nyeri factories are known for.",
      "What you get is acidity as architecture rather than decoration. Blackcurrant up front, grapefruit pith through the middle, and a sweetness underneath that keeps the whole thing from being punishing.",
      "If you have only ever had coffee described as smooth, this is the opposite of that, and worth the trip.",
    ],
    palette: { bag: "#1E2A2E", band: "#A81F26", foil: "#F7E6C4", ink: "#EDEFE6" },
    collections: ["single-origin", "filter", "africa"],
    featured: true,
  },
  {
    id: "cerro-azul",
    handle: "cerro-azul",
    name: "Cerro Azul",
    kind: "coffee",
    tagline: "Red apple, cane sugar, cocoa nib",
    country: "Colombia",
    region: "Huila · Pitalito",
    producer: "Finca Cerro Azul, Marta Rojas",
    varietal: "Caturra",
    process: "Washed, 18h dry ferment",
    altitude: 1780,
    harvest: "Apr – Jun 2026",
    score: 87,
    depth: 34,
    notes: ["Red apple", "Cane sugar", "Cocoa nib", "Orange blossom"],
    brewNote: "The most forgiving coffee we sell. Hard to ruin, easy to enjoy black or with milk.",
    lot: "0388",
    price: 2100,
    variants: bagVariants("cerro-azul", 2100, 80),
    grinds: GRINDS,
    description: [
      "Marta Rojas farms eleven hectares on a ridge above Pitalito and has been selling to us since our second year. Her processing is unglamorous and completely consistent: pick ripe, pulp same day, ferment eighteen hours, dry slow under parabolic covers.",
      "Consistency is the point. Cerro Azul is the coffee we recommend to people who are dialling in a new grinder, because it tastes good across a wider range of variables than anything else on the shelf.",
      "Apple and cane sugar, a cocoa finish, and enough body to survive a splash of milk without disappearing.",
    ],
    palette: { bag: "#F0EAD8", band: "#A81F26", foil: "#FBF3E2", ink: "#171A14" },
    collections: ["single-origin", "filter", "americas", "everyday"],
    featured: true,
  },
  {
    id: "finca-la-bruma",
    handle: "finca-la-bruma",
    name: "Finca La Bruma",
    kind: "coffee",
    tagline: "Toffee, orange peel, almond",
    country: "Guatemala",
    region: "Huehuetenango",
    producer: "Finca La Bruma, familia Ordóñez",
    varietal: "Bourbon",
    process: "Washed, sun-dried on patio",
    altitude: 1650,
    harvest: "Jan – Mar 2026",
    score: 86.5,
    depth: 42,
    notes: ["Toffee", "Orange peel", "Almond", "Baker's chocolate"],
    brewNote: "Excellent in a French press, where the body gets room to show up.",
    lot: "0371",
    price: 2000,
    variants: bagVariants("finca-la-bruma", 2000, 55),
    grinds: GRINDS,
    description: [
      "Huehuetenango is the highest non-volcanic growing region in Central America, and dry winds off the Sierra de los Cuchumatanes keep frost off the trees at altitudes that would otherwise kill them.",
      "La Bruma is old-fashioned in the best way — Bourbon trees, patio drying, no fermentation experiments. It tastes like what people mean when they say they want a really good cup of coffee without wanting to think about it much.",
      "Toffee and orange peel, an almond-skin dryness at the edges, and a long chocolate finish.",
    ],
    palette: { bag: "#EFE3CC", band: "#3E6B4A", foil: "#F4EBD4", ink: "#171A14" },
    collections: ["single-origin", "filter", "americas", "everyday"],
  },
  {
    id: "chiapas-nocturne",
    handle: "chiapas-nocturne",
    name: "Chiapas Nocturne",
    kind: "coffee",
    tagline: "Baked pear, walnut, molasses",
    country: "Mexico",
    region: "Chiapas · Jaltenango",
    producer: "Comón Yaj Noptic co-operative",
    varietal: "Typica, Mundo Novo",
    process: "Honey, 60% mucilage retained",
    altitude: 1450,
    harvest: "Feb – Apr 2026",
    score: 85,
    depth: 58,
    notes: ["Baked pear", "Walnut", "Molasses", "Cinnamon"],
    brewNote: "Our house recommendation for a moka pot. Holds together under pressure.",
    lot: "0359",
    price: 1900,
    variants: bagVariants("chiapas-nocturne", 1900, 70),
    grinds: GRINDS,
    description: [
      "A co-operative of a hundred and sixty families working land that sits lower than most of what we buy. Lower altitude means softer acidity, and rather than fight that we lean into it — this is roasted to 58, deeper than anything else in the single-origin range.",
      "The honey process leaves enough mucilage on the seed during drying to build a syrupy body without tipping into the fruit-forward territory of a natural.",
      "Baked pear, walnut skin, and a molasses weight that makes it the best coffee we sell for drinking at four in the afternoon.",
    ],
    palette: { bag: "#3A2A20", band: "#C9752F", foil: "#2B1708", ink: "#F4F0E6" },
    collections: ["single-origin", "americas", "dark"],
  },
  {
    id: "sumatra-ketiara",
    handle: "sumatra-ketiara",
    name: "Sumatra Ketiara",
    kind: "coffee",
    tagline: "Cedar, tobacco leaf, dried fig",
    country: "Indonesia",
    region: "Aceh · Takengon",
    producer: "Koperasi Ketiara",
    varietal: "Ateng, Jember",
    process: "Wet-hulled (giling basah)",
    altitude: 1500,
    harvest: "Sep – Dec 2025",
    score: 84.5,
    depth: 71,
    notes: ["Cedar", "Tobacco leaf", "Dried fig", "Petrichor"],
    brewNote: "Do not try to make this taste bright. Brew it strong and let it be what it is.",
    lot: "0344",
    price: 2000,
    variants: bagVariants("sumatra-ketiara", 2000, 45),
    grinds: GRINDS,
    description: [
      "Wet-hulling is a processing method born of necessity — Aceh is too humid to dry coffee the ordinary way, so the parchment comes off at a much higher moisture content and the seed finishes drying naked. It produces the jade-green beans and the unmistakable savoury profile that people either love or refuse.",
      "Ketiara is a women-led co-operative of around two thousand members, and their quality control is the reason this is the only Sumatra we have ever put our name on.",
      "Cedar, tobacco, dried fig, and that damp-earth note that has no better description than the smell of rain on a hot road.",
    ],
    palette: { bag: "#232B22", band: "#5F7A4A", foil: "#EFF3E2", ink: "#EDEFE6" },
    collections: ["single-origin", "asia", "dark"],
  },
  {
    id: "the-deep-end",
    handle: "the-deep-end",
    name: "The Deep End",
    kind: "coffee",
    tagline: "Dark cocoa, hazelnut, molasses",
    country: "Brazil / Colombia",
    region: "Cerrado Mineiro & Huila",
    producer: "Blended in-house",
    varietal: "Yellow Catuaí, Caturra",
    process: "Pulped natural & washed",
    altitude: 1300,
    harvest: "Rotating",
    score: 85,
    depth: 66,
    notes: ["Dark cocoa", "Hazelnut", "Molasses", "Toasted grain"],
    brewNote:
      "Built for espresso at 1:2 in 28 seconds, and it does not fall apart in a flat white.",
    lot: "ESP-11",
    price: 1800,
    variants: bagVariants("the-deep-end", 1800, 120),
    grinds: GRINDS,
    description: [
      "Every roaster needs a blend that works in a milk drink at seven in the morning without anybody having to think about it. This is ours, and we are not precious about it.",
      "Seventy percent Cerrado Mineiro for body and hazelnut sweetness, thirty percent washed Huila for the acidity that keeps it from going flat under steamed milk. The components rotate as harvests turn over; the flavour target does not.",
      "It is the cheapest coffee we sell and the one we drink the most of.",
    ],
    palette: { bag: "#171A14", band: "#A81F26", foil: "#F2EFE7", ink: "#EDEFE6" },
    collections: ["blend", "espresso", "everyday"],
    featured: true,
  },
  {
    id: "anchor-decaf",
    handle: "anchor-decaf",
    name: "Anchor Decaf",
    kind: "coffee",
    tagline: "Milk chocolate, cherry, malt",
    country: "Colombia",
    region: "Caldas",
    producer: "Descafecol, Manizales",
    varietal: "Castillo, Colombia",
    process: "Sugarcane EA decaffeination",
    altitude: 1700,
    harvest: "Mar – May 2026",
    score: 84,
    depth: 46,
    notes: ["Milk chocolate", "Cherry", "Malt", "Vanilla"],
    brewNote: "Decaf beans are more brittle. Grind one notch coarser than you think.",
    lot: "0329",
    price: 2200,
    variants: bagVariants("anchor-decaf", 2200, 40),
    grinds: GRINDS,
    description: [
      "Decaf is where roasters get lazy, and it is unfair, because the people drinking it are usually drinking it in the evening when they actually have time to enjoy a cup.",
      "This is sugarcane EA — ethyl acetate derived from fermented cane, done in Manizales a few hours from where the coffee grew. It is the gentlest commercial process we know of and it leaves far more of the origin character intact than a solvent-free water process does.",
      "Milk chocolate and cherry, a malty middle, and enough sweetness that nobody at the table has to know.",
    ],
    palette: { bag: "#DDE2E6", band: "#2E4A6B", foil: "#E6EFF7", ink: "#171A14" },
    collections: ["single-origin", "decaf", "americas"],
  },

  // ── Subscription ──────────────────────────────────────────────────────────
  {
    id: "the-sounding",
    handle: "the-sounding",
    name: "The Sounding",
    kind: "subscription",
    tagline: "A different depth every month",
    lot: "SUB",
    price: 2300,
    variants: [
      { id: "the-sounding-1", label: "One bag · monthly", price: 2300, stock: 999 },
      { id: "the-sounding-2", label: "Two bags · monthly", price: 4400, stock: 999 },
      { id: "the-sounding-2w", label: "Two bags · fortnightly", price: 4400, stock: 999 },
    ],
    grinds: GRINDS,
    description: [
      "We pick, you drink. Each month you get a 250 g bag from somewhere on the scale you have not been recently — if the last two were shallow, the next one goes deep.",
      "Every delivery includes the lot card: origin, altitude, process, the depth number, and the brew recipe we settled on in the lab. Skip, pause, or cancel from your account at any time, and the first bag ships the next working day.",
      "Roasted the morning it ships. Never more than four days old when it reaches you.",
    ],
    palette: { bag: "#E6E8DE", band: "#171A14", foil: "#EDEFE6", ink: "#171A14" },
    collections: ["subscription"],
    featured: true,
  },

  // ── Gear ──────────────────────────────────────────────────────────────────
  {
    id: "sounding-dripper",
    handle: "sounding-dripper",
    name: "Sounding Dripper",
    kind: "gear",
    tagline: "Stoneware cone, 60° wall, single large port",
    lot: "GR-01",
    price: 4200,
    variants: [
      { id: "sounding-dripper-bone", label: "Bone", price: 4200, stock: 24 },
      { id: "sounding-dripper-ink", label: "Ink", price: 4200, stock: 18 },
    ],
    description: [
      "Thrown for us by a small studio in Stoke-on-Trent in a stoneware body heavy enough to hold heat through a four-minute brew — the single biggest unforced error in pour-over is a cold dripper stealing energy from the slurry.",
      "Sixty-degree walls, one 20 mm port, and internal ribs that stop the paper sealing against the cone. Takes a standard size-02 filter.",
      "Fires in bone and ink. Each one varies slightly, which is what happens when a person makes it.",
    ],
    palette: { bag: "#E6E8DE", band: "#8A9678", foil: "#151A0F", ink: "#171A14" },
    collections: ["gear"],
  },
  {
    id: "lot-tin",
    handle: "lot-tin",
    name: "Lot Tin",
    kind: "gear",
    tagline: "250 g airtight store with a one-way valve",
    lot: "GR-02",
    price: 2800,
    variants: [{ id: "lot-tin-std", label: "250 g", price: 2800, stock: 60 }],
    description: [
      "Fresh coffee outgasses CO₂ for about two weeks after roasting. Seal it in something completely airtight and you build pressure; leave it open and you lose the aromatics. The answer is a one-way valve, which is why our bags have one and why this tin does too.",
      "Powder-coated steel, silicone gasket, and a debossed depth scale on the lid so you can mark where the current bag sits.",
      "Holds exactly one 250 g bag with no headspace to speak of.",
    ],
    palette: { bag: "#8A9678", band: "#171A14", foil: "#E6E8DE", ink: "#1A1F12" },
    collections: ["gear"],
  },
  {
    id: "field-scale",
    handle: "field-scale",
    name: "Field Scale",
    kind: "gear",
    tagline: "0.1 g resolution, brew timer, 90-minute charge",
    lot: "GR-03",
    price: 8600,
    variants: [{ id: "field-scale-std", label: "Standard", price: 8600, stock: 15 }],
    description: [
      "A scale is the only piece of equipment that improves every single cup you make, and most kitchen scales are not accurate enough at the low end to weigh a 15 g dose properly.",
      "This one resolves to 0.1 g, settles in under a second, and has a timer that starts itself when it detects the first drops of water hitting the vessel.",
      "USB-C, a silicone heat pad, and a body narrow enough to sit under a dripper on a normal mug.",
    ],
    palette: { bag: "#171A14", band: "#8A9678", foil: "#14180F", ink: "#EDEFE6" },
    collections: ["gear"],
  },
]

export const COLLECTIONS = [
  { handle: "all", title: "Everything", blurb: "The full shelf, deepest roast last." },
  {
    handle: "single-origin",
    title: "Single origin",
    blurb: "One farm, one lot, one harvest. Traceable to the washing station.",
  },
  {
    handle: "blend",
    title: "Blends",
    blurb: "Built for a job rather than for a story.",
  },
  {
    handle: "espresso",
    title: "For espresso",
    blurb: "Roasted with enough depth to survive nine bars and a jug of milk.",
  },
  {
    handle: "filter",
    title: "For filter",
    blurb: "Shallow enough to keep the acidity intact.",
  },
  {
    handle: "decaf",
    title: "Decaf",
    blurb: "One lot, treated properly, for after seven o'clock.",
  },
  {
    handle: "subscription",
    title: "Subscription",
    blurb: "We choose. You keep drinking.",
  },
  { handle: "gear", title: "Gear", blurb: "Three things worth owning, and nothing else." },
]

export function productsIn(collection: string): Product[] {
  if (collection === "all") return PRODUCTS
  return PRODUCTS.filter((p) => p.collections.includes(collection))
}

export function findProduct(handle: string): Product | undefined {
  return PRODUCTS.find((p) => p.handle === handle)
}

/** Coffees only, sorted shallow → deep. This is the Depth Index order. */
export function coffeesByDepth(): Product[] {
  return PRODUCTS.filter((p) => p.kind === "coffee" && typeof p.depth === "number").sort(
    (a, b) => (a.depth ?? 0) - (b.depth ?? 0),
  )
}

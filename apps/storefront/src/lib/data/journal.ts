/**
 * The FATHOM journal.
 *
 * Posts are structured blocks rather than markdown so the editorial layout can
 * treat a pull quote, a recipe table and a paragraph as genuinely different
 * things instead of styling a wall of <p>. Everything here is fictional.
 */

export type Block =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "quote"; text: string; attribution?: string }
  | { type: "list"; items: string[] }
  | { type: "note"; text: string }
  | {
      type: "recipe"
      title: string
      rows: { label: string; value: string }[]
    }
  | { type: "steps"; items: { time: string; text: string }[] }

export type Post = {
  slug: string
  title: string
  /** shows in the index and as the lede */
  standfirst: string
  category: "Brewing" | "Origin" | "Roasting" | "Science" | "Notes"
  /** ISO date */
  date: string
  readingMinutes: number
  author: { name: string; role: string }
  /** two hex values — drives the generated cover art */
  cover: { from: string; to: string; motif: "arcs" | "grid" | "contour" | "scale" }
  featured?: boolean
  body: Block[]
}

export const POSTS: Post[] = [
  {
    slug: "how-to-read-a-depth-number",
    title: "How to read a depth number",
    standfirst:
      "Every bag we sell has a number between 0 and 100 on the side of it. Here is exactly what it measures, and why we stopped printing the word 'medium'.",
    category: "Roasting",
    date: "2026-07-22",
    readingMinutes: 6,
    author: { name: "Ines Varda", role: "Head roaster" },
    cover: { from: "#E6E8DE", to: "#2A1D16", motif: "scale" },
    featured: true,
    body: [
      {
        type: "p",
        text: "There is no industry definition of a medium roast. There is no committee, no threshold, no agreed temperature. When a bag says medium it means the person who wrote the label thought it was somewhere in the middle of the coffees they personally roast, which tells you approximately nothing about what is in the bag.",
      },
      {
        type: "p",
        text: "So we print a number instead. It runs from 0 to 100, it is derived from a measurement rather than an opinion, and it is comparable across every coffee on our shelf.",
      },
      { type: "h2", text: "What is actually being measured" },
      {
        type: "p",
        text: "After a batch rests for twenty-four hours we grind a sample and read it on a near-infrared photometer. The instrument reports how much light the ground coffee reflects at a specific wavelength — darker roasts absorb more, so the reflectance value falls as the roast goes deeper. The industry calls this an Agtron number, and it typically lands between about 95 (very shallow) and 25 (very deep).",
      },
      {
        type: "p",
        text: "That scale runs backwards, which is confusing, and it is compressed at both ends, which is worse. So we invert and stretch it onto a 0–100 range where bigger means deeper. That is the FATHOM number. It is a direct linear transform of a lab reading — no judgement enters into it.",
      },
      {
        type: "recipe",
        title: "The five bands",
        rows: [
          { label: "0 – 25 · Shallow", value: "Floral and citric. Acidity is the structure." },
          { label: "25 – 45 · Upper", value: "Fruit and sugar-browning together. The broadest band." },
          { label: "45 – 62 · Mid", value: "Caramel takes over from fruit. Body starts to build." },
          { label: "62 – 80 · Lower", value: "Cocoa, nuts, spice. Origin character recedes." },
          { label: "80 – 100 · Deep", value: "Roast character dominates. We rarely go here." },
        ],
      },
      { type: "h2", text: "What the number does not tell you" },
      {
        type: "p",
        text: "It is a measure of colour, and colour is a proxy for development, not a description of it. Two coffees can read 34 and taste nothing alike — one taken there fast and scorched, one taken there slowly with a long enough Maillard phase to actually build sweetness. The number will not separate those. Only the cup will.",
      },
      {
        type: "quote",
        text: "The number tells you where we stopped. It does not tell you how we got there.",
      },
      {
        type: "p",
        text: "It is also not a quality ranking. A 71 is not worse than an 18. Our Sumatra is deliberately deep because wet-hulled Aceh coffee tastes like cedar and tobacco and trying to make it taste like Yirgacheffe would be both impossible and stupid.",
      },
      { type: "h2", text: "How to use it when you are buying" },
      {
        type: "list",
        items: [
          "If you liked something and want more of it, match the number within about six points. That is roughly the resolution at which most people can reliably taste a difference.",
          "If you brew filter and want the coffee to taste like where it came from, stay under 40.",
          "If you pull espresso with milk, look above 55. Below that, the acidity fights the lactose and you get a sourness that no amount of grind adjustment fixes.",
          "If you are buying for someone else and know nothing about their taste, 34 is the safest number on any shelf.",
        ],
      },
      {
        type: "note",
        text: "Every product page on this site plots its coffee on the same scale, and the Depth Index on the homepage puts all of them on one rule so you can see the whole range at once.",
      },
    ],
  },
  {
    slug: "three-days-in-kochere",
    title: "Three days in Kochere",
    standfirst:
      "Notes from the Halo Beriti washing station in the week the cherries came in — on altitude, on waiting, and on why the best lot of the year almost did not happen.",
    category: "Origin",
    date: "2026-06-14",
    readingMinutes: 9,
    author: { name: "Ines Varda", role: "Head roaster" },
    cover: { from: "#C9D6B4", to: "#2E4A3C", motif: "contour" },
    featured: true,
    body: [
      {
        type: "p",
        text: "The road from Yirgacheffe town up to Kochere is thirty-one kilometres and takes an hour and forty minutes, and by the end of it you understand something about the coffee that no amount of cupping will teach you. You are climbing the entire time.",
      },
      {
        type: "p",
        text: "Halo Beriti sits at 2,050 metres. That is high enough that the mornings are genuinely cold, high enough that the cherries on the same tree ripen weeks apart, and high enough that nothing about the harvest can be rushed.",
      },
      { type: "h2", text: "Waiting is the technique" },
      {
        type: "p",
        text: "Tesfaye, who runs the station, showed me two piles of cherry that had come in that morning from different collection points. One was uniformly deep red. The other had maybe fifteen percent yellow-orange fruit mixed through it. Same variety, same altitude, two hours apart.",
      },
      {
        type: "p",
        text: "The second pile gets rejected, or bought at a lower price and routed into a commercial lot. Not because underripe cherry tastes bad exactly, but because it tastes different, and a lot that tastes of two things at once tastes of nothing in particular.",
      },
      {
        type: "quote",
        text: "You cannot fix it later. Everything after picking is damage limitation.",
        attribution: "Tesfaye Wolde, Halo Beriti",
      },
      {
        type: "p",
        text: "This is the part of the supply chain that nobody puts on a bag, because it does not photograph well. It is a man standing at a table at six in the evening telling a farmer who walked four kilometres that the coffee is not ready.",
      },
      { type: "h2", text: "The week it nearly went wrong" },
      {
        type: "p",
        text: "The rains came ten days early. Washed coffee needs to dry on raised beds for something like twelve to eighteen days, turned regularly, and if it gets caught wet at the wrong moment you get mould, or you get uneven drying that shows up months later as a stale, papery note in the cup.",
      },
      {
        type: "p",
        text: "They covered the beds and moved half the parchment under the shelter, then spent three days turning it by hand every two hours through the night to keep air moving. Six people, in shifts, for seventy-two hours, to save about four tonnes.",
      },
      {
        type: "p",
        text: "Lot 0417 — the one we are selling as Kochere Halo — is from those beds. It cupped at 89.5, the highest washed Ethiopian we have bought.",
      },
      { type: "h2", text: "What we paid" },
      {
        type: "recipe",
        title: "Lot 0417 · cost breakdown per kilo of green",
        rows: [
          { label: "FOB price paid", value: "$7.85 / kg" },
          { label: "Ethiopian commodity reference, same period", value: "$3.90 / kg" },
          { label: "Freight, duty, financing", value: "$1.30 / kg" },
          { label: "Green cost landed", value: "$9.15 / kg" },
          { label: "Weight lost in roasting", value: "≈ 16%" },
        ],
      },
      {
        type: "p",
        text: "We publish this because the phrase 'we pay above market' is used by everyone and means nothing without the second number. Ours is roughly double the reference price for the period. That is not charity — a station that can pay pickers to wait for ripe cherry is a station that can sell us an 89.5, and we would rather buy that.",
      },
      {
        type: "note",
        text: "Kochere Halo is on the shelf now, roasted to 18 on the depth scale. It will be gone by October and there is no more of it.",
      },
    ],
  },
  {
    slug: "the-v60-recipe-we-actually-use",
    title: "The V60 recipe we actually use",
    standfirst:
      "Not the competition one. The one on the wall in our lab, which four people use every morning without thinking about it.",
    category: "Brewing",
    date: "2026-05-30",
    readingMinutes: 5,
    author: { name: "Marcus Oyelaran", role: "Quality lead" },
    cover: { from: "#E6E8DE", to: "#3A2A20", motif: "arcs" },
    featured: true,
    body: [
      {
        type: "p",
        text: "Most published pour-over recipes are written to win something. They have five pours, a specific kettle, and a tolerance of about four seconds. They are genuinely better — by a margin most people will never taste, at a cost in attention that most mornings cannot afford.",
      },
      {
        type: "p",
        text: "This is the one taped inside the cupboard door in our lab. Three pours, one timer, and it is robust enough that being ten seconds late does not ruin it.",
      },
      {
        type: "recipe",
        title: "Filter · one cup",
        rows: [
          { label: "Coffee", value: "18 g" },
          { label: "Water", value: "300 g" },
          { label: "Ratio", value: "1 : 16.7" },
          { label: "Grind", value: "Medium — table salt, not sand" },
          { label: "Water temp", value: "94 °C (96 °C for Kenyans)" },
          { label: "Total time", value: "2:45 – 3:15" },
        ],
      },
      { type: "h2", text: "The method" },
      {
        type: "steps",
        items: [
          {
            time: "0:00",
            text: "Pour 50 g in a slow spiral from the centre out. Stop before you hit the paper. Swirl the whole dripper once — this does more for evenness than any amount of careful pouring.",
          },
          {
            time: "0:45",
            text: "Second pour to 180 g. Aim for the centre and let the water push outward on its own.",
          },
          {
            time: "1:30",
            text: "Third pour to 300 g. Faster than the others, still centre-focused.",
          },
          {
            time: "2:10",
            text: "Swirl the dripper gently one last time to flatten the bed. Then leave it alone.",
          },
          {
            time: "2:45 – 3:15",
            text: "Drawdown finishes. If it drains before 2:30 grind finer; if it is still going at 3:45, grind coarser. Change one thing at a time.",
          },
        ],
      },
      { type: "h2", text: "The three things that actually matter" },
      {
        type: "list",
        items: [
          "Weigh the water. Not the cup, not by eye — the water. This is the single largest source of cup-to-cup variance in a home kitchen and it costs nothing to fix.",
          "Rinse the paper with hot water and dump it. Unrinsed paper contributes a dry, cardboard note that sits right where the sweetness should be.",
          "Grind immediately before brewing. Coffee ground the night before has lost most of what you paid for by morning.",
        ],
      },
      {
        type: "quote",
        text: "A repeatable mediocre recipe beats an excellent one you execute differently every day.",
      },
      {
        type: "note",
        text: "Adjusting for depth: under 30, pull the temperature up to 96 °C and grind a touch coarser. Over 55, drop to 91 °C or the bitterness comes forward.",
      },
    ],
  },
  {
    slug: "water-is-most-of-your-coffee",
    title: "Water is 98% of your coffee",
    standfirst:
      "You spent £24 on a bag and are brewing it with whatever comes out of the tap. Here is the smallest change that fixes the biggest problem.",
    category: "Science",
    date: "2026-05-02",
    readingMinutes: 7,
    author: { name: "Marcus Oyelaran", role: "Quality lead" },
    cover: { from: "#DDE2E6", to: "#2E4A6B", motif: "grid" },
    body: [
      {
        type: "p",
        text: "A brewed cup of filter coffee is around 98.5% water and 1.5% dissolved coffee solids. Every decision you make about grind, temperature and technique is a decision about how those solids get into that water — and yet almost nobody thinks about the water itself.",
      },
      { type: "h2", text: "Two numbers" },
      {
        type: "p",
        text: "Water chemistry for brewing comes down to two measurements, and you can buy a test strip for both for the price of a coffee.",
      },
      {
        type: "recipe",
        title: "Targets",
        rows: [
          { label: "Total hardness", value: "50 – 175 ppm CaCO₃ (target ≈ 100)" },
          { label: "Alkalinity (buffer)", value: "40 – 75 ppm CaCO₃ (target ≈ 50)" },
          { label: "pH", value: "6.5 – 7.5" },
          { label: "Chlorine", value: "Zero. Non-negotiable." },
        ],
      },
      {
        type: "p",
        text: "Hardness is magnesium and calcium, and those ions are what physically bind to flavour compounds and pull them out of the grounds. Too little and extraction is thin and hollow no matter how fine you grind. Too much and you over-extract into bitterness, and you scale your kettle.",
      },
      {
        type: "p",
        text: "Alkalinity is the buffer — it neutralises the acids in the coffee. This is the one that ruins good coffee quietly. High-alkalinity water flattens a bright Kenyan into something dull and chalky, and the drinker concludes they do not like Kenyan coffee.",
      },
      {
        type: "quote",
        text: "Most people who think they dislike acidic coffee simply have hard tap water.",
      },
      { type: "h2", text: "What to do about it, cheapest first" },
      {
        type: "list",
        items: [
          "Zero cost: if your water is soft already, use it. Run the tap cold for a few seconds first and never brew with water from the hot tap.",
          "Low cost: a jug filter. It removes chlorine and drops hardness. Change the cartridge on schedule — an exhausted one is worse than no filter.",
          "Better: cut your tap water with distilled or deionised water. If your supply reads 250 ppm, half and half brings you to 125. This is the highest-leverage thing in this article.",
          "Best: brew with deionised water and add a mineral concentrate. Total control, about 8p a litre, and mildly obsessive.",
        ],
      },
      {
        type: "note",
        text: "Before you change anything else about your brewing, brew the same coffee twice — once with tap water, once with a supermarket bottle of low-mineral still water. The difference is usually larger than any grinder upgrade.",
      },
    ],
  },
  {
    slug: "what-a-cupping-score-means",
    title: "What a cupping score does and does not tell you",
    standfirst:
      "An 86 and an 89 are three points apart on paper and a different category of coffee in the cup. The scale is not linear, and almost nobody explains why.",
    category: "Notes",
    date: "2026-04-11",
    readingMinutes: 6,
    author: { name: "Ines Varda", role: "Head roaster" },
    cover: { from: "#EFE3CC", to: "#B8863B", motif: "grid" },
    body: [
      {
        type: "p",
        text: "Specialty coffee is graded on a 100-point scale by licensed Q graders, who score ten attributes out of ten and add them together. Anything at 80 or above is specialty. Below that is commodity, and it goes into the tins.",
      },
      {
        type: "p",
        text: "So in practice the entire useful range is 80 to about 92. That is twelve points to describe every good coffee in the world, and it means the scale is enormously compressed at the top.",
      },
      { type: "h2", text: "What the ten attributes are" },
      {
        type: "list",
        items: [
          "Fragrance and aroma — dry grounds, then the crust after water is added.",
          "Flavour, aftertaste, acidity, body, balance — the core five.",
          "Uniformity, clean cup, sweetness — scored across five individual cups, and effectively pass/fail.",
          "Overall — the grader's own judgement, and the one that actually moves the number.",
        ],
      },
      {
        type: "p",
        text: "Notice that the last three are usually full marks for anything specialty. Which means most of the real variation lives in five attributes, and a single point of difference is a genuinely large gap.",
      },
      {
        type: "quote",
        text: "Between an 85 and an 88 there is more distance than the numbers suggest. Between an 88 and a 91 there is more still, and considerably more money.",
      },
      { type: "h2", text: "What it will not tell you" },
      {
        type: "p",
        text: "It will not tell you whether you will like it. A 90-point natural Ethiopian is objectively an extraordinary coffee and some people find it tastes like blueberry jam and want nothing to do with it. Score measures quality of execution against a standard, not fit to your palate.",
      },
      {
        type: "p",
        text: "It also does not survive roasting. The score belongs to the green coffee, cupped at a standardised light roast. What we do afterwards can protect it or waste it entirely, and no certificate covers that part.",
      },
      {
        type: "note",
        text: "We publish the score on every lot because it is a real number from a real assessment. It belongs next to altitude and process, not in the marketing copy.",
      },
    ],
  },
  {
    slug: "why-we-stopped-blending-for-consistency",
    title: "Why we stopped blending for consistency",
    standfirst:
      "For two years we chased a house espresso that tasted identical in January and July. We were solving the wrong problem.",
    category: "Roasting",
    date: "2026-03-08",
    readingMinutes: 5,
    author: { name: "Ines Varda", role: "Head roaster" },
    cover: { from: "#DDD9C8", to: "#A81F26", motif: "arcs" },
    body: [
      {
        type: "p",
        text: "The received wisdom is that a house blend should taste the same all year. Customers build a habit around it; the moment it changes they notice, and noticing is bad.",
      },
      {
        type: "p",
        text: "We believed that, and for two years we blended toward a fixed sensory target. When the Brazilian component ran out we found another Brazilian. When that one was brighter than the last we roasted it a little deeper to bring it back into line.",
      },
      { type: "h2", text: "What that actually costs" },
      {
        type: "p",
        text: "Roasting deeper to hide a difference is a real technique and it works. It also flattens the coffee. Every correction we made moved the blend a few points deeper, and because each correction was small, nobody caught it.",
      },
      {
        type: "p",
        text: "We pulled our own records at the end of the second year. The blend had drifted from a measured 58 to a measured 69 without a single deliberate decision to make it darker. It tasted, by then, like a perfectly decent dark roast, and nothing at all like the coffee we had launched.",
      },
      {
        type: "quote",
        text: "Consistency of flavour and consistency of intent are different goals, and we had quietly swapped one for the other.",
      },
      { type: "h2", text: "What we do now" },
      {
        type: "list",
        items: [
          "The Deep End has a fixed depth target of 66 and a fixed ratio, not a fixed flavour. Components rotate as harvests turn over.",
          "When a component changes we say so on the product page, with the new origin and the date it went in.",
          "If the new lot needs a different profile to taste like itself, it gets one. We do not roast a coffee darker to make it disappear into a blend.",
        ],
      },
      {
        type: "p",
        text: "Some months it is a little more chocolatey; some months there is more red fruit in it. It is recognisably the same coffee doing the same job, and it has not drifted a point since we changed the rule.",
      },
      {
        type: "note",
        text: "The current build is 70% Cerrado Mineiro, 30% washed Huila, in since February 2026.",
      },
    ],
  },
]

export function findPost(slug: string): Post | undefined {
  return POSTS.find((p) => p.slug === slug)
}

export function sortedPosts(): Post[] {
  return [...POSTS].sort((a, b) => (a.date < b.date ? 1 : -1))
}

export function relatedPosts(slug: string, count = 2): Post[] {
  const current = findPost(slug)
  if (!current) return sortedPosts().slice(0, count)
  const sameCategory = sortedPosts().filter(
    (p) => p.slug !== slug && p.category === current.category,
  )
  const rest = sortedPosts().filter((p) => p.slug !== slug && p.category !== current.category)
  return [...sameCategory, ...rest].slice(0, count)
}

export function formatPostDate(iso: string): string {
  return new Date(iso + "T00:00:00Z").toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  })
}

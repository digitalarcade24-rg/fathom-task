import type { Product } from "@/lib/data/catalog"

/**
 * Product imagery, drawn rather than photographed.
 *
 * Every bag on this site is an SVG generated from the product's own record —
 * its palette, its lot number, its depth. Nothing to hotlink, nothing to break,
 * and the label always agrees with the data on the page because it is the same
 * data. Gear renders as a carton instead of a pouch.
 */

function nameLines(name: string, maxChars: number): string[] {
  const words = name.toUpperCase().split(" ")
  const lines: string[] = []
  let current = ""
  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word
    if (candidate.length > maxChars && current) {
      lines.push(current)
      current = word
    } else {
      current = candidate
    }
  }
  if (current) lines.push(current)
  return lines.slice(0, 3)
}

export function BagRender({
  product,
  className = "",
  shadow = true,
}: {
  product: Product
  className?: string
  shadow?: boolean
}) {
  const { palette: p } = product
  const isBox = product.kind === "gear"
  const uid = `bag-${product.id}`

  const lines = nameLines(product.name, isBox ? 11 : 9)
  // Start from a size that suits the line count, then shrink until the longest
  // line clears the 204px print area — otherwise "FIELD SCALE" runs off the bag.
  const PRINT_WIDTH = 204
  const CAP_RATIO = 0.56
  const longest = Math.max(...lines.map((l) => l.length))
  const baseSize = lines.length >= 3 ? 30 : lines.length === 2 ? 36 : 42
  const nameSize = Math.min(baseSize, Math.floor(PRINT_WIDTH / (longest * CAP_RATIO)))

  const originLine =
    product.country ??
    (product.kind === "subscription" ? "Rotating origin" : "Made for FATHOM")

  return (
    <svg
      viewBox="0 0 300 412"
      className={className}
      role="img"
      aria-label={`${product.name} — ${product.tagline}`}
    >
      <defs>
        <linearGradient id={`${uid}-gusset-l`} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%" stopColor="#000" stopOpacity="0.16" />
          <stop offset="100%" stopColor="#000" stopOpacity="0" />
        </linearGradient>
        <linearGradient id={`${uid}-gusset-r`} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%" stopColor="#000" stopOpacity="0" />
          <stop offset="100%" stopColor="#000" stopOpacity="0.2" />
        </linearGradient>
        <linearGradient id={`${uid}-sheen`} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%" stopColor="#fff" stopOpacity="0" />
          <stop offset="45%" stopColor="#fff" stopOpacity="0.13" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <filter id={`${uid}-blur`} x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="9" />
        </filter>
        <clipPath id={`${uid}-clip`}>
          {isBox ? (
            <rect x="26" y="52" width="248" height="332" rx="4" />
          ) : (
            <path d="M32 34 L268 34 L275 378 Q275 388 265 388 L35 388 Q25 388 25 378 Z" />
          )}
        </clipPath>
      </defs>

      {shadow ? (
        <ellipse
          cx="150"
          cy="396"
          rx="112"
          ry="12"
          fill="#171A14"
          opacity="0.2"
          filter={`url(#${uid}-blur)`}
        />
      ) : null}

      {/* ── body ─────────────────────────────────────────────────────────── */}
      {isBox ? (
        <>
          <rect x="26" y="52" width="248" height="332" rx="4" fill={p.bag} />
          {/* lid seam */}
          <path d="M26 96 H274" stroke="#000" strokeOpacity="0.13" strokeWidth="1" />
        </>
      ) : (
        <>
          {/* fin seal across the top, with the crimp notches */}
          <rect x="32" y="10" width="236" height="26" rx="2" fill={p.bag} />
          <rect x="32" y="10" width="236" height="26" rx="2" fill="#000" fillOpacity="0.15" />
          <g stroke="#000" strokeOpacity="0.18" strokeWidth="1">
            {Array.from({ length: 24 }, (_, i) => (
              <line key={i} x1={38 + i * 10} y1="13" x2={38 + i * 10} y2="33" />
            ))}
          </g>
          <path
            d="M32 34 L268 34 L275 378 Q275 388 265 388 L35 388 Q25 388 25 378 Z"
            fill={p.bag}
          />
        </>
      )}

      <g clipPath={`url(#${uid}-clip)`}>
        <rect x="0" y="0" width="86" height="412" fill={`url(#${uid}-gusset-l)`} />
        <rect x="214" y="0" width="86" height="412" fill={`url(#${uid}-gusset-r)`} />
        <rect x="86" y="0" width="120" height="412" fill={`url(#${uid}-sheen)`} />

        {/* ── printed label ──────────────────────────────────────────────── */}
        <g fill={p.ink}>
          {/* brand lockup */}
          <g transform="translate(48, 66)" opacity="0.92">
            <path d="M6 0v9.6" stroke={p.ink} strokeWidth="1.15" />
            <path d="M1.4 1.9h9.2" stroke={p.ink} strokeWidth="1.15" />
            <path d="M2.9 4.8h6.2" stroke={p.ink} strokeWidth="1.15" />
            <path d="M4.4 7.7h3.2" stroke={p.ink} strokeWidth="1.15" />
            <path d="M6 9.7 8.2 12 6 14.4 3.8 12Z" fill={p.ink} />
            <text
              x="20"
              y="10.5"
              fontFamily="var(--font-mono)"
              fontSize="9.5"
              letterSpacing="3.1"
              fontWeight="500"
            >
              FATHOM
            </text>
          </g>

          {/* hairline under the lockup */}
          <rect x="48" y="92" width="204" height="0.9" opacity="0.28" />

          {/* name */}
          <text
            fontFamily="var(--font-display)"
            fontSize={nameSize}
            letterSpacing="-0.4"
            style={{ fontVariationSettings: '"WONK" 1, "opsz" 90' }}
          >
            {lines.map((line, i) => (
              <tspan key={i} x="48" y={144 + i * (nameSize * 0.98)}>
                {line}
              </tspan>
            ))}
          </text>

          {/* origin + process */}
          <text
            x="48"
            y={158 + lines.length * (nameSize * 0.98)}
            fontFamily="var(--font-mono)"
            fontSize="9"
            letterSpacing="1.9"
            opacity="0.72"
          >
            {originLine.toUpperCase()}
          </text>
          {product.process ? (
            <text
              x="48"
              y={172 + lines.length * (nameSize * 0.98)}
              fontFamily="var(--font-mono)"
              fontSize="9"
              letterSpacing="1.9"
              opacity="0.52"
            >
              {product.process.split(",")[0].toUpperCase()}
            </text>
          ) : null}
        </g>

        {/* ── the band ───────────────────────────────────────────────────── */}
        <rect x="0" y="274" width="300" height="62" fill={p.band} />
        {typeof product.depth === "number" ? (
          <>
            <text
              x="48"
              y="316"
              fill={p.foil}
              fontFamily="var(--font-display)"
              fontSize="38"
              style={{ fontVariationSettings: '"WONK" 1, "opsz" 90' }}
            >
              {product.depth}
            </text>
            <text
              x={product.depth >= 10 ? 96 : 76}
              y="300"
              fill={p.foil}
              fontFamily="var(--font-mono)"
              fontSize="8.5"
              letterSpacing="2.2"
              opacity="0.9"
            >
              DEPTH
            </text>
            <text
              x={product.depth >= 10 ? 96 : 76}
              y="314"
              fill={p.foil}
              fontFamily="var(--font-mono)"
              fontSize="8.5"
              letterSpacing="2.2"
              opacity="0.6"
            >
              OF 100
            </text>
            {/* the coffee's position, marked on the band */}
            <g opacity="0.8">
              <rect x="176" y="304" width="76" height="0.9" fill={p.foil} />
              <rect
                x={176 + (product.depth / 100) * 76 - 0.7}
                y="298"
                width="1.6"
                height="13"
                fill={p.foil}
              />
            </g>
          </>
        ) : (
          <text
            x="48"
            y="311"
            fill={p.foil}
            fontFamily="var(--font-mono)"
            fontSize="10"
            letterSpacing="2.6"
          >
            {product.kind === "subscription" ? "SUBSCRIPTION" : "FATHOM EQUIPMENT"}
          </text>
        )}

        {/* ── foot ───────────────────────────────────────────────────────── */}
        <g fill={p.ink} fontFamily="var(--font-mono)" fontSize="8.5" letterSpacing="1.8">
          <text x="48" y="360" opacity="0.68">
            LOT {product.lot}
          </text>
          <text x="252" y="360" textAnchor="end" opacity="0.68">
            {product.variants[0]?.label.toUpperCase() ?? ""}
          </text>
          {product.score ? (
            <text x="48" y="374" opacity="0.4">
              SCA {product.score.toFixed(1)}
            </text>
          ) : null}
          {product.altitude ? (
            <text x="252" y="374" textAnchor="end" opacity="0.4">
              {product.altitude.toLocaleString("en-US")} MASL
            </text>
          ) : null}
        </g>
      </g>

      {/* one-way degassing valve */}
      {!isBox ? (
        <g opacity="0.4">
          <circle cx="228" cy="112" r="13" fill="none" stroke={p.ink} strokeWidth="0.9" />
          <circle cx="228" cy="112" r="4.5" fill="none" stroke={p.ink} strokeWidth="0.9" />
        </g>
      ) : null}
    </svg>
  )
}

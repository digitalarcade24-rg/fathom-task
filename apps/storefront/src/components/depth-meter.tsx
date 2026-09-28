import { depthBand } from "@/lib/data/catalog"

/**
 * The sounding rule in miniature — one coffee's position on the 0–100 scale.
 * Appears on every product card and at the top of every product page.
 */
export function DepthMeter({
  depth,
  showLabel = true,
  className = "",
}: {
  depth: number
  showLabel?: boolean
  className?: string
}) {
  return (
    <div className={className}>
      {showLabel ? (
        <div className="meta-sm mb-2 flex items-baseline justify-between text-ink-45">
          <span>Depth</span>
          <span className="text-ink">
            {depth} · {depthBand(depth)}
          </span>
        </div>
      ) : null}
      <div
        className="relative h-[7px] w-full"
        role="img"
        aria-label={`Roast depth ${depth} of 100 — ${depthBand(depth)}`}
      >
        {/* the roast gradient: raw green through to charred */}
        <div
          className="absolute inset-x-0 top-[3px] h-[1.5px]"
          style={{
            background:
              "linear-gradient(to right, #C9D6B4 0%, #C4A97A 28%, #8A5A38 58%, #4A2E20 80%, #241610 100%)",
            opacity: 0.55,
          }}
        />
        {/* decade ticks */}
        <div className="absolute inset-x-0 top-0 flex justify-between">
          {Array.from({ length: 11 }, (_, i) => (
            <span key={i} className="block h-[7px] w-px bg-ink/15" />
          ))}
        </div>
        {/* the marker */}
        <span
          className="absolute top-[-2px] block h-[11px] w-[2px] bg-cherry"
          style={{ left: `calc(${depth}% - 1px)` }}
        />
      </div>
    </div>
  )
}

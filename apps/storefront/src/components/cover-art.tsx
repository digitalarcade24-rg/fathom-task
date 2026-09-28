import type { Post } from "@/lib/data/journal"

/**
 * Journal cover art, generated per post.
 *
 * Four motifs, each borrowed from an instrument the article is about: arcs for
 * pour patterns, contour for altitude, grid for lab measurement, scale for the
 * roast rule. Deterministic — the same post always draws the same image.
 */
export function CoverArt({
  post,
  className = "",
  seedOffset = 0,
}: {
  post: Post
  className?: string
  seedOffset?: number
}) {
  const { from, to, motif } = post.cover
  const uid = `cov-${post.slug}-${seedOffset}`

  return (
    <svg
      viewBox="0 0 800 500"
      preserveAspectRatio="xMidYMid slice"
      className={className}
      role="presentation"
      aria-hidden
    >
      <defs>
        <linearGradient id={`${uid}-bg`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={from} />
          <stop offset="100%" stopColor={to} />
        </linearGradient>
        <clipPath id={`${uid}-clip`}>
          <rect width="800" height="500" />
        </clipPath>
      </defs>

      <rect width="800" height="500" fill={`url(#${uid}-bg)`} />

      <g clipPath={`url(#${uid}-clip)`} stroke={from} fill="none" opacity="0.5">
        {motif === "arcs" &&
          Array.from({ length: 16 }, (_, i) => (
            <circle
              key={i}
              cx="640"
              cy="420"
              r={40 + i * 46}
              strokeWidth={i % 4 === 0 ? 1.6 : 0.7}
              opacity={1 - i * 0.045}
            />
          ))}

        {motif === "contour" &&
          Array.from({ length: 13 }, (_, i) => (
            <path
              key={i}
              d={`M-40 ${430 - i * 34} C 150 ${380 - i * 30}, 290 ${470 - i * 38}, 440 ${
                400 - i * 31
              } S 700 ${330 - i * 27}, 860 ${390 - i * 33}`}
              strokeWidth={i % 3 === 0 ? 1.5 : 0.7}
              opacity={1 - i * 0.05}
            />
          ))}

        {motif === "grid" && (
          <>
            {Array.from({ length: 21 }, (_, i) => (
              <line
                key={`v${i}`}
                x1={i * 40}
                y1="0"
                x2={i * 40}
                y2="500"
                strokeWidth={i % 5 === 0 ? 1.3 : 0.5}
                opacity={i % 5 === 0 ? 0.9 : 0.45}
              />
            ))}
            {Array.from({ length: 13 }, (_, i) => (
              <line
                key={`h${i}`}
                x1="0"
                y1={i * 40}
                x2="800"
                y2={i * 40}
                strokeWidth={i % 5 === 0 ? 1.3 : 0.5}
                opacity={i % 5 === 0 ? 0.9 : 0.45}
              />
            ))}
          </>
        )}

        {motif === "scale" && (
          <>
            <line x1="0" y1="300" x2="800" y2="300" strokeWidth="1.6" />
            {Array.from({ length: 41 }, (_, i) => {
              const major = i % 5 === 0
              return (
                <line
                  key={i}
                  x1={i * 20}
                  y1="300"
                  x2={i * 20}
                  y2={major ? 340 : 320}
                  strokeWidth={major ? 1.6 : 0.7}
                />
              )
            })}
            {[140, 320, 500, 640].map((x, i) => (
              <g key={x}>
                <line x1={x} y1={300} x2={x} y2={200 - i * 22} strokeWidth="1.4" />
                <circle cx={x} cy={200 - i * 22} r="5" fill={from} stroke="none" />
              </g>
            ))}
          </>
        )}
      </g>
    </svg>
  )
}

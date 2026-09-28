/**
 * The FATHOM mark: a sounding line.
 *
 * Before sonar, depth was measured by dropping a weighted line over the side
 * and reading the marks on it. Three descending ticks and a plumb bob — the
 * same idea the whole brand is built on, drawn in eleven strokes.
 */
export function Mark({ className = "", title }: { className?: string; title?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      role={title ? "img" : "presentation"}
      aria-hidden={title ? undefined : true}
      aria-label={title}
    >
      {title ? <title>{title}</title> : null}
      <path
        d="M12 2.5v13.2"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="square"
      />
      <path d="M5.6 5.2h12.8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="square" />
      <path d="M7.6 9.1h8.8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="square" />
      <path d="M9.6 13h4.8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="square" />
      <path d="M12 15.7 15.1 19 12 22.4 8.9 19Z" fill="currentColor" />
    </svg>
  )
}

export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <Mark className="h-[1.45em] w-[1.45em] shrink-0" />
      <span
        className="font-display leading-none"
        style={{ letterSpacing: "0.18em", fontVariationSettings: '"WONK" 0, "opsz" 40' }}
      >
        FATHOM
      </span>
    </span>
  )
}

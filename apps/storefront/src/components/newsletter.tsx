"use client"

import { useState, type FormEvent } from "react"

/**
 * There is no mailing-list provider wired up in this demo, so the form does the
 * honest thing: it validates, confirms, and says plainly that nothing was sent.
 */
export function Newsletter({ tone = "paper" }: { tone?: "paper" | "ink" }) {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "done" | "error">("idle")

  const onInk = tone === "ink"

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus("error")
      return
    }
    setStatus("done")
  }

  if (status === "done") {
    return (
      <p
        className={`text-[0.95rem] leading-relaxed ${onInk ? "text-paper/70" : "text-ink-70"}`}
        role="status"
      >
        <span className={onInk ? "text-paper" : "text-ink"}>{email}</span> is on the list — or it
        would be. This storefront is a demo and no mailing provider is connected, so nothing left
        your browser.
      </p>
    )
  }

  return (
    <form onSubmit={onSubmit} noValidate>
      <label
        htmlFor="newsletter-email"
        className={`meta-sm block ${onInk ? "text-paper/45" : "text-ink-45"}`}
      >
        Lot notes, every other Thursday
      </label>
      <div
        className={`mt-3 flex items-center gap-3 border-b pb-2 ${
          onInk ? "border-paper/30" : "border-ink/25"
        }`}
      >
        <input
          id="newsletter-email"
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value)
            if (status === "error") setStatus("idle")
          }}
          placeholder="you@example.com"
          autoComplete="email"
          aria-invalid={status === "error"}
          aria-describedby={status === "error" ? "newsletter-error" : undefined}
          className={`w-full bg-transparent py-2 text-[0.95rem] outline-none placeholder:opacity-40 ${
            onInk ? "text-paper" : "text-ink"
          }`}
        />
        <button
          type="submit"
          className={`meta-sm shrink-0 py-2 transition-colors ${
            onInk ? "text-paper/70 hover:text-paper" : "text-ink-45 hover:text-cherry"
          }`}
        >
          Join →
        </button>
      </div>
      {status === "error" ? (
        <p id="newsletter-error" className="meta-sm mt-3 text-cherry" role="alert">
          That address does not look right. Check it and try again.
        </p>
      ) : (
        <p className={`mt-3 text-[0.8rem] ${onInk ? "text-paper/40" : "text-ink-45"}`}>
          What we bought, what it scored, what we are drinking. No offers.
        </p>
      )}
    </form>
  )
}

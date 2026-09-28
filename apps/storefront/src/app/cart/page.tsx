"use client"

import Link from "next/link"
import { useState } from "react"

import { FREE_SHIPPING_AT, useCart } from "@/lib/cart"
import { money } from "@/lib/format"

const SHIPPING = 550

export default function CartPage() {
  const { lines, subtotal, count, setQty, remove, clear } = useCart()
  const [attempted, setAttempted] = useState(false)

  const shipping = subtotal >= FREE_SHIPPING_AT || subtotal === 0 ? 0 : SHIPPING
  const total = subtotal + shipping

  return (
    <section className="shell py-14 md:py-20">
      <p className="meta text-ink-45">Your order</p>
      <h1 className="display-xl mt-6">
        {count === 0 ? "Nothing here yet" : `${count} ${count === 1 ? "item" : "items"}`}
      </h1>

      {lines.length === 0 ? (
        <div className="hairline-t mt-12 pt-12">
          <p className="lede max-w-lg text-ink-70">
            Nine lots on the shelf, ordered shallow to deep. Start at 18 if you want florals and at
            66 if you want something that stands up to milk.
          </p>
          <Link href="/coffee" className="btn btn-solid mt-9">
            <span>Browse the shelf</span>
          </Link>
        </div>
      ) : (
        <div className="mt-14 grid gap-16 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] lg:gap-24">
          {/* ── lines ────────────────────────────────────────────────── */}
          <div>
            <ul className="hairline-t">
              {lines.map((line) => (
                <li
                  key={line.key}
                  className="hairline-b grid grid-cols-[minmax(0,1fr)_auto] gap-6 py-7"
                >
                  <div>
                    <Link
                      href={`/coffee/${line.handle}`}
                      className="display-s transition-colors hover:text-cherry"
                    >
                      {line.name}
                    </Link>
                    <p className="meta-sm mt-2.5 text-ink-45">
                      {line.variantLabel}
                      {line.grind ? ` · ${line.grind}` : ""}
                    </p>

                    <div className="mt-5 flex items-center gap-5">
                      <div className="flex items-center border border-ink/20">
                        <button
                          type="button"
                          onClick={() => setQty(line.key, line.qty - 1)}
                          className="flex h-9 w-9 items-center justify-center text-ink-45 hover:text-ink"
                          aria-label={`Decrease quantity of ${line.name}`}
                        >
                          −
                        </button>
                        <span className="meta-sm w-7 text-center text-ink">{line.qty}</span>
                        <button
                          type="button"
                          onClick={() => setQty(line.key, line.qty + 1)}
                          className="flex h-9 w-9 items-center justify-center text-ink-45 hover:text-ink"
                          aria-label={`Increase quantity of ${line.name}`}
                        >
                          +
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => remove(line.key)}
                        className="meta-sm text-ink-45 underline-offset-4 hover:text-cherry hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  </div>

                  <p className="meta pt-1 text-ink">{money(line.price * line.qty)}</p>
                </li>
              ))}
            </ul>

            <div className="mt-8 flex justify-between">
              <Link href="/coffee" className="meta link-underline text-ink-70 hover:text-ink">
                ← Keep shopping
              </Link>
              <button
                type="button"
                onClick={clear}
                className="meta-sm text-ink-45 underline-offset-4 hover:text-cherry hover:underline"
              >
                Empty the cart
              </button>
            </div>
          </div>

          {/* ── summary ──────────────────────────────────────────────── */}
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="bg-paper-deep px-7 py-8">
              <h2 className="meta text-ink-45">Summary</h2>

              <dl className="mt-7">
                <div className="hairline-b flex justify-between py-3.5">
                  <dt className="text-[0.92rem] text-ink-70">Subtotal</dt>
                  <dd className="text-[0.92rem] text-ink">{money(subtotal)}</dd>
                </div>
                <div className="hairline-b flex justify-between py-3.5">
                  <dt className="text-[0.92rem] text-ink-70">Shipping</dt>
                  <dd className="text-[0.92rem] text-ink">
                    {shipping === 0 ? "Free" : money(shipping)}
                  </dd>
                </div>
                <div className="flex items-baseline justify-between pt-6">
                  <dt className="meta text-ink-45">Total</dt>
                  <dd className="display-s text-ink">{money(total)}</dd>
                </div>
              </dl>

              <button
                type="button"
                onClick={() => setAttempted(true)}
                className="btn btn-solid mt-8 w-full"
              >
                <span>Checkout</span>
              </button>

              {attempted ? (
                <p className="mt-5 text-[0.85rem] leading-relaxed text-ink-70" role="status">
                  No payment provider is connected. This storefront is a demo — wire up a Medusa
                  backend and a Stripe key and this button becomes a real checkout. Nothing has been
                  charged.
                </p>
              ) : (
                <p className="meta-sm mt-5 leading-relaxed text-ink-45">
                  Roasted Tuesdays and Fridays · Posted within 48 hours
                </p>
              )}
            </div>
          </aside>
        </div>
      )}
    </section>
  )
}

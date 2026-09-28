"use client"

import Link from "next/link"

import { FREE_SHIPPING_AT, useCart } from "@/lib/cart"
import { money } from "@/lib/format"

export function CartDrawer() {
  const { lines, isOpen, close, setQty, remove, subtotal, count } = useCart()

  const remaining = Math.max(0, FREE_SHIPPING_AT - subtotal)
  const progress = Math.min(100, (subtotal / FREE_SHIPPING_AT) * 100)

  return (
    <>
      <div
        onClick={close}
        aria-hidden
        className={`fixed inset-0 z-[70] bg-ink/45 transition-opacity duration-500 ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      <aside
        aria-label="Cart"
        aria-hidden={!isOpen}
        className={`fixed top-0 right-0 z-[80] flex h-dvh w-full max-w-[27rem] flex-col bg-paper transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <header className="hairline-b flex items-center justify-between px-6 py-5">
          <h2 className="meta">
            Cart {count > 0 ? <span className="text-ink-45">· {count}</span> : null}
          </h2>
          <button
            type="button"
            onClick={close}
            className="meta-sm -mr-2 flex h-10 items-center px-2 text-ink-45 transition-colors hover:text-ink"
          >
            Close
          </button>
        </header>

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-6 px-8 text-center">
            <p className="display-s text-ink/70">Nothing in the cart yet.</p>
            <p className="text-sm text-ink-45">
              Nine lots on the shelf, shallow to deep.
            </p>
            <Link href="/coffee" onClick={close} className="btn mt-2">
              <span>Browse the shelf</span>
            </Link>
          </div>
        ) : (
          <>
            <ul className="no-scrollbar flex-1 overflow-y-auto px-6">
              {lines.map((line) => (
                <li key={line.key} className="hairline-b flex gap-4 py-6">
                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/coffee/${line.handle}`}
                      onClick={close}
                      className="display-s block leading-tight hover:text-cherry"
                    >
                      {line.name}
                    </Link>
                    <p className="meta-sm mt-2 text-ink-45">
                      {line.variantLabel}
                      {line.grind ? ` · ${line.grind}` : ""}
                    </p>

                    <div className="mt-4 flex items-center gap-4">
                      <div className="flex items-center border border-ink/20">
                        <button
                          type="button"
                          onClick={() => setQty(line.key, line.qty - 1)}
                          className="flex h-8 w-8 items-center justify-center text-ink-45 transition-colors hover:text-ink"
                          aria-label={`Decrease quantity of ${line.name}`}
                        >
                          −
                        </button>
                        <span className="meta-sm w-6 text-center text-ink" aria-live="polite">
                          {line.qty}
                        </span>
                        <button
                          type="button"
                          onClick={() => setQty(line.key, line.qty + 1)}
                          className="flex h-8 w-8 items-center justify-center text-ink-45 transition-colors hover:text-ink"
                          aria-label={`Increase quantity of ${line.name}`}
                        >
                          +
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => remove(line.key)}
                        className="meta-sm text-ink-45 underline-offset-4 transition-colors hover:text-cherry hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  </div>

                  <p className="meta shrink-0 pt-1 text-ink">{money(line.price * line.qty)}</p>
                </li>
              ))}
            </ul>

            <footer className="hairline-t px-6 py-6">
              <div className="mb-5">
                <div className="meta-sm mb-2 flex justify-between text-ink-45">
                  <span>
                    {remaining > 0 ? `${money(remaining)} to free shipping` : "Free shipping unlocked"}
                  </span>
                  <span>{money(FREE_SHIPPING_AT)}</span>
                </div>
                <div className="h-px w-full bg-ink/15">
                  <div
                    className="h-px bg-cherry transition-all duration-700"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              <div className="mb-5 flex items-baseline justify-between">
                <span className="meta text-ink-45">Subtotal</span>
                <span className="display-s">{money(subtotal)}</span>
              </div>

              <Link href="/cart" onClick={close} className="btn btn-solid w-full">
                <span>Review order</span>
              </Link>
              <p className="meta-sm mt-4 text-center leading-relaxed text-ink-45">
                Shipping and tax at checkout
              </p>
            </footer>
          </>
        )}
      </aside>
    </>
  )
}

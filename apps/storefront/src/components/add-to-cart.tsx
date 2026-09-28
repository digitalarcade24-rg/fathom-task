"use client"

import { useState } from "react"

import { useCart } from "@/lib/cart"
import type { Product } from "@/lib/data/catalog"
import { money } from "@/lib/format"

export function AddToCart({ product }: { product: Product }) {
  const { add } = useCart()
  const [variantIndex, setVariantIndex] = useState(0)
  const [grind, setGrind] = useState(product.grinds?.[0])

  const variant = product.variants[variantIndex]
  const soldOut = !variant || variant.stock <= 0

  function submit() {
    if (!variant || soldOut) return
    add({
      handle: product.handle,
      name: product.name,
      variantId: variant.id,
      variantLabel: variant.label,
      grind,
      price: variant.price,
    })
  }

  return (
    <div className="flex flex-col gap-8">
      {product.variants.length > 1 ? (
        <fieldset>
          <legend className="meta-sm mb-3 text-ink-45">
            {product.kind === "gear" ? "Finish" : "Size"}
          </legend>
          <div className="flex flex-wrap gap-2.5">
            {product.variants.map((v, i) => (
              <button
                key={v.id}
                type="button"
                onClick={() => setVariantIndex(i)}
                aria-pressed={i === variantIndex}
                className={`meta-sm border px-4 py-3 transition-colors ${
                  i === variantIndex
                    ? "border-ink bg-ink text-paper"
                    : "border-ink/20 text-ink-70 hover:border-ink/50"
                }`}
              >
                {v.label} · {money(v.price)}
              </button>
            ))}
          </div>
        </fieldset>
      ) : null}

      {product.grinds ? (
        <fieldset>
          <legend className="meta-sm mb-3 text-ink-45">Grind</legend>
          <div className="flex flex-wrap gap-2.5">
            {product.grinds.map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => setGrind(g)}
                aria-pressed={g === grind}
                className={`meta-sm border px-4 py-3 transition-colors ${
                  g === grind
                    ? "border-ink bg-ink text-paper"
                    : "border-ink/20 text-ink-70 hover:border-ink/50"
                }`}
              >
                {g}
              </button>
            ))}
          </div>
          <p className="mt-3 text-[0.82rem] text-ink-45">
            Whole bean keeps for weeks; ground keeps for days. Grind at home if you possibly can.
          </p>
        </fieldset>
      ) : null}

      <div>
        <button type="button" onClick={submit} disabled={soldOut} className="btn btn-solid w-full">
          <span>
            {soldOut ? "Sold out" : `Add to cart — ${money(variant.price)}`}
          </span>
        </button>
        {!soldOut && variant.stock < 12 ? (
          <p className="meta-sm mt-4 text-cherry">Only {variant.stock} bags left of this lot</p>
        ) : null}
      </div>
    </div>
  )
}

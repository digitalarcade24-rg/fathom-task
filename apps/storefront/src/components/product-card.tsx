import Link from "next/link"

import { BagRender } from "@/components/bag-render"
import { DepthMeter } from "@/components/depth-meter"
import type { Product } from "@/lib/data/catalog"
import { money } from "@/lib/format"

export function ProductCard({ product, index }: { product: Product; index?: number }) {
  return (
    <article className="group flex h-full flex-col">
      <Link href={`/coffee/${product.handle}`} className="flex h-full flex-col">
        <div className="relative overflow-hidden bg-paper-deep">
          <div className="meta-sm absolute top-4 left-4 z-10 text-ink/35">
            {typeof index === "number" ? String(index + 1).padStart(2, "0") : `Lot ${product.lot}`}
          </div>
          <BagRender
            product={product}
            className="w-full px-10 py-8 transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-2 group-hover:scale-[1.02]"
          />
        </div>

        <div className="flex flex-1 flex-col pt-6">
          <div className="flex items-baseline justify-between gap-4">
            <h3 className="display-s leading-tight transition-colors group-hover:text-cherry">
              {product.name}
            </h3>
            <p className="meta shrink-0 text-ink-70">{money(product.price)}</p>
          </div>

          <p className="mt-2.5 text-[0.9rem] leading-snug text-ink-45">{product.tagline}</p>

          {product.country ? (
            <p className="meta-sm mt-4 text-ink-45">
              {product.country}
              {product.altitude ? ` · ${product.altitude.toLocaleString("en-US")} masl` : ""}
            </p>
          ) : null}

          <div className="mt-auto pt-6">
            {typeof product.depth === "number" ? (
              <DepthMeter depth={product.depth} />
            ) : (
              <p className="meta-sm text-ink-45">
                {product.kind === "subscription" ? "Ships monthly" : "In stock"}
              </p>
            )}
          </div>
        </div>
      </Link>
    </article>
  )
}

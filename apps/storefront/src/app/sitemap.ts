import type { MetadataRoute } from "next"

import { COLLECTIONS, PRODUCTS } from "@/lib/data/catalog"
import { POSTS } from "@/lib/data/journal"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://fathomroasters.com"

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  return [
    { url: SITE_URL, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/coffee`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/journal`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${SITE_URL}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },

    ...COLLECTIONS.filter((c) => c.handle !== "all").map((c) => ({
      url: `${SITE_URL}/coffee?c=${c.handle}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.5,
    })),

    ...PRODUCTS.map((p) => ({
      url: `${SITE_URL}/coffee/${p.handle}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),

    ...POSTS.map((p) => ({
      url: `${SITE_URL}/journal/${p.slug}`,
      lastModified: new Date(`${p.date}T00:00:00Z`),
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),
  ]
}

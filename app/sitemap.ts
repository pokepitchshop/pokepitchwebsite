import type { MetadataRoute } from "next"
import { getAllBlogPosts } from "@/lib/blog/posts"
import { getAllCatalogCards } from "@/lib/ebay/catalog"
import { CATEGORY_PATHS, SITE_URL } from "@/lib/seo/constants"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()
  const entries: MetadataRoute.Sitemap = [
    {
      url: `${SITE_URL}/`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/catalog`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    ...CATEGORY_PATHS.map((category) => ({
      url: `${SITE_URL}/catalog/${category}`,
      lastModified: now,
      changeFrequency: "daily" as const,
      priority: 0.85,
    })),
    {
      url: `${SITE_URL}/blog`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    },
  ]

  for (const post of getAllBlogPosts()) {
    entries.push({
      url: `${SITE_URL}/blog/${post.slug}`,
      lastModified: new Date(post.publishedAt),
      changeFrequency: "monthly",
      priority: 0.7,
    })
  }

  try {
    const cards = await getAllCatalogCards()
    for (const card of cards) {
      if (card.status !== "available") continue

      entries.push({
        url: `${SITE_URL}/catalog/${card.id}`,
        lastModified: card.dateAdded ? new Date(card.dateAdded) : now,
        changeFrequency: "weekly",
        priority: 0.8,
      })
    }
  } catch {
    // Static pages remain in sitemap if eBay credentials are unavailable at build time.
  }

  return entries
}

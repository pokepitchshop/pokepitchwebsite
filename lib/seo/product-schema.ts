import type { Card } from "@/lib/types/card"
import { upgradeEbayImageUrl } from "@/lib/ebay/image-url"
import { getCategoryPath } from "@/lib/seo/category-copy"
import { SITE_URL } from "@/lib/seo/constants"
import { isCardGraded } from "@/lib/inventory"

function getItemCondition(card: Card): string {
  if (isCardGraded(card)) return "https://schema.org/UsedCondition"
  return "https://schema.org/UsedCondition"
}

export function buildProductSchema(card: Card) {
  const image = upgradeEbayImageUrl(card.images[0]) ?? card.images[0]
  const productUrl = `${SITE_URL}/catalog/${card.id}`

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: card.name,
    description: card.description,
    image,
    sku: card.sku || card.ebayItemId || card.id,
    brand: {
      "@type": "Brand",
      name: "PokePitchShop",
    },
    offers: {
      "@type": "Offer",
      url: card.ebayUrl ?? productUrl,
      priceCurrency: card.currency,
      price: card.price.toFixed(2),
      availability:
        card.status === "available"
          ? "https://schema.org/InStock"
          : "https://schema.org/SoldOut",
      itemCondition: getItemCondition(card),
      seller: {
        "@type": "Organization",
        name: "PokePitchShop",
        url: SITE_URL,
      },
    },
  }
}

export function buildBreadcrumbSchema(card: Card) {
  const categoryPath = getCategoryPath(card.category)
  const categoryLabel =
    card.category === "mtg"
      ? "Magic: The Gathering"
      : card.category.charAt(0).toUpperCase() + card.category.slice(1)

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: SITE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Catalog",
        item: `${SITE_URL}/catalog`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: categoryLabel,
        item: `${SITE_URL}${categoryPath}`,
      },
      {
        "@type": "ListItem",
        position: 4,
        name: card.name,
        item: `${SITE_URL}/catalog/${card.id}`,
      },
    ],
  }
}

export function buildItemListSchema(
  cards: Card[],
  listName: string,
  listUrl: string
) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: listName,
    url: listUrl,
    numberOfItems: cards.length,
    itemListElement: cards.map((card, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `${SITE_URL}/catalog/${card.id}`,
      name: card.name,
    })),
  }
}

export type BlogPostMeta = {
  slug: string
  title: string
  description: string
  publishedAt: string
  category: string
  tags: string[]
  featuredImage?: string
}

export function buildBlogPostingSchema(post: BlogPostMeta) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.publishedAt,
    dateModified: post.publishedAt,
    author: {
      "@type": "Organization",
      name: "PokePitchShop",
      url: SITE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: "PokePitchShop",
      url: SITE_URL,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/images/pokepitchshoplogo.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_URL}/blog/${post.slug}`,
    },
    image: post.featuredImage
      ? `${SITE_URL}${post.featuredImage}`
      : `${SITE_URL}/images/pokepitchshoplogo.png`,
  }
}

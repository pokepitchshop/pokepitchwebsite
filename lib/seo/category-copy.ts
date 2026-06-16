import type { CardCategory } from "@/lib/types/card"

export type CategorySeoCopy = {
  title: string
  description: string
  h1: string
  intro: string
}

export const CATEGORY_SEO_COPY: Record<CardCategory, CategorySeoCopy> = {
  pokemon: {
    title: "Pokemon Cards For Sale | Authentic TCG Singles | PokePitchShop",
    description:
      "Shop authentic Pokemon TCG singles from vintage holos to modern chase cards. Live inventory synced from our eBay store with buyer protection.",
    h1: "Pokemon Cards For Sale",
    intro:
      "Browse our live Pokemon TCG inventory — from vintage Base Set holos and WOTC classics to modern sets like Evolving Skies and Scarlet & Violet. Every listing is pulled directly from our eBay store and updated hourly, so you always see what is actually in stock. Whether you are hunting a grail card for your binder or filling out a set, PokePitchShop offers authentic singles with honest descriptions and secure checkout through eBay buyer protection.",
  },
  sports: {
    title: "Sports Trading Cards For Sale | Baseball, Football & More | PokePitchShop",
    description:
      "Shop sports trading cards including baseball, football, basketball, and hockey. Rookies, inserts, and graded cards from a trusted collector-owned seller.",
    h1: "Sports Trading Cards For Sale",
    intro:
      "Explore our sports card inventory featuring baseball, football, basketball, and more. From rookie cards and popular parallels to vintage hall-of-famers, each listing comes from our actively managed eBay store with live availability. PokePitchShop is a collector-owned business — we inspect, pack, and ship every order with the care your collection deserves. Buy with confidence through eBay buyer protection.",
  },
  mtg: {
    title: "Magic: The Gathering Cards For Sale | MTG Singles | PokePitchShop",
    description:
      "Shop Magic: The Gathering singles and bulk lots. NM condition cards from classic sets — live inventory synced hourly from our eBay store.",
    h1: "Magic: The Gathering Cards For Sale",
    intro:
      "Find Magic: The Gathering singles for your deck, collection, or trade binder. Our inventory spans classic sets and bulk lots, with condition details in every listing. Inventory syncs live from our eBay store so prices and availability stay current. PokePitchShop combines collector expertise with reliable shipping — purchase securely on eBay with full buyer protection.",
  },
}

export function getCategoryPath(category: CardCategory): string {
  return `/catalog/${category}`
}

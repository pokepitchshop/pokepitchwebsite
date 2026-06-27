import { unstable_cache } from "next/cache"
import { cache } from "react"
import {
  EbayTradingClient,
  loadEbayConfigFromEnv,
  type ActiveListingSummary,
} from "@/lib/ebay/client"
import { mapSummaryToCard } from "@/lib/ebay/map-listing"
import type { Card, CardFilters } from "@/lib/types/card"

const DEFAULT_REVALIDATE_SECONDS = 3600
const DEFAULT_PAGE_SIZE = 24

function isGraded(card: Card): boolean {
  return card.condition === "graded" || card.grade !== null
}

function matchesQuery(card: Card, query: string): boolean {
  const normalized = query.trim().toLowerCase()
  if (!normalized) return true

  const haystack = [
    card.name,
    card.set,
    card.number,
    card.variant ?? "",
    card.sku ?? "",
    card.description,
  ]
    .join(" ")
    .toLowerCase()

  return haystack.includes(normalized)
}

function filterCards(cards: Card[], filters: CardFilters = {}): Card[] {
  const { category = "all", status = "all", graded = "all", query = "" } =
    filters

  return cards.filter((card) => {
    if (category !== "all" && card.category !== category) return false
    if (status !== "all" && card.status !== status) return false
    if (graded === "graded" && !isGraded(card)) return false
    if (graded === "raw" && isGraded(card)) return false
    if (!matchesQuery(card, query)) return false
    return true
  })
}

async function fetchListingSummaries(): Promise<ActiveListingSummary[]> {
  const client = new EbayTradingClient(loadEbayConfigFromEnv())
  return client.getAllActiveListings()
}

const getCachedListingSummaries = unstable_cache(
  fetchListingSummaries,
  ["ebay-listing-summaries"],
  {
    revalidate:
      Number(process.env.EBAY_CATALOG_REVALIDATE_SECONDS) ||
      DEFAULT_REVALIDATE_SECONDS,
  }
)

const getCatalogCardMap = cache(async (): Promise<Map<string, Card>> => {
  const summaries = await getCachedListingSummaries()
  const map = new Map<string, Card>()

  for (const summary of summaries) {
    const card = mapSummaryToCard(summary)
    map.set(card.id, card)
  }

  return map
})

export const getAllCatalogCards = cache(async (): Promise<Card[]> => {
  return Array.from((await getCatalogCardMap()).values())
})

export type CatalogPageResult = {
  cards: Card[]
  total: number
  totalPages: number
  page: number
  pageSize: number
}

export type CatalogPageOptions = CardFilters & {
  page?: number
  pageSize?: number
}

export async function getCatalogPage(
  options: CatalogPageOptions = {}
): Promise<CatalogPageResult> {
  const page = Math.max(1, options.page ?? 1)
  const pageSize = Math.max(1, options.pageSize ?? DEFAULT_PAGE_SIZE)
  const allCards = await getAllCatalogCards()
  const filtered = filterCards(allCards, options)
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const safePage = Math.min(page, totalPages)
  const start = (safePage - 1) * pageSize

  return {
    cards: filtered.slice(start, start + pageSize),
    total: filtered.length,
    totalPages,
    page: safePage,
    pageSize,
  }
}

export async function getEbayCardById(id: string): Promise<Card | undefined> {
  const map = await getCatalogCardMap()
  return map.get(id)
}

export async function getFeaturedEbayCards(limit = 6): Promise<Card[]> {
  const result = await getCatalogPage({
    status: "available",
    page: 1,
    pageSize: limit,
  })
  return result.cards
}

import inventoryData from "@/data/inventory.json"
import {
  type Card,
  type CardFilters,
  inventorySchema,
} from "@/lib/types/card"

const inventory: Card[] = inventorySchema.parse(inventoryData)

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
    card.description,
  ]
    .join(" ")
    .toLowerCase()

  return haystack.includes(normalized)
}

export function getAllCards(): Card[] {
  return [...inventory].sort(
    (a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime()
  )
}

export function getCardById(id: string): Card | undefined {
  return inventory.find((card) => card.id === id)
}

export function getFeaturedCards(limit = 6): Card[] {
  return getAllCards()
    .filter((card) => card.status === "available")
    .slice(0, limit)
}

export function filterCards(filters: CardFilters = {}): Card[] {
  const { category = "all", status = "all", graded = "all", query = "" } =
    filters

  return getAllCards().filter((card) => {
    if (category !== "all" && card.category !== category) return false
    if (status !== "all" && card.status !== status) return false
    if (graded === "graded" && !isGraded(card)) return false
    if (graded === "raw" && isGraded(card)) return false
    if (!matchesQuery(card, query)) return false
    return true
  })
}

export function formatPrice(price: number, currency: Card["currency"]): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(price)
}

export function getConditionLabel(card: Card): string {
  if (card.grade) {
    return `${card.grade.company} ${card.grade.value}`
  }
  return card.condition
}

export function isCardGraded(card: Card): boolean {
  return isGraded(card)
}

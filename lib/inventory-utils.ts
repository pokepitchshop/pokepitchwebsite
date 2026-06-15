import type { Card } from "@/lib/types/card"

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
  return card.condition === "graded" || card.grade !== null
}

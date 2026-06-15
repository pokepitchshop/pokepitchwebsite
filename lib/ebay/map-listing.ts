import type { Card, CardCategory } from "@/lib/types/card"
import type { ActiveListingSummary } from "@/lib/ebay/client"

const PLACEHOLDER_IMAGE =
  "https://i.ebayimg.com/images/g/placeholder/s-l1600.jpg"

const POKEMON_KEYWORDS = [
  "pokemon",
  "pokémon",
  "pikachu",
  "charizard",
  "tcg",
  "moonbreon",
  "umbreon",
  "evolving skies",
  "celebrations",
  "base set",
]

const MTG_KEYWORDS = [
  "mtg",
  "magic the gathering",
  " magic",
  "planeswalker",
]

const SPORTS_KEYWORDS = [
  "rookie",
  "prizm",
  "panini",
  "bowman",
  "fleer",
  "upper deck",
  "topps",
  "nba",
  "mlb",
  "nfl",
  "basketball",
  "baseball",
  "football",
  "jordan",
  "wembanyama",
  "herbert",
  "griffey",
]

const GRADE_PATTERN =
  /\b(PSA|BGS|CGC|SGC)\s*(\d+(?:\.\d+)?)\b/i

export type InventoryOverride = Partial<
  Pick<
    Card,
    | "name"
    | "category"
    | "set"
    | "number"
    | "variant"
    | "condition"
    | "grade"
    | "description"
  >
>

export type InventoryOverrides = Record<string, InventoryOverride>

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

function stringValue(value: unknown): string {
  if (typeof value === "string") return value
  if (typeof value === "number" || typeof value === "boolean") return String(value)
  return ""
}

export function detectCategoryFromTitle(title: string): CardCategory {
  const haystack = title.toLowerCase()

  const mtgScore = MTG_KEYWORDS.reduce(
    (score, keyword) => score + (haystack.includes(keyword) ? 1 : 0),
    0
  )
  const pokemonScore = POKEMON_KEYWORDS.reduce(
    (score, keyword) => score + (haystack.includes(keyword) ? 1 : 0),
    0
  )
  const sportsScore = SPORTS_KEYWORDS.reduce(
    (score, keyword) => score + (haystack.includes(keyword) ? 1 : 0),
    0
  )

  if (mtgScore > 0 && mtgScore >= pokemonScore && mtgScore >= sportsScore) {
    return "mtg"
  }
  if (pokemonScore > sportsScore) return "pokemon"
  if (sportsScore > pokemonScore) return "sports"
  return "mtg"
}

function parseGrade(text: string): Card["grade"] {
  const match = text.match(GRADE_PATTERN)
  if (!match) return null

  return {
    company: match[1].toUpperCase(),
    value: Number(match[2]),
  }
}

/** Fast path: map a listing summary to a catalog card (no GetItem call). */
export function mapSummaryToCard(summary: ActiveListingSummary): Card {
  const grade = parseGrade(summary.title)
  const category = detectCategoryFromTitle(summary.title)

  return {
    id: `ebay-${summary.itemId}`,
    name: summary.title,
    category,
    set: "See listing",
    number: summary.sku || "",
    condition: grade ? "graded" : "See listing",
    grade,
    price: summary.currentPrice,
    currency: "USD",
    status:
      summary.quantityAvailable > 0 || summary.quantity > 0
        ? "available"
        : "sold",
    images: [summary.imageUrl || PLACEHOLDER_IMAGE],
    description: `${summary.title} available from PokePitchShop. Buy on eBay with buyer protection.`,
    ebayUrl: `https://www.ebay.com/itm/${summary.itemId}`,
    ebayItemId: summary.itemId,
    sku: summary.sku || undefined,
    dateAdded: new Date().toISOString().slice(0, 10),
  }
}

function parseItemSpecifics(
  item: Record<string, unknown>
): Record<string, string> {
  const specifics: Record<string, string> = {}
  const itemSpecifics = isRecord(item.ItemSpecifics) ? item.ItemSpecifics : null
  const nameValueList = itemSpecifics?.NameValueList

  const entries = Array.isArray(nameValueList)
    ? nameValueList
    : nameValueList
      ? [nameValueList]
      : []

  for (const entry of entries) {
    if (!isRecord(entry)) continue
    const name = stringValue(entry.Name).trim()
    const value = stringValue(entry.Value).trim()
    if (name && value) specifics[name] = value
  }

  return specifics
}

function detectCategory(title: string, specifics: Record<string, string>): CardCategory {
  const haystack = `${title} ${Object.values(specifics).join(" ")}`.toLowerCase()

  const mtgScore = MTG_KEYWORDS.reduce(
    (score, keyword) => score + (haystack.includes(keyword) ? 1 : 0),
    0
  )
  const pokemonScore = POKEMON_KEYWORDS.reduce(
    (score, keyword) => score + (haystack.includes(keyword) ? 1 : 0),
    0
  )
  const sportsScore = SPORTS_KEYWORDS.reduce(
    (score, keyword) => score + (haystack.includes(keyword) ? 1 : 0),
    0
  )

  if (mtgScore > 0 && mtgScore >= pokemonScore && mtgScore >= sportsScore) {
    return "mtg"
  }
  if (pokemonScore > sportsScore) return "pokemon"
  if (sportsScore > pokemonScore) return "sports"
  return "mtg"
}

function parseCondition(
  item: Record<string, unknown>,
  title: string,
  grade: Card["grade"]
): string {
  if (grade) return "graded"

  const condition = stringValue(item.ConditionDisplayName).trim()
  if (!condition) return "See listing"

  const normalized = condition.toLowerCase()
  if (normalized.includes("new")) return "NM"
  if (normalized.includes("like new")) return "NM"
  if (normalized.includes("very good")) return "LP"
  if (normalized.includes("good")) return "LP"
  if (normalized.includes("acceptable")) return "MP"
  if (normalized.includes("ungraded")) return "Raw"

  return condition
}

function getImages(item: Record<string, unknown>, summary: ActiveListingSummary): string[] {
  const pictureDetails = isRecord(item.PictureDetails) ? item.PictureDetails : null
  const pictureUrls = pictureDetails?.PictureURL

  if (Array.isArray(pictureUrls)) {
    const urls = pictureUrls.map(stringValue).filter(Boolean)
    if (urls.length > 0) return urls
  }

  const single = stringValue(pictureUrls)
  if (single) return [single]

  if (summary.imageUrl) return [summary.imageUrl]
  return [PLACEHOLDER_IMAGE]
}

function getSpecificValue(
  specifics: Record<string, string>,
  names: string[]
): string | undefined {
  for (const name of names) {
    const match = Object.entries(specifics).find(
      ([key]) => key.toLowerCase() === name.toLowerCase()
    )
    if (match?.[1]) return match[1]
  }
  return undefined
}

function stripHtml(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim()
}

function getPrice(item: Record<string, unknown>, summary: ActiveListingSummary): number {
  const sellingStatus = isRecord(item.SellingStatus) ? item.SellingStatus : null
  const currentPriceRaw = sellingStatus?.CurrentPrice

  if (typeof currentPriceRaw === "number") return currentPriceRaw
  if (isRecord(currentPriceRaw)) {
    return Number(currentPriceRaw["#text"] ?? summary.currentPrice)
  }

  return summary.currentPrice
}

function buildDescription(
  title: string,
  specifics: Record<string, string>,
  rawDescription: string
): string {
  const stripped = stripHtml(rawDescription)
  if (stripped.length >= 40) {
    return stripped.slice(0, 500)
  }

  const set = getSpecificValue(specifics, ["Set", "Card Set"])
  const number = getSpecificValue(specifics, ["Card Number", "Number"])
  const parts = [`${title} available from PokePitchShop.`]
  if (set) parts.push(`Set: ${set}.`)
  if (number) parts.push(`Card #${number}.`)
  parts.push("Buy on eBay with buyer protection.")
  return parts.join(" ")
}

export function mapListingToCard(
  summary: ActiveListingSummary,
  item: Record<string, unknown>,
  overrides: InventoryOverrides = {}
): Card {
  const title = stringValue(item.Title) || summary.title
  const specifics = parseItemSpecifics(item)
  const grade =
    parseGrade(title) ??
    parseGrade(Object.values(specifics).join(" "))
  const category = detectCategory(title, specifics)
  const itemId = summary.itemId || stringValue(item.ItemID)
  const override = overrides[itemId] ?? overrides[summary.sku] ?? {}

  const set =
    override.set ??
    getSpecificValue(specifics, ["Set", "Card Set", "Series"]) ??
    "See listing"
  const number =
    override.number ??
    getSpecificValue(specifics, ["Card Number", "Number"]) ??
    ""
  const variant =
    override.variant ??
    getSpecificValue(specifics, ["Features", "Parallel/Variety", "Variant"])
  const condition = override.condition ?? parseCondition(item, title, grade ?? null)
  const description =
    override.description ??
    buildDescription(title, specifics, stringValue(item.Description))
  const images = getImages(item, summary)

  const card: Card = {
    id: `ebay-${itemId}`,
    name: override.name ?? title,
    category: override.category ?? category,
    set,
    number,
    condition,
    grade: override.grade ?? grade,
    price: getPrice(item, summary),
    currency: "USD",
    status:
      summary.quantityAvailable > 0 || summary.quantity > 0
        ? "available"
        : "sold",
    images,
    description,
    ebayUrl: `https://www.ebay.com/itm/${itemId}`,
    ebayItemId: itemId,
    sku: summary.sku || stringValue(item.SKU) || undefined,
    dateAdded: new Date().toISOString().slice(0, 10),
  }

  if (variant) card.variant = variant

  return card
}

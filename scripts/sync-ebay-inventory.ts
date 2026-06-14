import { existsSync, readFileSync, writeFileSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"
import { inventorySchema } from "@/lib/types/card"
import {
  EbayTradingClient,
  loadEbayConfigFromEnv,
} from "./ebay/client"
import { generateSitemap, getDefaultSitemapPath } from "./ebay/generate-sitemap"
import {
  type InventoryOverrides,
  mapListingToCard,
  mergeWithExistingInventory,
} from "./ebay/map-listing"

const __dirname = dirname(fileURLToPath(import.meta.url))
const PROJECT_ROOT = join(__dirname, "..")

function loadEnvFiles(): void {
  for (const filename of [".env.local", ".env"]) {
    const path = join(PROJECT_ROOT, filename)
    if (!existsSync(path)) continue

    const lines = readFileSync(path, "utf8").split("\n")
    for (const line of lines) {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith("#")) continue
      const separatorIndex = trimmed.indexOf("=")
      if (separatorIndex === -1) continue

      const key = trimmed.slice(0, separatorIndex).trim()
      const rawValue = trimmed.slice(separatorIndex + 1).trim()
      const value = rawValue.replace(/^['"]|['"]$/g, "")
      if (!process.env[key]) process.env[key] = value
    }
  }
}

function readJsonFile<T>(path: string, fallback: T): T {
  if (!existsSync(path)) return fallback
  return JSON.parse(readFileSync(path, "utf8")) as T
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function main(): Promise<void> {
  loadEnvFiles()

  const dryRun = process.argv.includes("--dry-run")
  const summaryOnly = process.argv.includes("--summary-only")
  const detailDelayMs = Number(process.env.EBAY_DETAIL_DELAY_MS ?? "150")

  const inventoryPath = join(PROJECT_ROOT, "data", "inventory.json")
  const overridesPath = join(PROJECT_ROOT, "data", "inventory-overrides.json")
  const sitemapPath = getDefaultSitemapPath(PROJECT_ROOT)

  const existingCards = readJsonFile(inventoryPath, [])
  const overrides = readJsonFile<InventoryOverrides>(overridesPath, {})

  console.log("Fetching active eBay listings...")
  const client = new EbayTradingClient(loadEbayConfigFromEnv())
  const summaries = await client.getAllActiveListings()
  console.log(`Found ${summaries.length} active listing(s).`)

  const syncedCards = []

  for (const [index, summary] of summaries.entries()) {
    if (!summary.itemId) continue

    let item: Record<string, unknown>
    if (summaryOnly) {
      item = {
        ItemID: summary.itemId,
        Title: summary.title,
        SKU: summary.sku,
        Quantity: summary.quantity,
        QuantityAvailable: summary.quantityAvailable,
        SellingStatus: {
          CurrentPrice: summary.currentPrice,
        },
      }
    } else {
      console.log(
        `[${index + 1}/${summaries.length}] Fetching details for ${summary.itemId}...`
      )
      item = await client.getListing(summary.itemId)
      if (detailDelayMs > 0) await sleep(detailDelayMs)
    }

    syncedCards.push(mapListingToCard(summary, item, overrides))
  }

  const mergedCards = mergeWithExistingInventory(syncedCards, existingCards)
  const validated = inventorySchema.parse(mergedCards)

  console.log(
    `Prepared ${validated.length} catalog item(s): ${syncedCards.length} from eBay, ${validated.length - syncedCards.length} preserved from existing inventory.`
  )

  if (dryRun) {
    console.log("Dry run complete. No files were written.")
    return
  }

  writeFileSync(inventoryPath, `${JSON.stringify(validated, null, 2)}\n`, "utf8")
  generateSitemap(validated, sitemapPath)

  console.log(`Updated ${inventoryPath}`)
  console.log(`Updated ${sitemapPath}`)
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error)
  process.exit(1)
})

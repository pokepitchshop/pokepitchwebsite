/**
 * Verify eBay API connectivity (same check as .github/workflows/warm-ebay-catalog-cache.yml).
 * Catalog and sitemap are served live — see lib/ebay/catalog.ts and app/sitemap.ts.
 */
import { EbayTradingClient, loadEbayConfigFromEnv } from "@/lib/ebay/client"

async function main() {
  const client = new EbayTradingClient(loadEbayConfigFromEnv())
  const page = await client.getActiveListings(1, 5)
  console.log(`eBay API OK — ${page.total} active listings`)
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error)
  process.exit(1)
})

/**
 * Verify eBay API connectivity (same check as .github/workflows/warm-ebay-catalog-cache.yml).
 * Catalog and sitemap are served live — see lib/ebay/catalog.ts and app/sitemap.ts.
 */
import { existsSync, readFileSync } from "node:fs"
import { join } from "node:path"
import { EbayTradingClient, loadEbayConfigFromEnv } from "@/lib/ebay/client"

function loadEnvFile(filePath: string): void {
  if (!existsSync(filePath)) return

  for (const line of readFileSync(filePath, "utf8").split("\n")) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith("#")) continue

    const separator = trimmed.indexOf("=")
    if (separator === -1) continue

    const key = trimmed.slice(0, separator).trim()
    let value = trimmed.slice(separator + 1).trim()

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1)
    }

    if (!process.env[key]) process.env[key] = value
  }
}

function loadProjectEnv(): void {
  const projectRoot = join(import.meta.dirname, "..")
  loadEnvFile(join(projectRoot, ".env"))
  loadEnvFile(join(projectRoot, ".env.local"))
}

async function main() {
  loadProjectEnv()

  const client = new EbayTradingClient(loadEbayConfigFromEnv())
  const page = await client.getActiveListings(1, 5)
  console.log(`eBay API OK — ${page.total} active listings`)
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error)
  process.exit(1)
})

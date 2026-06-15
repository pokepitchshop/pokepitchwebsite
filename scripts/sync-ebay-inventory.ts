import { writeFileSync } from "node:fs"
import { join } from "node:path"
import { getDefaultSitemapPath, generateSitemap } from "./ebay/generate-sitemap"

/**
 * Optional maintenance script: refreshes the static sitemap with core pages only.
 * Catalog listings are loaded live from eBay — no bulk inventory.json sync.
 */
async function main(): Promise<void> {
  const projectRoot = join(import.meta.dirname, "..")
  const sitemapPath = getDefaultSitemapPath(projectRoot)
  const today = new Date().toISOString().slice(0, 10)

  generateSitemap(
    [
      {
        id: "catalog",
        name: "Catalog",
        category: "pokemon",
        set: "",
        number: "",
        condition: "available",
        grade: null,
        price: 0,
        currency: "USD",
        status: "available",
        images: ["https://pokepitchshop.com/images/pokepitchshoplogo.png"],
        description: "Browse live eBay inventory on PokePitchShop.",
        dateAdded: today,
      },
    ],
    sitemapPath
  )

  console.log(`Updated ${sitemapPath}`)
  console.log("Catalog inventory is served live from eBay (see lib/ebay/catalog.ts).")
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error)
  process.exit(1)
})

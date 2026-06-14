import { writeFileSync } from "node:fs"
import { join } from "node:path"
import type { Card } from "@/lib/types/card"

const SITE_URL = "https://pokepitchshop.com"

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;")
}

function urlEntry(loc: string, lastmod: string, priority: string): string {
  return `  <url>
    <loc>${escapeXml(loc)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${priority}</priority>
  </url>`
}

export function generateSitemap(cards: Card[], outputPath: string): void {
  const today = new Date().toISOString().slice(0, 10)
  const cardEntries = cards.map((card) =>
    urlEntry(
      `${SITE_URL}/catalog/${card.id}`,
      card.dateAdded || today,
      "0.8"
    )
  )

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntry(`${SITE_URL}/`, today, "1.0")}
${urlEntry(`${SITE_URL}/catalog`, today, "0.9")}
${cardEntries.join("\n")}
</urlset>
`

  writeFileSync(outputPath, xml, "utf8")
}

export function getDefaultSitemapPath(projectRoot: string): string {
  return join(projectRoot, "public", "sitemap.xml")
}

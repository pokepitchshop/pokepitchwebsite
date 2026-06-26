# eBay Integration for PokePitchShop

## Overview

The catalog loads **live from eBay** at request time (cached for 1 hour). There is no bulk sync into a static file — that legacy approach was slow and expensive.

Flow:

1. `GetMyeBaySelling` fetches all listing summaries (~9 API calls for 1,600+ items)
2. Results are cached server-side via Next.js `unstable_cache`
3. `/catalog` paginates and filters in memory (24 items per page)
4. Each card links to its eBay listing for checkout
5. `/sitemap.xml` is generated dynamically by `app/sitemap.ts` from live inventory and blog posts — no static `public/sitemap.xml` or sync script

A GitHub Actions workflow (`.github/workflows/warm-ebay-catalog-cache.yml`) runs every 6 hours to verify API connectivity and warm the production catalog cache via HTTP.

## Setup

Add to `.env` or `.env.local`:

```env
EBAY_CLIENT_ID=your-app-id
EBAY_CLIENT_SECRET=your-cert-id
EBAY_ENVIRONMENT=production
EBAY_USER_REFRESH_TOKEN=your-refresh-token
```

Optional:

```env
EBAY_CATALOG_REVALIDATE_SECONDS=3600
```

Use the same credentials as `.cursor/mcp.json` (ebay-mcp).

**Important:** eBay refresh tokens contain `#` characters. In `.env` files you **must wrap the token in double quotes**, or everything after the first `#` is treated as a comment and auth fails with `invalid_grant`:

```env
EBAY_USER_REFRESH_TOKEN="v^1.1#i^1#..."
```

## Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Run site; catalog loads from eBay |
| `npm run ebay:verify` | Verify eBay API credentials and list active listing count |
| `npm run ebay:oauth-url` | Generate OAuth URL for a new refresh token |

## MCP vs website

- **ebay-mcp in Cursor** — interactive seller tools (`ebay_get_active_listings`, etc.)
- **Website catalog** — `lib/ebay/catalog.ts` uses the same Trading API, cached for visitors

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Catalog shows credential error | Set `EBAY_*` vars in `.env`; restart dev server |
| `invalid_grant` on refresh | Re-run OAuth; update `EBAY_USER_REFRESH_TOKEN` |
| Stale prices | Lower `EBAY_CATALOG_REVALIDATE_SECONDS` or wait for cache expiry |
| Build timeout on Vercel | Ensure `EBAY_*` secrets are set; catalog fetch runs at build for `/` and `/sitemap.xml` |

## Files

| Path | Purpose |
|------|---------|
| `lib/ebay/client.ts` | OAuth + Trading API client |
| `lib/ebay/catalog.ts` | Cached catalog + pagination |
| `lib/ebay/map-listing.ts` | eBay listing → site card |
| `app/sitemap.ts` | Dynamic sitemap from live inventory |
| `app/(site)/catalog/page.tsx` | Live catalog UI |
| `scripts/ebay-verify.ts` | Local API connectivity check |
| `.github/workflows/warm-ebay-catalog-cache.yml` | Scheduled cache warm + API verify |

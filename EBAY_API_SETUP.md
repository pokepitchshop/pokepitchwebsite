# eBay Integration for PokePitchShop

## Overview

The catalog loads **live from eBay** at request time (cached for 1 hour). No bulk sync of 1,600+ listings into `inventory.json` — that was slow and expensive.

Flow:

1. `GetMyeBaySelling` fetches all listing summaries (~9 API calls for 1,642 items)
2. Results are cached server-side via Next.js `unstable_cache`
3. `/catalog` paginates and filters in memory (24 items per page)
4. Each card links to its eBay listing for checkout

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
| `npm run sync:ebay:sitemap` | Refresh static sitemap (core pages only) |
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

## Files

| Path | Purpose |
|------|---------|
| `lib/ebay/client.ts` | OAuth + Trading API client |
| `lib/ebay/catalog.ts` | Cached catalog + pagination |
| `lib/ebay/map-listing.ts` | eBay listing → site card |
| `app/(site)/catalog/page.tsx` | Live catalog UI |

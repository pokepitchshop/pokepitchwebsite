# eBay Integration for PokePitchShop

## Overview

PokePitchShop syncs catalog inventory from your eBay seller account using the eBay Trading API (same APIs used by [ebay-mcp](https://github.com/YosefHayim/ebay-mcp)). Synced listings populate `data/inventory.json`, which powers `/catalog`, homepage featured cards, and SEO sitemaps.

## Quick Start

### 1. eBay Developer credentials

1. Create an account at [eBay Developer Portal](https://developer.ebay.com/)
2. Register an application and copy **App ID (Client ID)** and **Cert ID (Client Secret)**
3. Copy your **RuName** from User Tokens settings

### 2. OAuth user token (required)

The sync script reads **your seller listings**, which requires a user refresh token.

Easiest path — use the ebay-mcp setup wizard:

```bash
npm install -g ebay-mcp
npm run ebay:setup
# or: npx ebay-mcp setup
```

Copy the resulting `EBAY_USER_REFRESH_TOKEN` into `.env.local`.

### 3. Configure environment

Copy `.env.example` to `.env.local` and fill in:

```env
EBAY_CLIENT_ID=your-app-id
EBAY_CLIENT_SECRET=your-cert-id
EBAY_ENVIRONMENT=production
EBAY_USER_REFRESH_TOKEN=your-refresh-token
```

### 4. Run sync

```bash
npm install
npm run sync:ebay:dry-run   # preview without writing files
npm run sync:ebay           # update data/inventory.json + public/sitemap.xml
npm run build               # verify site builds with new inventory
```

## What the sync does

1. Calls eBay `GetMyeBaySelling` for all active fixed-price listings
2. Calls `GetItem` per listing for images, description, and item specifics
3. Maps each listing to the site `Card` schema (`lib/types/card.ts`)
4. Preserves manually managed cards (no `ebayItemId`) and previously sold items
5. Regenerates `public/sitemap.xml` from the merged inventory

## Manual overrides

If eBay titles/specifics are incomplete, add per-listing overrides in `data/inventory-overrides.json`:

```json
{
  "167382780779": {
    "category": "pokemon",
    "set": "Evolving Skies",
    "number": "215/203",
    "variant": "Alternate Art"
  }
}
```

Keys can be eBay item IDs or SKUs.

## Automation (GitHub Actions)

Workflow: `.github/workflows/sync-ebay-inventory.yml`

Runs every 6 hours (and on manual dispatch). Add these repository secrets:

| Secret | Value |
|--------|-------|
| `EBAY_CLIENT_ID` | App ID |
| `EBAY_CLIENT_SECRET` | Cert ID |
| `EBAY_USER_REFRESH_TOKEN` | OAuth refresh token |
| `EBAY_ENVIRONMENT` | `production` (optional) |

When inventory changes, the workflow commits updated `data/inventory.json` and `public/sitemap.xml`.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run sync:ebay` | Full sync from eBay |
| `npm run sync:ebay:dry-run` | Preview sync output |
| `npm run sync:ebay -- --summary-only` | Skip per-item detail calls (faster, less metadata) |

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Missing env vars | Ensure `.env.local` has client ID, secret, and refresh token |
| Invalid refresh token | Re-run `npx ebay-mcp setup` and update `EBAY_USER_REFRESH_TOKEN` |
| Empty listings | Confirm you're using production credentials and the seller account has active listings |
| Wrong category/set | Add overrides in `data/inventory-overrides.json` |
| Rate limits | Increase `EBAY_DETAIL_DELAY_MS` (default 150ms) |

## Files

| Path | Purpose |
|------|---------|
| `scripts/sync-ebay-inventory.ts` | Main sync entry point |
| `scripts/ebay/client.ts` | OAuth + Trading API client |
| `scripts/ebay/map-listing.ts` | eBay → Card mapping |
| `scripts/ebay/generate-sitemap.ts` | Sitemap generator |
| `data/inventory-overrides.json` | Optional manual field overrides |
| `data/inventory.json` | Site catalog source of truth |

## Resources

- [eBay Developer Documentation](https://developer.ebay.com/docs)
- [ebay-mcp](https://github.com/YosefHayim/ebay-mcp)
- [eBay API Status](https://developer.ebay.com/status)

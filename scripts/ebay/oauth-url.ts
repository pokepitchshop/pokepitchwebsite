import { readFileSync } from "node:fs"
import { join } from "node:path"

/** Production scopes used by ebay-mcp (matches ebay-mcp docs/auth/production_scopes.json). */
const EBAY_MCP_PRODUCTION_SCOPES = [
  "https://api.ebay.com/oauth/api_scope",
  "https://api.ebay.com/oauth/api_scope/sell.marketing.readonly",
  "https://api.ebay.com/oauth/api_scope/sell.marketing",
  "https://api.ebay.com/oauth/api_scope/sell.inventory.readonly",
  "https://api.ebay.com/oauth/api_scope/sell.inventory",
  "https://api.ebay.com/oauth/api_scope/sell.account.readonly",
  "https://api.ebay.com/oauth/api_scope/sell.account",
  "https://api.ebay.com/oauth/api_scope/sell.fulfillment.readonly",
  "https://api.ebay.com/oauth/api_scope/sell.fulfillment",
  "https://api.ebay.com/oauth/api_scope/sell.analytics.readonly",
  "https://api.ebay.com/oauth/api_scope/sell.finances",
  "https://api.ebay.com/oauth/api_scope/sell.payment.dispute",
  "https://api.ebay.com/oauth/api_scope/commerce.identity.readonly",
  "https://api.ebay.com/oauth/api_scope/sell.reputation",
  "https://api.ebay.com/oauth/api_scope/sell.reputation.readonly",
  "https://api.ebay.com/oauth/api_scope/commerce.notification.subscription",
  "https://api.ebay.com/oauth/api_scope/commerce.notification.subscription.readonly",
  "https://api.ebay.com/oauth/api_scope/sell.stores",
  "https://api.ebay.com/oauth/api_scope/sell.stores.readonly",
  "https://api.ebay.com/oauth/scope/sell.edelivery",
  "https://api.ebay.com/oauth/api_scope/commerce.vero",
  "https://api.ebay.com/oauth/api_scope/sell.inventory.mapping",
  "https://api.ebay.com/oauth/api_scope/commerce.message",
  "https://api.ebay.com/oauth/api_scope/commerce.feedback",
  "https://api.ebay.com/oauth/api_scope/commerce.shipping",
  "https://api.ebay.com/oauth/api_scope/commerce.feedback.readonly",
]

/** Minimum scopes for seller info + listings in pokepitchshop. */
const SELLER_MINIMUM_SCOPES = [
  "https://api.ebay.com/oauth/api_scope",
  "https://api.ebay.com/oauth/api_scope/sell.inventory.readonly",
  "https://api.ebay.com/oauth/api_scope/sell.account.readonly",
  "https://api.ebay.com/oauth/api_scope/commerce.identity.readonly",
  "https://api.ebay.com/oauth/api_scope/sell.reputation.readonly",
]

type McpConfig = {
  mcpServers?: {
    ebay?: {
      env?: Record<string, string>
    }
  }
}

function loadEbayEnv(projectRoot: string): Record<string, string> {
  const mcpPath = join(projectRoot, ".cursor", "mcp.json")
  const mcp = JSON.parse(readFileSync(mcpPath, "utf8")) as McpConfig
  return mcp.mcpServers?.ebay?.env ?? {}
}

function buildOAuthUrl(
  env: Record<string, string>,
  scopes: string[]
): string {
  const environment = env.EBAY_ENVIRONMENT === "sandbox" ? "sandbox" : "production"
  const authBase =
    environment === "production"
      ? "https://auth.ebay.com"
      : "https://auth.sandbox.ebay.com"

  const clientId = env.EBAY_CLIENT_ID
  const redirectUri = env.EBAY_REDIRECT_URI

  if (!clientId || !redirectUri) {
    throw new Error("EBAY_CLIENT_ID and EBAY_REDIRECT_URI must be set in .cursor/mcp.json")
  }

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    prompt: "login",
  })

  return `${authBase}/oauth2/authorize?${params.toString()}&scope=${scopes.join(" ")}`
}

const projectRoot = join(import.meta.dirname, "..", "..")
const env = loadEbayEnv(projectRoot)
const mode = process.argv.includes("--minimal") ? "minimal" : "full"
const scopes =
  mode === "minimal" ? SELLER_MINIMUM_SCOPES : EBAY_MCP_PRODUCTION_SCOPES

console.log(`Environment: ${env.EBAY_ENVIRONMENT ?? "production"}`)
console.log(`Client ID: ${env.EBAY_CLIENT_ID}`)
console.log(`Redirect URI (RuName): ${env.EBAY_REDIRECT_URI}`)
console.log(`Scope set: ${mode}`)
console.log("")
console.log(buildOAuthUrl(env, scopes))

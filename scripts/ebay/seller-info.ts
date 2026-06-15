import { readFileSync } from "node:fs"
import { join } from "node:path"
import { EbayTradingClient, loadEbayConfigFromEnv } from "./client"

function loadMcpEnv(projectRoot: string): void {
  const mcpPath = join(projectRoot, ".cursor", "mcp.json")
  const mcp = JSON.parse(readFileSync(mcpPath, "utf8")) as {
    mcpServers?: { ebay?: { env?: Record<string, string> } }
  }

  for (const [key, value] of Object.entries(mcp.mcpServers?.ebay?.env ?? {})) {
    if (!process.env[key]) process.env[key] = value
  }
}

async function getJson(
  token: string,
  path: string
): Promise<{ status: number; data: unknown }> {
  const base =
    process.env.EBAY_ENVIRONMENT === "sandbox"
      ? "https://api.sandbox.ebay.com"
      : "https://api.ebay.com"

  const response = await fetch(`${base}${path}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  })

  const text = await response.text()
  let data: unknown = text
  try {
    data = JSON.parse(text)
  } catch {
    // keep raw text
  }

  return { status: response.status, data }
}

async function main(): Promise<void> {
  const projectRoot = join(import.meta.dirname, "..", "..")
  loadMcpEnv(projectRoot)

  const config = loadEbayConfigFromEnv()
  const client = new EbayTradingClient(config)
  const token = await client.getAccessToken()

  const [privileges, kyc, programs, listings] = await Promise.all([
    getJson(token, "/sell/account/v1/privilege"),
    getJson(token, "/sell/account/v1/kyc"),
    getJson(token, "/sell/account/v1/program/get_opted_in_programs"),
    client.getActiveListings(1, 1),
  ])

  console.log(
    JSON.stringify(
      {
        privileges: { status: privileges.status, data: privileges.data },
        kyc: { status: kyc.status, data: kyc.data },
        programs: { status: programs.status, data: programs.data },
        activeListings: {
          total: listings.total,
          totalPages: listings.totalPages,
          samplePageCount: listings.listings.length,
        },
      },
      null,
      2
    )
  )
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error)
  process.exit(1)
})

import { XMLBuilder, XMLParser } from "fast-xml-parser"

const COMPAT_LEVEL = "1451"
const SITE_ID = "0"

const ARRAY_TAGS = new Set([
  "Item",
  "Errors",
  "Error",
  "NameValueList",
  "Value",
  "PictureURL",
])

type EbayEnvironment = "production" | "sandbox"

export type EbayConfig = {
  clientId: string
  clientSecret: string
  refreshToken: string
  environment: EbayEnvironment
}

export type ActiveListingSummary = {
  itemId: string
  title: string
  sku: string
  quantity: number
  quantityAvailable: number
  currentPrice: number
  listingType: string
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

function asRecordArray(value: unknown): Record<string, unknown>[] {
  if (!Array.isArray(value)) return []
  return value.filter(isRecord)
}

function stringValue(value: unknown): string {
  if (typeof value === "string") return value
  if (typeof value === "number" || typeof value === "boolean") return String(value)
  return ""
}

function getApiBaseUrl(environment: EbayEnvironment): string {
  return environment === "sandbox"
    ? "https://api.sandbox.ebay.com"
    : "https://api.ebay.com"
}

function getOAuthBaseUrl(environment: EbayEnvironment): string {
  return getApiBaseUrl(environment)
}

export class EbayTradingClient {
  private parser: XMLParser
  private builder: XMLBuilder
  private accessToken: string | null = null

  constructor(private config: EbayConfig) {
    this.parser = new XMLParser({
      ignoreAttributes: false,
      removeNSPrefix: true,
      parseTagValue: true,
      isArray: (name) => ARRAY_TAGS.has(name),
    })

    this.builder = new XMLBuilder({
      ignoreAttributes: false,
      format: true,
      suppressEmptyNode: true,
    })
  }

  async getAccessToken(): Promise<string> {
    if (this.accessToken) return this.accessToken

    const authUrl = `${getOAuthBaseUrl(this.config.environment)}/identity/v1/oauth2/token`
    const credentials = Buffer.from(
      `${this.config.clientId}:${this.config.clientSecret}`
    ).toString("base64")

    const response = await fetch(authUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${credentials}`,
      },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: this.config.refreshToken,
      }),
    })

    if (!response.ok) {
      const errorBody = await response.text()
      throw new Error(
        `Failed to refresh eBay access token (${response.status}): ${errorBody}`
      )
    }

    const data = (await response.json()) as { access_token?: string }
    if (!data.access_token) {
      throw new Error("eBay token response did not include access_token")
    }

    this.accessToken = data.access_token
    return this.accessToken
  }

  private async execute(
    callName: string,
    params: Record<string, unknown>
  ): Promise<Record<string, unknown>> {
    const token = await this.getAccessToken()
    const requestTag = `${callName}Request`
    const responseTag = `${callName}Response`
    const xmlBody = `<?xml version="1.0" encoding="utf-8"?>\n${this.builder.build({
      [requestTag]: {
        "@_xmlns": "urn:ebay:apis:eBLBaseComponents",
        ...params,
      },
    })}`

    const response = await fetch(`${getApiBaseUrl(this.config.environment)}/ws/api.dll`, {
      method: "POST",
      headers: {
        "X-EBAY-API-SITEID": SITE_ID,
        "X-EBAY-API-COMPATIBILITY-LEVEL": COMPAT_LEVEL,
        "X-EBAY-API-CALL-NAME": callName,
        "X-EBAY-API-IAF-TOKEN": token,
        "Content-Type": "text/xml",
      },
      body: xmlBody,
    })

    if (!response.ok) {
      throw new Error(`Trading API ${callName} failed with HTTP ${response.status}`)
    }

    const parsedValue = this.parser.parse(await response.text())
    if (!isRecord(parsedValue)) {
      throw new Error(`Trading API ${callName} returned an invalid payload`)
    }

    const resultValue = parsedValue[responseTag] ?? parsedValue
    if (!isRecord(resultValue)) {
      throw new Error(`Trading API ${callName} response payload is not an object`)
    }

    if (resultValue.Ack === "Failure" || resultValue.Ack === "PartialFailure") {
      const errors = resultValue.Errors
      const firstError = Array.isArray(errors) ? errors[0] : errors
      const message = isRecord(firstError)
        ? stringValue(firstError.ShortMessage || firstError.LongMessage)
        : "Unknown Trading API error"
      throw new Error(message || "Unknown Trading API error")
    }

    return resultValue
  }

  async getActiveListings(
    page = 1,
    entriesPerPage = 200
  ): Promise<{
    listings: ActiveListingSummary[]
    total: number
    totalPages: number
  }> {
    const result = await this.execute("GetMyeBaySelling", {
      ActiveList: {
        Sort: "TimeLeft",
        Pagination: {
          EntriesPerPage: entriesPerPage,
          PageNumber: page,
        },
      },
    })

    const activeList = isRecord(result.ActiveList) ? result.ActiveList : {}
    const itemArray = isRecord(activeList.ItemArray) ? activeList.ItemArray : {}
    const items = asRecordArray(itemArray.Item)
    const pagination = isRecord(activeList.PaginationResult)
      ? activeList.PaginationResult
      : {}

    const listings = items.map((item) => {
      const sellingStatus = isRecord(item.SellingStatus) ? item.SellingStatus : {}
      const currentPriceRaw = sellingStatus.CurrentPrice
      let priceValue = 0

      if (typeof currentPriceRaw === "number") {
        priceValue = currentPriceRaw
      } else if (isRecord(currentPriceRaw)) {
        priceValue = Number(currentPriceRaw["#text"] ?? 0)
      }

      return {
        itemId: stringValue(item.ItemID),
        title: stringValue(item.Title),
        sku: stringValue(item.SKU),
        quantity: Number(item.Quantity ?? 0),
        quantityAvailable: Number(item.QuantityAvailable ?? 0),
        currentPrice: priceValue,
        listingType: stringValue(item.ListingType),
      }
    })

    return {
      listings,
      total: Number(pagination.TotalNumberOfEntries ?? 0),
      totalPages: Number(pagination.TotalNumberOfPages ?? 0),
    }
  }

  async getAllActiveListings(): Promise<ActiveListingSummary[]> {
    const firstPage = await this.getActiveListings(1, 200)
    const allListings = [...firstPage.listings]

    for (let page = 2; page <= firstPage.totalPages; page++) {
      const nextPage = await this.getActiveListings(page, 200)
      allListings.push(...nextPage.listings)
    }

    return allListings
  }

  async getListing(itemId: string): Promise<Record<string, unknown>> {
    const result = await this.execute("GetItem", {
      ItemID: itemId,
      DetailLevel: "ReturnAll",
    })

    if (isRecord(result.Item)) return result.Item
    return result
  }
}

export function loadEbayConfigFromEnv(): EbayConfig {
  const clientId = process.env.EBAY_CLIENT_ID ?? process.env.EBAY_APP_ID
  const clientSecret =
    process.env.EBAY_CLIENT_SECRET ?? process.env.EBAY_CERT_ID
  const refreshToken = process.env.EBAY_USER_REFRESH_TOKEN
  const environment =
    process.env.EBAY_ENVIRONMENT === "sandbox" ? "sandbox" : "production"

  const missing: string[] = []
  if (!clientId) missing.push("EBAY_CLIENT_ID (or EBAY_APP_ID)")
  if (!clientSecret) missing.push("EBAY_CLIENT_SECRET (or EBAY_CERT_ID)")
  if (!refreshToken) missing.push("EBAY_USER_REFRESH_TOKEN")

  if (missing.length > 0) {
    throw new Error(
      `Missing required eBay environment variables: ${missing.join(", ")}`
    )
  }

  return {
    clientId: clientId!,
    clientSecret: clientSecret!,
    refreshToken: refreshToken!,
    environment,
  }
}

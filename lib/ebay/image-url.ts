const EBAY_IMAGE_HOST = "i.ebayimg.com"

/** eBay size suffixes returned by GetMyeBaySelling (e.g. s-l140) vs full listing size. */
const EBAY_SIZE_PATTERN = /\/s-l\d+(\.[a-z]+)?(?=$|[?#])/i

/**
 * Upgrade eBay thumbnail URLs to full-resolution images.
 * GetMyeBaySelling returns GalleryURL/PictureURL at s-l140; catalog tiles need s-l1600.
 */
export function upgradeEbayImageUrl(url: string | undefined): string | undefined {
  if (!url) return undefined

  try {
    const parsed = new URL(url)
    if (!parsed.hostname.endsWith(EBAY_IMAGE_HOST)) return url

    parsed.pathname = parsed.pathname
      .replace(/^\/thumbs\/images\//i, "/images/")
      .replace(/^\/thumbs\//i, "/images/")
      .replace(EBAY_SIZE_PATTERN, (_, ext) => `/s-l1600${ext ?? ".jpg"}`)

    return parsed.toString()
  } catch {
    return url
      .replace(/\/thumbs\/images\//i, "/images/")
      .replace(/\/thumbs\//i, "/images/")
      .replace(EBAY_SIZE_PATTERN, (_, ext) => `/s-l1600${ext ?? ".jpg"}`)
  }
}

export function upgradeEbayImageUrls(urls: string[]): string[] {
  return urls.map((url) => upgradeEbayImageUrl(url) ?? url)
}

import Script from "next/script"
import { upgradeEbayImageUrl } from "@/lib/ebay/image-url"
import { SITE_URL } from "@/lib/seo/constants"
import type { Card } from "@/lib/types/card"

const EBAY_STORE_URL = "https://www.ebay.com/str/tnt4sportscards"

type HomeStructuredDataProps = {
  featuredCards: Card[]
}

export function HomeStructuredData({ featuredCards }: HomeStructuredDataProps) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Store",
    name: "PokePitchShop",
    description:
      "Your trusted source for authentic Pokemon and sports trading cards",
    url: SITE_URL,
    logo: `${SITE_URL}/images/pokepitchshoplogo.png`,
    image: `${SITE_URL}/images/pokepitchshoplogo.png`,
    address: {
      "@type": "PostalAddress",
      addressCountry: "US",
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      email: "tom@pokepitchshop.com",
    },
    sameAs: [EBAY_STORE_URL, "https://x.com/pokepitchshop"],
    openingHours: ["Mo-Fr 09:00-18:00"],
    priceRange: "$$",
    currenciesAccepted: "USD",
    paymentAccepted: "Cash, Credit Card, PayPal",
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Trading Cards",
      itemListElement: featuredCards.map((card) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Product",
          name: card.name,
          description: card.description,
          image: upgradeEbayImageUrl(card.images[0]) ?? card.images[0],
          offers: {
            "@type": "Offer",
            availability:
              card.status === "available"
                ? "https://schema.org/InStock"
                : "https://schema.org/SoldOut",
            priceCurrency: card.currency,
            price: card.price.toFixed(2),
            url: card.ebayUrl ?? `${SITE_URL}/catalog/${card.id}`,
            seller: {
              "@type": "Organization",
              name: "PokePitchShop",
            },
          },
        },
      })),
    },
  }

  return (
    <Script
      id="structured-data"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}

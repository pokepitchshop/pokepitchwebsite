import Script from "next/script"
import { getFeaturedCards } from "@/lib/inventory"

const EBAY_STORE_URL = "https://www.ebay.com/str/tnt4sportscards"

export function HomeStructuredData() {
  const featuredCards = getFeaturedCards(6)

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Store",
    name: "PokePitchShop",
    description:
      "Your trusted source for authentic Pokemon and sports trading cards",
    url: "https://pokepitchshop.com",
    logo: "https://pokepitchshop.com/images/pokepitchshoplogo.png",
    image: "https://pokepitchshop.com/images/pokepitchshoplogo.png",
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
          image: card.images[0],
          offers: {
            "@type": "Offer",
            availability:
              card.status === "available"
                ? "https://schema.org/InStock"
                : "https://schema.org/SoldOut",
            priceCurrency: card.currency,
            price: card.price.toFixed(2),
            url: `https://pokepitchshop.com/catalog/${card.id}`,
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

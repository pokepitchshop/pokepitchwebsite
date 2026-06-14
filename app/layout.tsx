import type { Metadata } from 'next'
import './globals.css'
import Script from 'next/script'

export const metadata: Metadata = {
  title: 'Pokemon & Sports Trading Cards For Sale | Authentic Graded Cards | PokePitchShop',
  description: 'Buy authentic Pokemon and sports trading cards online. Rare holographics, vintage cards, PSA graded specimens, and more. Collector-owned business with quality guaranteed. Free shipping on orders over $50.',
  keywords: 'Pokemon cards, sports cards, trading cards, graded cards, PSA graded, BGS graded, vintage cards, rare cards, authentic pokemon cards, sports trading cards, collectibles, charizard, rookie cards, autographed cards',
  authors: [{ name: 'PokePitchShop' }],
  creator: 'PokePitchShop',
  publisher: 'PokePitchShop',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://pokepitchshop.com'),
  alternates: {
    canonical: '/',
  },
  icons: {
    icon: [
      { url: '/images/pokepitchshoplogo.png', sizes: '32x32', type: 'image/png' },
      { url: '/images/pokepitchshoplogo.png', sizes: '16x16', type: 'image/png' },
    ],
    shortcut: '/images/pokepitchshoplogo.png',
    apple: '/images/pokepitchshoplogo.png',
  },
  openGraph: {
    title: 'Pokemon & Sports Trading Cards For Sale | Authentic Graded Cards | PokePitchShop',
    description: 'Buy authentic Pokemon and sports trading cards online. Rare holographics, vintage cards, PSA graded specimens, and more. Collector-owned business with quality guaranteed.',
    url: 'https://pokepitchshop.com',
    siteName: 'PokePitchShop',
    images: [
      {
        url: '/images/pokepitchshoplogo.png',
        width: 1200,
        height: 630,
        alt: 'PokePitchShop - Authentic Pokemon and Sports Trading Cards For Sale',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pokemon & Sports Trading Cards For Sale | Authentic Graded Cards | PokePitchShop',
    description: 'Buy authentic Pokemon and sports trading cards online. Rare holographics, vintage cards, PSA graded specimens, and more. Collector-owned business with quality guaranteed.',
    images: ['/images/pokepitchshoplogo.png'],
    creator: '@pokepitchshop', // Add your Twitter handle if you have one
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: '_T8XYcRrhFjtknFG6CGl9r-o-ggEMTEBHTn0DePkRDE',
  },
  // Add these new properties for better SEO
  category: 'retail',
  classification: 'Trading Cards, Collectibles, Pokemon, Sports Cards',
  other: {
    'og:price:amount': '10.00',
    'og:price:currency': 'USD',
    'product:availability': 'in stock',
    'product:condition': 'new',
    'product:price:amount': '10.00',
    'product:price:currency': 'USD',
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-NEE1GJ4JJX"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-NEE1GJ4JJX');
          `}
        </Script>
      </head>
      <body>
        {children}
      </body>
    </html>
  )
}

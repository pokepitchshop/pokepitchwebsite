"use client"

import { useState } from "react"
import { ImageIcon } from "lucide-react"
import { upgradeEbayImageUrl } from "@/lib/ebay/image-url"
import { cn } from "@/lib/utils"

type CardImageProps = {
  src: string
  alt: string
  className?: string
}

export function CardImage({ src, alt, className }: CardImageProps) {
  const [hasError, setHasError] = useState(false)
  const imageSrc = upgradeEbayImageUrl(src) ?? src

  if (hasError) {
    return (
      <div
        className={cn(
          "flex h-full w-full flex-col items-center justify-center bg-slate-700 text-slate-400",
          className
        )}
        role="img"
        aria-label={`${alt} — image unavailable`}
      >
        <ImageIcon className="mb-2 h-8 w-8" aria-hidden="true" />
        <span className="text-xs">Image unavailable</span>
      </div>
    )
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={imageSrc}
      alt={alt}
      className={cn("h-full w-full object-cover", className)}
      onError={() => setHasError(true)}
    />
  )
}

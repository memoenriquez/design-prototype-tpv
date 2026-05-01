"use client"

import { useState } from "react"
import type { CSSProperties } from "react"

import { BrandLogoMeta, BrandLogoTone } from "@/lib/brand-logos"
import { cn } from "@/lib/utils"

interface BrandLogoProps {
  logo: BrandLogoMeta
  personalized?: boolean
  tone?: BrandLogoTone
  className?: string
  imageClassName?: string
  fallbackClassName?: string
}

const toneColorVariable: Record<BrandLogoTone, string> = {
  primary: "var(--theme-primary)",
  secondary: "var(--theme-secondary)",
  accent: "var(--theme-accent)",
}

export function BrandLogo({
  logo,
  personalized = true,
  tone,
  className,
  imageClassName,
  fallbackClassName,
}: BrandLogoProps) {
  const [hasImageError, setHasImageError] = useState(false)
  const isSvgLogo = logo.src.toLowerCase().endsWith(".svg")
  const resolvedTone = tone || logo.tone || "primary"

  if (hasImageError) {
    return (
      <span
        className={cn(
          "flex size-full items-center justify-center text-center font-bold leading-none",
          fallbackClassName
        )}
        aria-label={logo.alt}
      >
        {logo.fallback}
      </span>
    )
  }

  if (personalized && isSvgLogo) {
    const maskStyle = {
      backgroundColor: toneColorVariable[resolvedTone],
      maskImage: `url(${logo.src})`,
      WebkitMaskImage: `url(${logo.src})`,
      maskPosition: "center",
      WebkitMaskPosition: "center",
      maskRepeat: "no-repeat",
      WebkitMaskRepeat: "no-repeat",
      maskSize: "contain",
      WebkitMaskSize: "contain",
    } satisfies CSSProperties

    return (
      <span className={cn("flex size-full items-center justify-center", className)}>
        <span
          role="img"
          aria-label={logo.alt}
          className={cn("block size-full", imageClassName)}
          style={maskStyle}
        />
      </span>
    )
  }

  return (
    <span className={cn("flex size-full items-center justify-center", className)}>
      <img
        src={logo.src}
        alt={logo.alt}
        className={cn("max-h-full max-w-full object-contain", imageClassName)}
        loading="lazy"
        onError={() => setHasImageError(true)}
      />
    </span>
  )
}

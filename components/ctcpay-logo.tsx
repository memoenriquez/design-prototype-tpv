"use client"

import { cn } from "@/lib/utils"

interface CTCPayLogoProps {
  size?: "sm" | "md" | "lg"
  variant?: "default" | "light" | "dark"
  className?: string
}

export function CTCPayLogo({ size = "md", variant = "default", className }: CTCPayLogoProps) {
  const sizes = {
    sm: { text: "text-lg", icon: "size-7" },
    md: { text: "text-2xl", icon: "size-9" },
    lg: { text: "text-4xl", icon: "size-14" }
  }

  const colors = {
    default: { ctc: "var(--theme-primary)", pay: "var(--theme-secondary)", arrow: "var(--theme-secondary)", lines: "var(--theme-primary)" },
    light: { ctc: "#FFFFFF", pay: "var(--theme-secondary)", arrow: "var(--theme-secondary)", lines: "#FFFFFF" },
    dark: { ctc: "var(--theme-primary)", pay: "var(--theme-secondary)", arrow: "var(--theme-secondary)", lines: "var(--theme-primary)" }
  }

  const currentColors = colors[variant]

  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      {/* Icon */}
      <div className={cn("relative", sizes[size].icon)}>
        <svg viewBox="0 0 40 40" fill="none" className="size-full drop-shadow-sm">
          {/* Horizontal lines */}
          <path 
            d="M4 12h14M4 20h10M4 28h6" 
            stroke={currentColors.lines}
            strokeWidth="3.5" 
            strokeLinecap="round"
          />
          {/* Arrow */}
          <path 
            d="M20 20l12-9v7h6v4h-6v7l-12-9z" 
            fill={currentColors.arrow}
          />
        </svg>
      </div>
      
      {/* Text */}
      <div className={cn("font-bold tracking-tight flex items-baseline", sizes[size].text)}>
        <span style={{ color: currentColors.ctc }}>CTC</span>
        <span style={{ color: currentColors.pay }}>Pay</span>
      </div>
    </div>
  )
}

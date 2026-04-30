"use client"

import { cn } from "@/lib/utils"

interface CTCPayLogoProps {
  size?: "sm" | "md" | "lg"
  variant?: "default" | "light" | "dark"
  className?: string
}

export function CTCPayLogo({ size = "md", variant = "default", className }: CTCPayLogoProps) {
  const sizes = {
    sm: { text: "text-lg", icon: "w-7 h-7" },
    md: { text: "text-2xl", icon: "w-9 h-9" },
    lg: { text: "text-4xl", icon: "w-14 h-14" }
  }

  const colors = {
    default: { ctc: "text-[#000D94]", pay: "text-[#0BBD33]", arrow: "#0BBD33", lines: "#000D94" },
    light: { ctc: "text-white", pay: "text-[#0BBD33]", arrow: "#0BBD33", lines: "#FFFFFF" },
    dark: { ctc: "text-[#000D94]", pay: "text-[#0BBD33]", arrow: "#0BBD33", lines: "#000D94" }
  }

  const currentColors = colors[variant]

  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      {/* Icon */}
      <div className={cn("relative", sizes[size].icon)}>
        <svg viewBox="0 0 40 40" fill="none" className="w-full h-full drop-shadow-sm">
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
        <span className={currentColors.ctc}>CTC</span>
        <span className={currentColors.pay}>Pay</span>
      </div>
    </div>
  )
}

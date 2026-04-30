"use client"

import * as React from "react"
import { X, ArrowLeft, ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type CloseButtonVariant = "close" | "back" | "back-chevron"
type CloseButtonStyle = "default" | "glass" | "ghost" | "solid"
type CloseButtonSize = "sm" | "md" | "lg"

interface CloseButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: CloseButtonVariant
  buttonStyle?: CloseButtonStyle
  size?: CloseButtonSize
  onAction?: () => void
}

const sizeConfig = {
  sm: {
    button: "w-7 h-7 sm:w-8 sm:h-8",
    icon: "w-3.5 h-3.5 sm:w-4 sm:h-4"
  },
  md: {
    button: "w-9 h-9 sm:w-10 sm:h-10",
    icon: "w-4 h-4 sm:w-5 sm:h-5"
  },
  lg: {
    button: "w-10 h-10 sm:w-11 sm:h-11",
    icon: "w-5 h-5 sm:w-5 sm:h-5"
  }
}

const styleConfig = {
  default: "bg-white/10 hover:bg-white/20 text-white border-0",
  glass: "bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white border-0",
  ghost: "bg-transparent hover:bg-gray-100 text-gray-600 border-0",
  solid: "bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 shadow-sm"
}

const CloseButton = React.forwardRef<HTMLButtonElement, CloseButtonProps>(
  ({ 
    className, 
    variant = "close", 
    buttonStyle = "default", 
    size = "md", 
    onAction,
    onClick,
    ...props 
  }, ref) => {
    const Icon = variant === "close" ? X : variant === "back-chevron" ? ChevronLeft : ArrowLeft
    const sizeClasses = sizeConfig[size]
    const styleClasses = styleConfig[buttonStyle]

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (onAction) {
        onAction()
      }
      if (onClick) {
        onClick(e)
      }
    }

    return (
      <button
        ref={ref}
        type="button"
        onClick={handleClick}
        className={cn(
          "inline-flex items-center justify-center rounded-full transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 shrink-0",
          sizeClasses.button,
          styleClasses,
          className
        )}
        {...props}
      >
        <Icon className={cn(sizeClasses.icon)} />
        <span className="sr-only">
          {variant === "close" ? "Cerrar" : "Volver"}
        </span>
      </button>
    )
  }
)

CloseButton.displayName = "CloseButton"

export { CloseButton, type CloseButtonProps, type CloseButtonVariant, type CloseButtonStyle, type CloseButtonSize }

"use client"

import { useState, useEffect, useRef } from "react"
import { Check, AlertTriangle } from "lucide-react"
import { cn } from "@/lib/utils"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface ColorPickerProps {
  value: string
  onChange: (color: string) => void
  label?: string
  presetColors?: string[]
  showContrastWarning?: boolean
  contrastAgainst?: string
}

const defaultPresets = [
  "#000D94", "#0BBD33", "#1E3A5F", "#0891B2", "#2563EB",
  "#F8FAFC", "#FFFFFF", "#F1F5F9", "#0F172A", "#64748B"
]

function isValidHex(hex: string): boolean {
  return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hex)
}

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      }
    : null
}

function getLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map(c => {
    c = c / 255
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
  })
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs
}

function getContrastRatio(hex1: string, hex2: string): number {
  const rgb1 = hexToRgb(hex1)
  const rgb2 = hexToRgb(hex2)
  if (!rgb1 || !rgb2) return 0

  const l1 = getLuminance(rgb1.r, rgb1.g, rgb1.b)
  const l2 = getLuminance(rgb2.r, rgb2.g, rgb2.b)
  const lighter = Math.max(l1, l2)
  const darker = Math.min(l1, l2)
  return (lighter + 0.05) / (darker + 0.05)
}

export function ColorPicker({
  value,
  onChange,
  label,
  presetColors = defaultPresets,
  showContrastWarning = false,
  contrastAgainst = "#FFFFFF"
}: ColorPickerProps) {
  const [inputValue, setInputValue] = useState(value)
  const [isValid, setIsValid] = useState(true)
  const [open, setOpen] = useState(false)
  const colorInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setInputValue(value)
    setIsValid(isValidHex(value))
  }, [value])

  const handleInputChange = (newValue: string) => {
    setInputValue(newValue)
    if (isValidHex(newValue)) {
      setIsValid(true)
      onChange(newValue)
    } else {
      setIsValid(newValue.length < 7)
    }
  }

  const handleColorInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value
    setInputValue(newColor)
    setIsValid(true)
    onChange(newColor)
  }

  const contrastRatio = showContrastWarning ? getContrastRatio(value, contrastAgainst) : null
  const hasContrastIssue = contrastRatio !== null && contrastRatio < 4.5

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label className="text-sm font-medium text-[var(--theme-text-primary)]">
          {label}
        </label>
      )}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="h-12 w-full justify-start gap-3 border-border px-3 hover:border-muted-foreground/40"
          >
            <div
              className="size-8 rounded-lg border-2 border-border shadow-inner"
              style={{ backgroundColor: isValid ? value : "#ccc" }}
            />
            <span className="font-mono text-sm uppercase">{value}</span>
            {hasContrastIssue && (
              <AlertTriangle className="w-4 h-4 text-amber-500 ml-auto" />
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64 p-4" align="start">
          <div className="flex flex-col gap-4">
            {/* Native color picker */}
            <div className="flex items-center gap-3">
              <div
                className="relative size-12 cursor-pointer overflow-hidden rounded-xl border-2 border-border shadow-lg"
                onClick={() => colorInputRef.current?.click()}
              >
                <div
                  className="absolute inset-0"
                  style={{ backgroundColor: value }}
                />
                <input
                  ref={colorInputRef}
                  type="color"
                  value={value}
                  onChange={handleColorInputChange}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </div>
              <div className="flex-1">
                <Input
                  value={inputValue}
                  onChange={(e) => handleInputChange(e.target.value)}
                  placeholder="#000000"
                  className={cn(
                    "font-mono uppercase text-sm",
                    !isValid && inputValue.length >= 7 && "border-destructive focus-visible:ring-destructive"
                  )}
                />
              </div>
            </div>

            {/* Validation message */}
            {!isValid && inputValue.length >= 7 && (
              <p className="text-xs text-destructive">
                Formato invalido. Usa formato HEX (#RRGGBB)
              </p>
            )}

            {/* Contrast warning */}
            {hasContrastIssue && (
              <div className="flex items-start gap-2 p-2 bg-amber-50 rounded-lg border border-amber-200">
                <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                <p className="text-xs text-amber-700">
                  Bajo contraste ({contrastRatio?.toFixed(1)}:1). Se recomienda minimo 4.5:1 para accesibilidad.
                </p>
              </div>
            )}

            {/* Preset colors */}
            <div className="flex flex-col gap-2">
              <p className="text-xs font-medium text-muted-foreground">Colores rapidos</p>
              <div className="grid grid-cols-5 gap-2">
                {presetColors.map((color) => (
                  <button
                    key={color}
                    onClick={() => {
                      onChange(color)
                      setOpen(false)
                    }}
                    className={cn(
                      "size-9 rounded-lg border-2 transition-all hover:scale-110",
                      value === color
                        ? "border-[var(--theme-primary)] ring-2 ring-[var(--theme-primary)]/30"
                        : "border-border hover:border-muted-foreground/40"
                    )}
                    style={{ backgroundColor: color }}
                  >
                    {value === color && (
                      <Check className={cn(
                        "w-4 h-4 mx-auto",
                        getLuminance(...Object.values(hexToRgb(color) || { r: 0, g: 0, b: 0 }) as [number, number, number]) > 0.5
                          ? "text-gray-800"
                          : "text-white"
                      )} />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}

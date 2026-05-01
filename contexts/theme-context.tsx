"use client"

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react"

export interface ThemeSettings {
  // Brand Colors
  primaryColor: string
  secondaryColor: string
  accentColor?: string
  
  // UI Colors
  backgroundColor: string
  cardBackground: string
  textPrimary: string
  textSecondary: string
  
  // Component Styles
  borderRadius: number // in px
  fontSize: number // base size multiplier (1 = 100%)
  
  // Preset name if using one
  presetName: string | null
}

export const defaultTheme: ThemeSettings = {
  primaryColor: "#000D94",
  secondaryColor: "#0BBD33",
  accentColor: "#000D94",
  backgroundColor: "#F8FAFC",
  cardBackground: "#FFFFFF",
  textPrimary: "#0A1628",
  textSecondary: "#64748B",
  borderRadius: 16,
  fontSize: 100,
  presetName: "default"
}

export const themePresets: Record<string, ThemeSettings> = {
  default: { ...defaultTheme },
  dark: {
    primaryColor: "#3B82F6",
    secondaryColor: "#10B981",
    accentColor: "#3B82F6",
    backgroundColor: "#0F172A",
    cardBackground: "#1E293B",
    textPrimary: "#F8FAFC",
    textSecondary: "#94A3B8",
    borderRadius: 16,
    fontSize: 100,
    presetName: "dark"
  },
  warm: {
    primaryColor: "#92400E",
    secondaryColor: "#D97706",
    accentColor: "#92400E",
    backgroundColor: "#FFFBEB",
    cardBackground: "#FFFFFF",
    textPrimary: "#78350F",
    textSecondary: "#92400E",
    borderRadius: 12,
    fontSize: 100,
    presetName: "warm"
  },
  ocean: {
    primaryColor: "#0891B2",
    secondaryColor: "#06B6D4",
    accentColor: "#0891B2",
    backgroundColor: "#ECFEFF",
    cardBackground: "#FFFFFF",
    textPrimary: "#164E63",
    textSecondary: "#0E7490",
    borderRadius: 20,
    fontSize: 100,
    presetName: "ocean"
  },
  corporate: {
    primaryColor: "#1E3A5F",
    secondaryColor: "#2563EB",
    accentColor: "#1E3A5F",
    backgroundColor: "#F1F5F9",
    cardBackground: "#FFFFFF",
    textPrimary: "#1E293B",
    textSecondary: "#475569",
    borderRadius: 8,
    fontSize: 100,
    presetName: "corporate"
  }
}

interface ThemeContextType {
  theme: ThemeSettings
  updateTheme: (updates: Partial<ThemeSettings>) => void
  applyPreset: (presetName: string) => void
  resetToDefault: () => void
  previewTheme: ThemeSettings | null
  setPreviewTheme: (theme: ThemeSettings | null) => void
  isPreviewMode: boolean
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

const STORAGE_KEY = "ctcpay-theme-settings"

const hexToRgb = (hex: string): string => {
  const normalizedHex = hex.replace("#", "")
  const expandedHex = normalizedHex.length === 3
    ? normalizedHex.split("").map((value) => value + value).join("")
    : normalizedHex
  const value = Number.parseInt(expandedHex, 16)

  if (Number.isNaN(value)) return "0, 13, 148"

  const red = (value >> 16) & 255
  const green = (value >> 8) & 255
  const blue = value & 255

  return `${red}, ${green}, ${blue}`
}

function applyThemeToDOM(theme: ThemeSettings) {
  const root = document.documentElement
  const accentColor = theme.primaryColor
  
  // Apply CSS variables
  root.style.setProperty("--theme-primary", theme.primaryColor)
  root.style.setProperty("--theme-secondary", theme.secondaryColor)
  root.style.setProperty("--theme-accent", accentColor)
  root.style.setProperty("--theme-background", theme.backgroundColor)
  root.style.setProperty("--theme-card", theme.cardBackground)
  root.style.setProperty("--theme-text-primary", theme.textPrimary)
  root.style.setProperty("--theme-text-secondary", theme.textSecondary)
  root.style.setProperty("--theme-radius", `${theme.borderRadius}px`)
  root.style.setProperty("--theme-font-scale", `${theme.fontSize}%`)
  root.style.setProperty("--theme-primary-rgb", hexToRgb(theme.primaryColor))
  root.style.setProperty("--theme-secondary-rgb", hexToRgb(theme.secondaryColor))
  root.style.setProperty("--theme-accent-rgb", hexToRgb(accentColor))
  root.style.setProperty("--theme-card-rgb", hexToRgb(theme.cardBackground))

  root.style.setProperty("--primary", theme.primaryColor)
  root.style.setProperty("--secondary", theme.secondaryColor)
  root.style.setProperty("--accent", accentColor)
  root.style.setProperty("--ring", theme.primaryColor)
  root.style.setProperty("--background", theme.backgroundColor)
  root.style.setProperty("--card", theme.cardBackground)
  root.style.setProperty("--popover", theme.cardBackground)
  root.style.setProperty("--foreground", theme.textPrimary)
  root.style.setProperty("--card-foreground", theme.textPrimary)
  root.style.setProperty("--popover-foreground", theme.textPrimary)
  root.style.setProperty("--muted-foreground", theme.textSecondary)
  
  // Apply background color to body
  document.body.style.backgroundColor = theme.backgroundColor
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<ThemeSettings>(defaultTheme)
  const [previewTheme, setPreviewTheme] = useState<ThemeSettings | null>(null)
  const [mounted, setMounted] = useState(false)

  // Load saved theme on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved) as ThemeSettings
        const normalizedTheme = { ...parsed, accentColor: parsed.primaryColor }
        setTheme(normalizedTheme)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(normalizedTheme))
        applyThemeToDOM(normalizedTheme)
      } else {
        applyThemeToDOM(defaultTheme)
      }
    } catch {
      applyThemeToDOM(defaultTheme)
    }
    setMounted(true)
  }, [])

  // Apply preview theme when it changes
  useEffect(() => {
    if (mounted) {
      applyThemeToDOM(previewTheme || theme)
    }
  }, [previewTheme, theme, mounted])

  const updateTheme = useCallback((updates: Partial<ThemeSettings>) => {
    setTheme(prev => {
      const newTheme = {
        ...prev,
        ...updates,
        accentColor: updates.primaryColor || prev.primaryColor,
        presetName: null,
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newTheme))
      return newTheme
    })
  }, [])

  const applyPreset = useCallback((presetName: string) => {
    const preset = themePresets[presetName]
    if (preset) {
      setTheme(preset)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(preset))
    }
  }, [])

  const resetToDefault = useCallback(() => {
    setTheme(defaultTheme)
    setPreviewTheme(null)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultTheme))
  }, [])

  return (
    <ThemeContext.Provider
      value={{
        theme,
        updateTheme,
        applyPreset,
        resetToDefault,
        previewTheme,
        setPreviewTheme,
        isPreviewMode: previewTheme !== null
      }}
    >
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}

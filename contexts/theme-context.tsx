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
  backgroundColor: "#F6F8FF",
  cardBackground: "#FFFFFF",
  textPrimary: "#07111F",
  textSecondary: "#526174",
  borderRadius: 16,
  fontSize: 100,
  presetName: "default"
}

export const themePresets: Record<string, ThemeSettings> = {
  default: { ...defaultTheme },
  dark: {
    primaryColor: "#60A5FA",
    secondaryColor: "#34D399",
    accentColor: "#22D3EE",
    backgroundColor: "#07111F",
    cardBackground: "#111C2E",
    textPrimary: "#F8FAFC",
    textSecondary: "#B6C2D6",
    borderRadius: 16,
    fontSize: 100,
    presetName: "dark"
  },
  warm: {
    primaryColor: "#B45309",
    secondaryColor: "#EA580C",
    accentColor: "#F97316",
    backgroundColor: "#FFF7ED",
    cardBackground: "#FFFCF7",
    textPrimary: "#431407",
    textSecondary: "#7C2D12",
    borderRadius: 12,
    fontSize: 100,
    presetName: "warm"
  },
  ocean: {
    primaryColor: "#0E7490",
    secondaryColor: "#14B8A6",
    accentColor: "#0284C7",
    backgroundColor: "#ECFEFF",
    cardBackground: "#F8FFFF",
    textPrimary: "#083344",
    textSecondary: "#155E75",
    borderRadius: 20,
    fontSize: 100,
    presetName: "ocean"
  },
  corporate: {
    primaryColor: "#1D4ED8",
    secondaryColor: "#0F766E",
    accentColor: "#2563EB",
    backgroundColor: "#F4F7FB",
    cardBackground: "#FFFFFF",
    textPrimary: "#0F172A",
    textSecondary: "#475569",
    borderRadius: 8,
    fontSize: 100,
    presetName: "corporate"
  }
}

interface SemanticThemeTokens {
  primaryForeground: string
  secondaryForeground: string
  accentForeground: string
  muted: string
  mutedForeground: string
  border: string
  input: string
  destructive: string
  destructiveForeground: string
  sidebar: string
  sidebarForeground: string
  sidebarPrimary: string
  sidebarPrimaryForeground: string
  sidebarAccent: string
  sidebarAccentForeground: string
  sidebarBorder: string
  sidebarRing: string
  charts: [string, string, string, string, string]
}

const semanticPresetTokens: Record<string, SemanticThemeTokens> = {
  default: {
    primaryForeground: "#FFFFFF",
    secondaryForeground: "#07111F",
    accentForeground: "#FFFFFF",
    muted: "#EAF0FA",
    mutedForeground: "#526174",
    border: "#D8E0EC",
    input: "#E3EAF4",
    destructive: "#DC2626",
    destructiveForeground: "#FFFFFF",
    sidebar: "#FFFFFF",
    sidebarForeground: "#07111F",
    sidebarPrimary: "#000D94",
    sidebarPrimaryForeground: "#FFFFFF",
    sidebarAccent: "#EAF0FA",
    sidebarAccentForeground: "#07111F",
    sidebarBorder: "#D8E0EC",
    sidebarRing: "#000D94",
    charts: ["#000D94", "#0BBD33", "#0284C7", "#16A34A", "#475569"],
  },
  dark: {
    primaryForeground: "#07111F",
    secondaryForeground: "#07111F",
    accentForeground: "#07111F",
    muted: "#1B2A41",
    mutedForeground: "#B6C2D6",
    border: "#2A3B55",
    input: "#22324A",
    destructive: "#F87171",
    destructiveForeground: "#111827",
    sidebar: "#0B1526",
    sidebarForeground: "#F8FAFC",
    sidebarPrimary: "#60A5FA",
    sidebarPrimaryForeground: "#07111F",
    sidebarAccent: "#1B2A41",
    sidebarAccentForeground: "#F8FAFC",
    sidebarBorder: "#2A3B55",
    sidebarRing: "#60A5FA",
    charts: ["#60A5FA", "#34D399", "#22D3EE", "#FBBF24", "#A78BFA"],
  },
  warm: {
    primaryForeground: "#FFFFFF",
    secondaryForeground: "#431407",
    accentForeground: "#431407",
    muted: "#FDE7CB",
    mutedForeground: "#7C2D12",
    border: "#F5C99B",
    input: "#FADDBA",
    destructive: "#DC2626",
    destructiveForeground: "#FFFFFF",
    sidebar: "#FFFCF7",
    sidebarForeground: "#431407",
    sidebarPrimary: "#B45309",
    sidebarPrimaryForeground: "#FFFFFF",
    sidebarAccent: "#FDE7CB",
    sidebarAccentForeground: "#431407",
    sidebarBorder: "#F5C99B",
    sidebarRing: "#B45309",
    charts: ["#B45309", "#EA580C", "#F97316", "#A16207", "#7C2D12"],
  },
  ocean: {
    primaryForeground: "#FFFFFF",
    secondaryForeground: "#062F2D",
    accentForeground: "#FFFFFF",
    muted: "#D5F3F7",
    mutedForeground: "#155E75",
    border: "#A7DDE6",
    input: "#C4EBF1",
    destructive: "#DC2626",
    destructiveForeground: "#FFFFFF",
    sidebar: "#F8FFFF",
    sidebarForeground: "#083344",
    sidebarPrimary: "#0E7490",
    sidebarPrimaryForeground: "#FFFFFF",
    sidebarAccent: "#D5F3F7",
    sidebarAccentForeground: "#083344",
    sidebarBorder: "#A7DDE6",
    sidebarRing: "#0E7490",
    charts: ["#0E7490", "#14B8A6", "#0284C7", "#22C55E", "#155E75"],
  },
  corporate: {
    primaryForeground: "#FFFFFF",
    secondaryForeground: "#FFFFFF",
    accentForeground: "#FFFFFF",
    muted: "#E6ECF3",
    mutedForeground: "#475569",
    border: "#D5DEE9",
    input: "#E0E7F0",
    destructive: "#DC2626",
    destructiveForeground: "#FFFFFF",
    sidebar: "#FFFFFF",
    sidebarForeground: "#0F172A",
    sidebarPrimary: "#1D4ED8",
    sidebarPrimaryForeground: "#FFFFFF",
    sidebarAccent: "#E6ECF3",
    sidebarAccentForeground: "#0F172A",
    sidebarBorder: "#D5DEE9",
    sidebarRing: "#1D4ED8",
    charts: ["#1D4ED8", "#0F766E", "#64748B", "#2563EB", "#334155"],
  },
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

interface RgbColor {
  red: number
  green: number
  blue: number
}

const parseHexColor = (hex: string, fallback = "#000D94"): RgbColor => {
  const normalizedHex = hex.replace("#", "")
  const expandedHex = normalizedHex.length === 3
    ? normalizedHex.split("").map((value) => value + value).join("")
    : normalizedHex

  if (!/^[\da-f]{6}$/i.test(expandedHex)) {
    return parseHexColor(fallback, "#000D94")
  }

  const value = Number.parseInt(expandedHex, 16)

  if (Number.isNaN(value)) {
    return parseHexColor(fallback, "#000D94")
  }

  return {
    red: (value >> 16) & 255,
    green: (value >> 8) & 255,
    blue: value & 255,
  }
}

const hexToRgb = (hex: string): string => {
  const { red, green, blue } = parseHexColor(hex)

  return `${red}, ${green}, ${blue}`
}

const componentToHex = (component: number) => component.toString(16).padStart(2, "0")

const rgbToHex = ({ red, green, blue }: RgbColor) => (
  `#${componentToHex(red)}${componentToHex(green)}${componentToHex(blue)}`
)

const mixHexColors = (baseHex: string, overlayHex: string, overlayWeight: number): string => {
  const base = parseHexColor(baseHex)
  const overlay = parseHexColor(overlayHex)
  const clampedWeight = Math.min(Math.max(overlayWeight, 0), 1)
  const baseWeight = 1 - clampedWeight

  return rgbToHex({
    red: Math.round(base.red * baseWeight + overlay.red * clampedWeight),
    green: Math.round(base.green * baseWeight + overlay.green * clampedWeight),
    blue: Math.round(base.blue * baseWeight + overlay.blue * clampedWeight),
  })
}

const getLinearChannel = (channel: number) => {
  const normalized = channel / 255

  return normalized <= 0.03928
    ? normalized / 12.92
    : ((normalized + 0.055) / 1.055) ** 2.4
}

const getRelativeLuminance = (hex: string) => {
  const { red, green, blue } = parseHexColor(hex)

  return (0.2126 * getLinearChannel(red))
    + (0.7152 * getLinearChannel(green))
    + (0.0722 * getLinearChannel(blue))
}

const getContrastRatio = (firstHex: string, secondHex: string) => {
  const firstLuminance = getRelativeLuminance(firstHex)
  const secondLuminance = getRelativeLuminance(secondHex)
  const lighter = Math.max(firstLuminance, secondLuminance)
  const darker = Math.min(firstLuminance, secondLuminance)

  return (lighter + 0.05) / (darker + 0.05)
}

const getReadableForeground = (backgroundHex: string) => (
  getContrastRatio(backgroundHex, "#07111F") >= getContrastRatio(backgroundHex, "#FFFFFF")
    ? "#07111F"
    : "#FFFFFF"
)

const isDarkTheme = (theme: ThemeSettings) => getRelativeLuminance(theme.backgroundColor) < 0.35

const getSemanticTokens = (theme: ThemeSettings): SemanticThemeTokens => {
  if (theme.presetName && semanticPresetTokens[theme.presetName]) {
    return semanticPresetTokens[theme.presetName]
  }

  const isDark = isDarkTheme(theme)
  const subtleWeight = isDark ? 0.14 : 0.06
  const borderWeight = isDark ? 0.2 : 0.14
  const inputWeight = isDark ? 0.16 : 0.1

  return {
    primaryForeground: getReadableForeground(theme.primaryColor),
    secondaryForeground: getReadableForeground(theme.secondaryColor),
    accentForeground: getReadableForeground(theme.accentColor || theme.primaryColor),
    muted: mixHexColors(theme.cardBackground, theme.textPrimary, subtleWeight),
    mutedForeground: theme.textSecondary,
    border: mixHexColors(theme.cardBackground, theme.textPrimary, borderWeight),
    input: mixHexColors(theme.cardBackground, theme.textPrimary, inputWeight),
    destructive: isDark ? "#F87171" : "#DC2626",
    destructiveForeground: isDark ? "#111827" : "#FFFFFF",
    sidebar: theme.cardBackground,
    sidebarForeground: theme.textPrimary,
    sidebarPrimary: theme.primaryColor,
    sidebarPrimaryForeground: getReadableForeground(theme.primaryColor),
    sidebarAccent: mixHexColors(theme.cardBackground, theme.textPrimary, subtleWeight),
    sidebarAccentForeground: theme.textPrimary,
    sidebarBorder: mixHexColors(theme.cardBackground, theme.textPrimary, borderWeight),
    sidebarRing: theme.primaryColor,
    charts: [
      theme.primaryColor,
      theme.secondaryColor,
      theme.accentColor || theme.primaryColor,
      mixHexColors(theme.secondaryColor, theme.textPrimary, 0.18),
      theme.textSecondary,
    ],
  }
}

const setCssVariable = (root: HTMLElement, name: string, value: string) => {
  root.style.setProperty(name, value)
}

function applyThemeToDOM(theme: ThemeSettings) {
  const root = document.documentElement
  const accentColor = theme.accentColor || theme.primaryColor
  const semanticTokens = getSemanticTokens(theme)
  const isDark = isDarkTheme(theme)
  const radius = `${theme.borderRadius}px`
  
  root.classList.toggle("dark", isDark)
  
  setCssVariable(root, "--theme-primary", theme.primaryColor)
  setCssVariable(root, "--theme-secondary", theme.secondaryColor)
  setCssVariable(root, "--theme-accent", accentColor)
  setCssVariable(root, "--theme-background", theme.backgroundColor)
  setCssVariable(root, "--theme-card", theme.cardBackground)
  setCssVariable(root, "--theme-text-primary", theme.textPrimary)
  setCssVariable(root, "--theme-text-secondary", theme.textSecondary)
  setCssVariable(root, "--theme-radius", radius)
  setCssVariable(root, "--theme-font-scale", `${theme.fontSize}%`)
  setCssVariable(root, "--theme-primary-rgb", hexToRgb(theme.primaryColor))
  setCssVariable(root, "--theme-secondary-rgb", hexToRgb(theme.secondaryColor))
  setCssVariable(root, "--theme-accent-rgb", hexToRgb(accentColor))
  setCssVariable(root, "--theme-card-rgb", hexToRgb(theme.cardBackground))

  setCssVariable(root, "--background", theme.backgroundColor)
  setCssVariable(root, "--foreground", theme.textPrimary)
  setCssVariable(root, "--card", theme.cardBackground)
  setCssVariable(root, "--card-foreground", theme.textPrimary)
  setCssVariable(root, "--popover", theme.cardBackground)
  setCssVariable(root, "--popover-foreground", theme.textPrimary)
  setCssVariable(root, "--primary", theme.primaryColor)
  setCssVariable(root, "--primary-foreground", semanticTokens.primaryForeground)
  setCssVariable(root, "--secondary", theme.secondaryColor)
  setCssVariable(root, "--secondary-foreground", semanticTokens.secondaryForeground)
  setCssVariable(root, "--muted", semanticTokens.muted)
  setCssVariable(root, "--muted-foreground", semanticTokens.mutedForeground)
  setCssVariable(root, "--accent", accentColor)
  setCssVariable(root, "--accent-foreground", semanticTokens.accentForeground)
  setCssVariable(root, "--destructive", semanticTokens.destructive)
  setCssVariable(root, "--destructive-foreground", semanticTokens.destructiveForeground)
  setCssVariable(root, "--border", semanticTokens.border)
  setCssVariable(root, "--input", semanticTokens.input)
  setCssVariable(root, "--ring", theme.primaryColor)
  setCssVariable(root, "--chart-1", semanticTokens.charts[0])
  setCssVariable(root, "--chart-2", semanticTokens.charts[1])
  setCssVariable(root, "--chart-3", semanticTokens.charts[2])
  setCssVariable(root, "--chart-4", semanticTokens.charts[3])
  setCssVariable(root, "--chart-5", semanticTokens.charts[4])
  setCssVariable(root, "--radius", radius)
  setCssVariable(root, "--sidebar", semanticTokens.sidebar)
  setCssVariable(root, "--sidebar-foreground", semanticTokens.sidebarForeground)
  setCssVariable(root, "--sidebar-primary", semanticTokens.sidebarPrimary)
  setCssVariable(root, "--sidebar-primary-foreground", semanticTokens.sidebarPrimaryForeground)
  setCssVariable(root, "--sidebar-accent", semanticTokens.sidebarAccent)
  setCssVariable(root, "--sidebar-accent-foreground", semanticTokens.sidebarAccentForeground)
  setCssVariable(root, "--sidebar-border", semanticTokens.sidebarBorder)
  setCssVariable(root, "--sidebar-ring", semanticTokens.sidebarRing)
  
  document.body.style.backgroundColor = theme.backgroundColor
  document.body.style.color = theme.textPrimary
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

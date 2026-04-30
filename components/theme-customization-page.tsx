"use client"

import { useState, useEffect } from "react"
import { 
  Palette, 
  RotateCcw, 
  Check, 
  Eye, 
  EyeOff,
  Sparkles,
  Type,
  Layout,
  Sun,
  Moon,
  Waves,
  Building2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { CloseButton } from "@/components/ui/close-button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { ColorPicker } from "./color-picker"
import { useTheme, themePresets, defaultTheme, type ThemeSettings } from "@/contexts/theme-context"

interface ThemeCustomizationPageProps {
  onBack: () => void
}

const presetInfo = [
  { key: "default", label: "CTC Pay", icon: Sparkles, description: "Colores originales de la marca" },
  { key: "dark", label: "Oscuro", icon: Moon, description: "Modo oscuro elegante" },
  { key: "warm", label: "Calido", icon: Sun, description: "Tonos naranjas y rojos" },
  { key: "ocean", label: "Oceano", icon: Waves, description: "Azules y turquesas frescos" },
  { key: "corporate", label: "Corporativo", icon: Building2, description: "Profesional y sobrio" }
]

export function ThemeCustomizationPage({ onBack }: ThemeCustomizationPageProps) {
  const { theme, updateTheme, applyPreset, resetToDefault, previewTheme, setPreviewTheme } = useTheme()
  
  // Local draft state for editing
  const [draft, setDraft] = useState<ThemeSettings>(theme)
  const [hasChanges, setHasChanges] = useState(false)
  const [activeTab, setActiveTab] = useState("presets")

  // Sync draft with theme when theme changes externally
  useEffect(() => {
    setDraft(theme)
  }, [theme])

  // Track changes
  useEffect(() => {
    const changed = JSON.stringify(draft) !== JSON.stringify(theme)
    setHasChanges(changed)
  }, [draft, theme])

  const updateDraft = (updates: Partial<ThemeSettings>) => {
    const newDraft = { ...draft, ...updates, presetName: null }
    setDraft(newDraft)
    // Apply preview immediately
    setPreviewTheme(newDraft)
  }

  const handlePresetSelect = (presetKey: string) => {
    const preset = themePresets[presetKey]
    if (preset) {
      setDraft(preset)
      setPreviewTheme(preset)
    }
  }

  const handleSave = () => {
    updateTheme(draft)
    setPreviewTheme(null)
    setHasChanges(false)
  }

  const handleCancel = () => {
    setDraft(theme)
    setPreviewTheme(null)
    setHasChanges(false)
  }

  const handleReset = () => {
    resetToDefault()
    setDraft(defaultTheme)
    setHasChanges(false)
  }

  const togglePreview = () => {
    if (previewTheme) {
      setPreviewTheme(null)
    } else {
      setPreviewTheme(draft)
    }
  }

  return (
    <div className="min-h-screen pb-32" style={{ backgroundColor: "var(--theme-background)" }}>
      {/* Header */}
      <div 
        className="sticky top-0 z-20 backdrop-blur-xl border-b"
        style={{ 
          backgroundColor: "var(--theme-card)",
          borderColor: "rgba(0,0,0,0.08)"
        }}
      >
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <CloseButton 
              variant="back"
              buttonStyle="ghost"
              size="md"
              onAction={onBack}
            />
            <div>
              <h1 className="text-lg font-semibold" style={{ color: "var(--theme-text-primary)" }}>
                Personalizar Apariencia
              </h1>
              <p className="text-xs" style={{ color: "var(--theme-text-secondary)" }}>
                Ajusta colores, fuentes y estilos
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={togglePreview}
              className="gap-1.5"
            >
              {previewTheme ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              <span className="hidden sm:inline">Vista previa</span>
            </Button>
          </div>
        </div>

        {/* Save bar when changes exist */}
        {hasChanges && (
          <div 
            className="flex items-center justify-between px-4 py-3 border-t"
            style={{ 
              backgroundColor: "var(--theme-primary)",
              borderColor: "rgba(255,255,255,0.1)"
            }}
          >
            <p className="text-sm text-white font-medium">Cambios sin guardar</p>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCancel}
                className="text-white hover:bg-white/20"
              >
                Cancelar
              </Button>
              <Button
                size="sm"
                onClick={handleSave}
                className="bg-white text-[var(--theme-primary)] hover:bg-white/90 gap-1.5"
              >
                <Check className="w-4 h-4" />
                Guardar
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 h-12" style={{ backgroundColor: "var(--theme-card)" }}>
            <TabsTrigger value="presets" className="gap-2 data-[state=active]:bg-[var(--theme-primary)] data-[state=active]:text-white">
              <Sparkles className="w-4 h-4" />
              <span className="hidden sm:inline">Temas</span>
            </TabsTrigger>
            <TabsTrigger value="colors" className="gap-2 data-[state=active]:bg-[var(--theme-primary)] data-[state=active]:text-white">
              <Palette className="w-4 h-4" />
              <span className="hidden sm:inline">Colores</span>
            </TabsTrigger>
            <TabsTrigger value="layout" className="gap-2 data-[state=active]:bg-[var(--theme-primary)] data-[state=active]:text-white">
              <Layout className="w-4 h-4" />
              <span className="hidden sm:inline">Estilo</span>
            </TabsTrigger>
          </TabsList>

          {/* Presets Tab */}
          <TabsContent value="presets" className="mt-4 space-y-4">
            <div className="grid gap-3">
              {presetInfo.map((preset) => {
                const isActive = draft.presetName === preset.key
                const PresetIcon = preset.icon
                const presetTheme = themePresets[preset.key]
                
                return (
                  <button
                    key={preset.key}
                    onClick={() => handlePresetSelect(preset.key)}
                    className={cn(
                      "flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left",
                      isActive
                        ? "border-[var(--theme-primary)] bg-[var(--theme-primary)]/5"
                        : "border-gray-100 hover:border-gray-200"
                    )}
                    style={{ backgroundColor: isActive ? undefined : "var(--theme-card)" }}
                  >
                    {/* Color preview circles */}
                    <div className="flex -space-x-2">
                      <div 
                        className="w-8 h-8 rounded-full border-2 border-white shadow-md"
                        style={{ backgroundColor: presetTheme.primaryColor }}
                      />
                      <div 
                        className="w-8 h-8 rounded-full border-2 border-white shadow-md"
                        style={{ backgroundColor: presetTheme.secondaryColor }}
                      />
                      <div 
                        className="w-8 h-8 rounded-full border-2 border-white shadow-md"
                        style={{ backgroundColor: presetTheme.backgroundColor }}
                      />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold" style={{ color: "var(--theme-text-primary)" }}>
                          {preset.label}
                        </p>
                        {isActive && (
                          <Badge variant="secondary" className="bg-[var(--theme-primary)] text-white text-xs">
                            Activo
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm" style={{ color: "var(--theme-text-secondary)" }}>
                        {preset.description}
                      </p>
                    </div>
                    
                    <PresetIcon 
                      className={cn(
                        "w-5 h-5 shrink-0",
                        isActive ? "text-[var(--theme-primary)]" : "text-gray-400"
                      )} 
                    />
                  </button>
                )
              })}
            </div>
          </TabsContent>

          {/* Colors Tab */}
          <TabsContent value="colors" className="mt-4 space-y-4">
            <Card style={{ backgroundColor: "var(--theme-card)" }}>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2" style={{ color: "var(--theme-text-primary)" }}>
                  <Palette className="w-4 h-4" />
                  Colores de Marca
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <ColorPicker
                  label="Color Primario"
                  value={draft.primaryColor}
                  onChange={(color) => updateDraft({ primaryColor: color })}
                  showContrastWarning
                  contrastAgainst={draft.cardBackground}
                />
                <ColorPicker
                  label="Color Secundario"
                  value={draft.secondaryColor}
                  onChange={(color) => updateDraft({ secondaryColor: color })}
                />
                <ColorPicker
                  label="Color de Acento"
                  value={draft.accentColor}
                  onChange={(color) => updateDraft({ accentColor: color })}
                />
              </CardContent>
            </Card>

            <Card style={{ backgroundColor: "var(--theme-card)" }}>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2" style={{ color: "var(--theme-text-primary)" }}>
                  <Layout className="w-4 h-4" />
                  Colores de Interfaz
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <ColorPicker
                  label="Fondo de Pantalla"
                  value={draft.backgroundColor}
                  onChange={(color) => updateDraft({ backgroundColor: color })}
                />
                <ColorPicker
                  label="Fondo de Tarjetas"
                  value={draft.cardBackground}
                  onChange={(color) => updateDraft({ cardBackground: color })}
                />
                <ColorPicker
                  label="Texto Principal"
                  value={draft.textPrimary}
                  onChange={(color) => updateDraft({ textPrimary: color })}
                  showContrastWarning
                  contrastAgainst={draft.cardBackground}
                />
                <ColorPicker
                  label="Texto Secundario"
                  value={draft.textSecondary}
                  onChange={(color) => updateDraft({ textSecondary: color })}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Layout Tab */}
          <TabsContent value="layout" className="mt-4 space-y-4">
            <Card style={{ backgroundColor: "var(--theme-card)" }}>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2" style={{ color: "var(--theme-text-primary)" }}>
                  <Layout className="w-4 h-4" />
                  Bordes Redondeados
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm" style={{ color: "var(--theme-text-secondary)" }}>
                      Radio de esquinas
                    </span>
                    <span className="text-sm font-mono font-medium" style={{ color: "var(--theme-text-primary)" }}>
                      {draft.borderRadius}px
                    </span>
                  </div>
                  <Slider
                    value={[draft.borderRadius]}
                    onValueChange={([value]) => updateDraft({ borderRadius: value })}
                    min={0}
                    max={32}
                    step={2}
                    className="[&_[role=slider]]:bg-[var(--theme-primary)]"
                  />
                  <div className="flex justify-between text-xs" style={{ color: "var(--theme-text-secondary)" }}>
                    <span>Cuadrado</span>
                    <span>Redondeado</span>
                  </div>
                </div>

                {/* Preview shapes */}
                <div className="flex gap-3 pt-2">
                  {[0, 8, 16, 24].map((radius) => (
                    <button
                      key={radius}
                      onClick={() => updateDraft({ borderRadius: radius })}
                      className={cn(
                        "w-14 h-14 border-2 transition-all",
                        draft.borderRadius === radius
                          ? "border-[var(--theme-primary)] bg-[var(--theme-primary)]/10"
                          : "border-gray-200"
                      )}
                      style={{ 
                        borderRadius: `${radius}px`,
                        backgroundColor: draft.borderRadius === radius ? undefined : "var(--theme-card)"
                      }}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card style={{ backgroundColor: "var(--theme-card)" }}>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2" style={{ color: "var(--theme-text-primary)" }}>
                  <Type className="w-4 h-4" />
                  Tamano de Texto
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm" style={{ color: "var(--theme-text-secondary)" }}>
                      Escala de fuente
                    </span>
                    <span className="text-sm font-mono font-medium" style={{ color: "var(--theme-text-primary)" }}>
                      {draft.fontSize}%
                    </span>
                  </div>
                  <Slider
                    value={[draft.fontSize]}
                    onValueChange={([value]) => updateDraft({ fontSize: value })}
                    min={80}
                    max={120}
                    step={5}
                    className="[&_[role=slider]]:bg-[var(--theme-primary)]"
                  />
                  <div className="flex justify-between text-xs" style={{ color: "var(--theme-text-secondary)" }}>
                    <span>Pequeno</span>
                    <span>Grande</span>
                  </div>
                </div>

                {/* Font size preview */}
                <div 
                  className="p-4 rounded-xl border border-gray-100 space-y-2"
                  style={{ backgroundColor: draft.backgroundColor }}
                >
                  <p 
                    className="font-semibold"
                    style={{ 
                      color: draft.textPrimary,
                      fontSize: `${14 * (draft.fontSize / 100)}px`
                    }}
                  >
                    Vista previa del texto
                  </p>
                  <p
                    style={{ 
                      color: draft.textSecondary,
                      fontSize: `${12 * (draft.fontSize / 100)}px`
                    }}
                  >
                    Asi se vera el texto en la aplicacion con la escala seleccionada.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Reset button */}
        <Button
          variant="outline"
          className="w-full gap-2 h-12 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
          onClick={handleReset}
        >
          <RotateCcw className="w-4 h-4" />
          Restaurar valores predeterminados
        </Button>

        {/* Live Preview Card */}
        <Card 
          className="overflow-hidden"
          style={{ 
            backgroundColor: draft.cardBackground,
            borderRadius: `${draft.borderRadius}px`
          }}
        >
          <CardHeader className="pb-2" style={{ backgroundColor: draft.primaryColor }}>
            <CardTitle className="text-base text-white">Vista Previa en Vivo</CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center gap-3">
              <div 
                className="w-10 h-10 flex items-center justify-center"
                style={{ 
                  backgroundColor: draft.secondaryColor,
                  borderRadius: `${draft.borderRadius * 0.5}px`
                }}
              >
                <Check className="w-5 h-5 text-white" />
              </div>
              <div>
                <p 
                  className="font-semibold"
                  style={{ 
                    color: draft.textPrimary,
                    fontSize: `${14 * (draft.fontSize / 100)}px`
                  }}
                >
                  Transaccion Completada
                </p>
                <p 
                  style={{ 
                    color: draft.textSecondary,
                    fontSize: `${12 * (draft.fontSize / 100)}px`
                  }}
                >
                  Tu pago fue procesado exitosamente
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button 
                size="sm"
                className="flex-1 text-white"
                style={{ 
                  backgroundColor: draft.primaryColor,
                  borderRadius: `${draft.borderRadius * 0.5}px`
                }}
              >
                Primario
              </Button>
              <Button 
                size="sm"
                variant="outline"
                className="flex-1"
                style={{ 
                  borderColor: draft.primaryColor,
                  color: draft.primaryColor,
                  borderRadius: `${draft.borderRadius * 0.5}px`
                }}
              >
                Secundario
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

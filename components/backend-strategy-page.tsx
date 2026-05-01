"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CloseButton } from "@/components/ui/close-button"
import { Separator } from "@/components/ui/separator"
import { backendStrategy } from "@/lib/backend-strategy"
import { ArrowRight, Database, ServerCog, ShieldCheck } from "lucide-react"

interface BackendStrategyPageProps {
  onBack: () => void
}

export function BackendStrategyPage({ onBack }: BackendStrategyPageProps) {
  return (
    <div className="min-h-screen pb-24" style={{ backgroundColor: "var(--theme-background)" }}>
      <div className="px-4 pt-4">
        <div className="mb-4 flex items-center gap-3">
          <CloseButton variant="back" buttonStyle="solid" size="md" onAction={onBack} />
          <div className="min-w-0">
            <p className="text-xs font-medium" style={{ color: "var(--theme-text-secondary)" }}>
              Estrategia elegida
            </p>
            <h1 className="text-lg font-bold" style={{ color: "var(--theme-text-primary)" }}>
              Integraciones y backend
            </h1>
          </div>
        </div>

        <Card className="overflow-hidden rounded-3xl border-0 shadow-xl">
          <CardHeader className="bg-[var(--theme-primary)] p-5 text-white">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <Badge className="mb-3 rounded-full border-0 bg-white/15 text-white">
                  Modo actual: prototipo local
                </Badge>
                <CardTitle className="text-xl">Ruta recomendada: Supabase + API adapters</CardTitle>
                <p className="mt-2 text-sm text-white/75">
                  Mantiene la UI actual, agrega persistencia real y deja cada proveedor detras de una capa server-side.
                </p>
              </div>
              <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-white/15">
                <ServerCog className="size-6" aria-hidden="true" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 p-4">
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: "Auth", icon: ShieldCheck },
                { label: "Datos", icon: Database },
                { label: "APIs", icon: ServerCog },
              ].map((item) => (
                <div key={item.label} className="rounded-2xl bg-muted p-3 text-center">
                  <item.icon className="mx-auto mb-2 size-5 text-[var(--theme-primary)]" aria-hidden="true" />
                  <p className="text-xs font-bold">{item.label}</p>
                </div>
              ))}
            </div>

            <Separator />

            <div className="flex flex-col gap-3">
              {backendStrategy.map((item) => (
                <div key={item.area} className="rounded-2xl bg-white p-4 shadow-sm">
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <h2 className="text-sm font-bold text-foreground">{item.area}</h2>
                    <ArrowRight className="size-4 shrink-0 text-[var(--theme-secondary)]" aria-hidden="true" />
                  </div>
                  <p className="text-sm text-foreground">{item.decision}</p>
                  <p className="mt-2 text-xs text-muted-foreground">{item.nextStep}</p>
                </div>
              ))}
            </div>

            <Button
              type="button"
              variant="outline"
              className="h-12 rounded-2xl border-gray-200"
              onClick={onBack}
            >
              Volver a perfil
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

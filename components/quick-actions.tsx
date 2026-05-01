"use client"

import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { 
  Smartphone, 
  CreditCard, 
  QrCode, 
  Receipt, 
  Wallet, 
  History,
  Car,
  Gift,
  Sparkles,
  type LucideIcon
} from "lucide-react"

interface QuickAction {
  id: string
  label: string
  description: string
  icon: LucideIcon
  priority: "primary" | "secondary"
  tone?: "brand" | "accent"
  badge?: string
}

const actions: QuickAction[] = [
  {
    id: "tiempo-aire",
    label: "Tiempo Aire",
    description: "Recargas al momento",
    icon: Smartphone,
    priority: "primary",
    tone: "accent",
    badge: "Popular"
  },
  {
    id: "cobrar",
    label: "Cobrar",
    description: "Tarjeta o efectivo",
    icon: CreditCard,
    priority: "primary",
    tone: "brand"
  },
  {
    id: "codigo-qr",
    label: "Cobro QR",
    description: "Pago sin contacto",
    icon: QrCode,
    priority: "primary",
    tone: "brand"
  },
  {
    id: "pago-servicios",
    label: "Servicios",
    description: "Luz, agua y más",
    icon: Receipt,
    priority: "primary",
    tone: "brand",
    badge: "+100"
  },
  {
    id: "telepeaje",
    label: "Telepeaje",
    description: "Tag y casetas",
    icon: Car,
    priority: "secondary",
    tone: "brand"
  },
  {
    id: "tarjetas-regalo",
    label: "Regalo",
    description: "Códigos digitales",
    icon: Gift,
    priority: "secondary",
    tone: "brand"
  },
  {
    id: "vales",
    label: "Vales",
    description: "Despensa",
    icon: Wallet,
    priority: "secondary",
    tone: "brand"
  },
  {
    id: "historial",
    label: "Historial",
    description: "Movimientos",
    icon: History,
    priority: "secondary",
    tone: "brand"
  }
]

interface QuickActionsProps {
  onActionClick?: (actionId: string) => void
}

export function QuickActions({ onActionClick }: QuickActionsProps) {
  const primaryActions = actions.filter((action) => action.priority === "primary")
  const secondaryActions = actions.filter((action) => action.priority === "secondary")

  return (
    <section className="flex flex-col gap-3 animate-slide-up" style={{ animationDelay: '0.1s' }}>
      <div className="flex items-end justify-between px-1">
        <div className="min-w-0">
          <p className="text-xs font-medium" style={{ color: "var(--theme-text-secondary)" }}>
            Operación diaria
          </p>
          <h3 className="text-base font-bold tracking-tight" style={{ color: "var(--theme-text-primary)" }}>
            Acciones rápidas
          </h3>
        </div>
        <div
          className="flex size-8 items-center justify-center rounded-full shadow-lg"
          style={{
            background: "linear-gradient(135deg, rgba(var(--theme-secondary-rgb), 0.14), rgba(var(--theme-primary-rgb), 0.08))",
            color: "var(--theme-secondary)",
          }}
        >
          <Sparkles className="size-4" aria-hidden="true" />
        </div>
      </div>

      <div className="rounded-[28px] border border-white/80 bg-white/75 p-3 shadow-xl shadow-slate-900/5 backdrop-blur">
        <div className="grid grid-cols-2 gap-3">
          {primaryActions.map((action, index) => {
            const Icon = action.icon
            const isAccent = action.tone === "accent"

            return (
              <button
                key={action.id}
                type="button"
                onClick={() => onActionClick?.(action.id)}
                aria-label={action.label}
                className={cn(
                  "group relative flex min-h-24 overflow-hidden rounded-3xl p-3.5 text-left shadow-lg transition-all duration-300 ease-out active:scale-[0.98] sm:hover:-translate-y-0.5 sm:hover:shadow-xl",
                  isAccent ? "text-white" : "bg-white text-[var(--theme-text-primary)]"
                )}
                style={{
                  animationDelay: `${index * 0.05}s`,
                  background: isAccent
                    ? "linear-gradient(135deg, var(--theme-secondary), rgba(var(--theme-secondary-rgb), 0.84))"
                    : "linear-gradient(135deg, var(--theme-card), rgba(var(--theme-primary-rgb), 0.05))",
                  boxShadow: isAccent
                    ? "0 18px 34px rgba(var(--theme-secondary-rgb), 0.28)"
                    : "0 16px 28px rgba(var(--theme-primary-rgb), 0.09)",
                }}
              >
                <div
                  className={cn(
                    "absolute -right-5 -top-6 size-20 rounded-full blur-2xl transition-opacity duration-300 sm:group-hover:opacity-90",
                    isAccent ? "bg-white/35" : "bg-[rgba(var(--theme-primary-rgb),0.12)]"
                  )}
                />
                <div className="relative flex min-h-full w-full flex-col justify-between gap-3">
                  <div className="flex items-start justify-between gap-2">
                    <div
                      className={cn(
                        "flex size-11 items-center justify-center rounded-2xl shadow-sm transition-transform duration-300 sm:group-hover:scale-105",
                        isAccent ? "bg-white/20 text-white" : "bg-[rgba(var(--theme-primary-rgb),0.08)] text-[var(--theme-primary)]"
                      )}
                    >
                      <Icon className="size-5" aria-hidden="true" />
                    </div>
                    {action.badge && (
                      <Badge
                        className={cn(
                          "rounded-full border-0 px-2 py-0.5 text-[10px] font-bold",
                          isAccent
                            ? "bg-white text-[var(--theme-secondary)]"
                            : "bg-[var(--theme-primary)] text-white"
                        )}
                      >
                        {action.badge}
                      </Badge>
                    )}
                  </div>
                  <div className="min-w-0">
                    <span className={cn("block text-sm font-bold leading-tight", isAccent ? "text-white" : "text-[var(--theme-text-primary)]")}>
                      {action.label}
                    </span>
                    <span className={cn("mt-1 block text-[11px] font-medium leading-tight", isAccent ? "text-white/78" : "text-[var(--theme-text-secondary)]")}>
                      {action.description}
                    </span>
                  </div>
                </div>
              </button>
            )
          })}
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2">
          {secondaryActions.map((action, index) => {
            const Icon = action.icon

            return (
              <button
                key={action.id}
                type="button"
                onClick={() => onActionClick?.(action.id)}
                aria-label={action.label}
                className="group flex min-h-[72px] items-center gap-3 rounded-2xl bg-white/80 p-3 text-left shadow-sm transition-all duration-300 active:scale-95 sm:hover:-translate-y-0.5 sm:hover:bg-white sm:hover:shadow-md"
                style={{ animationDelay: `${(index + primaryActions.length) * 0.05}s` }}
              >
                <div className="flex size-10 items-center justify-center rounded-2xl bg-[rgba(var(--theme-primary-rgb),0.07)] text-[var(--theme-primary)] transition-transform duration-300 sm:group-hover:scale-105">
                  <Icon className="size-4.5" aria-hidden="true" />
                </div>
                <span className="min-w-0">
                  <span className="block truncate text-xs font-bold leading-tight text-[var(--theme-text-primary)]">
                    {action.label}
                  </span>
                  <span className="mt-0.5 block truncate text-[10px] font-medium text-[var(--theme-text-secondary)]">
                    {action.description}
                  </span>
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </section>
  )
}

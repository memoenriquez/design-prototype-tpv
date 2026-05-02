"use client"

import { useState, type ReactNode } from "react"
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ArrowUpRight, Eye, EyeOff, Sparkles, TrendingUp, Wallet } from "lucide-react"
import { Button } from "@/components/ui/button"

interface BalanceCardProps {
  airtimeBalance: number
  servicesBalance: number
  merchantCollectionToday: number
  merchantSpreadToday: number
}

interface FinancialBucket {
  label: string
  description: string
  value: number
  icon: ReactNode
  emphasis?: "primary" | "secondary"
}

const formatMoney = (amount: number) =>
  amount.toLocaleString("es-MX", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })

export function BalanceCard({
  airtimeBalance,
  servicesBalance,
  merchantCollectionToday,
  merchantSpreadToday,
}: BalanceCardProps) {
  const [showBalance, setShowBalance] = useState(true)
  const financialBuckets: FinancialBucket[] = [
    {
      label: "Saldo TAE",
      description: "Disponible TAE",
      value: airtimeBalance,
      icon: <Wallet className="size-3.5 sm:size-4" aria-hidden="true" />,
      emphasis: "secondary",
    },
    {
      label: "Saldo servicios",
      description: "Servicios y productos",
      value: servicesBalance,
      icon: <Wallet className="size-3.5 sm:size-4" aria-hidden="true" />,
      emphasis: "primary",
    },
    {
      label: "Cobros del comercio",
      description: "Cobros de hoy",
      value: merchantCollectionToday,
      icon: <ArrowUpRight className="size-3.5 sm:size-4" aria-hidden="true" />,
      emphasis: "primary",
    },
    {
      label: "Margen del comercio",
      description: "Estimado de hoy",
      value: merchantSpreadToday,
      icon: <TrendingUp className="size-3.5 sm:size-4" aria-hidden="true" />,
      emphasis: "secondary",
    },
  ]

  return (
    <Card
      className="relative gap-0 overflow-hidden rounded-2xl border-0 p-3 text-white shadow-2xl animate-scale-in sm:rounded-3xl sm:p-4"
      style={{
        background: "linear-gradient(135deg, var(--theme-primary), rgba(var(--theme-primary-rgb), 0.9))",
        boxShadow: "0 24px 50px rgba(var(--theme-primary-rgb), 0.28)",
      }}
    >
      {/* Decorative background elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 size-48 translate-x-10 -translate-y-10 rounded-full blur-3xl" style={{ background: "linear-gradient(225deg, rgba(var(--theme-secondary-rgb), 0.2), transparent)" }} />
        <div className="absolute bottom-0 left-0 size-32 -translate-x-5 translate-y-5 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute top-1/2 left-1/2 size-64 bg-white/5 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2" />
        {/* Pattern overlay */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
          backgroundSize: '24px 24px'
        }} />
      </div>
      
      <CardHeader className="relative z-10 gap-1 p-0">
        <div className="min-w-0 flex-1">
          <div className="mb-1.5 flex items-center gap-1.5 sm:mb-2 sm:gap-2">
            <CardDescription className="text-xs font-medium text-white/70 sm:text-sm">
              Panel financiero
            </CardDescription>
            <Sparkles className="size-3 shrink-0 sm:size-3.5" style={{ color: "var(--theme-secondary)" }} />
          </div>
          <CardTitle className="text-xl font-bold tracking-tight text-white sm:text-2xl">
            Saldos
          </CardTitle>
          <p className="mt-1 text-xs font-medium text-white/65 sm:text-sm">
            TAE, servicios, cobros y spread no se mezclan.
          </p>
        </div>
        <CardAction className="flex shrink-0 items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="size-8 rounded-lg text-white/60 transition-all duration-200 hover:bg-white/15 hover:text-white sm:size-9 sm:rounded-xl"
            onClick={() => setShowBalance(!showBalance)}
            aria-label={showBalance ? "Ocultar montos" : "Mostrar montos"}
          >
            {showBalance ? <EyeOff data-icon="inline-start" /> : <Eye data-icon="inline-start" />}
          </Button>
          <div
            className="hidden shrink-0 rounded-xl p-2.5 shadow-lg animate-float sm:block sm:rounded-2xl sm:p-3"
            style={{
              background: "linear-gradient(135deg, var(--theme-secondary), rgba(var(--theme-secondary-rgb), 0.84))",
              boxShadow: "0 14px 26px rgba(var(--theme-secondary-rgb), 0.3)",
            }}
          >
            <TrendingUp className="size-5 sm:size-6" />
          </div>
        </CardAction>
      </CardHeader>

      <CardContent className="relative z-10 mt-2 p-0 sm:mt-3">
        <Separator className="bg-white/15" />
        <div className="grid grid-cols-2 gap-2.5 pt-3 sm:gap-3 sm:pt-4">
          {financialBuckets.map((bucket) => {
            const iconColor = bucket.emphasis === "secondary"
              ? "var(--theme-secondary)"
              : "white"

            return (
              <div
                key={bucket.label}
                className="rounded-xl bg-white/10 p-2.5 backdrop-blur-sm transition-all duration-200 active:bg-white/15 sm:rounded-2xl sm:p-3"
              >
                <div className="mb-1.5 flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate text-[9px] font-semibold text-white/80 sm:text-[11px]">
                      {bucket.label}
                    </p>
                    <p className="truncate text-[9px] font-medium text-white/55 sm:text-[11px]">
                      {bucket.description}
                    </p>
                  </div>
                  <div
                    className="flex size-7 shrink-0 items-center justify-center rounded-full bg-white/10 sm:size-8"
                    style={{ color: iconColor }}
                  >
                    {bucket.icon}
                  </div>
                </div>
                <p className="truncate text-base font-bold sm:text-xl">
                  {showBalance ? `$${formatMoney(bucket.value)}` : "$••••••"}
                </p>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

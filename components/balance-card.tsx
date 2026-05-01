"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Eye, EyeOff, TrendingUp, ArrowUpRight, Sparkles } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"

interface BalanceCardProps {
  balance: number
  salesToday: number
  transactionsToday: number
  salesLabel?: string
  transactionsLabel?: string
}

export function BalanceCard({
  balance,
  salesToday,
  transactionsToday,
  salesLabel = "Ingresos registrados",
  transactionsLabel = "Movimientos",
}: BalanceCardProps) {
  const [showBalance, setShowBalance] = useState(true)

  return (
    <Card
      className="relative overflow-hidden rounded-2xl border-0 p-4 text-white shadow-2xl animate-scale-in sm:rounded-3xl sm:p-6"
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
      
      <CardContent className="relative z-10 p-0">
        <div className="flex items-start justify-between mb-4 sm:mb-5 gap-2">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
              <p className="text-white/70 text-xs sm:text-sm font-medium">Saldo disponible</p>
              <Sparkles className="size-3 shrink-0 sm:size-3.5" style={{ color: "var(--theme-secondary)" }} />
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <h2 className="text-2xl sm:text-4xl font-bold tracking-tight truncate">
                {showBalance ? `$${balance.toLocaleString('es-MX', { minimumFractionDigits: 2 })}` : "$••••••"}
              </h2>
              <Button 
                variant="ghost" 
                size="icon" 
                className="size-8 text-white/60 hover:text-white hover:bg-white/15 sm:size-9 rounded-lg sm:rounded-xl transition-all duration-200 shrink-0"
                onClick={() => setShowBalance(!showBalance)}
                aria-label={showBalance ? "Ocultar saldo" : "Mostrar saldo"}
              >
                {showBalance ? <EyeOff data-icon="inline-start" /> : <Eye data-icon="inline-start" />}
              </Button>
            </div>
          </div>
          <div
            className="shrink-0 rounded-xl p-2.5 shadow-lg animate-float sm:rounded-2xl sm:p-3"
            style={{
              background: "linear-gradient(135deg, var(--theme-secondary), rgba(var(--theme-secondary-rgb), 0.84))",
              boxShadow: "0 14px 26px rgba(var(--theme-secondary-rgb), 0.3)",
            }}
          >
            <TrendingUp className="size-5 sm:size-6" />
          </div>
        </div>
        
        <Separator className="bg-white/15" />
        <div className="grid grid-cols-2 gap-3 pt-4 sm:gap-5 sm:pt-5">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-4 transition-all duration-200 active:bg-white/15">
            <div className="flex items-center justify-between mb-1">
              <p className="text-white/70 text-[10px] sm:text-xs font-medium">{salesLabel}</p>
              <ArrowUpRight className="size-3 sm:size-3.5" style={{ color: "var(--theme-secondary)" }} />
            </div>
            <p className="text-lg sm:text-2xl font-bold">${salesToday.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-4 transition-all duration-200 active:bg-white/15">
            <div className="flex items-center justify-between mb-1">
              <p className="text-white/70 text-[10px] sm:text-xs font-medium">{transactionsLabel}</p>
              <div className="size-1.5 rounded-full animate-pulse sm:size-2" style={{ backgroundColor: "var(--theme-secondary)" }} />
            </div>
            <p className="text-lg sm:text-2xl font-bold">{transactionsToday}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

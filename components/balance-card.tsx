"use client"

import { Card } from "@/components/ui/card"
import { Eye, EyeOff, TrendingUp, ArrowUpRight, Sparkles } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"

interface BalanceCardProps {
  balance: number
  salesToday: number
  transactionsToday: number
}

export function BalanceCard({ balance, salesToday, transactionsToday }: BalanceCardProps) {
  const [showBalance, setShowBalance] = useState(true)

  return (
    <Card className="relative overflow-hidden bg-gradient-to-br from-[#000D94] via-[#0015b3] to-[#001ACC] text-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl border-0 shadow-2xl shadow-[#000D94]/30 animate-scale-in">
      {/* Decorative background elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-[#0BBD33]/20 to-transparent rounded-full blur-3xl transform translate-x-10 -translate-y-10" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-[#16E8FF]/15 to-transparent rounded-full blur-2xl transform -translate-x-5 translate-y-5" />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-white/5 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2" />
        {/* Pattern overlay */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
          backgroundSize: '24px 24px'
        }} />
      </div>
      
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4 sm:mb-5 gap-2">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
              <p className="text-white/70 text-xs sm:text-sm font-medium">Saldo disponible</p>
              <Sparkles className="h-3 sm:h-3.5 w-3 sm:w-3.5 text-[#0BBD33] shrink-0" />
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <h2 className="text-2xl sm:text-4xl font-bold tracking-tight truncate">
                {showBalance ? `$${balance.toLocaleString('es-MX', { minimumFractionDigits: 2 })}` : "$••••••"}
              </h2>
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-white/60 hover:text-white hover:bg-white/15 h-8 w-8 sm:h-9 sm:w-9 rounded-lg sm:rounded-xl transition-all duration-200 shrink-0"
                onClick={() => setShowBalance(!showBalance)}
              >
                {showBalance ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>
          <div className="bg-gradient-to-br from-[#0BBD33] to-[#099a2a] rounded-xl sm:rounded-2xl p-2.5 sm:p-3 shadow-lg shadow-[#0BBD33]/30 animate-float shrink-0">
            <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6" />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-3 sm:gap-5 pt-4 sm:pt-5 border-t border-white/15">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-4 transition-all duration-200 active:bg-white/15">
            <div className="flex items-center justify-between mb-1">
              <p className="text-white/60 text-[10px] sm:text-xs font-medium">Ventas hoy</p>
              <ArrowUpRight className="h-3 sm:h-3.5 w-3 sm:w-3.5 text-[#0BBD33]" />
            </div>
            <p className="text-lg sm:text-2xl font-bold">${salesToday.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-4 transition-all duration-200 active:bg-white/15">
            <div className="flex items-center justify-between mb-1">
              <p className="text-white/60 text-[10px] sm:text-xs font-medium">Transacciones</p>
              <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-[#0BBD33] animate-pulse" />
            </div>
            <p className="text-lg sm:text-2xl font-bold">{transactionsToday}</p>
          </div>
        </div>
      </div>
    </Card>
  )
}

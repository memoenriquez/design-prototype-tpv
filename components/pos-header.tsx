"use client"

import { CTCPayLogo } from "./ctcpay-logo"
import { Wallet } from "lucide-react"
import { NotificationsPopover } from "./notifications-popover"

interface POSHeaderProps {
  airtimeBalance: number
  servicesBalance: number
  showAirtimeBalance?: boolean
  showServicesBalance?: boolean
}

export function POSHeader({
  airtimeBalance,
  servicesBalance,
  showAirtimeBalance = false,
  showServicesBalance = false,
}: POSHeaderProps) {
  const activeBalance = showAirtimeBalance
    ? { label: "TAE", value: airtimeBalance }
    : showServicesBalance
      ? { label: "Servicios", value: servicesBalance }
      : null

  return (
    <header
      className="sticky top-0 z-50 px-3 py-3 text-white shadow-xl sm:px-4 sm:py-4 pt-safe"
      style={{
        background: "linear-gradient(135deg, var(--theme-primary), rgba(var(--theme-primary-rgb), 0.92))",
        boxShadow: "0 20px 40px rgba(var(--theme-primary-rgb), 0.18)",
      }}
    >
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-10 -right-10 size-32 rounded-full blur-2xl" style={{ backgroundColor: "rgba(var(--theme-secondary-rgb), 0.12)" }} />
        <div className="absolute -bottom-5 -left-5 size-24 rounded-full bg-white/10 blur-xl" />
      </div>
      
      <div className="flex items-center justify-between relative gap-2">
        <div className="shrink-0">
          <CTCPayLogo size="sm" variant="light" />
        </div>
        
        {/* Context status pill */}
        <div className="flex w-fit max-w-[180px] shrink-0 items-center gap-1.5 rounded-xl border border-white/10 bg-gradient-to-r from-white/15 to-white/10 px-2 py-1.5 shadow-lg backdrop-blur-sm sm:max-w-none sm:gap-2.5 sm:rounded-2xl sm:px-4 sm:py-2">
          <div className="relative shrink-0">
            <Wallet className="size-3.5 sm:size-4" style={{ color: "var(--theme-secondary)" }} />
            <span className="absolute -top-0.5 -right-0.5 size-1.5 rounded-full animate-pulse sm:size-2" style={{ backgroundColor: "var(--theme-secondary)" }} />
          </div>
          <div className="text-[10px] sm:text-xs truncate">
            {activeBalance ? (
              <>
                <span className="text-white/60 font-medium">{activeBalance.label}</span>
                <span className="font-bold ml-1 sm:ml-1.5 text-white">${activeBalance.value.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</span>
              </>
            ) : (
              <>
                <span className="text-white/60 font-medium">Estado</span>
                <span className="font-bold ml-1 sm:ml-1.5 text-white">Operando</span>
              </>
            )}
          </div>
        </div>
        
        <div className="shrink-0">
          <NotificationsPopover />
        </div>
      </div>
    </header>
  )
}

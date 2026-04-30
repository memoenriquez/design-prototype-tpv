"use client"

import { CTCPayLogo } from "./ctcpay-logo"
import { Wallet } from "lucide-react"
import { NotificationsPopover } from "./notifications-popover"

interface POSHeaderProps {
  airtimeBalance: number
}

export function POSHeader({ airtimeBalance }: POSHeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-[#000D94] via-[#0015b3] to-[#000D94] text-white px-3 sm:px-4 py-3 sm:py-4 shadow-xl shadow-[#000D94]/20 pt-safe">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#0BBD33]/10 rounded-full blur-2xl" />
        <div className="absolute -bottom-5 -left-5 w-24 h-24 bg-[#16E8FF]/10 rounded-full blur-xl" />
      </div>
      
      <div className="flex items-center justify-between relative gap-2">
        <div className="shrink-0">
          <CTCPayLogo size="sm" variant="light" />
        </div>
        
        {/* Airtime Balance - Always Visible */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 bg-gradient-to-r from-white/15 to-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl px-2.5 sm:px-4 py-1.5 sm:py-2 border border-white/10 shadow-lg min-w-0 flex-1 max-w-[180px] sm:max-w-none sm:flex-none">
          <div className="relative shrink-0">
            <Wallet className="h-3.5 sm:h-4 w-3.5 sm:w-4 text-[#0BBD33]" />
            <span className="absolute -top-0.5 -right-0.5 w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-[#0BBD33] animate-pulse" />
          </div>
          <div className="text-[10px] sm:text-xs truncate">
            <span className="text-white/60 font-medium">TAE</span>
            <span className="font-bold ml-1 sm:ml-1.5 text-white">${airtimeBalance.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</span>
          </div>
        </div>
        
        <div className="shrink-0">
          <NotificationsPopover />
        </div>
      </div>
    </header>
  )
}

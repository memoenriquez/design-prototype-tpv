"use client"

import { Home, CreditCard, QrCode, History, User, Smartphone } from "lucide-react"
import { cn } from "@/lib/utils"

interface NavItem {
  id: string
  label: string
  icon: React.ReactNode
  activeIcon?: React.ReactNode
  highlight?: boolean
}

const navItems: NavItem[] = [
  { id: "inicio", label: "Inicio", icon: <Home className="h-5 w-5" /> },
  { id: "cobrar", label: "Cobrar", icon: <CreditCard className="h-5 w-5" /> },
  { id: "tiempo-aire", label: "TAE", icon: <Smartphone className="h-7 w-7" />, highlight: true },
  { id: "historial", label: "Historial", icon: <History className="h-5 w-5" /> },
  { id: "perfil", label: "Perfil", icon: <User className="h-5 w-5" /> }
]

interface BottomNavigationProps {
  activeTab?: string
  onTabChange?: (tabId: string) => void
}

export function BottomNavigation({ activeTab = "inicio", onTabChange }: BottomNavigationProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 w-full sm:max-w-[430px] sm:left-1/2 sm:-translate-x-1/2">
      {/* Glassmorphism background */}
      <div className="absolute inset-0 bg-white/90 backdrop-blur-xl border-t border-gray-200/50 shadow-[0_-4px_30px_rgba(0,0,0,0.08)]" />
      
      <div className="relative flex items-center justify-around py-1.5 sm:py-2 pb-safe">
        {navItems.map((item) => {
          const isActive = activeTab === item.id
          const isHighlight = item.highlight
          
          return (
            <button
              key={item.id}
              onClick={() => onTabChange?.(item.id)}
              className={cn(
                "flex flex-col items-center gap-0.5 py-1 px-2 sm:px-3 rounded-2xl transition-all duration-300 relative touch-target",
                isHighlight && "-mt-5 sm:-mt-6"
              )}
            >
              {isHighlight ? (
                <div className="relative group">
                  {/* Pulse ring effect */}
                  <div className="absolute inset-0 w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-[#0BBD33] to-[#099a2a] rounded-xl sm:rounded-2xl opacity-30 animate-pulse-ring" />
                  
                  {/* Main button */}
                  <div className="relative w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-[#0BBD33] via-[#0ec73e] to-[#0BBD33] rounded-xl sm:rounded-2xl flex items-center justify-center text-white shadow-xl shadow-[#0BBD33]/40 transition-all duration-300 active:scale-95 overflow-hidden [&>svg]:w-5 [&>svg]:h-5 sm:[&>svg]:w-7 sm:[&>svg]:h-7">
                    {/* Shine effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-transparent" />
                    <div className="absolute inset-0 animate-shimmer opacity-50" />
                    {item.icon}
                  </div>
                  
                  {/* Label below */}
                  <span className="text-[9px] sm:text-[10px] font-bold text-[#0BBD33] mt-0.5 sm:mt-1 block text-center">
                    {item.label}
                  </span>
                </div>
              ) : (
                <>
                  <div className={cn(
                    "relative transition-all duration-300 p-2 sm:p-2.5 rounded-lg sm:rounded-xl [&>svg]:w-4 [&>svg]:h-4 sm:[&>svg]:w-5 sm:[&>svg]:h-5",
                    isActive 
                      ? "text-[#000D94] bg-[#000D94]/10" 
                      : "text-gray-400 active:text-gray-600 active:bg-gray-50"
                  )}>
                    {item.icon}
                    
                    {/* Active indicator dot */}
                    {isActive && (
                      <span className="absolute -top-0.5 -right-0.5 w-1.5 sm:w-2 h-1.5 sm:h-2 bg-[#0BBD33] rounded-full shadow-sm shadow-[#0BBD33]/50" />
                    )}
                  </div>
                  <span className={cn(
                    "text-[9px] sm:text-[10px] font-medium transition-all duration-300",
                    isActive ? "text-[#000D94] font-semibold" : "text-gray-400"
                  )}>
                    {item.label}
                  </span>
                </>
              )}
            </button>
          )
        })}
      </div>
    </nav>
  )
}

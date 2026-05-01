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
      <div
        className="absolute inset-0 border-t backdrop-blur-xl"
        style={{
          backgroundColor: "rgba(var(--theme-card-rgb), 0.92)",
          borderColor: "rgba(var(--theme-primary-rgb), 0.08)",
          boxShadow: "0 -4px 30px rgba(var(--theme-primary-rgb), 0.08)",
        }}
      />
      
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
                  <div
                    className="absolute inset-0 size-12 rounded-xl opacity-30 animate-pulse-ring sm:size-16 sm:rounded-2xl"
                    style={{ background: "linear-gradient(135deg, var(--theme-secondary), rgba(var(--theme-secondary-rgb), 0.82))" }}
                  />
                  
                  {/* Main button */}
                  <div
                    className="relative flex size-12 items-center justify-center overflow-hidden rounded-xl text-white shadow-xl transition-all duration-300 active:scale-95 sm:size-16 sm:rounded-2xl [&>svg]:size-5 sm:[&>svg]:size-7"
                    style={{
                      background: "linear-gradient(135deg, var(--theme-secondary), rgba(var(--theme-secondary-rgb), 0.86))",
                      boxShadow: "0 18px 30px rgba(var(--theme-secondary-rgb), 0.34)",
                    }}
                  >
                    {/* Shine effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-transparent" />
                    <div className="absolute inset-0 animate-shimmer opacity-50" />
                    {item.icon}
                  </div>
                  
                  {/* Label below */}
                  <span className="mt-0.5 block text-center text-[9px] font-bold sm:mt-1 sm:text-[10px]" style={{ color: "var(--theme-secondary)" }}>
                    {item.label}
                  </span>
                </div>
              ) : (
                <>
                  <div className={cn(
                    "relative transition-all duration-300 p-2 sm:p-2.5 rounded-lg sm:rounded-xl [&>svg]:w-4 [&>svg]:h-4 sm:[&>svg]:w-5 sm:[&>svg]:h-5",
                    isActive 
                      ? "bg-[rgba(var(--theme-primary-rgb),0.1)] text-[var(--theme-primary)]" 
                      : "text-muted-foreground/70 active:bg-muted active:text-muted-foreground"
                  )}>
                    {item.icon}
                    
                    {/* Active indicator dot */}
                    {isActive && (
                      <span
                        className="absolute -top-0.5 -right-0.5 size-1.5 rounded-full shadow-sm sm:size-2"
                        style={{
                          backgroundColor: "var(--theme-secondary)",
                          boxShadow: "0 2px 8px rgba(var(--theme-secondary-rgb), 0.45)",
                        }}
                      />
                    )}
                  </div>
                  <span className={cn(
                    "text-[9px] sm:text-[10px] font-medium transition-all duration-300",
                    isActive ? "text-[var(--theme-primary)] font-semibold" : "text-muted-foreground/70"
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

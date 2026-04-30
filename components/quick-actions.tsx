"use client"

import { Card } from "@/components/ui/card"
import { 
  Smartphone, 
  CreditCard, 
  QrCode, 
  Receipt, 
  Wallet, 
  History,
  Car,
  Gift,
  Sparkles
} from "lucide-react"

interface QuickAction {
  id: string
  label: string
  icon: React.ReactNode
  color: string
  bgColor: string
  highlighted?: boolean
  gradient?: string
  badge?: string
}

const actions: QuickAction[] = [
  {
    id: "tiempo-aire",
    label: "Tiempo Aire",
    icon: <Smartphone className="h-6 w-6" />,
    color: "text-white",
    bgColor: "bg-[#0BBD33]",
    gradient: "from-[#0BBD33] to-[#099a2a]",
    highlighted: true,
    badge: "Popular"
  },
  {
    id: "cobrar",
    label: "Cobrar",
    icon: <CreditCard className="h-6 w-6" />,
    color: "text-white",
    bgColor: "bg-[#000D94]",
    gradient: "from-[#000D94] to-[#0015b3]"
  },
  {
    id: "codigo-qr",
    label: "Cobro QR",
    icon: <QrCode className="h-6 w-6" />,
    color: "text-[#000D94]",
    bgColor: "bg-gradient-to-br from-[#e0e7ff] to-[#c7d2fe]"
  },
  {
    id: "pago-servicios",
    label: "Servicios",
    icon: <Receipt className="h-6 w-6" />,
    color: "text-white",
    gradient: "from-yellow-400 to-orange-500",
    bgColor: "bg-yellow-400",
    badge: "+100"
  },
  {
    id: "telepeaje",
    label: "Telepeaje",
    icon: <Car className="h-6 w-6" />,
    color: "text-white",
    gradient: "from-teal-500 to-cyan-500",
    bgColor: "bg-teal-500"
  },
  {
    id: "tarjetas-regalo",
    label: "T. Regalo",
    icon: <Gift className="h-6 w-6" />,
    color: "text-white",
    gradient: "from-purple-500 to-pink-500",
    bgColor: "bg-purple-500"
  },
  {
    id: "vales",
    label: "Vales",
    icon: <Wallet className="h-6 w-6" />,
    color: "text-[#000D94]",
    bgColor: "bg-gradient-to-br from-[#e0e7ff] to-[#c7d2fe]"
  },
  {
    id: "historial",
    label: "Historial",
    icon: <History className="h-6 w-6" />,
    color: "text-[#000D94]",
    bgColor: "bg-gradient-to-br from-[#e0e7ff] to-[#c7d2fe]"
  }
]

interface QuickActionsProps {
  onActionClick?: (actionId: string) => void
}

export function QuickActions({ onActionClick }: QuickActionsProps) {
  return (
    <div className="space-y-4 animate-slide-up" style={{ animationDelay: '0.1s' }}>
      <div className="flex items-center justify-between px-1">
        <h3 className="text-sm font-semibold text-foreground/80 tracking-wide">Acciones rápidas</h3>
        <Sparkles className="h-4 w-4 text-[#0BBD33]" />
      </div>
      <div className="grid grid-cols-4 gap-2 sm:gap-4">
        {actions.map((action, index) => (
          <button
            key={action.id}
            onClick={() => onActionClick?.(action.id)}
            className="flex flex-col items-center gap-1.5 sm:gap-2.5 group animate-scale-in relative touch-target"
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            <div 
              className={`
                relative
                transition-all duration-300 ease-out
                active:scale-95 sm:group-hover:scale-110 sm:group-hover:-translate-y-1
              `}
            >
              <Card 
                className={`
                  ${action.gradient ? `bg-gradient-to-br ${action.gradient}` : action.bgColor} 
                  ${action.color} 
                  w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center rounded-xl sm:rounded-2xl border-0 relative overflow-hidden
                  ${action.highlighted 
                    ? 'shadow-xl shadow-[#0BBD33]/40 ring-2 ring-[#0BBD33]/30' 
                    : 'shadow-lg shadow-[#000D94]/10 sm:group-hover:shadow-xl sm:group-hover:shadow-[#000D94]/20'}
                `}
              >
                <div className={`transition-transform duration-300 [&>svg]:w-5 [&>svg]:h-5 sm:[&>svg]:w-6 sm:[&>svg]:h-6 ${action.highlighted ? 'animate-float' : 'sm:group-hover:scale-110'}`}>
                  {action.icon}
                </div>
                {action.highlighted && (
                  <div className="absolute inset-0 rounded-xl sm:rounded-2xl bg-white/20 animate-shimmer pointer-events-none" />
                )}
              </Card>
              {action.badge && (
                <span className={`absolute -top-1 -right-1 sm:-top-1.5 sm:-right-1.5 text-[8px] sm:text-[9px] font-bold px-1 sm:px-1.5 py-0.5 rounded-full z-10 ${
                  action.highlighted 
                    ? 'bg-yellow-400 text-yellow-900' 
                    : 'bg-[#000D94] text-white'
                }`}>
                  {action.badge}
                </span>
              )}
            </div>
            <span className={`text-[10px] sm:text-xs text-center leading-tight font-medium transition-colors duration-200 line-clamp-2 ${
              action.highlighted 
                ? 'text-[#0BBD33] font-semibold' 
                : 'text-foreground/70 sm:group-hover:text-foreground'
            }`}>
              {action.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}

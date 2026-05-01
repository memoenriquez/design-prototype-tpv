"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { 
  Smartphone, 
  CreditCard, 
  Receipt,
  CheckCircle2,
  Clock,
  ChevronRight,
  TrendingUp,
  Car,
  Gift
} from "lucide-react"

interface Transaction {
  id: string
  type: "tiempo-aire" | "cobro" | "servicio" | "telepeaje" | "regalo"
  description: string
  amount: number
  time: string
  status: "completed" | "pending"
}

const transactions: Transaction[] = [
  {
    id: "1",
    type: "tiempo-aire",
    description: "Telcel - 5551234532",
    amount: 100,
    time: "Hace 5 min",
    status: "completed"
  },
  {
    id: "2",
    type: "cobro",
    description: "Venta con tarjeta Visa",
    amount: 350,
    time: "Hace 23 min",
    status: "completed"
  },
  {
    id: "3",
    type: "telepeaje",
    description: "Recarga TAG IAVE",
    amount: 200,
    time: "Hace 45 min",
    status: "completed"
  },
  {
    id: "4",
    type: "tiempo-aire",
    description: "AT&T - 5559877891",
    amount: 50,
    time: "Hace 1 hora",
    status: "completed"
  },
  {
    id: "5",
    type: "regalo",
    description: "Xbox Gift Card",
    amount: 400,
    time: "Hace 1.5 horas",
    status: "completed"
  },
  {
    id: "6",
    type: "servicio",
    description: "Pago CFE",
    amount: 245,
    time: "Hace 2 horas",
    status: "pending"
  },
  {
    id: "7",
    type: "cobro",
    description: "Venta contactless",
    amount: 125,
    time: "Hace 3 horas",
    status: "completed"
  }
]

const typeIcons = {
  "tiempo-aire": <Smartphone className="size-5" />,
  "cobro": <CreditCard className="size-5" />,
  "servicio": <Receipt className="size-5" />,
  "telepeaje": <Car className="size-5" />,
  "regalo": <Gift className="size-5" />
}

const typeColors = {
  "tiempo-aire": {
    bg: "bg-[rgba(var(--theme-secondary-rgb),0.1)]",
    text: "text-[var(--theme-secondary)]",
    shadow: "shadow-none"
  },
  "cobro": {
    bg: "bg-[rgba(var(--theme-primary-rgb),0.1)]",
    text: "text-[var(--theme-primary)]",
    shadow: "shadow-none"
  },
  "servicio": {
    bg: "bg-muted",
    text: "text-muted-foreground",
    shadow: "shadow-none"
  },
  "telepeaje": {
    bg: "bg-muted",
    text: "text-muted-foreground",
    shadow: "shadow-none"
  },
  "regalo": {
    bg: "bg-muted",
    text: "text-muted-foreground",
    shadow: "shadow-none"
  }
}

interface RecentTransactionsProps {
  expanded?: boolean
}

export function RecentTransactions({ expanded = false }: RecentTransactionsProps) {
  const displayedTransactions = expanded ? transactions : transactions.slice(0, 4)

  return (
    <div className="flex min-w-0 flex-col gap-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
      <div className="flex min-w-0 items-center justify-between gap-2 px-1">
        <div className="flex min-w-0 items-center gap-2">
          <h3 className="truncate text-sm font-semibold text-foreground/80">
            {expanded ? "Historial de transacciones" : "Transacciones recientes"}
          </h3>
          <TrendingUp className="size-4 shrink-0" style={{ color: "var(--theme-secondary)" }} />
        </div>
        {!expanded && (
          <button type="button" className="flex shrink-0 items-center gap-1 text-xs font-semibold text-[var(--theme-primary)] transition-colors hover:underline">
            Ver todas
            <ChevronRight className="size-3.5" />
          </button>
        )}
      </div>
      
      {expanded && (
        <div className="flex w-full max-w-full min-w-0 gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {["Todas", "Tiempo Aire", "Cobros", "Servicios", "Telepeaje"].map((filter, i) => (
            <button
              key={filter}
              type="button"
              aria-pressed={i === 0}
              className={cn(
                "shrink-0 rounded-full px-4 py-2 text-xs font-medium whitespace-nowrap transition-all duration-200",
                i === 0
                  ? "bg-[var(--theme-primary)] text-white shadow-md"
                  : "bg-muted text-foreground/70 hover:bg-muted/80"
              )}
            >
              {filter}
            </button>
          ))}
        </div>
      )}
      
      <div className="flex min-w-0 flex-col gap-3">
        {displayedTransactions.map((transaction, index) => (
          <Card 
            key={transaction.id}
            className="min-w-0 rounded-2xl border-0 bg-white shadow-lg shadow-gray-100/50 group animate-scale-in"
            style={{ animationDelay: `${0.3 + index * 0.05}s` }}
          >
            <CardContent className="flex min-w-0 items-center justify-between gap-3 p-4">
              <div className="flex min-w-0 items-center gap-4">
                <div
                  className={cn(
                    "flex size-12 shrink-0 items-center justify-center rounded-2xl shadow-md transition-transform duration-300 group-hover:scale-110",
                    typeColors[transaction.type].bg,
                    typeColors[transaction.type].text,
                    typeColors[transaction.type].shadow
                  )}
                >
                  {typeIcons[transaction.type]}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-foreground">{transaction.description}</p>
                  <div className="mt-0.5 flex min-w-0 items-center gap-2">
                    {transaction.status === "completed" ? (
                      <Badge className="border-0 bg-[rgba(var(--theme-secondary-rgb),0.1)] text-[var(--theme-secondary)]">
                        <CheckCircle2 className="size-3.5" />
                        Completada
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="border-border bg-muted text-muted-foreground">
                        <Clock className="size-3.5 animate-pulse" />
                        Pendiente
                      </Badge>
                    )}
                    <span className="truncate text-xs text-muted-foreground">- {transaction.time}</span>
                  </div>
                </div>
              </div>
              <div className="shrink-0 text-right">
                <p className={cn("font-bold text-base", transaction.type === "cobro" ? "text-[var(--theme-secondary)]" : "text-foreground")}>
                  {transaction.type === "cobro" ? "+" : "-"}${transaction.amount.toLocaleString('es-MX')}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {expanded && (
        <div className="text-center pt-4">
          <p className="text-sm text-muted-foreground">Mostrando {displayedTransactions.length} transacciones</p>
        </div>
      )}
    </div>
  )
}

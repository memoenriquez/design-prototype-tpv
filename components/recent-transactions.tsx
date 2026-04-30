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
  "tiempo-aire": <Smartphone className="size-4.5" />,
  "cobro": <CreditCard className="size-4.5" />,
  "servicio": <Receipt className="size-4.5" />,
  "telepeaje": <Car className="size-4.5" />,
  "regalo": <Gift className="size-4.5" />
}

const typeColors = {
  "tiempo-aire": {
    bg: "bg-gradient-to-br from-[#0BBD33]/15 to-[#0BBD33]/5",
    text: "text-[#0BBD33]",
    shadow: "shadow-[#0BBD33]/10"
  },
  "cobro": {
    bg: "bg-gradient-to-br from-[#000D94]/15 to-[#000D94]/5",
    text: "text-[#000D94]",
    shadow: "shadow-[#000D94]/10"
  },
  "servicio": {
    bg: "bg-gradient-to-br from-amber-500/15 to-amber-500/5",
    text: "text-amber-600",
    shadow: "shadow-amber-500/10"
  },
  "telepeaje": {
    bg: "bg-gradient-to-br from-teal-500/15 to-teal-500/5",
    text: "text-teal-600",
    shadow: "shadow-teal-500/10"
  },
  "regalo": {
    bg: "bg-gradient-to-br from-purple-500/15 to-purple-500/5",
    text: "text-purple-600",
    shadow: "shadow-purple-500/10"
  }
}

interface RecentTransactionsProps {
  expanded?: boolean
}

export function RecentTransactions({ expanded = false }: RecentTransactionsProps) {
  const displayedTransactions = expanded ? transactions : transactions.slice(0, 4)

  return (
    <div className="flex flex-col gap-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-foreground/80">
            {expanded ? "Historial de transacciones" : "Transacciones recientes"}
          </h3>
          <TrendingUp className="size-4 text-[#0BBD33]" />
        </div>
        {!expanded && (
          <button className="text-xs text-[#000D94] font-semibold hover:underline flex items-center gap-1 transition-colors hover:text-[#0015b3]">
            Ver todas
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
      
      {expanded && (
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1">
          {["Todas", "Tiempo Aire", "Cobros", "Servicios", "Telepeaje"].map((filter, i) => (
            <button
              key={filter}
              className={cn(
                "px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-200",
                i === 0
                  ? "bg-[#000D94] text-white shadow-md"
                  : "bg-gray-100 text-foreground/70 hover:bg-gray-200"
              )}
            >
              {filter}
            </button>
          ))}
        </div>
      )}
      
      <div className="flex flex-col gap-3">
        {displayedTransactions.map((transaction, index) => (
          <Card 
            key={transaction.id}
            className="border-0 shadow-lg shadow-gray-100/50 rounded-2xl bg-white group animate-scale-in"
            style={{ animationDelay: `${0.3 + index * 0.05}s` }}
          >
            <CardContent className="flex items-center justify-between p-4">
              <div className="flex items-center gap-4">
                <div
                  className={cn(
                    "size-12 rounded-2xl flex items-center justify-center shadow-md transition-transform duration-300 group-hover:scale-110",
                    typeColors[transaction.type].bg,
                    typeColors[transaction.type].text,
                    typeColors[transaction.type].shadow
                  )}
                >
                  {typeIcons[transaction.type]}
                </div>
                <div>
                  <p className="font-semibold text-sm text-foreground">{transaction.description}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    {transaction.status === "completed" ? (
                      <Badge className="border-0 bg-[#0BBD33]/10 text-[#0BBD33]">
                        <CheckCircle2 className="size-3.5" />
                        Completada
                      </Badge>
                    ) : (
                      <Badge className="border-0 bg-amber-500/10 text-amber-500">
                        <Clock className="size-3.5 animate-pulse" />
                        Pendiente
                      </Badge>
                    )}
                    <span className="text-xs text-muted-foreground">- {transaction.time}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className={cn("font-bold text-base", transaction.type === "cobro" ? "text-[#0BBD33]" : "text-foreground")}>
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

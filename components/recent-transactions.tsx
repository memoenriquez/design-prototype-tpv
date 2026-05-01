"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { cn } from "@/lib/utils"
import {
  AlertCircle,
  Ban,
  CheckCircle2,
  ChevronRight,
  Clock,
  Receipt,
  RotateCcw,
  TrendingUp,
  type LucideIcon,
} from "lucide-react"
import { useState } from "react"
import { useTransactions } from "@/contexts/transactions-context"
import { formatMoney } from "@/lib/formatters"
import {
  getTransactionToneClassNames,
  isIncomeTransaction,
  transactionDisplay,
} from "@/lib/transaction-display"
import type { TransactionStatus, TransactionType } from "@/lib/transactions"

const transactionFilters: Array<{ label: string; type?: TransactionType }> = [
  { label: "Todas" },
  { label: "Tiempo Aire", type: "tiempo-aire" },
  { label: "Cobros", type: "cobro" },
  { label: "Servicios", type: "servicio" },
  { label: "Telepeaje", type: "telepeaje" },
  { label: "Regalo", type: "regalo" },
  { label: "Vales", type: "vales" },
  { label: "QR", type: "qr" },
]

interface TransactionStatusDisplay {
  label: string
  icon: LucideIcon
  className: string
  pulse?: boolean
}

const transactionStatusDisplay: Record<TransactionStatus, TransactionStatusDisplay> = {
  completed: {
    label: "Completada",
    icon: CheckCircle2,
    className: "border-0 bg-[rgba(var(--theme-secondary-rgb),0.1)] text-[var(--theme-secondary)]",
  },
  pending: {
    label: "Pendiente proveedor",
    icon: Clock,
    className: "border-border bg-muted text-muted-foreground",
    pulse: true,
  },
  failed: {
    label: "Fallida",
    icon: AlertCircle,
    className: "border-destructive/20 bg-destructive/10 text-destructive",
  },
  "refund-required": {
    label: "Requiere reembolso",
    icon: RotateCcw,
    className: "border-[rgba(var(--theme-primary-rgb),0.2)] bg-[rgba(var(--theme-primary-rgb),0.08)] text-[var(--theme-primary)]",
  },
  rejected: {
    label: "Rechazada",
    icon: Ban,
    className: "border-border bg-muted text-muted-foreground",
  },
  cancelled: {
    label: "Cancelada",
    icon: Ban,
    className: "border-border bg-muted text-muted-foreground",
  },
}

interface RecentTransactionsProps {
  expanded?: boolean
  onViewAll?: () => void
}

export function RecentTransactions({ expanded = false, onViewAll }: RecentTransactionsProps) {
  const { transactions } = useTransactions()
  const [activeFilter, setActiveFilter] = useState<TransactionType | "all">("all")
  const filteredTransactions = activeFilter === "all"
    ? transactions
    : transactions.filter((transaction) => transaction.type === activeFilter)
  const displayedTransactions = expanded ? filteredTransactions : transactions.slice(0, 4)

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
          <button
            type="button"
            onClick={onViewAll}
            className="flex shrink-0 items-center gap-1 text-xs font-semibold text-[var(--theme-primary)] transition-colors hover:underline"
          >
            Ver todas
            <ChevronRight className="size-3.5" />
          </button>
        )}
      </div>
      
      {expanded && (
        <div className="flex w-full max-w-full min-w-0 gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {transactionFilters.map((filter) => {
            const filterId: TransactionType | "all" = filter.type ?? "all"
            const isActive = activeFilter === filterId

            return (
              <button
                key={filter.label}
                type="button"
                aria-pressed={isActive}
                onClick={() => setActiveFilter(filterId)}
                className={cn(
                  "shrink-0 rounded-full px-4 py-2 text-xs font-medium whitespace-nowrap transition-all duration-200",
                  isActive
                    ? "bg-[var(--theme-primary)] text-white shadow-md"
                    : "bg-muted text-foreground/70 hover:bg-muted/80"
                )}
              >
                {filter.label}
              </button>
            )
          })}
        </div>
      )}
      
      <div className="flex min-w-0 flex-col gap-3">
        {displayedTransactions.map((transaction, index) => (
          (() => {
            const Icon = transactionDisplay[transaction.type].icon
            const isIncome = isIncomeTransaction(transaction.type)
            const statusDisplay = transactionStatusDisplay[transaction.status]
            const StatusIcon = statusDisplay.icon

            return (
          <Card 
            key={transaction.id}
            className="min-w-0 rounded-2xl border-0 bg-card shadow-lg shadow-slate-900/5 group animate-scale-in"
            style={{ animationDelay: `${0.3 + index * 0.05}s` }}
          >
            <CardContent className="flex min-w-0 items-center justify-between gap-3 p-4">
              <div className="flex min-w-0 items-center gap-4">
                <div
                  className={cn(
                    "flex size-12 shrink-0 items-center justify-center rounded-2xl shadow-md transition-transform duration-300 group-hover:scale-110",
                    getTransactionToneClassNames(transaction.type)
                  )}
                >
                  <Icon className="size-5" aria-hidden="true" />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-foreground">{transaction.description}</p>
                  <div className="mt-0.5 flex min-w-0 items-center gap-2">
                    <Badge variant="outline" className={cn("shrink-0", statusDisplay.className)}>
                      <StatusIcon
                        data-icon="inline-start"
                        className={cn(statusDisplay.pulse && "animate-pulse")}
                      />
                      {statusDisplay.label}
                    </Badge>
                    <span className="truncate text-xs text-muted-foreground">- {transaction.time}</span>
                  </div>
                </div>
              </div>
              <div className="shrink-0 text-right">
                <p className={cn("font-bold text-base", isIncome ? "text-[var(--theme-secondary)]" : "text-foreground")}>
                  {isIncome ? "+" : "-"}{formatMoney(transaction.amount)}
                </p>
              </div>
            </CardContent>
          </Card>
            )
          })()
        ))}
      </div>

      {displayedTransactions.length === 0 && (
        <Empty className="border-0 bg-card py-10 shadow-sm">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Receipt />
            </EmptyMedia>
            <EmptyTitle>Sin movimientos</EmptyTitle>
            <EmptyDescription>
              No hay transacciones para este filtro todavía.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      )}
      
      {expanded && (
        <div className="text-center pt-4">
          <p className="text-sm text-muted-foreground">
            Mostrando {displayedTransactions.length} de {transactions.length} transacciones
          </p>
        </div>
      )}
    </div>
  )
}

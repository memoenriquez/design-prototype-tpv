"use client"

import {
  Car,
  CreditCard,
  Gift,
  QrCode,
  Receipt,
  Smartphone,
  Wallet,
  type LucideIcon,
} from "lucide-react"
import type { TransactionType } from "@/lib/transactions"

interface TransactionDisplayMeta {
  label: string
  icon: LucideIcon
  tone: "primary" | "secondary" | "muted"
  direction: "income" | "expense"
}

export const transactionDisplay: Record<TransactionType, TransactionDisplayMeta> = {
  "tiempo-aire": {
    label: "Tiempo Aire",
    icon: Smartphone,
    tone: "secondary",
    direction: "expense",
  },
  cobro: {
    label: "Cobro",
    icon: CreditCard,
    tone: "primary",
    direction: "income",
  },
  servicio: {
    label: "Servicio",
    icon: Receipt,
    tone: "muted",
    direction: "expense",
  },
  telepeaje: {
    label: "Telepeaje",
    icon: Car,
    tone: "muted",
    direction: "expense",
  },
  regalo: {
    label: "Regalo",
    icon: Gift,
    tone: "muted",
    direction: "expense",
  },
  vales: {
    label: "Vales",
    icon: Wallet,
    tone: "primary",
    direction: "income",
  },
  qr: {
    label: "QR",
    icon: QrCode,
    tone: "secondary",
    direction: "income",
  },
}

export const getTransactionToneClassNames = (type: TransactionType) => {
  const tone = transactionDisplay[type].tone

  if (tone === "primary") {
    return "bg-[rgba(var(--theme-primary-rgb),0.1)] text-[var(--theme-primary)]"
  }

  if (tone === "secondary") {
    return "bg-[rgba(var(--theme-secondary-rgb),0.1)] text-[var(--theme-secondary)]"
  }

  return "bg-muted text-muted-foreground"
}

export const isIncomeTransaction = (type: TransactionType) =>
  transactionDisplay[type].direction === "income"

"use client"

export type TransactionType =
  | "tiempo-aire"
  | "cobro"
  | "servicio"
  | "telepeaje"
  | "regalo"
  | "vales"
  | "qr"

export type TransactionStatus =
  | "completed"
  | "pending"
  | "failed"
  | "refund-required"
  | "cancelled"
  | "rejected"

export interface AppTransaction {
  id: string
  type: TransactionType
  description: string
  amount: number
  time: string
  status: TransactionStatus
  reference?: string
}

export interface CreateTransactionInput {
  type: TransactionType
  description: string
  amount: number
  status?: TransactionStatus
  reference?: string
}

export const seedTransactions: AppTransaction[] = [
  {
    id: "seed-1",
    type: "tiempo-aire",
    description: "Telcel - 5551234532",
    amount: 100,
    time: "Hace 5 min",
    status: "completed",
  },
  {
    id: "seed-2",
    type: "cobro",
    description: "Venta con tarjeta Visa",
    amount: 350,
    time: "Hace 23 min",
    status: "completed",
  },
  {
    id: "seed-3",
    type: "telepeaje",
    description: "Recarga TAG IAVE",
    amount: 200,
    time: "Hace 45 min",
    status: "completed",
  },
  {
    id: "seed-4",
    type: "tiempo-aire",
    description: "AT&T - 5559877891",
    amount: 50,
    time: "Hace 1 hora",
    status: "completed",
  },
  {
    id: "seed-5",
    type: "regalo",
    description: "Xbox Gift Card",
    amount: 400,
    time: "Hace 1.5 horas",
    status: "completed",
  },
  {
    id: "seed-6",
    type: "servicio",
    description: "Pago CFE",
    amount: 245,
    time: "Hace 2 horas",
    status: "pending",
  },
  {
    id: "seed-7",
    type: "cobro",
    description: "Venta contactless",
    amount: 125,
    time: "Hace 3 horas",
    status: "completed",
  },
  {
    id: "seed-8",
    type: "servicio",
    description: "Pago Telmex - requiere reembolso",
    amount: 389,
    time: "Hace 4 horas",
    status: "refund-required",
    reference: "SRV-84210931",
  },
  {
    id: "seed-9",
    type: "tiempo-aire",
    description: "Telcel - recarga rechazada",
    amount: 150,
    time: "Ayer",
    status: "failed",
    reference: "TAE-19408231",
  },
]

export const createTransaction = (input: CreateTransactionInput): AppTransaction => ({
  ...input,
  id: `txn-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  time: "Ahora",
  status: input.status ?? "completed",
})

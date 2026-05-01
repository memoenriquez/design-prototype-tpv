"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react"
import {
  createTransaction,
  seedTransactions,
  type AppTransaction,
  type CreateTransactionInput,
} from "@/lib/transactions"

interface TransactionsContextType {
  transactions: AppTransaction[]
  addTransaction: (input: CreateTransactionInput) => AppTransaction
  resetTransactions: () => void
}

const STORAGE_KEY = "ctcpay-transactions"

const TransactionsContext = createContext<TransactionsContextType | undefined>(undefined)

export function TransactionsProvider({ children }: { children: ReactNode }) {
  const [transactions, setTransactions] = useState<AppTransaction[]>(seedTransactions)

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (!saved) return

      const parsed = JSON.parse(saved) as AppTransaction[]
      if (Array.isArray(parsed)) {
        setTransactions(parsed)
      }
    } catch {
      setTransactions(seedTransactions)
    }
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions))
    } catch {
      // Local persistence is best-effort in the prototype.
    }
  }, [transactions])

  const addTransaction = useCallback((input: CreateTransactionInput) => {
    const transaction = createTransaction(input)
    setTransactions((current) => [transaction, ...current])
    return transaction
  }, [])

  const resetTransactions = useCallback(() => {
    setTransactions(seedTransactions)
  }, [])

  return (
    <TransactionsContext.Provider
      value={{
        transactions,
        addTransaction,
        resetTransactions,
      }}
    >
      {children}
    </TransactionsContext.Provider>
  )
}

export function useTransactions() {
  const context = useContext(TransactionsContext)

  if (!context) {
    throw new Error("useTransactions must be used within a TransactionsProvider")
  }

  return context
}

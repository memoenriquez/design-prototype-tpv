"use client"

import { useEffect, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { CheckCircle2, XCircle, Loader2, AlertCircle, Receipt, Share2 } from "lucide-react"
import { cn } from "@/lib/utils"

export type TransactionStatus = "processing" | "success" | "error" | "warning"

export interface TransactionDetails {
  type: string
  amount: string
  reference?: string
  recipient?: string
  date?: string
  commission?: string
}

interface TransactionModalProps {
  open: boolean
  onClose: () => void
  status: TransactionStatus
  title?: string
  message?: string
  details?: TransactionDetails
  onRetry?: () => void
  onNewTransaction?: () => void
}

const statusConfig = {
  processing: {
    icon: Loader2,
    iconClass: "text-[var(--theme-primary)] animate-spin",
    bgClass: "bg-[rgba(var(--theme-primary-rgb),0.1)]",
    title: "Procesando...",
    message: "Por favor espere mientras procesamos su transaccion",
  },
  success: {
    icon: CheckCircle2,
    iconClass: "text-[var(--theme-secondary)]",
    bgClass: "bg-[rgba(var(--theme-secondary-rgb),0.1)]",
    title: "Transaccion Exitosa",
    message: "Su transaccion ha sido completada correctamente",
  },
  error: {
    icon: XCircle,
    iconClass: "text-red-500",
    bgClass: "bg-red-500/10",
    title: "Transaccion Fallida",
    message: "No se pudo completar la transaccion",
  },
  warning: {
    icon: AlertCircle,
    iconClass: "text-muted-foreground",
    bgClass: "bg-muted",
    title: "Atencion",
    message: "La transaccion requiere su atencion",
  },
}

export function TransactionModal({
  open,
  onClose,
  status,
  title,
  message,
  details,
  onRetry,
  onNewTransaction,
}: TransactionModalProps) {
  const config = statusConfig[status]
  const Icon = config.icon
  const [shareCopied, setShareCopied] = useState(false)

  const receiptText = details
    ? [
        "CTC Pay - Comprobante",
        `Tipo: ${details.type}`,
        details.recipient ? `Destinatario: ${details.recipient}` : null,
        `Monto: ${details.amount}`,
        details.commission ? `Comision: ${details.commission}` : null,
        details.reference ? `Referencia: ${details.reference}` : null,
        details.date ? `Fecha: ${details.date}` : null,
      ].filter(Boolean).join("\n")
    : ""

  const handleDownloadReceipt = () => {
    if (!receiptText) return

    const blob = new Blob([receiptText], { type: "text/plain;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")

    link.href = url
    link.download = `ctcpay-recibo-${details?.reference || Date.now()}.txt`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const handleShareReceipt = async () => {
    if (!receiptText) return

    if (navigator.share) {
      await navigator.share({
        title: "CTC Pay - Comprobante",
        text: receiptText,
      })
      return
    }

    await navigator.clipboard.writeText(receiptText)
    setShareCopied(true)
    window.setTimeout(() => setShareCopied(false), 2000)
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-[calc(100%-2rem)] max-w-md rounded-3xl border-0 bg-white shadow-2xl">
        <div className="flex min-w-0 flex-col items-center py-6">
          {/* Status Icon */}
          <div className={cn(
            "mb-6 flex size-20 items-center justify-center rounded-full",
            config.bgClass
          )}>
            <Icon className={cn("size-10", config.iconClass)} />
          </div>

          {/* Title */}
          <DialogHeader className="min-w-0 text-center">
            <DialogTitle className="text-xl font-bold text-foreground">
              {title || config.title}
            </DialogTitle>
            <DialogDescription className="text-gray-500 mt-2">
              {message || config.message}
            </DialogDescription>
          </DialogHeader>

          {/* Transaction Details */}
          {details && status !== "processing" && (
            <div className="mt-6 flex w-full min-w-0 flex-col gap-3 rounded-2xl bg-gray-50 p-4">
              <div className="flex min-w-0 items-center justify-between gap-3">
                <span className="shrink-0 text-sm text-gray-500">Tipo</span>
                <span className="min-w-0 truncate text-sm font-medium text-foreground">{details.type}</span>
              </div>
              {details.recipient && (
                <div className="flex min-w-0 items-center justify-between gap-3">
                  <span className="shrink-0 text-sm text-gray-500">Destinatario</span>
                  <span className="min-w-0 truncate text-sm font-medium text-foreground">{details.recipient}</span>
                </div>
              )}
              <div className="flex min-w-0 items-center justify-between gap-3">
                <span className="shrink-0 text-sm text-gray-500">Monto</span>
                <span className="min-w-0 truncate text-sm font-bold text-foreground">{details.amount}</span>
              </div>
              {details.commission && (
                <div className="flex min-w-0 items-center justify-between gap-3">
                  <span className="shrink-0 text-sm text-gray-500">Comision</span>
                  <span className="min-w-0 truncate text-sm text-gray-600">{details.commission}</span>
                </div>
              )}
              {details.reference && (
                <>
                  <Separator />
                  <div className="flex min-w-0 items-center justify-between gap-3 pt-2">
                    <span className="shrink-0 text-sm text-gray-500">Referencia</span>
                    <span className="min-w-0 truncate text-xs font-mono text-[var(--theme-primary)]">{details.reference}</span>
                  </div>
                </>
              )}
              {details.date && (
                <div className="flex min-w-0 items-center justify-between gap-3">
                  <span className="shrink-0 text-sm text-gray-500">Fecha</span>
                  <span className="min-w-0 truncate text-sm text-gray-600">{details.date}</span>
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          {status !== "processing" && (
            <DialogFooter className="mt-6 w-full min-w-0 flex-col gap-3 sm:flex-col">
              {status === "success" && (
                <div className="flex w-full min-w-0 gap-3">
                  <Button
                    variant="outline"
                    className="min-w-0 flex-1 rounded-xl border-gray-200"
                    onClick={handleDownloadReceipt}
                    disabled={!details}
                  >
                    <Receipt data-icon="inline-start" />
                    Recibo
                  </Button>
                  <Button
                    variant="outline"
                    className="min-w-0 flex-1 rounded-xl border-gray-200"
                    onClick={handleShareReceipt}
                    disabled={!details}
                  >
                    <Share2 data-icon="inline-start" />
                    {shareCopied ? "Copiado" : "Compartir"}
                  </Button>
                </div>
              )}
              
              {status === "error" && onRetry && (
                <Button
                  className="h-12 w-full rounded-xl bg-[var(--theme-primary)] hover:opacity-95"
                  onClick={onRetry}
                >
                  Reintentar
                </Button>
              )}

              <Button
                variant={status === "success" ? "default" : "outline"}
                className={cn(
                  "w-full rounded-xl h-12",
                  status === "success" 
                    ? "bg-[var(--theme-secondary)] text-white hover:opacity-95"
                    : "border-gray-200"
                )}
                onClick={onNewTransaction || onClose}
              >
                {status === "success" ? "Nueva Transaccion" : "Cerrar"}
              </Button>
            </DialogFooter>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

// Confirmation dialog before transaction
interface ConfirmTransactionModalProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  details: TransactionDetails
  isLoading?: boolean
}

export function ConfirmTransactionModal({
  open,
  onClose,
  onConfirm,
  title,
  details,
  isLoading,
}: ConfirmTransactionModalProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-[calc(100%-2rem)] max-w-md rounded-3xl border-0 bg-white shadow-2xl">
        <DialogHeader className="text-center pb-4">
          <DialogTitle className="text-xl font-bold text-foreground">
            {title}
          </DialogTitle>
          <DialogDescription className="text-gray-500">
            Confirme los datos de la transaccion
          </DialogDescription>
        </DialogHeader>

        {/* Transaction Details */}
        <div className="flex w-full min-w-0 flex-col gap-3 rounded-2xl bg-gray-50 p-4">
          <div className="flex min-w-0 items-center justify-between gap-3">
            <span className="shrink-0 text-sm text-gray-500">Tipo</span>
            <span className="min-w-0 truncate text-sm font-medium text-foreground">{details.type}</span>
          </div>
          {details.recipient && (
            <div className="flex min-w-0 items-center justify-between gap-3">
              <span className="shrink-0 text-sm text-gray-500">Destinatario</span>
              <span className="min-w-0 truncate text-sm font-medium text-foreground">{details.recipient}</span>
            </div>
          )}
          <div className="flex min-w-0 items-center justify-between gap-3">
            <span className="shrink-0 text-sm text-gray-500">Monto</span>
            <span className="min-w-0 truncate text-lg font-bold text-foreground">{details.amount}</span>
          </div>
          {details.commission && (
            <div className="flex min-w-0 items-center justify-between gap-3">
              <span className="shrink-0 text-sm text-gray-500">Comision</span>
              <span className="min-w-0 truncate text-sm text-gray-600">{details.commission}</span>
            </div>
          )}
          <Separator />
          <div className="flex min-w-0 items-center justify-between gap-3 pt-2">
            <span className="shrink-0 text-sm font-medium text-gray-700">Total</span>
            <span className="min-w-0 truncate text-lg font-bold text-[var(--theme-secondary)]">
              {details.amount}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <DialogFooter className="mt-4 gap-3 sm:flex-row">
          <Button
            variant="outline"
            className="h-12 w-full rounded-xl border-gray-200 sm:flex-1"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button
            className="h-12 w-full rounded-xl bg-[var(--theme-secondary)] text-white hover:opacity-95 sm:flex-1"
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin" data-icon="inline-start" />
                Procesando...
              </>
            ) : (
              "Confirmar"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

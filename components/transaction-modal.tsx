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
    iconClass: "text-ctcpay-blue animate-spin",
    bgClass: "bg-ctcpay-blue/10",
    title: "Procesando...",
    message: "Por favor espere mientras procesamos su transaccion",
  },
  success: {
    icon: CheckCircle2,
    iconClass: "text-ctcpay-green",
    bgClass: "bg-ctcpay-green/10",
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
    iconClass: "text-amber-500",
    bgClass: "bg-amber-500/10",
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

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white border-0 rounded-3xl shadow-2xl">
        <div className="flex flex-col items-center py-6">
          {/* Status Icon */}
          <div className={cn(
            "mb-6 flex size-20 items-center justify-center rounded-full",
            config.bgClass
          )}>
            <Icon className={cn("size-10", config.iconClass)} />
          </div>

          {/* Title */}
          <DialogHeader className="text-center">
            <DialogTitle className="text-xl font-bold text-ctcpay-dark">
              {title || config.title}
            </DialogTitle>
            <DialogDescription className="text-gray-500 mt-2">
              {message || config.message}
            </DialogDescription>
          </DialogHeader>

          {/* Transaction Details */}
          {details && status !== "processing" && (
            <div className="mt-6 flex w-full flex-col gap-3 rounded-2xl bg-gray-50 p-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Tipo</span>
                <span className="text-sm font-medium text-ctcpay-dark">{details.type}</span>
              </div>
              {details.recipient && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Destinatario</span>
                  <span className="text-sm font-medium text-ctcpay-dark">{details.recipient}</span>
                </div>
              )}
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Monto</span>
                <span className="text-sm font-bold text-ctcpay-dark">{details.amount}</span>
              </div>
              {details.commission && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Comision</span>
                  <span className="text-sm text-gray-600">{details.commission}</span>
                </div>
              )}
              {details.reference && (
                <>
                  <Separator />
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-sm text-gray-500">Referencia</span>
                    <span className="text-xs font-mono text-ctcpay-blue">{details.reference}</span>
                  </div>
                </>
              )}
              {details.date && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Fecha</span>
                  <span className="text-sm text-gray-600">{details.date}</span>
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          {status !== "processing" && (
            <DialogFooter className="w-full mt-6 flex-col gap-3 sm:flex-col">
              {status === "success" && (
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    className="flex-1 rounded-xl border-gray-200"
                    onClick={() => {}}
                  >
                    <Receipt data-icon="inline-start" />
                    Recibo
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 rounded-xl border-gray-200"
                    onClick={() => {}}
                  >
                    <Share2 data-icon="inline-start" />
                    Compartir
                  </Button>
                </div>
              )}
              
              {status === "error" && onRetry && (
                <Button
                  className="w-full bg-ctcpay-blue hover:bg-ctcpay-blue/90 rounded-xl h-12"
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
                    ? "bg-ctcpay-green hover:bg-ctcpay-green/90 text-white"
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
      <DialogContent className="sm:max-w-md bg-white border-0 rounded-3xl shadow-2xl">
        <DialogHeader className="text-center pb-4">
          <DialogTitle className="text-xl font-bold text-ctcpay-dark">
            {title}
          </DialogTitle>
          <DialogDescription className="text-gray-500">
            Confirme los datos de la transaccion
          </DialogDescription>
        </DialogHeader>

        {/* Transaction Details */}
        <div className="flex w-full flex-col gap-3 rounded-2xl bg-gray-50 p-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">Tipo</span>
            <span className="text-sm font-medium text-ctcpay-dark">{details.type}</span>
          </div>
          {details.recipient && (
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Destinatario</span>
              <span className="text-sm font-medium text-ctcpay-dark">{details.recipient}</span>
            </div>
          )}
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">Monto</span>
            <span className="text-lg font-bold text-ctcpay-dark">{details.amount}</span>
          </div>
          {details.commission && (
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Comision</span>
              <span className="text-sm text-gray-600">{details.commission}</span>
            </div>
          )}
          <Separator />
          <div className="flex justify-between items-center pt-2">
            <span className="text-sm font-medium text-gray-700">Total</span>
            <span className="text-lg font-bold text-ctcpay-green">
              {details.amount}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <DialogFooter className="mt-4 flex-row gap-3">
          <Button
            variant="outline"
            className="flex-1 rounded-xl h-12 border-gray-200"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button
            className="flex-1 rounded-xl h-12 bg-ctcpay-green hover:bg-ctcpay-green/90 text-white"
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

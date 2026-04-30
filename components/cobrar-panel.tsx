"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  CreditCard,
  QrCode,
  Wallet,
  Nfc,
  Delete,
  Check,
  ArrowRight
} from "lucide-react"
import { TransactionModal, ConfirmTransactionModal, TransactionStatus, TransactionDetails } from "./transaction-modal"
import { cn } from "@/lib/utils"

interface CobrarPanelProps {
  onBack?: () => void
}

const paymentMethods = [
  { id: "tarjeta", name: "Tarjeta", icon: <CreditCard className="size-5" />, color: "from-[#000D94] to-[#1a2eb8]" },
  { id: "contactless", name: "Contactless", icon: <Nfc className="size-5" />, color: "from-cyan-500 to-blue-500" },
  { id: "qr", name: "Codigo QR", icon: <QrCode className="size-5" />, color: "from-[#0BBD33] to-[#099a2a]" },
  { id: "vales", name: "Vales", icon: <Wallet className="size-5" />, color: "from-orange-400 to-red-500" },
]

export function CobrarPanel({ onBack }: CobrarPanelProps) {
  const [amount, setAmount] = useState("")
  const [selectedMethod, setSelectedMethod] = useState("tarjeta")
  
  // Modal states
  const [showConfirm, setShowConfirm] = useState(false)
  const [showResult, setShowResult] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [transactionStatus, setTransactionStatus] = useState<TransactionStatus>("processing")

  const handleKeyPress = (key: string) => {
    if (key === "delete") {
      setAmount(prev => prev.slice(0, -1))
    } else if (key === "." && amount.includes(".")) {
      return
    } else if (amount.length < 10) {
      setAmount(prev => prev + key)
    }
  }

  const getKeyLabel = (key: string) => {
    if (key === "delete") return "Borrar ultimo digito"
    if (key === ".") return "Agregar punto decimal"
    return `Agregar ${key}`
  }

  const formattedAmount = amount ? 
    parseFloat(amount || "0").toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : 
    "0.00"

  const selectedMethodData = paymentMethods.find(m => m.id === selectedMethod)

  const transactionDetails: TransactionDetails = {
    type: `Cobro con ${selectedMethodData?.name || "Tarjeta"}`,
    amount: `$${formattedAmount}`,
    commission: "$0.00",
    reference: `COB-${Date.now().toString().slice(-8)}`,
    date: new Date().toLocaleString('es-MX', { dateStyle: 'medium', timeStyle: 'short' })
  }

  const handleCharge = () => {
    setShowConfirm(true)
  }

  const handleConfirmTransaction = () => {
    setIsProcessing(true)
    setShowConfirm(false)
    setShowResult(true)
    setTransactionStatus("processing")

    // Simulate card/payment processing
    setTimeout(() => {
      setIsProcessing(false)
      // 85% success rate for demo
      const success = Math.random() > 0.15
      setTransactionStatus(success ? "success" : "error")
    }, 3000)
  }

  const handleNewTransaction = () => {
    setShowResult(false)
    setAmount("")
  }

  const handleRetry = () => {
    setTransactionStatus("processing")
    setTimeout(() => {
      setTransactionStatus("success")
    }, 2500)
  }

  return (
    <>
      <div className="flex w-full max-w-full min-w-0 flex-col gap-4 animate-slide-up">
        {/* Amount Display */}
        <Card className="w-full min-w-0 overflow-hidden border-0 shadow-xl shadow-[#000D94]/10">
          <CardHeader className="bg-gradient-to-br from-[#000D94] via-[#0015b3] to-[#1a2eb8] text-white p-4 sm:p-6 text-center relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 size-24 -translate-y-1/2 translate-x-1/2 rounded-full bg-white/5 sm:size-32" />
            <div className="absolute bottom-0 left-0 size-16 -translate-x-1/2 translate-y-1/2 rounded-full bg-white/5 sm:size-24" />
            
            <div className="relative z-10">
              <p className="text-white/70 text-xs sm:text-sm font-medium mb-1 sm:mb-2">Monto a cobrar</p>
              <div className="flex items-center justify-center gap-1 sm:gap-2">
                <span className="text-xl sm:text-2xl font-bold text-white/80">$</span>
                <span className="text-3xl sm:text-5xl font-bold tracking-tight">{formattedAmount}</span>
              </div>
              <p className="text-white/60 text-[10px] sm:text-xs mt-1 sm:mt-2">MXN</p>
            </div>
          </CardHeader>
          
          <CardContent className="min-w-0 p-3 sm:p-4">
            {/* Payment Methods */}
            <div className="mb-4 sm:mb-6">
              <p className="text-[10px] sm:text-xs font-semibold text-muted-foreground mb-2 sm:mb-3 uppercase tracking-wider">Metodo de pago</p>
              <div className="grid min-w-0 grid-cols-4 gap-1.5 sm:gap-2">
                {paymentMethods.map((method) => (
                  <button
                    key={method.id}
                    type="button"
                    aria-pressed={selectedMethod === method.id}
                    onClick={() => setSelectedMethod(method.id)}
                    className={cn(
                      "flex min-w-0 flex-col items-center gap-1 rounded-lg p-2 transition-all duration-300 sm:gap-2 sm:rounded-xl sm:p-3 touch-target",
                      selectedMethod === method.id
                        ? `scale-[1.02] bg-gradient-to-br ${method.color} text-white shadow-lg sm:scale-105`
                        : "bg-gray-50 text-foreground/70 active:bg-gray-100"
                    )}
                  >
                    <div className="[&>svg]:size-4 sm:[&>svg]:size-5">
                      {method.icon}
                    </div>
                    <span className="max-w-full truncate text-[8px] font-medium leading-tight sm:text-[10px]">{method.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Numeric Keypad */}
            <div className="grid min-w-0 grid-cols-3 gap-2 sm:gap-3">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', 'delete'].map((key) => (
                <button
                  key={key}
                  type="button"
                  aria-label={getKeyLabel(key)}
                  onClick={() => handleKeyPress(key)}
                  className={cn(
                    "h-11 min-w-0 rounded-xl text-lg font-bold transition-all duration-200 active:scale-95 sm:h-14 sm:rounded-2xl sm:text-xl touch-target",
                    key === "delete"
                      ? "bg-red-50 text-red-500 active:bg-red-100"
                      : "bg-gray-50 text-foreground active:bg-gray-100 active:shadow-md"
                  )}
                >
                  {key === 'delete' ? <Delete className="mx-auto size-5 sm:size-6" /> : key}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Amounts */}
        <div className="flex w-full max-w-full min-w-0 gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {[50, 100, 200, 500, 1000].map((quickAmount) => (
            <button
              key={quickAmount}
              type="button"
              onClick={() => setAmount(quickAmount.toString())}
              className="px-3 sm:px-4 py-1.5 sm:py-2 bg-white border border-gray-200 rounded-full text-xs sm:text-sm font-semibold text-[#000D94] active:bg-[#000D94] active:text-white active:border-[#000D94] transition-all duration-200 whitespace-nowrap flex-shrink-0 touch-target"
            >
              ${quickAmount}
            </button>
          ))}
        </div>

        {/* Charge Button */}
        <Button 
          className="w-full h-12 sm:h-14 bg-gradient-to-r from-[#0BBD33] to-[#099a2a] hover:from-[#099a2a] hover:to-[#078523] text-white font-bold text-base sm:text-lg rounded-xl sm:rounded-2xl shadow-xl shadow-[#0BBD33]/30 transition-all duration-300 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!amount || parseFloat(amount) <= 0}
          onClick={handleCharge}
        >
          <span className="flex items-center gap-2">
            Cobrar ${formattedAmount}
            <ArrowRight className="size-4 sm:size-5" />
          </span>
        </Button>

        {/* Payment Info */}
        <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Check className="size-3 text-[#0BBD33]" />
            <span>Pago seguro</span>
          </div>
          <div className="flex items-center gap-1">
            <Check className="size-3 text-[#0BBD33]" />
            <span>Comprobante digital</span>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmTransactionModal
        open={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleConfirmTransaction}
        title="Confirmar Cobro"
        details={transactionDetails}
        isLoading={isProcessing}
      />

      {/* Result Modal */}
      <TransactionModal
        open={showResult}
        onClose={() => setShowResult(false)}
        status={transactionStatus}
        title={
          transactionStatus === "success" ? "Pago Aprobado" :
          transactionStatus === "error" ? "Pago Rechazado" :
          "Procesando Pago..."
        }
        message={
          transactionStatus === "success" ? `Cobro de $${formattedAmount} completado exitosamente` :
          transactionStatus === "error" ? "La transaccion fue rechazada. Verifique la tarjeta e intente nuevamente." :
          "Conectando con terminal de pago..."
        }
        details={transactionStatus !== "processing" ? transactionDetails : undefined}
        onRetry={handleRetry}
        onNewTransaction={handleNewTransaction}
      />
    </>
  )
}

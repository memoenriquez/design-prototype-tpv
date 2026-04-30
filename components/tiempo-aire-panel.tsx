"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Smartphone, Sparkles, Phone, CheckCircle2 } from "lucide-react"
import { useState } from "react"
import { TransactionModal, ConfirmTransactionModal, TransactionStatus, TransactionDetails } from "./transaction-modal"
import { cn } from "@/lib/utils"

const carriers = [
  { id: "telcel", name: "Telcel", color: "#0099D8", initial: "T" },
  { id: "att", name: "AT&T", color: "#009FDB", initial: "AT" },
  { id: "movistar", name: "Movistar", color: "#019DF4", initial: "M" },
  { id: "unefon", name: "Unefon", color: "#E4002B", initial: "U" }
]

const quickAmounts = [20, 30, 50, 100, 150, 200]

interface TiempoAirePanelProps {
  airtimeBalance: number
}

export function TiempoAirePanel({ airtimeBalance }: TiempoAirePanelProps) {
  const [selectedCarrier, setSelectedCarrier] = useState<string | null>(null)
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null)
  const [phoneNumber, setPhoneNumber] = useState("")
  
  // Modal states
  const [showConfirm, setShowConfirm] = useState(false)
  const [showResult, setShowResult] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [transactionStatus, setTransactionStatus] = useState<TransactionStatus>("processing")

  const selectedCarrierData = carriers.find(c => c.id === selectedCarrier)

  const transactionDetails: TransactionDetails = {
    type: "Recarga de Tiempo Aire",
    amount: `$${selectedAmount?.toLocaleString('es-MX') || 0}.00`,
    recipient: phoneNumber ? `${phoneNumber.slice(0,3)} ${phoneNumber.slice(3,6)} ${phoneNumber.slice(6)}` : "",
    commission: "$0.00",
    reference: `TAE-${Date.now().toString().slice(-8)}`,
    date: new Date().toLocaleString('es-MX', { dateStyle: 'medium', timeStyle: 'short' })
  }

  const handleRecharge = () => {
    setShowConfirm(true)
  }

  const handleConfirmTransaction = () => {
    setIsProcessing(true)
    setShowConfirm(false)
    setShowResult(true)
    setTransactionStatus("processing")

    // Simulate processing
    setTimeout(() => {
      setIsProcessing(false)
      // Randomly succeed or fail for demo (90% success rate)
      const success = Math.random() > 0.1
      setTransactionStatus(success ? "success" : "error")
    }, 2500)
  }

  const handleNewTransaction = () => {
    setShowResult(false)
    setPhoneNumber("")
    setSelectedCarrier(null)
    setSelectedAmount(null)
  }

  const handleRetry = () => {
    setTransactionStatus("processing")
    setTimeout(() => {
      setTransactionStatus("success")
    }, 2000)
  }

  const isFormValid = phoneNumber.length === 10 && selectedCarrier && selectedAmount

  return (
    <>
      <div className="flex w-full max-w-full min-w-0 flex-col gap-4 animate-slide-up">
      <Card className="w-full max-w-full min-w-0 overflow-hidden rounded-3xl border-0 shadow-2xl shadow-[#0BBD33]/20">
        <CardHeader className="relative bg-gradient-to-r from-[#0BBD33] via-[#0ec73e] to-[#0BBD33] text-white p-6 overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-8 -right-8 size-24 rounded-full bg-white/10 blur-2xl" />
            <div className="absolute -bottom-4 -left-4 size-20 rounded-full bg-white/10 blur-xl" />
            <div className="absolute inset-0 opacity-20" style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
              backgroundSize: '20px 20px'
            }} />
          </div>
          
          <div className="relative z-10 flex min-w-0 items-center justify-between">
            <div className="flex min-w-0 items-center gap-4">
              <div className="shrink-0 rounded-2xl bg-white/20 p-3 shadow-lg backdrop-blur-sm">
                <Smartphone className="size-6" />
              </div>
              <div className="min-w-0">
                <div className="flex min-w-0 items-center gap-2">
                  <h2 className="truncate text-xl font-bold">Venta de Tiempo Aire</h2>
                  <Sparkles className="size-4 shrink-0 text-white/80" />
                </div>
                <p className="truncate text-sm font-medium text-white/80">
                  Saldo: ${airtimeBalance.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="flex min-w-0 flex-col gap-4 bg-gradient-to-b from-white to-gray-50/50 p-4 sm:gap-5 sm:p-5">
          {/* Phone Number Input */}
          <div className="flex flex-col gap-2.5">
            <label className="text-sm font-semibold text-foreground/80 flex items-center gap-2">
              <Phone className="size-4 text-[#000D94]" />
              Numero de telefono
            </label>
            <div className="relative">
              <Input 
                type="tel" 
                placeholder="Ingresa 10 digitos" 
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                className="h-12 sm:h-14 text-base sm:text-lg font-medium bg-white border-2 border-gray-100 rounded-xl sm:rounded-2xl pl-4 sm:pl-5 pr-10 sm:pr-12 focus:border-[#0BBD33] focus:ring-[#0BBD33]/20 transition-all duration-200 shadow-sm"
                maxLength={10}
              />
              {phoneNumber.length === 10 && (
                <CheckCircle2 className="absolute right-4 top-1/2 size-5 -translate-y-1/2 text-[#0BBD33]" />
              )}
            </div>
            <p className="text-xs text-muted-foreground ml-1">{phoneNumber.length}/10 digitos</p>
          </div>

          {/* Carrier Selection */}
          <div className="flex flex-col gap-2.5">
            <label className="text-sm font-semibold text-foreground/80">Selecciona compania</label>
            <div className="grid min-w-0 grid-cols-4 gap-2 sm:gap-3">
              {carriers.map((carrier) => (
                <button
                  key={carrier.id}
                  type="button"
                  aria-pressed={selectedCarrier === carrier.id}
                  onClick={() => setSelectedCarrier(carrier.id)}
                  className={cn(
                    "flex min-w-0 flex-col items-center gap-1.5 rounded-xl border-2 p-2 transition-all duration-200 sm:gap-2 sm:rounded-2xl sm:p-3 touch-target",
                    selectedCarrier === carrier.id
                      ? "scale-[1.02] border-[#0BBD33] bg-[#0BBD33]/5 shadow-lg shadow-[#0BBD33]/20 sm:scale-105"
                      : "border-gray-100 bg-white active:border-gray-200 active:shadow-md"
                  )}
                >
                  <div 
                    className="flex size-10 items-center justify-center rounded-lg text-xs font-bold text-white shadow-lg transition-transform duration-200 sm:size-12 sm:rounded-xl sm:text-sm"
                    style={{ 
                      backgroundColor: carrier.color,
                      boxShadow: selectedCarrier === carrier.id ? `0 8px 20px ${carrier.color}40` : undefined
                    }}
                  >
                    {carrier.initial}
                  </div>
                  <span
                    className={cn(
                      "max-w-full truncate text-center text-[10px] font-medium transition-colors sm:text-xs",
                      selectedCarrier === carrier.id ? "text-[#0BBD33]" : "text-muted-foreground"
                    )}
                  >
                    {carrier.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Quick Amount Selection */}
          <div className="flex flex-col gap-2.5">
            <label className="text-sm font-semibold text-foreground/80">Selecciona monto</label>
            <div className="grid min-w-0 grid-cols-3 gap-2 sm:gap-3">
              {quickAmounts.map((amount) => (
                <Button
                  key={amount}
                  type="button"
                  aria-pressed={selectedAmount === amount}
                  variant="outline"
                  onClick={() => setSelectedAmount(amount)}
                  className={cn(
                    "h-11 min-w-0 rounded-xl text-base font-bold transition-all duration-200 sm:h-14 sm:rounded-2xl sm:text-lg touch-target",
                    selectedAmount === amount
                      ? "scale-[1.02] border-[#0BBD33] bg-[#0BBD33] text-white shadow-lg shadow-[#0BBD33]/30 hover:bg-[#0BBD33] hover:text-white sm:scale-105"
                      : "border-2 border-gray-100 bg-white active:border-[#0BBD33] active:bg-[#0BBD33]/5"
                  )}
                >
                  ${amount}
                </Button>
              ))}
            </div>
          </div>

          {/* Confirm Button */}
          <Button 
            className="w-full h-12 sm:h-14 bg-gradient-to-r from-[#0BBD33] to-[#099a2a] hover:from-[#0aa82e] hover:to-[#088a25] text-white rounded-xl sm:rounded-2xl font-bold text-base sm:text-lg shadow-xl shadow-[#0BBD33]/30 transition-all duration-300 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!isFormValid}
            onClick={handleRecharge}
          >
            <Sparkles data-icon="inline-start" />
            Recargar ${selectedAmount || 0}
          </Button>
        </CardContent>
      </Card>
      </div>

      {/* Confirmation Modal */}
      <ConfirmTransactionModal
        open={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleConfirmTransaction}
        title={`Recarga ${selectedCarrierData?.name || ""}`}
        details={transactionDetails}
        isLoading={isProcessing}
      />

      {/* Result Modal */}
      <TransactionModal
        open={showResult}
        onClose={() => setShowResult(false)}
        status={transactionStatus}
        title={
          transactionStatus === "success" ? "Recarga Exitosa" :
          transactionStatus === "error" ? "Recarga Fallida" :
          "Procesando Recarga..."
        }
        message={
          transactionStatus === "success" ? `Se recargaron $${selectedAmount} a ${phoneNumber}` :
          transactionStatus === "error" ? "No se pudo completar la recarga. Intenta nuevamente." :
          "Por favor espere mientras procesamos su recarga"
        }
        details={transactionStatus !== "processing" ? transactionDetails : undefined}
        onRetry={handleRetry}
        onNewTransaction={handleNewTransaction}
      />
    </>
  )
}

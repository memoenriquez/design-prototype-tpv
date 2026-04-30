"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Smartphone, Sparkles, Phone, CheckCircle2, Loader2 } from "lucide-react"
import { useState } from "react"
import { TransactionModal, ConfirmTransactionModal, TransactionStatus, TransactionDetails } from "./transaction-modal"

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
      <Card className="border-0 shadow-2xl shadow-[#0BBD33]/20 rounded-3xl overflow-hidden animate-scale-in w-full max-w-full">
        <CardHeader className="relative bg-gradient-to-r from-[#0BBD33] via-[#0ec73e] to-[#0BBD33] text-white p-6 overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-8 -right-8 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
            <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-white/10 rounded-full blur-xl" />
            <div className="absolute inset-0 opacity-20" style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
              backgroundSize: '20px 20px'
            }} />
          </div>
          
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-3 shadow-lg">
                <Smartphone className="h-6 w-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold">Venta de Tiempo Aire</h2>
                  <Sparkles className="h-4 w-4 text-white/80" />
                </div>
                <p className="text-white/80 text-sm font-medium">
                  Saldo: ${airtimeBalance.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-4 sm:p-5 space-y-4 sm:space-y-5 bg-gradient-to-b from-white to-gray-50/50">
          {/* Phone Number Input */}
          <div className="space-y-2.5">
            <label className="text-sm font-semibold text-foreground/80 flex items-center gap-2">
              <Phone className="h-4 w-4 text-[#000D94]" />
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
                <CheckCircle2 className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#0BBD33]" />
              )}
            </div>
            <p className="text-xs text-muted-foreground ml-1">{phoneNumber.length}/10 digitos</p>
          </div>

          {/* Carrier Selection */}
          <div className="space-y-2.5">
            <label className="text-sm font-semibold text-foreground/80">Selecciona compania</label>
            <div className="grid grid-cols-4 gap-2 sm:gap-3">
              {carriers.map((carrier) => (
                <button
                  key={carrier.id}
                  onClick={() => setSelectedCarrier(carrier.id)}
                  className={`flex flex-col items-center gap-1.5 sm:gap-2 p-2 sm:p-3 rounded-xl sm:rounded-2xl border-2 transition-all duration-200 touch-target ${
                    selectedCarrier === carrier.id 
                      ? 'border-[#0BBD33] bg-[#0BBD33]/5 shadow-lg shadow-[#0BBD33]/20 scale-[1.02] sm:scale-105' 
                      : 'border-gray-100 bg-white active:border-gray-200 active:shadow-md'
                  }`}
                >
                  <div 
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl flex items-center justify-center text-white text-xs sm:text-sm font-bold shadow-lg transition-transform duration-200"
                    style={{ 
                      backgroundColor: carrier.color,
                      boxShadow: selectedCarrier === carrier.id ? `0 8px 20px ${carrier.color}40` : undefined
                    }}
                  >
                    {carrier.initial}
                  </div>
                  <span className={`text-[10px] sm:text-xs font-medium transition-colors text-center ${
                    selectedCarrier === carrier.id ? 'text-[#0BBD33]' : 'text-muted-foreground'
                  }`}>
                    {carrier.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Quick Amount Selection */}
          <div className="space-y-2.5">
            <label className="text-sm font-semibold text-foreground/80">Selecciona monto</label>
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              {quickAmounts.map((amount) => (
                <Button
                  key={amount}
                  variant="outline"
                  onClick={() => setSelectedAmount(amount)}
                  className={`h-11 sm:h-14 rounded-xl sm:rounded-2xl font-bold text-base sm:text-lg transition-all duration-200 touch-target ${
                    selectedAmount === amount 
                      ? 'border-[#0BBD33] bg-[#0BBD33] text-white shadow-lg shadow-[#0BBD33]/30 scale-[1.02] sm:scale-105 hover:bg-[#0BBD33] hover:text-white' 
                      : 'border-2 border-gray-100 active:border-[#0BBD33] active:bg-[#0BBD33]/5 bg-white'
                  }`}
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
            <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
            Recargar ${selectedAmount || 0}
          </Button>
        </CardContent>
      </Card>

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

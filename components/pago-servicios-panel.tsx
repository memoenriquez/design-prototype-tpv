"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { 
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import { 
  Search,
  Zap,
  Droplets,
  Tv,
  Wifi,
  Phone,
  Building2,
  Car,
  Shield,
  ChevronRight,
  Star,
  Loader2,
  CheckCircle2
} from "lucide-react"
import { CloseButton } from "@/components/ui/close-button"
import { TransactionModal, TransactionStatus, TransactionDetails } from "./transaction-modal"

interface ServiceCategory {
  id: string
  name: string
  icon: React.ReactNode
  color: string
  services: string[]
  popular?: boolean
}

const serviceCategories: ServiceCategory[] = [
  {
    id: "cfe",
    name: "CFE Luz",
    icon: <Zap className="h-6 w-6" />,
    color: "from-yellow-400 to-orange-500",
    services: ["CFE Domestico", "CFE Comercial"],
    popular: true
  },
  {
    id: "agua",
    name: "Agua",
    icon: <Droplets className="h-6 w-6" />,
    color: "from-blue-400 to-cyan-500",
    services: ["JMAS", "CESPE", "SIAPA"]
  },
  {
    id: "tv",
    name: "TV Cable",
    icon: <Tv className="h-6 w-6" />,
    color: "from-purple-400 to-pink-500",
    services: ["SKY", "Dish", "Izzi TV", "TotalPlay"],
    popular: true
  },
  {
    id: "internet",
    name: "Internet",
    icon: <Wifi className="h-6 w-6" />,
    color: "from-green-400 to-emerald-500",
    services: ["Telmex", "Izzi", "TotalPlay", "Megacable"]
  },
  {
    id: "telefono",
    name: "Telefono",
    icon: <Phone className="h-6 w-6" />,
    color: "from-indigo-400 to-blue-500",
    services: ["Telmex Fijo", "AT&T Fijo"]
  },
  {
    id: "predial",
    name: "Predial",
    icon: <Building2 className="h-6 w-6" />,
    color: "from-gray-400 to-slate-500",
    services: ["Predial Municipal", "Tenencia"]
  },
  {
    id: "auto",
    name: "Telepeaje",
    icon: <Car className="h-6 w-6" />,
    color: "from-teal-400 to-cyan-500",
    services: ["TAG IAVE", "PASE", "Televia"],
    popular: true
  },
  {
    id: "seguros",
    name: "Seguros",
    icon: <Shield className="h-6 w-6" />,
    color: "from-red-400 to-rose-500",
    services: ["GNP", "AXA", "Qualitas"]
  }
]

interface PagoServiciosPanelProps {
  onBack?: () => void
}

export function PagoServiciosPanel({ onBack }: PagoServiciosPanelProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory | null>(null)
  const [showCategorySheet, setShowCategorySheet] = useState(false)
  const [selectedService, setSelectedService] = useState<string | null>(null)
  
  // Payment form state
  const [showPaymentForm, setShowPaymentForm] = useState(false)
  const [serviceReference, setServiceReference] = useState("")
  const [paymentAmount, setPaymentAmount] = useState("")
  const [isSearchingRef, setIsSearchingRef] = useState(false)
  const [refFound, setRefFound] = useState(false)
  
  // Transaction modal states
  const [showResult, setShowResult] = useState(false)
  const [transactionStatus, setTransactionStatus] = useState<TransactionStatus>("processing")

  const filteredCategories = serviceCategories.filter(cat =>
    cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cat.services.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  const handleCategorySelect = (category: ServiceCategory) => {
    setSelectedCategory(category)
    setShowCategorySheet(true)
  }

  const handleServiceSelect = (service: string) => {
    setSelectedService(service)
    setShowCategorySheet(false)
    setShowPaymentForm(true)
    setRefFound(false)
    setServiceReference("")
    setPaymentAmount("")
  }

  const handleSearchReference = () => {
    if (serviceReference.length < 8) return
    setIsSearchingRef(true)
    // Simulate API lookup
    setTimeout(() => {
      setIsSearchingRef(false)
      setRefFound(true)
      // Mock amount found
      setPaymentAmount((Math.random() * 1000 + 100).toFixed(2))
    }, 1500)
  }

  const handlePayService = () => {
    setShowPaymentForm(false)
    setShowResult(true)
    setTransactionStatus("processing")
    
    setTimeout(() => {
      const success = Math.random() > 0.1
      setTransactionStatus(success ? "success" : "error")
    }, 2500)
  }

  const transactionDetails: TransactionDetails = {
    type: `Pago ${selectedService}`,
    amount: `$${parseFloat(paymentAmount || "0").toLocaleString('es-MX', { minimumFractionDigits: 2 })}`,
    recipient: serviceReference,
    commission: "$0.00",
    reference: `SRV-${Date.now().toString().slice(-8)}`,
    date: new Date().toLocaleString('es-MX', { dateStyle: 'medium', timeStyle: 'short' })
  }

  const handleNewTransaction = () => {
    setShowResult(false)
    setSelectedService(null)
    setSelectedCategory(null)
  }

  const handleCloseSheet = () => {
    setShowCategorySheet(false)
    // Small delay before clearing the category for smooth animation
    setTimeout(() => setSelectedCategory(null), 200)
  }

  return (
    <>
      <div className="space-y-4 animate-slide-up w-full max-w-full overflow-hidden box-border">
        <Card className="border-0 shadow-xl shadow-[#000D94]/5 overflow-hidden w-full box-border">
          <CardHeader className="bg-gradient-to-r from-[#000D94] to-[#1a2eb8] text-white p-3 sm:p-4 pb-4 sm:pb-6">
            <div className="flex items-center justify-between mb-2 sm:mb-3 gap-2">
              <div className="min-w-0 flex-1">
                <p className="text-white/70 text-[10px] sm:text-xs font-medium">Pago de servicios</p>
                <h3 className="text-base sm:text-lg font-bold">+100 Servicios</h3>
              </div>
              <Badge className="bg-white/20 text-white border-0 text-[10px] sm:text-xs shrink-0">
                Sin comision
              </Badge>
            </div>
            
            {/* Search */}
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 sm:h-4 sm:w-4 text-white/50" />
              <Input
                type="text"
                placeholder="Buscar servicio..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 sm:pl-10 h-10 sm:h-11 bg-white/10 border-white/20 text-white placeholder:text-white/50 rounded-xl focus:ring-white/30 text-sm"
              />
            </div>
          </CardHeader>
          
          <CardContent className="p-3 sm:p-4 overflow-hidden w-full box-border">
            {/* Popular Services */}
            <div className="mb-3 sm:mb-4">
              <div className="flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3">
                <Star className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-yellow-500 fill-yellow-500 shrink-0" />
                <span className="text-xs sm:text-sm font-semibold text-foreground/80">Populares</span>
              </div>
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide max-w-full">
                {serviceCategories.filter(c => c.popular).map((category) => (
                  <button
                    key={category.id}
                    onClick={() => handleCategorySelect(category)}
                    className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-gray-50 to-gray-100 rounded-full whitespace-nowrap text-xs sm:text-sm font-medium text-foreground/80 active:shadow-md transition-all duration-200 active:-translate-y-0.5 flex-shrink-0 touch-target"
                  >
                    <div className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-gradient-to-br ${category.color} flex items-center justify-center text-white scale-75 [&>svg]:w-3 [&>svg]:h-3 sm:[&>svg]:w-4 sm:[&>svg]:h-4`}>
                      {category.icon}
                    </div>
                    {category.name}
                  </button>
                ))}
              </div>
            </div>

            {/* All Categories Grid */}
            <div className="grid grid-cols-2 gap-2 sm:gap-3 w-full">
              {filteredCategories.map((category, index) => (
                <button
                  key={category.id}
                  onClick={() => handleCategorySelect(category)}
                  className="group p-3 sm:p-4 bg-gradient-to-br from-white to-gray-50 rounded-xl sm:rounded-2xl border border-gray-100 active:border-[#000D94]/20 active:shadow-lg transition-all duration-300 text-left relative animate-scale-in touch-target overflow-hidden min-w-0"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center text-white mb-2 sm:mb-3 group-active:scale-110 transition-transform duration-300 shadow-lg [&>svg]:w-5 [&>svg]:h-5 sm:[&>svg]:w-6 sm:[&>svg]:h-6`}>
                    {category.icon}
                  </div>
                  <h4 className="font-semibold text-foreground text-xs sm:text-sm mb-0.5 sm:mb-1 truncate">{category.name}</h4>
                  <p className="text-[10px] sm:text-xs text-muted-foreground">{category.services.length} servicios</p>
                  <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 text-[#000D94] opacity-0 group-active:opacity-100 transition-opacity absolute top-3 right-3 sm:top-4 sm:right-4" />
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Category Services Sheet (Bottom Drawer) */}
      <Sheet open={showCategorySheet} onOpenChange={setShowCategorySheet}>
        <SheetContent 
          side="bottom" 
          className="rounded-t-3xl border-0 px-0 pb-8 max-h-[70vh] overflow-hidden"
        >
          {selectedCategory && (
            <>
              {/* Header with gradient background */}
              <div className={`bg-gradient-to-r ${selectedCategory.color} text-white px-4 sm:px-6 pt-2 pb-4 sm:pb-5 -mt-6`}>
                {/* Drag handle */}
                <div className="flex justify-center mb-3">
                  <div className="w-12 h-1.5 rounded-full bg-white/30" />
                </div>
                
                <SheetHeader className="text-left">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg [&>svg]:w-5 [&>svg]:h-5 sm:[&>svg]:w-7 sm:[&>svg]:h-7">
                      {selectedCategory.icon}
                    </div>
                    <div className="min-w-0 flex-1">
                      <SheetTitle className="text-white text-lg sm:text-xl font-bold">
                        {selectedCategory.name}
                      </SheetTitle>
                      <SheetDescription className="text-white/70 text-xs sm:text-sm">
                        Selecciona el servicio a pagar
                      </SheetDescription>
                    </div>
                    <CloseButton 
                      onAction={handleCloseSheet}
                      buttonStyle="glass"
                      size="md"
                    />
                  </div>
                </SheetHeader>
              </div>
              
              {/* Services List */}
              <div className="px-4 sm:px-6 pt-4 sm:pt-5 overflow-y-auto max-h-[calc(70vh-120px)]">
                <div className="space-y-2 sm:space-y-3">
                  {selectedCategory.services.map((service, index) => (
                    <button
                      key={service}
                      onClick={() => handleServiceSelect(service)}
                      className="w-full p-3.5 sm:p-4 bg-white border border-gray-100 hover:border-gray-200 active:bg-gray-50 rounded-xl sm:rounded-2xl text-left flex items-center justify-between transition-all duration-200 group touch-target shadow-sm hover:shadow-md animate-slide-up"
                      style={{ animationDelay: `${index * 0.05}s` }}
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-br ${selectedCategory.color} opacity-20 flex items-center justify-center shrink-0`}>
                          <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />
                        </div>
                        <div className="min-w-0">
                          <span className="font-semibold text-foreground text-sm sm:text-base block truncate">{service}</span>
                          <span className="text-[10px] sm:text-xs text-muted-foreground">Pago inmediato</span>
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 text-gray-300 group-hover:text-[#000D94] group-hover:translate-x-1 transition-all shrink-0" />
                    </button>
                  ))}
                </div>
                
                {/* Footer note */}
                <p className="text-center text-[10px] sm:text-xs text-muted-foreground mt-4 sm:mt-6 pb-4">
                  Todos los pagos se procesan de forma segura
                </p>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* Payment Form Dialog */}
      <Dialog open={showPaymentForm} onOpenChange={setShowPaymentForm}>
        <DialogContent className="w-[calc(100%-2rem)] max-w-[380px] sm:max-w-md bg-white border-0 rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6">
          <DialogHeader className="text-center pb-2">
            <DialogTitle className="text-base sm:text-xl font-bold text-[#000D94]">
              {selectedService}
            </DialogTitle>
            <DialogDescription className="text-xs sm:text-sm text-gray-500">
              Ingresa los datos para realizar el pago
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 sm:space-y-4 py-3 sm:py-4">
            {/* Reference Input */}
            <div className="space-y-1.5 sm:space-y-2">
              <label className="text-xs sm:text-sm font-medium text-gray-700">Numero de referencia o contrato</label>
              <div className="flex gap-2">
                <Input
                  type="text"
                  placeholder="Ej: 123456789012"
                  value={serviceReference}
                  onChange={(e) => {
                    setServiceReference(e.target.value)
                    setRefFound(false)
                  }}
                  className="flex-1 h-10 sm:h-12 rounded-lg sm:rounded-xl border-gray-200 focus:border-[#000D94] focus:ring-[#000D94]/20 text-sm"
                />
                <Button
                  onClick={handleSearchReference}
                  disabled={serviceReference.length < 8 || isSearchingRef}
                  className="h-10 sm:h-12 px-3 sm:px-4 bg-[#000D94] hover:bg-[#000D94]/90 rounded-lg sm:rounded-xl"
                >
                  {isSearchingRef ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Search className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            {/* Amount Display (after reference found) */}
            {refFound && (
              <div className="bg-gray-50 rounded-xl sm:rounded-2xl p-3 sm:p-4 space-y-2 sm:space-y-3 animate-scale-in">
                <div className="flex justify-between items-center">
                  <span className="text-xs sm:text-sm text-gray-500">Titular</span>
                  <span className="text-xs sm:text-sm font-medium text-gray-900 truncate ml-2">Juan Martinez Lopez</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs sm:text-sm text-gray-500">Referencia</span>
                  <span className="text-xs sm:text-sm font-mono text-gray-600 truncate ml-2">{serviceReference}</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                  <span className="text-xs sm:text-sm font-medium text-gray-700">Monto a pagar</span>
                  <span className="text-lg sm:text-xl font-bold text-[#0BBD33]">
                    ${parseFloat(paymentAmount).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-2 sm:gap-3 pt-2">
              <Button
                variant="outline"
                className="flex-1 h-10 sm:h-12 rounded-lg sm:rounded-xl border-gray-200 text-xs sm:text-sm"
                onClick={() => setShowPaymentForm(false)}
              >
                Cancelar
              </Button>
              <Button
                className="flex-1 h-10 sm:h-12 bg-[#0BBD33] hover:bg-[#0BBD33]/90 rounded-lg sm:rounded-xl text-white text-xs sm:text-sm"
                disabled={!refFound}
                onClick={handlePayService}
              >
                Pagar Servicio
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Result Modal */}
      <TransactionModal
        open={showResult}
        onClose={() => setShowResult(false)}
        status={transactionStatus}
        title={
          transactionStatus === "success" ? "Pago Exitoso" :
          transactionStatus === "error" ? "Pago Fallido" :
          "Procesando Pago..."
        }
        message={
          transactionStatus === "success" ? `Pago de ${selectedService} completado` :
          transactionStatus === "error" ? "No se pudo procesar el pago. Intente nuevamente." :
          "Conectando con el proveedor de servicios..."
        }
        details={transactionStatus !== "processing" ? transactionDetails : undefined}
        onRetry={() => {
          setTransactionStatus("processing")
          setTimeout(() => setTransactionStatus("success"), 2000)
        }}
        onNewTransaction={handleNewTransaction}
      />
    </>
  )
}

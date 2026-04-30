"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
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
import { cn } from "@/lib/utils"

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
    icon: <Zap className="size-6" />,
    color: "from-yellow-400 to-orange-500",
    services: ["CFE Domestico", "CFE Comercial"],
    popular: true
  },
  {
    id: "agua",
    name: "Agua",
    icon: <Droplets className="size-6" />,
    color: "from-blue-400 to-cyan-500",
    services: ["JMAS", "CESPE", "SIAPA"]
  },
  {
    id: "tv",
    name: "TV Cable",
    icon: <Tv className="size-6" />,
    color: "from-purple-400 to-pink-500",
    services: ["SKY", "Dish", "Izzi TV", "TotalPlay"],
    popular: true
  },
  {
    id: "internet",
    name: "Internet",
    icon: <Wifi className="size-6" />,
    color: "from-green-400 to-emerald-500",
    services: ["Telmex", "Izzi", "TotalPlay", "Megacable"]
  },
  {
    id: "telefono",
    name: "Telefono",
    icon: <Phone className="size-6" />,
    color: "from-indigo-400 to-blue-500",
    services: ["Telmex Fijo", "AT&T Fijo"]
  },
  {
    id: "predial",
    name: "Predial",
    icon: <Building2 className="size-6" />,
    color: "from-gray-400 to-slate-500",
    services: ["Predial Municipal", "Tenencia"]
  },
  {
    id: "auto",
    name: "Telepeaje",
    icon: <Car className="size-6" />,
    color: "from-teal-400 to-cyan-500",
    services: ["TAG IAVE", "PASE", "Televia"],
    popular: true
  },
  {
    id: "seguros",
    name: "Seguros",
    icon: <Shield className="size-6" />,
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
      <div className="flex w-full max-w-full flex-col gap-4 overflow-hidden box-border animate-slide-up">
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
              <Search className="absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-white/50 sm:size-4" />
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
                    <div className={cn("flex size-5 scale-75 items-center justify-center rounded-full bg-gradient-to-br text-white [&>svg]:size-3 sm:size-6 sm:[&>svg]:size-4", category.color)}>
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
                  <div className={cn("mb-2 flex size-10 items-center justify-center rounded-lg bg-gradient-to-br text-white shadow-lg transition-transform duration-300 group-active:scale-110 sm:mb-3 sm:size-12 sm:rounded-xl [&>svg]:size-5 sm:[&>svg]:size-6", category.color)}>
                    {category.icon}
                  </div>
                  <h4 className="font-semibold text-foreground text-xs sm:text-sm mb-0.5 sm:mb-1 truncate">{category.name}</h4>
                  <p className="text-[10px] sm:text-xs text-muted-foreground">{category.services.length} servicios</p>
                  <ChevronRight className="absolute top-3 right-3 size-3 text-[#000D94] opacity-0 transition-opacity group-active:opacity-100 sm:top-4 sm:right-4 sm:size-4" />
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
          showCloseButton={false}
          className="rounded-t-3xl border-0 px-0 pb-8 max-h-[70vh] overflow-hidden"
        >
          {selectedCategory && (
            <>
              {/* Header with gradient background */}
              <div className={cn("-mt-6 bg-gradient-to-r px-4 pt-2 pb-4 text-white sm:px-6 sm:pb-5", selectedCategory.color)}>
                {/* Drag handle */}
                <div className="flex justify-center mb-3">
                  <div className="h-1.5 w-12 rounded-full bg-white/30" />
                </div>
                
                <SheetHeader className="text-left">
                  <div className="flex items-center gap-3">
                    <div className="flex size-11 items-center justify-center rounded-xl bg-white/20 shadow-lg backdrop-blur-sm sm:size-14 sm:rounded-2xl [&>svg]:size-5 sm:[&>svg]:size-7">
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
                <div className="flex flex-col gap-2 sm:gap-3">
                  {selectedCategory.services.map((service, index) => (
                    <button
                      key={service}
                      onClick={() => handleServiceSelect(service)}
                      className="w-full p-3.5 sm:p-4 bg-white border border-gray-100 hover:border-gray-200 active:bg-gray-50 rounded-xl sm:rounded-2xl text-left flex items-center justify-between transition-all duration-200 group touch-target shadow-sm hover:shadow-md animate-slide-up"
                      style={{ animationDelay: `${index * 0.05}s` }}
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className={cn("flex size-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br opacity-20 sm:size-10 sm:rounded-xl", selectedCategory.color)}>
                          <CheckCircle2 className="size-4 text-gray-700 sm:size-5" />
                        </div>
                        <div className="min-w-0">
                          <span className="font-semibold text-foreground text-sm sm:text-base block truncate">{service}</span>
                          <span className="text-[10px] sm:text-xs text-muted-foreground">Pago inmediato</span>
                        </div>
                      </div>
                      <ChevronRight className="size-4 shrink-0 text-gray-300 transition-all group-hover:translate-x-1 group-hover:text-[#000D94] sm:size-5" />
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

          <div className="flex flex-col gap-3 py-3 sm:gap-4 sm:py-4">
            {/* Reference Input */}
            <div className="flex flex-col gap-1.5 sm:gap-2">
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
                    <Loader2 className="animate-spin" data-icon="inline-start" />
                  ) : (
                    <Search data-icon="inline-start" />
                  )}
                </Button>
              </div>
            </div>

            {/* Amount Display (after reference found) */}
            {refFound && (
              <div className="flex flex-col gap-2 rounded-xl bg-gray-50 p-3 animate-scale-in sm:gap-3 sm:rounded-2xl sm:p-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs sm:text-sm text-gray-500">Titular</span>
                  <span className="text-xs sm:text-sm font-medium text-gray-900 truncate ml-2">Juan Martinez Lopez</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs sm:text-sm text-gray-500">Referencia</span>
                  <span className="text-xs sm:text-sm font-mono text-gray-600 truncate ml-2">{serviceReference}</span>
                </div>
                <Separator />
                <div className="flex justify-between items-center pt-2">
                  <span className="text-xs sm:text-sm font-medium text-gray-700">Monto a pagar</span>
                  <span className="text-lg sm:text-xl font-bold text-[#0BBD33]">
                    ${parseFloat(paymentAmount).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <DialogFooter className="flex-row gap-2 pt-2 sm:gap-3">
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
            </DialogFooter>
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

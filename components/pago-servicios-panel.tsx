"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BrandLogo } from "@/components/brand-logo"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field"
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
  CheckCircle2,
  Clock,
  AlertCircle
} from "lucide-react"
import { CloseButton } from "@/components/ui/close-button"
import { ConfirmTransactionModal, TransactionModal, TransactionStatus, TransactionDetails } from "./transaction-modal"
import { BrandLogoKey, brandLogos } from "@/lib/brand-logos"
import { useTransactions } from "@/contexts/transactions-context"
import { formatMoney } from "@/lib/formatters"
import { cn } from "@/lib/utils"

interface ServiceProvider {
  id: string
  name: string
  logoKey: BrandLogoKey
}

interface ServiceCategory {
  id: string
  name: string
  icon: React.ReactNode
  services: ServiceProvider[]
  popular?: boolean
}

interface ProviderPreValidation {
  billAmount: number
  serviceFee: number
  customerTotal: number
  expiresAt: number
}

const serviceProvider = (id: string, name: string, logoKey: BrandLogoKey): ServiceProvider => ({
  id,
  name,
  logoKey,
})

const serviceCategories: ServiceCategory[] = [
  {
    id: "cfe",
    name: "CFE Luz",
    icon: <Zap className="size-6" />,
    services: [
      serviceProvider("cfe-domestico", "CFE Doméstico", "cfe"),
      serviceProvider("cfe-comercial", "CFE Comercial", "cfe"),
    ],
    popular: true
  },
  {
    id: "agua",
    name: "Agua",
    icon: <Droplets className="size-6" />,
    services: [
      serviceProvider("jmas", "JMAS", "jmas"),
      serviceProvider("cespe", "CESPE", "cespe"),
      serviceProvider("siapa", "SIAPA", "siapa"),
    ]
  },
  {
    id: "tv",
    name: "TV Cable",
    icon: <Tv className="size-6" />,
    services: [
      serviceProvider("sky", "SKY", "sky"),
      serviceProvider("dish", "Dish", "dish"),
      serviceProvider("izzi-tv", "Izzi TV", "izzi"),
      serviceProvider("totalplay-tv", "TotalPlay", "totalplay"),
    ],
    popular: true
  },
  {
    id: "internet",
    name: "Internet",
    icon: <Wifi className="size-6" />,
    services: [
      serviceProvider("telmex-internet", "Telmex", "telmex"),
      serviceProvider("izzi-internet", "Izzi", "izzi"),
      serviceProvider("totalplay-internet", "TotalPlay", "totalplay"),
      serviceProvider("megacable-internet", "Megacable", "megacable"),
    ]
  },
  {
    id: "telefono",
    name: "Teléfono",
    icon: <Phone className="size-6" />,
    services: [
      serviceProvider("telmex-fijo", "Telmex Fijo", "telmex"),
      serviceProvider("att-fijo", "AT&T Fijo", "att"),
    ]
  },
  {
    id: "predial",
    name: "Predial",
    icon: <Building2 className="size-6" />,
    services: [
      serviceProvider("predial-municipal", "Predial Municipal", "cfe"),
      serviceProvider("tenencia", "Tenencia", "pase"),
    ]
  },
  {
    id: "auto",
    name: "Autos y tags",
    icon: <Car className="size-6" />,
    services: [
      serviceProvider("tag-iave", "TAG IAVE", "tag-iave"),
      serviceProvider("pase", "PASE", "pase"),
      serviceProvider("televia", "Televia", "televia"),
    ],
    popular: true
  },
  {
    id: "seguros",
    name: "Seguros",
    icon: <Shield className="size-6" />,
    services: [
      serviceProvider("gnp", "GNP", "gnp"),
      serviceProvider("axa", "AXA", "axa"),
      serviceProvider("qualitas", "Qualitas", "qualitas"),
    ]
  }
]

const providerPreValidationDurationMs = 2 * 60 * 1000

const createProviderPreValidation = (): ProviderPreValidation => {
  const billAmount = Number((Math.random() * 1000 + 100).toFixed(2))
  const serviceFee = 12

  return {
    billAmount,
    serviceFee,
    customerTotal: billAmount + serviceFee,
    expiresAt: Date.now() + providerPreValidationDurationMs,
  }
}

interface PagoServiciosPanelProps {
  onBack?: () => void
}

export function PagoServiciosPanel({ onBack }: PagoServiciosPanelProps) {
  const { addTransaction } = useTransactions()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory | null>(null)
  const [showCategorySheet, setShowCategorySheet] = useState(false)
  const [selectedService, setSelectedService] = useState<ServiceProvider | null>(null)
  
  // Payment form state
  const [showPaymentForm, setShowPaymentForm] = useState(false)
  const [serviceReference, setServiceReference] = useState("")
  const [isSearchingRef, setIsSearchingRef] = useState(false)
  const [providerPreValidation, setProviderPreValidation] = useState<ProviderPreValidation | null>(null)
  const [currentTime, setCurrentTime] = useState(Date.now())
  
  // Transaction modal states
  const [showConfirm, setShowConfirm] = useState(false)
  const [showResult, setShowResult] = useState(false)
  const [transactionStatus, setTransactionStatus] = useState<TransactionStatus>("processing")

  const filteredCategories = serviceCategories.filter(cat =>
    cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cat.services.some(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()))
  )
  const isProviderPreValidationExpired = Boolean(
    providerPreValidation && providerPreValidation.expiresAt <= currentTime
  )
  const hasActiveProviderPreValidation = Boolean(providerPreValidation && !isProviderPreValidationExpired)
  const providerPreValidationExpiryLabel = providerPreValidation
    ? new Date(providerPreValidation.expiresAt).toLocaleTimeString("es-MX", {
        hour: "2-digit",
        minute: "2-digit",
      })
    : ""

  useEffect(() => {
    if (!providerPreValidation || !showPaymentForm) return

    const intervalId = window.setInterval(() => {
      setCurrentTime(Date.now())
    }, 1000)

    return () => window.clearInterval(intervalId)
  }, [providerPreValidation, showPaymentForm])

  const handleCategorySelect = (category: ServiceCategory) => {
    setSelectedCategory(category)
    setShowCategorySheet(true)
  }

  const handleServiceSelect = (service: ServiceProvider) => {
    setSelectedService(service)
    setShowCategorySheet(false)
    setShowPaymentForm(true)
    setProviderPreValidation(null)
    setServiceReference("")
    setCurrentTime(Date.now())
  }

  const handleSearchReference = () => {
    if (serviceReference.length < 8) return
    setIsSearchingRef(true)
    // Simulate API lookup
    setTimeout(() => {
      setIsSearchingRef(false)
      setProviderPreValidation(createProviderPreValidation())
      setCurrentTime(Date.now())
    }, 1500)
  }

  const handlePayService = () => {
    if (!hasActiveProviderPreValidation) return

    setShowPaymentForm(false)
    setShowConfirm(true)
  }

  const handleConfirmServicePayment = () => {
    setShowConfirm(false)
    setShowResult(true)
    setTransactionStatus("processing")
    
    setTimeout(() => {
      const success = Math.random() > 0.1
      setTransactionStatus(success ? "success" : "error")
      if (success) {
        addTransaction({
          type: selectedCategory?.id === "auto" ? "telepeaje" : "servicio",
          description: `Pago ${selectedService?.name || "servicio"}`,
          amount: providerPreValidation?.customerTotal || 0,
          reference: transactionDetails.reference,
        })
      }
    }, 2500)
  }

  const transactionDetails: TransactionDetails = {
    type: `Pago ${selectedService?.name || ""}`,
    amount: formatMoney(providerPreValidation?.customerTotal || 0),
    recipient: serviceReference,
    commission: formatMoney(providerPreValidation?.serviceFee || 0),
    reference: `SRV-${Date.now().toString().slice(-8)}`,
    date: new Date().toLocaleString('es-MX', { dateStyle: 'medium', timeStyle: 'short' })
  }

  const handleNewTransaction = () => {
    setShowResult(false)
    setSelectedService(null)
    setSelectedCategory(null)
    setServiceReference("")
    setProviderPreValidation(null)
  }

  const handleCloseSheet = () => {
    setShowCategorySheet(false)
    // Small delay before clearing the category for smooth animation
    setTimeout(() => setSelectedCategory(null), 200)
  }

  return (
    <>
      <div className="flex w-full max-w-full min-w-0 flex-col gap-4 box-border animate-slide-up">
        <Card className="w-full min-w-0 overflow-hidden border-0 shadow-xl box-border" style={{ boxShadow: "0 20px 40px rgba(var(--theme-primary-rgb), 0.08)" }}>
          <CardHeader
            className="p-3 pb-4 text-white sm:p-4 sm:pb-6"
            style={{ background: "linear-gradient(135deg, var(--theme-primary), rgba(var(--theme-primary-rgb), 0.9))" }}
          >
            <div className="flex items-center justify-between mb-2 sm:mb-3 gap-2">
              <div className="min-w-0 flex-1">
                <p className="text-white/70 text-[10px] sm:text-xs font-medium">Pago de servicios</p>
                <h3 className="text-base sm:text-lg font-bold">+100 Servicios</h3>
              </div>
              <Badge className="bg-white/20 text-white border-0 text-[10px] sm:text-xs shrink-0">
                Sin comisión
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
          
          <CardContent className="w-full min-w-0 overflow-x-hidden p-3 sm:p-4 box-border">
            {/* Popular Services */}
            <div className="mb-3 sm:mb-4">
              <div className="flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3">
                <Star className="size-3.5 shrink-0 fill-current sm:size-4" style={{ color: "var(--theme-secondary)" }} />
                <span className="text-xs sm:text-sm font-semibold text-foreground/80">Populares</span>
              </div>
              <div className="flex w-full max-w-full min-w-0 gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {serviceCategories.filter(c => c.popular).map((category) => (
                  <button
                    key={category.id}
                    onClick={() => handleCategorySelect(category)}
                    className="flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full bg-muted px-3 py-1.5 text-xs font-medium text-foreground/80 transition-all duration-200 active:-translate-y-0.5 active:shadow-md sm:gap-2 sm:px-4 sm:py-2 sm:text-sm touch-target"
                  >
                    <div className="flex size-5 scale-75 items-center justify-center rounded-full bg-[rgba(var(--theme-secondary-rgb),0.12)] text-[var(--theme-secondary)] sm:size-6 [&>svg]:size-3 sm:[&>svg]:size-4">
                      {category.icon}
                    </div>
                    {category.name}
                  </button>
                ))}
              </div>
            </div>

            {/* All Categories Grid */}
            <div className="grid w-full min-w-0 grid-cols-2 gap-2 sm:gap-3">
              {filteredCategories.map((category, index) => (
                <button
                  key={category.id}
                  onClick={() => handleCategorySelect(category)}
                  className="group relative min-w-0 overflow-hidden rounded-xl border border-border bg-card p-3 text-left transition-all duration-300 active:border-[var(--theme-primary)] active:shadow-lg sm:rounded-2xl sm:p-4 animate-scale-in touch-target"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="mb-2 flex size-10 items-center justify-center rounded-lg bg-[rgba(var(--theme-primary-rgb),0.08)] text-[var(--theme-primary)] transition-transform duration-300 group-active:scale-110 sm:mb-3 sm:size-12 sm:rounded-xl [&>svg]:size-5 sm:[&>svg]:size-6">
                    {category.icon}
                  </div>
                  <h4 className="font-semibold text-foreground text-xs sm:text-sm mb-0.5 sm:mb-1 truncate">{category.name}</h4>
                  <p className="text-[10px] sm:text-xs text-muted-foreground">{category.services.length} servicios</p>
                  <ChevronRight className="absolute top-3 right-3 size-3 text-[var(--theme-primary)] opacity-0 transition-opacity group-active:opacity-100 sm:top-4 sm:right-4 sm:size-4" />
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
              <div
                className="-mt-6 px-4 pt-2 pb-4 text-white sm:px-6 sm:pb-5"
                style={{ background: "linear-gradient(135deg, var(--theme-primary), rgba(var(--theme-primary-rgb), 0.9))" }}
              >
                {/* Drag handle */}
                <div className="flex justify-center mb-3">
                  <div className="h-1.5 w-12 rounded-full bg-white/30" />
                </div>
                
                <SheetHeader className="text-left">
                  <div className="flex items-center gap-3">
                    <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-white/20 shadow-lg backdrop-blur-sm sm:size-14 sm:rounded-2xl [&>svg]:size-5 sm:[&>svg]:size-7">
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
                      key={service.id}
                      onClick={() => handleServiceSelect(service)}
                    className="flex w-full min-w-0 items-center justify-between rounded-xl border border-border bg-card p-3.5 text-left shadow-sm transition-all duration-200 hover:border-[var(--theme-primary)] hover:shadow-md active:bg-muted sm:rounded-2xl sm:p-4 group touch-target animate-slide-up"
                      style={{ animationDelay: `${index * 0.05}s` }}
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-card p-1.5 shadow-sm ring-1 ring-border sm:size-10 sm:rounded-xl sm:p-2">
                          <BrandLogo logo={brandLogos[service.logoKey]} tone="primary" />
                        </div>
                        <div className="min-w-0">
                          <span className="font-semibold text-foreground text-sm sm:text-base block truncate">{service.name}</span>
                          <span className="text-[10px] sm:text-xs text-muted-foreground">Pago inmediato</span>
                        </div>
                      </div>
                      <ChevronRight className="size-4 shrink-0 text-muted-foreground/40 transition-all group-hover:translate-x-1 group-hover:text-[var(--theme-primary)] sm:size-5" />
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
        <DialogContent className="w-[calc(100%-2rem)] max-w-[380px] sm:max-w-md border-0 bg-card rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6">
          <DialogHeader className="text-center pb-2">
            <DialogTitle className="text-base font-bold text-[var(--theme-primary)] sm:text-xl">
              {selectedService?.name}
            </DialogTitle>
            <DialogDescription className="text-xs sm:text-sm text-muted-foreground">
              Ingresa los datos para realizar el pago
            </DialogDescription>
          </DialogHeader>

          <FieldGroup className="gap-3 py-3 sm:gap-4 sm:py-4">
            {/* Reference Input */}
            <Field>
              <FieldLabel htmlFor="service-reference">Número de referencia o contrato</FieldLabel>
              <div className="flex w-full min-w-0 gap-2">
                <Input
                  id="service-reference"
                  type="text"
                  placeholder="Ej: 123456789012"
                  value={serviceReference}
                  onChange={(e) => {
                    setServiceReference(e.target.value)
                    setProviderPreValidation(null)
                  }}
                  className="h-10 min-w-0 flex-1 rounded-lg border-border text-sm focus:border-[var(--theme-primary)] focus:ring-[rgba(var(--theme-primary-rgb),0.2)] sm:h-12 sm:rounded-xl"
                />
                <Button
                  type="button"
                  aria-label="Validar referencia con el proveedor"
                  onClick={handleSearchReference}
                  disabled={serviceReference.length < 8 || isSearchingRef}
                  className="h-10 shrink-0 rounded-lg bg-[var(--theme-primary)] px-3 hover:opacity-95 sm:h-12 sm:rounded-xl sm:px-4"
                >
                  {isSearchingRef ? (
                    <Loader2 className="animate-spin" data-icon="inline-start" />
                  ) : (
                    <Search data-icon="inline-start" />
                  )}
                </Button>
              </div>
              <FieldDescription>
                Valida con el proveedor antes de aceptar el pago del cliente.
              </FieldDescription>
            </Field>

            {/* Provider Pre-Validation result */}
            {providerPreValidation && (
              <div className="flex flex-col gap-2 rounded-xl bg-muted p-3 animate-scale-in sm:gap-3 sm:rounded-2xl sm:p-4">
                <div className="flex items-center justify-between gap-3">
                  <Badge
                    variant={isProviderPreValidationExpired ? "destructive" : "secondary"}
                    className="rounded-full"
                  >
                    {isProviderPreValidationExpired ? (
                      <AlertCircle data-icon="inline-start" />
                    ) : (
                      <CheckCircle2 data-icon="inline-start" />
                    )}
                    {isProviderPreValidationExpired ? "Validación vencida" : "Referencia pagable"}
                  </Badge>
                  <span className="flex shrink-0 items-center gap-1 text-[10px] text-muted-foreground sm:text-xs">
                    <Clock className="size-3" aria-hidden="true" />
                    Vence {providerPreValidationExpiryLabel}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs sm:text-sm text-muted-foreground">Titular</span>
                  <span className="text-xs sm:text-sm font-medium text-foreground truncate ml-2">Cliente demo</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs sm:text-sm text-muted-foreground">Referencia</span>
                  <span className="text-xs sm:text-sm font-mono text-muted-foreground truncate ml-2">{serviceReference}</span>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="text-xs sm:text-sm text-muted-foreground">Adeudo</span>
                  <span className="text-xs sm:text-sm font-medium text-foreground">
                    {formatMoney(providerPreValidation.billAmount)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs sm:text-sm text-muted-foreground">Comisión de servicio</span>
                  <span className="text-xs sm:text-sm font-medium text-foreground">
                    {formatMoney(providerPreValidation.serviceFee)}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between items-center pt-2">
                  <span className="text-xs sm:text-sm font-medium text-foreground">Total cliente</span>
                  <span className="text-lg font-bold text-[var(--theme-secondary)] sm:text-xl">
                    {formatMoney(providerPreValidation.customerTotal)}
                  </span>
                </div>
                {isProviderPreValidationExpired && (
                  <p className="text-xs text-muted-foreground">
                    Vuelve a validar la referencia antes de aceptar el pago del cliente.
                  </p>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <DialogFooter className="gap-2 pt-2 sm:flex-row sm:gap-3">
              <Button
                variant="outline"
                className="h-10 w-full rounded-lg border-border text-xs sm:h-12 sm:flex-1 sm:rounded-xl sm:text-sm"
                onClick={() => setShowPaymentForm(false)}
              >
                Cancelar
              </Button>
              <Button
                className="h-10 w-full rounded-lg bg-[var(--theme-secondary)] text-xs text-white hover:opacity-95 sm:h-12 sm:flex-1 sm:rounded-xl sm:text-sm"
                disabled={!hasActiveProviderPreValidation}
                onClick={handlePayService}
              >
                {isProviderPreValidationExpired ? "Revalidar antes de cobrar" : "Revisar pago"}
              </Button>
            </DialogFooter>
          </FieldGroup>
        </DialogContent>
      </Dialog>

      <ConfirmTransactionModal
        open={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleConfirmServicePayment}
        title={`Confirmar ${selectedService?.name || "servicio"}`}
        details={transactionDetails}
      />

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
          transactionStatus === "success" ? `Pago de ${selectedService?.name} completado` :
          transactionStatus === "error" ? "No se pudo procesar el pago. Intente nuevamente." :
          "Conectando con el proveedor de servicios..."
        }
        details={transactionStatus !== "processing" ? transactionDetails : undefined}
        onRetry={() => {
          setTransactionStatus("processing")
          setTimeout(() => {
            setTransactionStatus("success")
            addTransaction({
              type: selectedCategory?.id === "auto" ? "telepeaje" : "servicio",
              description: `Pago ${selectedService?.name || "servicio"}`,
              amount: providerPreValidation?.customerTotal || 0,
              reference: transactionDetails.reference,
            })
          }, 2000)
        }}
        onNewTransaction={handleNewTransaction}
      />
    </>
  )
}

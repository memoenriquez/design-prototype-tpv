"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { CloseButton } from "@/components/ui/close-button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { cn } from "@/lib/utils"
import { 
  Gift,
  Gamepad2,
  Music,
  ShoppingBag,
  Tv,
  Search,
  Check,
  Star,
  Copy
} from "lucide-react"
import { TransactionModal, ConfirmTransactionModal, TransactionStatus, TransactionDetails } from "./transaction-modal"

interface GiftCard {
  id: string
  name: string
  logo: string
  category: string
  amounts: number[]
  color: string
  popular?: boolean
}

const giftCards: GiftCard[] = [
  { id: "xbox", name: "Xbox", logo: "X", category: "gaming", amounts: [200, 400, 600, 1000], color: "from-green-500 to-green-600", popular: true },
  { id: "playstation", name: "PlayStation", logo: "PS", category: "gaming", amounts: [300, 500, 750, 1500], color: "from-blue-600 to-indigo-600", popular: true },
  { id: "nintendo", name: "Nintendo", logo: "N", category: "gaming", amounts: [200, 350, 500], color: "from-red-500 to-red-600" },
  { id: "spotify", name: "Spotify", logo: "S", category: "music", amounts: [99, 149, 299], color: "from-green-400 to-green-500", popular: true },
  { id: "netflix", name: "Netflix", logo: "N", category: "streaming", amounts: [199, 299, 399], color: "from-red-600 to-red-700" },
  { id: "amazon", name: "Amazon", logo: "A", category: "shopping", amounts: [300, 500, 1000, 2000], color: "from-orange-400 to-orange-500", popular: true },
  { id: "steam", name: "Steam", logo: "St", category: "gaming", amounts: [200, 400, 600, 1000], color: "from-slate-600 to-slate-700" },
  { id: "google", name: "Google Play", logo: "G", category: "apps", amounts: [50, 100, 200, 500], color: "from-blue-500 to-green-500" },
]

const categories = [
  { id: "all", name: "Todos", icon: <Gift className="size-4" /> },
  { id: "gaming", name: "Gaming", icon: <Gamepad2 className="size-4" /> },
  { id: "music", name: "Musica", icon: <Music className="size-4" /> },
  { id: "streaming", name: "Streaming", icon: <Tv className="size-4" /> },
  { id: "shopping", name: "Compras", icon: <ShoppingBag className="size-4" /> },
]

interface TarjetasRegaloPanelProps {
  onBack?: () => void
}

export function TarjetasRegaloPanel({ onBack }: TarjetasRegaloPanelProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedCard, setSelectedCard] = useState<GiftCard | null>(null)
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null)
  const [showAmountSheet, setShowAmountSheet] = useState(false)
  
  // Modal states
  const [showConfirm, setShowConfirm] = useState(false)
  const [showResult, setShowResult] = useState(false)
  const [showCodeModal, setShowCodeModal] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [transactionStatus, setTransactionStatus] = useState<TransactionStatus>("processing")
  const [generatedCode, setGeneratedCode] = useState("")
  const [codeCopied, setCodeCopied] = useState(false)

  const filteredCards = giftCards.filter(card => {
    const matchesSearch = card.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || card.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const popularCards = giftCards.filter(card => card.popular)

  const transactionDetails: TransactionDetails = {
    type: `Tarjeta ${selectedCard?.name || ""}`,
    amount: `$${selectedAmount?.toLocaleString('es-MX') || 0}.00`,
    commission: "$0.00",
    reference: `GFT-${Date.now().toString().slice(-8)}`,
    date: new Date().toLocaleString('es-MX', { dateStyle: 'medium', timeStyle: 'short' })
  }

  const handlePurchase = () => {
    setShowAmountSheet(false)
    setShowConfirm(true)
  }

  const handleCardSelect = (card: GiftCard) => {
    setSelectedCard(card)
    setSelectedAmount(null)
    setShowAmountSheet(true)
  }

  const handleCloseAmountSheet = () => {
    setShowAmountSheet(false)
  }

  const handleConfirmTransaction = () => {
    setIsProcessing(true)
    setShowConfirm(false)
    setShowAmountSheet(false)
    setShowResult(true)
    setTransactionStatus("processing")

    setTimeout(() => {
      setIsProcessing(false)
      const success = Math.random() > 0.05 // 95% success rate
      setTransactionStatus(success ? "success" : "error")
      if (success) {
        // Generate a mock code
        const code = `${selectedCard?.id.toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`
        setGeneratedCode(code)
      }
    }, 2500)
  }

  const handleShowCode = () => {
    setShowResult(false)
    setShowCodeModal(true)
  }

  const handleCopyCode = () => {
    navigator.clipboard.writeText(generatedCode)
    setCodeCopied(true)
    setTimeout(() => setCodeCopied(false), 2000)
  }

  const handleNewTransaction = () => {
    setShowResult(false)
    setShowCodeModal(false)
    setSelectedCard(null)
    setSelectedAmount(null)
    setShowAmountSheet(false)
    setGeneratedCode("")
  }

  return (
    <>
      <div className="flex w-full max-w-full min-w-0 flex-col gap-4 box-border animate-slide-up">
        {/* Main Card */}
        <Card className="w-full min-w-0 overflow-hidden border-0 shadow-xl shadow-[#000D94]/5">
          {/* Header */}
          <CardHeader className="relative overflow-hidden bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 p-3 pb-4 text-white sm:p-4 sm:pb-6">
            {/* Decorative elements */}
            <div className="pointer-events-none absolute inset-0 opacity-10" aria-hidden="true">
              <div className="absolute -top-8 -right-8 size-24 rounded-full bg-white blur-2xl" />
              <div className="absolute -bottom-6 left-8 size-20 rounded-full bg-white blur-xl" />
            </div>
            
            <div className="relative z-10 flex w-full flex-col gap-3">
              {/* Title row */}
              <div className="flex items-center justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] font-medium text-white/70 sm:text-xs">Tarjetas de regalo</p>
                  <h3 className="text-base font-bold leading-tight sm:text-lg">Regala experiencias</h3>
                </div>
                <Badge className="shrink-0 border-0 bg-white/20 text-[10px] text-white sm:text-xs">
                  Entrega inmediata
                </Badge>
              </div>
              
              {/* Search */}
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-white/50 pointer-events-none" />
                <Input
                  type="text"
                  placeholder="Buscar tarjeta..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  aria-label="Buscar tarjeta de regalo"
                  className="h-10 w-full rounded-xl border-white/20 bg-white/15 pl-10 text-sm text-white placeholder:text-white/50 transition-colors focus:bg-white/20 sm:h-11"
                />
              </div>
            </div>
          </CardHeader>
          
          {/* Content */}
          <CardContent className="flex w-full min-w-0 flex-col gap-4 overflow-x-hidden p-3 sm:p-4">
            {/* Categories - Horizontal scroll */}
            <div className="flex w-full max-w-full min-w-0 gap-2 overflow-x-auto pb-1 scrollbar-hide">
              {categories.map((category) => (
                <button
                  key={category.id}
                  type="button"
                  aria-pressed={selectedCategory === category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={cn(
                    "flex min-h-[40px] shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-medium whitespace-nowrap transition-all duration-200 touch-target",
                    selectedCategory === category.id
                      ? "bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-lg shadow-purple-500/25"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200 active:scale-95"
                  )}
                >
                  <span className="[&>svg]:size-4">{category.icon}</span>
                  <span>{category.name}</span>
                </button>
              ))}
            </div>

            {/* Popular Cards */}
            <div>
              <div className="mb-2 flex items-center gap-1.5 sm:mb-3 sm:gap-2">
                <Star className="size-3.5 shrink-0 fill-yellow-500 text-yellow-500 sm:size-4" />
                <span className="text-xs font-semibold text-foreground/80 sm:text-sm">Populares</span>
              </div>
              <div className="flex w-full max-w-full min-w-0 gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {popularCards.map((card) => (
                  <button
                    key={card.id}
                    type="button"
                    aria-pressed={selectedCard?.id === card.id}
                    onClick={() => handleCardSelect(card)}
                    className="flex flex-shrink-0 items-center gap-2 rounded-full bg-gradient-to-r from-gray-50 to-gray-100 px-3 py-1.5 text-xs font-medium text-foreground/80 transition-all duration-200 active:-translate-y-0.5 active:shadow-md sm:px-4 sm:py-2 sm:text-sm touch-target"
                  >
                    <div className={cn("flex size-5 scale-75 items-center justify-center rounded-full bg-gradient-to-br text-[10px] font-bold text-white sm:size-6 sm:text-xs", card.color)}>
                      {card.logo}
                    </div>
                    {card.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Section header */}
            <div className="flex items-center gap-2">
              <Gift className="size-4 shrink-0 text-purple-500" />
              <span className="text-sm font-semibold text-foreground/80">
                {searchQuery || selectedCategory !== "all" ? "Resultados" : "Todas las tarjetas"}
              </span>
            </div>

            {/* Cards Grid - Responsive columns */}
            <div className="grid w-full min-w-0 grid-cols-2 gap-3 overflow-hidden">
              {filteredCards.map((card, index) => (
                <button
                  key={card.id}
                  type="button"
                  aria-pressed={selectedCard?.id === card.id}
                  onClick={() => handleCardSelect(card)}
                  className={cn(
                    "group relative flex min-h-[120px] min-w-0 flex-col overflow-hidden rounded-xl border p-3 text-left transition-all duration-200 sm:rounded-2xl sm:p-4",
                    selectedCard?.id === card.id
                      ? "border-purple-500 bg-purple-50 shadow-lg shadow-purple-500/20"
                      : "border-gray-100 bg-gradient-to-br from-white to-gray-50 shadow-sm hover:shadow-md active:scale-[0.98]"
                  )}
                  style={{ animationDelay: `${index * 0.03}s` }}
                >
                  {/* Logo */}
                  <div 
                    className={cn(
                      "mb-2 flex size-12 items-center justify-center rounded-xl bg-gradient-to-br text-base font-bold text-white shadow-md transition-transform duration-200 group-hover:scale-105 group-active:scale-100",
                      card.color
                    )}
                  >
                    {card.logo}
                  </div>
                  
                  {/* Info */}
                  <div className="flex flex-col gap-0.5 min-w-0 flex-1">
                    <h4 className="truncate text-sm font-semibold text-foreground">{card.name}</h4>
                    <p className="text-xs text-muted-foreground">Desde ${card.amounts[0]}</p>
                  </div>
                  
                  {/* Badge */}
                  {card.popular && (
                    <Badge className="mt-2 w-fit border-0 bg-yellow-100 px-2 py-0.5 text-[10px] font-medium text-yellow-700">
                      Popular
                    </Badge>
                  )}
                </button>
              ))}
            </div>

            {/* Empty state */}
            {filteredCards.length === 0 && (
              <Empty className="border-0 py-8">
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <Gift />
                  </EmptyMedia>
                  <EmptyTitle>No se encontraron tarjetas</EmptyTitle>
                  <EmptyDescription>
                    Ajusta la busqueda o limpia los filtros para ver mas opciones.
                  </EmptyDescription>
                </EmptyHeader>
                <EmptyContent>
                  <Button
                    variant="link"
                    className="text-sm text-purple-600"
                    onClick={() => {
                      setSearchQuery("")
                      setSelectedCategory("all")
                    }}
                  >
                    Limpiar filtros
                  </Button>
                </EmptyContent>
              </Empty>
            )}
          </CardContent>
        </Card>

      </div>

      {/* Gift Card Amount Sheet */}
      <Sheet open={showAmountSheet} onOpenChange={setShowAmountSheet}>
        <SheetContent
          side="bottom"
          showCloseButton={false}
          className="max-h-[70vh] overflow-hidden rounded-t-3xl border-0 px-0 pb-8"
        >
          {selectedCard && (
            <>
              <div className={cn("-mt-6 bg-gradient-to-r px-4 pt-2 pb-4 text-white sm:px-6 sm:pb-5", selectedCard.color)}>
                <div className="mb-3 flex justify-center">
                  <div className="h-1.5 w-12 rounded-full bg-white/30" />
                </div>

                <SheetHeader className="text-left">
                  <div className="flex items-center gap-3">
                    <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-white/20 text-lg font-bold shadow-lg backdrop-blur-sm sm:size-14 sm:rounded-2xl sm:text-xl">
                      {selectedCard.logo}
                    </div>
                    <div className="min-w-0 flex-1">
                      <SheetTitle className="truncate text-lg font-bold text-white sm:text-xl">
                        {selectedCard.name}
                      </SheetTitle>
                      <SheetDescription className="text-xs text-white/70 sm:text-sm">
                        Selecciona el monto de la tarjeta
                      </SheetDescription>
                    </div>
                    <CloseButton
                      onAction={handleCloseAmountSheet}
                      buttonStyle="glass"
                      size="md"
                    />
                  </div>
                </SheetHeader>
              </div>

              <div className="max-h-[calc(70vh-120px)] min-w-0 overflow-y-auto px-4 pt-4 sm:px-6 sm:pt-5">
                <div className="flex min-w-0 flex-col gap-4">
                  <div
                    className="grid min-w-0 grid-cols-2 gap-2"
                    role="radiogroup"
                    aria-label={`Montos disponibles para ${selectedCard.name}`}
                  >
                    {selectedCard.amounts.map((amt) => (
                      <button
                        key={amt}
                        type="button"
                        role="radio"
                        aria-checked={selectedAmount === amt}
                        onClick={() => setSelectedAmount(amt)}
                        className={cn(
                          "flex min-h-[56px] min-w-0 items-center justify-center gap-2 rounded-xl border-2 p-4 text-lg font-bold transition-all duration-200 touch-target",
                          selectedAmount === amt
                            ? "border-purple-500 bg-purple-50 text-purple-700 shadow-md"
                            : "border-gray-200 bg-white text-foreground hover:border-purple-300 active:scale-[0.98]"
                        )}
                      >
                        <span>${amt}</span>
                        {selectedAmount === amt && (
                          <Check className="size-4 shrink-0 text-purple-500" />
                        )}
                      </button>
                    ))}
                  </div>

                  <Button
                    className="h-12 w-full rounded-xl bg-gradient-to-r from-[#0BBD33] to-[#099a2a] text-base font-bold text-white shadow-lg shadow-[#0BBD33]/25 transition-all duration-200 hover:from-[#099a2a] hover:to-[#078523] disabled:opacity-50 disabled:shadow-none"
                    disabled={!selectedAmount}
                    onClick={handlePurchase}
                  >
                    Comprar ${selectedAmount || 0} MXN
                  </Button>

                  <p className="pb-4 text-center text-[10px] text-muted-foreground sm:text-xs">
                    Tu codigo se generara despues de confirmar la compra
                  </p>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* Confirmation Modal */}
      <ConfirmTransactionModal
        open={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleConfirmTransaction}
        title={`Comprar ${selectedCard?.name || ""}`}
        details={transactionDetails}
        isLoading={isProcessing}
      />

      {/* Result Modal */}
      <TransactionModal
        open={showResult}
        onClose={() => setShowResult(false)}
        status={transactionStatus}
        title={
          transactionStatus === "success" ? "Compra Exitosa" :
          transactionStatus === "error" ? "Compra Fallida" :
          "Procesando Compra..."
        }
        message={
          transactionStatus === "success" ? `Tu tarjeta ${selectedCard?.name} esta lista` :
          transactionStatus === "error" ? "No se pudo completar la compra. Intente nuevamente." :
          "Generando codigo de tarjeta..."
        }
        details={transactionStatus !== "processing" ? transactionDetails : undefined}
        onRetry={() => {
          setTransactionStatus("processing")
          setTimeout(() => {
            setTransactionStatus("success")
            setGeneratedCode(`${selectedCard?.id.toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`)
          }, 2000)
        }}
        onNewTransaction={transactionStatus === "success" ? handleShowCode : handleNewTransaction}
      />

      {/* Code Display Modal */}
      <Dialog open={showCodeModal} onOpenChange={setShowCodeModal}>
        <DialogContent className="w-[calc(100%-2rem)] max-w-md bg-white border-0 rounded-2xl shadow-2xl p-5">
          <DialogHeader className="text-center pb-4">
            <div className={cn("mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br text-xl font-bold text-white shadow-lg", selectedCard?.color || "from-purple-500 to-pink-500")}>
              {selectedCard?.logo}
            </div>
            <DialogTitle className="text-lg font-bold text-gray-900">
              Tarjeta {selectedCard?.name}
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-500">
              ${selectedAmount?.toLocaleString('es-MX')}.00 MXN
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4">
            {/* Code Display */}
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-xs text-gray-500 mb-2 text-center font-medium">Codigo de la tarjeta</p>
              <div className="flex items-center gap-2 bg-white rounded-lg p-3 border border-gray-200">
                <code className="text-sm font-mono font-bold text-gray-900 tracking-wider truncate flex-1 min-w-0">
                  {generatedCode}
                </code>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCopyCode}
                  className="size-8 shrink-0 p-0 hover:bg-gray-100"
                  aria-label="Copiar codigo de tarjeta"
                >
                  {codeCopied ? (
                    <Check className="text-green-500" data-icon="inline-start" />
                  ) : (
                    <Copy className="text-gray-500" data-icon="inline-start" />
                  )}
                </Button>
              </div>
              {codeCopied && (
                <p className="text-xs text-green-600 text-center mt-2 font-medium">Codigo copiado al portapapeles</p>
              )}
            </div>

            {/* Instructions */}
            <div className="flex flex-col gap-1 text-center text-xs text-gray-500">
              <p>Canjea este codigo en {selectedCard?.name}</p>
              <p>Valido por 12 meses desde la compra</p>
            </div>

            {/* Actions */}
            <DialogFooter className="gap-3 sm:flex-row">
              <Button
                variant="outline"
                className="h-12 w-full rounded-xl border-gray-200 text-sm font-medium sm:flex-1"
                onClick={handleCopyCode}
              >
                <Copy data-icon="inline-start" />
                Copiar
              </Button>
              <Button
                className="h-12 w-full rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 text-sm font-medium text-white shadow-lg shadow-purple-500/25 hover:from-purple-700 hover:to-pink-600 sm:flex-1"
                onClick={handleNewTransaction}
              >
                Nueva Compra
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

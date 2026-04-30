"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { 
  Gift,
  Gamepad2,
  Music,
  ShoppingBag,
  Tv,
  Search,
  Check,
  Star,
  Copy,
  Loader2
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
  { id: "all", name: "Todos", icon: <Gift className="h-4 w-4" /> },
  { id: "gaming", name: "Gaming", icon: <Gamepad2 className="h-4 w-4" /> },
  { id: "music", name: "Musica", icon: <Music className="h-4 w-4" /> },
  { id: "streaming", name: "Streaming", icon: <Tv className="h-4 w-4" /> },
  { id: "shopping", name: "Compras", icon: <ShoppingBag className="h-4 w-4" /> },
]

interface TarjetasRegaloPanelProps {
  onBack?: () => void
}

export function TarjetasRegaloPanel({ onBack }: TarjetasRegaloPanelProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedCard, setSelectedCard] = useState<GiftCard | null>(null)
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null)
  
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

  const transactionDetails: TransactionDetails = {
    type: `Tarjeta ${selectedCard?.name || ""}`,
    amount: `$${selectedAmount?.toLocaleString('es-MX') || 0}.00`,
    commission: "$0.00",
    reference: `GFT-${Date.now().toString().slice(-8)}`,
    date: new Date().toLocaleString('es-MX', { dateStyle: 'medium', timeStyle: 'short' })
  }

  const handlePurchase = () => {
    setShowConfirm(true)
  }

  const handleConfirmTransaction = () => {
    setIsProcessing(true)
    setShowConfirm(false)
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
    setGeneratedCode("")
  }

  return (
    <>
      <div className="flex flex-col gap-4 w-full overflow-hidden box-border animate-slide-up" style={{ maxWidth: "100%" }}>
        {/* Main Card */}
        <Card className="border-0 shadow-xl shadow-[#000D94]/5 overflow-hidden w-full" style={{ maxWidth: "100%" }}>
          {/* Header */}
          <CardHeader className="bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 text-white p-4 pb-5 relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute inset-0 opacity-20 pointer-events-none" aria-hidden="true">
              <div className="absolute top-2 left-4 w-6 h-6 border-2 border-white rounded-lg rotate-12" />
              <div className="absolute top-6 right-6 w-5 h-5 border-2 border-white rounded-full" />
              <div className="absolute bottom-3 left-10 w-3 h-3 bg-white rounded-full" />
            </div>
            
            <div className="relative z-10 w-full flex flex-col gap-3">
              {/* Title row */}
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <p className="text-white/70 text-[11px] font-medium uppercase tracking-wide">Tarjetas de regalo</p>
                  <h3 className="text-lg font-bold leading-tight">Regala experiencias</h3>
                </div>
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                  <Gift className="h-5 w-5 text-white" />
                </div>
              </div>
              
              {/* Search */}
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/50 pointer-events-none" />
                <Input
                  type="text"
                  placeholder="Buscar tarjeta..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 h-11 bg-white/15 border-white/20 text-white placeholder:text-white/50 rounded-xl text-sm focus:bg-white/20 transition-colors"
                />
              </div>
            </div>
          </CardHeader>
          
          {/* Content */}
          <CardContent className="p-4 flex flex-col gap-4 w-full overflow-hidden">
            {/* Categories - Horizontal scroll */}
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide -mx-1 px-1">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium 
                    whitespace-nowrap transition-all duration-200 shrink-0
                    min-h-[40px] touch-target
                    ${selectedCategory === category.id
                      ? 'bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-lg shadow-purple-500/25'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200 active:scale-95'
                    }
                  `}
                >
                  <span className="[&>svg]:w-4 [&>svg]:h-4">{category.icon}</span>
                  <span>{category.name}</span>
                </button>
              ))}
            </div>

            {/* Section header */}
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 shrink-0" />
              <span className="text-sm font-semibold text-gray-700">Mas vendidas</span>
            </div>

            {/* Cards Grid - Responsive columns */}
            <div className="grid grid-cols-2 gap-3 w-full overflow-hidden">
              {filteredCards.map((card, index) => (
                <button
                  key={card.id}
                  onClick={() => {
                    setSelectedCard(card)
                    setSelectedAmount(null)
                  }}
                  className={`
                    group flex flex-col p-3 rounded-2xl border-2 
                    transition-all duration-200 text-left 
                    min-h-[120px] overflow-hidden min-w-0
                    ${selectedCard?.id === card.id
                      ? 'border-purple-500 bg-purple-50 shadow-lg shadow-purple-500/20'
                      : 'border-transparent bg-white shadow-sm hover:shadow-md active:scale-[0.98]'
                    }
                  `}
                  style={{ animationDelay: `${index * 0.03}s` }}
                >
                  {/* Logo */}
                  <div 
                    className={`
                      w-12 h-12 rounded-xl bg-gradient-to-br ${card.color} 
                      flex items-center justify-center text-white font-bold text-base
                      shadow-md mb-2 transition-transform duration-200
                      group-hover:scale-105 group-active:scale-100
                    `}
                  >
                    {card.logo}
                  </div>
                  
                  {/* Info */}
                  <div className="flex flex-col gap-0.5 min-w-0 flex-1">
                    <h4 className="font-semibold text-gray-900 text-sm truncate">{card.name}</h4>
                    <p className="text-xs text-gray-500">Desde ${card.amounts[0]}</p>
                  </div>
                  
                  {/* Badge */}
                  {card.popular && (
                    <Badge className="mt-2 w-fit bg-yellow-100 text-yellow-700 border-0 text-[10px] font-medium px-2 py-0.5">
                      Popular
                    </Badge>
                  )}
                </button>
              ))}
            </div>

            {/* Empty state */}
            {filteredCards.length === 0 && (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Gift className="h-12 w-12 text-gray-300 mb-3" />
                <p className="text-sm text-gray-500">No se encontraron tarjetas</p>
                <Button
                  variant="link"
                  className="text-purple-600 text-sm mt-1"
                  onClick={() => {
                    setSearchQuery("")
                    setSelectedCategory("all")
                  }}
                >
                  Limpiar filtros
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Selected Card - Amount Selection */}
        {selectedCard && (
          <Card className="border-0 shadow-lg overflow-hidden w-full animate-slide-up">
            <CardHeader className={`bg-gradient-to-r ${selectedCard.color} text-white p-4`}>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center font-bold text-xl shrink-0">
                  {selectedCard.logo}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-bold text-base truncate">{selectedCard.name}</h3>
                  <p className="text-white/80 text-xs">Selecciona el monto</p>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="p-4 flex flex-col gap-4">
              {/* Amount buttons - Responsive grid */}
              <div className="grid grid-cols-2 gap-2">
                {selectedCard.amounts.map((amt) => (
                  <button
                    key={amt}
                    onClick={() => setSelectedAmount(amt)}
                    className={`
                      flex items-center justify-center gap-2 
                      p-4 rounded-xl border-2 
                      font-bold text-lg transition-all duration-200
                      min-h-[56px] touch-target
                      ${selectedAmount === amt
                        ? 'border-purple-500 bg-purple-50 text-purple-700 shadow-md'
                        : 'border-gray-200 bg-white text-gray-900 hover:border-purple-300 active:scale-[0.98]'
                      }
                    `}
                  >
                    <span>${amt}</span>
                    {selectedAmount === amt && (
                      <Check className="h-4 w-4 text-purple-500 shrink-0" />
                    )}
                  </button>
                ))}
              </div>
              
              {/* Purchase button */}
              <Button 
                className="w-full h-12 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white font-bold text-base rounded-xl shadow-lg shadow-purple-500/25 disabled:opacity-50 disabled:shadow-none transition-all duration-200"
                disabled={!selectedAmount}
                onClick={handlePurchase}
              >
                Comprar ${selectedAmount || 0} MXN
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

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
        <DialogContent className="w-[calc(100%-2rem)] max-w-md mx-auto bg-white border-0 rounded-2xl shadow-2xl p-5">
          <DialogHeader className="text-center pb-4">
            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${selectedCard?.color || "from-purple-500 to-pink-500"} flex items-center justify-center text-white font-bold text-xl mx-auto mb-4 shadow-lg`}>
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
                  className="h-8 w-8 p-0 shrink-0 hover:bg-gray-100"
                >
                  {codeCopied ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4 text-gray-500" />
                  )}
                </Button>
              </div>
              {codeCopied && (
                <p className="text-xs text-green-600 text-center mt-2 font-medium">Codigo copiado al portapapeles</p>
              )}
            </div>

            {/* Instructions */}
            <div className="text-xs text-gray-500 text-center space-y-1">
              <p>Canjea este codigo en {selectedCard?.name}</p>
              <p>Valido por 12 meses desde la compra</p>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1 h-12 rounded-xl border-gray-200 text-sm font-medium"
                onClick={handleCopyCode}
              >
                <Copy className="h-4 w-4 mr-2" />
                Copiar
              </Button>
              <Button
                className="flex-1 h-12 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 rounded-xl text-white text-sm font-medium shadow-lg shadow-purple-500/25"
                onClick={handleNewTransaction}
              >
                Nueva Compra
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

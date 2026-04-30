"use client"

import { useState, useEffect } from "react"
import { POSHeader } from "@/components/pos-header"
import { BalanceCard } from "@/components/balance-card"
import { QuickActions } from "@/components/quick-actions"
import { TiempoAirePanel } from "@/components/tiempo-aire-panel"
import { CobrarPanel } from "@/components/cobrar-panel"
import { PagoServiciosPanel } from "@/components/pago-servicios-panel"
import { TarjetasRegaloPanel } from "@/components/tarjetas-regalo-panel"
import { RecentTransactions } from "@/components/recent-transactions"
import { ProfilePage } from "@/components/profile-page"
import { ThemeCustomizationPage } from "@/components/theme-customization-page"
import { BottomNavigation } from "@/components/bottom-navigation"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { CloseButton } from "@/components/ui/close-button"
import { Sparkles, Home } from "lucide-react"

type ActivePanel = "inicio" | "tiempo-aire" | "cobrar" | "pago-servicios" | "tarjetas-regalo" | "telepeaje" | "codigo-qr" | "vales" | "historial" | "perfil" | "personalizar"

const panelTitles: Record<ActivePanel, string> = {
  "inicio": "Inicio",
  "tiempo-aire": "Tiempo Aire",
  "cobrar": "Cobrar",
  "pago-servicios": "Pago de Servicios",
  "tarjetas-regalo": "Tarjetas de Regalo",
  "telepeaje": "Telepeaje",
  "codigo-qr": "Cobro QR",
  "vales": "Vales de Despensa",
  "historial": "Historial",
  "perfil": "Mi Perfil",
  "personalizar": "Personalizar Apariencia"
}

export default function POSApp() {
  const [activePanel, setActivePanel] = useState<ActivePanel>("inicio")
  const [currentDate, setCurrentDate] = useState<string>("")

  // Set date on client side only to avoid hydration mismatch
  useEffect(() => {
    setCurrentDate(new Date().toLocaleDateString('es-MX', { weekday: 'short', day: 'numeric', month: 'short' }))
  }, [])

  // Mock data
  const airtimeBalance = 2850.50
  const accountBalance = 4850.00
  const salesToday = 1250.00
  const transactionsToday = 8

  const handleActionClick = (actionId: string) => {
    setActivePanel(actionId as ActivePanel)
  }

  const handleBack = () => {
    setActivePanel("inicio")
  }

  const handleBackToProfile = () => {
    setActivePanel("perfil")
  }

  const handleOpenThemeCustomization = () => {
    setActivePanel("personalizar")
  }

  const handleNavChange = (tabId: string) => {
    setActivePanel(tabId as ActivePanel)
  }

  const renderPanel = () => {
    switch (activePanel) {
      case "tiempo-aire":
        return <TiempoAirePanel airtimeBalance={airtimeBalance} />
      case "cobrar":
        return <CobrarPanel onBack={handleBack} />
      case "pago-servicios":
        return <PagoServiciosPanel onBack={handleBack} />
      case "tarjetas-regalo":
        return <TarjetasRegaloPanel onBack={handleBack} />
      case "historial":
        return <RecentTransactions expanded />
      case "perfil":
        return <ProfilePage onBack={handleBack} onOpenThemeCustomization={handleOpenThemeCustomization} />
      case "personalizar":
        return <ThemeCustomizationPage onBack={handleBackToProfile} />
      default:
        return null
    }
  }

  // Theme customization page has its own full-screen layout
  if (activePanel === "personalizar") {
    return (
      <div className="min-h-screen w-full sm:max-w-[430px] mx-auto relative" style={{ backgroundColor: "var(--theme-background, #F8FAFC)" }}>
        <ThemeCustomizationPage onBack={handleBackToProfile} />
        <BottomNavigation 
          activeTab="perfil" 
          onTabChange={handleNavChange} 
        />
      </div>
    )
  }

  // Profile page has its own layout
  if (activePanel === "perfil") {
    return (
      <div className="min-h-screen w-full sm:max-w-[430px] mx-auto relative" style={{ backgroundColor: "var(--theme-background, #F8FAFC)" }}>
        <ProfilePage onBack={handleBack} onOpenThemeCustomization={handleOpenThemeCustomization} />
        <BottomNavigation 
          activeTab="perfil" 
          onTabChange={handleNavChange} 
        />
      </div>
    )
  }

  return (
    <div 
      className="min-h-screen min-h-[100dvh] flex flex-col w-full sm:max-w-[430px] mx-auto relative overflow-hidden"
      style={{ backgroundColor: "var(--theme-background, #F8FAFC)" }}
    >
      {/* Background decorative elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-40 -right-20 w-64 h-64 rounded-full blur-3xl" style={{ backgroundColor: "rgba(var(--theme-secondary-rgb, 11, 189, 51), 0.05)" }} />
        <div className="absolute top-96 -left-20 w-48 h-48 rounded-full blur-3xl" style={{ backgroundColor: "rgba(var(--theme-primary-rgb, 0, 13, 148), 0.05)" }} />
        <div className="absolute bottom-60 right-10 w-32 h-32 rounded-full blur-2xl" style={{ backgroundColor: "rgba(var(--theme-accent-rgb, 22, 232, 255), 0.1)" }} />
        <div className="absolute top-20 left-1/2 w-72 h-72 rounded-full blur-3xl -translate-x-1/2" style={{ background: "linear-gradient(135deg, rgba(11, 189, 51, 0.03), rgba(0, 13, 148, 0.03))" }} />
      </div>

      {/* Header with persistent airtime balance */}
      <POSHeader airtimeBalance={airtimeBalance} />

      {/* Main Content */}
      <ScrollArea className="flex-1 pb-32 relative z-10">
        <main className="p-4 sm:p-5 space-y-6 w-full max-w-full overflow-x-hidden">
          {activePanel === "inicio" ? (
            <>
              {/* Welcome message */}
              <div className="flex items-center justify-between animate-slide-up">
                <div>
                  <p className="text-sm font-medium" style={{ color: "var(--theme-text-secondary, #64748B)" }}>Bienvenido de nuevo</p>
                  <h1 className="text-xl font-bold flex items-center gap-2" style={{ color: "var(--theme-text-primary, #0A1628)" }}>
                    Mi Negocio
                    <Sparkles className="h-4 w-4" style={{ color: "var(--theme-secondary, #0BBD33)" }} />
                  </h1>
                </div>
                <div className="text-right">
                  <p className="text-xs" style={{ color: "var(--theme-text-secondary, #64748B)" }}>Hoy</p>
                  <p className="text-sm font-semibold" style={{ color: "var(--theme-primary, #000D94)" }}>
                    {currentDate || "---"}
                  </p>
                </div>
              </div>

              {/* Balance Card */}
              <BalanceCard 
                balance={accountBalance}
                salesToday={salesToday}
                transactionsToday={transactionsToday}
              />

              {/* Quick Actions Grid */}
              <QuickActions onActionClick={handleActionClick} />
            </>
          ) : (
            <div className="space-y-4">
              {/* Back Button Header */}
              <div className="flex items-center gap-3 animate-slide-up">
                <CloseButton 
                  variant="back"
                  buttonStyle="solid"
                  size="lg"
                  onAction={handleBack}
                  className="rounded-xl shadow-lg hover:shadow-xl"
                  style={{ 
                    backgroundColor: "var(--theme-card, #FFFFFF)",
                    borderColor: "rgba(0,0,0,0.05)",
                    color: "var(--theme-primary, #000D94)"
                  }}
                />
                <div>
                  <p className="text-xs font-medium" style={{ color: "var(--theme-text-secondary, #64748B)" }}>Volver</p>
                  <h2 className="text-lg font-bold" style={{ color: "var(--theme-text-primary, #0A1628)" }}>{panelTitles[activePanel]}</h2>
                </div>
              </div>

              {/* Active Panel Content */}
              {renderPanel()}

              {/* Back to home button */}
              {activePanel !== "historial" && (
                <button 
                  onClick={handleBack}
                  className="text-sm font-semibold flex items-center gap-2 mx-auto py-3 px-5 rounded-xl transition-all duration-200 group mt-2"
                  style={{ color: "var(--theme-primary, #000D94)" }}
                >
                  <Home className="h-4 w-4 transition-transform group-hover:scale-110" />
                  Volver al inicio
                </button>
              )}
            </div>
          )}
        </main>
      </ScrollArea>

      {/* Bottom Navigation */}
      <BottomNavigation 
        activeTab={activePanel === "inicio" ? "inicio" : activePanel} 
        onTabChange={handleNavChange} 
      />
    </div>
  )
}

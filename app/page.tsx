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
      <div className="min-h-screen w-full sm:max-w-[430px] mx-auto relative" style={{ backgroundColor: "var(--theme-background)" }}>
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
      <div className="min-h-screen w-full sm:max-w-[430px] mx-auto relative" style={{ backgroundColor: "var(--theme-background)" }}>
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
      className="relative mx-auto flex h-screen h-[100dvh] w-full min-w-0 flex-col overflow-x-hidden sm:max-w-[430px]"
      style={{ backgroundColor: "var(--theme-background)" }}
    >
      {/* Background decorative elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-40 -right-20 size-64 rounded-full blur-3xl" style={{ backgroundColor: "rgba(var(--theme-secondary-rgb), 0.05)" }} />
        <div className="absolute top-96 -left-20 size-48 rounded-full blur-3xl" style={{ backgroundColor: "rgba(var(--theme-primary-rgb), 0.05)" }} />
        <div className="absolute top-20 left-1/2 size-72 -translate-x-1/2 rounded-full blur-3xl" style={{ background: "linear-gradient(135deg, rgba(var(--theme-secondary-rgb), 0.03), rgba(var(--theme-primary-rgb), 0.03))" }} />
      </div>

      {/* Header with persistent airtime balance */}
      <POSHeader airtimeBalance={airtimeBalance} />

      {/* Main Content */}
      <div className="scrollbar-hide relative z-10 flex-1 overflow-x-hidden overflow-y-auto pb-32">
        <main className="flex w-full max-w-full min-w-0 flex-col gap-6 overflow-x-hidden p-4 sm:p-5">
          {activePanel === "inicio" ? (
            <>
              {/* Welcome message */}
              <div className="flex items-center justify-between animate-slide-up">
                <div>
                  <p className="text-sm font-medium" style={{ color: "var(--theme-text-secondary)" }}>Bienvenido de nuevo</p>
                  <h1 className="text-xl font-bold flex items-center gap-2" style={{ color: "var(--theme-text-primary)" }}>
                    Mi Negocio
                    <Sparkles className="size-4" style={{ color: "var(--theme-secondary)" }} />
                  </h1>
                </div>
                <div className="text-right">
                  <p className="text-xs" style={{ color: "var(--theme-text-secondary)" }}>Hoy</p>
                  <p className="text-sm font-semibold" style={{ color: "var(--theme-primary)" }}>
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
            <div className="flex min-w-0 flex-col gap-4">
              {/* Back Button Header */}
              <div className="flex items-center gap-3 animate-slide-up">
                <CloseButton 
                  variant="back"
                  buttonStyle="solid"
                  size="lg"
                  onAction={handleBack}
                  className="rounded-xl shadow-lg hover:shadow-xl"
                  style={{ 
                    backgroundColor: "var(--theme-card)",
                    borderColor: "rgba(0,0,0,0.05)",
                    color: "var(--theme-primary)"
                  }}
                />
                <div>
                  <p className="text-xs font-medium" style={{ color: "var(--theme-text-secondary)" }}>Volver</p>
                  <h2 className="text-lg font-bold" style={{ color: "var(--theme-text-primary)" }}>{panelTitles[activePanel]}</h2>
                </div>
              </div>

              {/* Active Panel Content */}
              {renderPanel()}

              {/* Back to home button */}
              {activePanel !== "historial" && (
                <button 
                  onClick={handleBack}
                  className="text-sm font-semibold flex items-center gap-2 mx-auto py-3 px-5 rounded-xl transition-all duration-200 group mt-2"
                  style={{ color: "var(--theme-primary)" }}
                >
                  <Home className="h-4 w-4 transition-transform group-hover:scale-110" />
                  Volver al inicio
                </button>
              )}
            </div>
          )}
        </main>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation 
        activeTab={activePanel === "inicio" ? "inicio" : activePanel} 
        onTabChange={handleNavChange} 
      />
    </div>
  )
}

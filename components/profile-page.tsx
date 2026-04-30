"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { CloseButton } from "@/components/ui/close-button"
import { 
  User, 
  CreditCard, 
  Shield, 
  HelpCircle, 
  FileText, 
  LogOut,
  ChevronRight,
  Bell,
  Smartphone,
  Building2,
  Mail,
  Phone,
  MapPin,
  Edit2,
  Camera,
  Palette
} from "lucide-react"
import { CTCPayLogo } from "./ctcpay-logo"

interface ProfilePageProps {
  onBack: () => void
  onOpenThemeCustomization?: () => void
}

export function ProfilePage({ onBack, onOpenThemeCustomization }: ProfilePageProps) {
  const [notifications, setNotifications] = useState(true)
  const [biometric, setBiometric] = useState(true)

  const menuItems = [
    {
      section: "Cuenta",
      items: [
        { icon: User, label: "Datos personales", description: "Nombre, correo, telefono" },
        { icon: Building2, label: "Datos del negocio", description: "RFC, direccion fiscal" },
        { icon: CreditCard, label: "Metodos de pago", description: "Tarjetas y cuentas bancarias" },
      ]
    },
    {
      section: "Seguridad",
      items: [
        { icon: Shield, label: "Cambiar contrasena", description: "Actualiza tu contrasena" },
        { icon: Smartphone, label: "Autenticacion biometrica", description: "Face ID / Huella", toggle: true, value: biometric, onChange: setBiometric },
      ]
    },
    {
      section: "Preferencias",
      items: [
        { icon: Bell, label: "Notificaciones", description: "Alertas y avisos", toggle: true, value: notifications, onChange: setNotifications },
        { icon: Palette, label: "Personalizar apariencia", description: "Colores, fuentes y estilos", action: onOpenThemeCustomization },
      ]
    },
    {
      section: "Soporte",
      items: [
        { icon: HelpCircle, label: "Centro de ayuda", description: "Preguntas frecuentes" },
        { icon: FileText, label: "Terminos y condiciones", description: "Documentos legales" },
      ]
    },
  ]

  return (
    <div className="min-h-screen pb-24" style={{ backgroundColor: "var(--theme-background, #F8FAFC)" }}>
      {/* Header */}
      <div style={{ background: "linear-gradient(135deg, var(--theme-primary, #000D94), var(--theme-primary, #000D94), #0A1628)" }}>
        <div className="px-4 pt-4 pb-6">
          <div className="flex items-center justify-between mb-6">
            <CloseButton 
              variant="back"
              buttonStyle="default"
              size="md"
              onAction={onBack}
            />
            <span className="text-white font-medium">Mi Perfil</span>
            <Button
              variant="ghost"
              size="icon"
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20"
            >
              <Edit2 className="w-5 h-5 text-white" />
            </Button>
          </div>

          {/* Profile Card */}
          <div className="flex flex-col items-center">
            <div className="relative">
              <div 
                className="w-24 h-24 rounded-full p-1"
                style={{ background: "linear-gradient(135deg, var(--theme-secondary, #0BBD33), var(--theme-primary, #000D94))" }}
              >
                <div 
                  className="w-full h-full rounded-full flex items-center justify-center"
                  style={{ backgroundColor: "var(--theme-card, #FFFFFF)" }}
                >
                  <span 
                    className="text-3xl font-bold"
                    style={{ color: "var(--theme-primary, #000D94)" }}
                  >
                    JM
                  </span>
                </div>
              </div>
              <button 
                className="absolute bottom-0 right-0 w-8 h-8 rounded-full flex items-center justify-center shadow-lg"
                style={{ backgroundColor: "var(--theme-secondary, #0BBD33)" }}
              >
                <Camera className="w-4 h-4 text-white" />
              </button>
            </div>
            <h2 className="text-xl font-bold text-white mt-4">Juan Martinez</h2>
            <p className="text-white/70 text-sm">Abarrotes La Esperanza</p>
            
            {/* Quick Stats */}
            <div className="flex gap-4 sm:gap-6 mt-5 sm:mt-6 flex-wrap justify-center">
              <div className="text-center min-w-[60px]">
                <p className="text-lg sm:text-2xl font-bold text-white">156</p>
                <p className="text-[10px] sm:text-xs text-white/60">Transacciones</p>
              </div>
              <div className="w-px bg-white/20 self-stretch hidden sm:block" />
              <div className="text-center min-w-[60px]">
                <p className="text-lg sm:text-2xl font-bold text-white">$45.2K</p>
                <p className="text-[10px] sm:text-xs text-white/60">Este mes</p>
              </div>
              <div className="w-px bg-white/20 self-stretch hidden sm:block" />
              <div className="text-center min-w-[60px]">
                <p className="text-lg sm:text-2xl font-bold" style={{ color: "var(--theme-secondary, #0BBD33)" }}>Activo</p>
                <p className="text-[10px] sm:text-xs text-white/60">Estatus</p>
              </div>
            </div>
          </div>
        </div>

        {/* Curved bottom */}
        <div 
          className="h-6 rounded-t-3xl" 
          style={{ backgroundColor: "var(--theme-background, #F8FAFC)" }}
        />
      </div>

      {/* Contact Info Card */}
      <div className="px-4 -mt-2">
        <div 
          className="rounded-2xl shadow-sm p-4"
          style={{ backgroundColor: "var(--theme-card, #FFFFFF)" }}
        >
          <h3 className="text-sm font-semibold mb-3" style={{ color: "var(--theme-text-secondary, #64748B)" }}>
            INFORMACION DE CONTACTO
          </h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ backgroundColor: "rgba(0, 13, 148, 0.1)" }}
              >
                <Mail className="w-5 h-5" style={{ color: "var(--theme-primary, #000D94)" }} />
              </div>
              <div>
                <p className="text-xs" style={{ color: "var(--theme-text-secondary, #64748B)" }}>Correo electronico</p>
                <p className="text-sm font-medium" style={{ color: "var(--theme-text-primary, #0A1628)" }}>juan.martinez@email.com</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ backgroundColor: "rgba(11, 189, 51, 0.1)" }}
              >
                <Phone className="w-5 h-5" style={{ color: "var(--theme-secondary, #0BBD33)" }} />
              </div>
              <div>
                <p className="text-xs" style={{ color: "var(--theme-text-secondary, #64748B)" }}>Telefono</p>
                <p className="text-sm font-medium" style={{ color: "var(--theme-text-primary, #0A1628)" }}>+52 55 1234 5678</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center">
                <MapPin className="w-5 h-5 text-amber-500" />
              </div>
              <div>
                <p className="text-xs" style={{ color: "var(--theme-text-secondary, #64748B)" }}>Ubicacion</p>
                <p className="text-sm font-medium" style={{ color: "var(--theme-text-primary, #0A1628)" }}>Ciudad de Mexico, Mexico</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Menu Sections */}
      <div className="px-4 mt-4 space-y-4">
        {menuItems.map((section) => (
          <div 
            key={section.section} 
            className="rounded-2xl shadow-sm overflow-hidden"
            style={{ backgroundColor: "var(--theme-card, #FFFFFF)" }}
          >
            <h3 className="text-xs font-semibold px-4 pt-4 pb-2" style={{ color: "var(--theme-text-secondary, #64748B)" }}>
              {section.section.toUpperCase()}
            </h3>
            <div className="divide-y divide-gray-50">
              {section.items.map((item) => {
                const hasAction = 'action' in item && item.action
                const hasToggle = 'toggle' in item && item.toggle
                
                if (hasToggle) {
                  return (
                    <div
                      key={item.label}
                      className="w-full flex items-center justify-between p-4"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                          <item.icon className="w-5 h-5 text-gray-600" />
                        </div>
                        <div className="text-left">
                          <p className="text-sm font-medium" style={{ color: "var(--theme-text-primary, #0A1628)" }}>{item.label}</p>
                          <p className="text-xs" style={{ color: "var(--theme-text-secondary, #64748B)" }}>{item.description}</p>
                        </div>
                      </div>
                      <Switch
                        checked={item.value}
                        onCheckedChange={item.onChange}
                        className="data-[state=checked]:bg-[var(--theme-secondary)]"
                      />
                    </div>
                  )
                }
                
                return (
                  <button
                    key={item.label}
                    onClick={hasAction ? item.action : undefined}
                    className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-10 h-10 rounded-full flex items-center justify-center"
                        style={{ 
                          backgroundColor: item.icon === Palette 
                            ? "rgba(139, 92, 246, 0.1)" 
                            : "rgba(100, 116, 139, 0.1)" 
                        }}
                      >
                        <item.icon 
                          className="w-5 h-5" 
                          style={{ 
                            color: item.icon === Palette 
                              ? "#8B5CF6" 
                              : "var(--theme-text-secondary, #64748B)" 
                          }} 
                        />
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-medium" style={{ color: "var(--theme-text-primary, #0A1628)" }}>{item.label}</p>
                        <p className="text-xs" style={{ color: "var(--theme-text-secondary, #64748B)" }}>{item.description}</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5" style={{ color: "var(--theme-text-secondary, #64748B)", opacity: 0.5 }} />
                  </button>
                )
              })}
            </div>
          </div>
        ))}

        {/* Logout Button */}
        <button className="w-full flex items-center justify-center gap-2 p-4 bg-red-50 rounded-2xl hover:bg-red-100 transition-colors">
          <LogOut className="w-5 h-5 text-red-500" />
          <span className="text-red-500 font-medium">Cerrar sesion</span>
        </button>

        {/* App Version */}
        <div className="flex flex-col items-center py-6">
          <CTCPayLogo size="sm" />
          <p className="text-xs mt-2" style={{ color: "var(--theme-text-secondary, #64748B)" }}>Version 1.0.0</p>
        </div>
      </div>
    </div>
  )
}

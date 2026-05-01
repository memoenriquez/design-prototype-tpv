"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
import { CloseButton } from "@/components/ui/close-button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
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
  Palette,
  ServerCog,
  type LucideIcon
} from "lucide-react"
import { CTCPayLogo } from "./ctcpay-logo"

interface ProfilePageProps {
  onBack: () => void
  onOpenThemeCustomization?: () => void
  onOpenBackendStrategy?: () => void
}

interface ProfileMenuItem {
  icon: LucideIcon
  label: string
  description: string
  toggle?: boolean
  value?: boolean
  onChange?: (value: boolean) => void
  action?: () => void
  status?: string
}

interface ProfileMenuSection {
  section: string
  items: ProfileMenuItem[]
}

export function ProfilePage({ onBack, onOpenThemeCustomization, onOpenBackendStrategy }: ProfilePageProps) {
  const [notifications, setNotifications] = useState(true)
  const [biometric, setBiometric] = useState(true)
  const [dialogMessage, setDialogMessage] = useState<string | null>(null)

  const menuItems: ProfileMenuSection[] = [
    {
      section: "Cuenta",
      items: [
        { icon: User, label: "Datos personales", description: "Nombre, correo, telefono", status: "Proximamente" },
        { icon: Building2, label: "Datos del negocio", description: "RFC, direccion fiscal", status: "Proximamente" },
        { icon: CreditCard, label: "Metodos de pago", description: "Tarjetas y cuentas bancarias", status: "Proximamente" },
      ]
    },
    {
      section: "Seguridad",
      items: [
        { icon: Shield, label: "Cambiar contrasena", description: "Actualiza tu contrasena", status: "Requiere auth" },
        { icon: Smartphone, label: "Autenticacion biometrica", description: "Face ID / Huella", toggle: true, value: biometric, onChange: setBiometric },
      ]
    },
    {
      section: "Preferencias",
      items: [
        { icon: Bell, label: "Notificaciones", description: "Alertas y avisos", toggle: true, value: notifications, onChange: setNotifications },
        { icon: Palette, label: "Personalizar apariencia", description: "Colores, fuentes y estilos", action: onOpenThemeCustomization },
        { icon: ServerCog, label: "Estado de integraciones", description: "Backend, auth y proveedores", action: onOpenBackendStrategy },
      ]
    },
    {
      section: "Soporte",
      items: [
        { icon: HelpCircle, label: "Centro de ayuda", description: "Preguntas frecuentes", status: "Proximamente" },
        { icon: FileText, label: "Terminos y condiciones", description: "Documentos legales", status: "Proximamente" },
      ]
    },
  ]

  return (
    <div className="min-h-screen pb-24" style={{ backgroundColor: "var(--theme-background)" }}>
      {/* Header */}
      <div style={{ background: "linear-gradient(135deg, var(--theme-primary), rgba(var(--theme-primary-rgb), 0.9))" }}>
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
              className="size-10 rounded-full bg-white/10 hover:bg-white/20"
              aria-label="Editar perfil"
              onClick={() => setDialogMessage("La edicion de perfil esta marcada como pendiente hasta conectar autenticacion y base de datos.")}
            >
              <Edit2 className="text-white" data-icon="inline-start" />
            </Button>
          </div>

          {/* Profile Card */}
          <div className="flex flex-col items-center">
            <div className="relative">
              <div 
                className="size-24 rounded-full p-1"
                style={{ background: "linear-gradient(135deg, var(--theme-secondary), var(--theme-primary))" }}
              >
                <Avatar className="size-full">
                  <AvatarFallback
                    className="text-3xl font-bold"
                    style={{
                      backgroundColor: "var(--theme-card)",
                      color: "var(--theme-primary)",
                    }}
                  >
                    JM
                  </AvatarFallback>
                </Avatar>
              </div>
              <button 
                type="button"
                className="absolute right-0 bottom-0 flex size-8 items-center justify-center rounded-full shadow-lg"
                style={{ backgroundColor: "var(--theme-secondary)" }}
                aria-label="Cambiar foto de perfil"
                onClick={() => setDialogMessage("La foto de perfil se habilitara cuando el perfil tenga almacenamiento persistente.")}
              >
                <Camera className="size-4 text-white" />
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
              <Separator orientation="vertical" className="hidden h-auto self-stretch bg-white/20 sm:block" />
              <div className="text-center min-w-[60px]">
                <p className="text-lg sm:text-2xl font-bold text-white">$45.2K</p>
                <p className="text-[10px] sm:text-xs text-white/60">Este mes</p>
              </div>
              <Separator orientation="vertical" className="hidden h-auto self-stretch bg-white/20 sm:block" />
              <div className="text-center min-w-[60px]">
                <p className="text-lg sm:text-2xl font-bold" style={{ color: "var(--theme-secondary)" }}>Activo</p>
                <p className="text-[10px] sm:text-xs text-white/60">Estatus</p>
              </div>
            </div>
          </div>
        </div>

        {/* Curved bottom */}
        <div 
          className="h-6 rounded-t-3xl" 
          style={{ backgroundColor: "var(--theme-background)" }}
        />
      </div>

      {/* Contact Info Card */}
      <div className="px-4 -mt-2">
        <div 
          className="rounded-2xl shadow-sm p-4"
          style={{ backgroundColor: "var(--theme-card)" }}
        >
          <h3 className="mb-3 text-sm font-semibold" style={{ color: "var(--theme-text-secondary)" }}>
            INFORMACION DE CONTACTO
          </h3>
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div 
                className="flex size-10 items-center justify-center rounded-full"
                style={{ backgroundColor: "rgba(var(--theme-primary-rgb), 0.1)" }}
              >
                <Mail className="size-5" style={{ color: "var(--theme-primary)" }} />
              </div>
              <div>
                <p className="text-xs" style={{ color: "var(--theme-text-secondary)" }}>Correo electronico</p>
                <p className="text-sm font-medium" style={{ color: "var(--theme-text-primary)" }}>juan.martinez@email.com</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div 
                className="flex size-10 items-center justify-center rounded-full"
                style={{ backgroundColor: "rgba(var(--theme-secondary-rgb), 0.1)" }}
              >
                <Phone className="size-5" style={{ color: "var(--theme-secondary)" }} />
              </div>
              <div>
                <p className="text-xs" style={{ color: "var(--theme-text-secondary)" }}>Telefono</p>
                <p className="text-sm font-medium" style={{ color: "var(--theme-text-primary)" }}>+52 55 1234 5678</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-full bg-muted">
                <MapPin className="size-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-xs" style={{ color: "var(--theme-text-secondary)" }}>Ubicacion</p>
                <p className="text-sm font-medium" style={{ color: "var(--theme-text-primary)" }}>Ciudad de Mexico, Mexico</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Menu Sections */}
      <div className="flex flex-col gap-4 px-4 mt-4">
        {menuItems.map((section) => (
          <div 
            key={section.section} 
            className="rounded-2xl shadow-sm overflow-hidden"
            style={{ backgroundColor: "var(--theme-card)" }}
          >
            <h3 className="px-4 pt-4 pb-2 text-xs font-semibold" style={{ color: "var(--theme-text-secondary)" }}>
              {section.section.toUpperCase()}
            </h3>
            <div className="divide-y divide-gray-50">
              {section.items.map((item) => {
                const action = 'action' in item ? item.action : undefined
                const hasAction = Boolean(action)
                const hasToggle = 'toggle' in item && item.toggle
                
                if (hasToggle) {
                  return (
                    <div
                      key={item.label}
                      className="w-full flex items-center justify-between p-4"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex size-10 items-center justify-center rounded-full bg-gray-100">
                          <item.icon className="size-5 text-gray-600" />
                        </div>
                        <div className="text-left">
                          <p className="text-sm font-medium" style={{ color: "var(--theme-text-primary)" }}>{item.label}</p>
                          <p className="text-xs" style={{ color: "var(--theme-text-secondary)" }}>{item.description}</p>
                        </div>
                      </div>
                      <Switch
                        checked={item.value ?? false}
                        onCheckedChange={item.onChange}
                        className="data-[state=checked]:bg-[var(--theme-secondary)]"
                      />
                    </div>
                  )
                }
                
                const rowContent = (
                  <>
                    <div className="flex items-center gap-3">
                      <div 
                        className="flex size-10 items-center justify-center rounded-full"
                        style={{ 
                          backgroundColor: item.icon === Palette 
                            ? "rgba(var(--theme-primary-rgb), 0.1)" 
                            : "rgba(100, 116, 139, 0.1)" 
                        }}
                      >
                        <item.icon 
                          className="size-5" 
                          style={{ 
                            color: item.icon === Palette 
                              ? "var(--theme-primary)" 
                              : "var(--theme-text-secondary)" 
                          }} 
                        />
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-medium" style={{ color: "var(--theme-text-primary)" }}>{item.label}</p>
                        <p className="text-xs" style={{ color: "var(--theme-text-secondary)" }}>{item.description}</p>
                      </div>
                    </div>
                    {item.status ? (
                      <Badge variant="outline" className="shrink-0 rounded-full text-[10px]">
                        {item.status}
                      </Badge>
                    ) : (
                      <ChevronRight className="size-5" style={{ color: "var(--theme-text-secondary)", opacity: 0.5 }} />
                    )}
                  </>
                )

                if (hasAction) {
                  return (
                    <button
                      key={item.label}
                      type="button"
                      onClick={action}
                      className="flex w-full items-center justify-between p-4 transition-colors hover:bg-gray-50"
                    >
                      {rowContent}
                    </button>
                  )
                }

                return (
                  <div
                    key={item.label}
                    className="flex w-full items-center justify-between p-4 opacity-70"
                    aria-disabled="true"
                  >
                    {rowContent}
                  </div>
                )
              })}
            </div>
          </div>
        ))}

        {/* Logout Button */}
        <button
          type="button"
          onClick={() => setDialogMessage("Cerrar sesion requiere un proveedor de autenticacion. El prototipo todavia no crea sesiones reales.")}
          className="w-full flex items-center justify-center gap-2 p-4 bg-red-50 rounded-2xl hover:bg-red-100 transition-colors"
        >
          <LogOut className="size-5 text-red-500" />
          <span className="text-red-500 font-medium">Cerrar sesion</span>
        </button>

        {/* App Version */}
        <div className="flex flex-col items-center py-6">
          <CTCPayLogo size="sm" />
          <p className="mt-2 text-xs" style={{ color: "var(--theme-text-secondary)" }}>Version 1.0.0</p>
        </div>
      </div>

      <Dialog open={Boolean(dialogMessage)} onOpenChange={(open) => !open && setDialogMessage(null)}>
        <DialogContent className="w-[calc(100%-2rem)] max-w-sm rounded-3xl border-0 bg-white">
          <DialogHeader>
            <DialogTitle>Flujo pendiente</DialogTitle>
            <DialogDescription>{dialogMessage}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              className="w-full rounded-xl bg-[var(--theme-primary)] text-white hover:opacity-95"
              onClick={() => setDialogMessage(null)}
            >
              Entendido
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

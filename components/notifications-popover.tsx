"use client"

import { type KeyboardEvent, useState } from "react"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Bell, CheckCircle2, AlertCircle, Info, Gift, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { Separator } from "@/components/ui/separator"

interface Notification {
  id: string
  type: "success" | "warning" | "info" | "promo"
  title: string
  message: string
  time: string
  read: boolean
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "success",
    title: "Deposito recibido",
    message: "Se acreditaron $5,000.00 a tu saldo",
    time: "Hace 5 min",
    read: false,
  },
  {
    id: "2",
    type: "promo",
    title: "Promocion especial",
    message: "Gana 2% extra en recargas Telcel hoy",
    time: "Hace 1 hora",
    read: false,
  },
  {
    id: "3",
    type: "warning",
    title: "Saldo bajo",
    message: "Tu saldo de tiempo aire esta por debajo de $500",
    time: "Hace 2 horas",
    read: true,
  },
  {
    id: "4",
    type: "info",
    title: "Actualizacion disponible",
    message: "Nueva version de la app disponible",
    time: "Ayer",
    read: true,
  },
  {
    id: "5",
    type: "success",
    title: "Meta alcanzada",
    message: "Completaste 100 transacciones este mes",
    time: "Hace 2 dias",
    read: true,
  },
]

const typeConfig = {
  success: {
    icon: CheckCircle2,
    bgClass: "bg-ctcpay-green/10",
    iconClass: "text-ctcpay-green",
  },
  warning: {
    icon: AlertCircle,
    bgClass: "bg-amber-500/10",
    iconClass: "text-amber-500",
  },
  info: {
    icon: Info,
    bgClass: "bg-ctcpay-blue/10",
    iconClass: "text-ctcpay-blue",
  },
  promo: {
    icon: Gift,
    bgClass: "bg-pink-500/10",
    iconClass: "text-pink-500",
  },
}

export function NotificationsPopover() {
  const [notifications, setNotifications] = useState(mockNotifications)
  const [open, setOpen] = useState(false)
  
  const unreadCount = notifications.filter(n => !n.read).length

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    )
  }

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  const handleNotificationKeyDown = (
    event: KeyboardEvent<HTMLDivElement>,
    id: string
  ) => {
    if (event.key !== "Enter" && event.key !== " ") return

    event.preventDefault()
    markAsRead(id)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative size-10 rounded-full bg-white/10 hover:bg-white/20"
          aria-label={`Notificaciones${unreadCount > 0 ? `, ${unreadCount} sin leer` : ""}`}
        >
          <Bell className="text-white" data-icon="inline-start" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 size-5 rounded-full border-0 bg-red-500 p-0 text-[10px] font-bold text-white animate-pulse">
              {unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-80 p-0 bg-white border-0 rounded-2xl shadow-2xl overflow-hidden"
        align="end"
        sideOffset={8}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4">
          <h3 className="font-semibold text-ctcpay-dark">Notificaciones</h3>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="text-xs text-ctcpay-blue hover:text-ctcpay-blue/80 h-auto p-0"
              onClick={markAllAsRead}
            >
              Marcar todas como leidas
            </Button>
          )}
        </div>
        <Separator />

        {/* Notifications List */}
        <ScrollArea className="h-[320px]">
          {notifications.length === 0 ? (
            <Empty className="min-h-[320px] border-0 p-6">
              <EmptyHeader>
                <EmptyMedia variant="icon" className="rounded-full">
                  <Bell />
                </EmptyMedia>
                <EmptyTitle>No tienes notificaciones</EmptyTitle>
                <EmptyDescription>
                  Las alertas y avisos importantes apareceran aqui.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          ) : (
            <div className="divide-y divide-gray-50">
              {notifications.map((notification) => {
                const config = typeConfig[notification.type]
                const Icon = config.icon
                
                return (
                  <div
                    key={notification.id}
                    role="button"
                    tabIndex={0}
                    aria-label={`Marcar como leida: ${notification.title}`}
                    className={cn(
                      "relative p-4 hover:bg-gray-50 focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-inset focus-visible:outline-none transition-colors cursor-pointer group",
                      !notification.read && "bg-ctcpay-blue/5"
                    )}
                    onClick={() => markAsRead(notification.id)}
                    onKeyDown={(event) =>
                      handleNotificationKeyDown(event, notification.id)
                    }
                  >
                    <div className="flex gap-3">
                      <div className={cn(
                        "size-10 rounded-full flex items-center justify-center shrink-0",
                        config.bgClass
                      )}>
                        <Icon className={cn("size-5", config.iconClass)} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className={cn(
                            "text-sm text-ctcpay-dark truncate",
                            !notification.read && "font-semibold"
                          )}>
                            {notification.title}
                          </p>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              removeNotification(notification.id)
                            }}
                            onKeyDown={(e) => e.stopPropagation()}
                            aria-label={`Eliminar notificacion: ${notification.title}`}
                            className="opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100 focus-visible:opacity-100 focus-visible:outline-none"
                          >
                            <X className="size-4 text-gray-400 hover:text-gray-600" />
                          </button>
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">
                          {notification.message}
                        </p>
                        <p className="text-[10px] text-gray-400 mt-1">
                          {notification.time}
                        </p>
                      </div>
                    </div>
                    {!notification.read && (
                      <div className="absolute left-1.5 top-1/2 size-2 -translate-y-1/2 rounded-full bg-ctcpay-blue" />
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </ScrollArea>

        {/* Footer */}
        <Separator />
        <div className="p-3 bg-gray-50">
          <Button
            variant="ghost"
            className="w-full text-sm text-ctcpay-blue hover:text-ctcpay-blue/80 hover:bg-ctcpay-blue/10"
          >
            Ver todas las notificaciones
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}

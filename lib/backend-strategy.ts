export interface BackendStrategyItem {
  area: string
  decision: string
  nextStep: string
}

export const backendStrategy: BackendStrategyItem[] = [
  {
    area: "Autenticacion",
    decision: "Supabase Auth para sesiones, recuperacion de contrasena y cierre de sesion.",
    nextStep: "Crear middleware y proteger las vistas de perfil, historial e integraciones.",
  },
  {
    area: "Datos operativos",
    decision: "Supabase Postgres para transacciones, saldos, comercios y notificaciones.",
    nextStep: "Persistir cada operacion exitosa y calcular saldos desde registros.",
  },
  {
    area: "Proveedores",
    decision: "Next.js API routes como capa adaptadora para TAE, servicios, telepeaje, QR, vales y tarjetas.",
    nextStep: "Reemplazar simulaciones por handlers server-side con validacion y estados pendientes.",
  },
  {
    area: "Pagos de plataforma",
    decision: "Stripe solo para cobros de suscripcion o facturacion del comercio, no para los rieles POS simulados.",
    nextStep: "Agregar webhooks cuando exista un plan comercial definido.",
  },
]

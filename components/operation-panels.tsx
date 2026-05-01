"use client"

import { useMemo, useState, type ReactNode } from "react"
import {
  Car,
  QrCode,
  ReceiptText,
  Wallet,
} from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import {
  ConfirmTransactionModal,
  TransactionModal,
  type TransactionDetails,
  type TransactionStatus,
} from "@/components/transaction-modal"
import { useTransactions } from "@/contexts/transactions-context"
import { moneyFormatter } from "@/lib/formatters"
import { cn } from "@/lib/utils"

const quickAmounts = [100, 200, 300, 500, 1000]

interface ProviderOption {
  id: string
  name: string
  description: string
}

const qrMethods: ProviderOption[] = [
  { id: "ctc-qr", name: "CTC Pay QR", description: "Cobro desde app bancaria" },
  { id: "spei", name: "SPEI QR", description: "Referencia bancaria inmediata" },
]

const tollProviders: ProviderOption[] = [
  { id: "iave", name: "TAG IAVE", description: "Autopistas CAPUFE" },
  { id: "pase", name: "PASE", description: "Tag urbano y carretera" },
  { id: "televia", name: "Televia", description: "Recarga de telepeaje" },
]

const voucherIssuers: ProviderOption[] = [
  { id: "edenred", name: "Edenred", description: "Vales de despensa" },
  { id: "pluxee", name: "Pluxee", description: "Tarjeta o código" },
  { id: "si-vale", name: "Sí Vale", description: "Autorización manual" },
]

const parseAmount = (value: string) => Number.parseFloat(value || "0")

const formatAmount = (value: string) => moneyFormatter.format(parseAmount(value))

const buildReference = (prefix: string) => `${prefix}-${Date.now().toString().slice(-8)}`

interface OptionPickerProps {
  label: string
  options: ProviderOption[]
  selectedId: string
  onSelect: (id: string) => void
}

const OptionPicker = ({ label, options, selectedId, onSelect }: OptionPickerProps) => (
  <Field>
    <FieldLabel>{label}</FieldLabel>
    <ToggleGroup
      type="single"
      value={selectedId}
      onValueChange={(value) => {
        if (value) onSelect(value)
      }}
      className="grid w-full grid-cols-1 gap-2 rounded-none sm:grid-cols-1"
    >
      {options.map((option) => (
        <ToggleGroupItem
          key={option.id}
          value={option.id}
          aria-label={option.name}
          className={cn(
            "h-auto justify-start rounded-2xl border border-transparent bg-muted p-3 text-left data-[state=on]:border-[var(--theme-primary)] data-[state=on]:bg-[rgba(var(--theme-primary-rgb),0.08)] data-[state=on]:text-[var(--theme-primary)]",
            "first:rounded-2xl last:rounded-2xl"
          )}
        >
          <span className="min-w-0">
            <span className="block truncate text-sm font-bold">{option.name}</span>
            <span className="block truncate text-xs text-muted-foreground">{option.description}</span>
          </span>
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  </Field>
)

interface AmountPickerProps {
  amount: string
  onAmountChange: (amount: string) => void
}

const AmountPicker = ({ amount, onAmountChange }: AmountPickerProps) => (
  <Field>
    <FieldLabel>Monto</FieldLabel>
    <Input
      inputMode="decimal"
      value={amount}
      onChange={(event) => onAmountChange(event.target.value.replace(/[^\d.]/g, ""))}
      placeholder="0.00"
      aria-label="Monto de la operación"
      className="h-12 rounded-2xl bg-card text-lg font-bold"
    />
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
      {quickAmounts.map((quickAmount) => (
        <Button
          key={quickAmount}
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onAmountChange(String(quickAmount))}
          className="shrink-0 rounded-full border-gray-200 bg-card text-xs font-semibold text-[var(--theme-primary)]"
        >
          ${quickAmount}
        </Button>
      ))}
    </div>
  </Field>
)

interface OperationHeaderProps {
  eyebrow: string
  title: string
  icon: ReactNode
  tone?: "primary" | "secondary"
}

const OperationHeader = ({ eyebrow, title, icon, tone = "primary" }: OperationHeaderProps) => {
  const gradient = tone === "secondary"
    ? "linear-gradient(135deg, var(--theme-secondary), rgba(var(--theme-secondary-rgb), 0.86))"
    : "linear-gradient(135deg, var(--theme-primary), rgba(var(--theme-primary-rgb), 0.9))"

  return (
    <CardHeader className="relative overflow-hidden p-5 text-white" style={{ background: gradient }}>
      <div className="absolute top-0 right-0 size-28 translate-x-8 -translate-y-10 rounded-full bg-white/10 blur-2xl" />
      <div className="absolute bottom-0 left-0 size-20 -translate-x-6 translate-y-8 rounded-full bg-white/10 blur-xl" />
      <div className="relative z-10 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-medium text-white/70">{eyebrow}</p>
          <CardTitle className="truncate text-xl font-bold">{title}</CardTitle>
        </div>
        <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-white/15 shadow-lg">
          {icon}
        </div>
      </div>
    </CardHeader>
  )
}

export function CodigoQrPanel() {
  const { addTransaction } = useTransactions()
  const [amount, setAmount] = useState("")
  const [selectedMethod, setSelectedMethod] = useState(qrMethods[0].id)
  const [reference, setReference] = useState(buildReference("QR"))
  const [showConfirm, setShowConfirm] = useState(false)
  const [showResult, setShowResult] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [transactionStatus, setTransactionStatus] = useState<TransactionStatus>("processing")

  const selectedMethodData = qrMethods.find((method) => method.id === selectedMethod)
  const amountValue = parseAmount(amount)

  const transactionDetails: TransactionDetails = {
    type: `Cobro ${selectedMethodData?.name || "QR"}`,
    amount: `$${formatAmount(amount)}`,
    recipient: "Cliente mostrador",
    commission: "$0.00",
    reference,
    date: new Date().toLocaleString("es-MX", { dateStyle: "medium", timeStyle: "short" }),
  }

  const handleComplete = (success: boolean) => {
    setIsProcessing(false)
    setTransactionStatus(success ? "success" : "error")

    if (!success) return

    addTransaction({
      type: "qr",
      description: `Cobro QR - ${selectedMethodData?.name || "QR"}`,
      amount: amountValue,
      reference,
    })
  }

  const handleConfirmTransaction = () => {
    setReference(buildReference("QR"))
    setIsProcessing(true)
    setShowConfirm(false)
    setShowResult(true)
    setTransactionStatus("processing")
    setTimeout(() => handleComplete(Math.random() > 0.08), 2200)
  }

  const handleNewTransaction = () => {
    setShowResult(false)
    setAmount("")
    setReference(buildReference("QR"))
  }

  return (
    <>
      <div className="flex flex-col gap-4 animate-slide-up">
        <Card className="overflow-hidden rounded-3xl border-0 shadow-xl">
          <OperationHeader
            eyebrow="Cobro sin contacto"
            title="Generar QR de pago"
            icon={<QrCode className="size-6" aria-hidden="true" />}
          />
          <CardContent className="flex flex-col gap-5 p-4">
            <div className="mx-auto grid size-44 place-items-center rounded-3xl bg-muted p-4 ring-1 ring-border/70">
              <div className="flex size-32 flex-col justify-between rounded-2xl bg-card p-3 shadow-inner ring-1 ring-border">
                <div className="grid grid-cols-5 gap-1">
                  {Array.from({ length: 25 }).map((_, index) => (
                    <span
                      key={index}
                      className={cn(
                        "size-4 rounded-[3px] bg-[var(--theme-primary)]",
                        (index + Math.round(amountValue)) % 3 === 0 && "opacity-25"
                      )}
                    />
                  ))}
                </div>
                <p className="text-center text-[10px] font-semibold text-muted-foreground">Vista previa</p>
              </div>
            </div>
            <FieldGroup className="gap-5">
              <OptionPicker
                label="Tipo de QR"
                options={qrMethods}
                selectedId={selectedMethod}
                onSelect={setSelectedMethod}
              />
              <AmountPicker amount={amount} onAmountChange={setAmount} />
            </FieldGroup>
            <Alert className="rounded-2xl border-0 bg-[rgba(var(--theme-primary-rgb),0.06)]">
              <QrCode className="size-4 text-[var(--theme-primary)]" aria-hidden="true" />
              <AlertTitle>QR de demostración</AlertTitle>
              <AlertDescription>
                Esta vista simula el flujo de cobro. La referencia final se genera al confirmar la operación.
              </AlertDescription>
            </Alert>
            <Button
              className="h-12 rounded-2xl bg-[var(--theme-secondary)] text-base font-bold text-white shadow-xl hover:opacity-95"
              disabled={amountValue <= 0}
              onClick={() => setShowConfirm(true)}
            >
              <QrCode data-icon="inline-start" />
              Generar cobro por ${formatAmount(amount)}
            </Button>
          </CardContent>
        </Card>
      </div>

      <ConfirmTransactionModal
        open={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleConfirmTransaction}
        title="Confirmar Cobro QR"
        details={transactionDetails}
        isLoading={isProcessing}
      />
      <TransactionModal
        open={showResult}
        onClose={() => setShowResult(false)}
        status={transactionStatus}
        title={
          transactionStatus === "success"
            ? "QR Cobrado"
            : transactionStatus === "error"
              ? "QR Expirado"
              : "Esperando Pago..."
        }
        message={
          transactionStatus === "success"
            ? "El pago QR fue confirmado correctamente"
            : transactionStatus === "error"
              ? "No recibimos confirmación del cliente. Genera un nuevo QR."
              : "Validando el pago del cliente"
        }
        details={transactionStatus !== "processing" ? transactionDetails : undefined}
        onRetry={handleConfirmTransaction}
        onNewTransaction={handleNewTransaction}
      />
    </>
  )
}

export function TelepeajePanel() {
  const { addTransaction } = useTransactions()
  const [amount, setAmount] = useState("200")
  const [selectedProvider, setSelectedProvider] = useState(tollProviders[0].id)
  const [tagNumber, setTagNumber] = useState("")
  const [reference, setReference] = useState(buildReference("TAG"))
  const [showConfirm, setShowConfirm] = useState(false)
  const [showResult, setShowResult] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [transactionStatus, setTransactionStatus] = useState<TransactionStatus>("processing")

  const selectedProviderData = tollProviders.find((provider) => provider.id === selectedProvider)
  const amountValue = parseAmount(amount)
  const isFormValid = amountValue > 0 && tagNumber.trim().length >= 6

  const transactionDetails: TransactionDetails = {
    type: `Recarga ${selectedProviderData?.name || "Telepeaje"}`,
    amount: `$${formatAmount(amount)}`,
    recipient: tagNumber,
    commission: "$0.00",
    reference,
    date: new Date().toLocaleString("es-MX", { dateStyle: "medium", timeStyle: "short" }),
  }

  const handleComplete = (success: boolean) => {
    setIsProcessing(false)
    setTransactionStatus(success ? "success" : "error")

    if (!success) return

    addTransaction({
      type: "telepeaje",
      description: `${selectedProviderData?.name || "Telepeaje"} - ${tagNumber}`,
      amount: amountValue,
      reference,
    })
  }

  const handleConfirmTransaction = () => {
    setReference(buildReference("TAG"))
    setIsProcessing(true)
    setShowConfirm(false)
    setShowResult(true)
    setTransactionStatus("processing")
    setTimeout(() => handleComplete(Math.random() > 0.1), 2400)
  }

  const handleNewTransaction = () => {
    setShowResult(false)
    setTagNumber("")
    setAmount("200")
    setReference(buildReference("TAG"))
  }

  return (
    <>
      <div className="flex flex-col gap-4 animate-slide-up">
        <Card className="overflow-hidden rounded-3xl border-0 shadow-xl">
          <OperationHeader
            eyebrow="Recarga de tag"
            title="Telepeaje"
            icon={<Car className="size-6" aria-hidden="true" />}
            tone="secondary"
          />
          <CardContent className="flex flex-col gap-5 p-4">
            <FieldGroup className="gap-5">
              <OptionPicker
                label="Proveedor"
                options={tollProviders}
                selectedId={selectedProvider}
                onSelect={setSelectedProvider}
              />
              <Field>
                <FieldLabel>Número de TAG</FieldLabel>
                <Input
                  value={tagNumber}
                  onChange={(event) => setTagNumber(event.target.value.toUpperCase())}
                  placeholder="TAG000000"
                  aria-label="Número de TAG"
                  className="h-12 rounded-2xl bg-card font-mono font-bold"
                />
                <FieldDescription>Usa al menos 6 caracteres para validar el tag.</FieldDescription>
              </Field>
              <AmountPicker amount={amount} onAmountChange={setAmount} />
            </FieldGroup>
            <Alert className="rounded-2xl border-0 bg-muted">
              <Car className="size-4" aria-hidden="true" />
              <AlertTitle>Confirmación del proveedor</AlertTitle>
              <AlertDescription>
                La recarga puede quedar pendiente si el proveedor no responde de inmediato.
              </AlertDescription>
            </Alert>
            <Button
              className="h-12 rounded-2xl bg-[var(--theme-secondary)] text-base font-bold text-white shadow-xl hover:opacity-95"
              disabled={!isFormValid}
              onClick={() => setShowConfirm(true)}
            >
              <Car data-icon="inline-start" />
              Recargar ${formatAmount(amount)}
            </Button>
          </CardContent>
        </Card>
      </div>

      <ConfirmTransactionModal
        open={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleConfirmTransaction}
        title="Confirmar Telepeaje"
        details={transactionDetails}
        isLoading={isProcessing}
      />
      <TransactionModal
        open={showResult}
        onClose={() => setShowResult(false)}
        status={transactionStatus}
        title={
          transactionStatus === "success"
            ? "Recarga Exitosa"
            : transactionStatus === "error"
              ? "Recarga No Confirmada"
              : "Procesando Recarga..."
        }
        message={
          transactionStatus === "success"
            ? "El saldo del TAG fue actualizado"
            : transactionStatus === "error"
              ? "El proveedor no confirmó la recarga. Revisa el TAG e intenta de nuevo."
              : "Validando la referencia con el proveedor"
        }
        details={transactionStatus !== "processing" ? transactionDetails : undefined}
        onRetry={handleConfirmTransaction}
        onNewTransaction={handleNewTransaction}
      />
    </>
  )
}

export function ValesPanel() {
  const { addTransaction } = useTransactions()
  const [amount, setAmount] = useState("")
  const [selectedIssuer, setSelectedIssuer] = useState(voucherIssuers[0].id)
  const [authorizationCode, setAuthorizationCode] = useState("")
  const [showConfirm, setShowConfirm] = useState(false)
  const [showResult, setShowResult] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [transactionStatus, setTransactionStatus] = useState<TransactionStatus>("processing")

  const selectedIssuerData = voucherIssuers.find((issuer) => issuer.id === selectedIssuer)
  const amountValue = parseAmount(amount)
  const reference = useMemo(() => buildReference("VAL"), [showConfirm])
  const isFormValid = amountValue > 0 && authorizationCode.trim().length >= 4

  const transactionDetails: TransactionDetails = {
    type: `Vales ${selectedIssuerData?.name || "Despensa"}`,
    amount: `$${formatAmount(amount)}`,
    recipient: selectedIssuerData?.name || "Emisor de vales",
    commission: "$0.00",
    reference: `${reference}-${authorizationCode || "PEND"}`,
    date: new Date().toLocaleString("es-MX", { dateStyle: "medium", timeStyle: "short" }),
  }

  const handleComplete = (success: boolean) => {
    setIsProcessing(false)
    setTransactionStatus(success ? "success" : "error")

    if (!success) return

    addTransaction({
      type: "vales",
      description: `${selectedIssuerData?.name || "Vales"} - autorización ${authorizationCode}`,
      amount: amountValue,
      reference: transactionDetails.reference,
    })
  }

  const handleConfirmTransaction = () => {
    setIsProcessing(true)
    setShowConfirm(false)
    setShowResult(true)
    setTransactionStatus("processing")
    setTimeout(() => handleComplete(Math.random() > 0.12), 2600)
  }

  const handleNewTransaction = () => {
    setShowResult(false)
    setAmount("")
    setAuthorizationCode("")
  }

  return (
    <>
      <div className="flex flex-col gap-4 animate-slide-up">
        <Card className="overflow-hidden rounded-3xl border-0 shadow-xl">
          <OperationHeader
            eyebrow="Aceptación de vales"
            title="Vales de Despensa"
            icon={<Wallet className="size-6" aria-hidden="true" />}
          />
          <CardContent className="flex flex-col gap-5 p-4">
            <div className="rounded-2xl bg-muted p-4">
              <div className="flex items-center gap-3">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-[rgba(var(--theme-primary-rgb),0.08)] text-[var(--theme-primary)]">
                  <Wallet className="size-5" aria-hidden="true" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-medium text-muted-foreground">Emisor seleccionado</p>
                  <p className="truncate text-sm font-bold text-foreground">{selectedIssuerData?.name}</p>
                  <p className="truncate text-xs text-muted-foreground">{selectedIssuerData?.description}</p>
                </div>
              </div>
            </div>
            <FieldGroup className="gap-5">
              <OptionPicker
                label="Emisor"
                options={voucherIssuers}
                selectedId={selectedIssuer}
                onSelect={setSelectedIssuer}
              />
              <Field>
                <FieldLabel>Código de autorización</FieldLabel>
                <Input
                  value={authorizationCode}
                  onChange={(event) => setAuthorizationCode(event.target.value.toUpperCase())}
                  placeholder="AUT-1234"
                  aria-label="Código de autorización del vale"
                  className="h-12 rounded-2xl bg-card font-mono font-bold"
                />
                <FieldDescription>
                  Captura el código impreso, folio de autorización o últimos dígitos autorizados.
                </FieldDescription>
              </Field>
              <AmountPicker amount={amount} onAmountChange={setAmount} />
            </FieldGroup>
            <Alert className="rounded-2xl border-0 bg-[rgba(var(--theme-primary-rgb),0.06)]">
              <ReceiptText className="size-4 text-[var(--theme-primary)]" aria-hidden="true" />
              <AlertTitle>Comprobante requerido</AlertTitle>
              <AlertDescription>
                Conserva el comprobante de compra y valida el saldo con el emisor antes de entregar mercancía.
              </AlertDescription>
            </Alert>
            <Button
              className="h-12 rounded-2xl bg-[var(--theme-secondary)] text-base font-bold text-white shadow-xl hover:opacity-95"
              disabled={!isFormValid}
              onClick={() => setShowConfirm(true)}
            >
              <Wallet data-icon="inline-start" />
              Cobrar vale ${amountValue > 0 ? `$${formatAmount(amount)}` : ""}
            </Button>
          </CardContent>
        </Card>
      </div>

      <ConfirmTransactionModal
        open={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleConfirmTransaction}
        title="Confirmar Vales"
        details={transactionDetails}
        isLoading={isProcessing}
      />
      <TransactionModal
        open={showResult}
        onClose={() => setShowResult(false)}
        status={transactionStatus}
        title={
          transactionStatus === "success"
            ? "Vale Aprobado"
            : transactionStatus === "error"
              ? "Vale Rechazado"
              : "Validando Vale..."
        }
        message={
          transactionStatus === "success"
            ? "El vale fue aceptado y registrado"
            : transactionStatus === "error"
              ? "No se pudo validar el vale. Revisa el código de autorización."
              : "Conectando con el emisor"
        }
        details={transactionStatus !== "processing" ? transactionDetails : undefined}
        onRetry={handleConfirmTransaction}
        onNewTransaction={handleNewTransaction}
      />
    </>
  )
}

import { Order, OrderProduct } from '@/@types/Order'
import type { Dispatch, ReactNode, SetStateAction } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Switch } from '@/components/ui/switch'
import { Check, ChevronLeft, Loader2 } from 'lucide-react'
import OrderTotalsSummary from './OrderTotalsSummary'
import {
  formatCurrency,
  getOrderTotals,
  getServedProductsToPay,
} from '@/lib/orderTotals'

export type SheetStep = 1 | 2 | 3
export type SubmitPhase = 'idle' | 'processing' | 'success' | 'error'
export type OrderAction = 'confirm' | 'charge' | 'close' | null

export type FactusCustomerForm = {
  identification_document_code: string
  identification: string,
  names: string
  company: string
  trade_name: string
  address: string
  email: string
  phone: string
  legal_organization_code: string
  tribute_code: string
  municipality_code: string
  municipality_country: 'CO' | 'EXT'
}

export type FactusPaymentForm = {
  payment_form: string
  payment_method_code: string
  due_date: string
  send_email: boolean
  observation: string
}

type SelectOption = { value: string; label: string }

const SHEET_STEPS = [
  { id: 1 as const, label: 'Orden' },
  { id: 2 as const, label: 'Facturación' },
  { id: 3 as const, label: 'Confirmación' },
]

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  order: Order | null
  pendingAction: OrderAction
  sheetStep: SheetStep
  setSheetStep: (step: SheetStep) => void
  submitPhase: SubmitPhase
  submitError: string | null
  customer: FactusCustomerForm
  setCustomer: Dispatch<SetStateAction<FactusCustomerForm>>
  payment: FactusPaymentForm
  setPayment: Dispatch<SetStateAction<FactusPaymentForm>>
  identificationOptions: SelectOption[]
  legalOrganizationOptions: SelectOption[]
  tributeOptions: SelectOption[]
  paymentMethodOptions: SelectOption[]
  paymentFormOptions: SelectOption[]
  isLegalOrganization: boolean
  isHasBilling: boolean
  generateElectronicInvoice: boolean
  setGenerateElectronicInvoice: Dispatch<SetStateAction<boolean>>
  onContinueStep1: () => void
  onContinueStep2: () => void
  onRetrySubmit: () => void
  onClose: () => void
  onFinish: () => void
}

function getOptionLabel(options: SelectOption[], code: string) {
  return options.find((item) => item.value === code)?.label ?? code
}

function getSheetTitle(action: OrderAction) {
  switch (action) {
    case 'confirm':
      return 'Confirmar pedido'
    case 'charge':
      return 'Cobrar consumo'
    case 'close':
      return 'Cerrar mesa'
    default:
      return 'Pedido'
  }
}

export default function OrderCheckoutSheet({
  open,
  onOpenChange,
  order,
  pendingAction,
  sheetStep,
  setSheetStep,
  submitPhase,
  submitError,
  customer,
  setCustomer,
  payment,
  setPayment,
  identificationOptions,
  legalOrganizationOptions,
  tributeOptions,
  paymentMethodOptions,
  paymentFormOptions,
  isLegalOrganization,
  isHasBilling,
  generateElectronicInvoice,
  setGenerateElectronicInvoice,
  onContinueStep1,
  onContinueStep2,
  onRetrySubmit,
  onClose,
  onFinish,
}: Props) {
  const orderShortId = order?.id.split('-')[0]

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-[420px] sm:w-[560px] flex flex-col gap-0 p-0">
        <div className="px-4 pt-4 pb-3 border-b shrink-0">
          <div className="flex items-center gap-2 mb-3">
            {sheetStep > 1 && sheetStep < 3 && (
              <button
                type="button"
                onClick={() => setSheetStep((sheetStep - 1) as SheetStep)}
                className="p-1 rounded-md hover:bg-gray-100 text-gray-600"
                aria-label="Volver"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
            )}
            <SheetHeader className="p-0 space-y-0 flex-1">
              <SheetTitle className="text-base font-bold text-left">
                {getSheetTitle(pendingAction)}
                {orderShortId && (
                  <span className="text-gray-500 font-normal"> #{orderShortId}</span>
                )}
              </SheetTitle>
              <SheetDescription className="sr-only">Proceso en 3 pasos</SheetDescription>
            </SheetHeader>
          </div>

          <div className="flex items-center justify-between px-1">
            {SHEET_STEPS.map((step, index) => {
              const isCompleted = sheetStep > step.id
              const isCurrent = sheetStep === step.id
              return (
                <div key={step.id} className="flex flex-1 items-center">
                  <div className="flex flex-col items-center flex-1 min-w-0">
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold ${isCompleted
                        ? 'bg-green-700 text-white'
                        : isCurrent
                          ? 'bg-green-700 text-white ring-4 ring-green-100'
                          : 'bg-gray-100 text-gray-400'
                        }`}
                    >
                      {isCompleted ? <Check className="h-4 w-4" /> : step.id}
                    </div>
                    <span
                      className={`mt-1 text-[10px] sm:text-xs font-medium truncate ${isCurrent ? 'text-green-800' : isCompleted ? 'text-gray-600' : 'text-gray-400'
                        }`}
                    >
                      {step.label}
                    </span>
                  </div>
                  {index < SHEET_STEPS.length - 1 && (
                    <div
                      className={`h-0.5 flex-1 mx-1 mb-5 rounded ${sheetStep > step.id ? 'bg-green-700' : 'bg-gray-200'
                        }`}
                    />
                  )}
                </div>
              )
            })}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4">
          {sheetStep === 1 && order && (
            <StepOrderReview
              order={order}
              pendingAction={pendingAction}
              payment={payment}
              setPayment={setPayment}
              paymentMethodOptions={paymentMethodOptions}
              paymentFormOptions={paymentFormOptions}
            />
          )}

          {sheetStep === 2 && pendingAction === 'charge' && (
            <StepBillingForm
              pendingAction={pendingAction}
              customer={customer}
              setCustomer={setCustomer}
              payment={payment}
              setPayment={setPayment}
              identificationOptions={identificationOptions}
              legalOrganizationOptions={legalOrganizationOptions}
              tributeOptions={tributeOptions}
              isLegalOrganization={isLegalOrganization}
              isHasBilling={isHasBilling}
              generateElectronicInvoice={generateElectronicInvoice}
              setGenerateElectronicInvoice={setGenerateElectronicInvoice}
            />
          )}

          {sheetStep === 3 && (
            <StepConfirmation
              submitPhase={submitPhase}
              submitError={submitError}
              pendingAction={pendingAction}
              generateElectronicInvoice={generateElectronicInvoice}
            />
          )}
        </div>

        <SheetFooter
          sheetStep={sheetStep}
          submitPhase={submitPhase}
          order={order}
          payment={payment}
          paymentMethodOptions={paymentMethodOptions}
          paymentFormOptions={paymentFormOptions}
          pendingAction={pendingAction}
          generateElectronicInvoice={generateElectronicInvoice}
          onClose={onClose}
          onContinueStep1={onContinueStep1}
          onContinueStep2={onContinueStep2}
          onRetrySubmit={onRetrySubmit}
          onFinish={onFinish}
        />
      </SheetContent>
    </Sheet>
  )
}

function StepOrderReview({
  order,
  pendingAction,
  payment,
  setPayment,
  paymentMethodOptions,
  paymentFormOptions,
}: {
  order: Order
  pendingAction: OrderAction
  payment: FactusPaymentForm
  setPayment: Dispatch<SetStateAction<FactusPaymentForm>>
  paymentMethodOptions: SelectOption[]
  paymentFormOptions: SelectOption[]
}) {
  const productsToShow =
    pendingAction === 'charge' ? getServedProductsToPay(order.products) : order.products
  const { pendiente } = getOrderTotals(order.products)

  return (
    <div className="space-y-4">
      <div className="rounded-xl border p-4 bg-white">
        <OrderTotalsSummary products={order.products} />
      </div>

      {pendingAction === 'confirm' && (
        <p className="text-sm text-gray-600">
          Al confirmar, la cuenta quedará abierta y los productos pasarán a estado servido.
        </p>
      )}

      {pendingAction === 'close' && (
        <p className="text-sm text-gray-600">
          Todos los productos están pagados o cancelados. Puedes cerrar la mesa.
        </p>
      )}

      {pendingAction === 'charge' && (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3">
          <p className="text-xs text-emerald-800 font-medium">Total a cobrar ahora</p>
          <p className="text-2xl font-bold text-emerald-900">{formatCurrency(pendiente)}</p>
        </div>
      )}

      {pendingAction === 'charge' && (
        <div className="rounded-xl border p-4 space-y-3 bg-white">
          <h4 className="text-sm font-semibold text-gray-800">Método de pago</h4>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Forma de pago">
              <Select
                value={payment.payment_form}
                onValueChange={(value) => setPayment((prev) => ({ ...prev, payment_form: value }))}
              >
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Seleccionar" />
                </SelectTrigger>
                <SelectContent>
                  {paymentFormOptions.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Método de pago">
              <Select
                value={payment.payment_method_code}
                onValueChange={(value) =>
                  setPayment((prev) => ({ ...prev, payment_method_code: value }))
                }
              >
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Seleccionar" />
                </SelectTrigger>
                <SelectContent>
                  {paymentMethodOptions.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Fecha vencimiento" className="col-span-2">
              <Input
                type="date"
                value={payment.due_date}
                onChange={(e) => setPayment((prev) => ({ ...prev, due_date: e.target.value }))}
                className="h-9"
              />
            </Field>
          </div>
        </div>
      )}

      <div>
        <h4 className="text-sm font-semibold text-gray-800 mb-2">
          {pendingAction === 'charge' ? 'Productos a cobrar' : 'Productos'}
        </h4>
        <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1">
          {productsToShow?.map((prod: OrderProduct, idx: number) => (
            <div
              key={idx}
              className="flex justify-between gap-2 border rounded-lg p-3 text-sm bg-white"
            >
              <div className="min-w-0 flex-1">
                <p className="font-medium truncate">{prod.product_snapshot?.name || 'Producto'}</p>
                <p className="text-xs text-gray-500 mt-1">${prod.product_snapshot?.price_before_tax?.toLocaleString()}</p>
                {prod.product_snapshot?.optionsSelected?.length > 0 && (
                  <ul className="text-xs text-gray-500 mt-1">
                    {prod.product_snapshot.optionsSelected.map((opt, i) => (
                      <li key={i}>
                        {opt.variantName}: {opt.optionName}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <p className="font-bold shrink-0">x{prod.quantity}</p>
            </div>
          ))}
        </div>
      </div>



      <div className="rounded-xl bg-gray-50 p-4 space-y-2 text-sm">
        <h4 className="font-semibold text-gray-800">Resumen de pago</h4>
        <div className="flex justify-between text-gray-600">
          <span>Subtotal</span>
          <span>${order.total_price?.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span>Forma</span>
          <span>{getOptionLabel(paymentFormOptions, payment.payment_form)}</span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span>Método</span>
          <span>{getOptionLabel(paymentMethodOptions, payment.payment_method_code)}</span>
        </div>
        <div className="flex justify-between font-bold text-base border-t pt-2 mt-2">
          <span>{pendingAction === 'charge' ? 'A cobrar' : 'Total'}</span>
          <span className="text-green-700">
            {pendingAction === 'charge'
              ? formatCurrency(pendiente)
              : `$${order.total_price?.toLocaleString()}`}
          </span>
        </div>
      </div>
    </div>
  )
}

function StepBillingForm({
  pendingAction,
  customer,
  setCustomer,
  payment,
  setPayment,
  identificationOptions,
  legalOrganizationOptions,
  tributeOptions,
  isLegalOrganization,
  isHasBilling,
  generateElectronicInvoice,
  setGenerateElectronicInvoice,
}: {
  pendingAction: OrderAction
  customer: FactusCustomerForm
  setCustomer: Dispatch<SetStateAction<FactusCustomerForm>>
  payment: FactusPaymentForm
  setPayment: Dispatch<SetStateAction<FactusPaymentForm>>
  identificationOptions: SelectOption[]
  legalOrganizationOptions: SelectOption[]
  tributeOptions: SelectOption[]
  isLegalOrganization: boolean
  isHasBilling: boolean
  generateElectronicInvoice: boolean
  setGenerateElectronicInvoice: Dispatch<SetStateAction<boolean>>
}) {
  const showInvoiceToggle = pendingAction === 'charge'

  return (
    <div className="space-y-4">
      {!isHasBilling && showInvoiceToggle && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
          <h4 className="text-sm font-semibold text-amber-800">
            Facturación electrónica no configurada
          </h4>
          <p className="text-xs text-amber-700 mt-1">
            Configura las credenciales de Factus en Ajustes para poder emitir facturas en este
            pedido.
          </p>
        </div>
      )}

      {showInvoiceToggle && (
        <div className="flex items-center justify-between gap-3 rounded-lg border bg-gray-50/80 p-3">
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-800">Factura electrónica</p>
            <p className="text-xs text-gray-500 mt-0.5">
              {generateElectronicInvoice
                ? 'Se generará factura electrónica por este cobro.'
                : 'El cobro se registrará sin emitir factura electrónica.'}
            </p>
          </div>
          <Switch
            checked={generateElectronicInvoice}
            disabled={!isHasBilling}
            onCheckedChange={setGenerateElectronicInvoice}
            aria-label="Generar factura electrónica para este pedido"
          />
        </div>
      )}

      {showInvoiceToggle && !generateElectronicInvoice && (
        <p className="text-sm text-gray-500 rounded-lg border border-dashed p-3">
          Puedes cobrar sin facturar. Activa el interruptor si necesitas emitir factura electrónica.
        </p>
      )}

      {(pendingAction === 'charge' && generateElectronicInvoice) && (
        <>
      <div>
        <h4 className="text-sm font-semibold text-gray-800">Datos de facturación</h4>
        <p className="text-xs text-gray-500 mt-1">
          Opcional. Si no ingresas datos fiscales, se factura como{' '}
          <span className="font-medium">CONSUMIDOR FINAL</span> con correo y dirección del emisor.
        </p>
      </div>

      <div
        className={`space-y-3 ${!isHasBilling || (showInvoiceToggle && !generateElectronicInvoice) ? 'opacity-50 pointer-events-none' : ''}`}
      >
      <div className="grid grid-cols-2 gap-3">
        <Field label="Tipo identificación">
          <Select
            value={customer.identification_document_code}
            onValueChange={(value) =>
              setCustomer((prev) => ({ ...prev, identification_document_code: value }))
            }
          >
            <SelectTrigger className="h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {identificationOptions.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>

        <Field label="N. identificación">
          <Input
            value={customer.identification}
            onChange={(e) => setCustomer((prev) => ({ ...prev, identification: e.target.value }))}
            placeholder="Ej: 900123456"
            className="h-9"
          />
        </Field>

        <Field label="Tipo organización">
          <Select
            value={customer.legal_organization_code}
            onValueChange={(value) =>
              setCustomer((prev) => ({ ...prev, legal_organization_code: value }))
            }
          >
            <SelectTrigger className="h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {legalOrganizationOptions.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>

        <Field label="Tributo">
          <Select
            value={customer.tribute_code}
            onValueChange={(value) => setCustomer((prev) => ({ ...prev, tribute_code: value }))}
          >
            <SelectTrigger className="h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {tributeOptions.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>

        <Field
          label={`${isLegalOrganization ? 'Razón social' : 'Nombres'} ${isLegalOrganization ? '*' : '(opc.)'}`}
          className="col-span-2"
        >
          <Input
            value={isLegalOrganization ? customer.company : customer.names}
            onChange={(e) =>
              setCustomer((prev) =>
                isLegalOrganization
                  ? { ...prev, company: e.target.value }
                  : { ...prev, names: e.target.value }
              )
            }
            placeholder={isLegalOrganization ? 'Razón social' : 'Nombres y apellidos'}
            className={`h-9 ${isLegalOrganization && !customer.company.trim() ? 'border-red-400' : ''
              } ${!isLegalOrganization && !customer.names.trim() && customer.identification.trim() ? 'border-red-400' : ''}`}
          />
        </Field>

        <Field label="Nombre comercial (opc.)" className="col-span-2">
          <Input
            value={customer.trade_name}
            onChange={(e) => setCustomer((prev) => ({ ...prev, trade_name: e.target.value }))}
            className="h-9"
          />
        </Field>

        <Field label="Dirección (opc.)" className="col-span-2">
          <Input
            value={customer.address}
            onChange={(e) => setCustomer((prev) => ({ ...prev, address: e.target.value }))}
            className="h-9"
          />
        </Field>

        <Field label="Email (opcional)">
          <Input
            type="email"
            value={customer.email}
            onChange={(e) => setCustomer((prev) => ({ ...prev, email: e.target.value }))}
            placeholder="Opcional"
            className="h-9"
          />
        </Field>

        <Field label="Teléfono (opc.)">
          <Input
            value={customer.phone}
            onChange={(e) => setCustomer((prev) => ({ ...prev, phone: e.target.value }))}
            className="h-9"
          />
        </Field>

        <Field label="País municipio">
          <Select
            value={customer.municipality_country}
            onValueChange={(value: 'CO' | 'EXT') =>
              setCustomer((prev) => ({
                ...prev,
                municipality_country: value,
                municipality_code: value === 'CO' ? prev.municipality_code : '',
              }))
            }
          >
            <SelectTrigger className="h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="CO">Colombia</SelectItem>
              <SelectItem value="EXT">Extranjero</SelectItem>
            </SelectContent>
          </Select>
        </Field>

        <Field label={customer.municipality_country === 'CO' ? 'Cód. municipio' : 'Municipio N/A'}>
          <Input
            value={customer.municipality_code}
            onChange={(e) =>
              setCustomer((prev) => ({ ...prev, municipality_code: e.target.value }))
            }
            disabled={customer.municipality_country !== 'CO'}
            placeholder={customer.municipality_country === 'CO' ? '68679' : 'No aplica'}
            className="h-9"
          />
        </Field>
      </div>


      <div className="grid grid-cols-2 gap-3">
        <Field label="Enviar por email" className="col-span-2">
          <Select
            value={payment.send_email ? 'yes' : 'no'}
            onValueChange={(value) =>
              setPayment((prev) => ({ ...prev, send_email: value === 'yes' }))
            }
          >
            <SelectTrigger className="h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="yes">Sí</SelectItem>
              <SelectItem value="no">No</SelectItem>
            </SelectContent>
          </Select>
        </Field>

        <Field label="Observación (opc.)" className="col-span-2">
          <Input
            value={payment.observation}
            onChange={(e) => setPayment((prev) => ({ ...prev, observation: e.target.value }))}
            placeholder="Notas para la factura"
            className="h-9"
          />
        </Field>
      </div>
      </div>
        </>
      )}
    </div>
  )
}

function StepConfirmation({
  submitPhase,
  submitError,
  pendingAction,
  generateElectronicInvoice,
}: {
  submitPhase: SubmitPhase
  submitError: string | null
  pendingAction: OrderAction
  generateElectronicInvoice: boolean
}) {
  if (submitPhase === 'processing') {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
        <Loader2 className="h-14 w-14 text-green-700 animate-spin mb-4" />
        <h4 className="text-lg font-semibold text-gray-800">Procesando...</h4>
        <p className="text-sm text-gray-500 mt-2 max-w-xs">
          {pendingAction === 'charge'
            ? generateElectronicInvoice
              ? 'Validando factura y registrando el cobro.'
              : 'Registrando el cobro parcial.'
            : pendingAction === 'close'
              ? 'Cerrando la mesa.'
              : 'Confirmando la cuenta abierta.'}
        </p>
      </div>
    )
  }

  if (submitPhase === 'success') {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
        <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
          <Check className="h-8 w-8 text-green-700" />
        </div>
        <h4 className="text-lg font-semibold text-gray-800">¡Listo!</h4>
        <p className="text-sm text-gray-500 mt-2">
          {pendingAction === 'charge'
            ? generateElectronicInvoice
              ? 'Cobro registrado y factura generada.'
              : 'Cobro registrado correctamente.'
            : pendingAction === 'close'
              ? 'La mesa fue cerrada.'
              : 'La cuenta quedó abierta.'}
        </p>
      </div>
    )
  }

  if (submitPhase === 'error') {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
        <div className="h-16 w-16 rounded-full bg-red-100 flex items-center justify-center mb-4 text-red-600 text-2xl font-bold">
          !
        </div>
        <h4 className="text-lg font-semibold text-gray-800">No se pudo completar</h4>
        <p className="text-sm text-red-600 mt-2 max-w-xs">{submitError}</p>
      </div>
    )
  }

  return null
}

function SheetFooter({
  sheetStep,
  submitPhase,
  order,
  payment,
  paymentMethodOptions,
  paymentFormOptions,
  pendingAction,
  generateElectronicInvoice,
  onClose,
  onContinueStep1,
  onContinueStep2,
  onRetrySubmit,
  onFinish,
}: {
  sheetStep: SheetStep
  submitPhase: SubmitPhase
  order: Order | null
  payment: FactusPaymentForm
  paymentMethodOptions: SelectOption[]
  paymentFormOptions: SelectOption[]
  pendingAction: OrderAction
  generateElectronicInvoice: boolean
  onClose: () => void
  onContinueStep1: () => void
  onContinueStep2: () => void
  onRetrySubmit: () => void
  onFinish: () => void
}) {
  if (sheetStep === 3) {
    return (
      <div className="shrink-0 border-t bg-white px-4 py-4 space-y-2">
        {submitPhase === 'error' && (
          <>
            <Button variant="outline" className="w-full" onClick={() => onRetrySubmit()}>
              Reintentar
            </Button>
            <Button variant="ghost" className="w-full" onClick={onClose}>
              Cerrar
            </Button>
          </>
        )}
        {submitPhase === 'success' && (
          <Button className="w-full bg-green-700 hover:bg-green-800 text-white" onClick={onFinish}>
            Cerrar
          </Button>
        )}
      </div>
    )
  }

  return (
    <div className="shrink-0 border-t bg-white px-4 py-4">
      {sheetStep === 1 && order && (
        <div className="flex items-center gap-3">
          <div className="flex-1 min-w-0">
            <p className="text-xs text-gray-500">
              {pendingAction === 'charge' ? 'A cobrar ahora' : 'Resumen'}
            </p>
            <p className="text-xl font-bold text-gray-900">
              {pendingAction === 'charge'
                ? formatCurrency(getOrderTotals(order.products).pendiente)
                : `$${order.total_price?.toLocaleString()}`}
            </p>
            {pendingAction === 'charge' && (
              <p className="text-[10px] text-gray-400 truncate">
                {getOptionLabel(paymentFormOptions, payment.payment_form)} ·{' '}
                {getOptionLabel(paymentMethodOptions, payment.payment_method_code)}
              </p>
            )}
          </div>
          <Button
            className="flex-1 max-w-[160px] bg-green-700 hover:bg-green-800 text-white"
            onClick={onContinueStep1}
          >
            {pendingAction === 'confirm'
              ? 'Confirmar'
              : pendingAction === 'close'
                ? 'Cerrar mesa'
                : 'Continuar'}
          </Button>
        </div>
      )}

      {sheetStep === 2 && pendingAction === 'charge' && (
        <div className="flex gap-2">
          <Button variant="outline" className="flex-1" onClick={() => onClose()}>
            Cancelar
          </Button>
          <Button
            className="flex-1 bg-green-700 hover:bg-green-800 text-white"
            onClick={onContinueStep2}
          >
            {generateElectronicInvoice ? 'Cobrar y facturar' : 'Registrar cobro'}
          </Button>
        </div>
      )}
    </div>
  )
}

function Field({
  label,
  children,
  className = '',
}: {
  label: string
  children: ReactNode
  className?: string
}) {
  return (
    <div className={`space-y-1 ${className}`}>
      <p className="text-xs font-medium text-gray-600">{label}</p>
      {children}
    </div>
  )
}

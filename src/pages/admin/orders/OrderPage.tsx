import { OrdenReques, Order, OrderProduct, OrderStatus } from '@/@types/Order'
import { getAllOrdersByCompany, updateOrderStatus } from '@/api/order/getAllOrdersByCompany'
import CardOrder from '@/components/admin/CardOrder'
import Status from '@/components/admin/Status'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/context/AuthContext'
import { RefreshCcw, ShoppingBag } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useSocket } from "@/context/SocketContext"
import { Link } from 'react-router-dom'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"
import { toast } from 'sonner'
import { STATUS_CONFIG } from '@/config/statusConfig'
import OrderFilterTabs from '@/components/admin/order/OrderFilterTabs'
import OrderCheckoutSheet, {
  type FactusCustomerForm,
  type FactusPaymentForm,
  type SheetStep,
  type SubmitPhase,
} from '@/components/admin/order/OrderCheckoutSheet'
import { validateFactusBill } from '@/api/factus/validateBill'
import {
  buildFactusCustomerPayload,
  getEmitterInfo,
  getNumberingRangeId,
  validateCustomFiscalForm,
} from '@/lib/factus/buildCustomer'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar } from '@/components/ui/calendar'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

export type OrderFilter = 'ALL' | 'pending' | 'in_progress' | 'completed';

const IDENTIFICATION_DOCUMENT_OPTIONS = [
  { value: '11', label: 'Registro civil' },
  { value: '12', label: 'Tarjeta de identidad' },
  { value: '13', label: 'CC' },
  { value: '21', label: 'Tarjeta de extranjería' },
  { value: '22', label: 'Cédula de extranjería' },
  { value: '31', label: 'NIT' },
  { value: '41', label: 'Pasaporte' },
  { value: '42', label: 'Documento de identificación extranjero' },
  { value: '47', label: 'PEP' },
  { value: '48', label: 'PPT' },
  { value: '50', label: 'NIT otro país' },
  { value: '91', label: 'NUIP' },
]

const LEGAL_ORGANIZATION_OPTIONS = [
  { value: '1', label: 'Persona Jurídica' },
  { value: '2', label: 'Persona Natural' },
]

const TRIBUTE_OPTIONS = [
  { value: '01', label: 'IVA' },
  { value: 'ZZ', label: 'No aplica' },
]

const PAYMENT_METHOD_OPTIONS = [
  { value: '10', label: 'Efectivo' },
  { value: '42', label: 'Consignación' },
  { value: '20', label: 'Cheque' },
  { value: '47', label: 'Transferencia' },
  { value: '71', label: 'Bonos' },
  { value: '72', label: 'Vales' },
  { value: '1', label: 'No definido' },
  { value: '49', label: 'Tarjeta Débito' },
  { value: '48', label: 'Tarjeta Crédito' },
  { value: 'ZZZ', label: 'Otro' },
]

const PAYMENT_FORM_OPTIONS = [
  { value: '1', label: 'Contado' },
  { value: '2', label: 'Crédito' },
]

const ORDER_FILTERS: {
  value: OrderFilter
  label: string
}[] = [
    { value: 'ALL', label: 'Todas' },
    { value: 'pending', label: 'Por confirmar' },
    { value: 'in_progress', label: 'En proceso' },
    { value: 'completed', label: 'Finalizadas' },
  ]

function OrderPage() {
  type OrderAction = 'confirm' | 'complete' | null;
  type PaymentMethod = 'cash' | 'card' | null;

  const { company, user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [pendingAction, setPendingAction] = useState<OrderAction>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [listOrder, setListOrder] = useState<Order[]>([]);
  const [selectOrden, setSelectOrden] = useState<Order | null>(null);
  const [orderFilter, setOrderFilter] = useState<OrderFilter>('ALL');

  const { socket } = useSocket()

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(null);

  const [sheetStep, setSheetStep] = useState<SheetStep>(1)
  const [submitPhase, setSubmitPhase] = useState<SubmitPhase>('idle')
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [factusCustomer, setFactusCustomer] = useState<FactusCustomerForm>({
    identification_document_code: '13',
    identification: '',
    company: '',
    names: '',
    trade_name: '',
    address: '',
    email: '',
    phone: '',
    legal_organization_code: '2',
    tribute_code: 'ZZ',
    municipality_code: '',
    municipality_country: 'CO',
  })
  const [generateElectronicInvoice, setGenerateElectronicInvoice] = useState(false)
  const [factusPayment, setFactusPayment] = useState<FactusPaymentForm>({
    payment_form: '1',
    payment_method_code: '10',
    due_date: formatDateToYYYYMMDD(new Date()),
    send_email: true,
    observation: '',
  })


  const [isExpenseDialogOpen, setIsExpenseDialogOpen] = useState(false);
  const [newExpense, setNewExpense] = useState({ price: '', description: '' });
  const [isSubmittingExpense, setIsSubmittingExpense] = useState(false);

  const todayDate = new Date()
  const [selectedDate, setSelectedDate] = useState<Date>(todayDate)
  const [isDatePopoverOpen, setIsDatePopoverOpen] = useState(false)

  const [page, setPage] = useState(1)
  const [limit] = useState(9) // 6 o 9 queda perfecto en grid
  const [totalPages, setTotalPages] = useState(1)

  /*const shouldShowButtons =
    selectOrden?.data[0].status !== 'completed' &&
    selectOrden?.status !== 'canceled' &&
    selectOrden?.status !== 'expense';*/
  const filteredOrders = listOrder.filter(order => {
    if (orderFilter === 'ALL') return true;
    return order.status === orderFilter;
  });

  const today = new Date().toLocaleDateString('es-CO', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });


  useEffect(() => {
    if (!socket) return;

    const handleOrderCreated = (order: Order) => {
      /**Hay un error aqui - hay algun dato que hace falta*/
      if (!order || !order.id || !order.status) {
        console.error("Orden inválida recibida por socket:", order);
        return;
      }

      setListOrder(prev => [order, ...prev]);

      toast.success("🧾 Nueva orden creada", {
        description: `Pedido #${order.id.split("-")[0]}`
      });
    };


    socket.on("order:created", handleOrderCreated);

    return () => {
      socket.off("order:created", handleOrderCreated);
    };
  }, [socket]);

  useEffect(() => {
    if (!socket) return;

    const handleStatusChanged = ({ orderId, status }: { orderId: string; status: OrderStatus }) => {
      // 1️⃣ Actualizar lista
      setListOrder(prev =>
        prev.map(order =>
          order.id === orderId
            ? { ...order, status }
            : order
        )
      );

      // 2️⃣ Toast SOLO si el usuario está viendo órdenes
      toast.info("📌 Estado de orden actualizado", {
        description: `Pedido #${orderId.split("-")[0]} → ${status}`,
      });
    };

    socket.on("order:statusChanged", handleStatusChanged);

    return () => {
      socket.off("order:statusChanged", handleStatusChanged);
    };
  }, [socket]);

  useEffect(() => {
    fetchData();
    setSelectOrden(null);
  }, [company?.id]);

  async function fetchData(newPage = page) {
    setIsLoading(true);
    setError(null);

    try {
      if (!company?.id) {
        setListOrder([]);
        return;
      }
      const response = await getAllOrdersByCompany(company.id, { page: newPage });
      setListOrder(response.data);
      setTotalPages(response.totalPages)
      setPage(response.page)
      //setSelectOrden(response[0])
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar las órdenes';
      setError(errorMessage);
      /*toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage,
      });*/
    } finally {
      setIsLoading(false);
    }
  }

  const resetFactusForms = () => {
    setFactusCustomer({
      identification_document_code: '13',
      identification: '',
      company: '',
      names: '',
      trade_name: '',
      address: '',
      email: '',
      phone: '',
      legal_organization_code: '2',
      tribute_code: 'ZZ',
      municipality_code: '',
      municipality_country: 'CO',
    })
    setFactusPayment({
      payment_form: '1',
      payment_method_code: '10',
      due_date: formatDateToYYYYMMDD(new Date()),
      send_email: true,
      observation: '',
    })
    setGenerateElectronicInvoice(company?.hasBilling ?? false)
  }

  const closeSheet = () => {
    setIsSheetOpen(false);
    setPendingAction(null);
    setPaymentMethod(null);
    setSheetStep(1);
    setSubmitPhase('idle');
    setSubmitError(null);
    resetFactusForms();
  };

  const isLegalOrganization = factusCustomer.legal_organization_code === '1'

  const buildFactusItems = (
    products: OrderProduct[] = []
  ) => {
    return products.map((prod) => {

      const snapshot = prod.product_snapshot

      const quantity = Number(prod.quantity || 1)

      const ivaPercent = Number(
        snapshot?.iva_percent || 0
      )

      const icuiPercent = Number(
        snapshot?.icui_percent || 0
      )

      const incPercent = Number(
        snapshot?.inc_percent || 0
      )

      const priceBeforeTax = Number(
        snapshot?.price_before_tax ||
        snapshot?.price_selling ||
        0
      )

      const taxes = []

      // IVA
      if (ivaPercent > 0) {
        taxes.push({
          code: '01',
          rate: ivaPercent.toFixed(2),
        })
      }

      // INC
      if (incPercent > 0) {
        taxes.push({
          code: '04',
          rate: incPercent.toFixed(2),
        })
      }

      // ICUI
      if (icuiPercent > 0) {
        taxes.push({
          code: '35',
          rate: icuiPercent.toFixed(2),
        })
      }

      if (taxes.length === 0) {
        taxes.push({
          is_excluded: true,
        })
      }

      return {
        code_reference: String(
          snapshot?.id || `PROD-${prod.id}`
        ),

        name: snapshot?.name || 'Producto',

        quantity: quantity.toFixed(2),

        discount_rate: '0.00',

        // 🔥 PRECIO BASE SIN IMPUESTOS
        price: priceBeforeTax.toFixed(2),

        unit_measure_code: '94',

        standard_code: '999',

        taxes,
      }
    })
  }

  const validateBillingStep = () => {
    if (!generateElectronicInvoice) return true
    const fiscalError = validateCustomFiscalForm(factusCustomer)
    if (fiscalError) {
      toast.error(fiscalError)
      return false
    }
    return true
  }

  const buildFactusPayload = () => {
    if (!selectOrden || !company?.id) return null

    const companyRecord = company as Record<string, unknown>
    const numberingRangeId = getNumberingRangeId(companyRecord)
    const emitter = getEmitterInfo(companyRecord, user?.email)
    const customerPayload = buildFactusCustomerPayload(factusCustomer, emitter)
    const customerEmail = customerPayload.email?.trim()

    const items = buildFactusItems(selectOrden.products)

    const factusCalculatedTotal = calculateFactusTotal(items)

    const orderTotal = Number(selectOrden.total_price || 0)

    const rounding = Number((orderTotal - factusCalculatedTotal).toFixed(2))

    return {
      companyId: company.id,
      reference_code: `ORDER-${selectOrden.id.split('-')[0]}`,
      document: '01',
      ...(numberingRangeId > 0 ? { numbering_range_id: numberingRangeId } : {}),
      operation_type: '10',
      send_email: factusPayment.send_email && Boolean(customerEmail),
      payment_details: [
        {
          payment_form: Number(factusPayment.payment_form),
          payment_method_code: factusPayment.payment_method_code,
          reference_code: `pago-${selectOrden.id.split('-')[0]}`,
          amount: orderTotal.toFixed(2),
          due_date: factusPayment.due_date,
        },
      ],
      cash_rounding_amount: rounding.toFixed(2),
      observation: factusPayment.observation || `Factura generada para pedido ${selectOrden.id}`,
      customer: customerPayload,
      items: buildFactusItems(selectOrden.products),
    }
  }

  const calculateFactusTotal = (items: any[]) => {

    let total = 0

    for (const item of items) {

      const quantity = Number(item.quantity || 0)

      const basePrice = Number(item.price || 0)

      // subtotal SIN impuestos
      const subtotal = Number(
        (quantity * basePrice).toFixed(2)
      )

      let taxesTotal = 0

      for (const tax of item.taxes || []) {

        // excluir productos sin impuestos
        if (tax.is_excluded) continue

        const rate = Number(tax.rate || 0)

        const taxValue = Number(
          (
            subtotal *
            (rate / 100)
          ).toFixed(2)
        )

        taxesTotal += taxValue
      }

      total += subtotal + taxesTotal
    }

    return Number(total.toFixed(2))
  }

  const runSheetSubmission = async () => {
    if (!selectOrden) return

    setSubmitPhase('processing')
    setSubmitError(null)

    try {
      if (pendingAction === 'complete') {
        let factusBillNumber: string | undefined
        if (company?.hasBilling && generateElectronicInvoice) {
          const payload = buildFactusPayload()
          if (!payload) throw new Error('No se pudo construir la factura')
          const response = await validateFactusBill(payload)
          const billNumber = response?.data?.number ?? response?.number
          if (billNumber != null && billNumber !== '') {
            factusBillNumber = String(billNumber)
          }
        }
        await updateOrderStatus(selectOrden.id, 'completed', factusBillNumber)
        setListOrder((prev) =>
          prev.map((order) =>
            order.id === selectOrden.id
              ? { ...order, status: 'completed', factusBillNumber: factusBillNumber ?? order.number }
              : order
          )
        )
        toast.success(
          factusBillNumber
            ? 'Orden finalizada y factura generada'
            : 'Orden finalizada'
        )
        fetchData()
      } else if (pendingAction === 'confirm') {
        await updateOrderStatus(selectOrden.id, 'in_progress')
        toast.success('Orden confirmada')
      }
      setSubmitPhase('success')
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'No fue posible completar el proceso'
      setSubmitError(errorMessage)
      setSubmitPhase('error')
      toast.error(errorMessage)
    }
  }

  const handleGoToStep2 = () => {
    if (!factusPayment.payment_method_code) {
      toast.error('Selecciona un método de pago')
      return
    }
    setSheetStep(2)
  }

  const handleGoToStep3 = () => {
    if (
      pendingAction === 'complete' &&
      generateElectronicInvoice &&
      !company?.hasBilling
    ) {
      toast.error('Configura las credenciales de Factus en Ajustes')
      return
    }
    if (!validateBillingStep()) return
    setSheetStep(3)
    void runSheetSubmission()
  }

  const openOrderAction = (order: Order, action: OrderAction) => {
    setSelectOrden(order);
    setPendingAction(action);
    setSheetStep(1);
    setSubmitPhase('idle');
    setSubmitError(null);
    setGenerateElectronicInvoice(company?.hasBilling ?? false);
    setIsSheetOpen(true);
  };

  const handleRetrySubmit = () => {
    setSubmitPhase('idle')
    setSubmitError(null)
    void runSheetSubmission()
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full p-8">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin">
            <RefreshCcw className="h-8 w-8 text-green-700" />
          </div>
          <p className="text-gray-600">Cargando órdenes...</p>
        </div>
      </div>
    );
  }

  if (!company?.id) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8">
        <div className="text-center space-y-4">
          <ShoppingBag className="h-16 w-16 text-gray-400 mx-auto" />
          <h2 className="text-2xl font-bold text-gray-700">Sin compañía seleccionada</h2>
          <p className="text-gray-500">Por favor, seleccione una compañía para ver sus órdenes</p>
        </div>
      </div>
    );
  }

  return (
    <div className='relative flex flex-col h-full w-full'>
      {/* Panel derecho - Lista de pedidos */}
      <OrderCheckoutSheet
        open={isSheetOpen}
        onOpenChange={(open) => {
          if (!open) closeSheet()
        }}
        order={selectOrden}
        pendingAction={pendingAction}
        sheetStep={sheetStep}
        setSheetStep={setSheetStep}
        submitPhase={submitPhase}
        submitError={submitError}
        customer={factusCustomer}
        setCustomer={setFactusCustomer}
        payment={factusPayment}
        setPayment={setFactusPayment}
        identificationOptions={IDENTIFICATION_DOCUMENT_OPTIONS}
        legalOrganizationOptions={LEGAL_ORGANIZATION_OPTIONS}
        tributeOptions={TRIBUTE_OPTIONS}
        paymentMethodOptions={PAYMENT_METHOD_OPTIONS}
        paymentFormOptions={PAYMENT_FORM_OPTIONS}
        isLegalOrganization={isLegalOrganization}
        isHasBilling={company?.hasBilling ?? false}
        generateElectronicInvoice={generateElectronicInvoice}
        setGenerateElectronicInvoice={setGenerateElectronicInvoice}
        onContinueStep1={handleGoToStep2}
        onContinueStep2={handleGoToStep3}
        onRetrySubmit={handleRetrySubmit}
        onClose={closeSheet}
        onFinish={closeSheet}
      />



      {/* Dialog de gasto - encabezado*/}
      <div className="px-2 md:px-4 pb-3 flex flex-col gap-1">

        <div className="flex justify-between items-center">
          <h2 className="font-bold text-lg md:text-2xl">
            Lista de Pedidos
          </h2>
          <p className="capitalize text-sm text-gray-500">{today}</p>
        </div>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-1">
          <div className='flex gap-2'>
            {/* --- DIALOG PARA AGREGAR GASTO --- */}
            {/*

            <Dialog open={isExpenseDialogOpen} onOpenChange={setIsExpenseDialogOpen}>
              <DialogTrigger asChild>
                <Button className='text-white bg-red-600 hover:bg-red-700'>- <p className='hidden md:flex'> Agregar Gasto</p></Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleExpenseSubmit}>
                  <DialogHeader>
                    <DialogTitle>Agregar Nuevo Gasto</DialogTitle>
                    <DialogDescription>
                      Registra un nuevo gasto para la compañía. Haz clic en guardar cuando termines.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label htmlFor="price" className="text-right">
                        Precio
                      </label>
                      <Input
                        id="price"
                        name="price"
                        type="number"
                        placeholder="$0.00"
                        value={newExpense.price}
                        onChange={handleExpenseChange}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label htmlFor="description" className="text-right">
                        Descripción
                      </label>
                      <Input
                        id="description"
                        name="description"
                        placeholder="Ej: Compra de insumos"
                        value={newExpense.description}
                        onChange={handleExpenseChange}
                        className="col-span-3"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button type="button" variant="outline">Cancelar</Button>
                    </DialogClose>
                    <Button type="submit" disabled={isSubmittingExpense}>
                      {isSubmittingExpense ? 'Guardando...' : 'Guardar Gasto'}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
            */}


            {/* --- FIN DEL DIALOG --- */}

            <Link to="/admin/products?orden" className="w-full md:w-auto">
              <Button
                className="w-full md:w-auto bg-green-700 hover:bg-green-800 text-white font-semibold"
              >
                + Nuevo Pedido
              </Button>
            </Link>

            {/*company?.role === 'admin' && (
              <Popover open={isDatePopoverOpen} onOpenChange={setIsDatePopoverOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4" />
                    {selectedDate
                      ? selectedDate.toLocaleDateString('es-CO')
                      : 'Filtrar por fecha'}
                  </Button>
                </PopoverTrigger>

                <PopoverContent className="w-auto p-0" align="end">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => {
                      if (!date) return

                      // 1️⃣ guardar fecha
                      setSelectedDate(date)

                      // 2️⃣ cerrar popover
                      setIsDatePopoverOpen(false)

                      // 3️⃣ pedir datos al backend
                      fetchData(date)
                    }}
                  />
                </PopoverContent>
              </Popover>
            )*/}

          </div>
          <div className="w-full overflow-x-auto">
            <OrderFilterTabs
              value={orderFilter}
              onChange={setOrderFilter}
            />
          </div>


        </div>
      </div>
      {/*NOTA: ARREGLAR EL BACKEND PARA QUE ME DEVUELVA UN ORDEN ESPECIFICO SOLO HAY UNA VARIANTE 
      Y ESTA TIENE MUCHAS OPCIONES. */ }
      {/* lista de ordenes  */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 px-4 overflow-y-auto h-[80vh]">
        {filteredOrders.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 mb-4">
              <ShoppingBag className="h-7 w-7 text-gray-400" />
            </div>

            <h3 className="text-sm font-semibold text-gray-700">
              No hay pedidos
            </h3>

            <p className="text-sm text-gray-500 mt-1 max-w-xs">
              Los pedidos se mostrarán aquí.
            </p>

            {orderFilter === 'ALL' && (
              <Link to="/admin/products?orden">
                <button className="mt-5 inline-flex items-center rounded-md bg-green-700 px-4 py-2 text-sm font-semibold text-white hover:bg-green-800 transition">
                  + Crear primer pedido
                </button>
              </Link>
            )}
          </div>
        ) : (
          filteredOrders.map((orden, index) => (
            <li key={orden.id} className="list-none">
              <CardOrder
                item={orden}
                onClick={() => setSelectOrden(orden)}
                onConfirm={() => openOrderAction(orden, 'confirm')}
                onComplete={() => openOrderAction(orden, 'complete')}
                index={index + 1}
                selectOrden={selectOrden}
              />
            </li>
          ))
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center py-4">
          <Pagination>
            <PaginationContent>

              <PaginationItem>
                <PaginationPrevious
                  onClick={() => page > 1 && fetchData(page - 1)}
                  className={page === 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>

              {Array.from({ length: totalPages }).map((_, i) => {
                const pageNumber = i + 1
                return (
                  <PaginationItem key={pageNumber}>
                    <PaginationLink
                      isActive={page === pageNumber}
                      onClick={() => fetchData(pageNumber)}
                    >
                      {pageNumber}
                    </PaginationLink>
                  </PaginationItem>
                )
              })}

              <PaginationItem>
                <PaginationNext
                  onClick={() => page < totalPages && fetchData(page + 1)}
                  className={page === totalPages ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>

            </PaginationContent>
          </Pagination>
        </div>
      )}

      {/* Barra inferior fija en móvil */}
      {/*selectOrden && (
          <div className="lg:hidden fixed bottom-0 right-0  bg-white border-t shadow-lg">
            <button
              className="w-full p-4 flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <BoxesIcon className="h-6 w-6" />
                <div className="flex flex-col">
                  <span className="font-semibold">Pedido #{selectOrden.id.toString().split("-")[0]}</span>
                  <span className="text-sm text-gray-500">{selectOrden.products?.length || 0} productos</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold">${selectOrden.total_price}</span>
                <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                  Ver Detalles
                </div>
              </div>
            </button>
          </div>
        )*/}
    </div>
  )
}

function formatDateToYYYYMMDD(date: Date) {
  return date.toLocaleDateString('en-CA') // YYYY-MM-DD
}


export default OrderPage
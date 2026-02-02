import { OrdenReques, Order, OrderProduct, OrderStatus } from '@/@types/Order'
import { getAllOrdersByCompany, updateOrderStatus } from '@/api/order/getAllOrdersByCompany'
import CardOrder from '@/components/admin/CardOrder'
import Status from '@/components/admin/Status'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/context/AuthContext'
import { BoxesIcon, CalendarIcon, CircleDollarSign, CreditCard, Printer, RefreshCcw, ShoppingBag, X } from 'lucide-react'
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
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { toast } from 'sonner'
import { Input } from '@/components/ui/input'
import { STATUS_CONFIG } from '@/config/statusConfig'
import OrderFilterTabs from '@/components/admin/order/OrderFilterTabs'
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
      const response = await getAllOrdersByCompany(company.id, {page:newPage});
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

  const closeSheet = () => {
    setIsSheetOpen(false);
    setPendingAction(null);
    setPaymentMethod(null);
  };

  const openOrderAction = (order: Order, action: OrderAction) => {
    setSelectOrden(order);
    setPendingAction(action);
    setIsSheetOpen(true);
  };


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
      <Sheet
        open={isSheetOpen}
        onOpenChange={(open) => {
          if (!open) closeSheet()
        }}
      >
        <SheetContent
          side="right"
          className="w-[400px] sm:w-[460px] flex flex-col gap-6 px-1 py-3"
        >

          {/* ===== HEADER ===== */}
          <SheetHeader className="border-b pb-4">
            {selectOrden && (
              <div className="flex items-center justify-between">
                <SheetTitle className="text-lg font-bold">
                  Pedido #{selectOrden.id.split('-')[0]}
                </SheetTitle>

                <div>{selectOrden.status}</div>
              </div>
            )}

            <SheetDescription className="text-sm text-gray-500">
              {pendingAction === 'confirm'
                ? 'Confirma la orden para iniciar su preparación'
                : 'Finaliza la orden una vez entregada'}
            </SheetDescription>
          </SheetHeader>

          {/* ===== CONTENIDO ===== */}
          <div className="flex-1 flex flex-col gap-6 overflow-y-auto">

            {/* ===== RESUMEN ===== */}
            {selectOrden && (
              <div className="grid grid-cols-2 gap-4 text-sm bg-gray-50 p-4 rounded-lg">
                <div>
                  <p className="text-gray-500">Fecha</p>
                  <p className="font-medium">
                    {new Date(selectOrden.createAt).toLocaleString('es-CO')}
                  </p>
                </div>

                <div>
                  <p className="text-gray-500">Total</p>
                  <p className="font-bold text-green-700">
                    ${selectOrden.total_price?.toLocaleString()}
                  </p>
                </div>

                <div>
                  <p className="text-gray-500">Productos</p>
                  <p className="font-medium">
                    {selectOrden.products?.length || 0}
                  </p>
                </div>

              </div>
            )}

            {/* ===== PRODUCTOS ===== */}
            {selectOrden?.products && (
              <div className="space-y-3">
                <h4 className="font-semibold text-sm text-gray-700">
                  Productos
                </h4>

                <div className="space-y-2 max-h-[260px] overflow-y-auto pr-2">
                  {selectOrden.products.map((prod: OrderProduct, idx: number) => (
                    <div
                      key={idx}
                      className="flex justify-between items-start border rounded-md p-3 text-sm"
                    >
                      <div className="flex flex-col gap-1">
                        <p className="font-medium">
                          {prod.product_snapshot?.name || 'Producto'}
                        </p>

                        {prod.product_snapshot?.optionsSelected?.length > 0 && (
                          <ul className="text-xs text-gray-500">
                            {prod.product_snapshot.optionsSelected.map((opt, i) => (
                              <li key={i}>
                                • {opt.variantName}: {opt.optionName}
                                {opt.extraPrice && opt.extraPrice > 0 && (
                                  <span className="ml-1 text-green-700">
                                    (+${opt.extraPrice})
                                  </span>
                                )}
                              </li>
                            ))}
                          </ul>
                        )}

                        {prod.notes && (
                          <p className="text-xs text-gray-400">
                            Nota: {prod.notes}
                          </p>
                        )}
                      </div>

                      <div className="text-right font-bold">
                        x{prod.quantity}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ===== ACCIONES ===== */}
          <div className="space-y-3 border-t pt-4">

            {/* CONFIRMAR */}
            {pendingAction === 'confirm' && (
              <Button
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                onClick={async () => {
                  await updateOrderStatus(selectOrden!.id, 'in_progress')
                  closeSheet()
                }}
              >
                Confirmar Orden
              </Button>
            )}

            {/* FINALIZAR */}
            {pendingAction === 'complete' && (
              <Button
                className="w-full bg-green-600 hover:bg-green-700 text-white"
                onClick={async () => {
                  await updateOrderStatus(selectOrden!.id, 'completed')
                  toast.success("Orden finalizada")
                  closeSheet()
                  fetchData()
                }}
              >
                Finalizar Orden
              </Button>
            )}

            <Button variant="outline" onClick={closeSheet}>
              Cancelar
            </Button>
          </div>

        </SheetContent>
      </Sheet>


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
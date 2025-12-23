import { OrdenReques, Order, OrderProduct } from '@/@types/Order'
import { getAllOrdersByCompany, updateOrderStatus } from '@/api/order/getAllOrdersByCompany'
import CardOrder from '@/components/admin/CardOrder'
import Status from '@/components/admin/Status'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/context/AuthContext'
import { BoxesIcon, CircleDollarSign, CreditCard, Printer, RefreshCcw, ShoppingBag, X } from 'lucide-react'
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

function OrderPage() {
  type OrderAction = 'confirm' | 'complete' | null;
  type PaymentMethod = 'cash' | 'card' | null;


  const { company } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [pendingAction, setPendingAction] = useState<OrderAction>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [listOrder, setListOrder] = useState<Order[]>([]);
  const [selectOrden, setSelectOrden] = useState<Order | null>(null);

  const { socket } = useSocket()

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(null);


  const [isExpenseDialogOpen, setIsExpenseDialogOpen] = useState(false);
  const [newExpense, setNewExpense] = useState({ price: '', description: '' });
  const [isSubmittingExpense, setIsSubmittingExpense] = useState(false);

  /*const shouldShowButtons =
    selectOrden?.data[0].status !== 'completed' &&
    selectOrden?.status !== 'canceled' &&
    selectOrden?.status !== 'expense';*/

  const handleExpenseChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewExpense(prev => ({ ...prev, [name]: value }));
  };

  const handleExpenseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExpense.price || !newExpense.description) {
      toast.error("Por favor, complete todos los campos del gasto.");
      return;
    }
    setIsSubmittingExpense(true);
    try {
      // Aquí iría la llamada a la API para crear el gasto
      // await createExpenseApi({ ...newExpense, price: Number(newExpense.price) });
      console.log("Enviando gasto:", newExpense);
      toast.success("Gasto agregado exitosamente");

      // Resetear y cerrar el dialog
      setNewExpense({ price: '', description: '' });
      setIsExpenseDialogOpen(false);
    } catch (error) {
      toast.error("Error al agregar el gasto.");
    } finally {
      setIsSubmittingExpense(false);
    }
  };

  const handleFinishOrder = async () => {
    if (!selectOrden) {
      toast.error("No se ha seleccionado ninguna orden.");
      return;
    }

    if (!paymentMethod) {
      toast.error("Por favor, seleccione un método de pago.");
      return;
    }

    try {
      await updateOrderStatus(selectOrden.id, 'completed'/*, paymentMethod*/);
      toast.success("Orden finalizada exitosamente.");
      fetchData(); // Volver a cargar los datos para reflejar el cambio
    } catch (error) {
      console.error('Error al finalizar la orden:', error);
      toast.error("Error al finalizar la orden. Intente de nuevo.");
    }
  };

  async function changeOrderStatus(
    order: Order,
    newStatus: 'completed' | 'canceled' | 'expense' | 'pending' | 'in_progress'
  ) {
    try {
      await updateOrderStatus(order.id, newStatus)
      toast.success(`Orden actualizada a ${STATUS_CONFIG[newStatus].text}`)
      fetchData()
    } catch (error) {
      toast.error("Error al actualizar el estado")
    }
  }

  useEffect(() => {
    if (!socket) return;

    // Función que se ejecutará cuando llegue un nuevo producto
    const handleNewOrder = (newOrder: Order) => {
      // añadiendo la nueva orden al principio de la lista.
      setListOrder(prevList => [newOrder, ...prevList]);
    };

    // Listener para cambios de estado en las órdenes
    const handleOrderStatusChange = (updatedOrder: OrdenReques) => {
      /*setListOrder(prevList => {
        // Busca la orden que fue actualizada por su ID
        const index = prevList.findIndex(order => order.id === updatedOrder.id);

        // Si la encuentra, la reemplaza con la versión actualizada
        if (index !== -1) {
          const newList = [...prevList];
          newList[index] = updatedOrder;
          return newList;
        }

        // Si no la encuentra (por ejemplo, si la lista se carga por primera vez),
        // podría simplemente devolver la lista anterior o agregarla.
        // En este caso, la reemplazaremos para mantener el orden.
        return prevList;
      });*/
    };

    // Suscribimos el componente a ambos eventos
    socket.on('newOrder', handleNewOrder);
    socket.on('orderStatusChanged', handleOrderStatusChange);

    // Función de limpieza: desuscribimos ambos eventos
    return () => {
      socket.off('newOrder', handleNewOrder);
      socket.off('orderStatusChanged', handleOrderStatusChange);
    };

  }, [socket]);

  /*
  
  
  
  
  
  
  
  */
  useEffect(() => {
    fetchData();
    setSelectOrden(null);
  }, [company?.id]);

  async function fetchData() {
    setIsLoading(true);
    setError(null);

    try {
      if (!company?.id) {
        setListOrder([]);
        return;
      }
      const response = await getAllOrdersByCompany(company.id);
      setListOrder(response.data);
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
        <SheetContent side="right" className="w-[400px] sm:w-[450px] flex flex-col">

          <SheetHeader>
            {selectOrden && (
              <SheetTitle>
                Pedido #{selectOrden.id.split('-')[0]}
              </SheetTitle>
            )}
            <SheetDescription>
              {pendingAction === 'confirm'
                ? 'Confirma que la orden está lista para continuar'
                : 'Selecciona el método de pago para finalizar la orden'}
            </SheetDescription>
          </SheetHeader>

          {/* CONTENIDO flex-1 mt-6 space-y-6 overflow-y-auto*/}
          <div className="mt-6 flex flex-col justify-between h-full">

            {/* CONFIRMAR */}
            {pendingAction === 'confirm' && (
              <Button
                className="w-full bg-blue-600 text-white"
                onClick={async () => {
                  //await updateOrderStatus(selectOrden!.status, 'confirmed');
                  toast.success("Orden confirmada");
                  closeSheet();
                  fetchData();
                }}
              >
                Confirmar Orden
              </Button>
            )}

            {/* FINALIZAR */}
            {pendingAction === 'complete' && (
              <>
                <p className="font-bold">Método de pago</p>

                <div className="flex gap-4">
                  <Button
                    variant={paymentMethod === 'cash' ? 'default' : 'outline'}
                    onClick={() => setPaymentMethod('cash')}
                    className="flex-1"
                  >
                    <CircleDollarSign className="mr-2" /> Efectivo
                  </Button>

                  <Button
                    variant={paymentMethod === 'card' ? 'default' : 'outline'}
                    onClick={() => setPaymentMethod('card')}
                    className="flex-1"
                  >
                    <CreditCard className="mr-2" /> Tarjeta
                  </Button>
                </div>

                <Button
                  className="w-full bg-green-600"
                  disabled={!paymentMethod}
                  onClick={async () => {
                    await updateOrderStatus(
                      selectOrden!.id,
                      'completed',
                      //paymentMethod
                    )
                    toast.success("Orden finalizada");
                    closeSheet();
                    fetchData();
                  }}
                >
                  Finalizar Orden
                </Button>
              </>
            )}

            <Button variant="outline" onClick={closeSheet}>
              Cancelar
            </Button>
          </div>

        </SheetContent>
      </Sheet>

      {/* Dialog de gasto - encabezado*/}
      <div className='px-2 md:px-4 flex flex-col gap-1 pb-2'>

        <div className=' flex w-full justify-between items-center'>
          <h2 className='font-bold md:text-2xl'>Lista de Pedidos</h2>
          <p>Miercoles, 18 Agosto 2025</p>
        </div>
        <div className='md:flex justify-between gap-1'>

          <div className='flex gap-2'>
            {/* --- DIALOG PARA AGREGAR GASTO --- */}
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
            {/* --- FIN DEL DIALOG --- */}

            <Link to="/admin/products?orden">
              <Button variant="default" className='h-full w-full cursor-pointer bg-green-700'>+ Nuevo Pedido</Button>
            </Link>
          </div>
          <div className='flex gap-2'>
            <div className='p-1 px-2 hover:bg-gray-200 rounded-sm shadow flex flex-col items-center bg-green-800 text-white'>
              <p className='cursor-pointer'>Todos</p>
            </div>
            <div className='p-1 px-2 hover:bg-gray-200 rounded-sm shadow flex flex-col items-center bg-white '>
              <p className='cursor-pointer '>Por confirmar</p>
            </div>
            <div className='p-1 px-2 hover:bg-gray-200 rounded-sm shadow flex flex-col items-center bg-white'>
              <p className='cursor-pointer '>En proceso</p>
            </div>
            <div className='p-1 px-2 hover:bg-gray-200 rounded-sm shadow flex flex-col items-center bg-white'>
              <p className='cursor-pointer '>Finalizada</p>
            </div>
          </div>
        </div>
      </div>
      {/*NOTA: ARREGLAR EL BACKEND PARA QUE ME DEVUELVA UN ORDEN ESPECIFICO SOLO HAY UNA VARIANTE 
      Y ESTA TIENE MUCHAS OPCIONES. */ }
      {/* lista de ordenes  */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 p-4 overflow-y-auto h-[80vh]">
        {listOrder.map((orden, index) => (
          <li key={index} className='list-none'>
            <CardOrder
              item={orden}
              onClick={() => {
                setSelectOrden(orden)
                //setDetail(true);
              }}
              onConfirm={() => openOrderAction(orden, 'confirm')}
              onComplete={() => openOrderAction(orden, 'complete')}
              index={index + 1}
              selectOrden={selectOrden}
            />
          </li>
        ))}
      </div>

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

export default OrderPage
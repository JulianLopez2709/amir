import { OrdenReques } from '@/@types/Order'
import { getAllOrdersByCompany } from '@/api/order/getAllOrdersByCompany'
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
import { toast } from 'sonner'
import { Input } from '@/components/ui/input'
import { STATUS_CONFIG } from '@/config/statusConfig'
import { formatDate } from '@/config/utils'


type PaymentMethod = 'cash' | 'card' | null;

function OrderPage() {
  const { company } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [listOrder, setListOrder] = useState<OrdenReques[]>([]);
  const [selectOrden, setSelectOrden] = useState<OrdenReques | null>(null);
  const [detail, setDetail] = useState(false);
  const { socket } = useSocket()

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(null);


  const [isExpenseDialogOpen, setIsExpenseDialogOpen] = useState(false);
  const [newExpense, setNewExpense] = useState({ price: '', description: '' });
  const [isSubmittingExpense, setIsSubmittingExpense] = useState(false);

  const shouldShowButtons =
    selectOrden?.status !== 'completed' &&
    selectOrden?.status !== 'canceled' &&
    selectOrden?.status !== 'expense';

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
    if (!paymentMethod) {
      // Mostrar error - se necesita seleccionar método de pago
      return;
    }

    try {
      // Aquí iría la llamada a la API para finalizar la orden
      // await finishOrder({
      //   orderId: selectOrden?.id,
      //   paymentMethod,
      //   total: selectOrden?.total_price
      // });
    } catch (error) {
      console.error('Error al finalizar la orden:', error);
    }
  };

  useEffect(() => {
    if (!socket) return;

    // Función que se ejecutará cuando llegue un nuevo producto
    const handleNewOrder = (newOrder: OrdenReques) => {
      // añadiendo la nueva orden al principio de la lista.
      setListOrder(prevList => [newOrder, ...prevList]);
    };

    // Suscribimos el componente al evento 'newOrder'
    socket.on('newOrder', handleNewOrder);

    // Función de limpieza: Es CRUCIAL desuscribirse del evento
    // cuando el componente se desmonte para evitar memory leaks.
    return () => {
      socket.off('newOrder', handleNewOrder);
    };

  }, [socket]);

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
      setListOrder(response);
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

  const showDetail = () => {
    setDetail(!detail)
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
    <div className='relative grid lg:grid-cols-[0.4fr_1fr] h-full gap-2'>
      {/* Panel izquierdo - Detalles */}
      <div className={`
        fixed lg:relative lg:flex lg:w-auto lg:h-auto
        ${detail ? 'flex' : 'hidden'}
        right-0 left-0
        py-2 px-2 lg:px-3
        h-[95vh] flex-col bg-white
      `}>

        <div className='flex justify-between items-center mb-2'>
          <div className='flex-col'>
            <h2 className='font-bold '>
              Pedido # {selectOrden?.id.toString().split("-")[0]}
            </h2>
            <p className='text-sm'>{formatDate(selectOrden?.createAt)}</p>
          </div>
          <div className='flex items-center gap-2'>
            {(() => {
              const statusInfo = STATUS_CONFIG[selectOrden?.status.toString().toUpperCase() || ""] || STATUS_CONFIG.DEFAULT;
              return (
                // 2. Usamos .color para el color y .text para el nombre en español
                <Status
                  textColor={statusInfo.tailwindClasses.text}
                  bg={statusInfo.tailwindClasses.bg}
                  color={statusInfo.color}
                  name={statusInfo.text}
                />
              );
            })()}
            <button className='lg:hidden' onClick={() => setDetail(false)}>
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>
        {
          /*
          <div className='flex gap-2'>
          <Button variant="outline" className='flex rounded-sm gap-2 cursor-pointer'>
            <Printer className='text-black' />
            <p>Imprimir Factura</p>
          </Button>
          </div>
          */
        }

        <p className='font-bold text-lg mb-3 flex-shrink-0 text-gray-700'>Items ({selectOrden?.products?.length})</p>
        <div className='h-[45vh]'>

          <div className="flex-1 overflow-y-auto w-full h-full pb-4 pr-2 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
            {
              selectOrden?.products?.map((p, index) => (
                <div className="flex justify-between items-center gap-2 mb-2" key={index}>
                  <div className="size-12 bg-gray-50 flex items-center justify-center rounded-md shadow-md flex-shrink-0">
                    <BoxesIcon className='size-7 text-gray-500' />
                  </div>
                  <div className='flex-2 flex-col'>
                    <p className='font-bold'>{p.product?.name}</p>
                    <p className='text-sm'>{p.product?.description}</p>
                  </div>
                  <p className='font-bold text-center flex-1'>{p.quantity}</p>
                  <p className='font-bold'>${p.product?.price_selling}</p>
                </div>
              ))
            }
          </div>
        </div>
        <div className='flex justify-between items-center font-bold'>
          <p className=''>Total ({selectOrden?.products?.length} items)</p>
          <p className='text-green-700 text-xl'>$ {selectOrden?.total_price}</p>
        </div>
        {
          shouldShowButtons && (
            <div>
              <div className='mb-4'>
                <p className='font-bold mb-2'>Metodo de pago</p>
                <div className='flex gap-5'>
                  <Button
                    variant="outline"
                    className={`flex flex-col flex-1 items-center justify-center p-4 h-20 rounded-xl 
                    ${paymentMethod === 'cash'
                        ? 'bg-green-100 border-green-700 text-green-700'
                        : 'hover:bg-green-100 hover:border-green-700 hover:text-green-700'}`}
                    onClick={() => setPaymentMethod('cash')}
                  >
                    <CircleDollarSign className='size-8 mb-1' />
                    <span className='text-sm'>Efectivo</span>
                  </Button>
                  <Button
                    variant="outline"
                    className={`flex flex-col flex-1 items-center justify-center p-4 h-20 rounded-xl
                    ${paymentMethod === 'card'
                        ? 'bg-green-100 border-green-700 text-green-700'
                        : 'hover:bg-green-100 hover:border-green-700 hover:text-green-700'}`}
                    onClick={() => setPaymentMethod('card')}
                  >
                    <CreditCard className='size-8 mb-1' />
                    <span className='text-sm'>Tarjeta</span>
                  </Button>
                </div>
              </div>

              <div className='flex flex-col gap-2 mb-3'>
                <Link to={`/admin/products?orden=${selectOrden?.id}`}>
                  <Button variant="default" className='w-full bg-blue-600 font-bold mb-3 cursor-pointer'>
                    Agregar un nuevo Producto
                  </Button>
                </Link>
                <Button
                  variant="default"
                  className='bg-black text-white w-full cursor-pointer p-7'
                  onClick={handleFinishOrder}
                  disabled={!paymentMethod}
                >
                  <div>
                    <p className='font-bold'>Orden Finalizada</p>
                    <p className='text-sm'>
                      {paymentMethod
                        ? `Pago con ${paymentMethod === 'cash' ? 'efectivo' : 'tarjeta'}`
                        : 'Seleccione método de pago'}
                    </p>
                  </div>
                </Button>
              </div>
            </div>
          )
        }




      </div>

      {/* Panel derecho - Lista de pedidos */}
      <div className='flex flex-col h-full'>
        <div className='h-16 flex w-full justify-between items-center px-4'>
          <h2 className='font-bold md:text-2xl'>Lista de Pedidos</h2>
          <div className='flex gap-2'>
            {/* --- DIALOG PARA AGREGAR GASTO --- */}
            <Dialog open={isExpenseDialogOpen} onOpenChange={setIsExpenseDialogOpen}>
              <DialogTrigger asChild>
                <Button className='text-white bg-red-600 hover:bg-red-700'>+ Agregar Gasto</Button>
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
        </div>

        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 p-4 overflow-y-auto max-h-[85vh]">
          {listOrder.map((orden, index) => (
            <li key={index} className='list-none'>
              <CardOrder
                item={orden}
                onClick={() => {
                  setSelectOrden(orden);
                  setDetail(true);
                }}
                index={index + 1}
              />
            </li>
          ))}
        </div>

        {/* Barra inferior fija en móvil */}
        {selectOrden && (
          <div className="lg:hidden fixed bottom-0 right-0  bg-white border-t shadow-lg">
            <button
              onClick={showDetail}
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
        )}
      </div>
    </div>
  )
}

export default OrderPage
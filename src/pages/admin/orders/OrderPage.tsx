import Orden, { OrdenReques } from '@/@types/Order'
import { getAllOrdersByCompany } from '@/api/order/getAllOrdersByCompany'
import CardOrder from '@/components/admin/CardOrder'
import Status from '@/components/admin/Status'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/context/AuthContext'
import { BoxesIcon, CircleDollarSign, CreditCard, Printer, RefreshCcw, ShoppingBag, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useSocket } from "@/context/SocketContext"
import { Link } from 'react-router-dom'
import { toast } from 'sonner'

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
      console.log("error", err)
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

        <div className='flex justify-between items-center mb-4'>
          <h2 className='font-bold'>
            Pedido # {selectOrden?.id.toString().split("-")[0]}
          </h2>
          <div className='flex items-center gap-2'>
            <Status color='green' name='terminado' />
            <button className='lg:hidden' onClick={() => setDetail(false)}>
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div className='flex gap-2'>
          <Button variant="outline" className='flex rounded-sm gap-2 cursor-pointer'>
            <Printer className='text-black' />
            <p>Imprimir Factura</p>
          </Button>
        </div>

        <div className='flex flex-col h-full'>
          <p className='font-bold'>items {selectOrden?.products?.length}</p>
          <div className="flex-1 flex-col w-full mb-3 overflow-y-auto">
            {
              selectOrden?.products?.map((p, index) => (
                <div className="flex justify-between items-center gap-2" key={index}>
                  <div className="size-10 bg-gray-50 flex items-center justify-center rounded-sm">
                    <BoxesIcon className='size-6 text-gray-500' />
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

          <div className='flex justify-between items-center font-bold'>
            <p>Total ({selectOrden?.products?.length} items)</p>
            <p>$ {selectOrden?.total_price}</p>
          </div>

          <div className='flex flex-col gap-2 mb-3'>
            <Link to={`/admin/products?orden=${selectOrden?.id}`}>
              <Button variant="default" className='w-full h-full bg-blue-600 font-bold mb-3 cursor-pointer'>
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

        <div className='border-t-2 flex flex-col gap-2 '>
          <div className='py-5'>
            <h2 className='font-bold'>Agregar Gasto Nuevo</h2>
            <Input placeholder='Precio del gasto' className='mb-2' type='number' />
            <Input placeholder='Descripción del gasto' className='mb-2' />
            <Button variant="default" className='bg-red-700 cursor-pointer w-full'>Agregar Gasto</Button>
          </div>
        </div>

      </div>

      {/* Panel derecho - Lista de pedidos */}
      <div className='flex flex-col h-full'>
        <div className='h-16 flex w-full justify-between items-center px-4'>
          <h2 className='font-bold text-2xl'>Lista de Pedidos</h2>
          <Link to="/admin/products?orden">
            <Button variant="default" className='h-full w-full cursor-pointer bg-green-700'>+ Nuevo Pedido</Button>
          </Link>
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
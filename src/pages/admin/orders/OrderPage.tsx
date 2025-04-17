import { OrdenReques } from '@/@types/Order'
import CardOrder from '@/components/admin/CardOrder'
import Status from '@/components/admin/Status'
import { Button } from '@/components/ui/button'
import { CircleDollarSign, CreditCard, Printer } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'

function OrderPage() {
  

  const orden: OrdenReques = {
    cliente_create: "string",
    order: 145,
    status: "string",
    list_products: [],
    metodo_pago: "string",
    total_price: 145
  }

  const orden1: OrdenReques = {
    cliente_create: "string",
    order: 1478,
    status: "string",
    list_products: [
      {
        status: "new",
        notes: "",
        quantity: 2,
        product: {}
      }
    ],
    metodo_pago: "string",
    total_price: 145
  }

  const ordenList : OrdenReques[] = [
    orden,
    orden1
  ]

  const [selectOrden, setSelectOrden] = useState<OrdenReques | null>(null)

  const numberOrden = 1457

  const test = (e: string) => {
    console.log(e)
  }

  return (
    <div className='relative grid lg:grid-cols-[0.4fr_1fr] h-full gap-2'>
      <div className='bg-white p-5' >
        <div className='flex justify-between items-center mb-4'>
          <h2>
            Pedido #{selectOrden?.order}
          </h2>
          <Status color='green' name='terminado' />
        </div>
        <div className='flex gap-2'>
          <Button variant="outline" className='flex rounded-sm gap-2 cursor-pointer'>
            <Printer className='text-black' />
            <p>Imprimir Factura</p>
          </Button>
          <Button variant="outline" className='cursor-pointer'>
            <div>
              <div className='size-1 rounded-full bg-gray-400'></div>
            </div>
          </Button>
        </div>
        <p className='font-bold'>items 1</p>
        <div>
          <div className='mb-3'>

            <div className="flex flex-col w-full mb-3">
              <div className="flex justify-between items-center">
                <div className="size-10 bg-gray-200"></div>
                <div>
                  <p>titulo</p>
                  <p>Descripton</p>
                </div>
                <p>1</p>
                <p>$2,000,120</p>
              </div>
            </div>
            <div className="flex flex-col w-full mb-3">
              <div className="flex justify-between items-center">
                <div className="size-10 bg-gray-200"></div>
                <div>
                  <p>titulo</p>
                  <p>Descripton</p>
                </div>
                <p>1</p>
                <p>$2,000,120</p>
              </div>
            </div>
          </div>

          <div className='mb-4'>
            <p className='font-bold'>Metodo de pago</p>
            <div className='flex gap-5'>
              <Button variant="outline" className='h-full bg-green-100 border border-green-700 rounded-xl hover:bg-green-100'>
                <CircleDollarSign className='m-auto h-full w-full size-14 p-12 text-green-700' />
              </Button>
              <Button variant="outline" className='h-full  border rounded-xl cursor-pointer hover:bg-green-100 hover:border-green-700 hover:text-green-700'>
                <CreditCard className='m-auto p-12  h-full w-full size-14 ' />
              </Button>
            </div>
          </div>

          <div className='flex justify-between items-center font-bold'>
            <p>Total x2</p>
            <p>$ 5,665,555</p>
          </div>
          <Link to={`/admin/products?orden=${numberOrden}`}>
            <Button variant="default" className='w-full h-full bg-blue-600 p-5 font-bold mb-3 cursor-pointer' >Agregar un nuevo Producto</Button>
          </Link>
          <Button variant="default" className='bg-black text-white p-7 w-full cursor-pointer'>
            <div>
              <p className='font-bold'>Orden Finalizada</p>
              <p>La orden pasara a finalizada</p>
            </div>
          </Button>
        </div>

      </div>
      <div className='flex flex-col'>
        <div className='h-16 flex w-full justify-between items-center'>
          <h2 className='font-bold text-2xl'>Lista de Pedidods</h2>
          <Link to="/admin/products?orden">
            <Button variant="default" className='h-full w-full cursor-pointer bg-green-700'>+ Nuevo Pedido</Button>
          </Link>
        </div>
        <div className="grid grid-cols-3 gap-5 h-fit overflow-y-auto scroll-auto max-h-[87vh]">
          {
            ordenList.map((orden)=>(
              <CardOrder item={orden} onClick={() => setSelectOrden(orden)} />

            ))
          }
        </div>
      </div>

    </div>
  )
}

export default OrderPage
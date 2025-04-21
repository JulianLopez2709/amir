import { OrdenReques } from '@/@types/Order'
import { getAllOrdersByCompany } from '@/api/order/getAllOrdersByCompany'
import CardOrder from '@/components/admin/CardOrder'
import Status from '@/components/admin/Status'
import { Button } from '@/components/ui/button'
import { CircleDollarSign, CreditCard, Printer } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

function OrderPage() {
  useEffect( () =>{
    async function fetchData() {
      const response = await getAllOrdersByCompany(1)
      setListOrder(response)
    }
    fetchData()
  },[])

  const[ listOrder , setListOrder] = useState<OrdenReques[]>([])
  
  
  const [selectOrden, setSelectOrden] = useState<OrdenReques | null>(null)
  const [detail, setDetail] = useState(false)
  const showDetail = () => {
    setDetail(!detail)
  }

  const numberOrden = 1457



  return (
    <div className='relative grid lg:grid-cols-[0.4fr_1fr] h-full gap-2'>
      <div className=' h-screen w-full'>
        <div className='w-full bg-white p-5 h-full' >
          <div className={`lg:hidden cursor-pointer`} onClick={showDetail}>
            close
          </div>
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
          <p className='font-bold'>items {selectOrden?.products?.length}</p>
          <div>
            <div className='mb-3'>

              <div className="flex flex-col w-full mb-3">
                {
                  selectOrden?.products?.map((p) => (
                    <div className="flex justify-between items-center">
                      <div className="size-10 bg-gray-200"></div>
                      <div>
                        <p>{p.product?.name}</p>
                        <p>Descripton</p>
                      </div>
                      <p>{p.quantity}</p>
                      <p>${p.product?.price_selling}</p>
                    </div>
                  ))
                }

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
              <p>$ {selectOrden?.total_price}</p>
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
            listOrder.map((orden,index) => (
              <li key={index} className='list-none'>
              <CardOrder item={orden} onClick={() => setSelectOrden(orden)} index={index + 1} />
              </li>

            ))
          }
        </div>
      </div>

    </div>
  )
}

export default OrderPage
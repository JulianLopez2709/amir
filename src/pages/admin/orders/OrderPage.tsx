import CardOrder from '@/components/admin/CardOrder'
import Status from '@/components/admin/Status'
import { Button } from '@/components/ui/button'
import { CircleDollarSign, CreditCard, Printer } from 'lucide-react'
import React from 'react'

function OrderPage() {
  return (
    <div className='relative grid lg:grid-cols-[0.4fr_1fr] h-full gap-2'>
      <div className='bg-white p-5' >
        <div className='flex justify-between items-center mb-4'>
          <h2>
            Orden #4785
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
        <p className='font-bold'>Orden 1</p>
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
              <div className='p-12 bg-green-100 border border-green-700 rounded-xl'>
                <CircleDollarSign className='m-auto' />
              </div>
              <div className='p-12 border rounded-xl'>
                <CreditCard className='m-auto' />
              </div>
            </div>
          </div>

          <div className='flex justify-between items-center font-bold'>
            <p>Total x2</p>
            <p>$ 5,665,555</p>
          </div>

          <Button variant="default" className='w-full bg-blue-600 p-7 font-bold mb-3'>Agregar un nuevo Producto</Button>
          <Button variant="default" className='bg-black text-white p-7 w-full'>
            <div>
              <p className='font-bold'>Orden Finalizada</p>
              <p>La orden pasara a finalizada</p>
            </div>
          </Button>
        </div>

      </div>
      <div className='grid grid-cols-3 gap-5'>

        <CardOrder />
        <CardOrder />
        <CardOrder />
        <CardOrder />
        <CardOrder />
      </div>
    </div>
  )
}

export default OrderPage
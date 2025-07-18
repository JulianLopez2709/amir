import Status from './Status'
import { Button } from '../ui/button'
import { OrdenReques } from '@/@types/Order'
import { BoxesIcon } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'


function CardOrder({ item, onClick, index }: { item: OrdenReques, onClick: () => void, index: number }) {
    const { user } = useAuth()
    console.log(item)
    return (
        <div className='p-3 bg-white rounded-xl cursor-pointer hover:bg-gray-50' onClick={onClick}>
            <div className='flex  justify-between pb-4'>
                <div className='flex gap-3'>
                    <div className='rounded-full size-10 bg-gray-100 flex items-center justify-center'>
                        <p className='font-bold'>
                            {
                                user?.name.toUpperCase().slice(0, 2) || "CN"
                            }
                        </p>
                    </div>
                    <div>
                        <p className='font-bold'>{item.cliente_create}</p>
                        <p className='text-gray-500'>Pedido #{index}</p>
                    </div>
                </div>
                <div>
                    <Status color='purple' name={item.status} />
                </div>
            </div>
            <div className='pb-4 flex flex-col gap-2'>
                {
                    item.products?.map((p, index) => (
                        <div className='flex gap-3 px-5' key={index}>
                            <div className='rounded-full size-10 bg-gray-100 flex items-center justify-center'>
                                <BoxesIcon className='size-7 text-gray-500' />
                            </div>
                            <div>
                                <p className='font-bold'>{p.product?.name}</p>
                                <p>${p.product?.price_selling}</p>
                            </div>
                        </div>

                    ))
                }
            </div>
            <div>
                <div className='flex items-center justify-between'>
                    <p className='font-bold text-gray-500'>Total por pagar:</p>
                    <p className='font-bold text-green-700'>${item.total_price}</p>
                </div>
                <Button variant="default" className='bg-black text-white p-7 w-full lg:hidden'>
                    <div>
                        <p className='font-bold'>Pedido Finalizada</p>
                        <p>La pedido pasara a finalizada</p>
                    </div>
                </Button>
            </div>
        </div>
    )
}

export default CardOrder
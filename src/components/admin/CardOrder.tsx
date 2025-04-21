import Status from './Status'
import { Button } from '../ui/button'
import { OrdenReques } from '@/@types/Order'


function CardOrder({ item, onClick, index }: { item: OrdenReques, onClick: () => void, index: number }) {

    return (
        <div className='p-3 bg-white rounded-xl cursor-pointer hover:bg-gray-50' onClick={onClick}>
            <div className='flex  justify-between pb-4'>
                <div className='flex gap-3'>
                    <div className='rounded-full size-10 bg-gray-100'></div>
                    <div>
                        <p className='font-bold'>{item.cliente_create}</p>
                        <p>pedido #{index}</p>
                    </div>
                </div>
                <div>
                    <Status color='purple' name={item.status} />
                </div>
            </div>
            <div className='pb-4'>
                {
                    item.products?.map((p, index) => (
                        <div className='flex gap-3 px-5' key={index}>
                            <div className='rounded-full size-10 bg-gray-100'></div>
                            <div>
                                <p className='font-bold'>{p.product?.name}</p>
                                <p>${p.product?.price_cost}</p>
                            </div>
                        </div>

                    ))
                }
            </div>
            <div>
                <div className='flex justify-center items-center'>

                </div>
                <Button variant="default" className='bg-black text-white p-7 w-full '>
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
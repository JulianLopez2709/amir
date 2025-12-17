import Status from './Status'
import { Button } from '../ui/button'
import { OrdenReques, Order } from '@/@types/Order'
import { BoxesIcon } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { STATUS_CONFIG } from '@/config/statusConfig'
import { formatDate } from '@/config/utils'
import { ScrollArea } from '../ui/scroll-area'
import { Separator } from '../ui/separator'


interface CardOrderProps {
    item: Order;
    onClick: () => void;
    index: number;
    selectOrden: Order | null;


    onConfirm: () => void;
    onComplete: () => void;
}

const CardOrder = ({ item, onClick, index, selectOrden, onComplete, onConfirm }: CardOrderProps) => {
    const { user } = useAuth()

    const statusInfo = STATUS_CONFIG[item.status.toUpperCase()] || STATUS_CONFIG.DEFAULT;


    return (
        <div className={`p-3 bg-white rounded-xl cursor-pointer hover:bg-gray-50 
                ${item.id === selectOrden?.id ? 'border-b-2 border-green-500' : ''}`} onClick={onClick}>
            <div className='flex  justify-between items-center '>
                <div className='flex gap-3'>
                    <div className='rounded-full size-10 bg-gray-100 flex items-center justify-center'>
                        <p className='font-bold'>
                            {
                                user?.name.toUpperCase().slice(0, 2) || "CN"
                            }
                        </p>
                    </div>
                    <div>
                        {/*Aqui va el nombre de la persona que tomo el pedido y el numero de pedido*/}
                        <p className='font-bold'>{item.detail?.cliente?.nombre}</p>
                        <p className=''>Pedido #{item.id.split("-")[0]}</p>
                    </div>
                </div>
                <div>
                    <Status bg={statusInfo.tailwindClasses.bg} textColor={statusInfo.tailwindClasses.text} color={statusInfo.color} name={statusInfo.text} />
                </div>
            </div>

            <div className='flex justify-between items-center'>
                <p className=''>{formatDate(item.createAt)?.data}</p>
                <p className=''>{formatDate(item.createAt)?.time}</p>
            </div>


            <ScrollArea  className=' flex flex-col gap-2 max-h-80 mb-1'>
                <div className='flex flex-col gap-1'>
                {
                    item.products?.map((p, index) => (
                        <div className='flex gap-3 rounded-xl border-gray-200 p-2 border-2 bg-gray-100' key={index}>
                            <div className='hidden lg:flex rounded-full size-10 bg-gray-100 items-center justify-center'>
                                <BoxesIcon className='size-7 text-gray-500' />
                            </div>
                            <div className='w-full'>
                                <div className='flex justify-between items-center  w-full'>
                                    <p className='font-bold'>{p.product_snapshot?.name}</p>
                                    <div className='flex items-center gap-1'>
                                        <div className='p-1 rounded-sm bg-green-200 font-bold '>
                                            <p>{p.status}</p>
                                        </div>
                                        <p className='font-bold'>x{p.quantity}</p>
                                    </div>
                                </div>
                                <div>
                                    {p.product_snapshot.optionsSelected.map((opc, index) => (
                                        <div className='justify-between items-center flex mb-1'>
                                            <div className='flex gap-2 items-center'>
                                                <p>{opc.variantName}</p>
                                                <div className='p-1 items-center justify-center rounded-sm bg-green-200'>
                                                    <p>{opc.optionName}</p>
                                                </div>
                                            </div>
                                            <div>
                                                <p>${opc.extraPrice}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className='flex gap-2'>
                                    <p className=' flex-1 p-1 rounded-sm bg-white'>{p.notes || "Sin notas"}</p>
                                    <p>${p.subtotal}</p>
                                </div>
                            </div>
                        </div>

                    ))
                }
                </div>
            </ScrollArea >

            <div className='w-full'>
                <Separator className=""/>
                <div className='flex flex-col'>
                    <div className='flex items-center justify-between'>
                        <p className=''>Total de productos</p>
                        <p className='font-bold'>{item.products.length}</p>
                    </div>
                    <div className='flex items-center justify-between'>
                        <p className='font-bold'>Total por pagar:</p>
                        <p className='font-bold'>${item.total_price}</p>
                    </div>
                </div>
                <div className='flex flex-col sm:flex-row gap-2 w-full'>
                    <Button variant="outline" className='flex-1 h-auto'
                        onClick={(e) => {
                            e.stopPropagation()
                            onConfirm()
                        }}>
                        <div>
                            <p className='font-bold'>Pedido Finalizada</p>
                        </div>
                    </Button>
                    <Button variant="default" className='flex-2 bg-black text-white h-full'
                        onClick={(e) => {
                            e.stopPropagation()
                            onComplete()
                        }}>
                        <div className="text-center">
                            <p className='font-bold'>Pedido Finalizada</p>
                            <p className='text-sm'> finalizada</p>
                        </div>
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default CardOrder
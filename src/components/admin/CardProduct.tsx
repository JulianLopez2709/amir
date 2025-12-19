import { useState } from 'react'
import { Button } from '../ui/button'
import Product from "@/@types/Product";
import { BoxesIcon, Edit3 } from 'lucide-react';
import { Separator } from '../ui/separator';
import { ProductToOrder, SelectedVariant } from '@/@types/Order';

type CardProductProps = {
    product: Product;
    addClick: (product: ProductToOrder) => void;
    editClick: () => void;
    index: number
}


function CardProduct({ product, addClick, editClick, index }: CardProductProps) {
    const [count, setCount] = useState(1)
    const [selectedOptions, setSelectedOptions] = useState<SelectedVariant[]>([])

    const generateId = (id: number) => {
        const newId = String(id).split("-")[0]
        return newId
    }




    const toggleOption = (variant: any, option: any) => {
        setSelectedOptions(prev => {
            const variantIndex = prev.findIndex(
                v => v.variantName === variant.name
            )

            // 🟢 Variante NO existe
            if (variantIndex === -1) {
                return [
                    ...prev,
                    {
                        variantName: variant.name,
                        options: [
                            {
                                optionId: option.id,
                                name: option.name,
                                extraPrice: option.extraPrice
                            }
                        ]
                    }
                ]
            }

            const variantItem = prev[variantIndex]
            const optionExists = variantItem.options.some(
                o => o.optionId === option.id
            )

            // 🔁 Quitar opción
            if (optionExists) {
                const newOptions = variantItem.options.filter(
                    o => o.optionId !== option.id
                )

                // si se queda sin opciones → quitar variante
                if (newOptions.length === 0) {
                    return prev.filter((_, i) => i !== variantIndex)
                }

                return prev.map((v, i) =>
                    i === variantIndex
                        ? { ...v, options: newOptions }
                        : v
                )
            }

            // ➕ Agregar opción
            return prev.map((v, i) =>
                i === variantIndex
                    ? {
                        ...v,
                        options: [
                            ...v.options,
                            {
                                optionId: option.id,
                                name: option.name,
                                extraPrice: option.extraPrice
                            }
                        ]
                    }
                    : v
            )
        })
    }





    return (
        <div className="bg-white rounded-2xl flex flex-col h-auto w-full overflow-hidden" >
            <div className='h-full flex flex-col'>

                <div className=" relative h-48  w-full bg-gray-100 flex items-center justify-center">
                    <div className='rounded-2xl'>
                        {
                            product.imgUrl && /* ?(
                                <img src={product.imgUrl} alt={product.name} className="w-full h-full object-cover" />
                            ) :*/ (
                                <BoxesIcon className="text-sm text-gray-500 size-10" />
                            )
                        }
                    </div>

                    <div className='w-7 h-7 border-2 rounded-sm absolute bg-white top-2 right-2 '>

                    </div>
                </div>
                <div className='p-2'>

                    <div className="flex justify-between items-center gap-2">
                        <p className="text-sm ">card id : {generateId(product.id!)}</p>
                        <p className="text-sm opacity-70 text-gray-400">{product.barcode}</p>
                    </div>
                    <p className="font-bold">
                        {product.name}
                    </p>
                    <p className="text-sm text-gray-500 flex-1">
                        {product.description}
                    </p>
                    <div className="flex justify-between items-end esw">
                        <div className=''>
                            <p className='font-bold'>Precio</p>
                            <p className="font-bold text-xl" style={{ color: 'var(--primary-color)' }}>
                                <span className="text-sm" >$</span>{product.price_selling}
                            </p>
                        </div>
                        {
                            product.manage_stock === true && (
                                <div className='flex flex-col justify-center items-center '>
                                    <p>Disponible</p>
                                    <p className="" style={{ color: 'var(--primary-color)' }}>
                                        {product.stock_records?.quantity} Unidades
                                    </p>
                                </div>
                            )
                        }
                    </div>
                    <Separator className='mb-1' />
                    {product.variants?.map((v) => (
                        <div className='md:flex gap-1 items-center'>
                            <p className='font-bold'>{v.name}</p>
                            <div className='flex mb-1 gap-2'>

                                {v.options.map(opc => {
                                    const selected =
                                        selectedOptions
                                            .find(sv => sv.variantName === v.name)
                                            ?.options.some(o => o.optionId === opc.id) || false
                                    return (
                                        <div
                                            key={opc.id}
                                            className={`p-1 rounded-sm min-w-2.5 cursor-pointer
                                            ${selected ? "bg-black text-white" : "bg-gray-400"}
      `}
                                            onClick={() => toggleOption(v, opc)}
                                        >
                                            <p className="text-sm">
                                                {opc.name}
                                                {opc.extraPrice > 0 && ` (+${opc.extraPrice})`}
                                            </p>
                                        </div>
                                    )
                                })}

                            </div>
                        </div>


                    ))}

                    {
                        product.manage_stock != undefined /*&& /*product..quantity > 0*/ ? (
                            <div className="md:flex w-full items-center justify-between gap-1">
                                <div className="mb-1 md:mb-0 flex flex-1 justify-between items-center rounded-sm gap-2 font-bold p-1 w-full" style={{ background: 'var(--primary-color)' }}>
                                    <p className=" p1 px-2 md:px-3 bg-white rounded-sm cursor-pointer" onClick={() => setCount((acount) => acount > 1 ? acount - 1 : acount)}>-</p>
                                    <p className="">{count}</p>
                                    <p className=" p1 px-2 md:px-3 bg-white rounded-sm cursor-pointer" onClick={() => setCount((acount) => acount + 1)}>+</p>
                                </div>
                                <Button className="flex-2 cursor-pointer w-full" style={{ background: 'var(--primary-color)' }} variant="default" onClick={() =>
                                    addClick({
                                        product,
                                        quantity: count,
                                        notes: undefined,
                                        selectedOptions
                                    })
                                }
                                >
                                    <p className='text-sm'>
                                        Agregar al carrito
                                    </p>
                                </Button>
                            </div>
                        ) : (
                            <div className="flex justify-center items-center bg-red-500  p-1 rounded-sm font-bold ">
                                <p className="text-sm text-white">Sin stock</p>
                            </div>
                        )
                    }
                </div>

            </div>
            {
                /*
                                <div className='flex items-center justify-center p-3 bg-blue-950 w-full h-auto font-bold cursor-pointer gap-3 text-white' onClick={editClick}>
                                <Edit3/>
                                <p>Editar Producto</p>
                            </div>
                            */
            }
        </div >
    )
}

export default CardProduct
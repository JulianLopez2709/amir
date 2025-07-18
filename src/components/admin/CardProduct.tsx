import { useState } from 'react'
import { Button } from '../ui/button'
import Product from "@/@types/Product";
import { BoxesIcon } from 'lucide-react';

type CardProductProps = {
    product: Product;
    addClick: (count: number) => void;
    index: number
}


function CardProduct({ product, addClick, index }: CardProductProps) {
    const [count, setCount] = useState(1)

    const generateId = (id: number) => {
        const newId = String(id).split("-")[0]
        return newId
    }

    return (
        <div className="bg-white rounded-2xl flex flex-col p-3 h-full w-full" >
            <div className="flex justify-between items-center gap-2">
                <p className='font-bold text-xl'>{index + 1}</p>
                <p className="text-sm opacity-70 text-gray-400">{product.barcode}</p>
            </div>
            <div className="h-48  w-full bg-gray-100 flex items-center justify-center">
                {
                    product.imgUrl ? (
                        <img src={product.imgUrl} alt={product.name} className="w-full h-full object-cover" />
                    ) : (
                        <BoxesIcon className="text-sm text-gray-500 size-10" />
                    )
                }
            </div>
            <p className="font-bold" style={{ color: 'var(--primary-color)' }}>
                {product.name}
            </p>
            <p className="text-sm text-gray-500 flex-1">
                {product.description}
            </p>
            <div className="flex justify-between items-end esw">
                <p className="font-bold text-xl">
                    <span className="text-sm text-green-700">$</span>{product.price_selling}
                </p>

                <p className="text-sm  opacity-70">
                    can {product.stock}
                </p>
            </div>

            {product.detail && Object.keys(product.detail).length > 0 && (
                <div className="text-xs text-gray-700 my-2 space-y-1 border-t pt-2">
                    {Object.entries(product.detail).map(([key, value]) => (
                        <div key={key} className="flex justify-between">
                            <span className="font-semibold capitalize">{key}:</span>
                            <span>{String(value)}</span>
                        </div>
                    ))}
                </div>
            )}

            {
                product.stock != undefined && product.stock > 0 ? (
                    <div className="md:flex w-full items-center justify-between">
                        <div className="w-1/3 flex justify-between items-center rounded-sm gap-2 font-bold p-1" style={{ background: 'var(--primary-color)' }}>
                            <p className=" p1 px-2 md:px-3 bg-white rounded-sm cursor-pointer" onClick={() => setCount((acount) => acount > 1 ? acount - 1 : acount)}>-</p>
                            <p className="">{count}</p>
                            <p className=" p1 px-2 md:px-3 bg-white rounded-sm cursor-pointer" onClick={() => setCount((acount) => acount + 1)}>+</p>
                        </div>
                        <Button className="cursor-pointer" style={{ background: 'var(--primary-color)' }} variant="default" onClick={() => addClick(count)}>
                            <p className='text-sm'>
                                Agregar
                            </p>
                        </Button>
                    </div>
                ) : (
                    <div className="flex justify-center items-center bg-red-500  p-1 rounded-sm font-bold ">
                        <p className="text-sm text-white">Sin stock</p>
                    </div>
                )
            }


            <p className="text-sm opacity-70 text-gray-400 text-end">card id : {generateId(product.id!)}</p>

        </div >
    )
}

export default CardProduct
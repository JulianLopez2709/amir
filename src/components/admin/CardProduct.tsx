import { useState } from 'react'
import { Button } from '../ui/button'
import Product from "@/@types/Product";

type CardProductProps = {
    product : Product;
    addClick : (count:number)=>void;
}


function CardProduct({product,addClick}:CardProductProps) {
    const [count, setCount] = useState(1)
    return (
        <div className="bg-white rounded-2xl flex flex-col p-5" >
            <div className="flex justify-between items-center ">
                <p className="font-bold">{product.id}</p>
            </div>
            <div className="h-60 w-full bg-gray-400">
                <img src="" alt="" />
            </div>
            <p className="text-green-700">
                {product.name}
            </p>
            <p className="">
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
            <div className="md:flex w-full items-center justify-between">
                <div className="w-1/3 flex justify-center items-center bg-green-100 p-1 rounded-sm gap-2 font-bold">
                    <p className=" p1 px-2 md:px-3 bg-white rounded-sm cursor-pointer" onClick={() => setCount((acount) => acount > 1 ? acount - 1 : acount)}>-</p>
                    <p className="">{count}</p>
                    <p className=" p1 px-2 md:px-3 bg-white rounded-sm cursor-pointer" onClick={() => setCount((acount) => acount + 1)}>+</p>
                </div>
                <Button className="bg-green-700 cursor-pointer" variant="default" onClick={()=>addClick(count)}>
                    <p className='text-sm'>
                        Agregar al carrito
                    </p>
                </Button>
            </div>
        </div >
    )
}

export default CardProduct
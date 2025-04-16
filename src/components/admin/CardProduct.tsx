import React, { useState } from 'react'
import { Button } from '../ui/button'

function CardProduct() {
    const [count, setCount] = useState(0)
    return (
        <div className="bg-white rounded-2xl flex flex-col p-5">
            <div className="flex justify-between items-center ">
                <p className="font-bold">11124</p>
            </div>
            <div className="h-60 w-full bg-gray-400">
                <img src="" alt="" />
            </div>
            <p className="text-green-700">
                titulo del producto
            </p>
            <p className="">
                Description del producto o servicio de cada cliente
            </p>
            <div className="flex justify-between items-end esw">
                <p className="font-bold text-xl">
                    <span className="text-sm text-green-700">$</span>20,000
                </p>

                <p className="text-sm  opacity-70">
                    can 204
                </p>
            </div>
            <div className="flex items-center justify-between">
                <div className="flex justify-center items-center bg-green-100 p-1 rounded-sm gap-3 font-bold">
                    <p className=" p-2 bg-white rounded-sm cursor-pointer" onClick={() => setCount((acount) => acount > 0 ? acount - 1 : acount)}>-</p>
                    <p className="">{count}</p>
                    <p className=" p-2 bg-white rounded-sm cursor-pointer" onClick={() => setCount((acount) => acount + 1)}>+</p>
                </div>
                <Button className="bg-green-700 cursor-pointer" variant="default">
                    Agregar al carrito
                </Button>
            </div>
        </div >
    )
}

export default CardProduct
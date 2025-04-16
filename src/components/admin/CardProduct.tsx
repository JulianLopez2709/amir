import React from 'react'
import { Button } from '../ui/button'

function CardProduct() {
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
            <div className="flex justify-center items-end esw">
                <p className="font-bold text-xl">
                    <span className="text-sm text-green-700">$</span>20,000
                </p>

                <p className="text-sm  opacity-70">
                    can 204
                </p>
            </div>
            <div className="flex items-center justify-between">
                <div className="flex justify-center items-center bg-green-100 p-1 rounded-sm">
                    <p className="font-bold p-1 bg-white rounded-sm">-</p>
                    <p className="font-bold">2</p>
                    <p className="font-bold p-1 bg-white rounded-sm">+</p>
                </div>
                <Button className="bg-green-700 " variant="default">
                    Agregar al carrito
                </Button>
            </div>
        </div>
    )
}

export default CardProduct
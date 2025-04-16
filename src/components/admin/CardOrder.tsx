import React from 'react'
import Status from './Status'
import { Button } from '../ui/button'


function CardOrder() {
    return (
        <div className='p-3 bg-white rounded-xl'>
            <div className='flex  justify-between pb-4'>
                <div className='flex gap-3'>
                    <div className='rounded-full size-10 bg-gray-100'></div>
                    <div>
                        <p className='font-bold'>Julian David</p>
                        <p>orden #145236</p>
                    </div>
                </div>
                <Status />
            </div>
            <div className='pb-4'>
                <div className='flex gap-3 px-5'>
                    <div className='rounded-full size-10 bg-gray-100'></div>
                    <div>
                        <p className='font-bold'>Titulo</p>
                        <p>$2.000</p>
                    </div>
                </div>
            </div>
            <div>
                <div className='flex justify-center items-center'>

                </div>
                <Button variant="default" className='bg-black text-white p-7 w-full'>
                    <div>
                        <p className='font-bold'>Orden Finalizada</p>
                        <p>La orden pasara a finalizada</p>
                    </div>
                </Button>
            </div>
        </div>
    )
}

export default CardOrder
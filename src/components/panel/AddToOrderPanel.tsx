import { newProductToOrder } from '@/@types/Order';
import React from 'react'

interface Props {
  productsAdded: newProductToOrder[];
}


function AddToOrderPanel({ productsAdded }: Props) {
  return (
    <div>
      AddToOrderPanel
      <div className="flex flex-col h-full justify-between items-center">
        <div className="flex flex-col w-full mb-3">
          {
            productsAdded.map((p) => (
              <div className="flex justify-between items-center gap-4">
                <div className="size-10 bg-gray-200"></div>
                <div>
                  <p>{p.product.name}</p>
                  <p>{p.product.description}</p>
                </div>
                <p>{p.acount}</p>
                <p>${p.product.price_cost}</p>
                x
              </div>
            ))
          }

        </div>
      </div>
    </div>
  )
}

export default AddToOrderPanel
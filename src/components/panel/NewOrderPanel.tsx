import Status from "../admin/Status"
import { Button } from "../ui/button"
import { Trash } from "lucide-react"
import { newProductToOrder } from "@/@types/Order"

interface Props {
    productsAdded: newProductToOrder[];
  }
  

function NewOrderPanel(
    {productsAdded} :Props
) {

    return (
        <div>
            {
                /*
                <div className={`${shoppingCart ? "flex" : "hidden"} lg:hidden cursor-pointer`} onClick={showDetail}>
                close
                </div>*/
            }
            <div className="flex justify-between w-full">
                <h2 className="font-bold text-xl">Nueva Orden</h2>
                <Status name="new" color="purple" />
            </div>
            <h3 className="font-bold text-lg">Orden Items {productsAdded.length}</h3>

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
                                <Trash className="text-white bg-red-500 m-auto p-1 cursor-pointer hover:opacity-50" onClick={() => { }} />
                            </div>
                        ))
                    }

                </div>
                <div className="flex justify-center items-center h-full w-full bg-gray-200">

                </div>
            </div>

            <div>
                <div className="flex w-full justify-between items-center font-bold">
                    <p>
                        Total x{productsAdded.length}
                    </p>
                    <p>
                        $ 2,2000
                    </p>
                </div>
                <Button variant="default" className="bg-green-700 w-full lg:px-24" onClick={() => { }}>Crear nueva orden</Button>
            </div>

        </div>
    )
}

export default NewOrderPanel
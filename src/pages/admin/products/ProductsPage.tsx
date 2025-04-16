import CardProduct from "@/components/admin/CardProduct";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSearchParams } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { useState } from "react";
import Status from "@/components/admin/Status";


function ProductsPage() {
    const [searchParams] = useSearchParams();
    const ordenId = searchParams.get("orden");
    const [shoppingCart, setShoppingCart] = useState(false)
    console.log(ordenId)

    return (
        <div className="relative grid lg:grid-cols-[1fr_0.5fr] h-full ">

            <div className="p-3">
                <div className="flex justify-between items-center gap-5">
                    <div className="p-2 rounded-2xl bg-green-700 text-white">Filter</div>
                    <Input className="bg-white p-2 text-2xl" placeholder="Busca producto por el nombre o el codigo." />
                    <Button className="border border-green-700 bg-white text-green-700" variant="outline">+ Nuevo Producto</Button>
                    <Button className="lg:hidden bg-yellow-700" onClick={() => setShoppingCart(!shoppingCart)}><ShoppingCart className="h-10 w-10 text-white" /></Button>
                </div>

                {
                    //component cards
                }
                
                <div className="h-full">
                <div className="grid grid-cols-2 xl:grid-cols-3 gap-5 overflow-y-auto max-h-[88vh] object-cover">
                    {
                        //card product
                    }
                    <CardProduct />
                    

                </div>
                </div>
                

            </div>

            <div className="top-0 lg:flex lg:right-0 bg-white h-full flex-col justify-center items-center p-7 ">
                {
                    ordenId != "" ? (
                        <>
                            <div className="m-auto absolute top-0">
                                <div className="flex justify-between w-full">
                                    <h2 className="font-bold text-xl">Nueva Orden</h2>
                                    <Status name="process" color="red"/>
                                </div>
                                <h3 className="font-bold text-lg">Orden Items 2</h3>

                                <div className="flex flex-col h-full justify-between items-center">
                                    <div className="flex flex-col w-full mb-3">
                                        <div className="flex justify-between items-center">
                                            <div className="size-10 bg-gray-200"></div>
                                            <div>
                                                <p>titulo</p>
                                                <p>Descripton</p>
                                            </div>
                                            <p>1</p>
                                            <p>$2,000,120</p>
                                        </div>
                                    </div>
                                    <div className="flex justify-center items-center h-full w-full bg-gray-200">

                                    </div>
                                </div>

                                <div>
                                    <div className="flex w-full justify-between items-center font-bold">
                                        <p>
                                            Total x0
                                        </p>
                                        <p>
                                            $ 0
                                        </p>
                                    </div>
                                    <Button variant="default" className="bg-green-700 w-full lg:px-24">Crear nueva orden</Button>
                                </div>
                            </div>

                        </>
                    ) : (
                        <p>Editando orden #{ordenId}</p>
                    )
                }

            </div>
        </div>
    )
}

export default ProductsPage
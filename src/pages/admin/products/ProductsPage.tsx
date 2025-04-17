import CardProduct from "@/components/admin/CardProduct";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSearchParams } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { useState } from "react";
import Status from "@/components/admin/Status";
import Product from "@/@types/Product";
import { TypeUser } from "@/@types/User";


function ProductsPage() {
    const [searchParams] = useSearchParams();
    const ordenId = searchParams.get("orden");
    const [shoppingCart, setShoppingCart] = useState(false)
    const [listProductsAdded, setListProductsAdded] = useState<Product[]>([])
    const typeuser : TypeUser = "admin"
    const listProduct: Product[] = [
        {
            id: 145,
            type: "Producto",
            name: "Titulo del producto",
            description: "descripton del producto",
            price_selling: 145,
            price_cost: 145,
            stock: 145,

            imgUrl: "",
            barcode: 145,
        },
        {
            id: 784,
            type: "Producto",
            name: "Titulo del producto 0222",
            description: "descripton del producto",
            price_selling: 784,
            price_cost: 784,
            stock: 784,

            imgUrl: "",
            barcode: 784,
        }
    ]
    interface newOrden{

    }

    const newProduct = ()=>{
        console.log("entra")
    }

    console.log(ordenId)

    return (
        <div className="relative grid lg:grid-cols-[1fr_0.5fr] h-full ">

            <div className="md:p-3">
                <div className="flex justify-between items-center gap-5">
                    <div className="p-2 rounded-2xl bg-green-700 text-white">Filter</div>
                    <Input className="bg-white p-2 text-2xl" placeholder="Busca producto por el nombre o el codigo." />
                    {
                        typeuser == "admin" ? (
                            <Button className="border border-green-700 bg-white text-green-700" variant="outline" onClick={newProduct}>+ Nuevo Producto</Button>
                        ) : ( null )
                    }
                    <Button className="lg:hidden bg-yellow-700" onClick={() => setShoppingCart(!shoppingCart)}><ShoppingCart className="h-10 w-10 text-white" /></Button>
                </div>

                {
                    //component cards
                }

                <div className="h-full">
                    <div className="grid grid-cols-2 xl:grid-cols-3 gap-5 overflow-y-auto max-h-[88vh] object-cover">
                        {
                            //un for de la respuesta a la apicard product
                            listProduct.map((product) => (
                                <CardProduct product={product} addClick={() => setListProductsAdded(prevList => [...prevList, product])} />
                            ))
                        }
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
                                    <Status name="process" color="red" />
                                </div>
                                <h3 className="font-bold text-lg">Orden Items {listProductsAdded.length}</h3>

                                <div className="flex flex-col h-full justify-between items-center">
                                    <div className="flex flex-col w-full mb-3">
                                        {
                                            listProductsAdded.map((p) => (
                                                <div className="flex justify-between items-center">
                                                    <div className="size-10 bg-gray-200"></div>
                                                    <div>
                                                        <p>{p.name}</p>
                                                        <p>{p.description}</p>
                                                    </div>
                                                    <p>1</p>
                                                    <p>${p.price_cost}</p>
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
                                            Total x{listProductsAdded.length}
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
import CardProduct from "@/components/admin/CardProduct";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSearchParams } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { useEffect, useState } from "react";
import Product from "@/@types/Product";
import { TypeUser } from "@/@types/User";
import { getAllProductByCompany } from "@/api/product/getAllProductByCompany";
import RightPanel from "@/components/admin/RightPanel";
import { newProductToOrder } from "@/@types/Order";



type PanelMode = 'new-order' | 'create-product' | 'add-to-order'

function ProductsPage() {
    const [searchParams] = useSearchParams();
    const ordenId = searchParams.get("orden");
    const isEditingOrder = Boolean(ordenId);

    const [modePanelRight, setModePanelRight] = useState<PanelMode>('new-order')
    const [shoppingCart, setShoppingCart] = useState(false)
    const [listProductsAdded, setListProductsAdded] = useState<newProductToOrder[]>([])
    const typeuser: TypeUser = "admin"

    const [listProduct, setListProduct] = useState<Product[]>([])

    const handle = async () => {

        try {
            const response = await getAllProductByCompany(1)
            setListProduct(response)
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        if (isEditingOrder) {
            setModePanelRight("add-to-order");
            setShoppingCart(true);
        }
    }, [ordenId]);

    useEffect(() => {
        handle()
    }, [])


    const addNewProduct = (product: Product, acount: number) => {
        const orden: newProductToOrder = {
            product: product,
            acount: acount
        }

        setListProductsAdded(prevList => [...prevList, orden])

        setModePanelRight(isEditingOrder ? "add-to-order" : "new-order");
    }


    const newProductClick = () => {
        setModePanelRight('create-product')
    }

    const showDetail = () => {
        setShoppingCart(!shoppingCart)
    }


    return (
        <div className="relative grid lg:grid-cols-[1fr_0.5fr] h-full ">

            <div className="md:p-3">
                <div className="flex justify-between items-center gap-5">
                    <div className="p-2 rounded-2xl bg-green-700 text-white">Filter</div>
                    <Input className="bg-white p-2 text-2xl" placeholder="Busca producto por el nombre o el codigo." />
                    {
                        typeuser == "admin" ? (
                            <Button className="border border-green-700 bg-white text-green-700 cursor-pointer" variant="outline" onClick={newProductClick}>+ Nuevo Producto</Button>
                        ) : (null)
                    }
                    <Button className={`lg:hidden bg-yellow-700`} onClick={showDetail}><ShoppingCart className="h-10 w-10 text-white" /></Button>
                </div>

                { /*component cards*/ }
                <div className="h-full">
                    <div className="grid grid-cols-2 xl:grid-cols-3 gap-5 overflow-y-auto max-h-[88vh] object-cover">
                        {
                            //un for de la respuesta a la apicard product
                            listProduct.map((product) => (
                                <CardProduct product={product} addClick={(count) => addNewProduct(product, count)} />
                            ))
                        }
                    </div>
                </div>
            </div>

            <div className={`${shoppingCart ? "flex" : "hidden"} top-0 lg:flex lg:right-0 bg-white h-full flex-col py-3 px-7`}>
                <RightPanel
                    mode={modePanelRight}
                    productsAdded={listProductsAdded}
                    setProductsAdded={setListProductsAdded}
                    onClose={() => setShoppingCart(false)}
                />
            </div>
        </div>
    )
}

export default ProductsPage
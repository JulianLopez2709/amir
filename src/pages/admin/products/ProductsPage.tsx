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
import { useAuth } from "@/context/AuthContext";


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
    const {company} = useAuth();


    const handle = async () => {
        if (!company?.id) {
            setListProduct([]);
            return;
        }
        
        try {
            const response = await getAllProductByCompany(company.id);
            setListProduct(response)
        } catch (err) {
            console.error("Error loading products:", err);
            setListProduct([]);
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
    }, [company])


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
                <div className="flex justify-between items-center gap-5 mb-2">
                    <div className="p-2 rounded-sm bg-green-700 text-white">Filter</div>
                    <Input className="bg-white p-2 text-sm" placeholder="Busca producto por el nombre o el codigo." />
                    {
                        company?.role === "admin" ? (
                            <Button className="border border-green-700 bg-white text-green-700 cursor-pointer" variant="outline" onClick={newProductClick}>+ Nuevo Producto</Button>
                        ) : (null)
                    }
                    <Button className={`lg:hidden bg-yellow-700 cursor-pointer`} onClick={showDetail}><ShoppingCart className="h-10 w-10 text-white" /></Button>
                </div>

                { /*component cards*/}
                <div className="h-full">
                    {listProduct.length === 0 && company?.role === "admin" ? (
                        <div className="flex flex-col items-center justify-center h-full gap-4 p-8">
                            <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center">
                                <ShoppingCart className="w-16 h-16 text-gray-400" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-700">No hay productos</h2>
                            <p className="text-gray-500 text-center max-w-md">
                                Esta compañía aún no tiene productos registrados. ¡Comienza agregando tu primer producto!
                            </p>
                            {typeuser === "admin" && (
                                <Button 
                                    className="mt-4 bg-green-700 hover:bg-green-800 text-white" 
                                    onClick={newProductClick}
                                >
                                    + Agregar Primer Producto
                                </Button>
                            )}
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 xl:grid-cols-3 gap-5 overflow-y-auto max-h-[90vh] md:max-h-[85vh] object-cover">
                            {listProduct.map((product, index) => (
                                <li key={index} className="flex justify-center items-center">
                                    <CardProduct product={product} addClick={(count) => addNewProduct(product, count)} index={index} />
                                </li>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <div className={`
                    fixed z-50 
                    ${shoppingCart ? "flex" : "hidden"} 
                    right-0 
                    h-[95vh] w-full 
                    flex-col bg-white 
                    py-2 px-2 lg:px-7 
                    lg:static lg:flex lg:w-auto lg:h-auto
                `}>
                <RightPanel
                    mode={modePanelRight}
                    productsAdded={listProductsAdded}
                    setProductsAdded={setListProductsAdded}
                    onClose={() => setShoppingCart(false)}
                />
            </div>
        </div >
    )
}

export default ProductsPage
import CardProduct from "@/components/admin/CardProduct";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSearchParams } from "react-router-dom";
import { ShoppingCart, Search, RefreshCcw } from "lucide-react";
import { useEffect, useState } from "react";
import Product from "@/@types/Product";
import { getAllProductByCompany } from "@/api/product/getAllProductByCompany";
import RightPanel from "@/components/admin/RightPanel";
import { newProductToOrder } from "@/@types/Order";
import { useAuth } from "@/context/AuthContext";
import { useSocket } from "@/context/SocketContext"

type PanelMode = 'new-order' | 'create-product' | 'add-to-order'

function ProductsPage() {
    const [searchParams] = useSearchParams();
    const ordenId = searchParams.get("orden");
    const isEditingOrder = Boolean(ordenId);

    const [modePanelRight, setModePanelRight] = useState<PanelMode>('new-order')
    const [shoppingCart, setShoppingCart] = useState(false)
    const [listProductsAdded, setListProductsAdded] = useState<newProductToOrder[]>([])
    const [searchTerm, setSearchTerm] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [listProduct, setListProduct] = useState<Product[]>([])
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
    const { company } = useAuth();
    const {socket} = useSocket()

    const handle = async () => {
        setIsLoading(true)

        if (!company?.id) {
            setListProduct([]);
            setFilteredProducts([]);
            return;
        }

        try {
            setListProductsAdded([])
            const response = await getAllProductByCompany(company.id);
            setListProduct(response)
            setFilteredProducts(response)
        } catch (err) {
            setListProduct([]);
            setFilteredProducts([]);
        } finally {
            setIsLoading(false)
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

    useEffect(() => {
        if (!socket) return;

        // Función que se ejecutará cuando llegue un nuevo producto
        const handleNewProduct = (newProduct: Product) => {
            // Actualizamos el estado de productos de forma segura,
            // añadiendo el nuevo producto al principio de la lista.
            setListProduct(prevList => [newProduct, ...prevList]);
        };

        // Suscribimos el componente al evento 'newProduct'
        socket.on('newProduct', handleNewProduct);
        

        // Función de limpieza: Es CRUCIAL desuscribirse del evento
        // cuando el componente se desmonte para evitar memory leaks.
        return () => {
            socket.off('newProduct', handleNewProduct);
        };

    }, [socket]);

    // Efecto para filtrar productos cuando cambia el término de búsqueda
    useEffect(() => {
        if (!searchTerm.trim()) {
            setFilteredProducts(listProduct);
            return;
        }

        const searchTermLower = searchTerm.toLowerCase();
        const filtered = listProduct.filter(product =>
            product.name.toLowerCase().includes(searchTermLower) ||
            (product.barcode && product.barcode.toString().includes(searchTermLower))
        );
        setFilteredProducts(filtered);
    }, [searchTerm, listProduct]);

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


    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full p-8">
                <div className="flex flex-col items-center gap-4">
                    <div className="animate-spin">
                        <RefreshCcw className="h-8 w-8 text-green-700" />
                    </div>
                    <p className="text-gray-600">Cargando productos...</p>
                </div>
            </div>
        );
    }


    return (
        <div className="relative grid lg:grid-cols-[1fr_0.5fr] h-full ">

            <div className="md:p-3">
                <div className="flex justify-between items-center gap-5 mb-2">
                    <div className="relative flex-1">
                        <Input
                            className="bg-white p-2 pl-10 text-sm w-full"
                            placeholder="Buscar por nombre o código de barras..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    </div>
                    {
                        company?.role === "admin" ? (
                            <Button className="border border-green-700 bg-white text-green-700 cursor-pointer" variant="outline" onClick={newProductClick}>+ Nuevo Producto</Button>
                        ) : (null)
                    }
                    <Button className={`lg:hidden bg-yellow-700 cursor-pointer`} onClick={showDetail}><ShoppingCart className="h-10 w-10 text-white" /></Button>
                </div>

                { /*component cards*/}
                <div className="h-full">
                    {filteredProducts.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full gap-4 p-8">
                            <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center">
                                <ShoppingCart className="w-16 h-16 text-gray-400" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-700">
                                {searchTerm ? "No se encontraron productos" : "No hay productos"}
                            </h2>
                            <p className="text-gray-500 text-center max-w-md">
                                {searchTerm
                                    ? "No hay productos que coincidan con tu búsqueda. Intenta con otros términos."
                                    : "Esta compañía aún no tiene productos registrados. ¡Comienza agregando tu primer producto!"
                                }
                            </p>
                            {!searchTerm && company?.role === "admin" && (
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
                            {filteredProducts.map((product, index) => (
                                <li key={index} className="flex justify-center items-center">
                                    <CardProduct product={product} addClick={(count) => addNewProduct(product, count)} index={index} editClick={()=>{}}/>
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
        </div>
    )
}

export default ProductsPage
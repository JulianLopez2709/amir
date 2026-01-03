import CardProduct from "@/components/admin/CardProduct";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSearchParams } from "react-router-dom";
import { ShoppingCart, Search, RefreshCcw } from "lucide-react";
import { useEffect, useState } from "react";
import Product from "@/@types/Product";
import { getAllProductByCompany } from "@/api/product/getAllProductByCompany";
import RightPanel from "@/components/admin/RightPanel";
import { newProductToOrder, Order, OrderProduct, ProductToOrder, SelectedVariant } from "@/@types/Order";
import { useAuth } from "@/context/AuthContext";
import { useSocket } from "@/context/SocketContext"
import { getOrderById } from "@/api/order/getAllOrdersByCompany";

type PanelMode = 'order' | 'create-product' | 'edit-order';

function ProductsPage() {
    const [searchParams] = useSearchParams();
    const ordenId = searchParams.get("orden");
    const isEditingOrder = Boolean(ordenId);

    const [modePanelRight, setModePanelRight] = useState<PanelMode>('order')
    const [shoppingCart, setShoppingCart] = useState(false)
    const [listProductsAdded, setListProductsAdded] = useState<ProductToOrder[]>([])
    const [searchTerm, setSearchTerm] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [listProduct, setListProduct] = useState<Product[]>([])
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
    const { company } = useAuth();
    const { socket } = useSocket()

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


    /*const mappedProducts: ProductToOrder[] = order.products.map((p: OrderProduct) => {
        const variantsMap: Record<string, SelectedVariant> = {}

        p.product_snapshot.optionsSelected.forEach(opt => {
            if (!variantsMap[opt.variantName]) {
                variantsMap[opt.variantName] = {
                    variantName: opt.variantName,
                    options: []
                }
            }

            variantsMap[opt.variantName].options.push({
                optionId: opt.optionId,
                name: opt.optionName,
                extraPrice: opt.extraPrice
            })
        })

        return {
            product: {
                id: p.product_snapshot.id,
                name: p.product_snapshot.name,
                price_cost: p.product_snapshot.price,
                description: "",
            },
            quantity: p.quantity,
            notes: p.notes,
            selectedOptions: Object.values(variantsMap),
        }
    })*/


    useEffect(() => {
        if (!ordenId) return;

        const loadOrder = async () => {
            const order = await getOrderById(ordenId);

            const mappedProducts: ProductToOrder[] = order.products.map(p => {
                const variantsMap: Record<string, SelectedVariant> = {};

                p.product_snapshot.optionsSelected.forEach(opt => {
                    if (!variantsMap[opt.variantName]) {
                        variantsMap[opt.variantName] = {
                            variantName: opt.variantName,
                            options: []
                        };
                    }

                    variantsMap[opt.variantName].options.push({
                        optionId: opt.optionId,
                        name: opt.optionName,
                        extraPrice: opt.extraPrice
                    });
                });

                return {
                    product: {
                        id: p.product_snapshot.id,
                        name: p.product_snapshot.name,
                        price_cost: p.product_snapshot.price,
                        description: "",
                    } as any, // 👈 snapshot
                    quantity: p.quantity,
                    notes: p.notes,
                    selectedOptions: Object.values(variantsMap),
                };
            });

            setListProductsAdded(mappedProducts);
        };

        loadOrder();
    }, [ordenId]);




    useEffect(() => {
        if (isEditingOrder) {
            setModePanelRight("edit-order");
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
        console.log("Subscripción al evento 'product:new'");
        socket.on('product:new', handleNewProduct);


        // Función de limpieza: Es CRUCIAL desuscribirse del evento
        // cuando el componente se desmonte para evitar memory leaks.
        return () => {
            socket.off('product:new', handleNewProduct);
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

    const areVariantsEqual = (
        a: SelectedVariant[],
        b: SelectedVariant[]
    ): boolean => {
        if (a.length !== b.length) return false

        return a.every(variantA => {
            const variantB = b.find(v => v.variantName === variantA.variantName)
            if (!variantB) return false

            if (variantA.options.length !== variantB.options.length) return false

            const optionIdsA = variantA.options.map(o => o.optionId).sort()
            const optionIdsB = variantB.options.map(o => o.optionId).sort()

            return optionIdsA.every((id, index) => id === optionIdsB[index])
        })
    }

    const addNewProduct = (productToOrder: ProductToOrder) => {
        setListProductsAdded(prev => {
            const index = prev.findIndex(p =>
                p.product.id === productToOrder.product.id &&
                areVariantsEqual(p.selectedOptions, productToOrder.selectedOptions)
            )

            // 🟢 MISMO producto + MISMAS variantes → sumar cantidad
            if (index !== -1) {
                const updated = [...prev]
                updated[index] = {
                    ...updated[index],
                    quantity: updated[index].quantity + productToOrder.quantity
                }
                return updated
            }

            // 🟢 Producto igual pero variantes distintas → nuevo item
            return [...prev, productToOrder]
        })

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
                        <div className="grid grid-cols-2 xl:grid-cols-3 gap-5 overflow-y-auto max-h-[90vh] md:max-h-[85vh] px-1">
                            {filteredProducts.map((product, index) => (
                                <li key={product.id} className="flex justify-center ">
                                    <CardProduct
                                        product={product}
                                        index={index}
                                        editClick={() => console.log(product)}
                                        addClick={(productToOrder) => {
                                            addNewProduct(productToOrder)
                                            setShoppingCart(true)
                                        }}
                                    />

                                </li>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <div className={`
                    fixed z-10 
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
                    orderId={ordenId ?? undefined}
                />
            </div>
        </div>
    )
}

export default ProductsPage
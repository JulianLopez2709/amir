import Status from "../admin/Status"
import { Button } from "../ui/button"
import { BoxesIcon, X } from "lucide-react"
import { newProductToOrder, CreateOrderBody, ProductToOrder } from "@/@types/Order"
import { toast } from "sonner";
import { createOrderByCompany } from "@/api/order/getAllOrdersByCompany";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { ScrollArea } from "../ui/scroll-area";

interface Props {
    productsAdded: ProductToOrder[];
    setProductsAdded: React.Dispatch<React.SetStateAction<ProductToOrder[]>>;
}

function NewOrderPanel({ productsAdded, setProductsAdded }: Props) {
    const navigate = useNavigate()
    const { company } = useAuth();
    const [totalPrice, setTotalPrice] = useState(0);
    const [isLoading, setIsLoading] = useState(false)


    // Calcular el total cada vez que cambian los productos
    useEffect(() => {
        const total = productsAdded.reduce(
            (acc, p) => acc + calculateSubtotal(p),
            0
        )
        setTotalPrice(total)
    }, [productsAdded])


    const handleDeleteProduct = (indexToDelete: number) => {
        setProductsAdded((prev) => prev.filter((_, index) => index !== indexToDelete));
    };

    const handleDeleteAllProducts = () => {
        setProductsAdded([]);
    };

    async function createOrder(listaProducts: ProductToOrder[]) {
        setIsLoading(true)
        if (listaProducts.length === 0) {
            toast.error("La orden no puede estar vacía");
            return;
        }


        if (!company?.id) {
            toast.error("Compañía no válida");
            return;
        }

        setIsLoading(true);

        const orderBody: CreateOrderBody = {
            companyId: company.id,
            detail: {
                metodo_pago: "Efectivo",
                notas: "Orden creada desde el panel"
                // cliente: { nombre, telefono } ← si luego lo agregas
            },
            products: listaProducts.map(mapProductToBackend)
        };


        try {
            const res = await createOrderByCompany(orderBody);
            if (!res) {
                throw new Error("Error al crear la orden");
            }
            toast.success("Orden creada con éxito");
            setProductsAdded([]);
            navigate("/admin/orders");
        } catch (error) {
            toast.error("Error al crear la orden");
            console.error("Error creating order:", error);
        }

        setIsLoading(false)
    }

    const mapProductToBackend = (p: ProductToOrder): CreateOrderBody["products"][number] => {
        if (!p.product.id) {
            throw new Error("Producto sin ID válido")
        }

        return {
            productId: String(p.product.id), // ✅ siempre string
            quantity: p.quantity,
            notes: p.notes,
            selectedOptions: p.selectedOptions.flatMap(variant =>
                variant.options.map(option => option.optionId)
            )
        }
    }

    const calculateExtras = (variants: ProductToOrder["selectedOptions"]) => {
        return variants.reduce((acc, v) => {
            return acc + v.options.reduce((sum, o) => sum + (o.extraPrice || 0), 0)
        }, 0)
    }

    const calculateSubtotal = (p: ProductToOrder) => {
        const basePrice = p.product.price_selling
        const extras = calculateExtras(p.selectedOptions)
        return (basePrice + extras) * p.quantity
    }


    return (
        <div className="flex flex-col h-full">
            <div className="flex justify-between w-full">
                <h2 className="font-bold text-xl">Nueva Orden</h2>
                <Status name="new" color="purple" />
            </div>
            <h3 className="font-bold text-lg">Orden Items {productsAdded.length}</h3>
            <p className={`text-sm text-end ${productsAdded.length < 1 ? "text-gray-200" : "text-red-500 cursor-pointer"}`} onClick={handleDeleteAllProducts}>Eliminar todos los productos</p>

            {/* Lista de productos - Scrolleable */}
            <ScrollArea className=" flex-1 my-2 max-h-[600px]">
                <div className="flex flex-col gap-2">

                    {productsAdded.map((p, index) => (

                        <div className="relative rounded-xl border-gray-200 p-2 border-2 bg-gray-100 flex gap-2 pr-3">
                            <X
                                className="text-white bg-black hover:bg-red-500 m-auto p-1 cursor-pointer hover:opacity-80 absolute top-0 right-0 rounded-full"
                                onClick={() => handleDeleteProduct(index)}
                            />

                            <div className="hidden sm:flex size-20 bg-gray-100 rounded-md  items-center justify-center border-2 border-gray-400">
                                <BoxesIcon className="size-16 text-gray-500" />
                            </div>

                            <div className="flex flex-col flex-1 gap-2">
                                <div className=" flex items-center gap-4 w-full " key={index}>

                                    <div className="flex justify-between items-center w-full">
                                        <div className="flex flex-col flex-1">
                                            <p className="font-bold">{p.product.name}</p>
                                            <p className="text-sm">{p.product.description}</p>
                                        </div>
                                        <div className="flex gap-4">
                                            <p className="font-bold">x{p.quantity}</p>
                                            <p className="font-bold">${p.product.price_selling * p.quantity}</p>
                                        </div>
                                    </div>

                                </div>
                                {/*Seccion variables, opciones y nota*/}

                                {
                                    p.selectedOptions.length > 0 && (
                                        <div>
                                            {
                                                p.selectedOptions.map((v) => (
                                                    <div className="flex gap-2 items-center">
                                                        <div>{v.variantName}</div>
                                                        <div className="flex gap-1">
                                                            {v.options.map((opc) => (
                                                                <div className="px-2 rounded-sm fontbol bg-green-500 text-white items-center">{opc.name}{opc.extraPrice != undefined && opc.extraPrice > 0 && (<span> +{opc.extraPrice}</span>)}</div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                ))
                                            }
                                            {
                                                p.notes != null && (
                                                    <div>Notas {p.notes}</div>
                                                )
                                            }
                                        </div>
                                    )
                                }

                                {/*Nota y total*/}
                                <div className="flex justify-between items-center gap-2">
                                    <input name="nota" id="" placeholder="Agregar una nota" className="bg-white rounded-sm ite items-center text-center justify-center flex-1 h-auto shadow p-1"/>
                                    <p className="font-bold text-green-700">
                                        ${calculateSubtotal(p).toFixed(2)}
                                    </p>

                                </div>
                            </div>

                        </div>

                    ))}
                </div>

            </ScrollArea>

            {/* Footer con total y botón - Fijo en la parte inferior */}
            <div className="pt-4 border-t">
                <div className="flex w-full justify-between items-center font-bold mb-3">
                    <div>
                        <p className="text-gray-500">Total productos: {/*productsAdded.reduce((acc, p) => acc + p.acount, 0)*/}</p>
                        <p className="text-gray-500">Items únicos: {productsAdded.length}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-2xl text-green-700">${totalPrice.toFixed(2)}</p>
                    </div>
                </div>
                <Button
                    variant="default"
                    className={`${productsAdded.length < 1 ? "bg-gray-400" : "bg-green-700 cursor-pointer"} w-full p-7 font-bold`}
                    onClick={() => createOrder(productsAdded)}
                    disabled={productsAdded.length < 1 || isLoading}
                >
                    {isLoading ? 'Creando orden...' : 'Crear nueva orden'}

                </Button>
            </div>
        </div>
    )
}

export default NewOrderPanel
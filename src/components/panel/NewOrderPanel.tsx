import Status from "../admin/Status"
import { Button } from "../ui/button"
import { BoxesIcon, X } from "lucide-react"
import { CreateOrderBody, ProductToOrder } from "@/@types/Order"
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
    const [orderNotes, setOrderNotes] = useState("");


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



    async function submitOrder() {
        if (productsAdded.length === 0) {
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
                notas: orderNotes || "",
            },
            products: productsAdded.map(mapProductToBackend),
        };

        try {
            await createOrderByCompany(orderBody);
            toast.success("Orden creada con éxito");
            setProductsAdded([]);
            navigate("/admin/orders");
        } catch (error) {
            toast.error("Error al guardar la orden");
        } finally {
            setIsLoading(false);
        }
    }



    const mapProductToBackend = (
        p: ProductToOrder
    ): CreateOrderBody["products"][number] & { id?: number } => {
        return {
            ...(p.id && { id: p.id }), // 👈 SOLO EN EDIT
            productId: String(p.product.id),
            quantity: p.quantity,
            notes: p.notes,
            selectedOptions: p.selectedOptions.flatMap(v =>
                v.options.map(o => o.optionId)
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
                <h2 className="font-bold md:text-xl">Nueva Orden</h2>
                <Status name="new" color="purple" />
            </div>
            <h3 className="font-bold md:text-lg">Orden Items {productsAdded.length}</h3>
            <p className={`text-sm text-end ${productsAdded.length < 1 ? "text-gray-200" : "text-red-500 cursor-pointer"}`} onClick={handleDeleteAllProducts}>Eliminar todos los productos</p>

            {/* Lista de productos - Scrolleable */}
            <div className='h-[calc(55vh-100px)]'>
                <ScrollArea className="my-2 h-full">
                    <div className="flex flex-col gap-2">
                        {productsAdded.map((p, index) => (

                            <div key={p.id ?? index} className="relative rounded-xl border-gray-200 p-2 border-2 bg-gray-100 flex gap-2 pr-3">
                                <X
                                    className="text-white bg-black hover:bg-red-500 m-auto p-1 cursor-pointer hover:opacity-80 absolute top-0 right-0 rounded-full"
                                    onClick={() => handleDeleteProduct(index)}
                                />

                                <div className="hidden sm:flex size-14 rounded-md overflow-hidden border-3 border-gray-400 bg-gray-100 items-center justify-center">
                                    {p.product.imgUrl ? (
                                        <img
                                            src={p.product.imgUrl}
                                            alt={p.product.name}
                                            className="w-full h-full object-cover block"
                                        />
                                    ) : (
                                        <BoxesIcon className="text-gray-400 size-10" />
                                    )}
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
                                                <p className="font-bold">
                                                </p>

                                                <p className="font-bold">${p.product.price_selling * p.quantity}</p>
                                            </div>
                                        </div>

                                    </div>
                                    {/*Seccion variables, opciones y nota*/}

                                    {
                                        p.selectedOptions.length > 0 && (
                                            <div >
                                                {
                                                    p.selectedOptions.map((v) => (
                                                        <div key={v.variantName} className="flex gap-2 items-center">
                                                            <div>{v.variantName}</div>
                                                            <div className="flex gap-1">
                                                                {v.options.map((opc) => (
                                                                    <div key={opc.optionId ?? index} className="px-2 rounded-sm fontbol bg-green-500 text-white items-center">{opc.name}{opc.extraPrice != undefined && opc.extraPrice > 0 && (<span> +{opc.extraPrice}</span>)}</div>
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
                                        <input
                                            value={p.notes ?? ""}
                                            onChange={(e) => {
                                                const value = e.target.value
                                                setProductsAdded(prev =>
                                                    prev.map((item, i) =>
                                                        i === index ? { ...item, notes: value } : item
                                                    )
                                                )
                                            }}
                                            placeholder="Agregar una nota"
                                            className="bg-white rounded-sm flex-1 shadow p-1"
                                        />
                                        <p className="font-bold text-green-700">
                                        </p>

                                    </div>
                                </div>

                            </div>

                        ))}
                    </div>

                </ScrollArea>
            </div>

            <div className="mt-4">
                <label className="text-sm font-semibold text-gray-700">
                    Notas de la orden
                </label>

                <textarea
                    value={orderNotes}
                    onChange={(e) => setOrderNotes(e.target.value)}
                    placeholder="Ej: Entregar en recepción · Pedido urgente · Cliente frecuente · Llamar antes de enviar · Mesa 1"
                    className="w-full mt-1 rounded-md border border-gray-300 p-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-green-600"
                    rows={2}
                />
            </div>


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
                    className="w-full p-7 font-bold bg-green-700"
                    onClick={submitOrder}
                    disabled={productsAdded.length < 1 || isLoading}
                >
                    {isLoading
                        ? "Guardando..."
                        : "Crear nueva orden"}
                </Button>

            </div>
        </div>
    )
}

export default NewOrderPanel
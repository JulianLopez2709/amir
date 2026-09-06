import Status from "../admin/Status"
import { Button } from "../ui/button"
import { BoxesIcon, ChevronLeft, X } from "lucide-react"
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
    const [selectedTable, setSelectedTable] = useState<string | null>(null);
    const [currentStep, setCurrentStep] = useState<1 | 2>(1);
    const hasTableStep = Boolean(company?.numTable);


    // Calcular el total cada vez que cambian los productos
    useEffect(() => {
        const total = productsAdded.reduce(
            (acc, p) => acc + calculateSubtotal(p),
            0
        )
        setTotalPrice(total)
    }, [productsAdded])

    useEffect(() => {
        if (company && !hasTableStep) {
            setCurrentStep(2);
        }
    }, [company, hasTableStep]);


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
                selectedTable: selectedTable || undefined,
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
            </div>

            {hasTableStep && (
                <div className="flex items-center gap-2 my-4">
                    <div
                        className={`flex items-center justify-center w-8 h-8 rounded-full font-bold ${currentStep >= 1
                            ? "bg-green-700 text-white"
                            : "bg-gray-200 text-gray-500"
                            }`}
                    >
                        1
                    </div>

                    <div
                        className={`h-1 flex-1 rounded ${currentStep === 2 ? "bg-green-700" : "bg-gray-200"
                            }`}
                    />

                    <div
                        className={`flex items-center justify-center w-8 h-8 rounded-full font-bold ${currentStep === 2
                            ? "bg-green-700 text-white"
                            : "bg-gray-200 text-gray-500"
                            }`}
                    >
                        2
                    </div>
                </div>
            )}
            {hasTableStep && currentStep === 1 && (
                <div className="flex flex-col h-full">
                        <ScrollArea className="wfull h-[67vh]">
                            <div className="mb-4 w-full">
                                <h3 className="font-bold md:text-lg mb-1">
                                    Selecciona una mesa
                                </h3>

                                <p className="text-sm text-gray-500 mb-5">
                                    Selecciona dónde se realizará el pedido
                                </p>

                                <div className="grid grid-cols-3 md:grid-cols-4 gap-6 w-full">
                                    {Array.from(
                                        { length: Number(company?.numTable) },
                                        (_, index) => {
                                            const tableNumber = String(index + 1);
                                            const isSelected =
                                                selectedTable === tableNumber;

                                            return (
                                                <button
                                                    key={tableNumber}
                                                    type="button"
                                                    onClick={() =>
                                                        setSelectedTable(tableNumber)
                                                    }
                                                    className="flex items-center justify-center py-4"
                                                >
                                                    <div
                                                        className={`
                                        relative
                                        w-14 h-14
                                        rounded-md
                                        flex items-center justify-center
                                        font-bold
                                        transition-all duration-200
                                        ${isSelected
                                                                ? "bg-green-700 text-white scale-105"
                                                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                                            }
                                    `}
                                                    >
                                                        {tableNumber}

                                                        {/* Silla superior */}
                                                        <span
                                                            className={`
                                            absolute -top-3
                                            left-1/2 -translate-x-1/2
                                            w-8 h-2.5 rounded-full
                                            ${isSelected
                                                                    ? "bg-green-700"
                                                                    : "bg-gray-200"
                                                                }
                                        `}
                                                        />

                                                        {/* Silla inferior */}
                                                        <span
                                                            className={`
                                            absolute -bottom-3
                                            left-1/2 -translate-x-1/2
                                            w-8 h-2.5 rounded-full
                                            ${isSelected
                                                                    ? "bg-green-700"
                                                                    : "bg-gray-200"
                                                                }
                                        `}
                                                        />

                                                        {/* Silla izquierda */}
                                                        <span
                                                            className={`
                                            absolute -left-3
                                            top-1/2 -translate-y-1/2
                                            w-2.5 h-8 rounded-full
                                            ${isSelected
                                                                    ? "bg-green-700"
                                                                    : "bg-gray-200"
                                                                }
                                        `}
                                                        />

                                                        {/* Silla derecha */}
                                                        <span
                                                            className={`
                                            absolute -right-3
                                            top-1/2 -translate-y-1/2
                                            w-2.5 h-8 rounded-full
                                            ${isSelected
                                                                    ? "bg-green-700"
                                                                    : "bg-gray-200"
                                                                }
                                        `}
                                                        />

                                                        {isSelected && (
                                                            <span className="
                                            absolute -top-2 -right-2
                                            w-5 h-5
                                            rounded-full
                                            bg-black text-white
                                            flex items-center justify-center
                                            text-xs z-10
                                        ">
                                                                ✓
                                                            </span>
                                                        )}
                                                    </div>
                                                </button>
                                            );
                                        }
                                    )}
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setSelectedTable("delivery")}
                                    className={`relative rounded-xl border-2 p-4 w-full font-bold transition-all min-h-[90px] ${selectedTable === "delivery"
                                        ? "border-green-700 bg-green-700 text-white"
                                        : "border-gray-200 bg-gray-50 text-gray-700 hover:border-gray-300"
                                        }`}
                                >
                                    <div className="flex flex-col items-center justify-center gap-1">
                                        <span className="text-sm">
                                            Domicilio
                                        </span>
                                    </div>

                                    {selectedTable === "delivery" && (
                                        <span className="absolute -top-2 -right-2  w-5 h-5 rounded-full
            bg-black text-white flex items-center justify-center text-xs ">
                                            ✓
                                        </span>
                                    )}
                                </button>
                            </div>
                        </ScrollArea>

                    <div className=" pt-4 border-t">
                        <Button
                            className="w-full p-6 font-bold bg-green-700"
                            disabled={!selectedTable}
                            onClick={() => setCurrentStep(2)}
                        >
                            Continuar
                        </Button>
                    </div>

                </div>
            )}

            {currentStep === 2 && (

                <>
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            {hasTableStep && (
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setCurrentStep(1)}
                                >
                                    <ChevronLeft className="h-5 w-5" />
                                </Button>
                            )}

                            <div>
                                <h3 className="font-bold md:text-lg">
                                    Agregar productos
                                </h3>

                                {hasTableStep && selectedTable && (
                                    <p className="text-sm text-gray-500">
                                        Mesa seleccionada:{" "}
                                        <span className="font-bold text-gray-700">
                                            Mesa {selectedTable}
                                        </span>
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    <p className={`text-sm text-end ${productsAdded.length < 1 ? "text-gray-200" : "text-red-500 cursor-pointer"}`} onClick={handleDeleteAllProducts}>Eliminar todos los productos</p>

                    {/* Lista de productos - Scrolleable */}
                    <div className='h-[calc(47vh-100px)]'>
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

                </>
            )}
        </div>
    )
}

export default NewOrderPanel
import Status from "../admin/Status"
import { Button } from "../ui/button"
import { BoxesIcon, Trash } from "lucide-react"
import { createOrderBody, newProductToOrder } from "@/@types/Order"
import { toast } from "sonner";
import { createOrderByCompany } from "@/api/order/getAllOrdersByCompany";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";

interface Props {
    productsAdded: newProductToOrder[];
    setProductsAdded: React.Dispatch<React.SetStateAction<newProductToOrder[]>>;

}

function NewOrderPanel({ productsAdded, setProductsAdded }: Props) {
    const navigate = useNavigate()
    const { company } = useAuth();
    const [totalPrice, setTotalPrice] = useState(0);

    // Calcular el total cada vez que cambian los productos
    useEffect(() => {
        const newTotal = productsAdded.reduce((acc, p) => acc + (p.product.price_selling * p.acount), 0);
        setTotalPrice(newTotal);
    }, [productsAdded]);

    const handleDeleteProduct = (productId?: number) => {
        if (!productId) return;
        setProductsAdded((prevProducts) => prevProducts.filter((product) => product.product.id !== productId));
    };

    const handleDeleteAllProducts = () => {
        setProductsAdded([]);
    };

    async function createOrder(listaProducts: newProductToOrder[]) {
        if (listaProducts.length === 0) {
            toast.error("La orden no puede estar vacía");
            return;
        }

        const ordenBody: createOrderBody = {
            total_price: totalPrice,
            companyId: company?.id || 0,
            products: listaProducts.map((p) => ({
                productId: p.product.id,
                status: "new",
                notes: "",
                quantity: p.acount
            }))
        };

        try {
            const res = await createOrderByCompany(ordenBody);
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
            <div className="flex-1 overflow-y-auto min-h-0">
                {productsAdded.map((p, index) => (
                    <div className="flex justify-between items-center gap-4 mb-3" key={index}>
                        <div className="size-10 bg-gray-100 rounded-md flex items-center justify-center">
                            <BoxesIcon className="size-7 text-gray-500" />
                        </div>
                        <div className="flex flex-col flex-1">
                            <p className="font-bold">{p.product.name}</p>
                            <p className="text-sm">{p.product.description}</p>
                        </div>  
                        <div className="flex flex-col items-end">
                            <p className="font-bold">x{p.acount}</p>
                            <p className="text-sm text-gray-500">${p.product.price_selling * p.acount}</p>
                        </div>
                        <Trash 
                            className="text-white bg-red-500 m-auto p-1 cursor-pointer hover:opacity-50" 
                            onClick={() => handleDeleteProduct(p.product.id)} 
                        />
                    </div>
                ))}
            </div>

            {/* Footer con total y botón - Fijo en la parte inferior */}
            <div className="mt-auto pt-4 border-t">
                <div className="flex w-full justify-between items-center font-bold mb-3">
                    <div>
                        <p className="text-gray-500">Total productos: {productsAdded.reduce((acc, p) => acc + p.acount, 0)}</p>
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
                    disabled={productsAdded.length < 1}
                >
                    Crear nueva orden
                </Button>
            </div>
        </div>
    )
}

export default NewOrderPanel
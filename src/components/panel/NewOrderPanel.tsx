import Status from "../admin/Status"
import { Button } from "../ui/button"
import { Trash } from "lucide-react"
import { createOrderBody, newProductToOrder } from "@/@types/Order"
import { toast } from "sonner";
import { createOrderByCompany } from "@/api/order/getAllOrdersByCompany";
import { useNavigate } from "react-router-dom";

interface Props {
    productsAdded: newProductToOrder[];
    setProductsAdded: React.Dispatch<React.SetStateAction<newProductToOrder[]>>;

}


function NewOrderPanel(
    { productsAdded, setProductsAdded }: Props
) {
    const navigate = useNavigate()

    const handleDeleteProduct = (productId?: number) => {
        if (!productId) return;
        setProductsAdded((prevProducts) => prevProducts.filter((product) => product.product.id !== productId));
    };

    const handleDeleteAllProducts = () => {
        setProductsAdded([]);
    };

    async function createOrder(listaProducts: newProductToOrder[]) {
        if (listaProducts == undefined || listaProducts.length === 0) {
            toast("La orden no puede estar vacia")
            return
        };
        const ordenBody: createOrderBody = {
            total_price: 0,
            companyId: 1,
            products: listaProducts.map((p) => ({
                productId: p.product.id,
                status: "new",
                notes: "",
                quantity: Number(p.acount)
            }))
        }

        const res = await createOrderByCompany(ordenBody)
        if (!res) {
            toast.error("Error al crear la orden")
            return
        }
        toast.success("Orden creada con exito")
        setProductsAdded([])
        navigate("/admin/orders")
    }

    return (
        <div className="flex flex-col h-full ">
            {
                /*
                <div className={`${shoppingCart ? "flex" : "hidden"} lg:hidden cursor-pointer`} onClick={showDetail}>
                close
                </div>*/
            }
            <div className="flex justify-between w-full">
                <h2 className="font-bold text-xl">Nueva Orden</h2>
                <Status name="new" color="purple" />
            </div>
            <h3 className="font-bold text-lg">Orden Items {productsAdded.length}</h3>
            <p className={`  text-sm text-end ${productsAdded.length < 1 ? "text-gray-200" : "text-red-500 cursor-pointer"}`} onClick={handleDeleteAllProducts}>Eliminar todos los productos</p>
            <div className="flex flex-1 flex-col h-full justify-between items-center">
                <div className="flex flex-col w-full mb-3">
                    {
                        productsAdded.map((p, index) => (
                            <div className="flex justify-between items-center gap-4" key={index}>
                                <div className="size-10 bg-gray-200"></div>
                                <div>
                                    <p>{p.product.name}</p>
                                    <p>{p.product.description}</p>
                                </div>
                                <p>{p.acount}</p>
                                <p>${p.product.price_cost}</p>
                                <Trash className="text-white bg-red-500 m-auto p-1 cursor-pointer hover:opacity-50" onClick={() => handleDeleteProduct(p.product.id)} />
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
                        Total x{productsAdded.length}
                    </p>
                    <p>
                        $ 2,2000
                    </p>
                </div>
                <Button variant="default" className={`${productsAdded.length < 1 ? "bg-gray-400" : "bg-green-700 cursor-pointer"} w-full p-7 font-bold`} onClick={() => { createOrder(productsAdded) }}>Crear nueva orden</Button>
            </div>

        </div>
    )
}

export default NewOrderPanel
import { newProductToOrder, ProductToOrder } from "@/@types/Order";
import AddToOrderPanel from "../panel/AddToOrderPanel"
import CreateProductPanel from "../panel/CreateProductPanel"
import NewOrderPanel from "../panel/NewOrderPanel"
import { X } from "lucide-react";

interface RightPanelProps {
    mode: "order" | "create-product";
    productsAdded: ProductToOrder[];
    setProductsAdded: React.Dispatch<React.SetStateAction<ProductToOrder[]>>;
    onClose: () => void;
    orderMode: "create" | "edit";
    orderId?: string;
}
function RightPanel({
    mode,
    productsAdded,
    setProductsAdded,
    onClose,
    orderMode,
    orderId,
}: RightPanelProps) {
    return (
        <div className="w-full h-full">
            <div className="lg:hidden flex justify-end">
                <button onClick={onClose}><X /></button>
            </div>

            {mode === "order" && (
                <NewOrderPanel
                    productsAdded={productsAdded}
                    setProductsAdded={setProductsAdded}
                    mode={orderMode}
                    orderId={orderId}
                />
            )}

            {mode === "create-product" && <CreateProductPanel />}
        </div>
    )
}

export default RightPanel
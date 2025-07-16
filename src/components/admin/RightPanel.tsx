import { newProductToOrder } from "@/@types/Order";
import AddToOrderPanel from "../panel/AddToOrderPanel"
import CreateProductPanel from "../panel/CreateProductPanel"
import NewOrderPanel from "../panel/NewOrderPanel"
import { X } from "lucide-react";

interface RightPanelProps {
    mode: "new-order" | "create-product" | "add-to-order";
    productsAdded: newProductToOrder[];
    setProductsAdded: React.Dispatch<React.SetStateAction<newProductToOrder[]>>;
    onClose: () => void;
}

function RightPanel({ mode, productsAdded, setProductsAdded, onClose }: RightPanelProps) {
    return (
        <div className="w-full px-2 h-full">
            <div className=" lg:hidden flex justify-end">
                <button className=" cursor-pointer" onClick={onClose}><X /></button>
            </div>
            {mode === 'new-order' && <NewOrderPanel productsAdded={productsAdded} setProductsAdded={setProductsAdded} />}
            {mode === 'create-product' && <CreateProductPanel />}
            {mode === 'add-to-order' && <AddToOrderPanel productsAdded={productsAdded} />}
        </div>
    )
}

export default RightPanel
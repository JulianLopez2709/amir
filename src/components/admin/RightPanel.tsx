import { newProductToOrder } from "@/@types/Order";
import AddToOrderPanel from "../panel/AddToOrderPanel"
import CreateProductPanel from "../panel/CreateProductPanel"
import NewOrderPanel from "../panel/NewOrderPanel"

interface RightPanelProps {
    mode: "new-order" | "create-product" | "add-to-order";
    productsAdded: newProductToOrder[];
    setProductsAdded: React.Dispatch<React.SetStateAction<newProductToOrder[]>>;
    onClose: () => void;
  }

function RightPanel({ mode,productsAdded,setProductsAdded }: RightPanelProps) {
    return (
        <div className="w-full p-4 h-full">
            {mode === 'new-order' && <NewOrderPanel productsAdded={productsAdded} setProductsAdded={setProductsAdded} />}
            {mode === 'create-product' && <CreateProductPanel />}
            {mode === 'add-to-order' && <AddToOrderPanel productsAdded={productsAdded} />}
        </div>
    )
}

export default RightPanel
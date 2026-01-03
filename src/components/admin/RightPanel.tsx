import { ProductToOrder } from "@/@types/Order";
import CreateProductPanel from "../panel/CreateProductPanel"
import NewOrderPanel from "../panel/NewOrderPanel"
import { X } from "lucide-react";
import AddToOrderPanel from "../panel/AddToOrderPanel";

interface RightPanelProps {
    mode: RightPanelMode;
    productsAdded: ProductToOrder[];
    setProductsAdded: React.Dispatch<React.SetStateAction<ProductToOrder[]>>;
    onClose: () => void;
    orderId?: string;
}


type RightPanelMode = 'order' | 'create-product' | 'edit-order';

function RightPanel({
  mode,
  productsAdded,
  setProductsAdded,
  onClose,
  orderId,
}: RightPanelProps) {
  return (
    <div className="w-full h-full">
      <div className="lg:hidden flex justify-end">
        <button onClick={onClose}><X /></button>
      </div>

      {mode === 'order' && (
        <NewOrderPanel
          productsAdded={productsAdded}
          setProductsAdded={setProductsAdded}
        />
      )}

      {mode === 'edit-order' && orderId && (
        <AddToOrderPanel
          productsAdded={productsAdded}
          setProductsAdded={setProductsAdded}
          orderId={orderId}
        />
      )}

      {mode === 'create-product' && <CreateProductPanel />}
    </div>
  );
}


export default RightPanel
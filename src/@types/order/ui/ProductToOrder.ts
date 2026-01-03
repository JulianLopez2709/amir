import { ProductSnapshot, SelectedVariant } from "../domain/productsnapshot";


export interface ProductToOrder {
  id?: number;
  product: ProductSnapshot
  status?: string
  subTotal ?: number
  quantity: number
  notes?: string
  selectedOptions: SelectedVariant[]
}
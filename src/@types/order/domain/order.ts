export interface Order {
  id: number
  status: string
  products: ProductToOrder[]
}

export interface ProductToOrder {
  id?: number;
  status?: string
  subTotal ?: number
  quantity: number
  notes?: string
}
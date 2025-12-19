export interface OrderApi {
  id: string
  status: string
  products: OrderProductApi[]
}

export interface OrderProductApi {
  quantity: number
  notes?: string
  product_snapshot: ProductSnapshotApi
}

export interface ProductSnapshotApi {
  id: string
  name: string
  price: number
  //optionsSelected: ProductOptionApi[]
}

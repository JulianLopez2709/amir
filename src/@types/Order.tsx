import Product from "./Product";

type Status = "new" | "proceso" | "terminado"  | "cancelado"

export interface OrdenReques {
  total: number
  page: number
  limit: number
  totalPages: number
  data: Order[]
}

export interface Order {
  id: string
  status: 'new' | 'in_progress' | 'completed' | 'canceled'
  total_price: number
  createAt: string
  updatedAt: string
  companyId: number
  detail?: OrderDetail
  products: OrderProduct[]
}

export interface OrderDetail {
  notas?: string
  metodo_pago?: string
  cliente?: {
    nombre: string
    telefono: string
  }
}

export interface OrderProduct {
  product_snapshot: {
    id: string
    name: string
    price: number
    timestamp: string
    optionsSelected: ProductOption[]
  }
}

export interface ProductOption {
  optionId: number
  variantId: number
  extraPrice: number
  optionName: string
  variantName: string
}


export interface OrdenRequesOld{
    cliente_create : string,
    id : string,
    status : string,
    products ?: Product_Orden[],
    //metodo_pago : string,
    total_price : number
    createAt : string,
    company : any,
}

export interface Product_Orden{
    product ?: Product,
    status : Status,
    notes : string,
    quantity : number
    productId ?: number
}

interface Orden{
    id:number,
    total_price:number,
    status : Status
    
}

export interface createOrderBody{
    total_price: number,
    companyId: number,
    products: Product_Orden[]
}

export interface newProductToOrder {
    product: Product,
    acount: number
}

export default Orden;
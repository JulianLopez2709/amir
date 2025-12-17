import Product from "./Product";

type Status = "new" | "proceso" | "terminado" | "cancelado"

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
  id: number,
  status: string,
  quantity: number,
  subtotal: number,
  notes: string,
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


export interface OrdenRequesOld {
  cliente_create: string,
  id: string,
  status: string,
  products?: ProductToOrder[],
  //metodo_pago : string,
  total_price: number
  createAt: string,
  company: any,
}

export interface ProductToOrder {
  product: Product
  quantity: number
  notes?: string
  selectedOptions: SelectedVariant[]
}

export interface SelectedVariant {
  options: Option[]
  variantName: string
}

interface Option {
  name: string
  optionId: number
  extraPrice?: number
}

export interface SelectedVariantBody {
  optionIds: number[] // selección múltiple
  variant?: {
    nombre: string
    opciotes: []
  }
}


interface Orden {
  id: number,
  total_price: number,
  status: Status

}

export interface CreateOrderBody {
  companyId: number,
  detail: {
    cliente?: {
      nombre: string
      telefono: string
    },
    metodo_pago: string
    notas?: string
  },
  products: {
    productId: string
    quantity: number
    notes?: string
    selectedOptions: number[]
  }[]
}



export interface newProductToOrder {
  product: Product,
}



export default Orden;
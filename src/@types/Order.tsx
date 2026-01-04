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
  status: OrderStatus
  total_price: number
  createAt: string
  updatedAt: string
  companyId: number
  detail?: OrderDetail
  products: OrderProduct[]
}

export type OrderStatus =
  | 'new'
  | 'pending'
  | 'in_progress'
  | 'completed'
  | 'canceled';


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
    price_selling: number
    quantity?: number
    img?: string
    description?: string
    imgUrl?: string
    name: string
    price: number
    timestamp: string
    optionsSelected: ProductOption[]
  }
}

export interface ProductOption {
  optionId: number
  variantId: number
  extraPrice?: number
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
  id?: number;
  product: ProductSnapshot
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

export interface UpdateBody {
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
    imgUrl?: string
    productId: string
    quantity: number
    notes?: string
    selectedOptions: number[]
  }[]
}




export interface newProductToOrder {
  product: Product,
}


export interface ProductSnapshot {
  id: string
  name: string
  price_selling: number
  quantity?: number
  price: number
  img?: string
  description?: string
  imgUrl?: string
  optionsSelected: ProductOption[]
}



export default Orden;
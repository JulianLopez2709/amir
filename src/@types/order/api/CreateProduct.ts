export type CreateVariantPayload = {
  name: string
  type: "select"
  options: {
    name: string
    extraPrice: number
  }[]
}

export type CreateProductPayload = {
  name: string
  barcode?: string
  description?: string
  imgUrl?: File | string |null
  price_cost: number
  price_selling: number
  stock?: number
  available: boolean
  detail?: {}
  companyId: number
  type: string
  unit: string
  variants?: CreateVariantPayload[]
}

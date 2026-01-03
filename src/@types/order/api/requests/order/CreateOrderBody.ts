export interface CreateOrderBody {
  companyId: number
  products: {
    productId: number
    quantity: number
    selectedOptions: {
      optionId: number
    }[]
  }[]
  detail: {
    metodo_pago: string
    notas?: string
  }
}
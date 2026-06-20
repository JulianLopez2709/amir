import type { OrderProduct } from '@/@types/Order'

export type OrderProductStatus = 'pending' | 'served' | 'paid' | 'cancelled'

const PRODUCT_STATUS_ALIASES: Record<string, OrderProductStatus> = {
  new: 'pending',
  pending: 'pending',
  served: 'served',
  paid: 'paid',
  cancelled: 'cancelled',
  canceled: 'cancelled',
  in_progress: 'served',
  confirmed: 'served',
  completed: 'paid',
}

export function normalizeProductStatus(status: string): OrderProductStatus {
  return PRODUCT_STATUS_ALIASES[status] ?? 'pending'
}

export function getOrderTotals(products: OrderProduct[] = []) {
  let consumido = 0
  let pagado = 0
  let pendiente = 0

  for (const product of products) {
    const status = normalizeProductStatus(product.status)
    const subtotal = Number(product.subtotal || 0)

    if (status === 'cancelled') continue

    consumido += subtotal
    if (status === 'paid') pagado += subtotal
    if (status === 'served') pendiente += subtotal
  }

  return {
    consumido: Number(consumido.toFixed(2)),
    pagado: Number(pagado.toFixed(2)),
    pendiente: Number(pendiente.toFixed(2)),
  }
}

export function getServedProductsToPay(products: OrderProduct[] = []) {
  return products.filter((p) => normalizeProductStatus(p.status) === 'served')
}

export function canCloseOrder(products: OrderProduct[] = []) {
  if (products.length === 0) return false
  return products.every((p) => {
    const status = normalizeProductStatus(p.status)
    return status === 'paid' || status === 'cancelled'
  })
}

export function formatCurrency(amount: number) {
  return `$${amount.toLocaleString('es-CO')}`
}

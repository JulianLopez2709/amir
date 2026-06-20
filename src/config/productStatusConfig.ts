import type { OrderProductStatus } from '@/lib/orderTotals'

export const PRODUCT_STATUS_CONFIG: Record<
  OrderProductStatus,
  { label: string; bg: string; text: string }
> = {
  pending: { label: 'Pendiente', bg: 'bg-yellow-100', text: 'text-yellow-800' },
  served: { label: 'Servido', bg: 'bg-blue-100', text: 'text-blue-800' },
  paid: { label: 'Pagado', bg: 'bg-green-100', text: 'text-green-800' },
  cancelled: { label: 'Cancelado', bg: 'bg-red-100', text: 'text-red-800' },
}

import type { OrderProduct } from '@/@types/Order'
import { formatCurrency, getOrderTotals } from '@/lib/orderTotals'

type Props = {
  products: OrderProduct[]
  className?: string
}

export default function OrderTotalsSummary({ products, className = '' }: Props) {
  const { consumido, pagado, pendiente } = getOrderTotals(products)

  return (
    <div className={`space-y-1 text-sm ${className}`}>
      <div className="flex items-center justify-between">
        <span className="text-gray-600">Consumido:</span>
        <span className="font-semibold text-gray-900">{formatCurrency(consumido)}</span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-gray-600">Pagado:</span>
        <span className="font-semibold text-green-700">{formatCurrency(pagado)}</span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-gray-600">Pendiente:</span>
        <span className="font-bold text-orange-600">{formatCurrency(pendiente)}</span>
      </div>
    </div>
  )
}

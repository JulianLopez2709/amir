import { OrderFilter } from "@/pages/admin/orders/OrderPage"

type OrderFilterTabsProps = {
  value: OrderFilter
  onChange: (filter: OrderFilter) => void
}

const ORDER_FILTERS: {
    value: OrderFilter
    label: string
  }[] = [
      { value: 'ALL', label: 'Todas' },
      { value: 'pending', label: 'Por confirmar' },
      { value: 'in_progress', label: 'En proceso' },
      { value: 'completed', label: 'Finalizadas' },
    ]

function OrderFilterTabs({ value, onChange }: OrderFilterTabsProps) {
  return (
    <div className="inline-flex rounded-lg bg-gray-100 p-1">
      {ORDER_FILTERS.map(filter => {
        const isActive = value === filter.value

        return (
          <button
            key={filter.value}
            onClick={() => onChange(filter.value)}
            className={`
              px-4 py-1.5 text-sm font-medium rounded-md transition-all
              ${
                isActive
                  ? 'bg-white text-green-700 shadow'
                  : 'text-gray-600 hover:text-gray-900'
              }
            `}
          >
            {filter.label}
          </button>
        )
      })}
    </div>
  )
}

export default OrderFilterTabs
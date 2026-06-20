import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-primary text-primary-foreground',
        secondary: 'border-transparent bg-secondary text-secondary-foreground',
        outline: 'text-foreground',
        admin: 'border-transparent bg-red-100 text-red-800',
        supervisor: 'border-transparent bg-blue-100 text-blue-800',
        cashier: 'border-transparent bg-green-100 text-green-800',
        waiter: 'border-transparent bg-yellow-100 text-yellow-800',
        active: 'border-transparent bg-emerald-100 text-emerald-800',
        inactive: 'border-transparent bg-gray-100 text-gray-600',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

function Badge({
  className,
  variant,
  ...props
}: React.ComponentProps<'span'> & VariantProps<typeof badgeVariants>) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }

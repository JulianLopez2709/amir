import type { AminPermission, AminRole } from '@/@types/settings'
import type { VariantProps } from 'class-variance-authority'
import { badgeVariants } from '@/components/ui/badge'

export const ROLE_LABELS: Record<AminRole, string> = {
  ADMIN: 'Administrador',
  SUPERVISOR: 'Supervisor',
  CAJERO: 'Cajero',
  MESERO: 'Mesero',
}

export const ROLE_BADGE_VARIANT: Record<
  AminRole,
  NonNullable<VariantProps<typeof badgeVariants>['variant']>
> = {
  ADMIN: 'admin',
  SUPERVISOR: 'supervisor',
  CAJERO: 'cashier',
  MESERO: 'waiter',
}

export const ROLE_PERMISSIONS: Record<AminRole, AminPermission[]> = {
  ADMIN: [
    'CREATE_ORDER',
    'EDIT_ORDER',
    'DELETE_ORDER',
    'INVOICE_ORDER',
    'VIEW_REPORTS',
    'MANAGE_INVENTORY',
    'MANAGE_USERS',
  ],
  SUPERVISOR: [
    'CREATE_ORDER',
    'EDIT_ORDER',
    'DELETE_ORDER',
    'INVOICE_ORDER',
    'VIEW_REPORTS',
    'MANAGE_INVENTORY',
  ],
  CAJERO: ['CREATE_ORDER', 'EDIT_ORDER', 'INVOICE_ORDER', 'VIEW_REPORTS'],
  MESERO: ['CREATE_ORDER', 'EDIT_ORDER'],
}

export const PERMISSION_LABELS: Record<AminPermission, string> = {
  CREATE_ORDER: 'Crear pedidos',
  EDIT_ORDER: 'Editar pedidos',
  DELETE_ORDER: 'Eliminar pedidos',
  INVOICE_ORDER: 'Facturar pedidos',
  VIEW_REPORTS: 'Ver reportes',
  MANAGE_INVENTORY: 'Gestionar inventario',
  MANAGE_USERS: 'Gestionar usuarios',
}

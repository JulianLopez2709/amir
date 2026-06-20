export type AminRole = 'ADMIN' | 'CAJERO' | 'MESERO' | 'SUPERVISOR'

export type AminPermission =
  | 'CREATE_ORDER'
  | 'EDIT_ORDER'
  | 'DELETE_ORDER'
  | 'INVOICE_ORDER'
  | 'VIEW_REPORTS'
  | 'MANAGE_INVENTORY'
  | 'MANAGE_USERS'

export type TeamMember = {
  id: number
  name: string
  email: string
  role: AminRole
  status: 'active' | 'inactive'
}

export type FactusCredentialsForm = {
  factusClientId: string
  factusClientSecret: string
  factusUsername: string
  factusPassword: string
  factusNumberingRangeId: string
  factusPrefix: string
}

export type CompanyFactusPublic = {
  factusElectronicInvoicingConfigured?: boolean
  factusNumberingRangeId?: number | null
  factusPrefix?: string | null
  hasBilling?: boolean
}

export const EMPTY_FACTUS_FORM: FactusCredentialsForm = {
  factusClientId: '',
  factusClientSecret: '',
  factusUsername: '',
  factusPassword: '',
  factusNumberingRangeId: '',
  factusPrefix: '',
}

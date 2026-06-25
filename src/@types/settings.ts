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

export type CompanyProfile = {
  id: number
  name: string
  slogan?: string
  logo?: string
  nit?: string | null
  phone?: string | null
  email?: string | null
  address?: string | null
  primary_color?: string
  secondary_color?: string
  plan?: string
  role?: string
  hasBilling?: boolean
  factusElectronicInvoicingConfigured?: boolean
  factusNumberingRangeId?: number | null
  factusPrefix?: string | null
}

export type CompanyProfileForm = {
  name: string
  nit: string
  address: string
  phone: string
  email: string
  primary_color: string
  secondary_color: string
}

export type CompanyFactusPublic = CompanyProfile

export const EMPTY_FACTUS_FORM: FactusCredentialsForm = {
  factusClientId: '',
  factusClientSecret: '',
  factusUsername: '',
  factusPassword: '',
  factusNumberingRangeId: '',
  factusPrefix: '',
}

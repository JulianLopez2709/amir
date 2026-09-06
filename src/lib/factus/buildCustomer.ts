import type { FactusCustomer } from '@/api/factus/validateBill'

/** Datos por defecto cuando el cliente no requiere facturación con datos fiscales propios */
export const CONSUMIDOR_FINAL = {
  identification: '222222222222',
  names: 'CONSUMIDOR FINAL',
  legal_organization_code: '2',
  identification_document_code: '13',
  tribute_code: 'ZZ',
} as const

export type FactusCustomerFormInput = {
  identification_document_code: string
  identification: string
  names: string
  company: string
  trade_name: string
  address: string
  email: string
  phone: string
  legal_organization_code: string
  tribute_code: string
  municipality_code: string
  municipality_country: 'CO' | 'EXT'
}

export type EmitterInfo = {
  email: string
  address: string
}

export function getEmitterInfo(
  company: Record<string, unknown> | null | undefined,
  userEmail?: string | null
): EmitterInfo {
  return {
    email: String(
      company?.email ??
        company?.correo ??
        company?.emitter_email ??
        company?.contact_email ??
        userEmail ??
        ''
    ).trim(),
    address: String(
      company?.address ??
        company?.direccion ??
        company?.fiscal_address ??
        company?.emitter_address ??
        ''
    ).trim(),
  }
}

export function getNumberingRangeId(company: Record<string, unknown> | null | undefined): number {
  return Number(
    company?.factusNumberingRangeId ??
      company?.numbering_range_id ??
      company?.factus_numbering_range_id ??
      company?.numberingRangeId ??
      0
  )
}

/** El cliente solicitó factura con datos fiscales propios (no consumidor final genérico) */
export function hasCustomFiscalData(form: FactusCustomerFormInput): boolean {
  return Boolean(
    form.identification.trim() ||
      form.names.trim() ||
      form.company.trim() ||
      form.trade_name.trim()
  )
}

export function buildFactusCustomerPayload(
  form: FactusCustomerFormInput,
  emitter: EmitterInfo
): FactusCustomer {
  if (!hasCustomFiscalData(form)) {
    return {
      identification: CONSUMIDOR_FINAL.identification,
      names: CONSUMIDOR_FINAL.names,
      legal_organization_code: CONSUMIDOR_FINAL.legal_organization_code,
      identification_document_code: CONSUMIDOR_FINAL.identification_document_code,
      tribute_code: CONSUMIDOR_FINAL.tribute_code,
      email: emitter.email || undefined,
      address: emitter.address || undefined,
    }
  }

  const isNaturalPerson = form.legal_organization_code === '2'
  const legalName = isNaturalPerson ? form.names.trim() : form.company.trim()

  const base: Omit<FactusCustomer, 'company' | 'names'> = {
    identification_document_code: form.identification_document_code || undefined,
    identification: form.identification.trim() || undefined,
    trade_name: form.trade_name.trim() || undefined,
    address: form.address.trim() || emitter.address || undefined,
    email: form.email.trim() || emitter.email || undefined,
    phone: form.phone.trim() || undefined,
    legal_organization_code: form.legal_organization_code || undefined,
    tribute_code: form.tribute_code || undefined,
    municipality_code:
      form.municipality_country === 'CO'
        ? form.municipality_code.trim() || undefined
        : undefined,
  }

  if (isNaturalPerson) {
    return { ...base, names: legalName || undefined }
  }

  return { ...base, company: legalName || undefined }
}

export function validateCustomFiscalForm(form: FactusCustomerFormInput): string | null {
  if (!hasCustomFiscalData(form)) return null

  if (form.legal_organization_code === '1' && !form.company.trim()) {
    return 'Razón social es obligatoria para Persona Jurídica'
  }

  if (form.legal_organization_code === '2' && !form.names.trim()) {
    return 'El nombre es obligatorio para Persona Natural'
  }

  return null
}

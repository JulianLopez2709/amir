import type { CompanyFactusPublic, FactusCredentialsForm } from '@/@types/settings'
import apiFetch from '../client'

export type PatchFactusPayload = Partial<{
  factusClientId: string
  factusClientSecret: string
  factusUsername: string
  factusPassword: string
  factusNumberingRangeId: number | string | null
  factusPrefix: string | null
}>

export async function patchCompanyFactusSettings(
  companyId: number,
  payload: PatchFactusPayload
) {
  return apiFetch<CompanyFactusPublic>(`company/${companyId}/factus`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  })
}

export async function validateFactusConnection(companyId: number) {
  return apiFetch<unknown>(`factus/numbering-ranges?companyId=${companyId}&document=01`)
}

export function buildFactusPatchPayload(
  form: FactusCredentialsForm,
  isConfigured: boolean
): PatchFactusPayload {
  const payload: PatchFactusPayload = {}

  if (form.factusClientId.trim()) payload.factusClientId = form.factusClientId.trim()
  if (form.factusClientSecret.trim()) payload.factusClientSecret = form.factusClientSecret.trim()
  if (form.factusUsername.trim()) payload.factusUsername = form.factusUsername.trim()
  if (form.factusPassword.trim()) payload.factusPassword = form.factusPassword.trim()

  if (form.factusNumberingRangeId.trim()) {
    payload.factusNumberingRangeId = Number(form.factusNumberingRangeId)
  } else if (!isConfigured) {
    payload.factusNumberingRangeId = null
  }

  payload.factusPrefix = form.factusPrefix.trim() || null

  return payload
}

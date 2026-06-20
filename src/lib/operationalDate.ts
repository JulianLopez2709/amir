import { differenceInCalendarDays, format, subDays } from 'date-fns'

/**
 * Día operativo AMIN (regla de negocio en backend):
 * - Inicia 05:00 AM hora Colombia.
 * - Termina 04:59:59 AM del día siguiente.
 *
 * El frontend NO calcula horas ni zonas horarias.
 * Solo envía etiquetas YYYY-MM-DD; el backend las convierte al rango UTC.
 */

/** Parsea YYYY-MM-DD como fecha de calendario local (solo para UI y aritmética de etiquetas). */
export function parseOperationalDate(dateStr: string): Date {
  const [year, month, day] = dateStr.split('-').map(Number)
  return new Date(year, month - 1, day)
}

/** Convierte una fecha del calendario UI a etiqueta operativa YYYY-MM-DD. */
export function toOperationalDateString(date: Date): string {
  return format(date, 'yyyy-MM-dd')
}

/** Resta días a una etiqueta operativa (sin lógica de hora ni zona horaria). */
export function subtractOperationalDays(dateStr: string, days: number): string {
  return toOperationalDateString(subDays(parseOperationalDate(dateStr), days))
}

export function formatOperationalDateLabel(dateStr: string): string {
  return format(parseOperationalDate(dateStr), 'dd/MM/yyyy')
}

export function formatOperationalDateRangeLabel(from: string, to: string): string {
  return `${formatOperationalDateLabel(from)} - ${formatOperationalDateLabel(to)}`
}

/** Días inclusivos entre dos etiquetas operativas (validación de rango máximo). */
export function operationalDaysInclusive(startDate: string, endDate: string): number {
  return differenceInCalendarDays(parseOperationalDate(endDate), parseOperationalDate(startDate)) + 1
}

type OperationalDateResponse = {
  operationalDate?: string
  operational_date?: string
  appliedStartDate?: string
  appliedEndDate?: string
  applied_start_date?: string
  applied_end_date?: string
  startDate?: string
  endDate?: string
}

/** Extrae el día operativo actual que devuelve el backend. */
export function extractOperationalDateFromResponse(
  response: OperationalDateResponse
): string | undefined {
  const operationalDate = response.operationalDate ?? response.operational_date
  if (typeof operationalDate === 'string' && operationalDate.length > 0) {
    return operationalDate
  }
  return undefined
}

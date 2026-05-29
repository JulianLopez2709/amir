export async function downloadFactusBillPdf(
  billNumber: string,
  companyId: number
): Promise<void> {
  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/'
  const url = `${baseUrl}factus/bills/${encodeURIComponent(billNumber)}/download-pdf?companyId=${companyId}`

  const res = await fetch(url, { credentials: 'include' })

  if (!res.ok) {
    throw new Error(`No se pudo descargar la factura (${res.status})`)
  }

  const blob = await res.blob()
  const blobUrl = URL.createObjectURL(blob)

  const link = document.createElement('a')
  link.href = blobUrl
  link.target = '_blank'
  link.rel = 'noopener noreferrer'
  link.download = `factura-${billNumber}.pdf`
  document.body.appendChild(link)
  link.click()
  link.remove()

  window.setTimeout(() => URL.revokeObjectURL(blobUrl), 60_000)
}

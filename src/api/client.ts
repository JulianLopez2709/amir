export default async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {

  const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";

  const isFormData = options.body instanceof FormData

  const res = await fetch(`${baseUrl}${endpoint}`, {
    credentials: 'include',
    ...options,
    headers: {
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      ...(options.headers || {})
    }
  })

  if (!res.ok) {
    let message = `HTTP error! status: ${res.status}`
    try {
      const body = await res.json()
      if (body?.message) message = body.message
      else if (body?.error) message = String(body.error)
    } catch {
      // ignore parse errors
    }
    throw new Error(message)
  }

  return res.json()
}

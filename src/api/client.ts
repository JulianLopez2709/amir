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
    throw new Error(`HTTP error! status: ${res.status}`)
  }

  return res.json()
}

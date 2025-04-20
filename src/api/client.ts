export default async function apiFetch<T> (endpoint: string, options?: RequestInit): Promise<T> {
    const baseUrl = 'http://localhost:3000/'; // Replace with your actual base URL
    const res = await fetch(`${baseUrl}${endpoint}`, {
        headers: {
            'Content-Type': 'application/json',
            ...(options?.headers || {})
        }
    }
    )

    if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`)
    }
    const data = await res.json()
    return data
}
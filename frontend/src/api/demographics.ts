import type { Country } from './types'

export async function request<T>(path: string): Promise<T> {
    const response = await fetch(path)

    if (!response.ok) {
        throw new Error(`Error ${response.status}`)
    }

    return response.json() as Promise<T>
}

// Ruta relativa: el proxy de Vite la reenvía al backend
export function getCountries() {
    return request<Country[]>('/api/demographics/countries')
}

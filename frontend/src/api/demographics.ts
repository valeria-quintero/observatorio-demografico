import type { ContinentSummary, Country, HistoryRow } from './types'

export async function request<T>(path: string): Promise<T> {
    const response = await fetch(path)

    if (!response.ok) {
        throw new Error(`Error ${response.status}`)
    }

    return response.json() as Promise<T>
}

//ruta relativa: se reenvía al backend
export function getCountries() {
    return request<Country[]>('/api/demographics/countries')
}

export function getHistory(countries: string[]) {
    return request<HistoryRow[]>(`/api/demographics/history?countries=${countries.join(',')}`)
}

export function getContinentSummary() {
    return request<ContinentSummary[]>('/api/demographics/continent-summary')
}
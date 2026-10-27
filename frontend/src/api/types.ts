export interface Country {
    cca3: string,
    name: string,
    capital: string,
    continent: string,
    areaKm2: number,
    density: number,
    growthRate: number,
    worldPercentage: number,
    population: number
}

// Una fila por año: { year: 2020, MEX: 125998302, USA: 335942003 }
export interface HistoryRow {
    year: number
    [cca3: string]: number
}

export interface ContinentSummary {
    continent: string
    population: number
}
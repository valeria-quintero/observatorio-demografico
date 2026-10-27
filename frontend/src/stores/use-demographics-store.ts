import { create } from "zustand"

export type TabId = 'table' | 'ag-grid' | 'charts'

interface DemographicsStore {
    selectedCountries: string[];
    setSelection: (countries: string[]) => void;
    
    activeTab: TabId;
    setActiveTab: (tab: TabId) => void;
    
    toggleCountrySelection: (cca3: string) => void;
}

export const useDemographicsStore = create<DemographicsStore>((set) => ({
    selectedCountries: ['MEX', 'USA', 'BRA'],
    activeTab: 'table',
    setSelection: (countries) => set({ selectedCountries: countries }),
    //si el país ya está seleccionado lo quita, si no lo agrega al final
    toggleCountrySelection: (cca3) =>
        set((state) => ({
            selectedCountries: state.selectedCountries.includes(cca3)
                ? state.selectedCountries.filter((c) => c !== cca3)
                : [...state.selectedCountries, cca3],
        })),
    setActiveTab: (tab) => set({ activeTab: tab }),
}))

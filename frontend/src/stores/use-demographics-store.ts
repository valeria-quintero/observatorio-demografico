import { create } from "zustand"

interface DemographicsStore {
    selectedCountries: string[];
    setSelection: (countries: string[]) => void;
}

export const useDemographicsStore = create<DemographicsStore>((set) => ({
    selectedCountries: ['MEX', 'USA', 'BRA'],
    setSelection: (countries: string[]) => set({ selectedCountries: countries }),
}))

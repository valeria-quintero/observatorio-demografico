import { useQuery } from "@tanstack/react-query";
import { getHistory } from "../api/demographics";
import { useDemographicsStore } from "../stores/use-demographics-store";

export function useHistory() {
    const selectedCountries = useDemographicsStore((state) => state.selectedCountries)

    const query = useQuery({
        //si cambian los países seleccionados, la clave cambia y se pide de nuevo
        queryKey: ['history', selectedCountries],
        queryFn: () => getHistory(selectedCountries),
        //sin países seleccionados no se llama al backend
        enabled: selectedCountries.length > 0,
        staleTime: Infinity,
    })

    return {
        history: query.data,
        isLoading: query.isLoading,
        error: query.error,
    }
}

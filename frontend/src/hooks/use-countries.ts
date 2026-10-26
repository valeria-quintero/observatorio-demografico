import { useQuery } from "@tanstack/react-query";
import { getCountries } from "../api/demographics";

export function useCountries() {
    const query = useQuery({
        queryKey: ['countries'],
        queryFn: getCountries,
        // Los datos casi no cambian: no hace falta volver a pedirlos
        staleTime: Infinity,
    })

    return {
        countries: query.data,
        isLoading: query.isLoading,
        error: query.error,
    }
}

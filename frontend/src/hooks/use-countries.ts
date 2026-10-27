import { useQuery } from "@tanstack/react-query";
import { getCountries } from "../api/demographics";

export function useCountries() {
    const query = useQuery({
        queryKey: ['countries'],
        queryFn: getCountries,
        staleTime: Infinity,
    })

    return {
        countries: query.data,
        isLoading: query.isLoading,
        error: query.error,
    }
}

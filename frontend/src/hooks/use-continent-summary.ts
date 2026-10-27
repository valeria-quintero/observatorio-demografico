import { useQuery } from "@tanstack/react-query";
import { getContinentSummary } from "../api/demographics";

export function useContinentSummary() {
    const query = useQuery({
        queryKey: ['continent-summary'],
        queryFn: getContinentSummary,
        staleTime: Infinity
    })

    return {
        continentSummary: query.data,
        isLoading: query.isLoading,
        error: query.error,
    }
}
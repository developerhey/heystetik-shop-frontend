// ~/features/search/hooks/useFilters.ts
import { useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router";

export function useFilters() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const handleFilter = useCallback(
        (id: string, type: string) => {
            const params = new URLSearchParams(searchParams);

            if (id && params.get(type) !== id) {
                params.set(type, id);
            } else {
                params.delete(type);
            }

            navigate(
                { search: `?${params.toString()}` },
                { replace: true, preventScrollReset: false }
            );
        },
        [searchParams, navigate]
    );

    const handleReset = useCallback(() => {
        navigate({ search: "" }, { replace: true, preventScrollReset: false });
    }, [navigate]);

    return { handleFilter, handleReset };
}

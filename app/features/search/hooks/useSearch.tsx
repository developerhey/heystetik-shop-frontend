import { useState, useCallback, useEffect } from "react";
import { useNavigation, useSearchParams } from "react-router";
import { mapProductListResponseToUI } from "~/shared/schemas/product-mapper";
import type { ProductListUI } from "~/shared/schemas/product-ui-schema";
import { getSkincareList } from "~/shared/services/solution-service";

export const useSearch = ({
    initialSkincareListUI,
    initialHasNextPage,
    initialFilters,
}: {
    initialSkincareListUI: ProductListUI;
    initialHasNextPage: boolean;
    initialFilters: { category?: string; skinType?: string; concern?: string };
}) => {
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [searchParams] = useSearchParams();
    const [moreSkincareList, setMoreSkincareList] = useState<ProductListUI>([]);
    const [page, setPage] = useState(2);
    const [hasNextPage, setHasNextPage] = useState(initialHasNextPage);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setMoreSkincareList([]);
        setPage(2);
        setHasNextPage(initialHasNextPage);
    }, [searchParams.toString(), initialHasNextPage]);

    const fetchSkincareList = useCallback(async () => {
        if (isLoading || !hasNextPage) return;

        setIsLoading(true);
        try {
            const category = searchParams.get("category");
            const skinType = searchParams.get("skinType");
            const concern = searchParams.get("concern");

            const res = await getSkincareList({
                page,
                category: category ? [category] : null,
                display: skinType ? [skinType] : null,
                concern: concern ? [concern] : null,
            });

            setPage((prev) => prev + 1);
            setHasNextPage(res.data?.meta?.hasNextPage ?? false);
            setMoreSkincareList((prev) =>
                prev.concat(mapProductListResponseToUI(res))
            );
        } catch (error) {
            console.error("Failed to fetch more products:", error);
        } finally {
            setIsLoading(false);
        }
    }, [page, hasNextPage, isLoading, searchParams.toString()]);

    const skincareList = [...initialSkincareListUI, ...moreSkincareList];

    return {
        skincareList,
        fetchSkincareList,
        hasNextPage,
        isLoading,
        isFilterOpen,
        setIsFilterOpen,
    };
};

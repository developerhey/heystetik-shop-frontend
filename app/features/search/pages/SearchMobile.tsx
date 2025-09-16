import FilterDrawer from "../components/FilterDrawer";
import { Button } from "~/components/ui/button";
import { SlidersHorizontal } from "lucide-react";
import Product from "~/features/product/components/product";
import type { SearchProps } from ".";
import { useSearch } from "../hooks/useSearch";
import { useSearchParams } from "react-router";
import InfiniteScroll from "react-infinite-scroll-component";
import { useFilters } from "../hooks/useFilters";

export function SearchMobile(props: SearchProps) {
    const [searchParams] = useSearchParams();
    const category = searchParams.get("category");
    const { handleReset } = useFilters();
    const {
        fetchSkincareList,
        hasNextPage,
        skincareList,
        isLoading,
        isFilterOpen,
        setIsFilterOpen,
    } = useSearch({
        initialHasNextPage: props.initialHasNextPage,
        initialSkincareListUI: props.skincareList,
        initialFilters: {
            category: searchParams.get("category") || undefined,
            skinType: searchParams.get("skinType") || undefined,
            concern: searchParams.get("concern") || undefined,
        },
    });

    return (
        <div className="flex flex-col p-4">
            <h1 className="text-sm font-bold text-center bg-primary rounded-md py-12 text-white">
                {category ? category : "Semua Skincare"}
            </h1>
            <div className="mt-4 flex flex-row justify-between items-center">
                <Button
                    className="!font-medium"
                    variant="outline"
                    size={"sm"}
                    onClick={() => {
                        setIsFilterOpen(true);
                    }}
                >
                    <SlidersHorizontal size={12} />
                    Filter
                </Button>
                <span
                    className="text-sm text-gray-700 cursor-pointer"
                    onClick={handleReset}
                >
                    Reset all
                </span>
            </div>
            <FilterDrawer
                open={isFilterOpen}
                onOpenChange={(open) => {
                    setIsFilterOpen(open);
                }}
                categoriesSkinCare={props.categoriesSkinCare}
                concerns={props.concerns}
                skinTypes={props.skinTypes}
            />
            {skincareList.length > 0 ? (
                <InfiniteScroll
                    dataLength={skincareList.length}
                    next={fetchSkincareList}
                    className="w-full grid grid-cols-2 gap-4 my-4"
                    hasMore={hasNextPage && !isLoading}
                    loader={
                        <div className="col-span-4 flex justify-center py-4">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        </div>
                    }
                >
                    {skincareList.map((item, index) => (
                        <Product key={`${item.id}-${index}`} product={item} />
                    ))}
                </InfiniteScroll>
            ) : (
                <div className="text-center mt-11">Belum ada skincare...</div>
            )}
        </div>
    );
}

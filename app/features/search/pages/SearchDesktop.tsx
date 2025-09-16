import Product from "~/features/product/components/product";
import { FilterListDesktop } from "~/features/search/components/filter-list";
import type { SearchProps } from "~/features/search/pages";
import InfiniteScroll from "react-infinite-scroll-component";
import { useSearch } from "../hooks/useSearch";
import { useSearchParams } from "react-router";

export function SearchDesktop(props: SearchProps) {
    const [searchParams] = useSearchParams();
    const category = searchParams.get("category");

    const { fetchSkincareList, hasNextPage, skincareList, isLoading } =
        useSearch({
            initialHasNextPage: props.initialHasNextPage,
            initialSkincareListUI: props.skincareList,
            initialFilters: {
                category: searchParams.get("category") || undefined,
                skinType: searchParams.get("skinType") || undefined,
                concern: searchParams.get("concern") || undefined,
            },
        });

    return (
        <div className="flex flex-col pt-4 pb-8">
            <h1 className="text-2xl font-bold text-center my-4 bg-primary rounded-md mx-54 py-16 text-white">
                {category ? category : "Semua Skincare"}
            </h1>
            <div className="grid grid-cols-[250px_1fr] mt-8 px-54">
                <FilterListDesktop
                    categoriesSkinCare={props.categoriesSkinCare}
                    concerns={props.concerns}
                    skinTypes={props.skinTypes}
                />
                {skincareList.length > 0 ? (
                    <InfiniteScroll
                        dataLength={skincareList.length}
                        next={fetchSkincareList}
                        className="w-full grid grid-cols-4 gap-4 mt-7 p-4"
                        hasMore={hasNextPage && !isLoading}
                        loader={
                            <div className="col-span-4 flex justify-center py-4">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                            </div>
                        }
                    >
                        {skincareList.map((item, index) => (
                            <Product
                                key={`${item.id}-${index}`}
                                product={item}
                            />
                        ))}
                    </InfiniteScroll>
                ) : (
                    <div className="text-center mt-11">
                        Belum ada skincare...
                    </div>
                )}
            </div>
        </div>
    );
}

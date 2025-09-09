import { useState } from "react";
import FilterDrawer from "../components/FilterDrawer";
import { Button } from "~/components/ui/button";
import { SlidersHorizontal } from "lucide-react";
import Product from "~/features/product/components/product";
import type { SearchProps } from ".";

export function SearchMobile({
    categoriesSkinCare,
    concerns,
    skinTypes,
    skincareList,
}: SearchProps) {
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    return (
        <div className="flex flex-col p-4">
            <h1 className="text-sm font-bold text-center bg-primary rounded-md py-12 text-white">
                Product
            </h1>
            <div className="mt-4">
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
            </div>
            <FilterDrawer
                open={isFilterOpen}
                onOpenChange={(open) => {
                    setIsFilterOpen(open);
                }}
                categoriesSkinCare={categoriesSkinCare}
                concerns={concerns}
                skinTypes={skinTypes}
            />
            <section className="w-full grid grid-cols-2 gap-4 my-4">
                {skincareList.map((item, key) => {
                    return <Product key={key} product={item} />;
                })}
            </section>
        </div>
    );
}

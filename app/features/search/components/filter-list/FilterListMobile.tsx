import FilterItemDropdown from "~/features/search/components/FilterItemDropdown";
import type { FilterListProps } from ".";
import { cn } from "~/lib/utils";
import { useFilters } from "~/features/search/hooks/useFilters";

export function FilterListMobile({
    className,
    categoriesSkinCare,
    concerns,
    skinTypes,
}: FilterListProps) {
    const { handleFilter, handleReset } = useFilters();
    return (
        <div className={cn("flex flex-col gap-y-2 px-4", className)}>
            <FilterItemDropdown
                label="Categories"
                type="category"
                items={categoriesSkinCare}
                isOpen={true}
                onSelected={(id) => handleFilter(id, "category")}
            />
            <FilterItemDropdown
                label="Skin Types"
                type="skinType"
                items={skinTypes}
                isOpen={false}
                onSelected={(id) => handleFilter(id, "skinType")}
            />
            <FilterItemDropdown
                type="concern"
                label="Concerns"
                items={concerns}
                isOpen={false}
                onSelected={(id) => handleFilter(id, "concern")}
            />
        </div>
    );
}
